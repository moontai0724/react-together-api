import Fastify from "fastify";

import type { FastifyOptions } from "./types/fastify";

export function buildApp(options: FastifyOptions = {}) {
  const app = Fastify(options as never);

  app.get("/", async () => ({ ping: "pong" }));

  return app;
}
