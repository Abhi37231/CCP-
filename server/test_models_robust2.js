const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const modelsToTest = ['gemini-3.5-flash', 'gemini-3.1-flash-lite'];
  
  const dummyPrompt = `You are an expert AI Career Mentor. Output JSON matching this schema: {"hello": "world"}`;

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
      console.log(`Success with ${model}!`);
      break;
    } catch (err) {
      console.error(`Failed with ${model}:`, err.message);
    }
  }
}

main();
