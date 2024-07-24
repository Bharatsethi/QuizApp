const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }], // Added quizzes directly to plan
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', PlanSchema);