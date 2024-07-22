import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

export async function getFolders(rootPath: string) {
  const structure = await readdir(rootPath, {
    withFileTypes: true,
    encoding: "utf-8",
  });

  return structure
    .map((file) => {
      const fullPath = resolve(rootPath, file.name);

      if (!file.isDirectory()) {
        console.warn(`Not a directory:`, fullPath);

        return null;
      }

      return file.name;
    })
    .filter((file) => file) as string[];
}
