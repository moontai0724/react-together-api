import { writeFileSync } from "node:fs";

import { Type } from "@sinclair/typebox";
import { loadArguments } from "helpers/yargs";

import { buildApp } from "..";

const optionsSchema = Type.Object({
  path: Type.String({
    description: "Path to save the docs yaml file to.",
    default: "./docs.yaml",
  }),
});

const docsPath = loadArguments(optionsSchema).path;

(async () => {
  const fastify = buildApp({
    logger: false,
  });

  await fastify.ready();

  const docs = fastify.swagger({ yaml: true });

  writeFileSync(docsPath, docs);

  console.log(`Docs saved to ${docsPath}`);

  await fastify.close();
})();
