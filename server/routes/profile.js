const express = require('express');
const { getProfile, createOrUpdateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router
  .route('/')
  .get(protect, getProfile)
  // Using upload.any() to handle arbitrary files (resume, profilePhoto, certificates, etc.)
  .post(protect, upload.any(), createOrUpdateProfile); 

module.exports = router;
