require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const materialRoutes = require('./routes/materialRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const userRoutes = require('./routes/userRoutes');

connectDB();

const app = express();

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests, please try again later',
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EthioLearn Connect API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EthioLearn Connect server running on port ${PORT}`);
});
