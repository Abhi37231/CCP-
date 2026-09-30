const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const primaryModel = 'gemini-3.6-flash';
  const fallbackModel = 'gemini-flash-latest';
  
  let response;
  try {
    console.log("Trying primary model:", primaryModel);
    response = await ai.models.generateContent({
      model: primaryModel,
      contents: "Hello",
    });
    console.log("Primary succeeded!");
  } catch (err) {
    console.warn(`Primary model ${primaryModel} failed. Falling back to ${fallbackModel}...`);
    try {
      response = await ai.models.generateContent({
        model: fallbackModel,
        contents: "Hello",
      });
      console.log("Fallback succeeded!");
    } catch (err2) {
      console.error("Fallback also failed:", err2.message);
    }
  }
}

main();
