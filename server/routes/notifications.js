const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  triggerSavedJobReminders
} = require('../controllers/notificationController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Optional authentication: allows cron-key callers through directly, or sets req.user if token is provided
const optionalProtect = async (req, res, next) => {
  const cronKey = req.headers['x-cron-key'] || req.query.cron_key || req.body?.cron_key;
  const expectedSecret = process.env.CRON_SECRET || 'ccp_cron_secret_key_2026';
  if (cronKey === expectedSecret || process.env.NODE_ENV === 'development') {
    return next();
  }
  return protect(req, res, next);
};

// Cron / Webhook Endpoint for Saved Job Reminders
router.route('/cron/saved-job-reminders')
  .get(optionalProtect, triggerSavedJobReminders)
  .post(optionalProtect, triggerSavedJobReminders);

router.use(protect); // All subsequent notification routes require authentication

router.route('/')
  .get(getNotifications);

router.route('/read-all')
  .put(markAllAsRead);

router.route('/:id/read')
  .put(markAsRead);

module.exports = router;
