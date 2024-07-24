const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added admin reference
  title: { type: String, required: true },
  content: { type: String, required: true },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', LessonSchema);