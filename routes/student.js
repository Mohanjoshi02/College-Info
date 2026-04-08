const express = require('express');
const multer  = require('multer');
const path    = require('path');
const Assignment     = require('../models/Assignment');
const Attendance     = require('../models/Attendance');
const Notice         = require('../models/Notice');
const ProblemReport  = require('../models/ProblemReport');
const Timetable      = require('../models/Timetable');
const Alumni         = require('../models/Alumni');
const Project        = require('../models/Project');
const Submission     = require('../models/Submission');
const Marks          = require('../models/Marks');
const IndustryProject= require('../models/IndustryProject');
const Notification   = require('../models/Notification');
const User           = require('../models/User');
const router = express.Router();

// Multer for student submissions
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
    /pdf/i.test(path.extname(file.originalname)) ? cb(null, true) : cb(new Error('Only PDF allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

const requireStudent = (req, res, next) => {
  if (!req.session.userId || req.session.userRole !== 'student') return res.redirect('/login');
  next();
};

// Helper: fetch notifications for current student
async function getNotifications(userId) {
  try { return await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(15); }
  catch(e) { return []; }
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
router.get('/', requireStudent, async (req, res) => {
  try {
    const [assignments, attendance, notices, notifications, timetable] = await Promise.all([
      Assignment.find().sort({ dueDate: 1 }),
      Attendance.find({ student: req.session.userId }),
      Notice.find().sort({ createdAt: -1 }).limit(5),
      getNotifications(req.session.userId),
      Timetable.find().sort({ day: 1 })
    ]);
    const feeData = { totalFee: 150000, paidAmount: 150000, remainingAmount: 0, percentage: 100 };
    res.render('student/dashboard', {
      user: { name: req.session.userName },
      assignments, attendance, notices, feeData, notifications, timetable
    });
  } catch (err) {
    res.render('error', { message: 'Error loading dashboard', error: {} });
  }
});

// ── Assignments (dedicated page) ────────────────────────────────────────────────
router.get('/assignments', requireStudent, async (req, res) => {
  const [assignments, submissions, notifications] = await Promise.all([
    Assignment.find().sort({ dueDate: 1 }),
    Submission.find({ student: req.session.userId }),
    getNotifications(req.session.userId)
  ]);
  res.render('student/assignments', {
    user: { name: req.session.userName }, assignments, submissions, notifications,
    success: req.query.success, error: req.query.error
  });
});

// ── Submit assignment ──────────────────────────────────────────────────────────
router.post('/assignments/:id/submit', requireStudent, upload.single('submissionFile'), async (req, res) => {
  try {
    const existing = await Submission.findOne({ assignment: req.params.id, student: req.session.userId });
    if (existing) return res.redirect('/student/assignments?error=Already+submitted');
    const dueDate = (await Assignment.findById(req.params.id))?.dueDate;
    const isLate = dueDate && new Date() > new Date(dueDate);
    await Submission.create({
      assignment: req.params.id,
      student: req.session.userId,
      studentName: req.session.userName,
      pdfFile: req.file ? req.file.filename : '',
      status: isLate ? 'late' : 'submitted'
    });
    res.redirect('/student/assignments?success=1');
  } catch (err) {
    res.redirect('/student/assignments?error=Upload+failed');
  }
});

// ── Attendance (dedicated page) ────────────────────────────────────────────────
router.get('/attendance', requireStudent, async (req, res) => {
  const [attendance, notifications] = await Promise.all([
    Attendance.find({ student: req.session.userId }),
    getNotifications(req.session.userId)
  ]);
  res.render('student/attendance', { user: { name: req.session.userName }, attendance, notifications });
});

// ── Notices (dedicated page) ───────────────────────────────────────────────────
router.get('/notices', requireStudent, async (req, res) => {
  const [notices, notifications] = await Promise.all([
    Notice.find().sort({ createdAt: -1 }),
    getNotifications(req.session.userId)
  ]);
  res.render('student/notices', { user: { name: req.session.userName }, notices, notifications });
});

// ── Fee Status ─────────────────────────────────────────────────────────────────
router.get('/fees', requireStudent, async (req, res) => {
  const notifications = await getNotifications(req.session.userId);
  const feeData = { totalFee: 150000, paidAmount: 150000, remainingAmount: 0, percentage: 100 };
  res.render('student/fee-status', { user: { name: req.session.userName }, notifications, feeData });
});

router.get('/fee-status', requireStudent, async (req, res) => {
  const notifications = await getNotifications(req.session.userId);
  const feeData = { totalFee: 150000, paidAmount: 150000, remainingAmount: 0, percentage: 100 };
  res.render('student/fee-status', { user: { name: req.session.userName }, notifications, feeData });
});

// ── Marks & Grades ─────────────────────────────────────────────────────────────
router.get('/marks', requireStudent, async (req, res) => {
  const [marks, notifications] = await Promise.all([
    Marks.find({ student: req.session.userId }),
    getNotifications(req.session.userId)
  ]);
  res.render('student/marks', { user: { name: req.session.userName }, marks, notifications });
});

// ── Timetable ──────────────────────────────────────────────────────────────────
router.get('/timetable', requireStudent, async (req, res) => {
  const [timetable, notifications] = await Promise.all([
    Timetable.find().sort({ day: 1 }),
    getNotifications(req.session.userId)
  ]);
  res.render('student/timetable', { user: { name: req.session.userName }, timetable, notifications });
});

// ── Alumni ─────────────────────────────────────────────────────────────────────
router.get('/alumni', requireStudent, async (req, res) => {
  const [alumni, notifications] = await Promise.all([
    Alumni.find().sort({ graduationYear: -1 }),
    getNotifications(req.session.userId)
  ]);
  res.render('student/alumni', { user: { name: req.session.userName }, alumni, notifications });
});

// ── Coding Practice ────────────────────────────────────────────────────────────
router.get('/coding', requireStudent, async (req, res) => {
  const notifications = await getNotifications(req.session.userId);
  res.render('student/coding', { user: { name: req.session.userName }, notifications });
});

// ── Hackathons ─────────────────────────────────────────────────────────────────
router.get('/hackathons', requireStudent, async (req, res) => {
  const notifications = await getNotifications(req.session.userId);
  res.render('student/hackathons', { user: { name: req.session.userName }, notifications });
});

// ── Internships ────────────────────────────────────────────────────────────────
router.get('/internships', requireStudent, async (req, res) => {
  const notifications = await getNotifications(req.session.userId);
  res.render('student/internships', { user: { name: req.session.userName }, notifications });
});

// ── Interview Prep ─────────────────────────────────────────────────────────────
router.get('/interview', requireStudent, async (req, res) => {
  const notifications = await getNotifications(req.session.userId);
  res.render('student/interview', { user: { name: req.session.userName }, notifications });
});

// ── Resume Builder ─────────────────────────────────────────────────────────────
router.get('/resume', requireStudent, async (req, res) => {
  const notifications = await getNotifications(req.session.userId);
  // Simple in-session resume data (no DB model needed for prototype)
  const resumeData = req.session.resumeData || {};
  const skills = (resumeData.skills || []);
  const atsScore = Math.min(100, Math.max(20,
    (resumeData.github ? 15 : 0) +
    (resumeData.linkedin ? 15 : 0) +
    (skills.length > 5 ? 20 : skills.length * 3) +
    (resumeData.projects ? 20 : 0) +
    (resumeData.certifications ? 15 : 0) +
    (resumeData.email ? 10 : 0) + 25
  ));
  res.render('student/resume', {
    user: { name: req.session.userName }, notifications,
    resumeData, atsScore, viewCount: resumeData.viewCount || 0,
    success: req.query.success
  });
});

router.post('/resume', requireStudent, (req, res) => {
  const { fullName, email, github, linkedin, skills, projects, certifications,
          phone, cgpa, showCgpa, achievements,
          leetcodeUsername, hackerrankUsername, codechefUsername,
          showLeetcode, showHackerrank, showCodechef } = req.body;
  const prev = req.session.resumeData || {};
  req.session.resumeData = {
    ...prev,
    fullName, email, github, linkedin,
    phone, cgpa, showCgpa: !!showCgpa,
    skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [],
    projects, certifications, achievements,
    leetcodeUsername, hackerrankUsername, codechefUsername,
    showLeetcode: !!showLeetcode, showHackerrank: !!showHackerrank, showCodechef: !!showCodechef,
    viewCount: prev.viewCount || 0
  };
  res.redirect('/student/resume?success=1');
});

// ── Project Showcase ───────────────────────────────────────────────────────────
router.get('/projects', requireStudent, async (req, res) => {
  const [projects, notifications] = await Promise.all([
    Project.find().sort({ createdAt: -1 }),
    getNotifications(req.session.userId)
  ]);
  res.render('student/projects', { user: { name: req.session.userName }, projects, notifications });
});

router.post('/projects', requireStudent, async (req, res) => {
  const { title, description, technologies, githubLink, demoLink } = req.body;
  await Project.create({ student: req.session.userId, studentName: req.session.userName, title, description, technologies, githubLink, demoLink });
  res.redirect('/student/projects');
});

// ── Industry Project Marketplace ───────────────────────────────────────────────
router.get('/marketplace', requireStudent, async (req, res) => {
  const [projects, notifications] = await Promise.all([
    IndustryProject.find().sort({ createdAt: -1 }),
    getNotifications(req.session.userId)
  ]);
  res.render('student/marketplace', {
    user: { name: req.session.userName }, projects, notifications,
    userId: req.session.userId, success: req.query.success
  });
});

router.post('/marketplace/:id/apply', requireStudent, async (req, res) => {
  try {
    const project = await IndustryProject.findById(req.params.id);
    if (!project) return res.redirect('/student/marketplace');
    const already = project.applicants.find(a => a.student && a.student.toString() === req.session.userId);
    if (!already) {
      project.applicants.push({ student: req.session.userId, studentName: req.session.userName });
      await project.save();
    }
    res.redirect('/student/marketplace?success=1');
  } catch(err) { res.redirect('/student/marketplace'); }
});

// ── Problem Reports ────────────────────────────────────────────────────────────
router.get('/report', requireStudent, async (req, res) => {
  const [reports, notifications] = await Promise.all([
    ProblemReport.find({ student: req.session.userId }).sort({ createdAt: -1 }),
    getNotifications(req.session.userId)
  ]);
  res.render('student/report', { user: { name: req.session.userName }, reports, notifications, success: req.query.success });
});

router.post('/report', requireStudent, async (req, res) => {
  const { category, description, date } = req.body;
  await ProblemReport.create({ student: req.session.userId, studentName: req.session.userName, category, description, date: new Date(date) });
  res.redirect('/student/report?success=1');
});

// ── Notifications: mark all read ───────────────────────────────────────────────
router.post('/notifications/read', requireStudent, async (req, res) => {
  await Notification.updateMany({ user: req.session.userId, isRead: false }, { isRead: true });
  res.json({ ok: true });
});

// ── Branch Module Pages ────────────────────────────────────────────────────────
router.get('/cad',              requireStudent, async (req, res) => { const n = await getNotifications(req.session.userId); res.render('student/cad',              { user: { name: req.session.userName }, notifications: n }); });
router.get('/design-challenges',requireStudent, async (req, res) => { const n = await getNotifications(req.session.userId); res.render('student/design-challenges', { user: { name: req.session.userName }, notifications: n }); });
router.get('/thermal-quiz',     requireStudent, async (req, res) => { const n = await getNotifications(req.session.userId); res.render('student/thermal-quiz',      { user: { name: req.session.userName }, notifications: n }); });
router.get('/network-sim',      requireStudent, async (req, res) => { const n = await getNotifications(req.session.userId); res.render('student/network-sim',       { user: { name: req.session.userName }, notifications: n }); });
router.get('/net-challenges',   requireStudent, async (req, res) => { const n = await getNotifications(req.session.userId); res.render('student/net-challenges',    { user: { name: req.session.userName }, notifications: n }); });
router.get('/net-security',     requireStudent, async (req, res) => { const n = await getNotifications(req.session.userId); res.render('student/net-security',      { user: { name: req.session.userName }, notifications: n }); });

module.exports = router;
