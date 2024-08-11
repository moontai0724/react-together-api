import { db } from "database";
import type { PhotoReaction } from "database/schemas";

export interface UpsertPhotoReactionParams {
  photoId: PhotoReaction["photoId"];
  userId: PhotoReaction["userId"];
  isRecommended: PhotoReaction["isRecommended"];
  comment: PhotoReaction["comment"];
}

export async function upsert({
  photoId,
  userId,
  isRecommended,
  comment,
}: UpsertPhotoReactionParams) {
  const result = await db
    .insertInto("photoReactions")
    .values({
      photoId,
      userId,
      isRecommended,
      comment,
    })
    .onDuplicateKeyUpdate({
      isRecommended,
      comment,
    })
    .executeTakeFirst();

  return !!result.numInsertedOrUpdatedRows;
}
