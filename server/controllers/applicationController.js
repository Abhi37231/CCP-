const Application = require('../models/Application');
const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

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
    const { status, feedback } = req.body;
    let application = await Application.findById(req.params.id)
      .populate('applicant', 'name email')
      .populate('job', 'title');

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

    // Send notification
    await Notification.create({
      recipient: application.applicant._id,
      type: 'application_status',
      title: 'Application Status Updated',
      message: `Your application status for ${application.job.title} has been updated to ${status}.`,
      relatedApplication: application._id
    });

    // Send email
    try {
      let subject = `Application Status Updated: ${application.job.title}`;
      let messageBody = `Hello ${application.applicant.name},\n\nYour application status for the position of ${application.job.title} has been updated to: ${status}.`;
      let htmlBody = null;

      if (status === 'Selected') {
        subject = `Application Update: Selected for ${application.job.title}`;
        messageBody = `Hello ${application.applicant.name},\n\nWe are pleased to inform you that you have been selected for the position of ${application.job.title}.\n\nOur team was very impressed with your background and skills.`;
        
        htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <div style="background-color: #4FDBCE; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Congratulations, ${application.applicant.name}!</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
            <p style="font-size: 16px;">We are absolutely thrilled to inform you that you have been <strong>selected</strong> for the position of <strong>${application.job.title}</strong>!</p>
            <p style="font-size: 16px;">Our team was extremely impressed with your background, skills, and the passion you showed throughout the process. We believe you will be a fantastic addition to our team and we can't wait to see the impact you'll make.</p>
            ${feedback ? `<div style="background-color: #f9f9fa; border-left: 4px solid #D0BCFF; padding: 15px; margin: 20px 0; font-style: italic; color: #555;"><strong>Message from the hiring team:</strong><br/>"${feedback}"</div>` : `<p style="font-size: 16px;">We will be in touch shortly with the official offer details and next steps.</p>`}
            <p style="font-size: 16px;">Welcome aboard in advance! We are so excited to have you join us.</p>
            <br/>
            <p style="font-size: 16px; margin-bottom: 0;">Warm regards,</p>
            <p style="font-size: 16px; font-weight: bold; margin-top: 5px;">The Career Connect Team</p>
          </div>
        </div>
        `;

        if (feedback) {
          messageBody += `\n\nMessage from the hiring team:\n"${feedback}"\n`;
        } else {
          messageBody += ` We will be in touch shortly with the next steps regarding your offer.\n`;
        }
        messageBody += `\nWelcome aboard in advance!`;
      } else if (status === 'Rejected') {
        subject = `Update regarding your application for ${application.job.title}`;
        messageBody = `Hello ${application.applicant.name},\n\nThank you for taking the time to apply for the ${application.job.title} position.\n\nAfter careful consideration, we have decided to move forward with other candidates whose qualifications better meet our current needs.`;
        
        if (feedback) {
          messageBody += `\n\nFeedback from the hiring team:\n"${feedback}"`;
        }
      }

      messageBody += `\n\nThank you,\nCareer Connect Team`;

      await sendEmail({
        email: application.applicant.email,
        subject: subject,
        message: messageBody,
        html: htmlBody
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }

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
    const { applicationIds, status, feedback } = req.body;
    
    if (!applicationIds || !applicationIds.length) {
      return res.status(400).json({ success: false, error: 'No applications selected' });
    }

    // We need to fetch them to verify ownership and push history
    const applications = await Application.find({ _id: { $in: applicationIds } })
      .populate('applicant', 'name email')
      .populate('job', 'title');
    
    const updatePromises = applications.map(async (app) => {
      if (app.employer.toString() === req.user.id || req.user.role === 'admin') {
        app.status = status;
        app.history.push({
          status: status,
          note: `Bulk status update to ${status}`,
          date: new Date()
        });
        await app.save();

        await Notification.create({
          recipient: app.applicant._id,
          type: 'application_status',
          title: 'Application Status Updated',
          message: `Your application status for ${app.job.title} has been updated to ${status}.`,
          relatedApplication: app._id
        });

        try {
          let subject = `Application Status Updated: ${app.job.title}`;
          let messageBody = `Hello ${app.applicant.name},\n\nYour application status for the position of ${app.job.title} has been updated to: ${status}.`;
          let htmlBody = null;

          if (status === 'Selected') {
            subject = `Application Update: Selected for ${app.job.title}`;
            messageBody = `Hello ${app.applicant.name},\n\nWe are pleased to inform you that you have been selected for the position of ${app.job.title}.\n\nOur team was very impressed with your background and skills.`;
            
            htmlBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
              <div style="background-color: #4FDBCE; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Congratulations, ${app.applicant.name}!</h1>
              </div>
              <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
                <p style="font-size: 16px;">We are absolutely thrilled to inform you that you have been <strong>selected</strong> for the position of <strong>${app.job.title}</strong>!</p>
                <p style="font-size: 16px;">Our team was extremely impressed with your background, skills, and the passion you showed throughout the process. We believe you will be a fantastic addition to our team and we can't wait to see the impact you'll make.</p>
                ${feedback ? `<div style="background-color: #f9f9fa; border-left: 4px solid #D0BCFF; padding: 15px; margin: 20px 0; font-style: italic; color: #555;"><strong>Message from the hiring team:</strong><br/>"${feedback}"</div>` : `<p style="font-size: 16px;">We will be in touch shortly with the official offer details and next steps.</p>`}
                <p style="font-size: 16px;">Welcome aboard in advance! We are so excited to have you join us.</p>
                <br/>
                <p style="font-size: 16px; margin-bottom: 0;">Warm regards,</p>
                <p style="font-size: 16px; font-weight: bold; margin-top: 5px;">The Career Connect Team</p>
              </div>
            </div>
            `;

            if (feedback) {
              messageBody += `\n\nMessage from the hiring team:\n"${feedback}"\n`;
            } else {
              messageBody += ` We will be in touch shortly with the next steps regarding your offer.\n`;
            }
            messageBody += `\nWelcome aboard in advance!`;
          } else if (status === 'Rejected') {
            subject = `Update regarding your application for ${app.job.title}`;
            messageBody = `Hello ${app.applicant.name},\n\nThank you for taking the time to apply for the ${app.job.title} position.\n\nAfter careful consideration, we have decided to move forward with other candidates whose qualifications better meet our current needs.`;
            
            if (feedback) {
              messageBody += `\n\nFeedback from the hiring team:\n"${feedback}"`;
            }
          }

          messageBody += `\n\nThank you,\nCareer Connect Team`;

          await sendEmail({
            email: app.applicant.email,
            subject: subject,
            message: messageBody,
            html: htmlBody
          });
        } catch (error) {
          console.error('Email sending failed:', error);
        }

        return app;
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
    let application = await Application.findById(req.params.id)
      .populate('applicant', 'name email')
      .populate('job', 'title');

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

    await Notification.create({
      recipient: application.applicant._id,
      type: 'interview_scheduled',
      title: 'Interview Scheduled',
      message: `An interview has been scheduled for your application to ${application.job.title}.`,
      relatedApplication: application._id
    });

    try {
      await sendEmail({
        email: application.applicant.email,
        subject: `Interview Scheduled: ${application.job.title}`,
        message: `Hello ${application.applicant.name},\n\nAn interview has been scheduled for your application to the position of ${application.job.title}.\n\nDate: ${new Date(date).toLocaleDateString()}\nTime: ${time}\nType: ${type}\nLocation/Link: ${type === 'Online' ? link : location}\nNotes: ${notes || 'None'}\n\nGood luck,\nCareer Connect Team`
      });
    } catch (error) {
      console.error('Email sending failed:', error);
    }

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
