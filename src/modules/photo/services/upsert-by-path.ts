import type { FlickrPhoto, Photo } from "database";
import { flickrPhotoService } from "modules/flickr-photo";

import { getOneByPath, update } from "../repositories";
import { create } from "./create";

export interface UpsertByPathParams {
  categoryId: Photo["categoryId"];
  photographerId: Photo["photographerId"];
  fileName: Photo["fileName"];
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
 * @returns updated or created photo id
 */
export async function upsertByPath({
  categoryId,
  photographerId,
  fileName,
  integrity,
  file,
}: UpsertByPathParams) {
  const existing = await getOneByPath({
    categoryId,
    photographerId,
    fileName,
  });
  const flickrPhotoId =
    "id" in file
      ? file.id
      : (await flickrPhotoService.create({ integrity, file })).id;

  if (existing) {
    const updated = update(existing.id, {
      flickrId: flickrPhotoId,
    });

    if (!updated) throw new Error("Failed to update photo");

    return existing.id;
  }

  return create({
    categoryId,
    photographerId,
    fileName,
    integrity,
    file: { id: flickrPhotoId },
  });
}
