import { db } from "database";

export async function insertIfNotExists(category: string) {
  const existing = await db
    .selectFrom("categories")
    .where("label", "=", category)
    .selectAll()
    .executeTakeFirst();

  if (existing) return existing.id;

  const result = await db
    .insertInto("categories")
    .values({ label: category })
    .executeTakeFirstOrThrow();

  if (!result.insertId) throw new Error("Failed to insert category");

  return result.insertId;
}
