import { db, type Photo } from "database";

export interface GetOneByPathParams {
  categoryId: bigint;
  photographerId: bigint;
  fileName: string;
}

export async function getOneByPath({
  categoryId,
  photographerId,
  fileName,
}: GetOneByPathParams): Promise<Photo | null> {
  const result = await db
    .selectFrom("photos")
    .where("categoryId", "=", categoryId)
    .where("photographerId", "=", photographerId)
    .where("fileName", "=", fileName)
    .selectAll()
    .executeTakeFirst();

  return result ?? null;
}
