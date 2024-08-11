import { type FastifyError, type FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import {
  BadRequestException,
  Exception,
  UnauthorizedException,
} from "helpers/exceptions";

type ErrorHandler = Parameters<FastifyInstance["setErrorHandler"]>[0];

function transformError(error: Error) {
  if (error instanceof Exception) {
    return error;
  }

  if (
    "code" in error &&
    typeof error.code === "string" &&
    error.code.startsWith("FST_JWT_")
  ) {
    return new UnauthorizedException(error.message);
  }

  if (
    "code" in error &&
    error.code === "FST_ERR_VALIDATION" &&
    "validation" in error
  ) {
    const { validationContext, validation = [] } = error as FastifyError;

    const messages = validation.map(
      ({ message }) => `\`${validationContext}\` ${message}`,
    );

    return new BadRequestException("Request validation failed", messages);
  }

  console.error("UNHANDLED ERROR: ", typeof error, error);

  return new Exception(error.message);
}

const handle: ErrorHandler = (error, req, res) => {
  const exception = transformError(error);
  const {
    messageCode: code = "500",
    statusCode = 500,
    message,
    details = null,
  } = exception as Exception;

  return res.status(statusCode).send({ code, message, details });
};

export const errorHandlingPlugin = fastifyPlugin(async (instance) => {
  instance.setErrorHandler(handle);
});
