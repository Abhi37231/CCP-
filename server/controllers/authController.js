const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const seedDemoProfile = require('../utils/seedDemoProfile');

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
      user.otp = undefined;
      user.otpExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, error: 'Email could not be sent' });
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

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // --- DEMO PROFILE INJECTION ---
    if (user.email === 'abhinandanyalamante9@gmail.com' && user.role === 'job_seeker') {
      await seedDemoProfile(user._id);
    }
    // ------------------------------

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
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};
