const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true
}));
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  xFrameOptions: false,
  contentSecurityPolicy: false,
}));
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Route files
const auth = require('./routes/auth');
const profile = require('./routes/profile');
const jobs = require('./routes/jobs');
const ats = require('./routes/ats');
const applications = require('./routes/applications');
const roadmap = require('./routes/roadmap');
const notifications = require('./routes/notifications');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/jobs', jobs);
app.use('/api/ats', ats);
app.use('/api/applications', applications);
app.use('/api/roadmap', roadmap);
app.use('/api/notifications', notifications);

// Basic route
app.get('/', (req, res) => {
  res.send('Career Connect Portal API is running');
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });
