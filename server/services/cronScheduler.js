const { sendSavedJobReminders } = require('./jobReminderService');

let intervalId = null;

/**
 * Initializes an internal background timer (runs once every 24 hours).
 * NOTE: On Render free tier, the server sleeps after 15 min of inactivity,
 * so external cron pings (e.g. cron-job.org) to /api/notifications/cron/saved-job-reminders
 * are the most reliable method. This internal timer provides a fallback when the server is awake.
 */
const initInternalScheduler = () => {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  // Run initial scan 30 seconds after server boots up, so DB is fully ready
  setTimeout(async () => {
    try {
      console.log('⏰ [Scheduler] Running initial saved job reminder scan...');
      const result = await sendSavedJobReminders();
      console.log('⏰ [Scheduler] Initial reminder scan completed:', result.stats);
    } catch (err) {
      console.error('⏰ [Scheduler] Error during initial reminder scan:', err.message);
    }
  }, 30000);

  // Recurring daily timer
  intervalId = setInterval(async () => {
    try {
      console.log('⏰ [Scheduler] Running daily scheduled saved job reminder scan...');
      const result = await sendSavedJobReminders();
      console.log('⏰ [Scheduler] Daily reminder scan completed:', result.stats);
    } catch (err) {
      console.error('⏰ [Scheduler] Error during scheduled reminder scan:', err.message);
    }
  }, TWENTY_FOUR_HOURS);

  console.log('✅ Internal Job Reminder Scheduler initialized (24h cycle).');
};

const stopInternalScheduler = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

module.exports = {
  initInternalScheduler,
  stopInternalScheduler
};
