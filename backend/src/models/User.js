const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, 
    },
    rollNo: { // Add this new field
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values, but unique if not null
      default: null,
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