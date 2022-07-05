import Job from "../models/jobModel.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

//Create Jobs
export const createJob = catchAsyncError(async (req, res, next) => {
  const { logo, title, description, salary, tag, category, location, jobType } =
    req.body;

  const job = await Job.create({
    postBy: req.user?._id,
    logo,
    title,
    description,
    salary,
    tag,
    category,
    location,
    jobType,
  });

  res.status(201).json({
    message: "Job Create Successfully",
    job,
  });
});

// Get All Jobs
export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const { search } = req.query;
  const jobs = await Job.find({
    title: { $regex: search, $options: "$i" },
  });

  res.status(200).json({
    jobs,
  });
});

// get single jobs
export const getSingleJob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) return next(new ErrorHandler("Not Found", 404));

  res.status(200).json({
    job,
  });
});

// update jobs
export const updateJob = catchAsyncError(async (req, res, next) => {
  const { logo, title, description, salary, tag, category, location, jobType } =
    req.body;

  if (logo) req.body.logo = logo;
  if (title) req.body.title = title;
  if (description) req.body.description = description;
  if (tag) req.body.tag = tag;
  if (category) req.body.category = category;
  if (salary) req.body.salary = salary;
  if (location) req.body.location = location;
  if (jobType) req.body.jobType = jobType;

  const postjob = await Job.findById(req.params.id);
  const authorPost = await Job.findOne({ postBy: req.user?._id });

  if (!authorPost) return next(new ErrorHandler("Your are not author this post", 404));
  if (!postjob) return next(new ErrorHandler("Not Found", 404));

  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    message: "Update Post Successfully",
    job,
  });
});

// Delete Jobs
export const deleteJob = catchAsyncError(async (req, res, next) => {
    const postJob = await Job.findById(req.params.id);
    const authorPost = await Job.findOne({ postBy: req.user.id });
    // if he try to update another person blog return this error
    if (!authorPost)
      return next(new ErrorHandler("Your are not author this post", 404));
    if (!postJob) return next(new ErrorHandler("Bad Requested", 400));
  
    const job = await Job.findById(req.params.id);
  
    await job.remove();
  
    res.status(200).json({
      message: "Delete Post Successfully",
    });
});
