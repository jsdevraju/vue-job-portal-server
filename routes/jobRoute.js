import { Router } from "express";
import { createValidator } from "express-joi-validation";
import Joi from "joi";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getSingleJob,
  updateJob,
} from "../controllers/jobCtrl.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();
const validator = createValidator({});

const jobSchema = Joi.object({
  logo: Joi.string().required(),
  title: Joi.string().min(5).max(30).required(),
  description: Joi.string().min(20).max(400).required(),
  tag: Joi.array().required(),
  category: Joi.string().min(3).max(15).required(),
  salary: Joi.number().min(3).required(),
  location: Joi.string().min(3).max(30).required(),
  jobType: Joi.string().min(3).max(20).required(),
});

router.post(
  "/create/job",
  validator.body(jobSchema),
  isAuthenticated,
  createJob
);
router.get("/jobs", getAllJobs);
router.get("/job/:id", getSingleJob);
router.put("/job/:id", isAuthenticated, updateJob);
router.delete("/job/:id", isAuthenticated, deleteJob);

export default router;
