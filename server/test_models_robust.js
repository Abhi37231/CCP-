const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const modelsToTest = ['gemini-2.5-pro', 'gemini-3.1-pro-preview', 'gemini-pro-latest', 'gemini-3.7-flash', 'gemini-3.8-flash'];
  
  const dummyPrompt = `You are an expert AI Career Mentor and Senior Technical Lead.
Your task is to analyze a candidate's profile and generate a highly structured Learning Roadmap.
Output MUST be strictly valid JSON matching this schema: {"hello": "world"}
DO NOT wrap the JSON in Markdown formatting like \`\`\`json. Return raw JSON text.`;

  for (const model of modelsToTest) {
    try {
      console.log(`Trying model: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: dummyPrompt,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        }
      });
      console.log(`Success with ${model}! Response:`, response.text);
      // We found a working one!
      break;
    } catch (err) {
      console.error(`Failed with ${model}:`, err.message);
    }
  }
}

main();
