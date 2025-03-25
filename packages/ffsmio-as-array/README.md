# @ffsm/as-array

A lightweight React utility component that enables you to pass the same props to multiple children at once.

## Installation

```bash
# Using npm
npm install @ffsm/as-array

# Using yarn
yarn add @ffsm/as-array

# Using pnpm
pnpm add @ffsm/as-array
```

## Features

- Pass common props to all children with a clean syntax
- Works with any valid React element
- Preserves text nodes and other non-element children
- Typescript support
- Zero dependencies

## Usage

### Basic Example

```jsx
import { AsArray } from '@ffsm/as-array';

function App() {
  return (
    <AsArray className="btn" disabled={true}>
      <button>Save</button>
      <button>Cancel</button>
      <button>Reset</button>
    </AsArray>
  );
}
```

The code above will render three buttons, each with the className "btn" and the disabled attribute set to true.

### Mixed Content

```jsx
import { AsArray } from '@ffsm/as-array';

function App() {
  return (
    <AsArray data-testid="test-element">
      <div>First element</div>
      Some text between elements
      <div>Last element</div>
    </AsArray>
  );
}
```

The text node will be preserved while both `div` elements will receive the `data-testid` attribute.

### Conditional Rendering

```jsx
import { AsArray } from '@ffsm/as-array';

function Form({ isReadOnly }) {
  return (
    <AsArray disabled={isReadOnly}>
      <input type="text" name="name" />
      <input type="email" name="email" />
      <button type="submit">Submit</button>
    </AsArray>
  );
}
```

## API Reference

### `AsArray`

The main component exposed by this package.

#### Props

Any props passed to `AsArray` will be forwarded to each child element. The component itself doesn't have any specific props aside from `children`.

## TypeScript Support

The package includes TypeScript definitions. The `AsArray` component is fully typed:

```tsx
import { AsArray } from '@ffsm/as-array';

function TypedExample() {
  return (
    <AsArray className="container" aria-label="group">
      <div>TypeScript supported!</div>
    </AsArray>
  );
}
```

## How It Works

`AsArray` uses React's `Children.toArray()` to normalize and map through its children. For each child:

1. If the child is not a valid React element (like a text node), it's wrapped in a `Fragment` with a key
2. If the child is a valid React element, it's cloned using `cloneElement` with merged props from both the original child and the `AsArray` component

## Browser Support

This package targets ES modules and works in all modern browsers that support React.

## License

MIT
