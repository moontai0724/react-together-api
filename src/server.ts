import { buildApp } from "./index";
import { authPlugin } from "./middlewares";

const fastify = await buildApp({
  logger: true,
});

await fastify.register(authPlugin);

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
