import { Cookie } from '@ffsm/cookie';
import { Method } from './method';
import {
  HttpBody,
  HttpConfig,
  HttpHeaders,
  HttpMiddleware,
  HttpMiddlewares,
  HttpParams,
} from './types';

type Config = Omit<HttpConfig, 'body' | 'method'>;

export class Http {
  static readonly Method = Method;
  readonly Method = Method;

  static AuthKey = 'access_token';
  static AuthType = 'Bearer';
  static AuthDetect = true;
  static AuthCache = ['localStorage', 'sessionStorage', 'cookie'];

  static headers: HttpHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  private middlewares: HttpMiddlewares = {
    request: [],
    response: [],
  };

  constructor(
    private readonly url: string,
    private ctx: unknown = null
  ) {}

  private serialize(url: string, params: HttpParams) {
    const matches = url.match(/:[a-zA-Z\d_]+/g) || [];
    let replaced = url;

    for (const match of matches) {
      const key = match.slice(1);
      const value = params[key] || '';
      replaced = replaced.replace(new RegExp(match, 'g'), value.toString());
    }

    return replaced;
  }

  private getUrl(url: string, config: HttpConfig = {}) {
    if (this.url && url.match(/^https?:\/\/.*/)) {
      throw new Error('URL is not valid.');
    }

    const { params = {}, query = {}, body, method } = config;
    let strQuery = '';

    if (!method || method.toUpperCase() === Method.GET) {
      strQuery = new URLSearchParams(
        (body || query) as Record<string, string>
      ).toString();
    }

    let fullUrl = this.serialize(`${this.url}${url}`, params);
  }

  private detectToken() {
    let token = '';

    for (let i = 0; i < Http.AuthCache.length; i++) {
      const cacheAt = Http.AuthCache[i];

      switch (cacheAt) {
        case 'cookie':
          token = Cookie.get(Http.AuthKey, {}, this.ctx)?.value || '';
          break;

        case 'localStorage':
          if ('undefined' !== typeof localStorage) {
            token = localStorage.getItem(Http.AuthKey) || '';
          }
          break;

        case 'sessionStorage':
          if ('undefined' !== typeof sessionStorage) {
            token = sessionStorage.getItem(Http.AuthKey) || '';
          }
          break;
      }

      if (token) {
        break;
      }
    }

    return token;
  }

  private getHeaders(headers: HttpHeaders = {}) {
    const rs = Object.assign({}, Http.headers, headers) as Record<
      string,
      string
    >;

    if (!Http.AuthDetect || !Http.AuthType || rs.Authorization) {
      return rs;
    }

    const token = this.detectToken();

    if (!token) {
      return rs;
    }

    rs.Authorization = `${Http.AuthType} ${token}`;
    return rs;
  }

  setCtx(ctx: unknown) {
    this.ctx = ctx;
    return this;
  }

  on(name: 'request' | 'response', middleware: HttpMiddleware) {
    name = name.toLowerCase() as 'request' | 'response';
    this.middlewares[name]?.includes(middleware) ||
      this.middlewares[name]?.push(middleware);
    return this;
  }

  off(name: 'request' | 'response', middleware: HttpMiddleware) {
    name = name.toLowerCase() as 'request' | 'response';
    this.middlewares[name] = this.middlewares[name]?.filter(
      (fn) => fn !== middleware
    );
    return this;
  }

  async request<DataType>(
    url: string,
    method = Method.GET,
    body?: HttpBody,
    config: Config = {}
  ) {
    const { params = {}, headers, ...rest } = config;

    const requestConfig: HttpConfig = {
      ...rest,
      method,
      headers: this.getHeaders(headers),
    };
  }
}
