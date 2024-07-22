import { resolve } from "node:path";

import fastifyAutoload from "@fastify/autoload";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import type { FastifyOptions } from "types/fastify";

import { openapiOptions } from "./persistance";

export function buildApp(options: FastifyOptions = {}) {
  const app = Fastify(options as never);

  app.register(fastifySwagger, openapiOptions);

  app.register(fastifyAutoload, {
    dir: resolve(import.meta.dirname, "routes"),
    autoHooks: true,
    cascadeHooks: true,
    dirNameRoutePrefix: true,
    routeParams: true,
  });

  app.register(fastifySwaggerUi);

  return app;
}
