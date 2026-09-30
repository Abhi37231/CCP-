const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

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
      "weekNumber": 1,
      "theme": "string",
      "topics": ["string"],
      "resources": [{"title": "string", "url": "string", "type": "Video"}],
      "assignments": ["string"],
      "miniProject": {"title": "string", "description": "string"},
      "dailyTasks": [
        {"day": 1, "goal": "string", "estimatedTime": "string"}
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
    "technicalQuestions": [{"question": "string", "difficulty": "Easy"}],
    "hrQuestions": [{"question": "string", "difficulty": "Easy"}],
    "codingQuestions": [{"question": "string", "difficulty": "Easy"}],
    "scenarioQuestions": [{"question": "string", "difficulty": "Easy"}]
  },
  "jobReadiness": {
    "resumeQuality": 80,
    "skillMatch": 80,
    "projectStrength": 80,
    "interviewReadiness": 80,
    "overallReadiness": 80
  },
  "resumeImprovementTips": ["string"]
}
DO NOT wrap the JSON in Markdown formatting like \`\`\`json. Return raw JSON text.`;

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const modelsToTest = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-lite-latest'];
  
  const promptWithData = `
${ROADMAP_PROMPT}

=== USER PROFILE ===
{"about": "A web developer", "skills": ["HTML", "CSS"]}

=== PREFERENCES ===
Target Role: web development
Preferred Duration: 3 months
Daily Learning Time: 2 hours
Preferred Language: English
Learning Preference: Mixed
`;

  for (const model of modelsToTest) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: promptWithData,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        }
      });
      console.log(`Success with ${model}! Response len:`, response.text.length);
      break; // stop when we find one
    } catch (err) {
      console.error(`Failed with ${model}:`, err.message);
    }
  }
}

main();
