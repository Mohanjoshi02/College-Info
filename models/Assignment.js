const mongoose = require('mongoose');

const SUBJECTS = [
  'Mathematical Foundations for Computing',
  'Introduction to Data Structure',
  'Programming Language – Python',
  'Engineering Physics',
  'Digital Electronics',
  'Professional Communication',
  'Design Thinking',
  'Health Practices',
  'Cultural Arts',
  'Computer Engineering Workshop'
];

const assignmentSchema = new mongoose.Schema({
  subject: { type: String, required: true, enum: SUBJECTS },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  pdfFile: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
module.exports.SUBJECTS = SUBJECTS;
