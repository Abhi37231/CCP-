require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const { sendSavedJobReminders } = require('../services/jobReminderService');

const runTest = async () => {
  try {
    console.log('Connecting to database:', process.env.MONGODB_URI?.split('@')[1] || 'Local MongoDB');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB.');

    const isDryRun = process.argv.includes('--dryRun');
    const isForce = process.argv.includes('--force');

    console.log('\n--- Running Saved Job Reminder Test ---');
    console.log(`Dry Run: ${isDryRun} (pass --dryRun to simulate without sending)`);
    console.log(`Force: ${isForce} (pass --force to ignore duplicate notification check)`);
    console.log('----------------------------------------\n');

    const result = await sendSavedJobReminders({
      dryRun: isDryRun,
      force: isForce
    });

    console.log('\n================ RESULT ================');
    console.log(JSON.stringify(result, null, 2));
    console.log('========================================\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
};

runTest();
