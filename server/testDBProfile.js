const mongoose = require('mongoose');
const JobSeekerProfile = require('./models/JobSeekerProfile');
const dotenv = require('dotenv');

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/careerconnect');
    console.log("Connected to DB");
    
    const profileData = {
      user: new mongoose.Types.ObjectId(),
      projects: [{ title: 'My Project', technologiesUsed: ['React'], keyFeatures: ['Feat'] }]
    };
    
    // Simulate what profileController does
    let filledSections = 0;
    // ...
    profileData.profileCompletion = 8;
    
    const profile = await JobSeekerProfile.create(profileData);
    console.log("Created successfully:", profile._id);
  } catch(e) {
    console.error("DB Error:", e);
  } finally {
    mongoose.disconnect();
  }
}
test();
