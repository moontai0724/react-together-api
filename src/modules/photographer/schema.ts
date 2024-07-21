import { Type } from "@sinclair/typebox";

export const photographerSchema = Type.Object({
  id: Type.Integer({
    description: "Auto-incremented serial id for photographer in this system",
  }),
  name: Type.String({
    description: "Photographer name",
  }),
});
