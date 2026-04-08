const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpg|jpeg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    ext ? cb(null, true) : cb(new Error('Only PDF/JPG/PNG files allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});
app.locals.upload = upload;

// Import models
const User           = require('./models/User');
const Assignment     = require('./models/Assignment');
const Attendance     = require('./models/Attendance');
const Notice         = require('./models/Notice');
const ProblemReport  = require('./models/ProblemReport');
const Timetable      = require('./models/Timetable');
const Alumni         = require('./models/Alumni');
const Project        = require('./models/Project');
const Submission     = require('./models/Submission');
const Marks          = require('./models/Marks');
const IndustryProject= require('./models/IndustryProject');
const Notification   = require('./models/Notification');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
const visitorRoutes = require('./routes/visitor');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'mitadt_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mitadt_campus')
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    seedData();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

async function seedData() {
  try {
    // Default users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const studentPwd = await bcrypt.hash('123456', 10);
      const adminPwd = await bcrypt.hash('admin123', 10);
      await User.create([
        { name: 'Test Student', email: 'student@mitadt.edu', password: studentPwd, role: 'student' },
        { name: 'Faculty User', email: 'admin@mitadt.edu', password: adminPwd, role: 'admin' }
      ]);
      console.log('✅ Default users created');
    }

    // Seed timetable
    const ttCount = await Timetable.countDocuments();
    if (ttCount === 0) {
      await Timetable.insertMany([
        { day: 'Monday', subject: 'Mathematical Foundations for Computing', faculty: 'Dr. Sharma', room: 'A101', time: '9:00 AM' },
        { day: 'Monday', subject: 'Programming Language – Python', faculty: 'Prof. Kulkarni', room: 'Lab 2', time: '11:00 AM' },
        { day: 'Tuesday', subject: 'Introduction to Data Structure', faculty: 'Dr. Patil', room: 'B202', time: '9:00 AM' },
        { day: 'Tuesday', subject: 'Digital Electronics', faculty: 'Prof. Joshi', room: 'C303', time: '2:00 PM' },
        { day: 'Wednesday', subject: 'Engineering Physics', faculty: 'Dr. Mehta', room: 'A102', time: '10:00 AM' },
        { day: 'Wednesday', subject: 'Professional Communication', faculty: 'Ms. Desai', room: 'D401', time: '1:00 PM' },
        { day: 'Thursday', subject: 'Design Thinking', faculty: 'Prof. Rao', room: 'E501', time: '9:00 AM' },
        { day: 'Thursday', subject: 'Computer Engineering Workshop', faculty: 'Dr. Singh', room: 'Lab 1', time: '2:00 PM' },
        { day: 'Friday', subject: 'Health Practices', faculty: 'Mr. Verma', room: 'Gym Hall', time: '8:00 AM' },
        { day: 'Friday', subject: 'Cultural Arts', faculty: 'Ms. Nair', room: 'Art Room', time: '3:00 PM' }
      ]);
      console.log('✅ Timetable seeded');
    }

    // Seed alumni
    const alumniCount = await Alumni.countDocuments();
    if (alumniCount === 0) {
      await Alumni.insertMany([
        { name: 'Rahul Sharma', graduationYear: 2022, company: 'TCS', jobRole: 'Software Engineer', linkedin: 'https://linkedin.com' },
        { name: 'Priya Patil', graduationYear: 2021, company: 'Infosys', jobRole: 'Data Analyst', linkedin: 'https://linkedin.com' },
        { name: 'Amit Kulkarni', graduationYear: 2020, company: 'Wipro', jobRole: 'Full Stack Developer', linkedin: 'https://linkedin.com' },
        { name: 'Sneha Joshi', graduationYear: 2023, company: 'Accenture', jobRole: 'Cloud Engineer', linkedin: 'https://linkedin.com' },
        { name: 'Rohan Mehta', graduationYear: 2022, company: 'Cognizant', jobRole: 'DevOps Engineer', linkedin: 'https://linkedin.com' },
        { name: 'Anjali Desai', graduationYear: 2021, company: 'HCL', jobRole: 'UI/UX Designer', linkedin: 'https://linkedin.com' }
      ]);
      console.log('✅ Alumni seeded');
    }
    // Seed marketplace projects
    const mpCount = await IndustryProject.countDocuments();
    if (mpCount === 0) {
      await IndustryProject.insertMany([
        {
          companyName: 'TCS Innovation Labs',
          projectTitle: 'AI-Powered Resume Screening Tool',
          description: 'Build an NLP-based system to automatically rank resumes based on job descriptions.',
          requiredSkills: ['Python', 'NLP', 'scikit-learn', 'Flask'],
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        {
          companyName: 'Infosys Digital',
          projectTitle: 'IoT Dashboard for Smart Campus',
          description: 'Develop a real-time IoT monitoring dashboard for campus energy management.',
          requiredSkills: ['Node.js', 'MQTT', 'React', 'MongoDB'],
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
        },
        {
          companyName: 'Wipro FinTech',
          projectTitle: 'Fraud Detection System',
          description: 'Design an ML model to detect fraudulent transactions in real-time with high accuracy.',
          requiredSkills: ['Python', 'TensorFlow', 'SQL', 'Docker'],
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
        }
      ]);
      console.log('✅ Marketplace projects seeded');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

// Routes
app.use('/', authRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);
app.use('/visitors', visitorRoutes);

app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect(req.session.userRole === 'student' ? '/student' : '/admin');
  }
  res.redirect('/login');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: err.message || 'Something went wrong!', error: {} });
});

app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found', error: {} });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MIT ADT Portal running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
