const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true, trim: true },
  totalClasses: { type: Number, required: true, min: 0 },
  attendedClasses: { type: Number, required: true, min: 0 },
  percentage: { type: Number, default: 0 },
  supportFile: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

attendanceSchema.pre('save', function(next) {
  this.percentage = this.totalClasses > 0
    ? (this.attendedClasses / this.totalClasses) * 100
    : 0;
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
