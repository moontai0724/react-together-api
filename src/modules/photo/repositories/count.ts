import { db, type Photo } from "database";

export interface CountOptions {
  photographerIds?: Photo["photographerId"][];
  categoryIds?: Photo["categoryId"][];
}

export async function count({
  photographerIds,
  categoryIds,
}: CountOptions = {}): Promise<bigint> {
  let query = db
    .selectFrom("photos")
    .leftJoin("categories", "categories.id", "photos.categoryId")
    .leftJoin("photographers", "photographers.id", "photos.photographerId")
    .select((eb) => eb.fn.count<bigint>("photos.id").as("amount"));

  if (photographerIds?.length)
    query = query.where("photographers.id", "in", photographerIds);

  if (categoryIds?.length)
    query = query.where("categories.id", "in", categoryIds);

  const { amount } = await query.executeTakeFirstOrThrow();

  return amount;
}
