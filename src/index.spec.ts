import { expect, it } from "vitest";

import { buildApp } from ".";

it("should build app", async () => {
  const app = buildApp();

  const response = await app.inject({
    method: "GET",
    url: "/",
  });

  expect(response.statusCode).toBe(200);
  expect(response.json()).toEqual({ ping: "pong" });
});
