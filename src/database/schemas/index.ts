import type { CategoryTable } from "./category";
import type { FlickrPhotoTable } from "./flickr-photo";
import type { PhotographerTable } from "./photographer";
import type { UserTable } from "./user";

export * from "./category";
export * from "./flickr-photo";
export * from "./photographer";
export * from "./user";

export interface Database {
  categories: CategoryTable;
  flickrPhotos: FlickrPhotoTable;
  photographers: PhotographerTable;
  users: UserTable;
}
