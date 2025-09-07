const express = require('express');
const router = express.Router();
const { register, login, logout, generateOTP, verifyOTP } = require('../controllers/authController');
const { protect, isTeacher } = require('../middleware/authMiddleware');


// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

// POST /api/auth/otp
router.post('/otp', generateOTP);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTP);

// Example of a protected teacher route
router.get('/teacher-only', protect, isTeacher, (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome, Teacher!' });
});


module.exports = router;