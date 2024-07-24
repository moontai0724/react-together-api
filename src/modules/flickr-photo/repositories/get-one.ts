import { db, type FlickrPhoto } from "database";

export async function getOne(id: bigint): Promise<FlickrPhoto | null> {
  const result = await db
    .selectFrom("flickrPhotos")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();

  return result ?? null;
}
