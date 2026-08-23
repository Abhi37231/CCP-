const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: 'AQ.Ab8RN6Lv6zFmuUfZ8eBt1utscyhpyZ02uCnRXrYVSCInDpROLw'
});

async function listModels() {
  try {
    const models = await ai.models.list();
    for await (const model of models) {
      console.log(model.name);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

listModels();
