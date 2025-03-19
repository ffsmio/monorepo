import Nullish from '@ffsm/nullish';
import {
  DeepArrayPrimitive,
  DeepObjectPrimitive,
  Primitive,
  SerializeOptions,
} from './types';
import { get } from './get';

export async function variable(text: string, options: SerializeOptions = {}) {
  if (Nullish.isNullishOrEmpty(text)) {
    return '';
  }

  const params = Nullish.nullish(options.params, {}) as
    | DeepObjectPrimitive
    | DeepArrayPrimitive;
  const matches: string[] = Array.from(
    Nullish.nullish(text.match(/{\s*[\w._-]+\s*}/g), [])
  );

  if (Nullish.isNullishOrEmpty(matches)) {
    return Promise.resolve(text);
  }

  const serialized = await Promise.all(
    matches.map(async (match) => {
      const key = match.replace(/[{}]/g, '').trim();
      let value = Nullish.nullish(get(params, key), '') as Primitive;

      if (!Nullish.isNullishOrEmpty(options.format?.[key])) {
        value = await options.format![key](value);
      }

      return {
        key,
        match,
        value: Nullish.nullish(value?.toString(), ''),
      };
    })
  );

  serialized.forEach(
    (item) =>
      (text = text.replace(
        new RegExp(`\\{\\s*${item.key}\\s*\\}`, 'g'),
        item.value
      ))
  );

  return text;
}
