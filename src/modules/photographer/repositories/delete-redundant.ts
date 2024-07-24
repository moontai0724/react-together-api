import { db } from "database";

export async function deleteRedundant() {
  return db
    .deleteFrom("photographers")
    .where(
      "id",
      "not in",
      db.selectFrom("photos").distinct().select("photographerId"),
    )
    .executeTakeFirst();
}
