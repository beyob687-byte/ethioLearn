const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: [true, 'Session is required'],
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required'],
  },
  markedAt: {
    type: Date,
    default: Date.now,
  },
});

attendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
