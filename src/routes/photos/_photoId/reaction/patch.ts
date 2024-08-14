import { Type } from "@sinclair/typebox";
import type { FastifyPluginCallback, FastifySchema } from "fastify";
import { NotFoundException, notFoundExceptionSchema } from "helpers/exceptions";
import { photoRepository } from "modules/photo";
import {
  photoReactionRepository,
  photoReactionSchema,
} from "modules/photo-reaction";
import type { TypedRouteHandler } from "types/fastify";

const schema = {
  summary: "Upsert own photo reaction",
  params: Type.Object({
    photoId: Type.Integer({ description: "photo id" }),
  }),
  body: Type.Object({
    isRecommended: Type.Boolean(),
    comment: photoReactionSchema.properties.comment,
  }),
  response: {
    "201": {},
    "404": notFoundExceptionSchema,
  },
} satisfies FastifySchema;

const controller: TypedRouteHandler<typeof schema> = async (
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

const router: FastifyPluginCallback = async (instance) => {
  instance.patch("/", { schema }, controller);
};

export default router;
