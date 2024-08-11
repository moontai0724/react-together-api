import { db } from "database";
import type { PhotoReaction } from "database/schemas";

export interface DeletePhotoReactionParams {
  photoId: PhotoReaction["photoId"];
  userId: PhotoReaction["userId"];
}

async function deleteReaction({ photoId, userId }: DeletePhotoReactionParams) {
  const result = await db
    .deleteFrom("photoReactions")
    .where("photoId", "=", photoId)
    .where("userId", "=", userId)
    .executeTakeFirstOrThrow();

  return result.numDeletedRows;
}

export { deleteReaction as delete };
