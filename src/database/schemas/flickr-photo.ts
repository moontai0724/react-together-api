import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export interface FlickrPhotoTable {
  /**
   * Flickr photo ID
   */
  id: number;
  /**
   * Latest file integrity
   */
  integrity: string;
  /**
   * Flickr photo page
   */
  url: string;
  /**
   * Photo taken time from Flickr
   */
  takenAt: string;
  /**
   * Photo uploaded time from Flickr
   */
  uploadedAt: string;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string | undefined>;
}

export type FlickrPhoto = Selectable<FlickrPhotoTable>;
export type NewFlickrPhoto = Insertable<FlickrPhotoTable>;
export type UpdateFlickrPhoto = Updateable<FlickrPhotoTable>;
