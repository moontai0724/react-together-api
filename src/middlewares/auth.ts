import fastifyJwt, { type TokenOrHeader } from "@fastify/jwt";
import { auth0Configs } from "configs";
import { type User } from "database";
import type { FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";
import buildGetJwks from "get-jwks";
import { UnauthorizedException } from "helpers/exceptions";
import { userRepository } from "modules/user";

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

interface AuthOptions {
  ignorePatterns?: RegExp[];
}

export const authPlugin = fastifyPlugin<AuthOptions>(
  async (instance, options) => {
    const getJwks = buildGetJwks({ providerDiscovery: true });

    await instance.register(fastifyJwt, {
      decode: { complete: true },
      formatUser: (payload) => ({ email: payload.email }) as User,
      verify: {
        requiredClaims: ["aud", "iss"],
        allowedAud: auth0Configs.audience,
        allowedIss: auth0Configs.issuer,
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
      const { ignorePatterns } = options;

      if (ignorePatterns?.some((pattern) => pattern.test(req.url))) return;

      await req.jwtVerify();

      const user = await userRepository.getByEmail(req.user.email);

      if (!user)
        throw new UnauthorizedException(
          "The user does not have permission to this system",
        );

      req.user = user;
    });
  },
);
