const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required'],
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  },
  fileType: {
    type: String,
    enum: ['pdf', 'ppt'],
    required: [true, 'File type is required'],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Material', materialSchema);
