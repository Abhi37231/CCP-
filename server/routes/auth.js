const express = require('express');
const { register, login, getMe, logout, verifyOtp, forgotPassword, resetPassword, updatePassword, updateNotifications } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.put('/updatepassword', protect, updatePassword);
router.put('/notifications', protect, updateNotifications);

module.exports = router;
