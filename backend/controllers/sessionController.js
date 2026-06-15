const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session');
const Course = require('../models/Course');
const Application = require('../models/Application');
const AppError = require('../utils/AppError');

const createSession = async (req, res) => {
  const { courseId, meetLink, scheduledAt, checkInWindowMinutes } = req.body;

  if (!courseId || !meetLink || !scheduledAt) {
    throw new AppError('Please provide courseId, meetLink, and scheduledAt', 400);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.providerId.toString() !== req.user.id) {
    throw new AppError('Not authorized to create sessions for this course', 403);
  }

  const session = await Session.create({
    courseId,
    meetLink,
    scheduledAt,
    checkInToken: uuidv4(),
    checkInWindowMinutes: checkInWindowMinutes || 15,
  });

  res.status(201).json({
    success: true,
    data: session,
  });
};

const getSessionsByCourse = async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  const isProvider = course.providerId.toString() === req.user.id;

  if (!isProvider) {
    const acceptedApplication = await Application.findOne({
      studentId: req.user.id,
      courseId,
      status: 'accepted',
    });

    if (!acceptedApplication) {
      throw new AppError(
        'You must be an accepted student to view course sessions',
        403
      );
    }
  }

  const sessions = await Session.find({ courseId }).sort({ scheduledAt: 1 });

  res.status(200).json({
    success: true,
    count: sessions.length,
    data: sessions,
  });
};

module.exports = { createSession, getSessionsByCourse };
