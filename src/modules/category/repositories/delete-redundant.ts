import { db } from "database";

export async function deleteRedundant() {
  return db
    .deleteFrom("categories")
    .where(
      "id",
      "not in",
      db.selectFrom("photos").distinct().select("categoryId"),
    )
    .executeTakeFirst();
}
