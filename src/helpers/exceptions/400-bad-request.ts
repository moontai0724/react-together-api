import { Type } from "@sinclair/typebox";

import { Exception } from "./exception";

const statusCode: number = 400;
const messageCode: string = "400";
const defaultMessage: string = "The request is invalid";

export const badRequestExceptionSchema = Type.Object({
  code: Type.Literal(messageCode),
  message: Type.String({
    description: "Error message",
    example: defaultMessage,
  }),
  details: Type.Optional(Type.Any()),
});

export class BadRequestException extends Exception {
  constructor(message: string = defaultMessage, details?: unknown) {
    super(message, { statusCode, messageCode, details });
  }
}
