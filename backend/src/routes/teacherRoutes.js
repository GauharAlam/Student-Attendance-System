const express = require('express');
const router = express.Router();
const { getUnapprovedStudents, approveStudent } = require('../controllers/teacherController');
const { protect, isTeacher } = require('../middleware/authMiddleware');

// GET /api/teacher/unapproved-students
router.get('/unapproved-students', protect, isTeacher, getUnapprovedStudents);

// PUT /api/teacher/approve-student/:studentId
router.put('/approve-student/:studentId', protect, isTeacher, approveStudent);

module.exports = router;