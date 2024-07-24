import { db, type NewFlickrPhoto } from "database";

/**
 * @returns created flickrPhoto id
 */
export async function create(newItem: NewFlickrPhoto) {
  const { numInsertedOrUpdatedRows } = await db
    .insertInto("flickrPhotos")
    .values(newItem)
    .executeTakeFirst();

  if (!numInsertedOrUpdatedRows) throw new Error("Failed to create a record");

  return newItem.id;
}
