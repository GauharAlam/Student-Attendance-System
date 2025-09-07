const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authMiddleware, teacherMiddleware } = require('../middleware/authMiddleware');

// Student Management Routes
router.get('/approved-students', authMiddleware, teacherMiddleware, teacherController.getApprovedStudents);
router.get('/unapproved-students', authMiddleware, teacherMiddleware, teacherController.getUnapprovedStudents);
router.patch('/approve-student/:studentId', authMiddleware, teacherMiddleware, teacherController.approveStudent);

// Attendance Routes
router.post('/attendance', authMiddleware, teacherMiddleware, teacherController.saveAttendance);
router.get('/attendance', authMiddleware, teacherMiddleware, teacherController.getAttendance);

module.exports = router;