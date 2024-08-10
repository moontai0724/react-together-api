import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface PhotoReactionTable {
  /**
   * Photo ID, reference to photos.id
   */
  photoId: bigint;
  /**
   * User ID, reference to users.id
   */
  userId: bigint;
  /**
   * Whether the user recommends this photo
   */
  isRecommended: boolean;
  /**
   * Comments for the user
   */
  comment: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string | undefined>;
}

export type PhotoReaction = Selectable<PhotoReactionTable>;
export type NewPhotoReaction = Insertable<PhotoReactionTable>;
export type UpdatePhotoReaction = Updateable<PhotoReactionTable>;
