import mongoose from "mongoose";

export const StatusEnums = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  FAILED: "failed",
};

const jobSchema = mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(StatusEnums),
    },
    error: [
      {
        store_id: {
          type: String,
        },
        error: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
