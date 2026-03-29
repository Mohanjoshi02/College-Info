const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: String, required: true },
  githubLink: { type: String, default: '' },
  demoLink: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
