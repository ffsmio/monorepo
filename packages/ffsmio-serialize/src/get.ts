import Nullish from '@ffsm/nullish';
import { DeepArrayPrimitive, DeepObjectPrimitive } from './types';

/**
 * Safely retrieves a value from a nested object or array structure using a path.
 *
 * This utility function allows you to access deeply nested properties in objects
 * or arrays without worrying about null/undefined errors. If any part of the path
 * doesn't exist, it returns the provided default value instead.
 *
 * @param data - The object or array to retrieve data from
 * @param path - A string or array of strings representing the path to the desired value
 * @param defaultValue - The value to return if the specified path doesn't exist
 * @returns The value at the specified path, or the default value if the path doesn't exist
 * @typeParam Type - The expected type of the returned value
 *
 * @example
 * ```typescript
 * // Simple property access
 * const user = { name: 'John', profile: { age: 30 } };
 * get(user, 'name'); // 'John'
 *
 * // Nested property access
 * get(user, 'profile.age'); // 30
 *
 * // Using array path
 * get(user, ['profile', 'age']); // 30
 *
 * // Path doesn't exist, returns undefined
 * get(user, 'profile.email'); // undefined
 *
 * // Path doesn't exist, returns default value
 * get(user, 'profile.email', 'no-email@example.com'); // 'no-email@example.com'
 *
 * // Array access
 * const data = { users: [{ id: 1 }, { id: 2 }] };
 * get(data, 'users.0.id'); // 1
 *
 * // Type safety with generics
 * get<number>(user, 'profile.age', 0); // 30 (with type number)
 * ```
 */
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
