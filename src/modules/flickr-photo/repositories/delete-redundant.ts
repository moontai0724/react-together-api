import { db } from "database";

export async function deleteRedundant() {
  return db
    .deleteFrom("flickrPhotos")
    .where(
      "id",
      "not in",
      db.selectFrom("photos").distinct().select("flickrId"),
    )
    .executeTakeFirst();
}
