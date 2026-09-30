const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const fallbackModel = 'gemini-2.5-flash';
  
  try {
    console.log("Trying fallback model:", fallbackModel);
    const response = await ai.models.generateContent({
      model: fallbackModel,
      contents: "Hello",
    });
    console.log("Fallback succeeded!");
  } catch (err) {
    console.error("Fallback failed:", err.message);
  }
}

main();
