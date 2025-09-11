// backend/src/controllers/teacherController.js

const User = require('../models/User');
const Attendance = require('../models/Attendance');

const teacherController = {
  // ... (getApprovedStudents and getUnapprovedStudents functions are unchanged)
  getApprovedStudents: async (req, res) => {
    try {
      const students = await User.find({ role: 'student', isApproved: true });
      res.status(200).json(students);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getUnapprovedStudents: async (req, res) => {
    try {
      const students = await User.find({ role: 'student', isApproved: false });
      res.status(200).json(students);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  approveStudent: async (req, res) => {
    const { studentId } = req.params;
    try {
      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      if (student.isApproved) {
        return res.status(400).json({ error: 'Student is already approved' });
      }
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

      // ✅ **CHANGE**: Send the updated student back to the frontend
      res.status(200).json({ success: true, message: 'Student approved successfully', student });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // ... (saveAttendance and getAttendance functions are unchanged)
  saveAttendance: async (req, res) => {
    const { date, records } = req.body;
    lo
    try {
      let attendance = await Attendance.findOne({ date });
      if (!attendance) {
        attendance = new Attendance({ date, records: [] });
      }
      const recordsArray = Object.entries(records).map(([studentId, status]) => ({
        studentId,
        status,
      }));
      recordsArray.forEach(newRecord => {
        const existingRecordIndex = attendance.records.findIndex(
          dbRecord => dbRecord.studentId.toString() === newRecord.studentId
        );
        if (existingRecordIndex > -1) {
          attendance.records[existingRecordIndex].status = newRecord.status;
        } else {
          attendance.records.push(newRecord);
        }
      });
      await attendance.save();
      res.status(200).json({ success: true, message: 'Attendance saved successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAttendance: async (req, res) => {
    try {
      const attendanceData = await Attendance.find({}).populate('records.studentId', 'name rollNo');
      res.status(200).json(attendanceData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = teacherController;