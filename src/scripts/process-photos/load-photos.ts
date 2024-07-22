import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { Category, Photographer } from "database";

import { photosRootPath } from "./common";
import { getFiles } from "./get-files";
import { handlePhoto, type WaitingPhoto } from "./photo-queue";

async function loadPhoto(photo: WaitingPhoto) {
  const { category, photographer, fileName } = photo;
  const filePath = resolve(
    photosRootPath,
    category.label,
    photographer.name,
    fileName,
  );
  const fileBuffer = await readFile(filePath);
  const filehash = createHash("sha256").update(fileBuffer).digest("hex");

  console.log(`[File] (${filehash.length}: ${filehash}) "${fileName}"`);
}

/**
 * Read all photos and process them with auto queue.
 */
export async function loadPhotos(
  category: Category,
  photographer: Photographer,
) {
  const rootPath = resolve(photosRootPath, category.label, photographer.name);
  const files = await getFiles(rootPath);

  const processings = files.map((fileName) =>
    handlePhoto(loadPhoto, { category, photographer, fileName }),
  );

  const firstRound = await Promise.all(processings);
  const remainRounds = await Promise.all(
    processings.reduce((acc, cur) => acc.concat(cur), [] as Promise<unknown>[]),
  );

  return [...firstRound, ...remainRounds];
}
