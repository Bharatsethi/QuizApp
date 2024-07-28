const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ['multiple-choice', 'free-text'], required: true },
  options: [{
    text: { type: String, required: function() { return this.type === 'multiple-choice'; } },
    isCorrect: { type: Boolean, required: function() { return this.type === 'multiple-choice'; } }
  }],
  correctAnswers: [{ type: String }], // For free-text questions
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', QuestionSchema);
