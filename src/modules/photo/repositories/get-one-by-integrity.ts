import { db, type Photo } from "database";

export async function getOneByIntegrity(
  integrity: string,
): Promise<Photo | null> {
  const result = await db
    .selectFrom("photos")
    .where("integrity", "=", integrity)
    .selectAll()
    .executeTakeFirst();

  return result ?? null;
}
