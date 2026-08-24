const JobSeekerProfile = require('../models/JobSeekerProfile');
const Company = require('../models/Company');
const User = require('../models/User');
const fs = require('fs');

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    let profile;
    
    if (req.user.role === 'job_seeker') {
      profile = await JobSeekerProfile.findOne({ user: req.user.id }).populate('user', ['name', 'email', 'avatar']);
    } else if (req.user.role === 'employer') {
      profile = await Company.findOne({ employer: req.user.id }).populate('employer', ['name', 'email', 'avatar']);
    } else if (req.user.role === 'admin') {
      return res.status(200).json({ success: true, data: { message: 'Admin profile not supported' } });
    }

    if (!profile) {
      return res.status(200).json({ success: true, data: null });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { role, id } = req.user;
    let profileData = { ...req.body };

    // Parse JSON strings in profileData (for FormData containing objects/arrays)
    for (let key in profileData) {
      if (typeof profileData[key] === 'string' && (profileData[key].startsWith('{') || profileData[key].startsWith('['))) {
        try {
          profileData[key] = JSON.parse(profileData[key]);
        } catch (e) {
          // If it fails to parse, just leave it as is
        }
      }
    }

    if (role === 'job_seeker') {
      profileData.user = id;
      
      let profile = await JobSeekerProfile.findOne({ user: id });
      let mergedData = profile ? { ...profile.toObject(), ...profileData } : { ...profileData };

      // Handle file uploads
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          if (file.fieldname === 'resume') {
            profileData.resume = `/uploads/${file.filename}`;
            mergedData.resume = profileData.resume;
          } else if (file.fieldname === 'profilePhoto') {
            profileData.personalInfo = profileData.personalInfo || {};
            profileData.personalInfo.profilePhoto = `/uploads/${file.filename}`;
            
            // Sync with User avatar so it shows up everywhere (navbar, dashboard, employer views)
            req.user.avatar = `/uploads/${file.filename}`;
            
            // If we are updating personalInfo with a photo, we need to make sure we don't overwrite 
            // the rest of personalInfo if it's not provided in the request body.
            if (profile && profile.personalInfo && !req.body.personalInfo) {
               profileData.personalInfo = { ...profile.personalInfo.toObject(), ...profileData.personalInfo };
            }
            mergedData.personalInfo = { ...(mergedData.personalInfo || {}), ...profileData.personalInfo };
          }
        });
        
        // Save the updated avatar to the User model if it was changed
        if (req.user.avatar && req.user.avatar.includes('/uploads/')) {
          const User = require('../models/User');
          await User.findByIdAndUpdate(req.user.id, { avatar: req.user.avatar });
        }
      }

      // Calculate completion percentage loosely
      let filledSections = 0;
      let totalSections = 12; // Base sections
      if (mergedData.personalInfo && mergedData.personalInfo.firstName) filledSections++;
      if (mergedData.about) filledSections++;
      if (mergedData.education && mergedData.education.length > 0) filledSections++;
      if (mergedData.skills && Object.keys(mergedData.skills).length > 0) filledSections++;
      if (mergedData.projects && mergedData.projects.length > 0) filledSections++;
      if (mergedData.internships && mergedData.internships.length > 0) filledSections++;
      if (mergedData.experience && mergedData.experience.length > 0) filledSections++;
      if (mergedData.certifications && mergedData.certifications.length > 0) filledSections++;
      if (mergedData.achievements && Object.keys(mergedData.achievements).some(k => mergedData.achievements[k] && mergedData.achievements[k].length > 0)) filledSections++;
      if (mergedData.codingProfiles && Object.keys(mergedData.codingProfiles).some(k => mergedData.codingProfiles[k])) filledSections++;
      if (mergedData.languagesKnown && mergedData.languagesKnown.length > 0) filledSections++;
      if (mergedData.resume) filledSections++;
      
      profileData.profileCompletion = Math.round((filledSections / totalSections) * 100);
      if (profileData.profileCompletion > 100) profileData.profileCompletion = 100;

      if (profile) {
        // We do not delete old files here to avoid complexities if multiple are updated, 
        // though in production we should cleanup old resume/photo.
        profile = await JobSeekerProfile.findOneAndUpdate(
          { user: id },
          { $set: profileData },
          { new: true, runValidators: true }
        );
      } else {
        profile = await JobSeekerProfile.create(profileData);
      }
      return res.status(200).json({ success: true, data: profile });

    } else if (role === 'employer') {
      profileData.employer = id;

      // Handle file upload (logo)
      if (req.files && req.files.length > 0) {
        const logoFile = req.files.find(f => f.fieldname === 'logo' || f.fieldname === 'file');
        if (logoFile) {
          profileData.logo = `/uploads/${logoFile.filename}`;
        }
      }

      let company = await Company.findOne({ employer: id });
      if (company) {
        company = await Company.findOneAndUpdate(
          { employer: id },
          { $set: profileData },
          { new: true, runValidators: true }
        );
      } else {
        company = await Company.create(profileData);
      }
      return res.status(200).json({ success: true, data: company });
    }

    res.status(400).json({ success: false, error: 'Invalid user role' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Toggle save job
// @route   POST /api/profile/save-job/:jobId
// @access  Private (Job Seeker)
exports.toggleSaveJob = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ success: false, message: 'Not authorized to save jobs' });
    }
    const profile = await JobSeekerProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    
    const jobId = req.params.jobId;
    const isSaved = profile.savedJobs && profile.savedJobs.includes(jobId);
    
    if (isSaved) {
      profile.savedJobs = profile.savedJobs.filter(id => id.toString() !== jobId.toString());
    } else {
      if (!profile.savedJobs) profile.savedJobs = [];
      profile.savedJobs.push(jobId);
    }
    
    await profile.save();
    
    res.status(200).json({ success: true, data: profile.savedJobs });
  } catch (error) {
    console.error('Save Job Error:', error);
    res.status(500).json({ success: false, message: 'Server error while saving job' });
  }
};
 
// @desc    Get saved jobs
// @route   GET /api/profile/saved-jobs
// @access  Private (Job Seeker)
exports.getSavedJobs = async (req, res) => {
  try {
    if (req.user.role !== 'job_seeker') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const profile = await JobSeekerProfile.findOne({ user: req.user.id }).populate({
      path: 'savedJobs',
      populate: { path: 'company', select: 'name logo' }
    });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, data: profile.savedJobs || [] });
  } catch (error) {
    console.error('Get Saved Jobs Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};