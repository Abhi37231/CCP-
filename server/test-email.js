const nodemailer = require('nodemailer');

const testEmail = async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'careerconnectportal2027@gmail.com',
        pass: 'hlufzgibchyujvug'
      }
    });

    const message = {
      from: 'Career Connect Portal <careerconnectportal2027@gmail.com>',
      to: 'careerconnectportal2027@gmail.com', // sending to self
      subject: 'Test Email',
      text: 'This is a test.'
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent: ', info);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

testEmail();
