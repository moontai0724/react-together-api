import { flickrApis } from "@moontai0724/flickr-sdk";
import { type Category, db } from "database";
import { flickrCredentials } from "persistance/env";

export async function insertIfNotExists(
  category: string,
  primaryPhotoId: string,
): Promise<Category> {
  const existing = await db
    .selectFrom("categories")
    .where("label", "=", category)
    .selectAll()
    .executeTakeFirst();

  if (existing) return existing;

  const { title, description } = category.match(
    /【(?<title>.*?)】(?<description>.*)/,
  )?.groups ?? { title: category };

  const { id: flickrPhotosetId } = await flickrApis.rest.photosets.create({
    credentials: flickrCredentials,
    title,
    description,
    primaryPhotoId,
  });

  const photosetId = BigInt(flickrPhotosetId);

  const result = await db
    .insertInto("categories")
    .values({ label: category, flickrPhotosetId: photosetId })
    .executeTakeFirstOrThrow();

  if (!result.insertId) throw new Error("Failed to insert category");

  return {
    id: result.insertId,
    label: category,
    flickrPhotosetId: photosetId,
  };
}
