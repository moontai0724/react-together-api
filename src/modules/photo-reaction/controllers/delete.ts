import { Type } from "@sinclair/typebox";
import { type FastifySchema } from "fastify";
import type { TypedRouteHandler } from "types/fastify";

import * as photoReactionRepository from "../repositories";

export const deleteSchema = {
  summary: "Delete own photo reaction",
  params: Type.Object({
    photoId: Type.Integer({ description: "photo id" }),
  }),
  response: {
    "204": {},
  },
} satisfies FastifySchema;

const deleteReaction: TypedRouteHandler<typeof deleteSchema> = async (
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

export { deleteReaction as delete };
