const express = require('express');
const {
  uploadMaterial,
  getMaterialsByCourse,
} = require('../controllers/materialController');
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post(
  '/',
  protect,
  authorizeRoles('provider'),
  upload.single('file'),
  uploadMaterial
);
router.get('/:courseId', protect, getMaterialsByCourse);

module.exports = router;
