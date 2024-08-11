import { db, type User } from "database";

export async function getByEmail(email: User["email"]): Promise<User | null> {
  const result = await db
    .selectFrom("users")
    .where("users.email", "=", email)
    .selectAll()
    .executeTakeFirst();

  return result ?? null;
}
