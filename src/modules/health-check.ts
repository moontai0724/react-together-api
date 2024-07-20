import type { RouteHandler } from "fastify";

export const healthCheckHandler: RouteHandler = async () => ({ ping: "pong" });
