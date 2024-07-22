import { db } from "database";

export async function deleteNotIn(categoryIds: bigint[]) {
  return db
    .deleteFrom("categories")
    .where("id", "not in", categoryIds)
    .executeTakeFirstOrThrow();
}
