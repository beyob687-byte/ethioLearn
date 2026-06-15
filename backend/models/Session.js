const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  meetLink: {
    type: String,
    required: [true, 'Meet link is required'],
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Scheduled time is required'],
  },
  checkInToken: {
    type: String,
    unique: true,
    required: true,
  },
  checkInWindowMinutes: {
    type: Number,
    default: 15,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Session', sessionSchema);
