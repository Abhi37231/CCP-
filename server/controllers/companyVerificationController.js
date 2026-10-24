const Company = require('../models/Company');
const { verifyCompanyCin } = require('../services/datagovService');

// @desc    Verify Company CIN via Data.gov.in API
// @route   POST /api/company/verify
// @access  Public
exports.verifyCompany = async (req, res) => {
  try {
    let { cin, companyName, website } = req.body;

    if (!cin) {
      return res.status(400).json({ success: false, verified: false, message: 'Invalid CIN number. CIN is required.' });
    }

    // Normalize CIN
    cin = cin.toUpperCase().trim();

    // Validate 21-character Indian CIN format
    const cinRegex = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
    if (!cinRegex.test(cin)) {
      return res.status(400).json({ 
        success: false, 
        verified: false, 
        message: 'Invalid CIN number. Must be a 21-character alphanumeric code.' 
      });
    }

    // Check if CIN already exists in our registered companies database
    const existingCompany = await Company.findOne({ cin });
    if (existingCompany) {
      return res.status(400).json({ 
        success: false, 
        verified: false,
        message: 'A company with this CIN is already registered.' 
      });
    }

    // Call the live verification service
    const verificationResult = await verifyCompanyCin(cin, companyName, website);

    if (verificationResult.verified) {
      return res.status(200).json(verificationResult);
    } else {
      let msg = verificationResult.message || 'Wrong CIN number.';
      const cinPattern = /[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}/i;
      if (cinPattern.test(msg) || /correct cin|actual cin|belongs to|registered to/i.test(msg)) {
        msg = 'Wrong CIN number. The provided CIN does not match the company name.';
      }

      return res.status(400).json({
        success: false,
        verified: false,
        message: msg
      });
    }
  } catch (error) {
    console.error('Company verification error:', error);
    res.status(500).json({ success: false, message: 'Unable to verify the company right now. Please try again.' });
  }
};
