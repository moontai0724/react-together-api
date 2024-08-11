import { Type } from "@sinclair/typebox";
import { type FastifySchema } from "fastify";
import { NotFoundException, notFoundExceptionSchema } from "helpers/exceptions";
import * as photoRepository from "modules/photo/repositories";
import type { TypedRouteHandler } from "types/fastify";

import * as photoReactionRepository from "../repositories";
import { photoReactionSchema } from "../schema";

export const patchSchema = {
  summary: "Upsert own photo reaction",
  params: Type.Object({
    photoId: Type.Integer({ description: "photo id" }),
  }),
  body: Type.Object({
    isRecommended: Type.Boolean(),
    comment: Type.Optional(photoReactionSchema.properties.comment),
  }),
  response: {
    "201": {},
    "404": notFoundExceptionSchema,
  },
} satisfies FastifySchema;

export const patch: TypedRouteHandler<typeof patchSchema> = async (
  request,
  response,
) => {
  const { photoId } = request.params;
  const { id: userId } = request.user;

  const photoExists = await photoRepository.exists({ id: BigInt(photoId) });

  if (!photoExists) throw new NotFoundException();

  await photoReactionRepository.upsert({
    photoId: BigInt(photoId),
    userId: BigInt(userId),
    isRecommended: request.body.isRecommended,
    comment: request.body.comment,
  });

  response.status(201).send();
};
