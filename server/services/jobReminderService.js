const User = require('../models/User');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Company = require('../models/Company');
const sendEmail = require('../utils/sendEmail');

/**
 * Generate a beautifully styled HTML email template for saved job reminders
 */
const generateSavedJobEmailHtml = ({
  candidateName,
  jobTitle,
  companyName,
  companyLogo,
  deadline,
  salary,
  location,
  workMode,
  employmentType,
  jobLink
}) => {
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Open until filled';

  // Calculate days left
  let daysLeftText = '';
  if (deadline) {
    const diffTime = new Date(deadline) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      daysLeftText = `${diffDays} day${diffDays > 1 ? 's' : ''} left to apply`;
    } else if (diffDays === 0) {
      daysLeftText = 'Deadline is today!';
    }
  }

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saved Job Reminder</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0e131f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0e131f; padding: 40px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width: 600px; background-color: #171f30; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            
            <!-- Header Bar -->
            <tr>
              <td style="background: linear-gradient(135deg, #4FDBCE 0%, #D0BCFF 100%); padding: 28px 32px; text-align: left;">
                <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #0b1120; letter-spacing: -0.5px;">
                  Career Connect Portal
                </h1>
                <p style="margin: 4px 0 0; font-size: 13px; color: #1e293b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  Saved Opportunity Alert
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 32px;">
                <p style="margin: 0 0 16px; font-size: 16px; color: #f8fafc; font-weight: 500;">
                  Hi ${candidateName || 'there'},
                </p>
                <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                  You recently saved the following position on Career Connect. Don't let this great opportunity slip away—take a few minutes to submit your application before the deadline!
                </p>

                <!-- Job Highlight Card -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); padding: 20px; margin-bottom: 24px;">
                  <tr>
                    <td>
                      <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 4px;">
                        ${jobTitle}
                      </div>
                      <div style="font-size: 14px; font-weight: 600; color: #4FDBCE; margin-bottom: 14px;">
                        ${companyName || 'Hiring Company'}
                      </div>

                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #cbd5e1;">
                        ${workMode || location ? `
                        <tr>
                          <td style="padding: 4px 0; color: #64748b; width: 110px;">Location:</td>
                          <td style="padding: 4px 0; font-weight: 500; color: #f1f5f9;">
                            ${workMode || ''} ${location ? `• ${location}` : ''}
                          </td>
                        </tr>
                        ` : ''}

                        ${employmentType ? `
                        <tr>
                          <td style="padding: 4px 0; color: #64748b;">Job Type:</td>
                          <td style="padding: 4px 0; font-weight: 500; color: #f1f5f9;">${employmentType}</td>
                        </tr>
                        ` : ''}

                        ${salary ? `
                        <tr>
                          <td style="padding: 4px 0; color: #64748b;">Salary:</td>
                          <td style="padding: 4px 0; font-weight: 500; color: #4FDBCE;">${salary}</td>
                        </tr>
                        ` : ''}

                        <tr>
                          <td style="padding: 4px 0; color: #64748b;">Deadline:</td>
                          <td style="padding: 4px 0; font-weight: 600; color: #f59e0b;">
                            ${formattedDeadline} ${daysLeftText ? `(${daysLeftText})` : ''}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Call to Action Button -->
                <div style="text-align: center; margin: 32px 0 24px;">
                  <a href="${jobLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #4FDBCE 0%, #38bdf8 100%); color: #0b1120; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none; box-shadow: 0 4px 15px rgba(79, 219, 206, 0.35); text-transform: uppercase; letter-spacing: 0.5px;">
                    View & Apply Now →
                  </a>
                </div>

                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748b; text-align: center;">
                  Tip: Keep your resume and profile up to date to increase your chances of getting shortlisted!
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #111726; padding: 20px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;">
                  You received this email because you saved this job on Career Connect Portal.
                </p>
                <p style="margin: 0; font-size: 11px; color: #475569;">
                  © ${new Date().getFullYear()} Career Connect Portal. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

/**
 * Scan all job seekers' saved jobs and send reminder emails if:
 * 1. The job is still active and deadline has not passed.
 * 2. The job seeker has NOT applied yet.
 * 3. The job seeker has NOT received a reminder for this job yet.
 *
 * @param {Object} options
 * @param {string} [options.userId] - Optional: run only for this user
 * @param {boolean} [options.dryRun] - Optional: simulate without sending
 * @param {boolean} [options.force] - Optional: bypass duplicate reminder check (for testing)
 */
const sendSavedJobReminders = async (options = {}) => {
  const { userId, dryRun = false, force = false } = options;

  const query = {
    'savedJobs.0': { $exists: true }
  };
  if (userId) {
    query.user = userId;
  }

  const clientBaseUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const stats = {
    totalProfilesScanned: 0,
    totalSavedJobsFound: 0,
    remindersSent: 0,
    skippedAlreadyApplied: 0,
    skippedAlreadyReminded: 0,
    skippedExpiredOrInactive: 0,
    skippedNoEmailPref: 0,
    errors: []
  };

  try {
    const profiles = await JobSeekerProfile.find(query)
      .populate({
        path: 'user',
        select: 'name email role status notificationPreferences'
      })
      .populate({
        path: 'savedJobs',
        populate: { path: 'company', select: 'name logo' }
      });

    stats.totalProfilesScanned = profiles.length;

    const now = new Date();

    for (const profile of profiles) {
      const user = profile.user;

      if (!user || !user.email) continue;
      if (user.status && user.status !== 'active') continue;

      // Check notification preferences
      if (user.notificationPreferences && user.notificationPreferences.jobAlerts === false) {
        stats.skippedNoEmailPref++;
        continue;
      }

      const savedJobs = profile.savedJobs || [];

      for (const job of savedJobs) {
        if (!job || !job._id) continue;
        stats.totalSavedJobsFound++;

        // 1. Check if job is still active & deadline hasn't passed
        if (!job.isActive || (job.deadline && new Date(job.deadline) < now)) {
          stats.skippedExpiredOrInactive++;
          continue;
        }

        // 2. Check if applicant has already applied
        const existingApp = await Application.exists({
          job: job._id,
          applicant: user._id
        });

        if (existingApp) {
          stats.skippedAlreadyApplied++;
          continue;
        }

        // 3. Check if we already reminded them for this job
        if (!force) {
          const existingReminder = await Notification.exists({
            recipient: user._id,
            type: 'saved_job_reminder',
            relatedJob: job._id
          });

          if (existingReminder) {
            stats.skippedAlreadyReminded++;
            continue;
          }
        }

        // Candidate qualifies for a reminder!
        const companyName = job.company?.name || 'Top Employer';
        const jobLink = `${clientBaseUrl}/jobs/${job._id}`;

        let salaryString = null;
        if (job.salaryRange && (job.salaryRange.min || job.salaryRange.max)) {
          const cur = job.salaryRange.currency || 'INR';
          if (job.salaryRange.min && job.salaryRange.max) {
            salaryString = `${cur} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`;
          } else {
            salaryString = `${cur} ${(job.salaryRange.min || job.salaryRange.max).toLocaleString()}`;
          }
        }

        let locationString = null;
        if (job.location) {
          locationString = [job.location.city, job.location.state, job.location.country]
            .filter(Boolean)
            .join(', ');
        }

        const emailSubject = `Reminder: Don't forget to apply for ${job.title} at ${companyName}`;
        const emailText = `Hi ${user.name},\n\nYou saved the job "${job.title}" at ${companyName}. The application deadline is approaching. Don't forget to apply!\n\nView and apply here: ${jobLink}\n\nCareer Connect Portal`;
        const emailHtml = generateSavedJobEmailHtml({
          candidateName: user.name,
          jobTitle: job.title,
          companyName,
          companyLogo: job.company?.logo,
          deadline: job.deadline,
          salary: salaryString,
          location: locationString,
          workMode: job.workMode,
          employmentType: job.employmentType,
          jobLink
        });

        if (dryRun) {
          stats.remindersSent++;
          console.log(`[DRY RUN] Would send reminder to ${user.email} for "${job.title}"`);
          continue;
        }

        try {
          // Send Email
          await sendEmail({
            email: user.email,
            subject: emailSubject,
            message: emailText,
            html: emailHtml
          });

          // Create In-App Notification
          const formattedDeadline = job.deadline
            ? new Date(job.deadline).toLocaleDateString()
            : 'soon';

          await Notification.create({
            recipient: user._id,
            type: 'saved_job_reminder',
            title: 'Reminder: Complete Your Application',
            message: `You saved "${job.title}" at ${companyName}. Deadline is ${formattedDeadline}. Don't miss out!`,
            link: `/jobs/${job._id}`,
            relatedJob: job._id
          });

          stats.remindersSent++;
          console.log(`Saved job reminder sent successfully to ${user.email} for "${job.title}"`);
        } catch (emailErr) {
          console.error(`Failed sending reminder to ${user.email}:`, emailErr.message);
          stats.errors.push({
            user: user.email,
            job: job.title,
            error: emailErr.message
          });
        }
      }
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
      stats
    };
  } catch (err) {
    console.error('Error running sendSavedJobReminders:', err);
    throw err;
  }
};

module.exports = {
  sendSavedJobReminders,
  generateSavedJobEmailHtml
};
