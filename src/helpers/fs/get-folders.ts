import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

export async function getDirs(rootPath: string) {
  const structure = await readdir(rootPath, {
    withFileTypes: true,
    encoding: "utf-8",
  });

  const dirs = structure.map((file) => {
    const fullPath = resolve(rootPath, file.name);

    if (!file.isDirectory()) {
      console.warn(`Not a directory:`, fullPath);

      return null;
    }

    return {
      parentPath: rootPath,
      name: file.name,
      path: fullPath,
    };
  });

  return dirs.filter((file) => file) as Exclude<(typeof dirs)[number], null>[];
}
export type DirStat = Awaited<ReturnType<typeof getDirs>>[number];
