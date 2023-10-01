"use strict";
import { config } from "dotenv";
config();
import Fastify from "fastify";
import closeWithGrace from "close-with-grace";

const app = Fastify({
  logger: true,
});

import appService from "./app.js";
app.register(appService);

const closeListeners = closeWithGrace(
  { delay: process.env.FASTIFY_CLOSE_GRACE_DELAY || 500 },
  async function ({ signal, err, manual }) {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  }
);

app.addHook("onClose", async (instance, done) => {
  closeListeners.uninstall();
  done();
});

app.listen({ port: process.env.PORT || 8080 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
