require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

const test = async () => {
  try {
    await sendEmail({
      email: process.env.SMTP_EMAIL,
      subject: 'Test Email',
      message: 'This is a test email to verify configuration.'
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

test();
