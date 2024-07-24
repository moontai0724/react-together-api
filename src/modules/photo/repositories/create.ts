import { db, type NewPhoto } from "database";

/**
 * @returns created photo id
 */
export async function create(newPhoto: NewPhoto) {
  const createResult = await db
    .insertInto("photos")
    .values(newPhoto)
    .executeTakeFirst();

  if (!createResult.insertId) throw new Error("Failed to create a record");

  return createResult.insertId;
}
