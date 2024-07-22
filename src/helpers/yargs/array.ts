import {
  type TArray,
  type TLiteral,
  type TSchema,
  type TUnion,
  TypeGuard,
} from "@sinclair/typebox";
import type { Options } from "yargs";

function getLiteralValue(schema: TLiteral): string {
  return schema.const.toString();
}

function getValue(schema: TSchema): string | undefined {
  if (TypeGuard.IsLiteral(schema)) return getLiteralValue(schema);

  return undefined;
}

function getUnionValues(schema: TUnion): string[] | undefined {
  let isAllValid = true;
  const values: string[] = [];

  schema.anyOf.forEach((item) => {
    const value = getValue(item);

    if (!value) {
      isAllValid = false;

      return;
    }

    values.push(value);
  });

  if (!isAllValid) return undefined;

  return values;
}

function getChoices(schema: TSchema): string[] | undefined {
  if (TypeGuard.IsLiteral(schema)) return [getLiteralValue(schema)];
  if (TypeGuard.IsUnion(schema)) return getUnionValues(schema);

  return undefined;
}

export function getArrayOption(
  schema: TArray,
  override: Options = {},
): Options {
  const options = {
    type: "array" as const,
    requiresArg: !TypeGuard.IsOptional(schema),
  };

  if (schema.default)
    Object.assign(options, { default: schema.default as unknown[] });
  if (schema.description)
    Object.assign(options, { description: schema.description });

  const choices = getChoices(schema.items);

  if (choices) Object.assign(options, { choices });

  Object.assign(options, override);

  return options;
}
