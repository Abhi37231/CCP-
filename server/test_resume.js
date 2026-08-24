const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Application = require('./models/Application');
  const app = await Application.findOne({ resume: { $ne: null } });
  console.log('RESUME_VAL:', app ? app.resume : 'no resume');
  process.exit();
});
