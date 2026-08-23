const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  responsibilities: {
    type: String,
    required: [true, 'Please add responsibilities']
  },
  qualifications: {
    type: String,
    required: [true, 'Please add qualifications']
  },
  skillsRequired: [{
    type: String,
    required: true,
    trim: true
  }],
  category: {
    type: String,
    required: true
  },
  salaryRange: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  experienceRequired: {
    type: String,
    enum: ['Fresher', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years'],
    required: true
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    required: true
  },
  workMode: {
    type: String,
    enum: ['Remote', 'Hybrid', 'Onsite'],
    required: true
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  vacancies: {
    type: Number,
    default: 1
  },
  deadline: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Add text index for search
jobSchema.index({
  title: 'text',
  description: 'text',
  skillsRequired: 'text'
});

module.exports = mongoose.model('Job', jobSchema);
