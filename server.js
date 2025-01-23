import express from "express";
import dotenv from "dotenv";
import cluster from "cluster";
import os from "os";
import http from "http";
import process from "node:process";

import mongoInit from "./config/dbConfig.js";
import jobRoutes from "./routes/jobs.js";
import queue from "./jobs/jobQueue.js";

dotenv.config();

let imageQueue;

const app = express();

app.use(express.json());

app.use(
  "/api",
  (req, _, next) => {
    req.imageQueue = imageQueue;
    next();
  },
  jobRoutes
);

app.use("/health", (req, res) => {
  res.status(200).send("Service is healthy");
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, async () => {
//   try {
//     await mongoInit();
//     imageQueue = await queue();
//     // console.log(imageQueue);

//     console.log(`Server up 🚀 and is running on port http://localhost:${PORT}`);
//   } catch (error) {
//     console.error(error?.message);
//   }
// });

const serverId = process.env.SERVER_ID;

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log(`ServerId - ${serverId}, Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`ServerId - ${serverId}, Worker ${worker.process.pid} died`);
  });
} else {
  http.createServer(app).listen(PORT, async () => {
    try {
      imageQueue = await queue();
      await mongoInit();

      console.log(
        `ServerId - ${serverId}, Worker ${process.pid} is running on port http://localhost:${PORT}`
      );
    } catch (error) {
      console.error(error?.message);
    }
  });
}
