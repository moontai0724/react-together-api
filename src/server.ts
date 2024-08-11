import { buildApp } from "./index";
import { authPlugin } from "./middlewares";

const fastify = buildApp({
  logger: true,
});

fastify.register(authPlugin);

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
