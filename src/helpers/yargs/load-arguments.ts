import { type Static, type TObject } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { getOptions } from "./get-option";

export function loadArguments<T extends TObject>(schema: T): Static<T> {
  const handler = yargs(hideBin(process.argv));

  // Migrate json-schema to yargs options schema.
  const options = getOptions(schema);

  // Add yargs options to the handler to enable type related features from yargs.
  handler.options(options);

  // Convert and cast arguments to match schema.
  const converted = Value.Convert(schema, handler.argv);
  const casted = Value.Cast(schema, converted);

  return casted;
}
