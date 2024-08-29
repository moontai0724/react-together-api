import { categoryRepository } from "modules/category";
import { flickrPhotoRepository } from "modules/flickr-photo";
import { photographerRepository } from "modules/photographer";

export async function cleanup() {
  const [category, photographer, flickrPhoto] = await Promise.all([
    categoryRepository.deleteRedundant(),
    photographerRepository.deleteRedundant(),
    flickrPhotoRepository.deleteRedundant(),
  ]);

  console.log("cleanup result:", {
    category,
    photographer,
    flickrPhoto,
  });
}
