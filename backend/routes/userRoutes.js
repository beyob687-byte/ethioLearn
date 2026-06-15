const express = require('express');
const {
  getCommitment,
  getAllUsers,
  deleteUser,
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/commitment', protect, authorizeRoles('student'), getCommitment);
router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;
