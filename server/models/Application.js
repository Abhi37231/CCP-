const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Selected', 'Rejected', 'Pending', 'Reviewed', 'Interviewing', 'Hired'], // Keeping legacy statuses to prevent crashes for old data
    default: 'Applied'
  },
  resume: {
    type: String, // Path or URL to the resume file submitted with the application
  },
  coverLetter: {
    type: String
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  recruiterNotes: {
    type: String
  },
  atsScore: {
    type: Number
  },
  atsAnalysis: {
    type: Object
  },
  history: [{
    status: String,
    note: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  interview: {
    date: Date,
    time: String,
    type: { type: String, enum: ['Online', 'Offline'] },
    link: String,
    location: String,
    notes: String
  }
}, { timestamps: true });

// Prevent multiple applications for the same job by the same user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
