/**
 * Utility function to combine class names with deduplication
 * @param {...Array<string | number | boolean | null | undefined>} classes - Classes to combine
 * @returns {string} A combined, deduplicated string of class names
 *
 * @example
 * clsx('btn', conditional && 'btn-primary', 'btn') // 'btn btn-primary'
 */
export function clsx(
  ...classes: Array<string | number | boolean | null | undefined>
) {
  return classes
    .filter((c) => typeof c === 'string' && !!c.trim())
    .join(' ')
    .trim()
    .split(' ')
    .filter((c, i, s) => !!c && s.indexOf(c) === i)
    .join(' ');
}
