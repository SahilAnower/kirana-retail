import express from "express";
import { getJobStatus, submitJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/submit", submitJob);

router.get("/status", getJobStatus);

export default router;
