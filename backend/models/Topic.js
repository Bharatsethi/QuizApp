const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  title: { type: String, required: true },
  content: { type: String },
});

module.exports = mongoose.model('Topic', topicSchema);
