import Nullish from '@ffsm/nullish';
import { encode as _encode } from './encode';

export function query(
  obj: Record<string, any>,
  options: {
    arrayFormat?: 'bracket' | 'index' | 'comma' | 'separator' | 'none';
    arrayFormatSeparator?: string;
    skipNull?: boolean;
    skipEmptyString?: boolean;
    encode?: boolean;
    strict?: boolean;
    sort?: boolean | ((a: string, b: string) => number);
  } = {}
): string {
  if (Nullish.isNullishOrEmpty(obj)) {
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
    return _encode(value);
  };

  const formatPair = (key: string, value: any): string => {
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

  const formatArray = (key: string, array: any[]): string[] => {
    if (array.length === 0) {
      return [formatPair(key, '')];
    }

    return array
      .map((value, index) => {
        switch (arrayFormat) {
          case 'bracket':
            return formatPair(`${key}[]`, value);
          case 'index':
            return formatPair(`${key}[${index}]`, value);
          case 'comma':
          case 'separator':
            return index === 0
              ? formatPair(key, array.map(String).join(arrayFormatSeparator))
              : '';
          default:
            return formatPair(key, value);
        }
      })
      .filter(Boolean);
  };

  let pairs: string[] = [];
  let keys = Object.keys(obj);

  if (sort) {
    keys = typeof sort === 'function' ? keys.sort(sort) : keys.sort();
  }

  for (const key of keys) {
    const value = obj[key];

    if (!key || (strict && !isValidKey(key))) {
      continue;
    }

    if (Array.isArray(value)) {
      pairs = [...pairs, ...formatArray(key, value)];
    } else if (typeof value === 'object' && value !== null) {
      const nestedObj = flattenObject(key, value);
      const nestedStr = query(nestedObj, options);
      if (nestedStr) {
        pairs.push(nestedStr);
      }
    } else {
      const pair = formatPair(key, value);
      if (pair) {
        pairs.push(pair);
      }
    }
  }

  return pairs.filter(Boolean).join('&');
}

function isValidKey(key: string): boolean {
  return key.length > 0 && /^[a-zA-Z0-9_\-.[\]]+$/.test(key);
}

function flattenObject(
  prefix: string,
  obj: Record<string, any>
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}[${key}]` : key;

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        Object.assign(result, flattenObject(newKey, value));
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
}
