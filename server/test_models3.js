const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelsResponse = await ai.models.list();
    for await (const model of modelsResponse) {
       console.log(model.name);
    }
  } catch (e) {
    console.error("Error listing models:", e);
  }
}

main();
