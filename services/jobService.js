import Job, { StatusEnums } from "../models/Job.js";

export const createJob = ({ jobId, count, visits, imageQueue }) => {
  try {
    const job = new Job({
      jobId,
      status: StatusEnums.ONGOING,
    });
    job.save();

    imageQueue.add({ jobId, count, visits });
  } catch (error) {
    console.error(error?.message);
    throw error;
  }
};

export const getJobInfo = async ({ jobId }) => {
  try {
    const job = await Job.findOne({ jobId }).select("jobId status error");
    if (!job) {
      return null;
    }
    return job;
  } catch (error) {
    console.error(error?.message);
    throw error;
  }
};
