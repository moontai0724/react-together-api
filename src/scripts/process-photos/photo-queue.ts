import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { getHeapStatistics } from "node:v8";

import type { Category, Photographer } from "database";

import { photosRootPath } from "./common";

export interface WaitingPhoto {
  category: Category;
  photographer: Photographer;
  fileName: string;
}

/**
 * Queued photos to process
 */
export const queuedPhotos: WaitingPhoto[] = [];

const MB = 1024 * 1024;

const perservedMemory = MB * 20; // 20MB

let usedMemories = 0;

/**
 * To judge whether the memory is enough to process the photo or not.
 *
 * @param photo target photo info to process
 */
export async function isProcessable(photo: WaitingPhoto) {
  const filePath = resolve(
    photosRootPath,
    photo.category.label,
    photo.photographer.name,
    photo.fileName,
  );
  const { size: fileSize } = await stat(filePath);
  const { heap_size_limit: maxHeap, used_heap_size: currentHeap } =
    getHeapStatistics();
  const availableMemory =
    maxHeap - currentHeap - perservedMemory - usedMemories;
  const ableToProcess = fileSize < availableMemory;

  // console.log(
  //   "isAbleToTake(%s): %s MB (%s) in %s MB available (%s+%s/%s) %s",
  //   ableToProcess,
  //   Math.floor(fileSize / MB),
  //   fileSize,
  //   Math.floor(availableMemory / MB),
  //   Math.floor(currentHeap / MB),
  //   Math.floor(perservedMemory / MB),
  //   Math.floor(maxHeap / MB),
  //   processingMemories / MB,
  // );

  return { processable: ableToProcess, fileSize };
}

export async function handlePhoto(
  handler: (photo: WaitingPhoto) => Promise<unknown>,
  photo?: WaitingPhoto,
): Promise<unknown[]> {
  const next = photo ?? queuedPhotos.shift();

  if (!next) return Promise.resolve([]);

  const { processable, fileSize } = await isProcessable(next);

  if (!processable) {
    queuedPhotos.push(next);

    return Promise.resolve([]);
  }

  usedMemories += fileSize;

  const currentResult = await handler(next);

  usedMemories -= fileSize;

  const nextResults = await handlePhoto(handler);

  return [currentResult, ...nextResults];
}
