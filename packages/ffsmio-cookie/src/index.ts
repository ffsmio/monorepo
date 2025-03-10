export interface CookieOptions {
  expires?: string | number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  encode?: boolean | ((value: string) => string);
  priority?: 'low' | 'medium' | 'high';
  maxAge?: number;
  partitioned?: boolean;
  baseDomain?: boolean;
}

export interface CookieSerialized extends CookieOptions {
  name: string;
  value: string;
}

export interface ParseOptions {
  decode?: boolean | ((value: string) => string);
}

export class Cookie {
  static DEFAULT_OPTIONS: CookieOptions = {
    expires: 7,
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  };

  private cookies: Record<string, CookieSerialized> = {};

  private constructor(private initialize: any) {
    this.extract();
  }

  private is(value: any, type: string) {
    return typeof value === type;
  }

  private isServer() {
    return typeof window === 'undefined';
  }

  private extract() {
    if (this.is(this.initialize, 'undefined') && !this.isServer()) {
      this.initialize = document;
    }

    if (!this.initialize) {
      return;
    }

    if (
      this.is(this.initialize, 'object') &&
      this.is(this.initialize.getAll, 'function')
    ) {
      this.extractFromArray(this.initialize.getAll());
      return;
    }

    if (this.is(this.initialize.cookies, 'object')) {
      if (this.is(this.initialize.cookies.getAll, 'function')) {
        this.extractFromArray(this.initialize.cookies.getAll());
        return;
      }
    }

    if (this.is(this.initialize.getSetCookie, 'function')) {
      this.extractFromString(this.initialize.getSetCookie());
      return;
    }

    if (
      this.is(this.initialize.headers, 'object') &&
      this.is(this.initialize.headers.get, 'function')
    ) {
      const fromSetCookie = this.initialize.headers.get('set-cookie');
      const fromCookie = this.initialize.headers.get('cookie');

      this.extractFromString(fromSetCookie || fromCookie);
      return;
    }

    if (this.is(this.initialize.req?.headers, 'object')) {
      if (this.is(this.initialize.req.headers.get, 'function')) {
        this.extractFromString(this.initialize.req.headers.get('cookie'));
        return;
      }

      if (this.is(this.initialize.req.headers.cookie, 'string')) {
        this.extractFromString(this.initialize.req.headers.cookie);
        return;
      }
    }

    if (
      this.is(this.initialize.res?.headers, 'object') &&
      this.is(this.initialize.res.headers.get, 'function')
    ) {
      this.extractFromString(this.initialize.res.headers.get('set-cookie'));
      return;
    }

    if (this.is(this.initialize.cookie, 'string')) {
      this.extractFromString(this.initialize.cookie);
      return;
    }

    if (this.is(this.initialize, 'string')) {
      this.extractFromString(this.initialize);
      return;
    }

    if (Array.isArray(this.initialize)) {
      this.extractFromArray(this.initialize);
      return;
    }
  }

  private extractFromString(value: string) {
    if (!value) {
      return;
    }

    const parts = value.split(';');

    parts.filter(Boolean).forEach((part) => {
      const item = part.split('=');
      const name = item.shift()?.trim();
      const value = item.join('=').trim();

      if (!name) {
        return;
      }

      this.cookies[name] = {
        name,
        value,
      };
    });
  }

  private extractFromArray(arr: unknown[]) {
    arr.forEach((value) => {
      if (this.is(value, 'string')) {
        this.extractFromString(value as string);
      } else if (this.is(value, 'object')) {
        this.cookies[(value as Record<string, string>).name] =
          value as CookieSerialized;
      }
    });
  }

  private isDate(value: any): value is Date {
    return (
      value instanceof Date ||
      (this.is(value, 'object') &&
        Object.prototype.toString.call(value) === '[object Date]')
    );
  }

  private normalizeOptions(options: CookieOptions) {
    const normalized = Object.assign({}, Cookie.DEFAULT_OPTIONS, options);

    if (this.is(normalized.expires, 'number')) {
      let expires = normalized.expires as number;

      if (Number.isNaN(expires) || !Number.isFinite(expires)) {
        expires = Cookie.DEFAULT_OPTIONS.expires as number;
      }

      normalized.expires = new Date(Date.now() + expires * 864e5);
    }

    if (this.isDate(normalized.expires)) {
      normalized.expires = normalized.expires.toUTCString();
    }

    if (!normalized.sameSite || this.is(normalized.sameSite, 'boolean')) {
      normalized.sameSite = normalized.sameSite ? 'strict' : 'lax';
    }

    if (!normalized.path) {
      normalized.path = '/';
    }

    if (normalized.encode === true) {
      normalized.encode = encodeURIComponent;
    } else if (!normalized.encode) {
      normalized.encode = (value: string) => value;
    }

    if (normalized.baseDomain && normalized.domain) {
      normalized.domain = normalized.domain.startsWith('.')
        ? normalized.domain
        : `.${normalized.domain}`;
    }

    type CookieOptionsNormalized = CookieOptions & {
      encode: (value: string) => string;
    };

    return normalized as CookieOptionsNormalized;
  }

  /**
   * - `\u0021-\u003A`: `!` to `:` (ASCII 33 to 58)
   * - `\u003C`: `<` (ASCII 60)
   * - `\u003E-\u007E`: `>` to `~` (ASCII 62 to 126)
   */
  isValidName(name: string) {
    return /^[\u0021-\u003A\u003C\u003E-\u007E]+$/.test(name);
  }

  /**
   * - `\u0021-\u003A`: `!` to `:` (ASCII 33 to 58)
   * - `\u003C-\u007E`: `<` to `~` (ASCII 60 to 126)
   */
  isValidValue(value: string) {
    return /^[\u0021-\u003A\u003C-\u007E]*$/.test(value);
  }

  isValidDomain(domain: string) {
    return /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i.test(
      domain
    );
  }

  isValidPath(path: string) {
    return /^[\u0020-\u003A\u003D-\u007E]*$/.test(path);
  }

  serialize(name: string, value: string, options: CookieOptions = {}) {
    if (!this.isValidName(name)) {
      throw new Error('Invalid cookie name');
    }

    if (!this.isValidValue(value)) {
      throw new Error('Invalid cookie value');
    }

    if (options.domain && !this.isValidDomain(options.domain)) {
      throw new Error('Invalid cookie domain');
    }

    if (options.path && !this.isValidPath(options.path)) {
      throw new Error('Invalid cookie path');
    }

    const optionsNormalized = this.normalizeOptions(options);
    const encoded = optionsNormalized.encode(value);

    let cookie = `${name}=${encoded}`;

    if (Number.isInteger(optionsNormalized.maxAge)) {
      cookie += `; Max-Age=${optionsNormalized.maxAge}`;
    }

    if (optionsNormalized.domain) {
      cookie += `; Domain=${optionsNormalized.domain}`;
    }

    if (optionsNormalized.path) {
      cookie += `; Path=${optionsNormalized.path}`;
    }

    if (optionsNormalized.expires) {
      cookie += `; Expires=${optionsNormalized.expires}`;
    }

    if (optionsNormalized.httpOnly) {
      cookie += `; HttpOnly`;
    }

    if (optionsNormalized.secure) {
      cookie += `; Secure`;
    }

    if (optionsNormalized.partitioned) {
      cookie += `; Partitioned`;
    }

    if (optionsNormalized.priority) {
      switch (optionsNormalized.priority?.toString().toLowerCase()) {
        case 'low':
          cookie += `; Priority=Low`;
          break;
        case 'medium':
          cookie += `; Priority=Medium`;
          break;
        case 'high':
          cookie += `; Priority=High`;
          break;
      }
    }

    if (optionsNormalized.sameSite) {
      switch (optionsNormalized.sameSite?.toString().toLowerCase()) {
        case 'strict':
          cookie += `; SameSite=Strict`;
          break;
        case 'lax':
          cookie += `; SameSite=Lax`;
          break;
        case 'none':
          cookie += `; SameSite=None`;
          break;
      }
    }

    return cookie;
  }

  get(name: string, options: ParseOptions = {}) {
    const cookie = this.cookies[name];

    if (!cookie) {
      return;
    }

    const cloned = { ...cookie };

    if (options.decode === true) {
      options.decode = decodeURIComponent;
    } else if (!options.decode) {
      options.decode = (value: string) => value;
    }

    try {
      cloned.value = options.decode(cloned.value);
    } catch {
      cloned.value = cookie.value;
    }

    return cloned;
  }

  getAll(options?: ParseOptions) {
    const cookies = Object.keys(this.cookies).reduce((acc, name) => {
      acc[name] = this.get(name, options)!;
      return acc;
    }, {} as Record<string, CookieSerialized>);
    return Object.values(cookies);
  }

  set(name: string, value: string, options: CookieOptions = {}) {
    const serialized = this.serialize(name, value, options);

    if (this.isServer()) {
      this.setServer(name, value, options);
    } else {
      document.cookie = serialized;
    }
  }

  private setServer(name: string, value: string, options: CookieOptions = {}) {
    let response;

    if (this.initialize?.res) {
      response = this.initialize.res;
    } else if (this.initialize) {
      response = this.initialize;
    }

    if (!this.is(response, 'object')) {
      return;
    }

    const cookie = this.serialize(name, value, options);
    const cookies: string[] = [];

    Object.keys(this.cookies).forEach((key) => {
      const { name: itemName, value: itemValue, ...rest } = this.cookies[key];

      if (itemName === name) {
        return;
      }

      cookies.push(this.serialize(itemName, itemValue, rest));
    });

    cookies.push(cookie);

    if (this.is(response.setHeader, 'function')) {
      response.setHeader('Set-Cookie', cookies.join('; '));
    } else if (this.is(response.set, 'function')) {
      response.set('Set-Cookie', cookies.join('; '));
    }
  }

  remove(name: string) {
    this.set(name, '', { maxAge: -1, expires: -1 });
  }

  getBaseDomain() {
    if (
      this.is(window, 'undefined') ||
      !window.location ||
      !window.location.hostname
    ) {
      return;
    }

    const parts = window.location.hostname.split('.');

    if (parts.length <= 2) {
      return window.location.hostname;
    }

    return parts.slice(-2).join('.');
  }

  static from(initialize?: any) {
    return new Cookie(initialize);
  }

  static get(name: string, options?: ParseOptions, initialize?: any) {
    return Cookie.from(initialize).get(name, options);
  }

  static getAll(options?: ParseOptions, initialize?: any) {
    return Cookie.from(initialize).getAll(options);
  }
}
