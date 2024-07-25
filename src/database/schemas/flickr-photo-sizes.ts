import type { Generated, Insertable, Selectable, Updateable } from "kysely";

import type { FlickrPhoto } from "./flickr-photo";

export interface FlickrPhotoSizeTable {
  /**
   * Auto-incremented serial id in this system
   */
  id: Generated<number>;
  /**
   * Flickr photo ID, reference to flickr_photos.id
   */
  flickrId: FlickrPhoto["id"];
  /**
   * Description of the size.
   * @example "Square"
   * @example "X-Large 6K"
   * @example "Original"
   */
  label: string;
  width: number;
  height: number;
  /**
   * The direct image url for the size.
   * @example "https://live.staticflickr.com/65535/52865522979_a22165bf3f_o.jpg"
   */
  source: string;
  /**
   * The url to the image description page.
   * @example "https://www.flickr.com/photos/moontai0724/52865522979/sizes/o/"
   */
  url: string;
  /**
   * @example "photo"
   */
  media: string;
}

export type FlickrPhotoSize = Selectable<FlickrPhotoSizeTable>;
export type NewFlickrPhotoSize = Insertable<FlickrPhotoSizeTable>;
export type UpdateFlickrPhotoSize = Updateable<FlickrPhotoSizeTable>;
