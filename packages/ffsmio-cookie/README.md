# Cookie handler for server side and client side

## Installation

```bash
npm i @ffsm/cookie
```

OR

```bash
yarn add @ffsm/cookie
```

## Using

### Get and set

```ts
import { Cookie } from '@ffsm/cookie';

const cookie = Cookie.from(initialize);

// OR
const cookie = new Cookie(initialize);

const staticGet = Cookie.get('access_token', {}, initialize);
const staticGetAll = Cookie.getAll({}, initialize);

const all = cookie.getAll({});
const accessToken = cookie.get('access_token', {});

cookie.set('name', 'value', {
  // options
});
```

`initialize` is used to detect cookies. By default, if initialize is falsy, it will be set to the document of the browser if on the client side context.

### With server side loader

```ts
'use server';

import { cookies } from 'next/headers';
import { Cookie } from '@ffsm/cookie';

export async function loader() {
  const initialize = await cookies();
  const cookie = Cookie.from(initialize);

  const accessToken = cookie.get('access_token', {})?.value;

  // Others code
}
```

### With client side

```tsx
import { useEffect } from 'react';
import { Cookie } from '@ffsm/cookie';

export default function App() {
  useEffect(() => {
    const cookie = new Cookie();
    const accessToken = cookie.get('access_token', {})?.value;
    console.log(accessToken);
  }, []);

  return <div>App</div>;
}
```

### With server side context

```tsx
export default function HomePage() {
  return <div>Home page</div>;
}

HomePage.getInitialProps = (ctx) => {
  const cookie = Cookie.from(ctx);
  const accessToken = cookie.get('access_token', {})?.value;

  return {
    accessToken,
  };
};
```

## Method

### .isValidName(name: string): boolean

### .isValidValue(value: string): boolean

### .isValidDomain(domain: string): boolean

### .isValidPath(path: string): boolean

### .serialize(name: string): string

### .get(name: string, options?: ParseOptions): CookieSerialized

### .getAll(options?: ParseOptions): CookieSerialized[]

### .set(name: string, value: string, options?: CookieOptions): void

### .remove(name: string): void;

### .getBaseDomain(): string

### Cookie.from(initialize?: any): Cookie

### Cookie.get(name: string, options?: ParseOptions, initialize?: any): CookieSerialized

### Cookie.getAll(options?: ParseOptions, initialize?: any): CookieSerialized[]

## Types

### ParseOptions

```ts
export interface ParseOptions {
  decode?: boolean | ((value: string) => string);
}
```

### CookieOptions

```ts
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
```

### CookieSerialized

```ts
export interface CookieSerialized extends CookieOptions {
  name: string;
  value: string;
}
```

## Default options value

```ts
class Cookie {
  static DEFAULT_OPTIONS: CookieOptions = {
    expires: 7,
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  };
}
```

## WIP

Finding case and update more 🤥
