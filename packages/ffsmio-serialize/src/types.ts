export type Primitive = string | number | boolean | null | undefined;

export type ObjectPrimitive = Record<string | number, Primitive>;

export type ArrayPrimitive = Primitive[];

export type DeepObjectPrimitive = Record<
  string,
  Primitive | ObjectPrimitive | ArrayPrimitive
>;

export type DeepArrayPrimitive = Array<
  Primitive | ObjectPrimitive | ArrayPrimitive
>;

export type SerializeParams = DeepObjectPrimitive | DeepArrayPrimitive;
export type SerializeFormatter = (value: Primitive) => Primitive;

export interface SerializeOptions {
  params?: SerializeParams;
  format?: Record<string, SerializeFormatter>;
}
