const express = require('express');
const router = express.Router();
const multer = require('multer');
const atsController = require('../controllers/atsController');

// Configure multer for memory storage (we don't need to persist resumes)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  }
});

// Middleware to handle multer errors gracefully
const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single('resume');
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, message: 'File is too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: 'Upload failed: ' + err.message });
    }
    next();
  });
};

// @route   POST /api/ats/analyze
// @desc    Analyze a resume against a job description
// @access  Public (or protected if desired by the application later)
router.post('/analyze', handleUpload, atsController.analyzeResume);

module.exports = router;
