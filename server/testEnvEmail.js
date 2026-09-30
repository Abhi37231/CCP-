require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

const test = async () => {
  try {
    await sendEmail({
      email: 'careerconnectportal2027@gmail.com',
      subject: 'Test env Email',
      message: 'This is a test with dotenv.'
    });
    console.log('Email sent successfully using dotenv config');
  } catch (err) {
    console.error('Email sending failed with dotenv config:', err);
  }
};

test();
