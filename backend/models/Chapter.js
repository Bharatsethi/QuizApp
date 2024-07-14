const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  title: { type: String, required: true },
  introduction: { type: String },
  overview: { type: String },
});

module.exports = mongoose.model('Chapter', chapterSchema);
