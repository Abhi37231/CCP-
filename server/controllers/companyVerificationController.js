const Company = require('../models/Company');
const { verifyCompanyCin } = require('../services/datagovService');

// @desc    Verify Company CIN via Data.gov.in API
// @route   POST /api/company/verify
// @access  Public
exports.verifyCompany = async (req, res) => {
  try {
    let { cin, companyName, website } = req.body;

    if (!cin) {
      return res.status(400).json({ success: false, message: 'CIN is required for verification' });
    }

    // Normalize CIN
    cin = cin.toUpperCase().trim();

    // Check if CIN already exists in our registered companies database
    const existingCompany = await Company.findOne({ cin });
    if (existingCompany) {
      return res.status(400).json({ 
        success: false, 
        message: 'A company with this CIN is already registered.' 
      });
    }

    // Call the live verification service
    const verificationResult = await verifyCompanyCin(cin, companyName, website);

    if (verificationResult.verified) {
      return res.status(200).json(verificationResult);
    } else {
      return res.status(400).json(verificationResult);
    }
  } catch (error) {
    console.error('Company verification error:', error);
    res.status(500).json({ success: false, message: 'Unable to verify the company right now. Please try again.' });
  }
};
