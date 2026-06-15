const Attendance = require('../models/Attendance');
const Session = require('../models/Session');
const Course = require('../models/Course');
const Application = require('../models/Application');
const AppError = require('../utils/AppError');
const { isWithinCheckInWindow } = require('../utils/helpers');

const checkIn = async (req, res) => {
  const { checkInToken } = req.body;

  if (!checkInToken) {
    throw new AppError('Please provide checkInToken', 400);
  }

  const session = await Session.findOne({ checkInToken });
  if (!session) {
    throw new AppError('Invalid check-in token', 404);
  }

  if (
    !isWithinCheckInWindow(session.scheduledAt, session.checkInWindowMinutes)
  ) {
    throw new AppError('Check-in window is closed', 400);
  }

  const acceptedApplication = await Application.findOne({
    studentId: req.user.id,
    courseId: session.courseId,
    status: 'accepted',
  });

  if (!acceptedApplication) {
    throw new AppError(
      'You must be an accepted student for this course to check in',
      403
    );
  }

  const attendance = await Attendance.create({
    sessionId: session._id,
    studentId: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Checked in successfully',
    data: attendance,
  });
};

const getAttendanceBySession = async (req, res) => {
  const session = await Session.findById(req.params.sessionId);

  if (!session) {
    throw new AppError('Session not found', 404);
  }

  const course = await Course.findById(session.courseId);
  if (!course) {
    throw new AppError('Course not found', 404);
  }

  if (course.providerId.toString() !== req.user.id) {
    throw new AppError('Not authorized to view attendance for this session', 403);
  }

  const enrolledCount = await Application.countDocuments({
    courseId: session.courseId,
    status: 'accepted',
  });

  const attendanceRecords = await Attendance.find({
    sessionId: session._id,
  })
    .populate('studentId', 'name email')
    .sort({ markedAt: -1 });

  const attended = attendanceRecords.length;
  const attendancePercentage =
    enrolledCount > 0 ? Math.round((attended / enrolledCount) * 100) : 0;

  const students = attendanceRecords.map((record) => ({
    name: record.studentId.name,
    email: record.studentId.email,
    markedAt: record.markedAt,
  }));

  res.status(200).json({
    success: true,
    data: {
      totalEnrolled: enrolledCount,
      attended,
      attendancePercentage,
      students,
    },
  });
};

module.exports = { checkIn, getAttendanceBySession };
