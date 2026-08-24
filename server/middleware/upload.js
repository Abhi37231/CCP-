const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // If it's a resume (pdf/doc), upload as 'raw' so Cloudinary doesn't try to process it as an image
    if (file.fieldname === 'resume') {
      return {
        folder: 'career-connect/resumes',
        resource_type: 'auto',
        format: file.originalname.split('.').pop()
      };
    }
    return {
      folder: 'career-connect/images',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
    };
  }
});

// File filter (Only accept PDFs/DOCs for resumes, Images for logos)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed for resumes'), false);
    }
  } else if (file.fieldname === 'logo' || file.fieldname === 'avatar' || file.fieldname === 'profilePhoto') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  } else {
    cb(new Error(`Unknown field: ${file.fieldname}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
