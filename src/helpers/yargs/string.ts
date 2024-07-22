import { type TString, TypeGuard } from "@sinclair/typebox";
import type { Options } from "yargs";

export function getStringOption(
  schema: TString,
  override: Options = {},
): Options {
  const options = {
    type: "string" as const,
    requiresArg: !TypeGuard.IsOptional(schema),
  };

  if (schema.default)
    Object.assign(options, { default: schema.default as string });
  if (schema.description)
    Object.assign(options, { description: schema.description });

  Object.assign(options, override);

  return options;
}
