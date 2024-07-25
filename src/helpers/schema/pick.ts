import {
  type TObject,
  type TPick,
  type TPropertyKey,
  Type,
} from "@sinclair/typebox";

export function pick<
  Item extends Record<PropertyKey, unknown>,
  Key extends keyof Item,
  Keys extends Key[],
>(item: Item, keys: Keys): Pick<Item, Keys[number]>;
export function pick(
  item: Record<PropertyKey, unknown>,
  keys: PropertyKey[],
): object {
  return keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: item[key],
    }),
    {},
  );
}

export function pickProperties<
  Schema extends TObject,
  Key extends keyof Schema["properties"],
  Keys extends Key[],
>(schema: Schema, props: Keys): TPick<Schema, Keys>;
export function pickProperties(
  schema: TObject,
  props: TPropertyKey[],
): TObject {
  const picked = pick(schema.properties, props);

  return Type.Object(picked);
}
