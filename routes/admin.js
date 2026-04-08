const express = require('express');
const multer  = require('multer');
const path    = require('path');
const Assignment     = require('../models/Assignment');
const Attendance     = require('../models/Attendance');
const Notice         = require('../models/Notice');
const User           = require('../models/User');
const ProblemReport  = require('../models/ProblemReport');
const Timetable      = require('../models/Timetable');
const Submission     = require('../models/Submission');
const Marks          = require('../models/Marks');
const IndustryProject= require('../models/IndustryProject');
const router = express.Router();

const { SUBJECTS } = require('../models/Assignment');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename:    (req, file, cb) => { const u = Date.now() + '-' + Math.round(Math.random() * 1e9); cb(null, u + path.extname(file.originalname)); }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    /pdf|jpg|jpeg|png/i.test(path.extname(file.originalname)) ? cb(null, true) : cb(new Error('Only PDF/JPG/PNG allowed'));
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

const requireAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.userRole !== 'admin') return res.redirect('/login');
  next();
};

// ── Faculty Dashboard ──────────────────────────────────────────────────────────
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [assignments, notices, students, reports, timetable] = await Promise.all([
      Assignment.find().sort({ createdAt: -1 }),
      Notice.find().sort({ createdAt: -1 }),
      User.find({ role: 'student' }),
      ProblemReport.find().sort({ createdAt: -1 }),
      Timetable.find()
    ]);
    res.render('admin/dashboard', { user: { name: req.session.userName }, assignments, notices, students, reports, timetable, SUBJECTS });
  } catch (err) { res.render('error', { message: 'Error loading dashboard', error: {} }); }
});

// ── Assignments ────────────────────────────────────────────────────────────────
router.get('/assignments', requireAdmin, async (req, res) => {
  const [assignments, submissions] = await Promise.all([
    Assignment.find().sort({ createdAt: -1 }),
    Submission.find()
  ]);
  res.render('admin/assignments', { user: { name: req.session.userName }, assignments, submissions, SUBJECTS, success: req.query.success });
});

router.post('/assignments', requireAdmin, upload.single('pdfFile'), async (req, res) => {
  try {
    const { subject, title, description, dueDate } = req.body;
    await Assignment.create({ subject, title, description, dueDate: new Date(dueDate), pdfFile: req.file ? req.file.filename : '' });
    res.redirect('/admin/assignments?success=1');
  } catch (err) { res.redirect('/admin/assignments'); }
});

router.post('/assignments/:id/delete', requireAdmin, async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.redirect('/admin/assignments');
});

// View submissions for an assignment
router.get('/assignments/:id/submissions', requireAdmin, async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  const submissions = await Submission.find({ assignment: req.params.id });
  res.render('admin/submissions', { user: { name: req.session.userName }, assignment, submissions });
});

// Grade a submission
router.post('/assignments/:id/submissions/:subId/grade', requireAdmin, async (req, res) => {
  const { marks, grade, comments } = req.body;
  await Submission.findByIdAndUpdate(req.params.subId, { marks: parseInt(marks), grade, comments, status: 'graded' });
  res.redirect('/admin/assignments/' + req.params.id + '/submissions');
});

// ── Notices ────────────────────────────────────────────────────────────────────
router.get('/notices', requireAdmin, async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.render('admin/notices', { user: { name: req.session.userName }, notices, success: req.query.success });
});

router.post('/notices', requireAdmin, async (req, res) => {
  await Notice.create({ title: req.body.title, message: req.body.message });
  res.redirect('/admin/notices?success=1');
});

router.post('/notices/:id/delete', requireAdmin, async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.redirect('/admin/notices');
});

// ── Attendance ─────────────────────────────────────────────────────────────────
router.get('/attendance', requireAdmin, async (req, res) => {
  const [students, attendance] = await Promise.all([
    User.find({ role: 'student' }),
    Attendance.find()
  ]);
  res.render('admin/attendance', { user: { name: req.session.userName }, students, attendance, SUBJECTS, success: req.query.success });
});

// Legacy bulk update
router.post('/attendance', requireAdmin, upload.single('supportFile'), async (req, res) => {
  try {
    const { studentId, subject, totalClasses, attendedClasses } = req.body;
    const doc = await Attendance.findOneAndUpdate(
      { student: studentId, subject },
      { totalClasses: parseInt(totalClasses), attendedClasses: parseInt(attendedClasses), updatedAt: new Date(), ...(req.file ? { supportFile: req.file.filename } : {}) },
      { upsert: true, new: true }
    );
    doc.percentage = doc.totalClasses > 0 ? (doc.attendedClasses / doc.totalClasses) * 100 : 0;
    await doc.save();
    res.redirect('/admin/attendance?success=1');
  } catch (err) { res.redirect('/admin/attendance'); }
});

// Quick-mark per student (called via fetch from new attendance UI)
router.post('/attendance/mark', requireAdmin, async (req, res) => {
  try {
    const { studentId, subject, totalClasses, attendedClasses } = req.body;
    const doc = await Attendance.findOneAndUpdate(
      { student: studentId, subject },
      { totalClasses: parseInt(totalClasses), attendedClasses: parseInt(attendedClasses), updatedAt: new Date() },
      { upsert: true, new: true }
    );
    doc.percentage = doc.totalClasses > 0 ? (doc.attendedClasses / doc.totalClasses) * 100 : 0;
    await doc.save();
    res.json({ ok: true, percentage: doc.percentage });
  } catch (err) { res.status(500).json({ ok: false }); }
});

// ── Marks ──────────────────────────────────────────────────────────────────────
router.get('/marks', requireAdmin, async (req, res) => {
  const students = await User.find({ role: 'student' });
  const marks    = await Marks.find();
  res.render('admin/marks', { user: { name: req.session.userName }, students, marks, SUBJECTS, success: req.query.success });
});

router.post('/marks', requireAdmin, async (req, res) => {
  const { studentId, studentName, subject, internalMarks, finalMarks } = req.body;
  const doc = await Marks.findOneAndUpdate(
    { student: studentId, subject },
    { studentName, internalMarks: parseInt(internalMarks), finalMarks: parseInt(finalMarks) },
    { upsert: true, new: true }
  );
  await doc.save(); // triggers grade pre-save
  res.redirect('/admin/marks?success=1');
});

// Bulk marks entry (subject + all students)
router.post('/marks/bulk', requireAdmin, async (req, res) => {
  try {
    const { subject, examType, students } = req.body;
    if (!subject || !students) return res.redirect('/admin/marks');

    const examMaxMarks = { 'Mid-Semester I': 30, 'Mid-Semester II': 30, 'End-Semester': 70 };
    const maxMarks = examMaxMarks[examType] || 30;

    const ops = Object.values(students).map(async s => {
      if (!s.id || s.marks === undefined || s.marks === '') return;
      const marks = parseInt(s.marks) || 0;
      const pct   = (marks / maxMarks) * 100;
      const grade = pct >= 90 ? 'O' : pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : 'F';

      // Store in internalMarks if mid-sem, finalMarks if end-sem
      const updateFields = examType === 'End-Semester'
        ? { studentName: s.name, finalMarks: marks, grade }
        : { studentName: s.name, internalMarks: marks, grade };

      await Marks.findOneAndUpdate(
        { student: s.id, subject, examType },
        { ...updateFields, subject, examType },
        { upsert: true, new: true }
      );
    });

    await Promise.all(ops);
    res.redirect('/admin/marks?success=1');
  } catch(err) {
    console.error('Bulk marks error:', err);
    res.redirect('/admin/marks');
  }
});


// ── Reports ────────────────────────────────────────────────────────────────────
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

// ── Industry Project Marketplace ───────────────────────────────────────────────
router.get('/marketplace', requireAdmin, async (req, res) => {
  const projects = await IndustryProject.find().sort({ createdAt: -1 });
  res.render('admin/marketplace', { user: { name: req.session.userName }, projects, success: req.query.success });
});

router.post('/marketplace', requireAdmin, async (req, res) => {
  const { companyName, projectTitle, description, requiredSkills, deadline } = req.body;
  await IndustryProject.create({
    companyName, projectTitle, description,
    requiredSkills: requiredSkills ? requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : [],
    deadline: new Date(deadline)
  });
  res.redirect('/admin/marketplace?success=1');
});

// Approve/reject student application
router.post('/marketplace/:id/applications/:studentId/:action', requireAdmin, async (req, res) => {
  const project = await IndustryProject.findById(req.params.id);
  if (project) {
    const app = project.applicants.find(a => a.student && a.student.toString() === req.params.studentId);
    if (app) { app.status = req.params.action === 'approve' ? 'approved' : 'rejected'; await project.save(); }
  }
  res.redirect('/admin/marketplace');
});

module.exports = router;
