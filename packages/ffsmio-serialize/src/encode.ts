import Nullish from '@ffsm/nullish';

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
