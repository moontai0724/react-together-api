import type {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface PhotoTable {
  /**
   * Auto-incremented serial id for photo in this system
   */
  id: Generated<bigint>;
  /**
   * Flickr photo ID, reference to flickr_photos.id
   */
  flickrId: bigint;
  /**
   * ID of file category (first-layer folder)
   */
  categoryId: bigint;
  /**
   * ID of file taker (sub-folder name under category folder)
   */
  photographerId: bigint;
  /**
   * File name
   */
  fileName: string;
  /**
   * Time the photo was uploaded to this system
   */
  createdAt: ColumnType<Date, string | undefined, never>;
  /**
   * Time the photo was last uploaded to this system
   */
  updatedAt: ColumnType<Date, string | undefined, string | undefined>;
  /**
   * Time the photo was deleted from this system
   */
  deletedAt: ColumnType<
    Date,
    string | null | undefined,
    string | null | undefined
  >;
}

export type Photo = Selectable<PhotoTable>;
export type NewPhoto = Insertable<PhotoTable>;
export type UpdatePhoto = Updateable<PhotoTable>;
