import { Type } from "@sinclair/typebox";

export const userSchema = Type.Object({
  id: Type.Integer({
    description: "Auto-incremented serial id for user in this system",
  }),
  email: Type.String({
    description: "User email",
    minLength: 1,
    maxLength: 255,
    format: "email",
  }),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});
