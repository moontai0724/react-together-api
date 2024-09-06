import { fileConfigs } from "configs";
import { placeholderPhotoId } from "helpers/flickr/placeholder";
import { type DirStat, getDirs } from "helpers/fs";
import { categoryService } from "modules/category";

async function createCategories(categories: DirStat[]) {
  return Promise.all(
    categories.map(async (category) =>
      categoryService.insertIfNotExists(category.name, placeholderPhotoId),
    ),
  );
}

/**
 * Read first-layer of folders as categories from the file system
 * @returns Categories
 */
export async function loadCategories() {
  const categories = await getDirs(fileConfigs.root);
  const createdCategories = await createCategories(categories);

  return createdCategories;
}
