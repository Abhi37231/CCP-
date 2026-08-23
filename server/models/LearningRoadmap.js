const mongoose = require('mongoose');

const learningRoadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: { type: String, required: true },
  estimatedCompletionTime: { type: String }, // e.g., "3 months"
  overallProgress: { type: Number, default: 0 },
  
  skillGap: {
    currentSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    priorityLevel: { type: String, enum: ['High', 'Medium', 'Low'] },
    progress: { type: Number, default: 0 }
  },

  weeklyRoadmap: [{
    weekNumber: { type: Number },
    theme: { type: String },
    topics: [{ type: String }],
    resources: [{
      title: { type: String },
      url: { type: String },
      type: { type: String, enum: ['Video', 'Article', 'Course', 'Documentation', 'Other'] }
    }],
    assignments: [{ type: String }],
    miniProject: {
      title: { type: String },
      description: { type: String }
    },
    dailyTasks: [{
      day: { type: Number }, // 1 to 7
      goal: { type: String },
      estimatedTime: { type: String }, // e.g., "2 hours"
      completed: { type: Boolean, default: false }
    }],
    completed: { type: Boolean, default: false }
  }],

  projects: {
    easy: [{ title: String, description: String, completed: { type: Boolean, default: false } }],
    intermediate: [{ title: String, description: String, completed: { type: Boolean, default: false } }],
    advanced: [{ title: String, description: String, completed: { type: Boolean, default: false } }],
    industryLevel: [{ title: String, description: String, completed: { type: Boolean, default: false } }]
  },

  certifications: [{
    provider: { type: String }, // Google, AWS, etc.
    name: { type: String },
    url: { type: String }
  }],

  learningResources: {
    free: [{ title: String, url: String, platform: String }],
    paid: [{ title: String, url: String, platform: String }]
  },

  mockInterview: {
    technicalQuestions: [{ question: String, difficulty: String }],
    hrQuestions: [{ question: String, difficulty: String }],
    codingQuestions: [{ question: String, difficulty: String }],
    scenarioQuestions: [{ question: String, difficulty: String }]
  },

  jobReadiness: {
    resumeQuality: { type: Number, default: 0 },
    skillMatch: { type: Number, default: 0 },
    projectStrength: { type: Number, default: 0 },
    interviewReadiness: { type: Number, default: 0 },
    overallReadiness: { type: Number, default: 0 }
  },

  resumeImprovementTips: [{ type: String }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LearningRoadmap', learningRoadmapSchema);
