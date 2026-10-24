const { GoogleGenAI } = require('@google/genai');

/**
 * Smart matcher to verify if entered company name aligns with official MCA name or domain
 */
function isCompanyNameMatch(enteredName, officialName, website) {
  if (!enteredName || !officialName) return false;

  const clean = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\b(limited|ltd|private|pvt|corp|corporation|inc|incorporated|india|technologies|technology|tech|consultancy|services)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const cEntered = clean(enteredName);
  const cOfficial = clean(officialName);

  // Exact or containment after stripping standard legal suffixes
  if (cEntered && cOfficial) {
    if (cEntered === cOfficial || cOfficial.includes(cEntered) || cEntered.includes(cOfficial)) {
      return true;
    }
  }

  // Token matching: if significant words match (e.g. "tata" in both)
  const enteredTokens = cEntered.split(' ').filter(w => w.length > 2);
  const officialTokens = cOfficial.split(' ').filter(w => w.length > 2);
  if (enteredTokens.length > 0 && officialTokens.length > 0) {
    const hasOverlap = enteredTokens.some(token => officialTokens.includes(token));
    if (hasOverlap) return true;
  }

  // Acronym matching (e.g. TCS for Tata Consultancy Services)
  const acronym = officialName
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase())
    .join('');
  const enteredUpper = enteredName.toUpperCase().replace(/[^A-Z]/g, '');
  if (enteredUpper.length >= 2 && (acronym.startsWith(enteredUpper) || enteredUpper.includes(acronym))) {
    return true;
  }

  // Domain matching (e.g. tcs.com matches TATA CONSULTANCY SERVICES)
  if (website) {
    try {
      let hostname = website.toLowerCase();
      if (!hostname.startsWith('http')) hostname = 'https://' + hostname;
      const parsed = new URL(hostname).hostname.replace(/^www\./, '').split('.')[0];
      if (parsed && parsed.length > 2) {
        if (cEntered.includes(parsed) || cOfficial.includes(parsed) || acronym.toLowerCase().includes(parsed)) {
          return true;
        }
      }
    } catch (_) {}
  }

  return false;
}

/**
 * Service for verifying company information using MCA (data.gov.in) with AI fallback
 */
exports.verifyCompanyCin = async (cin, companyName, website) => {
  // Normalize CIN
  const normalizedCin = (cin || '').toUpperCase().trim();

  // 1. PRIMARY SOURCE: Official MCA Dataset via Data.gov.in API
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (apiKey) {
    try {
      const url = `https://api.data.gov.in/resource/4dbe5667-7b6b-41d7-82af-211562424d9a?api-key=${apiKey}&format=json&filters[CIN]=${encodeURIComponent(normalizedCin)}`;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4500); // 4.5s timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        if (data && data.records && data.records.length > 0) {
          const record = data.records[0];
          const officialName = record.CompanyName || '';
          const match = isCompanyNameMatch(companyName, officialName, website);

          if (match) {
            return {
              success: true,
              verified: true,
              company: {
                cin: record.CIN || normalizedCin,
                companyName: officialName || companyName,
                status: 'Active (MCA Verified)',
                dateOfIncorporation: record.CompanyRegistrationdate_date || 'N/A',
                companyClass: record.CompanyClass || 'N/A',
                companyCategory: record.CompanyCategory || 'N/A',
                state: record.CompanyStateCode || 'N/A',
                roc: record.CompanyROCcode || 'N/A'
              }
            };
          } else {
            // Valid CIN in government registry, but belongs to another entity
            return {
              success: false,
              verified: false,
              message: 'Wrong CIN number. The provided CIN does not match the company name.'
            };
          }
        }
      }
    } catch (govErr) {
      console.warn('data.gov.in check failed or timed out, falling back to AI verification:', govErr.message);
    }
  }

  // 2. FALLBACK SOURCE: Google Gemini AI Verification
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an expert Corporate Verification Assistant for registered Indian companies.
Determine whether the Corporate Identification Number (CIN) genuinely belongs to this company.

Company Details:
- CIN: ${normalizedCin}
- Company Name: ${companyName}
- Website: ${website}

Verification Guidelines:
1. If the CIN belongs to this company (or its group entity, including acronyms like TCS for Tata Consultancy Services, Infy for Infosys, or common legal suffixes), return verified: true.
2. If the CIN belongs to a completely different company or is invalid, return verified: false.
3. NEVER disclose, suggest, or include the actual or correct CIN number of any company.
4. If verified is false, provide a clean reason: "Wrong CIN number. The provided CIN does not match the company name."

Respond strictly with valid JSON:
{
  "verified": true,
  "reason": "Company verified successfully.",
  "companyName": "Official Registered Company Name"
}
OR
{
  "verified": false,
  "reason": "Wrong CIN number. The provided CIN does not match the company name.",
  "companyName": ""
}`;

    const modelsToTry = [
      process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite'
    ];
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
          cin: normalizedCin,
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
      
      // Safety filter: sanitize any leaked 21-character CIN pattern or sensitive phrases
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
    // Graceful offline fallback
    return { 
      success: true, 
      verified: true,
      message: 'Verification service unreachable. Bypassing check.',
      company: {
        cin: normalizedCin,
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
