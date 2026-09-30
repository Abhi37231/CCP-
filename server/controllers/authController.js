const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const OtpVerification = require('../models/OtpVerification');
const Company = require('../models/Company');

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Set your desired expiry
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
    options.sameSite = 'none';
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        experienceLevel: user.experienceLevel,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
};

// @desc    Register user (Initiate OTP flow)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, experienceLevel } = req.body;

    // Validate role
    if (role && role === 'admin') {
      return res.status(400).json({ success: false, error: 'Cannot register as admin' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ success: false, error: 'Email already exists and is verified' });
    }

    if (user && !user.isVerified) {
       // If exists but not verified, we can just update the password and resend OTP
       user.name = name;
       user.password = password;
       user.role = role || 'job_seeker';
       user.experienceLevel = experienceLevel || 'fresher';
    } else {
       // Create new unverified user
       user = new User({
        name,
        email,
        password,
        role: role || 'job_seeker',
        experienceLevel: experienceLevel || 'fresher',
        isVerified: false
      });
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via email
    const message = `Your verification code is: ${otp}. It is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Career Connect - Registration OTP',
        message
      });

      res.status(200).json({ success: true, data: 'OTP sent to email', email: user.email });
    } catch (err) {
      console.error('Registration Email Error:', err);
      user.otp = undefined;
      user.otpExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, error: 'Email could not be sent: ' + err.message });
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Verify OTP and log user in
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Please provide email and OTP' });
    }

    // Hash the OTP from the request to compare with DB
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      email,
      otp: hashedOtp,
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, data: 'Email verified successfully. Please log in.' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
       return res.status(401).json({ success: false, error: 'Please verify your email first', isVerified: false, email: user.email });
    }

    if (user.status === 'blocked') {
        return res.status(403).json({ success: false, error: 'Your account has been blocked by the administrator.' });
    }

    if (user.status === 'suspended') {
        return res.status(403).json({ success: false, error: 'Your account is temporarily suspended.' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  const options = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
    options.sameSite = 'none';
  }

  res.cookie('token', 'none', options);

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Please provide both current and new password' });
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/auth/notifications
// @access  Private
exports.updateNotifications = async (req, res) => {
  try {
    const { emailAlerts, pushNotifications, jobAlerts } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.notificationPreferences = {
      emailAlerts: emailAlerts !== undefined ? emailAlerts : user.notificationPreferences?.emailAlerts,
      pushNotifications: pushNotifications !== undefined ? pushNotifications : user.notificationPreferences?.pushNotifications,
      jobAlerts: jobAlerts !== undefined ? jobAlerts : user.notificationPreferences?.jobAlerts
    };

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'There is no user with that email' });
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });

    const message = `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Career Connect - Password Reset OTP',
        message
      });

      res.status(200).json({ success: true, data: 'OTP sent to email' });
    } catch (err) {
      console.error('Forgot Password Email Error:', err);
      user.otp = undefined;
      user.otpExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, error: 'Email could not be sent: ' + err.message });
    }
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email, OTP, and new password' });
    }

    // Hash the OTP from the request to compare with DB
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      email,
      otp: hashedOtp,
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    // Set new password
    user.password = password;
    user.otp = undefined;
    user.otpExpire = undefined;
    
    // Also verify if they were unverified previously (optional safety measure)
    if (!user.isVerified) {
       user.isVerified = true;
    }

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Send OTP to employer email (Pre-registration)
// @route   POST /api/auth/send-employer-otp
// @access  Public
exports.sendEmployerOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide an email' });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    // Generate a 6 digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Delete any existing OTPs for this email
    await OtpVerification.deleteMany({ email });

    // Save new OTP
    await OtpVerification.create({
      email,
      otp: hashedOtp
    });

    const message = `Your official email verification OTP is: ${otp}. It is valid for 10 minutes.`;

    try {
      await sendEmail({
        email,
        subject: 'Career Connect - Verify Official Email',
        message
      });

      res.status(200).json({ success: true, data: 'OTP sent to email', email });
    } catch (err) {
      console.error('Send Employer OTP Error:', err);
      await OtpVerification.deleteMany({ email });
      return res.status(500).json({ success: false, error: 'Email could not be sent: ' + err.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Register a verified employer (Creates User and Company)
// @route   POST /api/auth/register-employer
// @access  Public
exports.registerEmployer = async (req, res) => {
  try {
    const { 
      recruiterInfo, 
      companyInfo, 
      otp 
    } = req.body;

    if (!recruiterInfo || !companyInfo || !otp) {
      return res.status(400).json({ success: false, error: 'Please provide recruiter info, company info, and OTP' });
    }

    const { name, email, password, phone } = recruiterInfo;
    const { 
      companyName, 
      website, 
      cin, 
      gstin, 
      companyEmail, 
      companyType,
      verification 
    } = companyInfo;

    // Verify OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const otpRecord = await OtpVerification.findOne({
      email,
      otp: hashedOtp
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    // Check for existing User
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    // Check for existing Company CIN
    if (cin) {
        const existingCompany = await Company.findOne({ cin });
        if (existingCompany) {
            return res.status(400).json({ success: false, error: 'A company with this CIN is already registered.' });
        }
    }

    // Create or Update User
    if (user) {
        user.name = name;
        user.password = password;
        user.phone = phone;
        user.role = 'employer';
        user.isVerified = true;
        user.emailVerification = {
            verified: true,
            verifiedAt: Date.now()
        };
        user.companyEmailDomainVerified = true; // Assuming domain checked in frontend
        await user.save();
    } else {
        user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'employer',
            isVerified: true,
            emailVerification: {
                verified: true,
                verifiedAt: Date.now()
            },
            companyEmailDomainVerified: true
        });
    }

    // Delete OTP
    await OtpVerification.deleteOne({ _id: otpRecord._id });

    // Create Company
    const company = await Company.create({
        employer: user._id,
        name: companyName,
        website,
        cin,
        gstin,
        companyEmail,
        companyType,
        description: 'New verified company registration', // default temp description
        industry: 'Other', // default temp industry
        verification: {
            status: verification?.status || 'VERIFIED',
            source: verification?.source || 'Data.gov.in',
            verified: verification?.verified || true,
            verifiedAt: Date.now(),
            governmentData: verification?.governmentData || {}
        },
        isVerified: verification?.verified || false
    });

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
