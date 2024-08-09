import { Type } from "@sinclair/typebox";
import { type FastifySchema } from "fastify";
import { pick, pickProperties } from "helpers/schema";
import { categorySchema } from "modules/category";
import { flickrPhotoSchema } from "modules/flickr-photo";
import { flickrPhotoSizeSchema } from "modules/flickr-photo-size";
import { photographerSchema } from "modules/photographer";
import { type TypedRouteHandler } from "types/fastify";

import { photoSchema } from "../schema";
import { getAll } from "../services";

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
});

export const listSchema = {
  summary: "List photographers",
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
    page: Type.Optional(Type.Integer()),
    size: Type.Optional(Type.Integer()),
  }),
  response: {
    "200": Type.Object({
      data: Type.Array(listPhotoItemSchema),
    }),
  },
} satisfies FastifySchema;

export const list: TypedRouteHandler<typeof listSchema> = async (request) => {
  const {
    sort,
    photographerIds,
    categoryIds,
    page = 1,
    size: limit = 40,
  } = request.query;

  const photos = await getAll({
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

  return {
    data: photos,
  };
};
