import { db, type Photo } from "database";

export interface GetOneByPathParams {
  categoryId: Photo["categoryId"];
  photographerId: Photo["photographerId"];
  fileName: Photo["fileName"];
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
