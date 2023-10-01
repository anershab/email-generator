import path from "path";
import AutoLoad from "@fastify/autoload";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pass --options via CLI arguments in command to enable these options.
export const options = {};

const PORT = process.env.PORT || 8080;

export default async function (fastify, opts) {
  // This is where custom code goes!
  console.log(
    "\x1B[3m\x1b[36m################################################\n################################################\nEmail template transformer is live at port " +
      PORT +
      "\n################################################\n################################################\n\x1B[0m"
  );

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
}
