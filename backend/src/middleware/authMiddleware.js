const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes by verifying the JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // Get user from the token and attach to the request object
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if the user is a teacher
const isTeacher = (req, res, next) => {
  // ✅ FIX: Ensures the role check is for 'teacher'
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Teachers only.' });
  }
};

// Middleware to check if the user is a student
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Students only.' });
  }
};

// Export all middleware functions
module.exports = { protect, isTeacher, isStudent };