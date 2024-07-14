const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model('Plan', planSchema);
