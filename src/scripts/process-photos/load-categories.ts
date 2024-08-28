import { fileConfigs } from "configs";
import { categoryService } from "modules/category";

import { placeholderPhotoId } from "./const";
import { getFolders } from "./get-folders";

async function createCategories(categories: string[]) {
  return Promise.all(
    categories.map(async (category) =>
      categoryService.insertIfNotExists(category, placeholderPhotoId),
    ),
  );
}

/**
 * Read first-layer of folders as categories from the file system
 * @returns Categories
 */
export async function loadCategories() {
  const categories = await getFolders(fileConfigs.root);
  const createdCategories = await createCategories(categories);

  return createdCategories;
}
