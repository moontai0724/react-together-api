import { Type } from "@sinclair/typebox";
import type {
  FastifyPluginCallback,
  FastifySchema,
  RouteHandler,
} from "fastify";
import {
  photographerController,
  photographerSchema,
} from "modules/photographer";

const schema: FastifySchema = {
  summary: "List photographers",
  response: {
    200: Type.Object({
      data: Type.Array(photographerSchema),
    }),
  },
};

const controller: RouteHandler = async () => ({
  data: await photographerController.list(),
});

const router: FastifyPluginCallback = async (instance) => {
  instance.get("/", { schema }, controller);
};

export default router;
