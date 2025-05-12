# @ffsm/factory

`@ffsm/factory` is a powerful component factory for React that simplifies the creation of reusable components with built-in support for composition patterns, conditional rendering, and prop management.

> _Note: Additional examples and illustrations will be added in upcoming updates._

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Core Features](#core-features)
- [Basic Usage](#basic-usage)
- [Component Factory](#component-factory)
  - [Dynamic Props Initialization](#dynamic-props-initialization)
  - [Advanced Configuration Options](#advanced-configuration-options)
- [Compositor Integration](#compositor-integration)
  - [Installation](#compositor-installation)
  - [Usage](#compositor-usage)
  - [Slot-Based Composition](#slot-based-composition)
  - [Conditional Rendering](#conditional-rendering)
  - [Empty State Handling](#empty-state-handling)
  - [Combined Features](#combined-features)
- [Integration with Tailwind CSS](#integration-with-tailwind-css)
  - [Creating Tailwind Component Libraries](#creating-tailwind-component-libraries)
  - [Building UI Systems with Tailwind + Factory](#building-ui-systems-with-tailwind--factory)
  - [Advantages Over Direct Tailwind Usage](#advantages-over-direct-tailwind-usage)
- [API Reference](#api-reference)
  - [factory()](#factory)
  - [Init Props](#init-props)
  - [Options](#options)
- [Type System](#type-system)
  - [Core Types](#core-types)
  - [Using Generic Types](#using-generic-types)
  - [Advanced Type Features](#advanced-type-features)
- [Utilities](#utilities)
  - [clsx](#clsx)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Why Choose @ffsm/factory?](#why-choose-ffsmfactory)
  - [Compared to UI Libraries](#compared-to-ui-libraries)
  - [Compared to Styling Libraries](#compared-to-styling-libraries)
  - [Compared to Component Utilities](#compared-to-component-utilities)
- [Performance Considerations](#performance-considerations)
- [Compatibility](#compatibility)
- [Related Packages](#related-packages)

## Introduction

`@ffsm/factory` is a powerful component creation system for React that streamlines how you build, compose,
and manage reusable UI components. Unlike traditional component libraries, factory doesn't impose design opinions
but instead focuses on providing a flexible and type-safe foundation for creating your own component ecosystem.

At its core, `@ffsm/factory` solves common challenges in component development:

- **Component Creation Overhead**: Simplifies creating consistent components with less boilerplate
- **Prop Management Complexity**: Handles prop forwarding, filtering, and merging automatically
- **Type Safety Challenges**: Provides comprehensive TypeScript support with proper generic typing
- **Composition Patterns**: Offers built-in patterns for component composition
- **UI Pattern Repetition**: Consolidates common UI patterns into declarative APIs

The library comes in two versions:

- **Basic Factory** (`@ffsm/factory`): Core functionality for component creation, styling, and prop management
- **Compositor Factory** (`@ffsm/factory/compositor`): Extended version with advanced UI patterns like conditional rendering, slots, and empty states

## Installation

Installing `@ffsm/factory` is straightforward with your preferred package manager:

```bash
# Using npm
npm install @ffsm/factory

# Using yarn
yarn add @ffsm/factory

# Using pnpm
pnpm add @ffsm/factory
```

Basic vs. Compositor Installation

`@ffsm/factory` comes in two versions:

1. **Basic Factory**: The core package with essential component creation features

```jsx
import { factory } from '@ffsm/factory';
```

2. **Compositor-Enabled Factory**: Extended version with advanced UI patterns

```bash
# Install both packages for compositor features
npm install @ffsm/factory @ffsm/compositor
```

```jsx
import { factory } from '@ffsm/factory/compositor';
```

**TypeScript Support**

`@ffsm/factory` includes built-in TypeScript types - no additional packages required.

**Peer Dependencies**

- React 16.8+ (for Hooks support)
- React DOM 16.8+

**Optional Integrations**

- **Tailwind CSS**: Works excellently with Tailwind for utility-first styling
- **CSS Modules**: Fully compatible with CSS Modules and other styling approaches
- **Other UI Libraries**: Can wrap components from any React UI library

Choose the installation that matches your requirements - start with the basic package for simple component creation,
or include the compositor package for advanced UI patterns.

## Core Features

`@ffsm/factory` provides a comprehensive set of features to streamline React component development:

- **Component Creation**: Easily create reusable components with consistent APIs
- **Prop Management**: Smart prop merging and filtering with type safety
- **Ref Forwarding**: Automatic ref handling for all created components
- **TypeScript Integration**: Full TypeScript support with proper generic types
- **Flexible API**: Support for static and dynamic initialization
- **Template Functions**: Customize component rendering with template functions
- **Composition Patterns**: Built-in support for advanced UI patterns (with compositor)

### Basic Factory Features

The core factory functionality focuses on simplified component creation:

```tsx
import { factory } from '@ffsm/factory';

// Create a simple button component
const Button = factory<{}>('Button', {
  className: 'btn',
  as: 'button',
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

### Compositor Integration Features

When used with the compositor package, additional UI patterns are available:

- **Conditional Rendering**: Show components based on conditions or state
- **Empty State Handling**: Display fallback content when children are empty
- **Slot-Based Composition**: Render children into specific locations in a component
- **Node-Based Rendering**: Conditionally render based on children existence

```tsx
import { factory } from '@ffsm/factory/compositor';

// Component that only renders for authenticated users
const ProtectedContent = factory<{}>('ProtectedContent', {
  condition: (props) => props.isAuthenticated,
  conditionFallback: <LoginPrompt />,
});

// Usage
<ProtectedContent isAuthenticated={user?.authenticated}>
  <UserDashboard />
</ProtectedContent>;
```

### Advanced Prop Management

Factory components automatically handle:

- **Prop Forwarding**: Pass appropriate props to the DOM or wrapped components
- **Prop Merging**: Intelligently combine className, style and other props
- **Prop Filtering**: Exclude specific props from being forwarded to DOM elements
- **Custom Prop Logic**: Control exactly which props get forwarded and how

All these features are designed to work together seamlessly, providing a robust foundation
for building React component libraries or design systems.

## Basic Usage

Getting started with `@ffsm/factory` is simple and straightforward. The library provides an intuitive API
for creating reusable React components with minimal boilerplate:

```tsx
import { factory } from '@ffsm/factory';

// Create a simple button component
const Button = factory<{}>('Button', {
  className: 'btn',
  as: 'button',
});

// Use it in your application
function App() {
  return (
    <Button className="btn-primary" onClick={() => alert('Clicked!')}>
      Click Me
    </Button>
  );
}
```

### Creating Components

The `factory()` function takes three parameters:

- **Display Name**: Used in React DevTools for easier debugging
- **Initial Props** _(optional)_: Static props or a function returning props
- **Options** _(optional)_: Additional configuration for the component

```tsx
// Static props initialization
const Card = factory<{}>('Card', {
  className: 'card',
  as: 'div',
});

// Dynamic props based on component props
const Button = factory<{ variant?: 'primary' | 'secondary' }>(
  'Button',
  (props) => ({
    className: `btn ${props.variant ? `btn-${props.variant}` : ''}`,
    as: 'button',
  })
);
```

### Using Factory Components

Factory components behave like standard React components:

```jsx
// Props are merged with initial props
<Button className="mt-4" onClick={handleClick}>
  Submit
</Button>;

// Props can be spread
const buttonProps = { className: 'large', disabled: true };
<Button {...buttonProps}>Cancel</Button>;

// Ref forwarding works automatically
const buttonRef = useRef < HTMLButtonElement > null;
<Button ref={buttonRef}>Focus Me</Button>;
```

### Customizing Element Type

You can specify the element type using the `as` prop:

```tsx
// Create a component with default element type
const Text = factory<{}>('Text', {
  className: 'text',
});

// Override element type when using the component
<Text as="h1" className="text-xl">Heading</Text>
<Text as="p" className="text-sm">Paragraph</Text>
<Text as="span" className="text-xs">Small text</Text>
```

### Type Safety

Factory components are fully typed with TypeScript, providing excellent autocomplete and type checking:

```tsx
// Define component-specific props
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

// Create type-safe component
const Button = factory<ButtonProps>('Button', (props) => ({
  className: `btn btn-${props.variant || 'primary'} btn-${props.size || 'md'}`,
  as: 'button',
}));

// Type checking and autocomplete work as expected
<Button
  variant="primary" // ✓ Autocomplete for 'primary', 'secondary', 'outline'
  size="lg" // ✓ Autocomplete for 'sm', 'md', 'lg'
  onClick={() => {}} // ✓ Standard button props available
/>;
```

These examples demonstrate the foundation of using `@ffsm/factory` for component creation.
The subsequent sections will explore more advanced patterns and features.

## Component Factory

The component factory is the heart of `@ffsm/factory`, providing a flexible and type-safe way to
create reusable React components. This section explores its capabilities, from basic usage to advanced
configuration options.

**Creating Components with Factory**

The `factory()` function streamlines the process of creating React components by handling boilerplate
code and providing a consistent API:

```tsx
import { factory } from '@ffsm/factory';

// Create a simple button component
const Button = factory<{}>('Button', {
  className: 'btn',
  as: 'button',
});

// Create a card component
const Card = factory<{}>('Card', {
  className: 'card',
});
```

When you create a component with `factory()`, it:

1. Creates a forward-ref component with the specified display name
2. Handles prop merging (className, style, etc.)
3. Sets up proper type definitions with TypeScript
4. Automatically forwards refs to the underlying DOM element

### Dynamic Props Initialization

One of the most powerful features of the factory is dynamic prop initialization, which allows you to
define props based on the component's runtime props:

```tsx
import { factory } from '@ffsm/factory';

// Button component with variant support
const Button = factory<{
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}>('Button', (props) => ({
  className: `
    btn 
    ${props.variant ? `btn-${props.variant}` : 'btn-primary'} 
    ${props.size ? `btn-${props.size}` : 'btn-md'}
  `,
  as: 'button',
}));

// Usage
<Button variant="secondary" size="lg">
  Large Secondary Button
</Button>;
```

This approach enables:

- **Prop-driven styling**: Change component appearance based on props
- **Conditional attributes**: Add or remove attributes based on prop values
- **Computed props**: Derive props from multiple input props

### Advanced Configuration Options

The third parameter to `factory()` lets you configure how the component handles props:

```tsx
import { factory } from '@ffsm/factory';

// Create a link component with external link handling
const Link = factory<{
  isExternal?: boolean;
}>(
  'Link',
  {
    as: 'a',
    className: 'link',
  },
  {
    // Don't forward custom props to the DOM
    excludeProps: ['isExternal'],

    // Custom template function to add security attributes to external links
    template: (Component, props, initProps) => (
      <Component
        {...props}
        target={initProps.isExternal ? '_blank' : undefined}
        rel={initProps.isExternal ? 'noopener noreferrer' : undefined}
      />
    ),
  }
);

// Usage
<Link href="https://example.com" isExternal>
  External Link
</Link>;
```

**Available Options**

The factory accepts several configuration options to customize behavior:

- **excludeProps**: Array of prop names that shouldn't be forwarded to DOM
- **shouldForwardProp**: Function to determine if a prop should be forwarded
- **template**: Custom rendering template for more complex component structures

**Custom Templates**

The template option gives you complete control over how your component renders:

```tsx
// Create a form field with label and error handling
const FormField = factory<{
  label?: string;
  error?: string;
}>(
  'FormField',
  {
    as: 'input',
    className: 'form-control',
  },
  {
    excludeProps: ['label', 'error'],
    template: (Component, props, initProps) => (
      <div className="form-group">
        {initProps.label && (
          <label className="form-label">{initProps.label}</label>
        )}
        <Component {...props} />
        {initProps.error && <div className="form-error">{initProps.error}</div>}
      </div>
    ),
  }
);

// Usage
<FormField
  label="Email Address"
  type="email"
  placeholder="your@email.com"
  error={errors.email}
/>;
```

Templates are useful for:

- Creating layout structures around components
- Adding decorative elements based on props
- Implementing complex interaction patterns
- Creating compound components with multiple parts

By leveraging the configuration options, you can create highly customized and reusable components
while maintaining clean, developer-friendly APIs.

## Compositor Integration

The Compositor integration extends `@ffsm/factory` with advanced UI patterns leveraging
the `@ffsm/compositor` package. This powerful combination allows you to create components
with built-in support for conditional rendering, slot-based composition, and empty state handling.

### Installation

To use the compositor features, you need to install both packages:

```bash
# Using npm
npm install @ffsm/factory @ffsm/compositor

# Using yarn
yarn add @ffsm/factory @ffsm/compositor

# Using pnpm
pnpm add @ffsm/factory @ffsm/compositor
```

### Usage

Import factory from the compositor subpath to access all the enhanced features:

```tsx
// Import the compositor-enabled factory
import { factory } from '@ffsm/factory/compositor';

// Create components with advanced composition patterns
const Card = factory<{}>('Card', {
  className: 'card',
  emptyFallback: <p>No content available</p>,
});
```

### Slot-Based Composition

The slot-based composition pattern allows you to render children into designated "slots" within your component,
similar to how web components handle content projection:

```tsx
import { factory } from '@ffsm/factory/compositor';

// Create a dialog with header and content slots
const Dialog = factory<{}>('Dialog', {
  className: 'dialog',
  asSlot: true,
  children: ({ children }) => (
    <div className="dialog-container">
      <div className="dialog-header"></div>
      <div className="dialog-content">{children}</div>
    </div>
  ),
});

// Usage with content projected into the slot
<Dialog>This content will be rendered inside the dialog-content div</Dialog>;
```

### Conditional Rendering

Conditional rendering lets you show or hide components based on specific conditions:

```tsx
import { factory } from '@ffsm/factory/compositor';

// Component that only renders for authenticated users
const ProtectedContent = factory<{
  isAuthenticated: boolean;
}>('ProtectedContent', (props) => ({
  condition: props.isAuthenticated,
  conditionFallback: <LoginPrompt />,
}));

// Component with async conditions (e.g., permission check)
const AdminPanel = factory<{
  userId: string;
}>('AdminPanel', (props) => ({
  // Can return a Promise for async checks
  condition: async () => {
    const permissions = await fetchUserPermissions(props.userId);
    return permissions.includes('admin');
  },
  conditionFallback: <AccessDenied />,
}));

// Usage
<ProtectedContent isAuthenticated={Boolean(user)}>
  <UserDashboard />
</ProtectedContent>;
```

### Empty State Handling

Empty state handling provides fallback content when children are empty or non-existent:

```tsx
import { factory } from '@ffsm/factory/compositor';

// List with empty state
const UserList = factory<{}>('UserList', {
  as: 'ul',
  className: 'user-list',
  emptyFallback: <p className="empty-message">No users found</p>,
});

// Usage with conditional content
<UserList>
  {users.length > 0
    ? users.map((user) => <li key={user.id}>{user.name}</li>)
    : null}
</UserList>;
```

You can also use the `asNode` option to only render a component when it has children:

```tsx
import { factory } from '@ffsm/factory/compositor';

// Section that only renders when it has content
const Section = factory<{}>('Section', {
  className: 'section',
  asNode: true,
});

// Won't render anything
<Section />

// Will render normally
<Section>
  <h2>Section Title</h2>
  <p>Content here</p>
</Section>
```

### Combined Features

The real power of compositor integration comes from combining these patterns:

```tsx
import { factory } from '@ffsm/factory/compositor';

// Data panel component with loading, empty, and error states
const DataPanel = factory<{
  isLoading: boolean;
  error?: string;
}>('DataPanel', (props) => ({
  // Only render when not loading
  condition: !props.isLoading,
  conditionFallback: <LoadingSpinner />,

  // Show error message when there's an error
  asSlot: Boolean(props.error),
  children: props.error ? (
    <div className="error-container">{props.error}</div>
  ) : undefined,

  // When no error but no content, show empty state
  emptyFallback: <EmptyState message="No data available" />,
}));

// Usage in a data-fetching scenario
<DataPanel isLoading={loading} error={error}>
  {data &&
    data.items.map((item) => (
      <div key={item.id} className="data-item">
        {item.name}
      </div>
    ))}
</DataPanel>;
```

The compositor integration eliminates the need for repetitive conditional rendering patterns,
empty state checks, and nested component structures, resulting in cleaner and more maintainable code.

By leveraging these patterns, you can create sophisticated UI components with minimal code
while maintaining a clean, declarative API that's easy for other developers to use.

## Integration with Tailwind CSS

`@ffsm/factory` works exceptionally well with Tailwind CSS, allowing you to create reusable
components with consistent styling while maintaining the utility-first approach.

### Creating Tailwind Component Libraries

Using factory with Tailwind CSS gives you the best of both worlds: the simplicity of Tailwind's utility
classes and the reusability of component abstractions:

```tsx
import { factory, clsx } from '@ffsm/factory';

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
    props.variant === 'primary' &&
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    props.variant === 'secondary' &&
      'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    props.variant === 'outline' &&
      'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    (!props.variant || props.variant === 'primary') &&
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
  ),
}));

// Usage
<Button variant="secondary" size="lg" onClick={handleClick}>
  Save Changes
</Button>;
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
  children: props.children,
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

- **Consistency**: Define variants and styles in one place to ensure consistent UI
- **DRY Principle**: Avoid repeating the same lengthy class strings throughout your application
- **Maintainability**: Update styling in one place rather than hunting through your codebase
- **Type Safety**: Get full TypeScript support for component variations
- **Prop-Based Styling**: Toggle styles based on props rather than conditional class composition
- **Semantic Markup**: Create semantically meaningful components instead of div-soup with classes

**With Tailwind Plugins**

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

**Advanced Tailwind Integration**

For more complex scenarios, you can leverage dynamic props with Tailwind:

```tsx
import { factory, clsx } from '@ffsm/factory';

// Text component with color, size and weight variants
export const Text = factory<{
  color?: 'primary' | 'secondary' | 'error' | 'success';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}>('Text', (props) => ({
  className: clsx(
    // Size mapping
    props.size === 'xs' && 'text-xs',
    props.size === 'sm' && 'text-sm',
    props.size === 'base' && 'text-base',
    props.size === 'lg' && 'text-lg',
    props.size === 'xl' && 'text-xl',
    props.size === '2xl' && 'text-2xl',
    (!props.size || props.size === 'base') && 'text-base',

    // Weight mapping
    props.weight === 'normal' && 'font-normal',
    props.weight === 'medium' && 'font-medium',
    props.weight === 'semibold' && 'font-semibold',
    props.weight === 'bold' && 'font-bold',
    (!props.weight || props.weight === 'normal') && 'font-normal',

    // Color mapping
    props.color === 'primary' && 'text-blue-600 dark:text-blue-400',
    props.color === 'secondary' && 'text-gray-600 dark:text-gray-400',
    props.color === 'error' && 'text-red-600 dark:text-red-400',
    props.color === 'success' && 'text-green-600 dark:text-green-400',
    (!props.color || props.color === 'primary') &&
      'text-gray-900 dark:text-white'
  ),
}));

// Usage
<Text size="lg" color="error" weight="bold">
  Something went wrong!
</Text>;
```

This approach gives you all the benefits of Tailwind's utility-first approach while providing
the abstraction and reusability of a component library.

## API Reference

### factory()

The core factory function for creating components with standardized patterns and prop handling.

```tsx
// Basic factory
function factory<
  AdditionalProps extends Record<string, any>,
  Element extends ElementType = 'div',
>(
  displayName: string,
  init?: InitialProps<Element, AdditionalProps>,
  options?: FactoryOptions<Element, AdditionalProps>
): ForwardRefExoticComponent<
  PropsWithoutRef<FactoryProps<Element, AdditionalProps>> &
    RefAttributes<Element>
>;

// Compositor-enabled factory
// From '@ffsm/factory/compositor'
function factory<
  AdditionalProps extends Record<string, any>,
  Element extends ElementType = 'div',
>(
  displayName: string,
  init?: InitialProps<Element, AdditionalProps>,
  options?: CompositorFactoryOptions<Element, AdditionalProps>
): ForwardRefExoticComponent<
  PropsWithoutRef<FactoryProps<Element, AdditionalProps>> &
    RefAttributes<Element>
>;
```

**Parameters**

- `displayName` (string): The display name for the component in React DevTools
- `init` _(optional)_: Initial props or function that returns props based on component props
- `options` _(optional)_: Configuration options for the factory component

**Returns**

A forward ref React component with the specified props and features.

### Init Props

The second parameter (init) of the factory function can be either an object or a function that returns an object. It accepts the following properties:

| Prop        | Type                                        | Description                                         |
| ----------- | ------------------------------------------- | --------------------------------------------------- |
| `as`        | `ElementType`                               | The base element type to render (div, button, etc.) |
| `className` | `string`, `(props) => string`               | Static or dynamic class name                        |
| `style`     | `CSSProperties`, `(props) => CSSProperties` | Static or dynamic styles                            |
| `children`  | `ReactNode`, `(props) => ReactNode`         | Static content or render function                   |
| `...props`  | `any`                                       | Any additional props to pass to the component       |

**Usage Examples**

Static initialization:

```tsx
const Card = factory<{}>('Card', {
  className: 'card p-4 rounded shadow',
  as: 'div',
});
```

Dynamic initialization:

```tsx
const Button = factory<{ variant?: 'primary' | 'secondary' }>(
  'Button',
  (props) => ({
    className: `btn ${props.variant ? `btn-${props.variant}` : 'btn-primary'}`,
    as: 'button',
  })
);
```

### Options

The third parameter (`options`) allows you to configure advanced behavior of your component:

**Basic Factory Options**

| Option              | Type                                         | Description                                                |
| ------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| `excludeProps`      | `Array<string>`                              | Props to exclude from being forwarded to DOM               |
| `shouldForwardProp` | `(key: keyof Props) => boolean`              | Custom function to determine if a prop should be forwarded |
| `template`          | `(Component, props, initProps) => ReactNode` | Custom rendering template for the component                |

**Compositor Factory Options (available in '@ffsm/factory/compositor')**

| Option              | Type                             | Description                             |
| ------------------- | -------------------------------- | --------------------------------------- |
| `asSlot`            | `boolean`                        | Enable slot-based composition           |
| `asNode`            | `boolean`                        | Render only when children exist         |
| `asNodeFalsy`       | `boolean`                        | Use strict falsy checking for asNode    |
| `emptyFallback`     | `ReactNode`                      | Content to show when children are empty |
| `condition`         | `unknown` , `(props) => unknown` | Condition for conditional rendering     |
| `conditionFallback` | `ReactNode`                      | Content to show when condition is falsy |
| `conditionFalsy`    | `boolean`                        | Use strict falsy checking for condition |

**Usage Examples**

Excluding custom props:

```tsx
const Link = factory<{ isExternal?: boolean }>(
  'Link',
  {
    as: 'a',
    className: 'link',
  },
  {
    excludeProps: ['isExternal'],
  }
);
```

Custom template:

```tsx
const FormField = factory<{ label?: string; error?: string }>(
  'FormField',
  {
    as: 'input',
    className: 'form-input',
  },
  {
    excludeProps: ['label', 'error'],
    template: (Component, props, initProps) => (
      <div className="form-group">
        {initProps.label && <label>{initProps.label}</label>}
        <Component {...props} />
        {initProps.error && <div className="error">{initProps.error}</div>}
      </div>
    ),
  }
);
```

Compositor features:

```tsx
import { factory } from '@ffsm/factory/compositor';

const ProtectedContent = factory<{ isAdmin: boolean }>(
  'ProtectedContent',
  {
    className: 'protected-content',
  },
  {
    condition: (props) => props.isAdmin,
    conditionFallback: <AccessDenied />,
  }
);
```

### Types

The package exports several utility types for working with factory components:

| Type                                       | Description                                                |
| ------------------------------------------ | ---------------------------------------------------------- |
| `FactoryProps<Element, AdditionalProps>`   | Combined props type for factory components                 |
| `InitialProps<Element, AdditionalProps>`   | Type for initial props or props factory function           |
| `FactoryOptions<Element, AdditionalProps>` | Type for factory options (basic version)                   |
| `MaybeFn<Result, Props>`                   | Type that can be either a value or a function returning it |
| `ObjectProps`                              | Generic object properties type                             |

### Utilities

#### clsx

Utility for conditionally joining class names:

```tsx
import { clsx } from '@ffsm/factory';

const className = clsx(
  'base-class',
  condition && 'conditional-class',
  { 'object-key': booleanValue },
  ['array', 'of', 'classes']
);
```

## Type System

The `@ffsm/factory` package includes a comprehensive type system that provides full TypeScript support.
This section explains the key types and how to use them effectively in your components.

### Core Types

**FactoryProps<Element, AdditionalProps>**

This is the main props type for factory-created components. It combines:

- Element-specific props (like href for an anchor)
- Your custom additional props
- Common factory props (className, style, etc.)

```tsx
// Example: Creating a button with custom props
type ButtonProps = {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
};

const Button = factory<ButtonProps, 'button'>('Button', {
  className: 'btn',
  as: 'button',
});

// Usage with type checking:
<Button
  variant="primary" // ✓ Type checked
  size="sm" // ✓ Type checked
  onClick={() => {}} // ✓ Inherited from 'button' element
  invalid={true} // ✗ Type error
/>;
```

**InitialProps<Element, AdditionalProps>**

This flexible type represents initial props configuration and can be either:

1. Static object:

```tsx
const Card = factory<{}>('Card', {
  className: 'card',
  as: 'div',
});
```

2. Function that returns props based on incoming props:

```tsx
const Button = factory<ButtonProps>('Button', (props) => ({
  className: `btn btn-${props.variant} btn-${props.size}`,
  as: 'button',
}));
```

### Using Generic Types

**Custom Component Props**

Define custom props with full type safety:

```tsx
interface TabProps {
  active?: boolean;
  label: string;
  index: number;
}

const Tab = factory<TabProps>('Tab', (props) => ({
  className: props.active ? 'tab active' : 'tab',
  'aria-selected': props.active,
  role: 'tab',
  as: 'div',
}));

// Usage with TypeScript validation
<Tab
  label="Settings" // Required
  index={2} // Required
  active={true} // Optional
/>;
```

**Element Type Customization**

Specify a different base element type:

```tsx
const NavLink = factory<{}, 'a'>('NavLink', {
  className: 'nav-link',
  as: 'a',
});

// Usage with anchor-specific props
<NavLink href="/about" target="_blank">
  About
</NavLink>;
```

### Advanced Type Features

**Type Inference Best Practices**

When creating a factory component without additional props, always specify an empty object explicitly:

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

**Conditional Props**

Create components with conditional prop requirements:

```tsx
// Better approach using union types
type DialogProps =
  | { title: string; size?: 'sm' | 'md' | 'lg'; closable: true; onClose: () => void }
  | { title: string; size?: 'sm' | 'md' | 'lg'; closable?: false; onClose?: never };

const Dialog = factory<DialogProps>('Dialog', {
  className: 'dialog',
});

// Usage:
// Valid - onClose is required when closable is true
<Dialog title="Settings" closable={true} onClose={() => setOpen(false)} />

// Valid - onClose is not allowed when closable is false
<Dialog title="Info" closable={false} />

// Invalid - missing onClose
<Dialog title="Error" closable={true} /> // TypeScript error

// Invalid - has onClose when closable is false
<Dialog title="Warning" closable={false} onClose={() => {}} /> // TypeScript error
```

**Component Composition Types**

Build complex component hierarchies with composed types:

```tsx
type CardProps = {
  title: string;
  elevated?: boolean;
};

type CardImageProps = CardProps & {
  imageSrc: string;
  imageAlt?: string;
};

const Card = factory<CardProps>('Card', {
  className: 'card',
});

const CardWithImage = factory<CardImageProps>('CardWithImage', (props) => ({
  className: `card ${props.elevated ? 'elevated' : ''}`,
  children: (
    <>
      <img src={props.imageSrc} alt={props.imageAlt || props.title} />
      <h3>{props.title}</h3>
    </>
  ),
}));
```

### Utility Types

The package exports several utility types for advanced use cases:

- `MaybeFn<Result, Props>`: Type for values that can be either direct or function-returned
- `ObjectProps`: Generic object properties type
- `FactoryProps<Element, AdditionalProps>`: Combined props for factory components
- `FactoryOptions<Element, AdditionalProps>`: Options for factory configuration

Import these types directly from the package:

```tsx
import { MaybeFn, ObjectProps, FactoryProps } from '@ffsm/factory';

// Create a type for a component that needs dynamic styling
type DynamicComponent<P = {}> = React.FC<
  P & {
    styling: MaybeFn<string, P>;
  }
>;
```

By leveraging these type utilities, you can create type-safe component APIs that provide excellent
developer experience with autocompletion and type checking.

## Utilities

`@ffsm/factory` includes several utility functions that help with common component development tasks.
These utilities can be imported directly from the package and used both within factory components
and in your application code.

### [clsx](https://npmjs.com/package/clsx)

The package includes a lightweight version of the clsx utility for conditional class name composition,
allowing you to combine class names dynamically:

```tsx
import { clsx } from '@ffsm/factory';

// Basic usage
const className = clsx(
  'base-class',
  condition && 'conditional-class',
  isActive ? 'active' : 'inactive',
  { hidden: isHidden, visible: !isHidden }
);

// Within a factory component
const Button = factory<{
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}>('Button', (props) => ({
  as: 'button',
  className: clsx(
    'btn',
    props.variant && `btn-${props.variant}`,
    props.size && `btn-${props.size}`,
    props.disabled && 'btn-disabled'
  ),
}));
```

The `clsx` utility supports:

- Strings: `'btn'`
- Objects: `{ 'btn-primary': isPrimary }`
- Arrays: `['btn', isActive && 'btn-active']`
- Nested conditions: `condition && [subCondition && 'class']`
- Falsy values are ignored: `false && 'hidden'` results in nothing being added

This eliminates the need for an additional package for class name management in your projects.

## Frequently Asked Questions

### How is @ffsm/factory different from styled-components?

While `styled-components` focuses on styling with CSS-in-JS, `@ffsm/factory` provides a more comprehensive
approach to component creation with built-in composition patterns, conditional rendering, and prop management.

### Can I use @ffsm/factory with other UI libraries?

Yes, @ffsm/factory works with any React-based UI library. You can wrap components from Material UI, Chakra UI,
or any other library using `factory()`.

### Does it work with React Server Components?

Yes, `@ffsm/factory` is compatible with React Server Components, but be aware that some dynamic features
might need client-side hydration.

### What's the difference between the regular factory and compositor factory?

The regular factory (`import { factory } from '@ffsm/factory'`) provides core functionality for component creation,
prop forwarding, and templates. The compositor factory (`import { factory } from '@ffsm/factory/compositor'`) adds
support for advanced UI patterns like conditional rendering, slot-based composition, and empty state handling through
integration with `@ffsm/compositor`.

### When should I use the basic factory vs. compositor factory?

Use the basic factory when you only need component creation and prop management. Use the compositor factory when
you need advanced UI patterns like conditional rendering, slots, or empty state handling. The basic factory has
fewer dependencies and a smaller bundle size.

### Does using the compositor features impact performance?

The compositor integration adds a small runtime overhead, but it's negligible for most applications. The benefits
of cleaner code and declarative patterns usually outweigh the minimal performance cost. For performance-critical
scenarios with large lists, consider memoizing components with `React.memo`.

### Do I need to install @ffsm/compositor separately?

Yes, when using the compositor features, you need to install both packages:

```bash
npm install @ffsm/factory @ffsm/compositor
```

The basic factory doesn't require the compositor package.

## Why Choose @ffsm/factory?

While there are many component libraries and styling solutions available, `@ffsm/factory` offers unique advantages
that set it apart:

### Compared to UI Libraries

Traditional UI libraries like Material UI, Chakra UI, or Ant Design provide pre-built components with specific
design systems. `@ffsm/factory` takes a different approach:

- **Zero Design Opinions**: Create components that match your exact design requirements without fighting against pre-existing styles
- **Lightweight Core**: No bloated dependencies or unused components - just the functionality you need
- **Composable Building Blocks**: Build your own design system from the ground up rather than adapting existing components
- **Progressive Adoption**: Start with a few components and gradually expand without committing to an entire UI framework

### Compared to Styling Libraries

Unlike CSS-in-JS libraries like styled-components or emotion, `@ffsm/factory`:

- **Focuses on Component Logic**: Handles not just styling but composition patterns, conditional rendering, and prop management
- **Styling Agnostic**: Works with any styling approach - CSS modules, Tailwind, utility classes, or vanilla CSS
- **Reduced Boilerplate**: Creates consistent components with fewer lines of code
- **Declarative Patterns**: Simplifies common UI patterns with prop-based APIs instead of imperative code

### Compared to Component Utilities

Headless UI libraries like Radix UI or Headless UI provide unstyled components, but `@ffsm/factory`:

- **Offers Complete Control**: Define both behavior and presentation in a unified API
- **Simplifies Implementation**: Less verbose than hook-based component creation patterns
- **Integrates Advanced Patterns**: Built-in support for slots, empty states, and conditional rendering
- **Prioritizes Developer Experience**: Consistent API with excellent TypeScript integration

### Real-World Benefits

- **Faster Development**: Create new components in minutes instead of hours
- **Consistent APIs**: Establish patterns that all team members can follow
- **Better Maintainability**: Centralized component logic with clear separation of concerns
- **Improved Type Safety**: Full TypeScript support with proper generics and inference
- **Reduced Bundle Size**: Only include the functionality you need
- **Flexible Adaptation**: Works with your existing components, libraries, and styling solutions

`@ffsm/factory` is ideal for teams building custom design systems, developers who need flexibility beyond existing UI libraries,
and projects where component consistency and maintainability are priorities.

## Performance Considerations

`@ffsm/factory` is designed with performance in mind, but there are some considerations to ensure optimal performance in your applications:

- **Component Memoization**: When rendering large lists of factory components, wrap them with React.memo to prevent unnecessary re-renders:

```tsx
const OptimizedCard = React.memo(factory<CardProps>('Card', {...}));
```

- **Bundle Size**: The core factory package is lightweight, but including the compositor features will increase bundle size.
  Use code-splitting to only load the compositor features when needed:

```tsx
// Dynamic import of compositor-enabled components
const AdminPanel = lazy(() => import('./AdminPanel'));
```

- **Conditional Rendering**: When using conditional rendering frequently, prefer the declarative compositor approach over
  imperative conditionals for better readability and maintainability.

## Compatibility

`@ffsm/factory` is designed to work across a wide range of React environments:

- **React Versions**: Compatible with React 16.8+ (requires hooks support)
- **React Frameworks**:
  - Next.js (both Pages and App Router)
  - Create React App
  - Vite
  - Remix
  - Gatsby
  - Any other React-based framework
- **TypeScript**: Full TypeScript support with proper typing and generics
- **React Server Components**: Compatible with React Server Components, though some dynamic features require client components
- **Styling Solutions**: Works with any styling approach:
  - Tailwind CSS
  - CSS Modules
  - Styled Components / Emotion
  - Plain CSS
  - CSS-in-JS libraries
- **Browsers**: Supports all modern browsers without polyfills

## Related Packages

### Core Packages

- `@ffsm/compositor`: The companion package that provides the advanced composition utilities used by factory's compositor integration. Install this package to use the advanced features like slots, conditional rendering, and empty state handling.

These packages are designed to work together to provide a complete solution for building React applications, but each can be used independently according to your specific needs.
