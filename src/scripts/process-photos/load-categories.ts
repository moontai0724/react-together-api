import { categoryService } from "modules/category";
import { env } from "persistance";

import { getFolders } from "./get-folders";

async function createCategories(categories: string[]) {
  return Promise.all(
    categories.map(async (category) =>
      categoryService.insertIfNotExists(category),
    ),
  );
}

/**
 * Read first-layer of folders as categories from the file system
 * @returns Categories
 */
export async function loadCategories() {
  const categories = await getFolders(env.file.root);
  const categoriesIds = await createCategories(categories);
  const createdCategories = await categoryService.getIn(categoriesIds);

  return createdCategories;
}
