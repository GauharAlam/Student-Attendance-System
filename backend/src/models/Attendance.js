const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  records: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent'],
      required: true,
    },
  }],
}, { timestamps: true });

// Ensure that a student's attendance is recorded only once per day
// attendanceSchema.index({ date: 1, 'records.studentId': 1 }, { unique: true }); // REMOVE THIS LINE

module.exports = mongoose.model('Attendance', attendanceSchema);