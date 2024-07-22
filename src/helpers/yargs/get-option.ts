import {
  type Static,
  type TObject,
  type TSchema,
  TypeGuard,
} from "@sinclair/typebox";
import type { Options } from "yargs";

import { getArrayOption } from "./array";
import { getBooleanOption } from "./boolean";
import { getNumberOption } from "./number";
import { getStringOption } from "./string";

export function getOption(schema: TSchema, override: Options = {}) {
  const option: Options = (() => {
    if (TypeGuard.IsNumber(schema)) return getNumberOption(schema, override);
    if (TypeGuard.IsString(schema)) return getStringOption(schema, override);
    if (TypeGuard.IsBoolean(schema)) return getBooleanOption(schema, override);
    if (TypeGuard.IsArray(schema)) return getArrayOption(schema, override);

    return {};
  })();

  Object.assign(option, override);

  return option;
}

export function getOptions<Schema extends TObject>(
  schema: Schema,
): Record<keyof Static<Schema>, Options> {
  const options = Object.entries(schema.properties).reduce(
    (acc, [key, value]) => {
      const option = getOption(value);
      const result = {
        [key]: option,
      };

      Object.assign(acc, result);

      return acc;
    },
    {} as Record<keyof Static<Schema>, Options>,
  );

  return options;
}
