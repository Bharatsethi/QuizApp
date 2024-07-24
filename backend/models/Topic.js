const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added admin reference
  title: { type: String, required: true },
  content: { type: String, required: true },
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', TopicSchema);