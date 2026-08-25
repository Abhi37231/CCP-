const mongoose = require('mongoose');

const jobSeekerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    profilePhoto: { type: String }, // Can fallback to user avatar if empty
    firstName: { type: String }, // To handle "Full Name" we can also just use user's name
    middleName: { type: String },
    lastName: { type: String },
    headline: { type: String, maxlength: 120 },
    phone: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  },
  professionalDetails: {
    currentCompany: { type: String },
    currentDesignation: { type: String },
    totalExperienceYears: { type: Number },
    noticePeriodDays: { type: Number },
    currentSalary: { type: Number }
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    twitter: { type: String },
    medium: { type: String },
    youtube: { type: String },
    behance: { type: String },
    dribbble: { type: String },
  },
  resume: {
    type: String, // Path or URL to the resume file
    default: null
  },
  about: {
    type: String, // Professional Summary / Career Objective
    trim: true,
    maxlength: 500
  },
  education: [{
    degree: { type: String, required: true },
    branch: { type: String },
    institution: { type: String, required: true },
    board: { type: String },
    startYear: { type: Number },
    endYear: { type: Number }, // Expected Graduation
    currentSemester: { type: Number },
    cgpa: { type: Number }, // or percentage
    percentage: { type: Number },
    status: { type: String, enum: ['Pursuing', 'Completed'], default: 'Completed' }
  }],
  skills: {
    programmingLanguages: [{ name: String, proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] } }],
    frameworks: [{ name: String, proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] } }],
    databases: [{ name: String, proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] } }],
    tools: [{ name: String, proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] } }],
    cloudDevOps: [{ name: String, proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] } }],
    softSkills: [{ name: String, proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] } }],
  },
  projects: [{
    title: { type: String, required: true },
    description: { type: String },
    technologiesUsed: [{ type: String }],
    role: { type: String },
    duration: { type: String }, // e.g., "3 months"
    githubUrl: { type: String },
    liveUrl: { type: String },
    keyFeatures: [{ type: String }],
    challengesFaced: { type: String },
    learnings: { type: String },
    images: [{ type: String }] // URLs for project images
  }],
  internships: [{
    company: { type: String, required: true },
    role: { type: String, required: true },
    duration: { type: String },
    location: { type: String },
    description: { type: String },
    technologiesUsed: [{ type: String }],
    certificateUrl: { type: String }
  }],
  experience: [{ // Work Experience
    company: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: String },
    responsibilities: { type: String },
    skillsUsed: [{ type: String }]
  }],
  certifications: [{
    name: { type: String, required: true },
    issuingOrganization: { type: String },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    credentialId: { type: String },
    verificationUrl: { type: String },
    certificateUpload: { type: String }
  }],
  achievements: {
    hackathons: [{ type: String }],
    codingCompetitions: [{ type: String }],
    scholarships: [{ type: String }],
    awards: [{ type: String }],
    academic: [{ type: String }]
  },
  codingProfiles: {
    leetcode: { type: String },
    codechef: { type: String },
    codeforces: { type: String },
    hackerrank: { type: String },
    geeksforgeeks: { type: String },
    hackerearth: { type: String },
    atcoder: { type: String }
  },
  languagesKnown: [{
    language: { type: String, required: true },
    proficiency: { type: String, enum: ['Basic', 'Intermediate', 'Fluent', 'Native'] }
  }],
  extracurriculars: {
    clubs: [{ type: String }],
    volunteerWork: [{ type: String }],
    eventManagement: [{ type: String }],
    sports: [{ type: String }],
    cultural: [{ type: String }]
  },
  interests: [{ type: String }], // Tags like Web Development, AI/ML, etc.
  jobPreferences: {
    role: { type: String },
    location: { type: String },
    employmentType: { type: String, enum: ['Internship', 'Full-Time', 'Part-Time', 'Remote'] },
    availableFrom: { type: Date },
    expectedSalary: {
      currency: { type: String, default: 'USD' },
      min: Number,
      max: Number
    }
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  privacySettings: {
    phoneVisible: { type: Boolean, default: true },
    emailVisible: { type: Boolean, default: true },
    resumeVisible: { type: Boolean, default: true },
    cgpaVisible: { type: Boolean, default: true },
    socialLinksVisible: { type: Boolean, default: true },
    codingProfilesVisible: { type: Boolean, default: true },
  },
  profileCompletion: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);
