import Nullish from '@ffsm/nullish';
import { encode as _encode } from './encode';
import {
  ArrayPrimitive,
  DeepArrayPrimitive,
  DeepObjectPrimitive,
  ObjectPrimitive,
} from './types';

export interface SerializeQueryOptions {
  arrayFormat?: 'bracket' | 'index' | 'comma' | 'separator' | 'none';
  arrayFormatSeparator?: string;
  skipNull?: boolean;
  skipEmptyString?: boolean;
  encode?: boolean | ((value: string) => string);
  strict?: boolean;
  sort?: boolean | ((a: string, b: string) => number);
}

function isValidKey(key: string): boolean {
  return key.length > 0 && /^[a-zA-Z0-9_\-.[\]]+$/.test(key);
}

function isObject(value: unknown): value is object {
  return typeof value === 'object' && !Nullish.isNull(value);
}

export function query(
  params: DeepObjectPrimitive,
  options: SerializeQueryOptions = {}
): string {
  if (Nullish.isNullishOrEmpty(params)) {
    return '';
  }

  const {
    arrayFormat = 'none',
    arrayFormatSeparator = ',',
    skipNull = false,
    skipEmptyString = false,
    encode = true,
    strict = true,
    sort = false,
  } = options;

  const encoder = (value: string): string => {
    if (!encode) return value;
    return _encode(value, encode);
  };

  const formatPair = (key: string, value: unknown): string => {
    if (Nullish.isNullish(value)) {
      return skipNull ? '' : `${encoder(key)}=`;
    }

    if (value === '') {
      return skipEmptyString ? '' : `${encoder(key)}=`;
    }

    if (typeof value === 'boolean') {
      return `${encoder(key)}=${value ? 'true' : 'false'}`;
    }

    return `${encoder(key)}=${encoder(String(value))}`;
  };

  function formatArray(
    key: string,
    array: ArrayPrimitive | DeepArrayPrimitive
  ): string[] {
    if (Nullish.isNullishOrEmpty(array)) {
      return [formatPair(key, '')];
    }

    return array
      .map((value, index) => {
        if (!Nullish.isNullish(value)) {
          if (Array.isArray(value)) {
            let nestedKey;

            switch (arrayFormat) {
              case 'bracket':
                nestedKey = `${key}[]`;
                break;
              case 'index':
                nestedKey = `${key}[${index}]`;
                break;
              case 'comma':
              case 'separator':
                nestedKey = `${key}${arrayFormatSeparator}${index}`;
                break;
              default:
                nestedKey = key;
            }

            return formatArray(nestedKey, value).join('&');
          } else {
            let prefix;

            switch (arrayFormat) {
              case 'bracket':
                prefix = `${key}[]`;
                break;
              case 'index':
                prefix = `${key}[${index}]`;
                break;
              case 'comma':
              case 'separator':
                prefix = `${key}${arrayFormatSeparator}${index}`;
                break;
              default:
                prefix = key;
            }

            return queryNested(prefix, value as ObjectPrimitive);
          }
        }
      })
      .filter(Boolean) as string[];
  }

  function queryNested(
    prefix: string,
    obj: ObjectPrimitive | DeepObjectPrimitive
  ): string {
    const pairs: string[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const newKey = `${prefix}[${key}]`;

        if (Array.isArray(value)) {
          pairs.push(...formatArray(newKey, value));
        } else if (isObject(value)) {
          pairs.push(queryNested(newKey, value as ObjectPrimitive));
        } else {
          const pair = formatPair(newKey, value);
          Nullish.isNullishOrEmpty(pair) || pairs.push(pair);
        }
      }
    }

    return pairs.filter(Boolean).join('&');
  }

  let pairs: string[] = [];
  let keys = Object.keys(params);

  if (sort) {
    keys = typeof sort === 'function' ? keys.sort(sort) : keys.sort();
  }

  for (const key of keys) {
    const value = params[key];

    if (!key || (strict && !isValidKey(key))) {
      continue;
    }

    if (Array.isArray(value)) {
      pairs = [...pairs, ...formatArray(key, value)];
    } else if (isObject(value)) {
      pairs.push(queryNested(key, value as ObjectPrimitive));
    } else {
      const pair = formatPair(key, value);
      Nullish.isNullishOrEmpty(pair) || pairs.push(pair);
    }
  }

  return pairs.filter(Boolean).join('&');
}
