import Nullish from '@ffsm/nullish';

/**
 * Encodes a string for URL usage, handling exceptions gracefully.
 *
 * This function safely encodes strings for URLs, providing options to use either
 * encodeURI or encodeURIComponent (default), or a custom encoder function.
 * If encoding fails for any part, it keeps the original value and logs an error.
 *
 * @param value - The string to encode for URL usage
 * @param component - Controls how encoding is performed:
 *   - `true` (default): Uses encodeURIComponent (encodes all special characters including ?, =, &, /)
 *   - `false`: Uses encodeURI (preserves certain reserved characters like ?, =, &, /)
 *   - A custom function: Uses the provided function for encoding
 * @returns The encoded string, or an empty string if input is null/undefined/empty
 *
 * @example
 * ```typescript
 * // Basic usage (using encodeURIComponent)
 * encode('Hello World'); // 'Hello%20World'
 *
 * // Using encodeURI instead
 * encode('https://example.com/path?id=1', false); // 'https://example.com/path?id=1'
 *
 * // Using a custom encoder
 * encode('🌟', (str) => myCustomEncoder(str)); // '%F0%9F%8C%9F' or custom encoding
 *
 * // Handling problematic strings gracefully
 * encode('Text with \uD800 surrogate'); // Encodes normally but handles errors gracefully
 * ```
 */
export function encode(
  value: string,
  component: boolean | ((value: string) => string) = true
): string {
  if (Nullish.isNullishOrEmpty(value)) {
    return '';
  }

  const encoder =
    typeof component === 'function'
      ? component
      : component
        ? encodeURIComponent
        : encodeURI;

  return value.replace(/(%[0-9A-F]{2})+/gi, (match) => {
    try {
      return encoder(match);
    } catch {
      console.log('URI Component not encodable: ' + match);
      return match;
    }
  });
}
