import { type TBigInt, type TInteger, Type } from "@sinclair/typebox";

export const photographerSchema = Type.Object({
  id: Type.Integer({
    description: "Auto-incremented serial id for photographer in this system",
  }) as TInteger | TBigInt,
  name: Type.String({
    description: "Photographer name",
  }),
});
