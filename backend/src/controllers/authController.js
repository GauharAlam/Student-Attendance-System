const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/sendEmail");

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create user as unverified
    const user = new User({ name, email, password: hashedPassword, verified: false, role });
    await user.save();

    // Generate and send OTP
    await exports.generateOTP({ body: { email } }, res);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate OTP
exports.generateOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP via email
    await sendEmail(user.email, "Your OTP Code", `Your OTP is: ${otp}`);

    res.status(200).json({ success: true, message: 'OTP sent to your email. Please verify your account.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Account verified successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login an existing user (only if verified)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Ensure user is verified
    if (!user.verified) {
      return res.status(403).json({ error: 'Please verify your account before logging in' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    // Add name and rollNo to the JWT payload
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name, rollNo: user.rollNo },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, rollNo: user.rollNo },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout user (client-side handles token removal)
exports.logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logout successful' });
};