import { flickrApis } from "@moontai0724/flickr-sdk";
import { categoryRepository } from "modules/category";
import { flickrPhotoRepository } from "modules/flickr-photo";
import { photographerRepository } from "modules/photographer";
import { flickrCredentials } from "persistance/env";

import { placeholderPhotoId } from "./const";

export async function cleanup() {
  const result = await Promise.all([
    categoryRepository.deleteRedundant(),
    photographerRepository.deleteRedundant(),
    flickrPhotoRepository.deleteRedundant(),
    flickrApis.rest.photos.delete({
      credentials: flickrCredentials,
      photoId: placeholderPhotoId,
    }),
  ]);

  console.log(result);
}
