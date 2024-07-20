import type {
  FastifyBaseLogger,
  FastifyHttp2Options,
  FastifyHttp2SecureOptions,
  FastifyHttpOptions,
} from "fastify";
import type * as http from "http";
import type * as http2 from "http2";
import type * as https from "https";

type FastifyOptionsHttp2s<
  Server extends http2.Http2SecureServer = http2.Http2SecureServer,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
> = FastifyHttp2SecureOptions<Server, Logger>;

type FastifyOptionsHttp2<
  Server extends http2.Http2Server = http2.Http2Server,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
> = FastifyHttp2Options<Server, Logger>;

type FastifyOptionsHttps<
  Server extends https.Server = https.Server,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
> = FastifyHttpOptions<Server, Logger>;

type FastifyOptionsHttp<
  Server extends http.Server = http.Server,
  Logger extends FastifyBaseLogger = FastifyBaseLogger,
> = FastifyHttpOptions<Server, Logger>;

export type FastifyOptions =
  | FastifyOptionsHttp2s
  | FastifyOptionsHttp2
  | FastifyOptionsHttps
  | FastifyOptionsHttp;
