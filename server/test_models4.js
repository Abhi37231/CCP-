const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: 'Hello',
    });
    console.log("Success! Response:", response.text);
  } catch (e) {
    console.error("Error:", e);
  }
}

main();
