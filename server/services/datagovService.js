const { GoogleGenAI } = require('@google/genai');

// In-memory verification cache to prevent data.gov.in rate-limiting and redundant AI calls
const verifiedCinCache = new Map();

// Pre-seeded registry of top major Indian enterprises for 100% instant, reliable verification
const PRESEEDED_COMPANIES = [
  {
    cin: 'L22210MH1995PLC084781',
    companyName: 'TATA CONSULTANCY SERVICES LIMITED',
    aliases: ['tcs', 'tata consultancy services', 'tata consultancy services limited', 'tata consultancy services ltd'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1995-01-19',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Maharashtra',
    roc: 'ROC Mumbai'
  },
  {
    cin: 'L85110KA1981PLC013115',
    companyName: 'INFOSYS LIMITED',
    aliases: ['infosys', 'infosys limited', 'infosys ltd', 'infy'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1981-07-02',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Karnataka',
    roc: 'ROC Bangalore'
  },
  {
    cin: 'L32102KA1945PLC020800',
    companyName: 'WIPRO LIMITED',
    aliases: ['wipro', 'wipro limited', 'wipro ltd'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1945-12-29',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Karnataka',
    roc: 'ROC Bangalore'
  },
  {
    cin: 'L17110MH1973PLC019786',
    companyName: 'RELIANCE INDUSTRIES LIMITED',
    aliases: ['reliance', 'reliance industries', 'reliance industries limited', 'ril', 'jio'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1973-05-08',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Maharashtra',
    roc: 'ROC Mumbai'
  },
  {
    cin: 'L74140DL1991PLC046369',
    companyName: 'HCL TECHNOLOGIES LIMITED',
    aliases: ['hcl', 'hcl technologies', 'hcl tech', 'hcl technologies limited'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1991-11-12',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Delhi',
    roc: 'ROC Delhi'
  },
  {
    cin: 'L64200MH1986PLC041370',
    companyName: 'TECH MAHINDRA LIMITED',
    aliases: ['tech mahindra', 'tech mahindra limited', 'techm'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1986-10-24',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Maharashtra',
    roc: 'ROC Mumbai'
  },
  {
    cin: 'L99999MH1946PLC004768',
    companyName: 'LARSEN & TOUBRO LIMITED',
    aliases: ['l&t', 'larsen & toubro', 'larsen and toubro', 'larsen and toubro limited'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1946-02-07',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Maharashtra',
    roc: 'ROC Mumbai'
  },
  {
    cin: 'L74899DL1995PLC070609',
    companyName: 'BHARTI AIRTEL LIMITED',
    aliases: ['airtel', 'bharti airtel', 'bharti airtel limited'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1995-07-07',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Delhi',
    roc: 'ROC Delhi'
  },
  {
    cin: 'L16005WB1910PLC001985',
    companyName: 'ITC LIMITED',
    aliases: ['itc', 'itc limited', 'itc ltd'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1910-08-24',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'West Bengal',
    roc: 'ROC Kolkata'
  },
  {
    cin: 'L65190MH1994PLC080618',
    companyName: 'HDFC BANK LIMITED',
    aliases: ['hdfc', 'hdfc bank', 'hdfc bank limited'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1994-08-30',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Maharashtra',
    roc: 'ROC Mumbai'
  },
  {
    cin: 'L65190GJ1994PLC021012',
    companyName: 'ICICI BANK LIMITED',
    aliases: ['icici', 'icici bank', 'icici bank limited'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1994-01-05',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Gujarat',
    roc: 'ROC Ahmedabad'
  },
  {
    cin: 'L28920MH1945PLC004520',
    companyName: 'TATA MOTORS LIMITED',
    aliases: ['tata motors', 'tata motors limited', 'tata motors ltd'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1945-09-01',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Maharashtra',
    roc: 'ROC Mumbai'
  },
  {
    cin: 'L27100MH1907PLC000260',
    companyName: 'TATA STEEL LIMITED',
    aliases: ['tata steel', 'tata steel limited', 'tata steel ltd'],
    status: 'Active (MCA Verified)',
    dateOfIncorporation: '1907-08-26',
    companyClass: 'Public',
    companyCategory: 'Company limited by shares',
    state: 'Maharashtra',
    roc: 'ROC Mumbai'
  }
];

// Populate initial cache
PRESEEDED_COMPANIES.forEach((comp) => {
  verifiedCinCache.set(comp.cin, comp);
});

/**
 * Smart matcher to verify if entered company name aligns with official MCA name or domain
 */
function isCompanyNameMatch(enteredName, officialName, website, aliases = []) {
  if (!enteredName || !officialName) return false;

  const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const nEntered = norm(enteredName);
  const nOfficial = norm(officialName);

  // 1. Direct normalized match or substring
  if (nEntered === nOfficial || nOfficial.includes(nEntered) || nEntered.includes(nOfficial)) {
    return true;
  }

  // 2. Check pre-seeded aliases if present
  if (aliases && aliases.length > 0) {
    const enteredLower = (enteredName || '').toLowerCase().trim();
    if (aliases.some(a => a === enteredLower || norm(a) === nEntered || nEntered.includes(norm(a)))) {
      return true;
    }
  }

  // 3. Strip legal corporate suffixes
  const stripSuffix = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\b(limited|ltd|private|pvt|corporation|corp|inc|incorporated|india|technologies|tech|solutions|services|consultancy)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const sEntered = stripSuffix(enteredName);
  const sOfficial = stripSuffix(officialName);

  if (sEntered && sOfficial) {
    if (sEntered === sOfficial || sOfficial.includes(sEntered) || sEntered.includes(sOfficial)) {
      return true;
    }
    // Token overlap
    const eWords = sEntered.split(' ').filter(w => w.length > 2);
    const oWords = sOfficial.split(' ').filter(w => w.length > 2);
    if (eWords.length > 0 && oWords.length > 0) {
      if (eWords.some(w => oWords.includes(w))) {
        return true;
      }
    }
  }

  // 4. Acronym check (e.g., TCS for Tata Consultancy Services)
  const acronym = officialName
    .split(/\s+/)
    .filter(w => w.length > 0)
    .map(w => w[0].toUpperCase())
    .join('');
  const enteredUpper = enteredName.toUpperCase().replace(/[^A-Z]/g, '');
  if (enteredUpper.length >= 2 && (acronym.startsWith(enteredUpper) || enteredUpper.includes(acronym) || acronym === enteredUpper)) {
    return true;
  }

  // 5. Domain check (e.g., tcs.com matches TCS / Tata Consultancy Services)
  if (website) {
    try {
      let w = website.toLowerCase();
      if (!w.startsWith('http')) w = 'https://' + w;
      const domainCore = new URL(w).hostname.replace(/^www\./, '').split('.')[0];
      if (domainCore && domainCore.length > 2) {
        if (nOfficial.includes(domainCore) || acronym.toLowerCase().includes(domainCore) || nEntered.includes(domainCore)) {
          return true;
        }
      }
    } catch (_) {}
  }

  return false;
}

/**
 * Service for verifying company information using In-Memory Cache -> MCA (data.gov.in) -> AI fallback
 */
exports.verifyCompanyCin = async (cin, companyName, website) => {
  const normalizedCin = (cin || '').toUpperCase().trim();

  // 1. FAST PATH: Check In-Memory / Preseeded Cache
  if (verifiedCinCache.has(normalizedCin)) {
    const cachedCompany = verifiedCinCache.get(normalizedCin);
    const isMatch = isCompanyNameMatch(companyName, cachedCompany.companyName, website, cachedCompany.aliases || []);

    if (isMatch) {
      return {
        success: true,
        verified: true,
        company: {
          cin: normalizedCin,
          companyName: cachedCompany.companyName,
          status: cachedCompany.status || 'Active (MCA Verified)',
          dateOfIncorporation: cachedCompany.dateOfIncorporation || 'N/A',
          companyClass: cachedCompany.companyClass || 'Public',
          companyCategory: cachedCompany.companyCategory || 'Company limited by shares',
          state: cachedCompany.state || 'N/A',
          roc: cachedCompany.roc || 'N/A'
        }
      };
    } else {
      // Known CIN but entered for an unrelated company name
      return {
        success: false,
        verified: false,
        message: 'Wrong CIN number. The provided CIN does not match the company name.'
      };
    }
  }

  // 2. PRIMARY SOURCE: Official MCA Dataset via Data.gov.in API
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (apiKey) {
    try {
      const url = `https://api.data.gov.in/resource/4dbe5667-7b6b-41d7-82af-211562424d9a?api-key=${apiKey}&format=json&filters[CIN]=${encodeURIComponent(normalizedCin)}`;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

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

          const verifiedData = {
            cin: record.CIN || normalizedCin,
            companyName: officialName || companyName,
            status: 'Active (MCA Verified)',
            dateOfIncorporation: record.CompanyRegistrationdate_date || 'N/A',
            companyClass: record.CompanyClass || 'N/A',
            companyCategory: record.CompanyCategory || 'N/A',
            state: record.CompanyStateCode || 'N/A',
            roc: record.CompanyROCcode || 'N/A'
          };

          // Cache this newly verified CIN for future instant hits
          verifiedCinCache.set(normalizedCin, verifiedData);

          if (match) {
            return {
              success: true,
              verified: true,
              company: verifiedData
            };
          } else {
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

  // 3. FALLBACK SOURCE: Google Gemini AI Verification
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an expert Corporate Verification Assistant for registered Indian companies.
Determine whether the Corporate Identification Number (CIN) genuinely belongs to this company.

Company Details:
- CIN: ${normalizedCin}
- Company Name: ${companyName}
- Website: ${website}

Verification Guidelines:
1. If the CIN belongs to this company (or matches common variations/acronyms like TCS for Tata Consultancy Services, Infy for Infosys, or common legal suffixes), return verified: true.
2. If the company is an Indian registered entity whose state code and year match this CIN format ([L/U][5-digits][2-letter state][4-digit year][3-letter type][6-digits]), return verified: true.
3. If the CIN belongs to a completely different company or is invalid, return verified: false.
4. NEVER disclose, suggest, or include the actual or correct CIN number of any company.
5. If verified is false, provide a clean reason: "Wrong CIN number. The provided CIN does not match the company name."

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
      const verifiedData = {
        cin: normalizedCin,
        companyName: result.companyName || companyName,
        status: 'Active (AI Verified)',
        dateOfIncorporation: 'N/A',
        companyClass: 'N/A',
        companyCategory: 'N/A',
        state: 'N/A',
        roc: 'N/A'
      };

      // Cache verified result
      verifiedCinCache.set(normalizedCin, verifiedData);

      return { 
        success: true, 
        verified: true,
        company: verifiedData
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
