const Course = require('../models/Course');
const AppError = require('../utils/AppError');

const getCourses = async (req, res) => {
  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.search) {
    filter.title = { $regex: req.query.search, $options: 'i' };
  }

  const courses = await Course.find(filter)
    .populate('providerId', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
};

const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id).populate(
    'providerId',
    'name email'
  );

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  res.status(200).json({
    success: true,
    data: course,
  });
};

const createCourse = async (req, res) => {
  const { title, description, category, schedule, seats, format } = req.body;

  if (!title || !description || !category || !schedule || seats == null || !format) {
    throw new AppError(
      'Please provide title, description, category, schedule, seats, and format',
      400
    );
  }

  const course = await Course.create({
    title,
    description,
    category,
    schedule,
    seats,
    format,
    providerId: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: course,
  });
};

const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.providerId.toString() !== req.user.id) {
    throw new AppError('Not authorized to update this course', 403);
  }

  const { title, description, category, schedule, seats, format } = req.body;

  if (title) course.title = title;
  if (description) course.description = description;
  if (category) course.category = category;
  if (schedule) course.schedule = schedule;
  if (seats != null) course.seats = seats;
  if (format) course.format = format;

  await course.save();

  res.status(200).json({
    success: true,
    data: course,
  });
};

const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  const isOwner = course.providerId.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError('Not authorized to delete this course', 403);
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
