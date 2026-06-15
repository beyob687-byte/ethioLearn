const express = require('express');
const {
  checkIn,
  getAttendanceBySession,
} = require('../controllers/attendanceController');
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/checkin', protect, authorizeRoles('student'), checkIn);
router.get(
  '/:sessionId',
  protect,
  authorizeRoles('provider'),
  getAttendanceBySession
);

module.exports = router;
