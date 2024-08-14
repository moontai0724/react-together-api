import { Type } from "@sinclair/typebox";
import type { FastifyPluginCallback, FastifySchema } from "fastify";
import { pick, pickProperties } from "helpers/schema";
import { categorySchema } from "modules/category";
import { flickrPhotoSchema } from "modules/flickr-photo";
import { flickrPhotoSizeSchema } from "modules/flickr-photo-size";
import { photoRepository, photoSchema, photoService } from "modules/photo";
import { photoReactionSchema } from "modules/photo-reaction";
import { photographerSchema } from "modules/photographer";
import type { TypedRouteHandler } from "types/fastify";

const listPhotoItemSchema = Type.Object({
  ...pick(photoSchema.properties, ["id", "fileName"]),
  category: pickProperties(categorySchema, ["id", "label"]),
  photographer: pickProperties(photographerSchema, ["id", "name"]),
  flickrPhoto: pickProperties(flickrPhotoSchema, ["id", "url", "takenAt"]),
  flickrPhotoSizes: Type.Array(
    pickProperties(flickrPhotoSizeSchema, [
      "label",
      "width",
      "height",
      "source",
      "url",
    ]),
  ),
  reactions: Type.Object({
    like: Type.Integer({ description: "number of recommendations" }),
    dislike: Type.Integer({ description: "number of not recommendations" }),
    comments: Type.Array(photoReactionSchema.properties.comment),
  }),
  reaction: Type.Union([
    Type.Null(),
    Type.Object({
      recommend: photoReactionSchema.properties.isRecommended,
      comment: photoReactionSchema.properties.comment,
    }),
  ]),
});

const schema = {
  summary: "List photos",
  querystring: Type.Object({
    sort: Type.Optional(
      Type.Array(
        Type.Union([
          Type.Literal("DESC:takenAt"),
          Type.Literal("ASC:takenAt"),
          Type.Literal("DESC:updatedAt"),
          Type.Literal("ASC:updatedAt"),
        ]),
      ),
    ),
    photographerIds: Type.Optional(
      Type.Array(photographerSchema.properties.id),
    ),
    categoryIds: Type.Optional(Type.Array(categorySchema.properties.id)),
    page: Type.Optional(
      Type.Integer({ minimum: 1, description: "current page index" }),
    ),
    size: Type.Optional(Type.Integer({ minimum: 1, description: "page size" })),
  }),
  response: {
    "200": Type.Object({
      pagination: Type.Object({
        page: Type.Integer({ description: "current page index" }),
        size: Type.Integer({ description: "page size" }),
        last: Type.Integer({ description: "last page index" }),
      }),
      data: Type.Array(listPhotoItemSchema),
    }),
  },
} satisfies FastifySchema;

const controller: TypedRouteHandler<typeof schema> = async (request) => {
  const {
    sort,
    photographerIds,
    categoryIds,
    page = 1,
    size: limit = 40,
  } = request.query;
  const { id: userId } = request.user;

  const photos = await photoService.getAll({
    userId,
    orderBy: sort?.map((order) => {
      const [givenSort, givenKey] = order.split(":");
      const direction = (
        {
          DESC: "desc",
          ASC: "asc",
        } as const
      )[givenSort];
      const key = (
        {
          takenAt: "takenAt",
          updatedAt: "updatedAt",
        } as const
      )[givenKey];

      if (!direction || !key) throw new Error(`Invalid sort option: ${order}`);

      return { [key]: direction };
    }),
    photographerIds: photographerIds?.map(BigInt),
    categoryIds: categoryIds?.map(BigInt),
    page: {
      limit,
      offset: (page - 1) * limit,
    },
  });

  const total = await photoRepository.count({
    photographerIds: photographerIds?.map(BigInt),
    categoryIds: categoryIds?.map(BigInt),
  });

  return {
    pagination: {
      page,
      size: limit,
      last: Math.round(parseInt(total.toString(), 10) / limit),
    },
    data: photos,
  };
};

const router: FastifyPluginCallback = async (instance) => {
  instance.get("/", { schema }, controller);
};

export default router;
