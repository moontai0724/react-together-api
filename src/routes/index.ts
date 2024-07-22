import { Type } from "@sinclair/typebox";
import type {
  FastifyPluginCallback,
  FastifySchema,
  RouteHandler,
} from "fastify";

const schema: FastifySchema = {
  summary: "Health check",
  description: "Health check",
  response: {
    200: Type.Object({
      ping: Type.Literal("pong"),
    }),
  },
};

const healthCheckHandler: RouteHandler = async () => ({ ping: "pong" });

const router: FastifyPluginCallback = async (instance) => {
  instance.get("/", { schema }, healthCheckHandler);
};

export default router;
