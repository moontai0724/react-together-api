import { Type } from "@sinclair/typebox";

import { Exception } from "./exception";

const statusCode: number = 404;
const messageCode: string = "404";
const defaultMessage: string = "Could not find the requested resource";

export const notFoundExceptionSchema = Type.Object({
  code: Type.Literal(messageCode),
  message: Type.String({
    description: "Error message",
    example: defaultMessage,
  }),
  details: Type.Optional(Type.Any()),
});

export class NotFoundException extends Exception {
  constructor(message: string = defaultMessage, details?: unknown) {
    super(message, { statusCode, messageCode, details });
  }
}
