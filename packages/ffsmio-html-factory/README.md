# @ffsm/html-factory

A lightweight utility for creating React HTML factory components with proper TypeScript support, ref forwarding, and className merging.

[![npm version](https://img.shields.io/npm/v/@ffsm/html-factory.svg)](https://www.npmjs.com/package/@ffsm/html-factory)
[![npm downloads](https://img.shields.io/npm/dm/@ffsm/html-factory.svg)](https://www.npmjs.com/package/@ffsm/html-factory)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)

## Features

- 🚀 Create reusable HTML components with custom defaults
- 🔄 Automatic className merging with deduplication
- 📦 TypeScript-first with full type safety
- 🔗 Forward refs properly to DOM elements
- 🎨 Perfect for design systems and component libraries

## Installation

```bash
# npm
npm i @ffsm/html-factory

# yarn
yarn add @ffsm/html-factory

# pnpm
pnpm add @ffsm/html-factory
```

## Usage

### Basic Example

```tsx
import { factory } from '@ffsm/html-factory';

// Create typesafe HTML components with default props
const Heading = factory('h1', 'Heading', { className: 'text-2xl font-bold' });
const Paragraph = factory('p', 'Paragraph', { className: 'text-base mb-4' });

// Use them in your components
function Article() {
  return (
    <article>
      <Heading className="text-blue-600">
        This heading combines default and custom classes
      </Heading>
      <Paragraph>This paragraph has the default classes applied.</Paragraph>
    </article>
  );
}
```

### Creating a Component Library

```tsx
// components/typography.tsx
import { factory } from '@ffsm/html-factory';

export const H1 = factory('h1', 'H1', { className: 'text-4xl font-bold mb-4' });
export const H2 = factory('h2', 'H2', { className: 'text-3xl font-bold mb-3' });
export const H3 = factory('h3', 'H3', { className: 'text-2xl font-bold mb-2' });
export const P = factory('p', 'P', { className: 'text-base mb-4' });
export const Blockquote = factory('blockquote', 'Blockquote', {
  className: 'pl-4 border-l-4 border-gray-300 italic',
});
```

### Using with Refs

```tsx
import { factory } from '@ffsm/html-factory';
import { useRef } from 'react';

const Button = factory('button', 'Button', {
  className: 'px-4 py-2 bg-blue-500 text-white rounded',
  type: 'button',
});

function Form() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <form>
      {/* Refs are properly forwarded */}
      <Button ref={buttonRef} onClick={() => buttonRef.current?.focus()}>
        Click me
      </Button>
    </form>
  );
}
```

### Using the clsx Utility

```tsx
import { clsx } from '@ffsm/html-factory';

// Combines classes with automatic deduplication
const className = clsx(
  'base-class',
  isActive && 'active',
  isPrimary && 'primary',
  'base-class' // Duplicated class will be removed
);
```

## API

### `factory<El>(tag, displayName, initialProps?)`

Creates a React component factory for the specified HTML tag.

- `tag`: The HTML tag name (e.g., 'div', 'span', 'button')
- `displayName`: The React component display name
- `initialProps`: (Optional) Default props to apply to all instances

Returns a React component with forwarded refs.

### `clsx(...classes)`

Utility to combine class names with deduplication.

- `classes`: Any number of string, boolean, null, or undefined values
- Returns a clean, deduplicated string of class names

### `propsHTML<El>(overrideProps, ref?, initialProps?)`

Internal utility for processing HTML props.

- `overrideProps`: Props passed by the user
- `ref`: React ref to forward
- `initialProps`: Default props from factory

## License

MIT © FFSM Team
