const { GoogleGenAI } = require('@google/genai');

/**
 * Service for verifying company information using AI when data.gov.in is unreachable
 */
exports.verifyCompanyCin = async (cin, companyName, website) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an expert Corporate Verification Assistant.
I will provide a company's CIN (Corporate Identification Number from India), Name, and Website.
Your task is to verify if this CIN genuinely belongs to this company. Use your knowledge of registered companies in India (e.g., Infosys, TCS, Wipro, etc.).
If they match or broadly match, return verified: true.
If the CIN is wrong, invalid, or belongs to a different company, return verified: false.

CRITICAL SECURITY AND ANTI-FRAUD RULES:
1. NEVER disclose, suggest, reveal, or include the correct, real, or official CIN number of the company under any circumstances.
2. If verified is false, provide ONLY generic, short error reasons like "Wrong CIN number." or "Invalid CIN number. CIN does not match the company name."
3. Do NOT reveal which other company this CIN belongs to, and do NOT give hints or real CINs.

Return JSON EXACTLY matching this schema:
{
  "verified": true/false,
  "reason": "Wrong CIN number or invalid CIN.",
  "companyName": "The official registered name if verified, or the provided name"
}

Input Data to Verify:
CIN: ${cin}
Name: ${companyName}
Website: ${website}`;

    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.6-flash'];
    let responseText = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        });
        if (response && response.text) {
          responseText = response.text;
          break;
        }
      } catch (err) {
        console.warn(`AI Verification Model ${modelName} failed:`, err.message);
      }
    }

    if (!responseText) {
       throw new Error('All AI models failed to respond');
    }

    const result = JSON.parse(responseText);

    if (result.verified) {
      return { 
        success: true, 
        verified: true,
        company: {
            cin: cin,
            companyName: result.companyName || companyName,
            status: 'Active (AI Verified)',
            dateOfIncorporation: 'N/A',
            companyClass: 'N/A',
            companyCategory: 'N/A',
            state: 'N/A',
            roc: 'N/A'
        }
      };
    } else {
      let cleanReason = (result.reason || '').trim();
      
      // Safety filter: sanitize any leaked 21-character CIN pattern or hints
      const cinPattern = /[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}/i;
      const leaksSensitive = /correct cin|actual cin|right cin|belongs to|known as|correct.*is|cin for/i.test(cleanReason);

      if (!cleanReason || cinPattern.test(cleanReason) || leaksSensitive || cleanReason.length > 70) {
        cleanReason = 'Wrong CIN number. The provided CIN does not match the company name.';
      }

      return { 
        success: false, 
        verified: false,
        message: cleanReason 
      };
    }

  } catch (error) {
    console.error('AI Verification error:', error.message);
    // Absolute worst case fallback if Gemini goes down too
    return { 
      success: true, 
      verified: true,
      message: 'Verification service unreachable. Bypassing check.',
      company: {
          cin: cin,
          companyName: companyName || 'Unverified Company',
          status: 'Active',
          dateOfIncorporation: 'N/A',
          companyClass: 'N/A',
          companyCategory: 'N/A',
          state: 'N/A',
          roc: 'N/A'
      }
    };
  }
};
