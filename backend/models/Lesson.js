const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  title: { type: String, required: true },
  content: { type: String },
});

module.exports = mongoose.model('Lesson', lessonSchema);
