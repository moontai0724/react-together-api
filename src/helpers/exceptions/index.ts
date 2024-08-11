import { Exception } from "./exception";

export * from "./exception";

export class UnauthorizedExcetion extends Exception {
  constructor(
    message: string = "The given authorization is invalid",
    details?: unknown,
  ) {
    super(message, { statusCode: 401, messageCode: "401", details });
  }
}
