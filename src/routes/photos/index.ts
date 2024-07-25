import type { FastifyPluginCallback } from "fastify";
import { photoController } from "modules/photo";

export default (async (instance) => {
  instance.get(
    "/",
    { schema: photoController.listSchema },
    photoController.list,
  );
}) satisfies FastifyPluginCallback;
