import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

//Update User profile
export const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const { fullname, email, avatar } = req.body;

  const newFullName = fullname?.charAt(0)?.toUpperCase() + fullname?.slice(1);

  if (avatar) req.body.avatar = avatar;
  if (fullname) req.body.fullname = newFullName;
  if (email) req.body.email = email;

  const user = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    useFindAndModify: true,
  });

  if (!user) return next(new ErrorHandler("Bad Request", 400));

  const { password, ...userInfo } = user._doc;

  res.status(200).json({
    message: "Updated user profile successfully",
    userInfo,
  });
});

// Update Password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id);
  const { oldPassword, newPassword } = req.body;

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordMatch) return next(new ErrorHandler("Invalid Password"));

  if (oldPassword === newPassword)
    return next(
      new ErrorHandler("It's your oldPassword ! try to enter new", 400)
    );

  const hashPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashPassword;

  await user.save();

  res.status(200).json({
    message: "Password Update successfully",
  });
});

//Get User Info
export const getUserInfo = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const { password, ...userInfo } = user._doc;

  res.status(200).json({
    message: "Successfully",
    userInfo,
  });
});