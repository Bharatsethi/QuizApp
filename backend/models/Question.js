const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added admin reference
  text: { type: String, required: true },
  type: { type: String, enum: ['multiple-choice', 'free-text'], required: true },
  options: [{ type: String }],
  correctAnswers: [{ type: String }], // Updated to an array of correct answers
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);