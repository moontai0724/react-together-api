import { flickrApis } from "@moontai0724/flickr-sdk";
import { flickrConfigs } from "configs";
import { categoryRepository } from "modules/category";
import { flickrPhotoRepository } from "modules/flickr-photo";
import { photographerRepository } from "modules/photographer";

import { placeholderPhotoId } from "./const";

export async function cleanup() {
  const [category, photographer, flickrPhoto, placeholder] = await Promise.all([
    categoryRepository.deleteRedundant(),
    photographerRepository.deleteRedundant(),
    flickrPhotoRepository.deleteRedundant(),
    flickrApis.rest.photos
      .delete({
        credentials: flickrConfigs.credentials,
        photoId: placeholderPhotoId,
      })
      .catch((e) => e),
  ]);

  console.log("cleanup result:", {
    category,
    photographer,
    flickrPhoto,
    placeholder,
  });
}
