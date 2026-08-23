const { GoogleGenAI } = require('@google/genai');
const LearningRoadmap = require('../models/LearningRoadmap');
const JobSeekerProfile = require('../models/JobSeekerProfile');

// ai will be initialized inside the function

const ROADMAP_PROMPT = `You are an expert AI Career Mentor and Senior Technical Lead.
Your task is to analyze a candidate's profile (skills, education, certifications, work experience, projects) and their target job role.
Based on this analysis, generate a highly structured, comprehensive, and personalized Learning Roadmap to help them become job-ready for the target role.

Generate:
1. Skill Gap Analysis (Current Level, Missing Skills, Priority).
2. A Weekly Learning Roadmap (up to 12 weeks max) with topics, resources, assignments, and mini-projects.
3. Daily Learning Tasks.
4. Recommended Projects categorized by difficulty (Easy, Intermediate, Advanced, Industry-Level).
5. Certifications to pursue.
6. Free and Paid Learning Resources.
7. Mock Interview Questions (Technical, HR, Coding, Scenario) with difficulty levels.
8. Resume Improvement Suggestions.
9. Job Readiness Score (0-100) across various metrics.

Output MUST be strictly valid JSON matching this schema:
{
  "estimatedCompletionTime": "string",
  "skillGap": {
    "currentSkills": ["string"],
    "missingSkills": ["string"],
    "priorityLevel": "High" | "Medium" | "Low"
  },
  "weeklyRoadmap": [
    {
      "weekNumber": number,
      "theme": "string",
      "topics": ["string"],
      "resources": [{"title": "string", "url": "string", "type": "Video" | "Article" | "Course" | "Documentation" | "Other"}],
      "assignments": ["string"],
      "miniProject": {"title": "string", "description": "string"},
      "dailyTasks": [
        {"day": number, "goal": "string", "estimatedTime": "string"}
      ]
    }
  ],
  "projects": {
    "easy": [{"title": "string", "description": "string"}],
    "intermediate": [{"title": "string", "description": "string"}],
    "advanced": [{"title": "string", "description": "string"}],
    "industryLevel": [{"title": "string", "description": "string"}]
  },
  "certifications": [
    {"provider": "string", "name": "string", "url": "string"}
  ],
  "learningResources": {
    "free": [{"title": "string", "url": "string", "platform": "string"}],
    "paid": [{"title": "string", "url": "string", "platform": "string"}]
  },
  "mockInterview": {
    "technicalQuestions": [{"question": "string", "difficulty": "Easy" | "Medium" | "Hard"}],
    "hrQuestions": [{"question": "string", "difficulty": "Easy" | "Medium" | "Hard"}],
    "codingQuestions": [{"question": "string", "difficulty": "Easy" | "Medium" | "Hard"}],
    "scenarioQuestions": [{"question": "string", "difficulty": "Easy" | "Medium" | "Hard"}]
  },
  "jobReadiness": {
    "resumeQuality": number,
    "skillMatch": number,
    "projectStrength": number,
    "interviewReadiness": number,
    "overallReadiness": number
  },
  "resumeImprovementTips": ["string"]
}
DO NOT wrap the JSON in Markdown formatting like \`\`\`json. Return raw JSON text.`;

exports.generateRoadmap = async (req, res) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });
    
    const { targetRole, preferredDuration, dailyTime, preferredLanguage, learningPreference } = req.body;
    const userId = req.user.id;

    if (!targetRole) {
      return res.status(400).json({ success: false, message: 'Target role is required' });
    }

    // Fetch user profile data to provide context to Gemini
    const profile = await JobSeekerProfile.findOne({ user: userId });
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'User profile not found. Please complete your profile first.' });
    }

    // Prepare context for Gemini
    const profileContext = {
      about: profile.about,
      skills: profile.skills,
      education: profile.education,
      projects: profile.projects,
      experience: profile.experience,
      certifications: profile.certifications
    };

    const promptWithData = `
${ROADMAP_PROMPT}

=== USER PROFILE ===
${JSON.stringify(profileContext, null, 2)}

=== PREFERENCES ===
Target Role: ${targetRole}
Preferred Duration: ${preferredDuration || 'Not specified'}
Daily Learning Time: ${dailyTime || 'Not specified'}
Preferred Language: ${preferredLanguage || 'English'}
Learning Preference: ${learningPreference || 'Mixed'}
`;

    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    const response = await ai.models.generateContent({
      model: model,
      contents: promptWithData,
      config: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (e) {
      console.error('JSON Parse Error:', e, 'Response Text:', responseText);
      return res.status(500).json({ success: false, message: 'AI returned invalid formatting. Please try again.' });
    }

    // Save to Database
    const newRoadmap = new LearningRoadmap({
      user: userId,
      targetRole,
      ...parsedResult
    });

    await newRoadmap.save();

    res.status(201).json({
      success: true,
      data: newRoadmap
    });

  } catch (error) {
    console.error('Generate Roadmap Error:', error);
    let errMsg = 'AI generation failed. Please try again later.';
    if (error.message) {
      errMsg = 'AI Error: ' + error.message;
    }
    res.status(500).json({ success: false, message: errMsg });
  }
};

exports.getRoadmap = async (req, res) => {
  try {
    const roadmap = await LearningRoadmap.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'No roadmap found' });
    }

    res.status(200).json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Get Roadmap Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { updates } = req.body; // Expecting updates object for specific fields (e.g. { overallProgress: 10, 'weeklyRoadmap.0.completed': true })
    const roadmap = await LearningRoadmap.findOneAndUpdate(
      { user: req.user.id },
      { $set: updates, updatedAt: Date.now() },
      { new: true, sort: { createdAt: -1 } }
    );

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    res.status(200).json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Update Progress Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
