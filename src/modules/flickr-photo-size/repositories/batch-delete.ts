import { db, type FlickrPhoto } from "database";

export async function batchDeleteById(id: FlickrPhoto["id"]) {
  return db.deleteFrom("flickrPhotoSizes").where("flickrId", "=", id).execute();
}
