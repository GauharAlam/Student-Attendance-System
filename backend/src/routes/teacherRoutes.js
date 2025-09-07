const express = require('express');
const { getUnapprovedStudents, approveStudent, getApprovedStudents } = require('../controllers/teacherController');
const { protect, isTeacher } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/unapproved-students', protect, isTeacher, getUnapprovedStudents);
router.patch('/approve-student/:studentId', protect, isTeacher, approveStudent);
router.get('/approved-students', protect, isTeacher, getApprovedStudents); // Add this new route

module.exports = router;