const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    rollNo: {
      type: String,
      default: null,
      unique: true, // <-- Add this
      sparse: true,  // <-- Add this. This is the fix.
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    isApproved: {
      type: Boolean,
      default: function() {
        return this.role !== 'student';
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);