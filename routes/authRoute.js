import { Router } from "express";
import { createValidator } from "express-joi-validation";
import Joi from "joi";
import {
  changePassword,
  login,
  logout,
  register,
  sendResetCode,
  verifyCode,
} from "../controllers/authCtrl.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();
const validator = createValidator({});

// Validation
const registerSchema = Joi.object({
  fullname: Joi.string().min(5).max(30).required(),
  password: Joi.string().min(8).max(32).required(),
  email: Joi.string().email().required(),
  avatar:Joi.string()
});

// Validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required(),
});

// Validation
const sendEmail = Joi.object({
  email: Joi.string().email().required(),
});

// Validation
const resetCode = Joi.object({
  email: Joi.string().email().required(),
  resetCode: Joi.string().min(6).max(6).required(),
});

router.post("/register", validator.body(registerSchema), register);
router.post("/login", validator.body(loginSchema), login);
router.post("/reset-code", validator.body(sendEmail), sendResetCode);
router.post("/verify-code", validator.body(resetCode), verifyCode);
router.post("/change-password", validator.body(loginSchema), changePassword);
router.get("/logout", isAuthenticated, logout);

export default router;
