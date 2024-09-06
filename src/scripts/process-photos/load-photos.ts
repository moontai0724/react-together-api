import { type BinaryLike, createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { fileConfigs } from "configs";
import type { Category, Photographer } from "database";
import { getFiles } from "helpers/fs";
import { photoService } from "modules/photo";

import { handlePhoto, type WaitingPhoto } from "./photo-queue";

async function readPhoto(info: WaitingPhoto) {
  const { category, photographer, fileName } = info;
  const filePath = resolve(
    fileConfigs.root,
    category.label,
    photographer.name,
    fileName,
  );

  return readFile(filePath);
}

/**
 * @returns 64 characters hex string
 */
function calculateHash(data: BinaryLike): string {
  return createHash("sha256").update(data).digest("hex");
}

async function loadPhoto(info: WaitingPhoto) {
  const fileBuffer = await readPhoto(info);
  const integrity = calculateHash(fileBuffer);

  const updatedByIntegrity = await photoService.updatePathByIntegrity({
    integrity,
    categoryId: info.category.id,
    photographerId: info.photographer.id,
    fileName: info.fileName,
  });

  if (updatedByIntegrity) return updatedByIntegrity;

  return photoService
    .upsertByPath({
      category: info.category,
      photographerId: info.photographer.id,
      fileName: info.fileName,
      integrity,
      file: {
        name: info.fileName,
        buffer: fileBuffer,
      },
    })
    .catch((err) => console.error("Failed to upsert photo", err));
}

/**
 * Read all photos and process them with auto queue.
 */
export async function loadPhotos(
  category: Category,
  photographer: Photographer,
) {
  console.log(`Loading photos for ${category.label}/${photographer.name}`);
  const rootPath = resolve(fileConfigs.root, category.label, photographer.name);
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
