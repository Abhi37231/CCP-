const Application = require('../models/Application');
const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Job Seeker / Employee)
exports.applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return res.status(400).json({ success: false, error: 'You have already applied for this job' });
    }

    // Optionally get user's profile to extract resume if not provided
    const profile = await JobSeekerProfile.findOne({ user: userId });
    const resume = req.body.resume || (profile ? profile.resume : null);

    if (!resume) {
      return res.status(400).json({ success: false, error: 'A resume is required to apply' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
      employer: job.employer,
      resume: resume,
      coverLetter: req.body.coverLetter || ''
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    if (err.code === 11000) {
       return res.status(400).json({ success: false, error: 'You have already applied for this job' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Verify ownership
    if (job.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email')
      .sort('-createdAt');

    // We also need to fetch JobSeekerProfiles for these applicants to display their skills and details
    const applicantIds = applications.map(app => app.applicant._id);
    const profiles = await JobSeekerProfile.find({ user: { $in: applicantIds } });
    
    // Map profiles to applications
    const applicationsWithProfiles = applications.map(app => {
      const appObj = app.toObject();
      appObj.profile = profiles.find(p => p.user.toString() === app.applicant._id.toString()) || null;
      return appObj;
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applicationsWithProfiles
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Verify ownership
    if (application.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get dashboard stats for employer
// @route   GET /api/applications/stats
// @access  Private (Employer)
exports.getApplicationStats = async (req, res) => {
  try {
    const employerId = req.user.id;

    const totalApplicants = await Application.countDocuments({ employer: employerId });
    const shortlisted = await Application.countDocuments({ employer: employerId, status: 'Shortlisted' });
    const interviews = await Application.countDocuments({ employer: employerId, status: 'Interviewing' });

    res.status(200).json({
      success: true,
      data: {
        totalApplicants,
        shortlisted,
        interviews
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get my applications
// @route   GET /api/applications/me
// @access  Private (Job Seeker / Employee)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
         path: 'job',
         populate: {
            path: 'company',
            select: 'name logo'
         }
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
