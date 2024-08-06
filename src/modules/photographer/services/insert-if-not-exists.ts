import { db, type Photographer } from "database";

export async function insertIfNotExists(
  category: string,
): Promise<Photographer> {
  const existing = await db
    .selectFrom("photographers")
    .where("name", "=", category)
    .selectAll()
    .executeTakeFirst();

  if (existing) return existing;

  const result = await db
    .insertInto("photographers")
    .values({ name: category })
    .executeTakeFirstOrThrow();

  if (!result.insertId) throw new Error("Failed to insert photographer");

  return {
    id: result.insertId,
    name: category,
  };
}
