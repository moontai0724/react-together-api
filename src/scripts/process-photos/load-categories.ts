import { deleteNotIn, getIn, insertIfNotExists } from "modules/category";

import { photosRootPath } from "./common";
import { getFolders } from "./get-folders";

async function createCategories(categories: string[]) {
  return Promise.all(
    categories.map(async (category) => {
      const categoryId = await insertIfNotExists(category);

      console.log(`[Category] (${categoryId}) "${category}"`);

      return categoryId;
    }),
  );
}

/**
 * Read first-layer of folders as categories from the file system
 * @returns Categories
 */
export async function loadCategories() {
  const categories = await getFolders(photosRootPath);
  const categoriesIds = await createCategories(categories);
  const createdCategories = await getIn(categoriesIds);
  const deleted = await deleteNotIn(categoriesIds);

  if (deleted.numDeletedRows)
    console.log(
      `[Category] Deleted ${deleted.numDeletedRows} non-existing categories`,
    );

  return createdCategories;
}
