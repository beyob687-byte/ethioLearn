const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  schedule: {
    type: Date,
    required: [true, 'Schedule is required'],
  },
  seats: {
    type: Number,
    required: [true, 'Seats is required'],
    min: 0,
  },
  format: {
    type: String,
    enum: ['online', 'offline'],
    required: [true, 'Format is required'],
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Provider is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);
