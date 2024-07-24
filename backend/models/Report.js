const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue: { type: String, required: true },
  status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Report', reportSchema);