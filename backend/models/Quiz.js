const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  contextId: { type: mongoose.Schema.Types.ObjectId, required: true },
  contextType: { type: String, enum: ['plan', 'chapter', 'lesson', 'topic'], required: true },
  title: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  googleFormUrl: { type: String },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
