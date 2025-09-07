const User = require('../models/User');

// Get all unapproved students
exports.getUnapprovedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isApproved: false });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve a student
exports.approveStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    student.isApproved = true;
    await student.save();
    res.status(200).json({ success: true, message: 'Student approved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};