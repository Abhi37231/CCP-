const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are a corporate verification assistant.
I will provide a company's CIN, Name, and Website.
You must tell me if they match.
Return JSON:
{
  "verified": true/false,
  "reason": "String explaining why"
}

CIN: L85110KA1981PLC013115
Name: Infosys Limited
Website: https://www.infosys.com`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}
main();
