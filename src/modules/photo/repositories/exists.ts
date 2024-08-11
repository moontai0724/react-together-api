import { db, type Photo } from "database";

export interface ExistsOptions {
  id?: Photo["id"];
}

export async function exists({ id }: ExistsOptions = {}): Promise<boolean> {
  let query = db
    .selectFrom("photos")
    .select((eb) => eb.fn.count<bigint>("photos.id").as("amount"));

  if (id) query = query.where("photos.id", "=", id);

  const { amount } = await query.executeTakeFirstOrThrow();

  return amount > 0;
}
