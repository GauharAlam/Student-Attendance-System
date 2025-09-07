const User = require('../models/User');

// Get all approved students
exports.getApprovedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isApproved: true });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all unapproved students
exports.getUnapprovedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isApproved: false });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve a student and assign a roll number
exports.approveStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Check if the student is already approved
    if (student.isApproved) {
        return res.status(400).json({ error: 'Student is already approved' });
    }

    // Generate a unique roll number
    const timestamp = Date.now().toString();
    const uniqueRollNo = `S-${timestamp.substring(timestamp.length - 6)}`;

    student.isApproved = true;
    student.rollNo = uniqueRollNo; // Assign the roll number
    
    await student.save();
    res.status(200).json({ success: true, message: 'Student approved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};