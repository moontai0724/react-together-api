import { resolve } from "node:path";

import fastifyAutoload from "@fastify/autoload";
import Fastify from "fastify";

import type { FastifyOptions } from "./types/fastify";

export function buildApp(options: FastifyOptions = {}) {
  const app = Fastify(options as never);

  app.register(fastifyAutoload, {
    dir: resolve(import.meta.dirname, "modules"),
    autoHooks: true,
    cascadeHooks: true,
    dirNameRoutePrefix: true,
    routeParams: true,
    matchFilter: /route.(js|ts)$/,
  });

  return app;
}
