import type { FastifyPluginCallback } from "fastify";

import { healthCheckHandler } from "./health-check";

const handler: FastifyPluginCallback = async (instance) => {
  instance.get("/", healthCheckHandler);
};

export default handler;
