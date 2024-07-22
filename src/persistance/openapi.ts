import type { SwaggerOptions } from "@fastify/swagger";

import packageJson from "../../package.json" with { type: "json" };

export const openapiOptions: SwaggerOptions = {
  openapi: {
    openapi: "3.1.0",
    info: {
      title: "React Together API",
      description:
        "A backend service for a MVP system to collab with others for flickr albums by give reactions to photo",
      version: packageJson.version,
    },
  },
};
