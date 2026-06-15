const express = require('express');
const {
  createApplication,
  getMyApplications,
  getApplicationsByCourse,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, authorizeRoles('student'), createApplication);
router.get('/my', protect, authorizeRoles('student'), getMyApplications);
router.get(
  '/course/:courseId',
  protect,
  authorizeRoles('provider'),
  getApplicationsByCourse
);
router.patch(
  '/:id',
  protect,
  authorizeRoles('provider'),
  updateApplicationStatus
);

module.exports = router;
