const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Please provide name, email, and password', 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const allowedRoles = ['student', 'provider'];
  const userRole =
    role && allowedRoles.includes(role) ? role : 'student';

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    passwordHash,
    role: userRole,
  });

  res.status(201).json({
    success: true,
    message: 'Registered successfully',
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+passwordHash'
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports = { register, login };
