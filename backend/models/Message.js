const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  message: {
    text: { type: String, required: true } // Ensure the text field is required
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added admin reference
  createdAt: { type: Date, default: Date.now } // Added createdAt field
});
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;