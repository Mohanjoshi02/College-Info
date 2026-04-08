const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  pdfFile: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['submitted', 'graded', 'late'], default: 'submitted' },
  marks: { type: Number, default: null },
  grade: { type: String, default: '' },
  comments: { type: String, default: '' }
});

module.exports = mongoose.model('Submission', submissionSchema);
