import { resolve } from "node:path";

import fastifyAutoload from "@fastify/autoload";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import type { FastifyOptions } from "types/fastify";

import { openapiOptions } from "./configs";
import { errorHandlingPlugin } from "./middlewares";

// eslint-disable-next-line no-extend-native
Object.defineProperty(BigInt.prototype, "toJSON", {
  value() {
    return parseInt(this, 10);
  },
});

export async function buildApp(options: FastifyOptions = {}) {
  const app = Fastify(options as never);

  await Promise.all([
    app.register(errorHandlingPlugin),
    app.register(fastifySwagger, openapiOptions),
    app.register(fastifyCors, {
      origin: "*",
    }),
    app.register(fastifyAutoload, {
      dir: resolve(import.meta.dirname, "routes"),
      autoHooks: true,
      cascadeHooks: true,
      dirNameRoutePrefix: true,
      routeParams: true,
    }),
    app.register(fastifySwaggerUi),
  ]);

  console.log("Registered routes", app.printRoutes());

  return app;
}
