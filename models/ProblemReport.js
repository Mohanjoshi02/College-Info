const mongoose = require('mongoose');

const problemReportSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['Academic', 'Attendance', 'Infrastructure', 'Technical', 'Fee'], required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProblemReport', problemReportSchema);
