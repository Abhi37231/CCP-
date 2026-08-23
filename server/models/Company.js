const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  logo: {
    type: String,
    default: 'default-company-logo.png'
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description can not be more than 2000 characters']
  },
  industry: {
    type: String,
    required: [true, 'Please add an industry type']
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  isVerified: {
    type: Boolean,
    default: false // Admins can verify companies to give them a "Verified" badge
  }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
