const express = require('express');
const router = express.Router();
const { register, login, logout, generateOTP } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

// POST /api/auth/otp
router.post('/otp', generateOTP);

module.exports = router;
