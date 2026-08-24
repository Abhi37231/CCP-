const express = require('express');
const {
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
  getApplicationStats,
  getMyApplications,
  getApplicationById,
  bulkUpdateStatus,
  updateApplicationNotes,
  updateApplicationRating,
  scheduleInterview,
  deleteApplication,
  getEmployerInterviews
} = require('../controllers/applicationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Employer routes
router.get('/stats', protect, authorize('employer', 'admin'), getApplicationStats);
router.get('/employer/interviews', protect, authorize('employer', 'admin'), getEmployerInterviews);
router.get('/job/:jobId', protect, authorize('employer', 'admin'), getJobApplications);

// Bulk updates must come before /:id routes
router.put('/bulk-status', protect, authorize('employer', 'admin'), bulkUpdateStatus);

const upload = require('../middleware/upload');

// Job Seeker / Employee routes
router.post('/:jobId', protect, authorize('job_seeker', 'employee'), upload.single('resume'), applyForJob);
router.get('/me', protect, authorize('job_seeker', 'employee'), getMyApplications);
router.delete('/:id', protect, authorize('job_seeker', 'employee'), deleteApplication);

router.get('/:id', protect, authorize('employer', 'admin'), getApplicationById);
router.put('/:id/status', protect, authorize('employer', 'admin'), updateApplicationStatus);
router.put('/:id/notes', protect, authorize('employer', 'admin'), updateApplicationNotes);
router.put('/:id/rating', protect, authorize('employer', 'admin'), updateApplicationRating);
router.put('/:id/interview', protect, authorize('employer', 'admin'), scheduleInterview);

module.exports = router;
