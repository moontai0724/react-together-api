import { db, type FlickrPhoto, type Photo } from "database";

export async function getOneByIntegrity(
  integrity: FlickrPhoto["integrity"],
): Promise<Photo | null> {
  const result = await db
    .selectFrom("photos")
    .leftJoin("flickrPhotos", "flickrPhotos.id", "photos.flickrId")
    .where("flickrPhotos.integrity", "=", integrity)
    .selectAll("photos")
    .executeTakeFirst();

  return result ?? null;
}
