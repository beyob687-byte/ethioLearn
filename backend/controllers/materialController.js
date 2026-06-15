const Material = require('../models/Material');
const Course = require('../models/Course');
const Application = require('../models/Application');
const AppError = require('../utils/AppError');
const { getFileType } = require('../utils/helpers');

const uploadMaterial = async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    throw new AppError('Please provide courseId', 400);
  }

  if (!req.file) {
    throw new AppError('Please upload a PDF or PPT file', 400);
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.providerId.toString() !== req.user.id) {
    throw new AppError('Not authorized to upload materials for this course', 403);
  }

  const fileType = getFileType(req.file.mimetype);
  if (!fileType) {
    throw new AppError('Only PDF and PPT files are allowed', 400);
  }

  const material = await Material.create({
    courseId,
    fileUrl: req.file.path,
    fileType,
    uploadedBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: material,
  });
};

const getMaterialsByCourse = async (req, res) => {
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
        'You must be an accepted student to access course materials',
        403
      );
    }
  }

  const materials = await Material.find({ courseId }).sort({ uploadedAt: -1 });

  res.status(200).json({
    success: true,
    count: materials.length,
    data: materials,
  });
};

module.exports = { uploadMaterial, getMaterialsByCourse };
