import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  logo: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    minlength: [8, "Password must be at least 8 characters"],
    trim: true,
  },
  tag: [
    {
      type: String,
      required: true,
    },
  ],
  category: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
  },
  postBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Job", jobSchema);
