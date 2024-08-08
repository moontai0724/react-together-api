import { db, type UpdateFlickrPhoto } from "database";

export interface UpdateParams
  extends Required<Pick<UpdateFlickrPhoto, "id">>,
    Omit<UpdateFlickrPhoto, "id"> {}

export async function update(newItem: UpdateParams) {
  const { id, ...rest } = newItem;

  const result = await db
    .updateTable("flickrPhotos")
    .set(rest)
    .where("id", "=", id)
    .executeTakeFirst();

  if (!result.numUpdatedRows) throw new Error("Failed to update a record");

  return newItem.id;
}
