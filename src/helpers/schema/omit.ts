import {
  type TObject,
  type TOmit,
  type TPropertyKey,
  Type,
} from "@sinclair/typebox";

export function omit<
  Item extends Record<PropertyKey, unknown>,
  Key extends keyof Item,
  Keys extends Key[],
>(item: Item, keys: Keys): Omit<Item, Keys[number]>;
export function omit(
  item: Record<PropertyKey, unknown>,
  keys: PropertyKey[],
): object {
  return Object.entries(item).reduce((acc, [key, value]) => {
    if (keys.includes(key)) return acc;

    return {
      ...acc,
      [key]: value,
    };
  }, {});
}

export function omitProperties<
  Schema extends TObject,
  Key extends keyof Schema["properties"],
  Keys extends Key[],
>(schema: Schema, props: Keys): TOmit<Schema, Keys>;
export function omitProperties(
  schema: TObject,
  props: TPropertyKey[],
): TObject {
  const picked = omit(schema.properties, props);

  return Type.Object(picked);
}
