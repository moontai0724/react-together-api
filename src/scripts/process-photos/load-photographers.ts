import { resolve } from "node:path";

import type { Category } from "database";
import { photographerService } from "modules/photographer";

import { photosRootPath } from "./common";
import { getFolders } from "./get-folders";

async function createPhotographers(photographers: string[]) {
  return Promise.all(
    photographers.map(async (category) => {
      const categoryId = await photographerService.insertIfNotExists(category);

      console.log(`[Photographer] (${categoryId}) "${category}"`);

      return categoryId;
    }),
  );
}

/**
 * Read second-layer of folders as photographers from the file system
 * @returns Photographers
 */
export async function loadPhotographers(category: Category) {
  const rootPath = resolve(photosRootPath, category.label);
  const photographers = await getFolders(rootPath);
  const photographersIds = await createPhotographers(photographers);
  const createdPhotographers =
    await photographerService.getIn(photographersIds);

  return createdPhotographers;
}
