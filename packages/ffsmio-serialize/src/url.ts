import Nullish from '@ffsm/nullish';
import { Primitive } from './types';

/**
 * Replaces named parameters in a URL template with provided values.
 *
 * This function takes a URL template with parameter placeholders in the format
 * `:paramName` and replaces them with corresponding values from the params object.
 * If a parameter is missing from the params object, it will be replaced with an empty string.
 *
 * @param uri - The URL template containing parameters in the format `:paramName`
 * @param params - An object mapping parameter names to values
 * @returns The URL with all parameters replaced with their values
 *
 * @example
 * ```typescript
 * // Basic usage
 * url('/users/:userId', { userId: 123 });
 * // '/users/123'
 *
 * // Multiple parameters
 * url('/users/:userId/posts/:postId', { userId: 123, postId: 456 });
 * // '/users/123/posts/456'
 *
 * // Missing parameter (replaced with empty string)
 * url('/users/:userId', {});
 * // '/users/'
 *
 * // Multiple occurrences of the same parameter
 * url('/posts/:postId/comments/:commentId/edit/:postId', { postId: 789, commentId: 123 });
 * // '/posts/789/comments/123/edit/789'
 *
 * // With different primitive types
 * url('/filter/:active/:count', { active: true, count: 5 });
 * // '/filter/true/5'
 * ```
 */
export function url(
  uri: string,
  params: Record<string, Primitive> = {}
): string {
  if (Nullish.isNullishOrEmpty(params)) {
    return uri;
  }

  const matches = Nullish.nullish(uri.match(/:[a-zA-Z\d_]+/g), []) as string[];

  if (Nullish.isNullishOrEmpty(matches)) {
    return uri;
  }

  for (const match of matches) {
    const key = match.slice(1);
    const value = Nullish.nullish(params[key], '');
    uri = uri.replace(new RegExp(match, 'g'), value.toString());
  }

  return uri;
}
