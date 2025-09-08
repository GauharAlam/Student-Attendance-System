const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { protect, isTeacher } = require('../middleware/authMiddleware');

// Student Management Routes
router.get('/approved-students', protect, isTeacher, teacherController.getApprovedStudents);
router.get('/unapproved-students', protect, isTeacher, teacherController.getUnapprovedStudents);
router.patch('/approve-student/:studentId', protect, isTeacher, teacherController.approveStudent);

// Attendance Routes
router.post('/attendance', protect, isTeacher, teacherController.saveAttendance);
router.get('/attendance', protect, isTeacher, teacherController.getAttendance);

module.exports = router;