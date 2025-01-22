import { v4 as uuidv4 } from "uuid";
import { createJob, getJobInfo } from "../services/jobService.js";

export const submitJob = async (req, res) => {
  try {
    const { count, visits } = req.body;

    const imageQueue = req.imageQueue;

    if (!count || !visits || count !== visits.length) {
      return res
        .status(400)
        .json({ error: "Invalid payload. Count must match number of visits." });
    }

    const jobId = uuidv4();

    createJob({
      jobId,
      count,
      visits,
      imageQueue,
    });

    return res.status(200).json({ job_id: jobId });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};

export const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required." });
    }

    const job = await getJobInfo({ jobId });

    if (!job) {
      return res.status(400).json({});
    }

    return res.status(200).json({
      job_id: jobId,
      status: job.status,
      error: job.error.map(({ store_id, error }) => ({ store_id, error })),
    });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
};
