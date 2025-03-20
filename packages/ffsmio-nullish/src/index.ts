/**
 * Checks if a value is null.
 *
 * This function uses a TypeScript type predicate to improve
 * type checking in conditional statements.
 *
 * @param value - The value to check
 * @returns `true` if the value is null, otherwise `false`
 *
 * @example
 * ```typescript
 * if (isNull(response.data)) {
 *   // TypeScript knows response.data is null here
 *   console.log('Null response received');
 * }
 * ```
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Checks if a value is undefined.
 *
 * This function uses a TypeScript type predicate to improve
 * type checking in conditional statements.
 *
 * @param value - The value to check
 * @returns `true` if the value is undefined, otherwise `false`
 *
 * @example
 * ```typescript
 * if (isUndefined(response.meta)) {
 *   // TypeScript knows response.meta is undefined here
 *   console.log('No metadata available');
 * }
 * ```
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Checks if a value is null or undefined.
 *
 * This function uses a TypeScript type predicate to improve
 * type checking in conditional statements. It leverages the
 * isNull and isUndefined functions for readable implementation.
 *
 * @param value - The value to check
 * @returns `true` if the value is null or undefined, otherwise `false`
 *
 * @example
 * ```typescript
 * if (isNullish(user.name)) {
 *   // TypeScript knows user.name is null or undefined here
 *   console.log('Name not provided');
 * } else {
 *   // TypeScript knows user.name is not null or undefined here
 *   console.log('Hello, ' + user.name);
 * }
 * ```
 */
export function isNullish(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value);
}

/**
 * Type guard that checks if a value is neither null nor undefined.
 * @template T - The type of the value being checked
 * @param {T | null | undefined} value - The value to check
 * @returns {boolean} True if the value is neither null nor undefined
 * @example
 * if (isNotNullish(user)) {
 *   // TypeScript knows user is not null or undefined here
 *   console.log(user.name);
 * }
 */
export function isNotNullish<T>(value: T | null | undefined): value is T {
  return !isNullish(value);
}

/**
 * Returns the input value if it's not null or undefined,
 * otherwise returns the provided default value.
 *
 * This function implements nullish checking using ternary operators,
 * with advanced type handling for better TypeScript integration.
 *
 * @param value - The value to check
 * @param defaultValue - The default value to return if `value` is null or undefined
 * @returns The input value if not null/undefined, otherwise the default value
 *
 * @typeParam Return - The expected return type
 * @typeParam Type - Type of the input value
 * @typeParam Reset - Type of the default value
 *
 * @example
 * ```typescript
 * // Basic usage
 * const username = nullish<string>(user.name, 'Anonymous User');
 *
 * // Use in a data processing pipeline
 * const results = data
 *   .map(item => nullish<number>(item.value, 0))
 *   .filter(value => value > 10);
 *
 * // With complex objects
 * const config = {
 *   timeout: nullish<number>(userConfig.timeout, 1000),
 *   retries: nullish<number>(userConfig.retries, 3)
 * };
 * ```
 */
export function nullish<Return, Type = unknown, Reset = unknown>(
  value: Type,
  defaultValue: Reset
) {
  return (isNullish(value) ? defaultValue : value) as Reset extends infer R
    ? R
    : Return;
}

/**
 * Chains multiple functions together, applying each one to the result of the previous function
 * only if the value is not nullish.
 * @template T - The type of the value being transformed
 * @param {T | null | undefined} value - The initial value
 * @param {...((value: T) => T)[]} fns - The functions to apply sequentially
 * @returns {T | null | undefined} The final transformed value, or the original nullish value if input was nullish
 * @example
 * const result = chain(
 *   "Hello, World!",
 *   (str) => str.toUpperCase(),
 *   (str) => str.replace("WORLD", "TypeScript")
 * );
 * // result: "HELLO, TYPESCRIPT!"
 */
export function chain<T>(
  value: T | null | undefined,
  ...fns: ((value: T) => T)[]
) {
  return fns.reduce(
    (result, fn) => (isNotNullish(value) ? fn(result as T) : result),
    value
  );
}

/**
 * Maps a value through a series of transformation functions, stopping if any intermediate
 * result is nullish.
 * @template T - The type of the input value
 * @template U - The type of the output value
 * @param {T | null | undefined} value - The initial value
 * @param {...((value: T) => U)[]} fns - The transformation functions to apply sequentially
 * @returns {U | null | undefined} The transformed value, or null/undefined if any step produced a nullish result
 * @example
 * const length = map(
 *   "Hello, World!",
 *   (str) => str.length
 * );
 * // length: 13
 */
export function map<T, U>(
  value: T | null | undefined,
  ...fns: ((value: T) => U)[]
): U | null | undefined {
  return fns.reduce<U | null | undefined>(
    (result, fn) => (isNullish(result) ? result : fn(result as unknown as T)),
    value as U | null | undefined
  );
}

/**
 * Processes a value through a series of functions until a non-nullish result is produced.
 * If the initial value is not nullish, it's returned immediately without applying any functions.
 *
 * @template T - The type of the value being processed
 * @param {T} value - The initial value to process
 * @param {...((value: T) => T)[]} fns - Functions to apply sequentially until a non-nullish result is found
 * @returns {T} The first non-nullish result, or the final value after all functions are applied
 *
 * @example
 * // Try different ways to get a valid value
 * const result = until(
 *   null,                    // Start with null
 *   () => localStorage.getItem('username'),  // Try localStorage
 *   () => sessionStorage.getItem('username'), // Try sessionStorage
 *   () => 'guest'            // Default to 'guest' if previous attempts return nullish
 * );
 * // Returns first non-nullish value from the chain
 *
 * @example
 * // Skip processing if initial value is not nullish
 * const name = until(
 *   user.name,               // If this isn't nullish, other functions won't run
 *   () => user.nickname,
 *   () => 'Anonymous'
 * );
 * // Returns user.name if it's not nullish
 *
 * @example
 * // Process until a condition is met
 * const validId = until(
 *   '',                      // Start with empty string (nullish by isNotNullish definition)
 *   () => generateId(),      // Generate an ID
 *   (id) => validateId(id) ? id : null // Return null if invalid, triggering next function
 * );
 */
export function until<T>(value: T, ...fns: ((value: T) => T)[]) {
  if (isNotNullish(value)) {
    return value;
  }

  for (const fn of fns) {
    value = fn(value);
    if (isNotNullish(value)) {
      return value;
    }
  }

  return value;
}

/**
 * Checks if every element in an array is not nullish.
 * @param {unknown[]} value - The array to check
 * @returns {boolean} True if every element is not nullish
 * @example
 * const allValid = every([1, "string", {}, []]);
 * // allValid: true
 *
 * const hasNullish = every([1, null, "string"]);
 * // hasNullish: false
 */
export function every(value: unknown[]) {
  return value.every(isNotNullish);
}

/**
 * Checks if at least one element in an array is not nullish.
 * @param {unknown[]} value - The array to check
 * @returns {boolean} True if at least one element is not nullish
 * @example
 * const hasValue = some([null, undefined, 1]);
 * // hasValue: true
 *
 * const allNullish = some([null, undefined]);
 * // allNullish: false
 */
export function some(value: unknown[]) {
  return value.some(isNotNullish);
}

/**
 * Executes a function and returns its result, or null if an error is thrown.
 * @template T - The return type of the function
 * @param {() => T} fn - The function to execute
 * @returns {T | null} The result of the function, or null if an error was thrown
 * @example
 * const safeJsonParse = tryNull(() => JSON.parse('{"name": "John"}'));
 * // safeJsonParse: { name: "John" }
 *
 * const invalidJson = tryNull(() => JSON.parse('{"invalid": json}'));
 * // invalidJson: null
 */
export function tryNull<T>(fn: () => T): T | null {
  try {
    return fn();
  } catch {
    return null;
  }
}

/**
 * Higher-order function that wraps a function to catch errors and return null instead.
 * @template T - The return type of the function
 * @template Params - The parameter types of the function
 * @param {(...args: Params) => T} fn - The function to wrap
 * @returns {(...args: Params) => T | null} A new function that returns null on error
 * @example
 * const safeParse = hocTryNull(JSON.parse);
 * const result = safeParse('{"name": "John"}');
 * // result: { name: "John" }
 *
 * const invalid = safeParse('{"invalid": json}');
 * // invalid: null
 */
export function hocTryNull<T, Params extends Array<unknown> = unknown[]>(
  fn: (...args: Params) => T
): (...args: Params) => T | null {
  return (...args: Params) => {
    try {
      return fn(...args);
    } catch {
      return null;
    }
  };
}

/**
 * Checks if a value is nullish, an empty array, an empty object, or an empty string.
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is nullish or empty
 * @example
 * isNullishOrEmpty(null);          // true
 * isNullishOrEmpty(undefined);     // true
 * isNullishOrEmpty([]);            // true
 * isNullishOrEmpty({});            // true
 * isNullishOrEmpty("");            // true
 * isNullishOrEmpty("  ");          // true
 * isNullishOrEmpty([1, 2]);        // false
 * isNullishOrEmpty({ a: 1 });      // false
 * isNullishOrEmpty("Hello");       // false
 */
export function isNullishOrEmpty(value: unknown) {
  if (isNullish(value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  return false;
}

/**
 * Returns the first non-nullish value from the provided arguments, or null if all are nullish.
 * @template T - The type of the values being checked
 * @param {...(T | null | undefined)[]} values - The values to check
 * @returns {T | null} The first non-nullish value, or null if all are nullish
 * @example
 * const result = coalesce(null, undefined, 0, "hello");
 * // result: 0
 *
 * const allNullish = coalesce(null, undefined);
 * // allNullish: null
 */
export function coalesce<T>(...values: Array<T | null | undefined>): T | null {
  for (const value of values) {
    if (isNotNullish(value)) {
      return value;
    }
  }

  return null;
}

/**
 * Returns the last non-nullish value from the provided arguments, or null if all are nullish.
 * @template T - The type of the values being checked
 * @param {...(T | null | undefined)[]} values - The values to check
 * @returns {T | null} The last non-nullish value, or null if all are nullish
 * @example
 * const result = coalesceRight(null, "hello", 0, undefined);
 * // result: 0
 *
 * const allNullish = coalesceRight(null, undefined);
 * // allNullish: null
 */
export function coalesceRight<T>(
  ...values: Array<T | null | undefined>
): T | null {
  for (let i = values.length - 1; i >= 0; i--) {
    if (isNotNullish(values[i])) {
      return values[i] as T;
    }
  }

  return null;
}

/**
 * Swaps null with undefined and vice versa.
 * @template T - The type of the value being swapped (must be null or undefined)
 * @param {T} value - The value to swap
 * @returns {null | undefined} The swapped value
 * @example
 * const value1 = swap(null);
 * // value1: undefined
 *
 * const value2 = swap(undefined);
 * // value2: null
 */
export function swap<T extends null | undefined>(value: T) {
  return (isNull(value) ? undefined : null) as T extends null
    ? undefined
    : null;
}

export default {
  nullish,
  isNullish,
  isNull,
  isUndefined,
  isNotNullish,
  chain,
  map,
  every,
  some,
  tryNull,
  hocTryNull,
  isNullishOrEmpty,
  coalesce,
  coalesceRight,
  swap,
};
