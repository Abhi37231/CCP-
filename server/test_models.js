const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    // Assuming the sdk has some sort of listModels method or we can just try a call
    console.log("SDK keys:", Object.keys(ai));
    console.log("Models object:", ai.models ? Object.keys(ai.models) : "no models");
  } catch (e) {
    console.error(e);
  }
}

main();
