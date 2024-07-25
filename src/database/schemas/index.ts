import type { CategoryTable } from "./category";
import type { FlickrPhotoTable } from "./flickr-photo";
import type { FlickrPhotoSizeTable } from "./flickr-photo-sizes";
import type { PhotoTable } from "./photo";
import type { PhotographerTable } from "./photographer";
import type { UserTable } from "./user";

export * from "./category";
export * from "./flickr-photo";
export * from "./flickr-photo-sizes";
export * from "./photo";
export * from "./photographer";
export * from "./user";

export interface Database {
  categories: CategoryTable;
  flickrPhotos: FlickrPhotoTable;
  flickrPhotoSizes: FlickrPhotoSizeTable;
  photos: PhotoTable;
  photographers: PhotographerTable;
  users: UserTable;
}
