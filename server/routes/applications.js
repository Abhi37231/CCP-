const express = require('express');
const {
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
  getApplicationStats,
  getMyApplications
} = require('../controllers/applicationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Employer routes
router.get('/stats', protect, authorize('employer', 'admin'), getApplicationStats);
router.get('/job/:jobId', protect, authorize('employer', 'admin'), getJobApplications);
router.put('/:id/status', protect, authorize('employer', 'admin'), updateApplicationStatus);

// Job Seeker / Employee routes
router.post('/:jobId', protect, authorize('job_seeker', 'employee'), applyForJob);
router.get('/me', protect, authorize('job_seeker', 'employee'), getMyApplications);

module.exports = router;
