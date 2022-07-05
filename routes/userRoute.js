import { Router } from "express";
import { createValidator } from "express-joi-validation";
import Joi from "joi";
import { getUserInfo, updatePassword, updateUserProfile } from "../controllers/userCtrl.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();
const validator = createValidator({});

const updateSchema = Joi.object({
  fullname: Joi.string().min(5).max(30).required(),
  email: Joi.string().email().required(),
  avatar: Joi.string(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).max(32).required(),
  newPassword: Joi.string().min(8).max(32).required(),
});

router.post(
  "/update-profile",
  validator.body(updateSchema),
  isAuthenticated,
  updateUserProfile
);
router.post(
  "/update-password",
  validator.body(changePasswordSchema),
  isAuthenticated,
  updatePassword
);
router.get(
  "/profile",
  isAuthenticated,
  getUserInfo
);
export default router;
