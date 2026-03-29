const express = require('express');
const multer = require('multer');
const path = require('path');
const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const Notice = require('../models/Notice');
const User = require('../models/User');
const ProblemReport = require('../models/ProblemReport');
const Timetable = require('../models/Timetable');
const router = express.Router();

const { SUBJECTS } = require('../models/Assignment');

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
    allowed.test(path.extname(file.originalname).toLowerCase())
      ? cb(null, true) : cb(new Error('Only PDF/JPG/PNG allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

const requireAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.userRole !== 'admin') return res.redirect('/login');
  next();
};

// ── Faculty Dashboard (overview) ──────────────────────────────────────────────
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [assignments, notices, students, reports, timetable] = await Promise.all([
      Assignment.find().sort({ createdAt: -1 }),
      Notice.find().sort({ createdAt: -1 }),
      User.find({ role: 'student' }),
      ProblemReport.find().sort({ createdAt: -1 }),
      Timetable.find()
    ]);
    res.render('admin/dashboard', {
      user: { name: req.session.userName },
      assignments, notices, students, reports, timetable, SUBJECTS
    });
  } catch (err) {
    res.render('error', { message: 'Error loading dashboard', error: {} });
  }
});

// ── Manage Assignments page ────────────────────────────────────────────────────
router.get('/assignments', requireAdmin, async (req, res) => {
  const assignments = await Assignment.find().sort({ createdAt: -1 });
  res.render('admin/assignments', { user: { name: req.session.userName }, assignments, SUBJECTS, success: req.query.success });
});

router.post('/assignments', requireAdmin, upload.single('pdfFile'), async (req, res) => {
  try {
    const { subject, title, description, dueDate } = req.body;
    await Assignment.create({
      subject, title, description,
      dueDate: new Date(dueDate),
      pdfFile: req.file ? req.file.filename : ''
    });
    res.redirect('/admin/assignments?success=1');
  } catch (err) {
    res.redirect('/admin/assignments');
  }
});

router.post('/assignments/:id/delete', requireAdmin, async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.redirect('/admin/assignments');
});

// ── Manage Notices page ────────────────────────────────────────────────────────
router.get('/notices', requireAdmin, async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.render('admin/notices', { user: { name: req.session.userName }, notices, success: req.query.success });
});

router.post('/notices', requireAdmin, async (req, res) => {
  const { title, message } = req.body;
  await Notice.create({ title, message });
  res.redirect('/admin/notices?success=1');
});

router.post('/notices/:id/delete', requireAdmin, async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.redirect('/admin/notices');
});

// ── Manage Attendance page ─────────────────────────────────────────────────────
router.get('/attendance', requireAdmin, async (req, res) => {
  const students = await User.find({ role: 'student' });
  res.render('admin/attendance', { user: { name: req.session.userName }, students, SUBJECTS, success: req.query.success });
});

router.post('/attendance', requireAdmin, upload.single('supportFile'), async (req, res) => {
  try {
    const { studentId, subject, totalClasses, attendedClasses } = req.body;
    const doc = await Attendance.findOneAndUpdate(
      { student: studentId, subject },
      {
        totalClasses: parseInt(totalClasses),
        attendedClasses: parseInt(attendedClasses),
        updatedAt: new Date(),
        ...(req.file ? { supportFile: req.file.filename } : {})
      },
      { upsert: true, new: true }
    );
    // recalc percentage
    doc.percentage = doc.totalClasses > 0 ? (doc.attendedClasses / doc.totalClasses) * 100 : 0;
    await doc.save();
    res.redirect('/admin/attendance?success=1');
  } catch (err) {
    res.redirect('/admin/attendance');
  }
});

// ── Problem Reports ────────────────────────────────────────────────────────────
router.get('/reports', requireAdmin, async (req, res) => {
  const reports = await ProblemReport.find().sort({ createdAt: -1 });
  res.render('admin/reports', { user: { name: req.session.userName }, reports });
});

router.post('/reports/:id/status', requireAdmin, async (req, res) => {
  await ProblemReport.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.redirect('/admin/reports');
});

// ── Timetable ──────────────────────────────────────────────────────────────────
router.get('/timetable', requireAdmin, async (req, res) => {
  const timetable = await Timetable.find().sort({ day: 1 });
  res.render('admin/timetable', { user: { name: req.session.userName }, timetable, SUBJECTS, success: req.query.success });
});

router.post('/timetable', requireAdmin, async (req, res) => {
  const { day, subject, faculty, room, time } = req.body;
  await Timetable.findOneAndUpdate({ day, subject }, { faculty, room, time }, { upsert: true, new: true });
  res.redirect('/admin/timetable?success=1');
});

router.post('/timetable/:id/delete', requireAdmin, async (req, res) => {
  await Timetable.findByIdAndDelete(req.params.id);
  res.redirect('/admin/timetable');
});

module.exports = router;
