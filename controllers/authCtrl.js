import User from '../models/userModel.js';
import catchAsyncError from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import Code from '../models/resetModel.js'
import { nanoid } from 'nanoid';

//Register
export const register = catchAsyncError(async (req, res, next) => {
  const { fullname, email, password, avatar } = req.body;

  const newFullName = fullname?.charAt(0).toUpperCase() + fullname.slice(1);

  // hashing password
  const hashPassword = await bcrypt.hash(password, 12);

  const user = new User({
    fullname: newFullName,
    email,
    password: hashPassword,
    avatar
  });

  await user.save();

  //Generate a user token
  const token = generateToken(user?._id);

  const { password: myPassword, ...userInfo } = user._doc;

  res
    .cookie("token", token, {
      httpOnly: true,
    })
    .status(201)
    .json({
      message: "Register Successfully",
      userInfo,
      token,
    });
});

// Login
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) await next(new ErrorHandler("Invalid credentials", 400));

  const isPasswordVerified = await bcrypt.compare(password, user.password);
  if (!isPasswordVerified)
    return next(new ErrorHandler("Invalid credentials", 400));

  const { password: myPassword, ...userInfo } = user._doc;
  // Generate token
  const token = generateToken(user?._id);

  res
    .cookie("token", token, {
      httpOnly: true,
    })
    .status(200)
    .json({
      message: "Login Successfully",
      token: token,
      userInfo,
    });
});

// Logout
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      message: "Logged Our Successfully",
      token: null,
      userInfo: null,
    });
});


// Send Reset Code in email
export const sendResetCode = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  // Generate a random code
  const resetCode = nanoid(6).toUpperCase();

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("Credentials does not exist", 400));
  else {
    //send email
    sgMail.setApiKey(process.env.SENDGRID_SECRET);
    const msg = {
      to: email, // Change to your recipient
      from: process.env.GMAIL_ID, // Change to your verified sender
      subject: "Password reset code",
      text: "Do not share your password reset code with anyone.",
      html: `
      <h1>Hello Mr ${user?.fullname}👏</h1>
      <h1> Do not share your password reset code with anyone.</h1>
          <br>
          <center> <strong>${resetCode}</strong> </center/>
          `,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    const existingCode = await Code.findOne({ email }).select(
      "-__v -createdAt -updatedAt"
    );
    if (existingCode) {
      await Code.deleteOne({ email });
      const saveCode = new Code({ resetCode, email });
      await saveCode.save();
    } else {
        const saveCode = new Code({ resetCode, email });
        await saveCode.save();
    }

    res.status(200).json({
      message:
        "Email sent successfully ! Please check your email and verifyCode",
    });
  }
});

// After sent email now verifyCode
export const verifyCode = catchAsyncError(async (req, res, next) => {
  const { email, resetCode } = req.body;

  const code = await Code.findOne({ email });
  if (code === null) return next(new ErrorHandler("Invalid email or resetCode", 400));

  if (!code && code?.length === 0)
    return next(
      new ErrorHandler("Invalid or expired reset code, Please try again", 400)
    );
  else if (await code.comparetoken(resetCode, code.resetCode)) {
    code.isVerified = true;
    await code.save();
    res.status(200).json({
      message: "Change Password now",
    });
  } else return next(new ErrorHandler("Invalid or expired reset code", 400));
});

//After Verify Email && Password reset code now change password
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const verifyCode = await Code.findOne({ email });

  if (!verifyCode || !verifyCode.isVerified) {
    return next(
      new ErrorHandler("Invalid or expired reset code, Please try again.", 400)
    );
  } else {
    const updatePass = await User.findOne({ email });

    const hashingPassword = await bcrypt.hash(password, 12);

    updatePass.password = hashingPassword;

    await updatePass.save();

    await Code.deleteOne({ id: verifyCode._id });
    res.json({
      message: "Password Change Success. Please return and login again",
    });
  }
});


//Generate Random Token
function generateToken(payload) {
  const token = jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
}