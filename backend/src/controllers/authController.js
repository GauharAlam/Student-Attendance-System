const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const sendEmail = require("../utils/sendEmail"); // No longer needed for this controller

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log('h', req.body)
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ FIX: Create user as verified since OTP is removed
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verified: true, // <-- Set to true
      role,
      isApproved: role === 'student' ? false : true
    });
    await user.save();

    // Respond with success directly
    res.status(201).json({ success: true, message: 'Registration successful. You can now log in.' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate OTP (REMOVED)

// Verify OTP (REMOVED)

// Login an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Ensure user is verified (REMOVED)

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    // ✅ FIX: Add 'isApproved' to the JWT payload
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name, rollNo: user.rollNo, isApproved: user.isApproved },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7h' }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      // ✅ FIX: Add 'isApproved' to the user object
      user: { id: user._id, name: user.name, email: user.email, role: user.role, rollNo: user.rollNo, isApproved: user.isApproved },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout user (client-side handles token removal)
exports.logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logout successful' });
};