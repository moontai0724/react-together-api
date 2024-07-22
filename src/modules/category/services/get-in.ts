import { db } from "database";

export async function getIn(categoryIds: bigint[]) {
  return db
    .selectFrom("categories")
    .where("id", "in", categoryIds)
    .selectAll()
    .execute();
}
