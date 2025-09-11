const Attendance = require('../models/Attendance');

// Get attendance for the logged-in student
exports.getStudentAttendance = async (req, res) => {
  try {
    // The student's ID is available from the protect middleware (req.user.id)
    const studentId = req.user.id;

    // Find all attendance documents that include a record for this student
    const attendanceRecords = await Attendance.find({ 'records.studentId': studentId })
      .sort({ date: -1 }); // Sort by date descending

    // Filter the records to return only the data for the specific student
    const studentData = attendanceRecords.map(record => {
      const studentRecord = record.records.find(
        r => r.studentId.toString() === studentId
      );
      return {
        date: record.date,
        status: studentRecord.status,
      };
    });

    res.status(200).json(studentData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};