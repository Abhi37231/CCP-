const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a dummy transporter for development (logs to console instead of actually sending if no real credentials)
  // To use a real service, add SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD to .env
  
  let transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });
  } else {
    // Dummy transporter that just logs to console
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('====================================');
        console.log(`DUMMY EMAIL SENT TO: ${mailOptions.to}`);
        console.log(`SUBJECT: ${mailOptions.subject}`);
        console.log(`TEXT: ${mailOptions.text}`);
        console.log('====================================');
        return true;
      }
    };
  }

  const message = {
    from: `${process.env.FROM_NAME || 'Career Connect'} <${process.env.FROM_EMAIL || 'noreply@careerconnect.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
