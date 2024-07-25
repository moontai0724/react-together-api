import type { FlickrPhoto, NewPhoto } from "database";
import { flickrPhotoService } from "modules/flickr-photo";

import { create as createRecord } from "../repositories";

export interface CreateParams extends Omit<NewPhoto, "flickrId"> {
  integrity: FlickrPhoto["integrity"];
  file:
    | {
        name: string;
        buffer: Buffer;
      }
    | {
        id: FlickrPhoto["id"];
      };
}

/**
 * @returns created photo id
 */
export async function create({
  categoryId,
  photographerId,
  fileName,
  integrity,
  file,
}: CreateParams) {
  const flickrPhotoId =
    "id" in file
      ? file.id
      : (await flickrPhotoService.create({ integrity, file })).id;

  const createdId = await createRecord({
    categoryId,
    photographerId,
    fileName,
    flickrId: flickrPhotoId,
  });

  if (!createdId) throw new Error("Failed to create a record");

  return createdId;
}
