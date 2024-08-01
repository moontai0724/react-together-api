import { Type } from "@sinclair/typebox";
import { type FastifySchema } from "fastify";
import { omitProperties } from "helpers/schema";
import { categorySchema } from "modules/category";
import { photographerSchema } from "modules/photographer";
import { type TypedRouteHandler } from "types/fastify";

import { getAll } from "../repositories/get-all";
import { photoSchema } from "../schema";

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
      data: Type.Array(omitProperties(photoSchema, ["deletedAt"])),
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
      const direction = { DESC: "desc", ASC: "asc" }[givenSort];
      const key = { takenAt: "takenAt", updatedAt: "updatedAt" }[givenKey];

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
    data: photos.map((photo) => ({
      id: Number(photo.id),
      flickrId: Number(photo.flickrId),
      categoryId: Number(photo.categoryId),
      photographerId: Number(photo.photographerId),
      fileName: photo.fileName,
      createdAt: photo.createdAt.toISOString(),
      updatedAt: photo.updatedAt.toISOString(),
      deletedAt: photo.deletedAt?.toISOString() ?? null,
    })),
  };
};
