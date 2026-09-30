const express = require('express');
const { register, login, getMe, logout, verifyOtp, forgotPassword, resetPassword, updatePassword, updateNotifications, sendEmployerOtp, registerEmployer, updateDetails } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/send-employer-otp', sendEmployerOtp);
router.post('/register-employer', registerEmployer);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.put('/updatepassword', protect, updatePassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/notifications', protect, updateNotifications);

module.exports = router;
