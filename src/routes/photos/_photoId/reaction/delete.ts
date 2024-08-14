import { Type } from "@sinclair/typebox";
import type { FastifyPluginCallback, FastifySchema } from "fastify";
import { photoReactionRepository } from "modules/photo-reaction";
import type { TypedRouteHandler } from "types/fastify";

const schema = {
  summary: "Delete own photo reaction",
  params: Type.Object({
    photoId: Type.Integer({ description: "photo id" }),
  }),
  response: {
    "204": {},
  },
} satisfies FastifySchema;

const controller: TypedRouteHandler<typeof schema> = async (
  request,
  response,
) => {
  const { photoId } = request.params;
  const { id: userId } = request.user;

  await photoReactionRepository.delete({
    photoId: BigInt(photoId),
    userId: BigInt(userId),
  });

  response.status(204).send();
};

const router: FastifyPluginCallback = async (instance) => {
  instance.delete("/", { schema }, controller);
};

export default router;
