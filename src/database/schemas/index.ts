import type { FlickrPhotoTable } from "./flickr-photo";
import type { UserTable } from "./user";

export * from "./flickr-photo";
export * from "./user";

export interface Database {
  flickrPhotos: FlickrPhotoTable;
  users: UserTable;
}
