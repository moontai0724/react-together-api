import type { FastifyPluginCallback } from "fastify";
import { photoReactionController } from "modules/photo-reaction";

export default (async (instance) => {
  instance.delete(
    "/",
    { schema: photoReactionController.deleteSchema },
    photoReactionController.delete,
  );
}) satisfies FastifyPluginCallback;
