const express = require('express');
const {
  createSession,
  getSessionsByCourse,
} = require('../controllers/sessionController');
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorizeRoles('provider'), createSession);
router.get('/course/:courseId', protect, getSessionsByCourse);

module.exports = router;
