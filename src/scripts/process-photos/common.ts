import { resolve } from "node:path";

import { env } from "persistance";

export const photosRootPath = resolve(env.file.root);
