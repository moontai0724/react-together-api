import { type FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Exception, UnauthorizedExcetion } from "helpers/exceptions";

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
    return new UnauthorizedExcetion(error.message);
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
