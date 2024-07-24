import { db, type FlickrPhoto } from "database";

export async function getOneByIntegrity(
  integrity: string,
): Promise<FlickrPhoto | null> {
  const result = await db
    .selectFrom("flickrPhotos")
    .where("integrity", "=", integrity)
    .selectAll()
    .executeTakeFirst();

  return result ?? null;
}
