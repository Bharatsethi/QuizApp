const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  lessonIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

module.exports = mongoose.model('Quiz', quizSchema);
