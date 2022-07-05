import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minlength: [5, "Full Name at least 5 characters"],
    maxlength: [30, "Full Name no longer exceeds 30 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters"],
    trim: true,
  },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
