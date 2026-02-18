const mongoose = require('mongoose');
const reminderSchema = new mongoose.Schema({
  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  date: Date,
  notifyType: { type: String, enum: ['email', 'sms'], required: true },
  email: String,
  phone: String,
  sent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Reminder', reminderSchema);
