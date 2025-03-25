export function clsx(...classes: Array<string | boolean | null | undefined>) {
  return classes
    .filter((c) => typeof c === 'string' && !!c.trim())
    .join(' ')
    .trim()
    .split(' ')
    .filter((c, i, s) => !!c && s.indexOf(c) === i)
    .join(' ');
}
