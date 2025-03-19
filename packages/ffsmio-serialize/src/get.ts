import Nullish from '@ffsm/nullish';
import { DeepArrayPrimitive, DeepObjectPrimitive } from './types';

export function get<Type = unknown>(
  data: DeepObjectPrimitive | DeepArrayPrimitive,
  path: string | string[],
  defaultValue?: Type
): Type {
  const arrPath = Array.isArray(path) ? path : [path];

  if (Nullish.isNullishOrEmpty(arrPath)) {
    return data as Type;
  }

  if (Nullish.isNullish(data)) {
    return defaultValue as Type;
  }

  let result = data;

  for (let i = 0; i < arrPath.length; i++) {
    result = result[arrPath[i] as keyof typeof result] as typeof result;

    if (Nullish.isNullish(result)) {
      return defaultValue as Type;
    }
  }

  return result as Type;
}
