import Nullish from '@ffsm/nullish';

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
