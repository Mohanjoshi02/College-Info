const mongoose = require('mongoose');

const industryProjectSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  projectTitle: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }],
  deadline: { type: Date, required: true },
  postedBy: { type: String, default: 'Admin' },
  applicants: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    studentName: { type: String },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IndustryProject', industryProjectSchema);
