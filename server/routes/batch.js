import { Worker } from "worker_threads";
import path from "path";
import fs from "fs";
import { rimrafSync, rimraf } from "rimraf";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempDir = path.join(__dirname, "..", "temp");

class templatesArray {
  constructor(callback, desiredLength) {
    this.array = [];
    this.callback = callback;
    this.desiredLength = desiredLength;
  }
  push(item) {
    this.array.push(item);
    if (this.array.length >= this.desiredLength) {
      this.callback(this.array);
    }
  }
}

export default async function (fastify, opts) {
  fastify.post("/batch", async function (request, reply) {
    if (!request.body.batch) {
      return reply.code(400).send({ error: "No batch specified." });
    }
    const transformScript = path.resolve(
      __dirname,
      "../scripts/transformJsx.js"
    );
    const tranformArray = new templatesArray((transformedBatch) => {
      console.info("Batch has been transformed succsessfully!");
      reply
        .status(200)
        .header("Content-Type", "text/html; charset=utf-8")
        .send(JSON.stringify(transformedBatch));
      rimraf(tempDir);
    }, batch.length);

    if (fs.existsSync(tempDir)) {
      rimrafSync(tempDir);
    }
    fs.mkdirSync(tempDir);
    batch.forEach((entry) => {
      const workerId = uuidv4();
      const componentName = entry.template;
      const componentProps = entry.props || {};
      try {
        const worker = new Worker(transformScript, {
          workerData: {
            componentName,
            componentProps,
            workerId,
            isBatchJob: true,
          },
        });

        worker.on("message", (result) => {
          console.info(`Worker ${workerId} finished successfully!`);
          tranformArray.push(result);
        });

        worker.on("error", (error) => {
          console.error(`Error from worker ${workerId}:`, error);
          reply.status(500).send({ error });
        });
      } catch (error) {
        console.error(`Error creating worker ${workerId}:`, error);
        reply.status(500).send({ error });
      } finally {
      }
    });
    return reply;
  });
}
