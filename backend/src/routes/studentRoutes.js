const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, isStudent } = require('../middleware/authMiddleware');

// GET /api/student/attendance
// This route is protected and only accessible by logged-in students
router.get('/attendance', protect, isStudent, studentController.getStudentAttendance);

module.exports = router;