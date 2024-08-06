import { flickrApis } from "@moontai0724/flickr-sdk";
import { db } from "database";
import { flickrCredentials } from "persistance/env";

export async function insertIfNotExists(
  category: string,
  primaryPhotoId: string,
) {
  const existing = await db
    .selectFrom("categories")
    .where("label", "=", category)
    .selectAll()
    .executeTakeFirst();

  if (existing) return existing.id;

  const { id: flickrPhotosetId } = await flickrApis.rest.photosets.create({
    credentials: flickrCredentials,
    title: category,
    primaryPhotoId,
  });

  const result = await db
    .insertInto("categories")
    .values({ label: category, flickrPhotosetId: BigInt(flickrPhotosetId) })
    .executeTakeFirstOrThrow();

  if (!result.insertId) throw new Error("Failed to insert category");

  return result.insertId;
}
