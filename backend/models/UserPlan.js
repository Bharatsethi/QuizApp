const mongoose = require('mongoose');

const UserPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  assignedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserPlan', UserPlanSchema);
