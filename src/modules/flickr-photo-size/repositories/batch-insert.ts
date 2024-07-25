import { db, type NewFlickrPhotoSize } from "database";

export async function batchInsert(sizes: NewFlickrPhotoSize[]) {
  return db.insertInto("flickrPhotoSizes").values(sizes).execute();
}
