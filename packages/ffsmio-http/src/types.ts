import { Method } from './method';

export type HttpBody =
  | BodyInit
  | string
  | Record<string, unknown>
  | FormData
  | null;

export type HttpHeaders = HeadersInit | Record<string, string>;
export type HttpParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface HttpConfig extends RequestInit {
  method?: Method;
  headers?: HttpHeaders;
  params?: HttpParams;
  query?: Record<string, unknown>;
}

export type HttpMiddleware = (
  config: HttpConfig,
  res?: Response
) => HttpConfig | Promise<HttpConfig>;

export interface HttpMiddlewares {
  request: HttpMiddleware[];
  response: HttpMiddleware[];
}
