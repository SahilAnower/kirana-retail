import Queue from "bull";
import { processImages } from "../utils/imageProcessing.js";
import Job, { StatusEnums } from "../models/Job.js";

export const queue = async () => {
  const imageQueue = new Queue("image-processing-queue", {
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    },
  });

  imageQueue.process(async (job) => {
    // console.log(job);

    const { jobId, visits } = job.data;
    const errors = [];

    for (const visit of visits) {
      const { store_id, image_url } = visit;

      for (const url of image_url) {
        try {
          const perimeter = await processImages(url);
          console.log(`Processed image at ${url}, Perimeter: ${perimeter}`);
        } catch (err) {
          errors.push({ store_id, error: err?.message });
        }
      }
    }

    if (errors.length > 0) {
      // await Job.updateOne(
      //   { jobId },
      //   { status: StatusEnums.FAILED, error: errors }
      // );
      job.data.errors = errors;
      throw new Error("Job failed due to processing errors.");
    }

    // await Job.updateOne({ jobId }, { status: StatusEnums.COMPLETED });

    return { message: "Job completed successfully." };
  });

  imageQueue.on("completed", async (job, result) => {
    const { jobId } = job.data;

    await Job.updateOne({ jobId }, { status: StatusEnums.COMPLETED });
  });

  imageQueue.on("failed", async (job, result) => {
    const { jobId, errors } = job.data;

    await Job.updateOne(
      { jobId },
      { status: StatusEnums.FAILED, error: errors }
    );
  });

  return imageQueue;
};

export default queue;
