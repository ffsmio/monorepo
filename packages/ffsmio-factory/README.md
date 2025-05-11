# @ffsm/factory

`@ffsm/factory` is a powerful component factory for React that simplifies the creation of reusable components with built-in support for composition patterns, conditional rendering, and prop management.

> _Note: Additional examples and illustrations will be added in upcoming updates._

## Table of Contents

- [Installation](#installation)
- [Core Features](#core-features)
- [Basic Usage](#basic-usage)
- [Advanced Features](#advanced-features)
  - [Dynamic Props Initialization](#dynamic-props-initialization)
  - [Slot-Based Composition](#slot-based-composition)
  - [Conditional Rendering](#conditional-rendering)
  - [Empty State Handling](#empty-state-handling)
  - [Combined Features](#combined-features)
- [API Reference](#api-reference)
- [Type System](#type-system)
- [Compatibility](#compatibility)
- [Related Packages](#related-packages)

## Frequently Asked Questions

### How is @ffsm/factory different from styled-components?

While `styled-components` focuses on styling with CSS-in-JS, `@ffsm/factory` provides a more comprehensive approach to component creation with built-in composition patterns, conditional rendering, and prop management.

### Can I use @ffsm/factory with other UI libraries?

Yes, @ffsm/factory works with any React-based UI library. You can wrap components from Material UI, Chakra UI, or any other library using `factory()`.

### Does it work with React Server Components?

Yes, `@ffsm/factory` is compatible with React Server Components, but be aware that some dynamic features might need client-side hydration.

## Why Choose @ffsm/factory?

While there are many component libraries and styling solutions available, `@ffsm/factory` offers unique advantages that set it apart:

### Compared to UI Libraries (Material UI, Chakra UI, etc.)

- **Zero Design Opinions**: Unlike UI libraries that come with predefined styles, factory lets you build components with your own design system
- **Lightweight**: No bloated dependencies, just the functionality you need
- **Customization First**: Built for maximum flexibility rather than conforming to specific design patterns

### Compared to Styling Libraries (styled-components, emotion)

- **Beyond Styling**: Factory handles not just styling but component composition, conditional rendering, and prop management
- **Declarative Patterns**: Built-in support for common UI patterns without extra boilerplate
- **No CSS-in-JS**: Works with your preferred styling approach - CSS modules, Tailwind, or vanilla CSS

### Compared to Component Utilities (Radix UI, HeadlessUI)

- **Full Component Creation**: Not just unstyled primitives, but a complete solution for component creation
- **Simplified API**: Less verbose than hook-based component creation patterns
- **Unified Solution**: Combines accessibility, composition, and styling concerns in one tool

> _Note: More detailed comparisons with specific code examples will be added in future documentation updates._

## Performance Considerations

- Components created with `factory()` have minimal runtime overhead
- For optimal performance with large lists, consider memoizing factory components with `React.memo`
- When using function props (like condition or dynamic className), consider memoizing these functions with `useCallback`

## Installation

```bash
# Using npm
npm install @ffsm/factory

# Using yarn
yarn add @ffsm/factory

# Using pnpm
pnpm add @ffsm/factory
```

## Core Features

- **Component Creation**: Easily create reusable components with consistent APIs
- **Composition Patterns**: Built-in support for slots, conditional rendering, and empty states
- **Prop Management**: Smart prop merging and filtering with type safety
- **Ref Forwarding**: Automatic ref handling for all created components
- **TypeScript Integration**: Full TypeScript support with proper generic types
- **Flexible API**: Support for static and dynamic initialization
- **Integration with @ffsm/compositor**: Leverage all compositor utilities in factory components

## Basic Usage

```jsx
import { factory } from '@ffsm/factory';

// Create a simple button component
const Button = factory('Button', {
  className: 'btn',
  Component: 'button',
});

// Use it in your app
function App() {
  return (
    <Button className="btn-primary" onClick={handleClick}>
      Click Me
    </Button>
  );
}
```

## Integration with Tailwind CSS

`@ffsm/factory` works exceptionally well with Tailwind CSS, allowing you to create reusable components
with consistent styling while maintaining the utility-first approach.

### Creating Tailwind Component Libraries

Using factory with Tailwind CSS gives you the best of both worlds: the simplicity of Tailwind's utility
classes and the reusability of component abstractions:

```jsx
import { factory } from '@ffsm/factory';
import { clsx } from '@ffsm/factory/clsx';

// Create a reusable button component with Tailwind classes
export const Button = factory<{
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}>('Button', (props) => ({
  as: 'button',
  className: clsx(
    // Base styles
    'font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',

    // Size variations
    props.size === 'sm' && 'px-3 py-1.5 text-sm',
    props.size === 'lg' && 'px-5 py-2.5 text-lg',
    (!props.size || props.size === 'md') && 'px-4 py-2 text-base',

    // Variant styles
    props.variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    props.variant === 'secondary' && 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    props.variant === 'outline' && 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    (!props.variant || props.variant === 'primary') && 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
  )
}));

// Usage
<Button variant="secondary" size="lg" onClick={handleClick}>
  Save Changes
</Button>
```

### Building UI Systems with Tailwind + Factory

You can create complete UI systems by composing factory components with Tailwind classes:

```tsx
// Card components
export const Card = factory<{}>('Card', {
  className: 'bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden',
});

export const CardHeader = factory<{}>('CardHeader', {
  className: 'px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700',
});

export const CardBody = factory<{}>('CardBody', {
  className: 'px-4 py-5 sm:p-6',
});

export const CardFooter = factory<{}>('CardFooter', {
  className: 'px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700',
});

// Form components
export const FormGroup = factory<{}>('FormGroup', {
  className: 'mb-4',
});

export const Label = factory<{ required?: boolean }>('Label', (props) => ({
  as: 'label',
  className: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
  children: ({ children, required }) => (
    <>
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </>
  ),
}));

export const Input = factory<{
  error?: boolean;
}>('Input', (props) => ({
  as: 'input',
  className: clsx(
    'block w-full rounded-md shadow-sm sm:text-sm',
    props.error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  ),
}));
```

### Advantages Over Direct Tailwind Usage

Using factory with Tailwind provides several advantages:

1. **Consistency**: Define variants and styles in one place to ensure consistent UI
2. **DRY Principle**: Avoid repeating the same lengthy class strings throughout your application
3. **Maintainability**: Update styling in one place rather than hunting through your codebase
4. **Type Safety**: Get full TypeScript support for component variations
5. **Prop-Based Styling**: Toggle styles based on props rather than conditional class composition
6. **Semantic Markup**: Create semantically meaningful components instead of div-soup with classes

### With Tailwind Plugins

Factory components work seamlessly with Tailwind plugins like `@tailwindcss/forms`:

```tsx
export const Select = factory<{
  error?: boolean;
}>('Select', (props) => ({
  as: 'select',
  className: clsx(
    'block w-full rounded-md shadow-sm sm:text-sm',
    props.error
      ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  ),
}));
```

This approach gives you all the benefits of Tailwind's utility-first approach while providing the abstraction
and reusability of a component library.

## Advanced Features

### Dynamic Props Initialization

```jsx
import { factory } from '@ffsm/factory';
import { clsx } from '@ffsm/factory/clsx';

const Card = factory('Card', (props) => ({
  className: clsx(
    'card',
    props.elevated && 'card-elevated',
    props.variant && `card-${props.variant}`
  ),
}));

// Usage
<Card elevated variant="primary">
  Card content
</Card>;
```

### Slot-Based Composition

```jsx
import { factory } from '@ffsm/factory';

const Panel = factory('Panel', {
  asSlot: true,
  outlet: <div className="panel-wrapper" />,
});

// Usage
<Panel>
  <h2>Panel Title</h2>
  <p>Panel content</p>
</Panel>;
```

#### Advanced Slot Examples

You can use the `children` prop as a function to transform the children based on component props:

```tsx
import { factory } from '@ffsm/factory';
import { AsNode } from '@ffsm/compositor';
import { cn } from './utils';

// Form label with required indicator
export const FormLabel = factory<
  {
    required?: boolean;
  },
  'label'
>('FormLabel', {
  as: 'label',
  className: 'block text-sm font-medium text-slate-200',
  asSlot: true,
  children: ({ children, required }) => (
    <AsNode of={children}>
      {children}
      {required && <span className="text-red-500">*</span>}
    </AsNode>
  ),
});

// Usage
<FormLabel required htmlFor="email">
  Email Address
</FormLabel>;
// Renders: <label class="block text-sm font-medium text-slate-200" for="email">Email Address<span class="text-red-500">*</span></label>
```

You can also combine dynamic props with slot functionality:

```tsx
import { factory } from '@ffsm/factory';
import { AsNode } from '@ffsm/compositor';
import { cn } from './utils';

// Helper text with error state
export const FormHelper = factory<
  {
    error?: boolean;
  },
  'p'
>('FormHelper', ({ error }) => ({
  as: 'p',
  className: cn('text-xs mt-1', error ? 'text-red-500' : 'text-slate-400'),
  children: ({ children }) => <AsNode of={children}>{children}</AsNode>,
}));

// Usage
<FormHelper error={!!errorMessage}>
  {errorMessage || 'Please enter your information'}
</FormHelper>;
// Renders: <p class="text-xs mt-1 text-red-500">Invalid email format</p>
```

These components demonstrate how you can use the factory to create specialized UI components with built-in behaviors, while maintaining a clean API for consumers.

### Conditional Rendering

```tsx
import { factory } from '@ffsm/factory';

const AdminSection = factory<{
  isAdmin: boolean;
}>('AdminSection', (props) => ({
  condition: props.isAdmin,
  conditionFallback: <p>You need admin permissions to view this content.</p>,
}));

// Usage
<AdminSection isAdmin={user.isAdmin}>
  <AdminDashboard />
</AdminSection>;
```

### Empty State Handling

```jsx
import { factory } from '@ffsm/factory';

const UserList = factory('UserList', {
  Component: 'ul',
  emptyFallback: <p>No users found</p>,
});

// Usage
<UserList>
  {users.map((user) => (
    <li key={user.id}>{user.name}</li>
  ))}
</UserList>;
```

### Combined Features

You can combine multiple features in a single factory component:

```tsx
import { factory } from '@ffsm/factory';

const DataPanel = factory<{
  isLoading: boolean;
}>('DataPanel', (props) => ({
  asSlot: true,
  outlet: <div className="data-panel" />,
  condition: !props.isLoading,
  conditionFallback: <LoadingSpinner />,
  emptyFallback: <EmptyState message="No data available" />,
}));

// Usage
<DataPanel isLoading={isLoading}>{data && data.items}</DataPanel>;
```

### Advanced Configuration Options

Factory components can be further customized using the third parameter of the `factory()` function. This parameter allows you to control how props are filtered and forwarded to the underlying component.

```tsx
import { factory } from '@ffsm/factory';

// Exclude specific props from being forwarded to DOM
const Button = factory(
  'Button',
  {
    className: 'btn',
  },
  {
    // Prevent these props from being forwarded to the DOM
    excludeProps: ['isActive', 'isDisabled', 'variant'],
  }
);

// Usage
<Button isActive variant="primary" onClick={handleClick}>
  Click Me
</Button>;
// The isActive and variant props won't be passed to the DOM element
```

You can also use a custom function to determine which props should be forwarded:

```tsx
const Input = factory(
  'Input',
  {
    className: 'input',
  },
  {
    // Only forward standard HTML attributes and data/aria attributes
    shouldForwardProp: (prop) =>
      !prop.startsWith('$') &&
      (prop.startsWith('data-') ||
        prop.startsWith('aria-') ||
        !prop.includes('-')),
  }
);

// Usage
<Input $internal={true} data-testid="input" aria-label="Name" />;
// $internal won't be forwarded, but data-testid and aria-label will
```

These configuration options are particularly useful in the following scenarios:

1. **Creating design system components** that shouldn't leak implementation details to the DOM
2. **Avoiding React warnings** about non-standard HTML attributes
3. **Wrapping third-party components** with specific prop requirements
4. **Supporting custom props for styling** without forwarding them to DOM elements
5. **Implementing prop namespacing** with prefixes like $ for internal use

By carefully controlling which props get forwarded, you can create components with cleaner APIs
that don't cause DOM validation warnings and follow best practices for React component development.

## API Reference

### factory()

```typescript
function factory<
  AdditionalProps extends Record<string, any>,
  Element extends ElementType = 'div',
>(
  displayName: string,
  init?: FactoryInitialProps<Element, AdditionalProps>,
  options?: FactoryOptions<ElementType, AdditionalProps>
): ForwardRefExoticComponent<...>;
```

#### Parameters

- `displayName`: The display name used in React DevTools
- `init`: Initial props or a function that returns initial props
- `options`: Additional options for the factory component

#### Init Props

| Prop                | Type                            | Description                                      |
| ------------------- | ------------------------------- | ------------------------------------------------ |
| `Component`         | ElementType                     | The base component or HTML element to render     |
| `asSlot`            | boolean                         | Enable slot-based composition                    |
| `outlet`            | ReactNode                       | The wrapper component for slot-based composition |
| `asNode`            | boolean                         | Enable conditional rendering based on children   |
| `asNodeFalsy`       | boolean                         | Use strict falsy checking for asNode             |
| `condition`         | unknown \| ((props) => unknown) | Condition for conditional rendering              |
| `conditionFallback` | ReactNode                       | Content to show when condition is falsy          |
| `conditionFalsy`    | boolean                         | Use strict falsy checking for condition          |
| `emptyFallback`     | ReactNode                       | Content to show when children are empty          |
| `...props`          | any                             | Any additional props to pass to the component    |

#### Options

| Option              | Type                     | Description                                                |
| ------------------- | ------------------------ | ---------------------------------------------------------- |
| `excludeProps`      | string[]                 | Props to exclude from being forwarded to DOM               |
| `shouldForwardProp` | (key: string) => boolean | Custom function to determine if a prop should be forwarded |

## Type System

The `@ffsm/factory` package includes a powerful type system that provides full TypeScript support. Here's an overview of the key types and how to use them effectively.

### Core Types

#### `FactoryProps<Element, AdditionalProps>`

The main props type for factory-created components, combining:

- Element-specific props
- Your custom additional props
- Common factory props (className, style, etc.)

```typescript
// Example: Creating a button with custom props
type ButtonProps = {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
};

const Button = factory<ButtonProps, 'button'>('Button', {
  className: 'btn',
  Component: 'button'
});

// Usage with type checking:
<Button
  variant="primary"  // ✓ Type checked
  size="sm"          // ✓ Type checked
  onClick={() => {}} // ✓ Inherited from 'button' element
  invalid={true}     // ✗ Type error
/>
```

#### `FactoryInitialProps<Element, AdditionalProps>`

A flexible type that represents initial props configuration, can be:

1. Static object:

```typescript
const Card = factory('Card', {
  className: 'card',
  Component: 'div',
});
```

2. Function that returns props based on incoming props:

```typescript
const Button = factory<ButtonProps>('Button', (props) => ({
  className: `btn btn-${props.variant} btn-${props.size}`,
  Component: 'button',
}));
```

### Using Generic Types

#### Custom Component Props

Define custom props and maintain full type safety:

```typescript
interface TabProps {
  active?: boolean;
  label: string;
  index: number;
}

const Tab = factory<TabProps>('Tab', (props) => ({
  className: props.active ? 'tab active' : 'tab',
  'aria-selected': props.active,
  role: 'tab',
  Component: 'div'
}));

// Usage with TypeScript validation
<Tab
  label="Settings" // Required
  index={2}        // Required
  active={true}    // Optional
/>
```

#### Element Type Customization

Specify a different base element type:

```typescript
const NavLink = factory<{}, 'a'>('NavLink', {
  className: 'nav-link',
  Component: 'a'
});

// Usage with anchor-specific props
<NavLink href="/about" target="_blank">About</NavLink>
```

### Important Note on Type Inference

When creating a factory component that simply forwards props to an existing component without adding any additional props, it's important to explicitly specify an empty object as the `AdditionalProps` generic parameter. This ensures TypeScript correctly infers all the props of the resulting component.

```tsx
// Correct approach - explicitly specify empty object
export const FormWrapper = factory<{}>('FormWrapper', {
  className: 'w-full',
});

// Not recommended - may cause type inference issues
export const FormContainer = factory('FormContainer', {
  className: 'flex w-full border border-white/20 rounded-lg',
});
```

Without the explicit `<{}>` type parameter, TypeScript might not correctly infer props from the base component, potentially causing type errors when using the component with props that should be valid.

If you're also specifying a custom element type, include both generic parameters:

```tsx
// Forwarding props to an anchor element with no additional props
export const LinkButton = factory<{}, 'a'>('LinkButton', {
  className: 'inline-block px-4 py-2 rounded bg-blue-500 text-white',
  as: 'a',
});

// Now you can use anchor props without type errors
<LinkButton href="/dashboard" target="_blank">
  Go to Dashboard
</LinkButton>;
```

This explicit type parameterization ensures the component maintains full type safety with the underlying element's props.

### Advanced Type Features

#### Conditional Props

Factory components can accept props conditionally, while maintaining type safety:

```typescript
type DialogProps = {
  title: string;
  size?: 'sm' | 'md' | 'lg';
  // Only when closable is true, onClose is required
  closable?: boolean;
  onClose?: closable extends true ? () => void : never;
};

const Dialog = factory<DialogProps>('Dialog' /* ... */);
```

#### Component Composition

When creating complex components, you can compose types:

```typescript
type CardProps = {
  title: string;
  elevated?: boolean;
};

type CardImageProps = CardProps & {
  imageSrc: string;
  imageAlt?: string;
};

const Card = factory<CardProps>('Card' /* ... */);
const CardWithImage = factory<CardImageProps>('CardWithImage' /* ... */);
```

### Type Utilities

The package exports several utility types that can be useful when working with React components:

- `MaybeFn<Result, Props>`: A type that can be either a value or a function returning that value
- `ObjectProps<O>`: Generic object properties type
- `StyleProp<Element>`: Extracts the style prop type from an element
- `Factory<Element>`: Gets the ref type from an element type

These utility types can be imported directly from the package:

```typescript
import { MaybeFn, ObjectProps } from '@ffsm/factory';

// Dynamic value based on props
const getDynamicValue: MaybeFn<string, { theme: string }> = (props) =>
  `color-${props.theme}`;
```

## Utilities

### Included Utilities

#### clsx

This package includes a lightweight version of the [`clsx`](https://www.npmjs.com/package/clsx) utility for conditional class name composition. You can import it directly from the package:

```tsx
import { clsx } from '@ffsm/factory';

const Button = factory('Button', (props) => ({
  className: clsx(
    'btn',
    props.variant && `btn-${props.variant}`,
    props.size && `btn-${props.size}`,
    props.disabled && 'btn-disabled'
  ),
}));
```

The included `clsx` utility allows you to conditionally join class names together, similar to the original package but with no external dependencies. It supports:

- Strings: `'btn'`
- Objects: `{ 'btn-primary': isPrimary }`
- Arrays: `['btn', isActive && 'btn-active']`
- Falsy values are ignored: `false && 'hidden'` → nothing is added

This eliminates the need to install an additional package for class name management in your projects.

> Note: The clsx implementation is derived from the original [clsx](https://www.npmjs.com/package/clsx) package, adapted for internal use with proper attribution to the original source.

## Compatibility

- React 16.8+
- TypeScript 4.5+
- Works with Next.js, Create React App, Vite, and other React environments

## Related Packages

- [@ffsm/compositor](https://github.com/ffsmio/monorepo/tree/main/packages/ffsmio-compositor) - Utility components for React composition patterns
