import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (fastify, opts) {
  fastify.get("/transform", async function (request, reply) {
    if (!request.template) {
      return reply.code(400).send({ error: "No template specified." });
    }
    const componentName = request.template;
    const componentProps = request.props || {};
    const workerId = uuidv4();
    try {
      const worker = new Worker(
        path.resolve(__dirname, "../scripts/transformJsx.js"),
        {
          workerData: { componentName, componentProps, workerId },
        }
      );

      worker.on("message", (result) => {
        console.info(`Worker ${workerId} finished successfully!`);
        reply
          .status(200)
          .header("Content-Type", "text/html; charset=utf-8")
          .send(result);
      });

      worker.on("error", (error) => {
        console.error(`Error from worker ${workerId}:`, error);
        reply.status(500).send({ error });
      });
    } catch (error) {
      console.error(`Error creating worker ${workerId}:`, error);
      reply.status(500).send({ error });
    }

    return reply;
  });
}
