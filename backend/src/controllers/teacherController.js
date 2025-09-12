// backend/src/controllers/teacherController.js

const User = require('../models/User');
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

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

  // Save Attendance
  saveAttendance: async (req, res) => {
    try {
      const { date, records } = req.body;

      if (!records || !Array.isArray(records) || records.length === 0) {
        return res.status(400).json({ error: "Attendance records are required" });
      }

      let attendance = await Attendance.findOne({ date });

      if (attendance) {
        // Update existing records
        records.forEach(record => {
          const { studentId, status } = record;
          const existingRecord = attendance.records.find(
            r => r.studentId.toString() === studentId,
          );
          if (existingRecord) {
            existingRecord.status = status;
          } else {
            attendance.records.push({ studentId, status });
          }
        });
      } else {
        // Create a new record
        attendance = new Attendance({
          date,
          records,
        });
      }

      await attendance.save();

      res.status(201).json({
        success: true,
        message: "Attendance saved successfully",
        data: attendance,
      });
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