import Nullish from '@ffsm/nullish';
import { encode as _encode } from './encode';
import {
  ArrayPrimitive,
  DeepArrayPrimitive,
  DeepObjectPrimitive,
  ObjectPrimitive,
} from './types';

/**
 * Options for serializing objects to query strings.
 */
export interface SerializeQueryOptions {
  /**
   * Specifies how arrays should be formatted in the query string.
   * - `'bracket'`: Arrays are formatted as key[]=value1&key[]=value2
   * - `'index'`: Arrays are formatted as key[0]=value1&key[1]=value2
   * - `'comma'`: Arrays are formatted as key=value1,value2
   * - `'separator'`: Arrays are formatted as key=value1{separator}value2
   * - `'none'`: Arrays are formatted as key=value1&key=value2
   * @default 'none'
   */
  arrayFormat?: 'bracket' | 'index' | 'comma' | 'separator' | 'none';

  /**
   * The separator character to use when arrayFormat is 'separator' or 'comma'.
   * @default ','
   */
  arrayFormatSeparator?: string;

  /**
   * Whether to skip null and undefined values.
   * @default false
   */
  skipNull?: boolean;

  /**
   * Whether to skip empty string values.
   * @default false
   */
  skipEmptyString?: boolean;

  /**
   * Whether to encode URI components.
   * @default true
   */
  encode?: boolean | ((value: string) => string);

  /**
   * Whether to enforce strict key validation.
   * @default true
   */
  strict?: boolean;

  /**
   * Whether and how to sort the parameters.
   * - true: Sort alphabetically
   * - function: Sort using the provided function
   * @default false
   */
  sort?: boolean | ((a: string, b: string) => number);
}

function isValidKey(key: string): boolean {
  return key.length > 0 && /^[a-zA-Z0-9_\-.[\]]+$/.test(key);
}

function isObject(value: unknown): value is object {
  return typeof value === 'object' && !Nullish.isNull(value);
}

/**
 * Converts an object into a URL query string.
 *
 * This function transforms a JavaScript object into a URL query string,
 * supporting various formats for arrays, nested objects, and special values.
 *
 * @param params - The object to convert to a query string
 * @param options - Configuration options for query string generation
 * @returns A URL query string without the leading '?'
 *
 * @example
 * ```typescript
 * // Basic usage
 * query({ name: 'John', age: 30 });
 * // 'name=John&age=30'
 *
 * // With arrays in bracket format
 * query({ colors: ['red', 'blue'] }, { arrayFormat: 'bracket' });
 * // 'colors[]=red&colors[]=blue'
 *
 * // With arrays in index format
 * query({ colors: ['red', 'blue'] }, { arrayFormat: 'index' });
 * // 'colors[0]=red&colors[1]=blue'
 *
 * // With arrays in comma format
 * query({ colors: ['red', 'blue'] }, { arrayFormat: 'comma' });
 * // 'colors=red,blue'
 *
 * // With nested objects
 * query({ user: { name: 'John', profile: { age: 30 } } });
 * // 'user[name]=John&user[profile][age]=30'
 *
 * // With null/undefined handling
 * query({ name: 'John', email: null, phone: undefined }, { skipNull: true });
 * // 'name=John'
 *
 * // With empty string handling
 * query({ name: 'John', title: '' }, { skipEmptyString: true });
 * // 'name=John'
 *
 * // With sorting
 * query({ b: 2, a: 1, c: 3 }, { sort: true });
 * // 'a=1&b=2&c=3'
 * ```
 */
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
