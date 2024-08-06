import { resolve } from "node:path";

import type { Category } from "database";
import { photographerService } from "modules/photographer";
import { env } from "persistance";

import { getFolders } from "./get-folders";

async function createPhotographers(photographers: string[]) {
  return Promise.all(
    photographers.map(async (category) =>
      photographerService.insertIfNotExists(category),
    ),
  );
}

/**
 * Read second-layer of folders as photographers from the file system
 * @returns Photographers
 */
export async function loadPhotographers(category: Category) {
  const rootPath = resolve(env.file.root, category.label);
  const photographers = await getFolders(rootPath);
  const createdPhotographers = await createPhotographers(photographers);

  return createdPhotographers;
}
