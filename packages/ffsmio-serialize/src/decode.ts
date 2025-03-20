import Nullish from '@ffsm/nullish';

/**
 * Decodes a URL-encoded string, handling exceptions gracefully.
 *
 * This function safely decodes URL-encoded strings, providing options to use either
 * decodeURI or decodeURIComponent (default), or a custom decoder function.
 * If decoding fails for any part, it keeps the original encoded value and logs an error.
 *
 * @param value - The URL-encoded string to decode
 * @param component - Controls how decoding is performed:
 *   - `true` (default): Uses decodeURIComponent (decodes all percent-encoded characters)
 *   - `false`: Uses decodeURI (preserves certain reserved characters like ?, =, &, /)
 *   - A custom function: Uses the provided function for decoding
 * @returns The decoded string, or an empty string if input is null/undefined/empty
 *
 * @example
 * ```typescript
 * // Basic usage (using decodeURIComponent)
 * decode('Hello%20World'); // 'Hello World'
 *
 * // Using decodeURI instead
 * decode('path%2Fto%3Fresource%3Fid%3D1', false); // 'path/to?resource?id=1'
 *
 * // Using a custom decoder
 * decode('%F0%9F%8C%9F', (str) => myCustomDecoder(str)); // '🌟'
 *
 * // Handling invalid encodings gracefully
 * decode('Invalid%2G'); // Returns 'Invalid%2G' (logs error but doesn't throw)
 * ```
 */
export function decode(
  value: string,
  component: boolean | ((value: string) => string) = true
): string {
  if (Nullish.isNullishOrEmpty(value)) {
    return '';
  }

  const decoder =
    typeof component === 'function'
      ? component
      : component
        ? decodeURIComponent
        : decodeURI;

  return value.replace(/(%[0-9A-F]{2})+/gi, (match) => {
    try {
      return decoder(match);
    } catch {
      console.log('URI Component not decodable: ' + match);
      return match;
    }
  });
}
