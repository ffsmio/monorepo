import Nullish from '@ffsm/nullish';
import { Primitive } from './types';

/**
 * Checks if a value is a string.
 *
 * This function uses a TypeScript type predicate to improve
 * type checking in conditional statements.
 *
 * @param value - The value to check
 * @returns `true` if the value is a string, otherwise `false`
 *
 * @example
 * ```typescript
 * if (isString(value)) {
 *   // TypeScript knows value is a string here
 *   console.log(value.toUpperCase());
 * }
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks if a value is a number.
 *
 * This function uses a TypeScript type predicate to improve
 * type checking in conditional statements. Note that it returns
 * `false` for NaN values despite NaN having type 'number'.
 *
 * @param value - The value to check
 * @returns `true` if the value is a number (including 0 and negative numbers), otherwise `false`
 *
 * @example
 * ```typescript
 * if (isNumber(value)) {
 *   // TypeScript knows value is a number here
 *   console.log(value.toFixed(2));
 * }
 * ```
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Checks if a value is a boolean.
 *
 * This function uses a TypeScript type predicate to improve
 * type checking in conditional statements.
 *
 * @param value - The value to check
 * @returns `true` if the value is a boolean, otherwise `false`
 *
 * @example
 * ```typescript
 * if (isBoolean(value)) {
 *   // TypeScript knows value is a boolean here
 *   console.log(value ? 'Yes' : 'No');
 * }
 * ```
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Checks if a value is a primitive (string, number, boolean, null, or undefined).
 *
 * This function uses a TypeScript type predicate to improve
 * type checking in conditional statements.
 *
 * @param value - The value to check
 * @returns `true` if the value is a primitive, otherwise `false`
 *
 * @example
 * ```typescript
 * if (isPrimitive(value)) {
 *   // TypeScript knows value is a string, number, boolean, null, or undefined here
 *   console.log(`Simple value: ${String(value)}`);
 * } else {
 *   // TypeScript knows value is an object or array here
 *   console.log('Complex value');
 * }
 * ```
 */
export function isPrimitive(value: unknown): value is Primitive {
  return (
    Nullish.isNullish(value) ||
    isString(value) ||
    isNumber(value) ||
    isBoolean(value)
  );
}
