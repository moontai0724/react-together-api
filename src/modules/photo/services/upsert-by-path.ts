import { flickrApis } from "@moontai0724/flickr-sdk";
import type { Category, FlickrPhoto, Photo } from "database";
import { flickrPhotoService } from "modules/flickr-photo";
import { flickrCredentials } from "persistance/env";

import { getOneByPath, update } from "../repositories";
import { create } from "./create";

export interface UpsertByPathParams {
  category: Pick<Category, "id"> & Partial<Category>;
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
  category,
  photographerId,
  fileName,
  integrity,
  file,
}: UpsertByPathParams) {
  const existing = await getOneByPath({
    categoryId: category.id,
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

  if (!category.flickrPhotosetId)
    throw new Error("Category has no flickr photoset id");

  await flickrApis.rest.photosets.addPhoto({
    credentials: flickrCredentials,
    photosetId: category.flickrPhotosetId.toString(),
    photoId: flickrPhotoId.toString(),
  });

  return create({
    categoryId: category.id,
    photographerId,
    fileName,
    integrity,
    file: { id: flickrPhotoId },
  });
}
