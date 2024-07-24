import { getOneByIntegrity } from "../repositories/get-one-by-integrity";
import { update } from "../repositories/update";

export interface UpdatePathByIntegrityParams {
  integrity: string;
  categoryId: bigint;
  photographerId: bigint;
  fileName: string;
}

/**
 * @returns null if not found, otherwise the updated photo id
 */
export async function updatePathByIntegrity({
  integrity,
  categoryId,
  photographerId,
  fileName,
}: UpdatePathByIntegrityParams) {
  const existing = await getOneByIntegrity(integrity);

  if (!existing) return null;

  const isCategorySame = existing.categoryId === categoryId;
  const isPhotographerSame = existing.photographerId === photographerId;
  const isFileNameSame = existing.fileName === fileName;

  if (isCategorySame && isPhotographerSame && isFileNameSame)
    return existing.id;

  const updated = await update(existing.id, {
    categoryId,
    photographerId,
    fileName,
  });

  if (!updated) throw new Error("Failed to update photo");

  return existing.id;
}
