import { Type } from "@sinclair/typebox";
import type {
  FastifyPluginCallback,
  FastifySchema,
  RouteHandler,
} from "fastify";
import { categoryController, categorySchema } from "modules/category";

const schema: FastifySchema = {
  summary: "List categories",
  response: {
    200: Type.Object({
      data: Type.Array(categorySchema),
    }),
  },
};

const controller: RouteHandler = async () => ({
  data: await categoryController.list(),
});

const router: FastifyPluginCallback = async (instance) => {
  instance.get("/", { schema }, controller);
};

export default router;
