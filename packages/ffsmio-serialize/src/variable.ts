import Nullish from '@ffsm/nullish';
import {
  DeepArrayPrimitive,
  DeepObjectPrimitive,
  Primitive,
  SerializeOptions,
} from './types';
import { get } from './get';

/**
 * Asynchronously replaces variable placeholders in a string with corresponding values.
 *
 * This function takes a template string with variable placeholders in the format
 * `{variableName}` and replaces them with values from the provided params object.
 * It supports deep property access using dot notation and asynchronous formatting.
 *
 * @param text - The template string containing variables in the format `{variableName}`
 * @param options - Configuration options including parameters and formatters
 * @param options.params - An object containing values to replace variables
 * @param options.format - An object mapping variable names to formatter functions (can be async)
 * @returns A Promise resolving to the text with all variables replaced
 *
 * @example
 * ```typescript
 * // Basic usage
 * await variableAsync('Hello, {name}!', {
 *   params: { name: 'John' }
 * });
 * // 'Hello, John!'
 *
 * // Deep property access
 * await variableAsync('User: {user.profile.name}, Age: {user.profile.age}', {
 *   params: {
 *     user: {
 *       profile: {
 *         name: 'Alice',
 *         age: 30
 *       }
 *     }
 *   }
 * });
 * // 'User: Alice, Age: 30'
 *
 * // With async formatters
 * await variableAsync('User status: {userId}', {
 *   params: { userId: 1234 },
 *   format: {
 *     userId: async (id) => {
 *       const response = await fetch(`/api/users/${id}`);
 *       const user = await response.json();
 *       return `${user.name} (${user.status})`;
 *     }
 *   }
 * });
 * // 'User status: John Doe (active)'
 *
 * // Parallel processing of multiple variables
 * await variableAsync('Weather: {city1}, {city2}, {city3}', {
 *   params: { city1: 'New York', city2: 'London', city3: 'Tokyo' },
 *   format: {
 *     city1: async (city) => await getWeather(city),
 *     city2: async (city) => await getWeather(city),
 *     city3: async (city) => await getWeather(city)
 *   }
 * });
 * // Processes all weather requests in parallel
 * ```
 *
 * @see variable - Synchronous version for simpler use cases
 */
export async function variableAsync(
  text: string,
  options: SerializeOptions = {}
) {
  if (Nullish.isNullishOrEmpty(text)) {
    return '';
  }

  const params = Nullish.nullish(options.params, {}) as
    | DeepObjectPrimitive
    | DeepArrayPrimitive;
  const matches: string[] = Array.from(
    Nullish.nullish(text.match(/{\s*[\w._-]+\s*}/g), [])
  );

  if (Nullish.isNullishOrEmpty(matches)) {
    return Promise.resolve(text);
  }

  const serialized = await Promise.all(
    matches.map(async (match) => {
      const key = match.replace(/[{}]/g, '').trim();
      let value = Nullish.nullish(get(params, key), '') as Primitive;

      if (!Nullish.isNullishOrEmpty(options.format?.[key])) {
        value = await options.format![key](value);
      }

      return {
        key,
        match,
        value: Nullish.nullish(value?.toString(), ''),
      };
    })
  );

  serialized.forEach(
    (item) =>
      (text = text.replace(
        new RegExp(`\\{\\s*${item.key}\\s*\\}`, 'g'),
        item.value
      ))
  );

  return text;
}

/**
 * Replaces variable placeholders in a string with corresponding values.
 *
 * This function takes a template string with variable placeholders in the format
 * `{variableName}` and replaces them with values from the provided params object.
 * It supports deep property access using dot notation and synchronous formatting.
 *
 * @param text - The template string containing variables in the format `{variableName}`
 * @param options - Configuration options including parameters and formatters
 * @param options.params - An object containing values to replace variables
 * @param options.format - An object mapping variable names to synchronous formatter functions
 * @returns The text with all variables replaced
 *
 * @example
 * ```typescript
 * // Basic usage
 * variable('Hello, {name}!', {
 *   params: { name: 'John' }
 * });
 * // 'Hello, John!'
 *
 * // Deep property access
 * variable('User: {user.profile.name}, Age: {user.profile.age}', {
 *   params: {
 *     user: {
 *       profile: {
 *         name: 'Alice',
 *         age: 30
 *       }
 *     }
 *   }
 * });
 * // 'User: Alice, Age: 30'
 *
 * // With formatters
 * variable('Created: {date}', {
 *   params: { date: '2023-04-15' },
 *   format: {
 *     date: (value) => new Date(value).toLocaleDateString()
 *   }
 * });
 * // 'Created: 4/15/2023' (format depends on locale)
 *
 * // Multiple occurrences of the same variable
 * variable('Welcome, {username}! Your username is {username}.', {
 *   params: { username: 'user123' }
 * });
 * // 'Welcome, user123! Your username is user123.'
 *
 * // Missing variables are replaced with empty string
 * variable('Hello, {name}!', { params: {} });
 * // 'Hello, !'
 * ```
 *
 * @see variableAsync - Asynchronous version that supports async formatters
 */
export function variable(text: string, options: SerializeOptions = {}) {
  if (Nullish.isNullishOrEmpty(text)) {
    return '';
  }

  const params = Nullish.nullish(options.params, {}) as
    | DeepObjectPrimitive
    | DeepArrayPrimitive;
  const matches: string[] = Array.from(
    Nullish.nullish(text.match(/{\s*[\w._-]+\s*}/g), [])
  );

  if (Nullish.isNullishOrEmpty(matches)) {
    return text;
  }

  matches.forEach((match) => {
    const key = match.replace(/[{}]/g, '').trim();
    let value = Nullish.nullish(get(params, key), '') as Primitive;

    if (!Nullish.isNullishOrEmpty(options.format?.[key])) {
      value = options.format![key](value);
    }

    text = text.replace(
      new RegExp(`\\{\\s*${key}\\s*\\}`, 'g'),
      value?.toString() ?? ''
    );
  });

  return text;
}
