import { db, type Photo, type UpdatePhoto } from "database";

/**
 * @returns operation success or not
 */
export async function update(id: Photo["id"], photo: UpdatePhoto) {
  const result = await db
    .updateTable("photos")
    .set(photo)
    .where("id", "=", id)
    .executeTakeFirst();

  return result.numUpdatedRows === BigInt(1);
}
