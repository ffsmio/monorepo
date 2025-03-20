import Nullish from '@ffsm/nullish';
import { DeepObjectPrimitive, Primitive } from './types';
import { decode as _decode } from './decode';

/**
 * Options for parsing query strings.
 */
export interface SerializeParseOptions {
  /**
   * Specifies how arrays are formatted in the query string.
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
   * Whether to parse string values that look like numbers into JavaScript numbers.
   * @default false
   */
  parseNumbers?: boolean;

  /**
   * Whether to parse 'true' and 'false' strings into JavaScript booleans.
   * @default false
   */
  parseBooleans?: boolean;

  /**
   * Whether to decode URI components.
   * @default true
   */
  decode?: boolean | ((value: string) => string);

  /**
   * Whether to ignore the '?' with search and '#' with hash prefix in the query string.
   * @default true
   */
  ignorePrefix?: boolean;
}

function parseKeyPath(key: string): string[] {
  const path: string[] = [];
  let currentKey = '';
  let inBracket = false;

  for (let i = 0; i < key.length; i++) {
    const char = key[i];

    if (char === '[' && !inBracket) {
      path.push(currentKey);
      currentKey = '';
      inBracket = true;
    } else if (char === ']' && inBracket) {
      path.push(currentKey);
      currentKey = '';
      inBracket = false;
    } else {
      currentKey += char;
    }
  }

  if (currentKey) {
    path.push(currentKey);
  }

  return path.filter(Boolean);
}

function addValueToPath(
  obj: DeepObjectPrimitive,
  path: string[],
  value: Primitive,
  isArray: boolean
) {
  if (Nullish.isNullishOrEmpty(path)) {
    return;
  }

  const key = path[0];

  if (path.length === 1) {
    if (isArray) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [];
      }
      obj[key].push(value);
    } else {
      obj[key] = value;
    }

    return;
  }

  const isNextKeyNumber = !Number.isNaN(Number(path[1]));

  if (isNextKeyNumber) {
    if (!obj[key] || !Array.isArray(obj[key])) {
      obj[key] = [];
    }
  } else {
    if (!obj[key] || Array.isArray(obj[key]) || typeof obj[key] !== 'object') {
      obj[key] = {};
    }
  }

  addValueToPath(
    obj[key] as DeepObjectPrimitive,
    path.slice(1),
    value,
    isArray
  );
}

function setNestedValue(
  obj: DeepObjectPrimitive,
  path: string[],
  value: Primitive
) {
  if (Nullish.isNullishOrEmpty(path)) {
    return;
  }

  if (path.length === 1) {
    obj[path[0]] = value;
    return;
  }

  const key = path[0];
  const isNextKeyNumber = !Number.isNaN(Number(path[1]));

  if (isNextKeyNumber) {
    if (!obj[key] || !Array.isArray(obj[key])) {
      obj[key] = [];
    }
  } else {
    if (!obj[key] || Array.isArray(obj[key]) || typeof obj[key] !== 'object') {
      obj[key] = {};
    }
  }

  setNestedValue(obj[key] as DeepObjectPrimitive, path.slice(1), value);
}

/**
 * Converts a URL query string into an object.
 *
 * This function parses a query string and transforms it into a structured object,
 * handling various formats of arrays, nested objects, and primitive values.
 *
 * @param queryString - The query string to parse (with or without the leading '?')
 * @param options - Configuration options for query string parsing
 * @returns A structured object representing the parsed query string
 *
 * @example
 * ```typescript
 * // Basic usage
 * parse('name=John&age=30');
 * // { name: 'John', age: '30' }
 *
 * // With number and boolean parsing
 * parse('active=true&count=42', { parseBooleans: true, parseNumbers: true });
 * // { active: true, count: 42 }
 *
 * // With arrays in bracket format
 * parse('colors[]=red&colors[]=blue', { arrayFormat: 'bracket' });
 * // { colors: ['red', 'blue'] }
 *
 * // With arrays in index format
 * parse('colors[0]=red&colors[1]=blue', { arrayFormat: 'index' });
 * // { colors: ['red', 'blue'] }
 *
 * // With arrays in comma format
 * parse('colors=red,blue', { arrayFormat: 'comma' });
 * // { colors: ['red', 'blue'] }
 *
 * // With nested objects
 * parse('user[name]=John&user[profile][age]=30');
 * // { user: { name: 'John', profile: { age: '30' } } }
 * ```
 */
export function parse(
  queryString: string,
  options: SerializeParseOptions = {}
): DeepObjectPrimitive {
  if (Nullish.isNullishOrEmpty(queryString)) {
    return {};
  }

  const {
    arrayFormat = 'none',
    arrayFormatSeparator = ',',
    parseNumbers = false,
    parseBooleans = false,
    decode = true,
    ignorePrefix = true,
  } = options;

  let query = queryString;

  if (ignorePrefix) {
    query = query.replace(/^[\?\#]/, '');
  }

  const decoder = (value: string): string => {
    if (!decode) return value;
    return _decode(value, decode);
  };

  function parseValue(value: string) {
    if (Nullish.isNullishOrEmpty(value)) {
      return '';
    }

    if (parseBooleans) {
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
    }

    if (parseNumbers) {
      if (/^-?(\d+\.?\d*|\.\d+)$/.test(value)) {
        const num = Number(value);
        if (!Number.isNaN(num) && Number.isFinite(num)) return num;
      }
    }

    return decoder(value);
  }

  const pairs = query.split('&').filter(Boolean);
  const result: DeepObjectPrimitive = {};

  for (const pair of pairs) {
    const [rawKey, rawValue] = pair.split('=', 2);

    const key = decoder(rawKey);
    const value = decoder(rawValue);

    if (!key) {
      continue;
    }

    let path: string[];
    const parsedValue = parseValue(value);

    if (key.endsWith('[]') && arrayFormat === 'bracket') {
      path = [key.slice(0, -2)];
      addValueToPath(result, path, parsedValue, true);
    } else if (key.includes('[') && key.endsWith(']')) {
      path = parseKeyPath(key);
      addValueToPath(result, path, parsedValue, true);
    } else if (
      (arrayFormat === 'comma' || arrayFormat === 'separator') &&
      value.includes(arrayFormatSeparator)
    ) {
      path = [key];
      const values = value.split(arrayFormatSeparator).map(parseValue);
      setNestedValue(result, path, values);
    } else {
      path = [key];
      addValueToPath(result, path, parsedValue, false);
    }
  }

  return result;
}
