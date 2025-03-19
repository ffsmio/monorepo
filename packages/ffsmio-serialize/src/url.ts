import Nullish from '@ffsm/nullish';
import { Primitive } from './types';

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
