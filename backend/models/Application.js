const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required'],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  motivation: {
    type: String,
    required: [true, 'Motivation is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

applicationSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
