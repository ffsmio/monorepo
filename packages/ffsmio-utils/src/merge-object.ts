export function mergeObject<Result, Obj>(...objects: Obj[]): Result {
  return objects.reduce((acc, item) => ({ ...acc, ...item }), {} as Result);
}
