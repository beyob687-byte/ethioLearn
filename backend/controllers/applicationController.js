const Application = require('../models/Application');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');

const createApplication = async (req, res) => {
  const { courseId, motivation } = req.body;

  if (!courseId || !motivation) {
    throw new AppError('Please provide courseId and motivation', 400);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.seats <= 0) {
    throw new AppError('No available seats for this course', 400);
  }

  const application = await Application.create({
    studentId: req.user.id,
    courseId,
    motivation,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    data: application,
  });
};

const getMyApplications = async (req, res) => {
  const applications = await Application.find({ studentId: req.user.id })
    .populate('courseId', 'title schedule')
    .sort({ appliedAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
};

const getApplicationsByCourse = async (req, res) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.providerId.toString() !== req.user.id) {
    throw new AppError('Not authorized to view applications for this course', 403);
  }

  const applications = await Application.find({ courseId: req.params.courseId })
    .populate('studentId', 'name email')
    .sort({ appliedAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
};

const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  if (!status || !['accepted', 'rejected'].includes(status)) {
    throw new AppError('Status must be accepted or rejected', 400);
  }

  const application = await Application.findById(req.params.id);

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  const course = await Course.findById(application.courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.providerId.toString() !== req.user.id) {
    throw new AppError('Not authorized to update this application', 403);
  }

  if (application.status === status) {
    return res.status(200).json({
      success: true,
      data: application,
    });
  }

  if (status === 'accepted') {
    if (course.seats <= 0) {
      throw new AppError('No available seats for this course', 400);
    }
    course.seats -= 1;
    await course.save();
  }

  application.status = status;
  await application.save();

  res.status(200).json({
    success: true,
    data: application,
  });
};

module.exports = {
  createApplication,
  getMyApplications,
  getApplicationsByCourse,
  updateApplicationStatus,
};
