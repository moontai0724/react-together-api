import { Type } from "@sinclair/typebox";

import { Exception } from "./exception";

const statusCode: number = 401;
const messageCode: string = "401";
const defaultMessage: string = "The given authorization is invalid";

export const unauthorizedExceptionSchema = Type.Object({
  code: Type.Literal(messageCode),
  message: Type.String({
    description: "Error message",
    example: defaultMessage,
  }),
  details: Type.Optional(Type.Any()),
});

export class UnauthorizedException extends Exception {
  constructor(message: string = defaultMessage, details?: unknown) {
    super(message, { statusCode, messageCode, details });
  }
}
