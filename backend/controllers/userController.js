const User = require('../models/User');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');
const Application = require('../models/Application');
const AppError = require('../utils/AppError');

const getCommitment = async (req, res) => {
  const acceptedApplications = await Application.find({
    studentId: req.user.id,
    status: 'accepted',
  });

  const courseIds = acceptedApplications.map((app) => app.courseId);

  const totalSessions = await Session.countDocuments({
    courseId: { $in: courseIds },
  });

  const attended = await Attendance.countDocuments({
    studentId: req.user.id,
    sessionId: {
      $in: await Session.find({ courseId: { $in: courseIds } }).distinct('_id'),
    },
  });

  const commitmentScore =
    totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0;

  res.status(200).json({
    success: true,
    data: {
      totalSessions,
      attended,
      commitmentScore,
    },
  });
};

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
};

module.exports = { getCommitment, getAllUsers, deleteUser };
