const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['admin', 'employer', 'job_seeker'],
    default: 'job_seeker',
  },
  experienceLevel: {
    type: String,
    enum: ['fresher', 'experienced'],
    default: 'fresher',
  },
  avatar: {
    type: String,
    default: 'default-avatar.png' // Default avatar placeholder
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  notificationPreferences: {
    emailAlerts: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    jobAlerts: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Encrypt password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash OTP
userSchema.methods.generateOTP = function() {
  // Generate a 6 digit random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash it and set to otp field
  this.otp = crypto.createHash('sha256').update(otp).digest('hex');

  // Set expire time to 10 minutes
  this.otpExpire = Date.now() + 10 * 60 * 1000;

  return otp; // Return unhashed OTP to send via email
};

module.exports = mongoose.model('User', userSchema);
