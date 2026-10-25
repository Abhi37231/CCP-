const Notification = require('../models/Notification');
const { sendSavedJobReminders } = require('../services/jobReminderService');

// @desc    Trigger saved job reminder scan
// @route   POST /api/notifications/cron/saved-job-reminders
// @route   GET /api/notifications/cron/saved-job-reminders
// @access  Protected by CRON_SECRET or Admin user
exports.triggerSavedJobReminders = async (req, res) => {
  try {
    const cronKey = req.headers['x-cron-key'] || req.query.cron_key || req.body?.cron_key;
    const expectedSecret = process.env.CRON_SECRET || 'ccp_cron_secret_key_2026';
    const isCronAuthorized = cronKey === expectedSecret;
    const isAdmin = req.user && req.user.role === 'admin';
    const isDev = process.env.NODE_ENV === 'development';

    if (!isCronAuthorized && !isAdmin && !isDev) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please provide a valid x-cron-key header or cron_key query parameter.'
      });
    }

    const { userId, dryRun, force } = { ...req.query, ...req.body };

    const result = await sendSavedJobReminders({
      userId,
      dryRun: dryRun === 'true' || dryRun === true,
      force: force === 'true' || force === true
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('Trigger Saved Job Reminders Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort('-createdAt')
      .populate('relatedApplication', 'job status')
      .limit(50); // Optional limit to keep it fast

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Mark a specific notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this notification' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
