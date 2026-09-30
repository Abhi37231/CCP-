const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const Category = require('../models/Category');
const Notification = require('../models/Notification');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalJobSeekers = await User.countDocuments({ role: 'job_seeker' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();
    const totalCompanies = await Company.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalEmployers,
        totalJobSeekers,
        totalJobs,
        activeJobs,
        totalApplications,
        totalCompanies
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.role === 'admin') {
       return res.status(400).json({ success: false, error: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'name email').populate('company', 'name').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    await Job.findByIdAndDelete(req.params.id);
    
    // Also remove applications associated with this job
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get recent activity
// @route   GET /api/admin/activity
// @access  Private/Admin
exports.getRecentActivity = async (req, res) => {
  try {
    const recentUsers = await User.find({ role: { $ne: 'admin' } }).select('name email role createdAt').sort({ createdAt: -1 }).limit(10);
    const recentJobs = await Job.find().select('title company createdAt').populate('company', 'name').sort({ createdAt: -1 }).limit(10);
    const recentCompanies = await Company.find().select('name status createdAt').sort({ createdAt: -1 }).limit(10);

    // Format them into a single timeline feed
    const activity = [
      ...recentUsers.map(u => ({ type: 'user', title: `New ${u.role} registered: ${u.name}`, date: u.createdAt })),
      ...recentJobs.map(j => ({ type: 'job', title: `New job posted: ${j.title} by ${j.company?.name}`, date: j.createdAt })),
      ...recentCompanies.map(c => ({ type: 'company', title: `New company registered: ${c.name}`, date: c.createdAt }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);

    res.status(200).json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update user status / verification
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { status, isVerified } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, error: 'Cannot modify admin' });

    if (status) user.status = status;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all companies
// @route   GET /api/admin/companies
// @access  Private/Admin
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('employer', 'name email phone').populate('hrs', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: companies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create new company (and employer user)
// @route   POST /api/admin/companies
// @access  Private/Admin
exports.createCompany = async (req, res) => {
  try {
    const { employerName, employerEmail, employerPhone, employerPassword, companyName, cin, gstin, companyType, companyEmail, industry, size, website, description } = req.body;

    // Check if employer email already exists
    let user = await User.findOne({ email: employerEmail });
    if (user) {
      return res.status(400).json({ success: false, error: 'A user with this email already exists' });
    }

    // Create the employer user
    user = await User.create({
      name: employerName,
      email: employerEmail,
      phone: employerPhone,
      password: employerPassword,
      role: 'employer',
      isVerified: true,
      status: 'active'
    });

    // Create the company
    const company = await Company.create({
      employer: user._id,
      name: companyName,
      cin,
      gstin,
      companyType,
      companyEmail,
      industry,
      size,
      website,
      description,
      status: 'approved',
      isVerified: true,
      verification: {
        status: 'VERIFIED',
        source: 'Admin Creation',
        verified: true,
        verifiedAt: new Date()
      }
    });

    res.status(201).json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add HR to company
// @route   POST /api/admin/companies/:id/hr
// @access  Private/Admin
exports.addCompanyHR = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'A user with this email already exists' });
    }

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'employer',
      isVerified: true,
      status: 'active'
    });

    company.hrs.push(user._id);
    await company.save();

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update company status
// @route   PUT /api/admin/companies/:id/status
// @access  Private/Admin
exports.updateCompanyStatus = async (req, res) => {
  try {
    const { status, isVerified } = req.body;
    const company = await Company.findById(req.params.id);

    if (!company) return res.status(404).json({ success: false, error: 'Company not found' });

    if (status) company.status = status;
    if (isVerified !== undefined) company.isVerified = isVerified;

    await company.save();

    // Automatically block the employer if the company is rejected, and unblock them if approved/pending
    if (status === 'rejected' && company.employer) {
      await User.findByIdAndUpdate(company.employer, { status: 'blocked' });
    } else if ((status === 'approved' || status === 'pending') && company.employer) {
      await User.findByIdAndUpdate(company.employer, { status: 'active' });
    }

    res.status(200).json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update company details
// @route   PUT /api/admin/companies/:id
// @access  Private/Admin
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    res.status(200).json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete company
// @route   DELETE /api/admin/companies/:id
// @access  Private/Admin
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    await Company.findByIdAndDelete(req.params.id);

    // Note: In a real app, you might also want to delete all Jobs associated with this company
    // await Job.deleteMany({ company: req.params.id });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update job moderation
// @route   PUT /api/admin/jobs/:id/moderate
// @access  Private/Admin
exports.updateJobModeration = async (req, res) => {
  try {
    const { isActive, isFeatured } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ success: false, error: 'Job not found' });

    if (isActive !== undefined) job.isActive = isActive;
    if (isFeatured !== undefined) job.isFeatured = isFeatured;

    await job.save();
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Broadcast Notification
// @route   POST /api/admin/notifications/broadcast
// @access  Private/Admin
exports.broadcastNotification = async (req, res) => {
  try {
    const { targetAudience, title, message, link } = req.body;
    
    let query = { role: { $ne: 'admin' } };
    if (targetAudience === 'employers') query.role = 'employer';
    if (targetAudience === 'job_seekers') query.role = 'job_seeker';

    const users = await User.find(query).select('_id');
    const userIds = users.map(u => u._id);

    const notifications = userIds.map(recipient => ({
      recipient,
      type: 'system',
      title,
      message,
      link
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({ success: true, data: `Notification sent to ${notifications.length} users` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
