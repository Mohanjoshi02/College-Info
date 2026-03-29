const express = require('express');
const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const Notice = require('../models/Notice');
const ProblemReport = require('../models/ProblemReport');
const Timetable = require('../models/Timetable');
const Alumni = require('../models/Alumni');
const Project = require('../models/Project');
const router = express.Router();

const requireStudent = (req, res, next) => {
  if (!req.session.userId || req.session.userRole !== 'student') return res.redirect('/login');
  next();
};

// ── Dashboard ──────────────────────────────────────────────────────────────────
router.get('/', requireStudent, async (req, res) => {
  try {
    const [assignments, attendance, notices] = await Promise.all([
      Assignment.find().sort({ dueDate: 1 }),
      Attendance.find({ student: req.session.userId }),
      Notice.find().sort({ createdAt: -1 }).limit(5)
    ]);
    const feeData = { totalFee: 150000, paidAmount: 150000, remainingAmount: 0, percentage: 100 };
    res.render('student/dashboard', {
      user: { name: req.session.userName },
      assignments, attendance, notices, feeData
    });
  } catch (err) {
    res.render('error', { message: 'Error loading dashboard', error: {} });
  }
});

// ── Timetable ──────────────────────────────────────────────────────────────────
router.get('/timetable', requireStudent, async (req, res) => {
  const timetable = await Timetable.find().sort({ day: 1 });
  res.render('student/timetable', { user: { name: req.session.userName }, timetable });
});

// ── Alumni ─────────────────────────────────────────────────────────────────────
router.get('/alumni', requireStudent, async (req, res) => {
  const alumni = await Alumni.find().sort({ graduationYear: -1 });
  res.render('student/alumni', { user: { name: req.session.userName }, alumni });
});

// ── Coding Practice ────────────────────────────────────────────────────────────
router.get('/coding', requireStudent, (req, res) => {
  res.render('student/coding', { user: { name: req.session.userName } });
});

// ── Hackathons ─────────────────────────────────────────────────────────────────
router.get('/hackathons', requireStudent, (req, res) => {
  res.render('student/hackathons', { user: { name: req.session.userName } });
});

// ── Internships ────────────────────────────────────────────────────────────────
router.get('/internships', requireStudent, (req, res) => {
  res.render('student/internships', { user: { name: req.session.userName } });
});

// ── Interview Prep ─────────────────────────────────────────────────────────────
router.get('/interview', requireStudent, (req, res) => {
  res.render('student/interview', { user: { name: req.session.userName } });
});

// ── Resume Builder ─────────────────────────────────────────────────────────────
router.get('/resume', requireStudent, (req, res) => {
  res.render('student/resume', { user: { name: req.session.userName } });
});

// ── Project Showcase ───────────────────────────────────────────────────────────
router.get('/projects', requireStudent, async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.render('student/projects', { user: { name: req.session.userName }, projects });
});

router.post('/projects', requireStudent, async (req, res) => {
  const { title, description, technologies, githubLink, demoLink } = req.body;
  await Project.create({
    student: req.session.userId,
    studentName: req.session.userName,
    title, description, technologies, githubLink, demoLink
  });
  res.redirect('/student/projects');
});

// ── Problem Reports ────────────────────────────────────────────────────────────
router.get('/report', requireStudent, async (req, res) => {
  const reports = await ProblemReport.find({ student: req.session.userId }).sort({ createdAt: -1 });
  res.render('student/report', { user: { name: req.session.userName }, reports, success: req.query.success });
});

router.post('/report', requireStudent, async (req, res) => {
  const { category, description, date } = req.body;
  await ProblemReport.create({
    student: req.session.userId,
    studentName: req.session.userName,
    category, description,
    date: new Date(date)
  });
  res.redirect('/student/report?success=1');
});

module.exports = router;
