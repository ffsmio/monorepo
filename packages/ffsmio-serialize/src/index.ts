import { decode } from './decode';
import { encode } from './encode';
import { get } from './get';
import { parse, SerializeParseOptions } from './parse';
import { query, SerializeQueryOptions } from './query';
import { url } from './url';
import { variable } from './variable';
import { isString, isNumber, isBoolean, isPrimitive } from './primitive';

export type { SerializeParseOptions, SerializeQueryOptions };
export {
  decode,
  encode,
  get,
  parse,
  url,
  variable,
  isBoolean,
  isNumber,
  isPrimitive,
  isString,
};

export default {
  decode,
  encode,
  get,
  parse,
  query,
  url,
  variable,
  isBoolean,
  isNumber,
  isPrimitive,
  isString,
};
