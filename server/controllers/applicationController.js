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

    // Check if custom resume is uploaded, else fallback to profile resume
    let resume = null;
    
    if (req.file) {
      resume = '/uploads/' + req.file.filename;
    } else {
      const profile = await JobSeekerProfile.findOne({ user: userId });
      resume = req.body.resume || (profile ? profile.resume : null);
    }

    if (!resume) {
      return res.status(400).json({ success: false, error: 'A resume is required to apply' });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
      employer: job.employer,
      resume: resume,
      coverLetter: req.body.coverLetter || '',
      status: 'Applied',
      history: [{
        status: 'Applied',
        note: 'Application submitted',
        date: new Date()
      }]
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

    // Build filter query
    let query = { job: req.params.jobId };
    
    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    const sortConfig = req.query.sort || '-createdAt';

    // Get applications
    let applications = await Application.find(query)
      .populate('applicant', 'name email')
      .sort(sortConfig);

    // We also need to fetch JobSeekerProfiles for these applicants
    const applicantIds = applications.map(app => app.applicant._id);
    const profiles = await JobSeekerProfile.find({ user: { $in: applicantIds } });
    
    // Map profiles to applications
    let applicationsWithProfiles = applications.map(app => {
      const appObj = app.toObject();
      appObj.profile = profiles.find(p => p.user.toString() === app.applicant._id.toString()) || null;
      return appObj;
    });

    // Search text in memory (since we populated profiles and users)
    if (req.query.search) {
      const searchStr = req.query.search.toLowerCase();
      applicationsWithProfiles = applicationsWithProfiles.filter(app => {
        const nameMatch = app.applicant.name?.toLowerCase().includes(searchStr);
        const emailMatch = app.applicant.email?.toLowerCase().includes(searchStr);
        const skillMatch = app.profile?.skills?.programmingLanguages?.some(s => s.name.toLowerCase().includes(searchStr)) ||
                           app.profile?.skills?.frameworks?.some(s => s.name.toLowerCase().includes(searchStr));
        return nameMatch || emailMatch || skillMatch;
      });
    }

    res.status(200).json({
      success: true,
      count: applicationsWithProfiles.length,
      data: applicationsWithProfiles
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private (Employer)
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email')
      .populate({
        path: 'job',
        select: 'title company'
      });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Verify ownership
    if (application.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to view this application' });
    }

    const profile = await JobSeekerProfile.findOne({ user: application.applicant._id });
    
    const data = application.toObject();
    data.profile = profile;

    res.status(200).json({ success: true, data });
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
    application.history.push({
      status: status,
      note: `Status updated to ${status}`,
      date: new Date()
    });
    
    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Bulk update application status
// @route   PUT /api/applications/bulk-status
// @access  Private (Employer)
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { applicationIds, status } = req.body;
    
    if (!applicationIds || !applicationIds.length) {
      return res.status(400).json({ success: false, error: 'No applications selected' });
    }

    // We need to fetch them to verify ownership and push history
    const applications = await Application.find({ _id: { $in: applicationIds } });
    
    const updatePromises = applications.map(async (app) => {
      if (app.employer.toString() === req.user.id || req.user.role === 'admin') {
        app.status = status;
        app.history.push({
          status: status,
          note: `Bulk status update to ${status}`,
          date: new Date()
        });
        return app.save();
      }
      return Promise.resolve();
    });

    await Promise.all(updatePromises);

    res.status(200).json({ success: true, message: 'Applications updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update recruiter notes
// @route   PUT /api/applications/:id/notes
// @access  Private (Employer)
exports.updateApplicationNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (application.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    application.recruiterNotes = notes;
    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update applicant rating
// @route   PUT /api/applications/:id/rating
// @access  Private (Employer)
exports.updateApplicationRating = async (req, res) => {
  try {
    const { rating } = req.body;
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (application.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    application.rating = rating;
    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Schedule interview
// @route   PUT /api/applications/:id/interview
// @access  Private (Employer)
exports.scheduleInterview = async (req, res) => {
  try {
    const { date, time, type, link, location, notes } = req.body;
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (application.employer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    application.interview = { date, time, type, link, location, notes };
    application.status = 'Interview Scheduled';
    application.history.push({
      status: 'Interview Scheduled',
      note: `Interview scheduled on ${new Date(date).toLocaleDateString()} at ${time}`,
      date: new Date()
    });

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
    const shortlisted = await Application.countDocuments({ employer: employerId, status: { $in: ['Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected'] } });
    const interviews = await Application.countDocuments({ employer: employerId, status: { $in: ['Interview Scheduled', 'Interviewing'] } });

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

// @desc    Withdraw/Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Job Seeker / Employee)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Verify ownership
    if (application.applicant.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this application' });
    }

    await application.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
