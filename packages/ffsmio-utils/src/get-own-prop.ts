import { isOwn } from './is-own';

export function getOwnerProp<T>(obj: unknown, propName: string): T | undefined {
  if (!isOwn(obj, propName)) {
    return undefined;
  }

  return (obj as Record<string, unknown>)[propName] as T;
}
