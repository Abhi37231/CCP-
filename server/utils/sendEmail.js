const nodemailer = require('nodemailer');
const https = require('https');

const sendEmail = async (options) => {
  // 1. Prefer standard SMTP if fully configured (Useful for local testing or unblocked servers)
  if (process.env.SMTP_HOST && process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const message = {
      from: `${process.env.FROM_NAME || 'Career Connect'} <${process.env.FROM_EMAIL || 'noreply@careerconnect.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    return await transporter.sendMail(message);
  }

  // 2. Fallback to Brevo REST API (Useful for Render deployments where SMTP is blocked)
  if (process.env.BREVO_API_KEY) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        sender: {
          name: process.env.FROM_NAME || 'Career Connect',
          email: process.env.FROM_EMAIL || 'noreply@careerconnect.com'
        },
        to: [{ email: options.email }],
        subject: options.subject,
        textContent: options.message,
        htmlContent: options.html
      });

      const req = https.request({
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'Content-Length': Buffer.byteLength(data)
        }
      }, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('Brevo Email sent successfully!');
            resolve(true);
          } else {
            console.error('Brevo Error:', responseData);
            reject(new Error(`Brevo API error: ${res.statusCode}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  // 3. Dummy transporter for local testing if nothing else is configured
  console.log('====================================');
  console.log(`DUMMY EMAIL SENT TO: ${options.email}`);
  console.log(`SUBJECT: ${options.subject}`);
  console.log(`TEXT: ${options.message}`);
  console.log('====================================');
  return true;
};

module.exports = sendEmail;
