const User = require('../models/User');

// ... (getApprovedStudents and getUnapprovedStudents functions remain the same) ...
exports.getApprovedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isApproved: true });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUnapprovedStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student', isApproved: false });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ CONFIRM THIS FUNCTION IS CORRECT
exports.approveStudent = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    if (student.isApproved) {
        return res.status(400).json({ error: 'Student is already approved' });
    }

    // Application-level check for a unique roll number
    let uniqueRollNo;
    let isUnique = false;
    while (!isUnique) {
      const timestamp = Date.now().toString();
      uniqueRollNo = `S-${timestamp.substring(timestamp.length - 6)}`;
      
      const existingStudent = await User.findOne({ rollNo: uniqueRollNo });
      if (!existingStudent) {
        isUnique = true;
      }
    }

    student.isApproved = true;
    student.rollNo = uniqueRollNo;
    
    await student.save();
    res.status(200).json({ success: true, message: 'Student approved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};