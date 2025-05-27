export function isOwn(obj: unknown, prop: string): boolean {
  return (
    !!obj &&
    typeof obj === 'object' &&
    Object.prototype.hasOwnProperty.call(obj, prop)
  );
}
