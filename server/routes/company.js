const express = require('express');
const { verifyCompany } = require('../controllers/companyVerificationController');

const router = express.Router();

router.post('/verify', verifyCompany);

module.exports = router;
