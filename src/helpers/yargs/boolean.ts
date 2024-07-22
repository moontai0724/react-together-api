import { type TBoolean, TypeGuard } from "@sinclair/typebox";
import type { Options } from "yargs";

export function getBooleanOption(
  schema: TBoolean,
  override: Options = {},
): Options {
  const options = {
    type: "boolean" as const,
    requiresArg: !TypeGuard.IsOptional(schema),
  };

  if (schema.default)
    Object.assign(options, { default: schema.default as boolean });
  if (schema.description)
    Object.assign(options, { description: schema.description });

  Object.assign(options, override);

  return options;
}
