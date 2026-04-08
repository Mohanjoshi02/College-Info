const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String },
  subject: { type: String, required: true },
  examType: { type: String, default: 'Mid-Semester I', enum: ['Mid-Semester I', 'Mid-Semester II', 'End-Semester'] },
  internalMarks: { type: Number, default: 0, min: 0, max: 50 },
  finalMarks: { type: Number, default: 0, min: 0, max: 100 },
  totalMarks: { type: Number, default: 0 },
  grade: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-compute grade
marksSchema.pre('save', function(next) {
  if (!this.grade) {
    this.totalMarks = this.internalMarks + this.finalMarks;
    const pct = (this.totalMarks / 150) * 100;
    if (pct >= 90) this.grade = 'O';
    else if (pct >= 80) this.grade = 'A+';
    else if (pct >= 70) this.grade = 'A';
    else if (pct >= 60) this.grade = 'B+';
    else if (pct >= 50) this.grade = 'B';
    else if (pct >= 40) this.grade = 'C';
    else this.grade = 'F';
  }
  next();
});

module.exports = mongoose.model('Marks', marksSchema);
