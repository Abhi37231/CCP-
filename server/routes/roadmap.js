const express = require('express');
const router = express.Router();
const { generateRoadmap, getRoadmap, updateProgress } = require('../controllers/roadmapController');
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all roadmap routes
router.use(protect);
router.use(authorize('job_seeker'));

// Generate a new roadmap
router.post('/generate', generateRoadmap);

// Get the latest roadmap for the user
router.get('/', getRoadmap);

// Update progress of the roadmap
router.put('/progress', updateProgress);

module.exports = router;
