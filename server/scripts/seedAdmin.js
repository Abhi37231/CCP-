const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'careerconnectportal2027@gmail.com';
    const adminPassword = 'careerconnect@2027';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user already exists. Updating password and role...');
      admin.password = adminPassword;
      admin.role = 'admin';
      admin.isVerified = true;
      await admin.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      admin = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isVerified: true
      });
      await admin.save();
      console.log('Admin user created successfully.');
    }

    mongoose.disconnect();
    console.log('Database disconnected');
  } catch (err) {
    console.error('Error seeding admin:', err);
    mongoose.disconnect();
  }
};

seedAdmin();
