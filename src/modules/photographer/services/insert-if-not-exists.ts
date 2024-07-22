import { db } from "database";

export async function insertIfNotExists(category: string) {
  const existing = await db
    .selectFrom("photographers")
    .where("name", "=", category)
    .selectAll()
    .executeTakeFirst();

  if (existing) return existing.id;

  const result = await db
    .insertInto("photographers")
    .values({ name: category })
    .executeTakeFirstOrThrow();

  if (!result.insertId) throw new Error("Failed to insert photographer");

  return result.insertId;
}
