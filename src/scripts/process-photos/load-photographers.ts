import { resolve } from "node:path";

import { fileConfigs } from "configs";
import type { Category } from "database";
import { type DirStat, getDirs } from "helpers/fs";
import { photographerService } from "modules/photographer";

async function createPhotographers(photographers: DirStat[]) {
  return Promise.all(
    photographers.map(async (category) =>
      photographerService.insertIfNotExists(category.name),
    ),
  );
}

/**
 * Read second-layer of folders as photographers from the file system
 * @returns Photographers
 */
export async function loadPhotographers(category: Category) {
  const rootPath = resolve(fileConfigs.root, category.label);
  const photographers = await getDirs(rootPath);
  const createdPhotographers = await createPhotographers(photographers);

  return createdPhotographers;
}
