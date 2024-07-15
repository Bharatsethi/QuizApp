const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  plan: String,
  chapter: String,
  lesson: String,
  topic: String,
  question: String,
  answer: String,
  admin: String,
  username: String,
  email: String,
  password: String,
});

module.exports = mongoose.model('Translation', translationSchema);
