import { type NewPhoto } from "database";
import { flickrPhotoService } from "modules/flickr-photo";

import { create as createRecord } from "../repositories";

export interface CreateParams extends Omit<NewPhoto, "flickrId"> {
  file:
    | {
        buffer: Buffer;
      }
    | {
        id: bigint;
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
    "id" in file ? file.id : (await flickrPhotoService.create({ file })).id;

  const createdId = await createRecord({
    categoryId,
    photographerId,
    fileName,
    flickrId: flickrPhotoId,
    integrity,
  });

  if (!createdId) throw new Error("Failed to create a record");

  return createdId;
}