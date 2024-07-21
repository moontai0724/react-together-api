import { type TNull, type TSchema, type TUnion, Type } from "@sinclair/typebox";

export function nullable<T extends TSchema>(type: T): TUnion<[T, TNull]> {
  const {
    title,
    description,
    default: defaultValue,
    example,
    examples,
    readOnly,
    writeOnly,
  } = type;

  return Type.Union([type, Type.Null()], {
    title,
    description,
    default: defaultValue,
    example,
    examples,
    readOnly,
    writeOnly,
  });
}
