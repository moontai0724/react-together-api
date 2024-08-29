import { flickrApis } from "@moontai0724/flickr-sdk";
import { flickrConfigs } from "configs";
import type { Category, FlickrPhoto, Photo } from "database";
import { flickrPhotoService } from "modules/flickr-photo";

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

async function updateExisting(
  existing: Photo,
  { integrity, file }: UpsertByPathParams,
) {
  console.log(`Updating existing photo...`, existing);
  const { flickrId } = existing;

  const newFlickrPhotoId =
    "id" in file
      ? file.id
      : (await flickrPhotoService.update({ flickrId, integrity, file })).id;

  if (newFlickrPhotoId && newFlickrPhotoId !== flickrId) {
    const updated = update(existing.id, {
      flickrId: BigInt(newFlickrPhotoId),
    });

    if (!updated) throw new Error("Failed to update photo");
  }

  return existing.id;
}

async function createNew({
  category,
  photographerId,
  fileName,
  integrity,
  file,
}: UpsertByPathParams) {
  console.log(`Creating new photo...`, { category, photographerId, fileName });
  const flickrPhotoId =
    "id" in file
      ? file.id
      : (await flickrPhotoService.create({ integrity, file })).id;

  if (!category.flickrPhotosetId)
    throw new Error("Category has no flickr photoset id");

  await flickrApis.rest.photosets.addPhoto({
    credentials: flickrConfigs.credentials,
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

  if (existing)
    return updateExisting(existing, {
      category,
      photographerId,
      fileName,
      integrity,
      file,
    });

  return createNew({
    category,
    photographerId,
    fileName,
    integrity,
    file,
  });
}
