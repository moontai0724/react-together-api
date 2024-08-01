import { type Category, db } from "database";

export async function getIn(categoryIds: Category["id"][]) {
  return db
    .selectFrom("categories")
    .where("id", "in", categoryIds)
    .selectAll()
    .execute();
}
