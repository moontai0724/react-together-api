import fastifyJwt, { type TokenOrHeader } from "@fastify/jwt";
import { type User } from "database";
import type { FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";
import buildGetJwks from "get-jwks";
import { UnauthorizedExcetion } from "helpers/exceptions";
import { userRepository } from "modules/user";
import { env } from "persistance";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      email: string;
    };
    user: User;
  }
}

interface Token {
  header: { alg: string; kid: string };
  payload: { iss: string };
}

export const authPlugin = fastifyPlugin(async (instance) => {
  const getJwks = buildGetJwks({ providerDiscovery: true });

  await instance.register(fastifyJwt, {
    decode: { complete: true },
    formatUser: (payload) => ({ email: payload.email }) as User,
    verify: {
      requiredClaims: ["aud", "iss"],
      allowedAud: env.auth0.audience,
      allowedIss: env.auth0.issuer,
    },
    secret: async (_req: FastifyRequest, token: TokenOrHeader) => {
      const {
        header: { kid, alg },
        payload: { iss },
      } = token as Token;

      return getJwks.getPublicKey({ kid, domain: iss, alg });
    },
  });

  instance.addHook("onRequest", async (req) => {
    await req.jwtVerify();

    const user = await userRepository.getByEmail(req.user.email);

    if (!user)
      throw new UnauthorizedExcetion(
        "The user does not have permission to this system",
      );

    req.user = user;
  });
});
