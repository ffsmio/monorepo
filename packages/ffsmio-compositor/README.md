# @ffsm/compositor

`@ffsm/compositor` is a collection of utility components that make React component composition
more declarative and maintainable. These components solve common UI patterns in a consistent way,
reducing boilerplate and making code more readable.

## Installation

```bash
# Using npm
npm install @ffsm/compositor

# Using yarn
yarn add @ffsm/compositor
# Using pnpm
pnpm add @ffsm/compositor
```

## Features Overview

- **Declarative Composition**: Replace imperative logic with declarative components
- **Prop Injection**: Easily manage and propagate props through component hierarchies
- **Conditional Rendering**: Simplify conditional UI patterns
- **Type Safety**: Full TypeScript support with proper generic types
- **Small Footprint**: Lightweight implementation with minimal dependencies
- **Customizable**: Flexible API supporting various composition patterns

## When to Use

The compositor library is particularly useful when:

- Building component libraries with consistent composition patterns
- Managing complex conditional rendering logic
- Creating reusable layout components
- Implementing slot-based component architectures
- Reducing boilerplate in React applications

## Component Overview

| Component    | Purpose                               | When to Use                                                                         |
| ------------ | ------------------------------------- | ----------------------------------------------------------------------------------- |
| `AsInstance` | Prop merging for a single element     | When you need to extend an element with additional props                            |
| `AsArray`    | Batch operations on multiple children | When working with collections of elements that need shared props or transformations |
| `AsNode`     | Conditional rendering (if)            | When you need to conditionally render content based on a single condition           |
| `AsSlot`     | Content projection into wrappers      | When implementing component composition with slots or insertion points              |
| `Condition`  | Conditional rendering (if/else)       | When you need to choose between two rendering paths                                 |
| `Empty`      | Empty state handling                  | When working with potentially empty data or content                                 |

## Components

### AsInstance Component

`AsInstance` is a utility component that helps with prop composition by merging additional props with a React element's existing props.

#### Features

- **Prop Merging**: Combines specified props with a React element's existing props
- **Safe Handling**: Gracefully handles non-element children
- **Simple API**: Straightforward usage pattern with minimal boilerplate
- **Type Safety**: Full TypeScript support with proper type definitions

#### Basic Usage

```jsx
import { AsInstance } from '@ffsmio/compositor';

function App() {
  return (
    <AsInstance className="enhanced" data-testid="submit-btn">
      <button onClick={handleClick}>Submit</button>
    </AsInstance>
  );
}
```

This renders the button with its original `onClick` handler plus the new `className` and `data-testid` props.

#### Prop Merging Behavior

When both the child element and the `AsInstance` wrapper specify the same prop, the wrapper's prop takes precedence:

```jsx
<AsInstance className="override-class">
  <div className="original-class">Content</div>
</AsInstance>
```

This renders: `<div className="override-class">Content</div>`

#### Working with Non-Element Children

If you pass a non-element child (like plain text, numbers, null, or undefined), `AsInstance` returns it unchanged:

```jsx
<AsInstance className="will-be-ignored">Just some plain text</AsInstance>
```

This renders: `Just some plain text`

#### Use Cases

- **Applying theme props**: Add theme-related props to components
- **Adding accessibility attributes**: Enhance components with aria attributes
- **Component composition**: Create higher-order components that add behavior
- **Dynamic props**: Add conditional props based on application state

#### API Reference

##### Props

| Prop       | Type      | Description                                      |
| ---------- | --------- | ------------------------------------------------ |
| `children` | ReactNode | Child element to receive merged props            |
| `...rest`  | any       | Additional props to merge with the child element |

#### Implementation Notes

- Uses React's `cloneElement` under the hood for prop merging
- Performs proper type checking with `isValidElement` before attempting to clone
- Preserves the child's original component identity and ref

### AsArray Component

`AsArray` is a utility component that makes working with collections of React children more powerful by providing filtering and transformation capabilities.

#### Features

- **Prop Inheritance**: Pass props to all children at once
- **Filtering**: Include only specific children using a filter function
- **Transformation**: Transform children with a mapping function
- **Key Management**: Automatically handles React's key requirements

#### Basic Usage

```jsx
import { AsArray } from '@ffsmio/compositor';

function App() {
  return (
    <AsArray className="shared-class" data-testid="group">
      <button>First Button</button>
      <button>Second Button</button>
      <button>Third Button</button>
    </AsArray>
  );
}
```

This renders three buttons, each with the `className="shared-class"` and `data-testid="group"` props.

#### Filtering Children

Use the `filter` prop to selectively include children:

```jsx
<AsArray
  filter={(child, index) => {
    // Only include even-indexed children
    return index % 2 === 0;
  }}
  className="even-only"
>
  <div>Item 0</div>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</AsArray>
```

#### Transforming Children

Use the `map` prop to transform children:

```jsx
<AsArray
  map={(child, index) => {
    // Add index to each child's content
    if (React.isValidElement(child)) {
      return React.cloneElement(
        child,
        child.props,
        `${child.props.children} (${index})`
      );
    }
    return child;
  }}
>
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</AsArray>
```

Renders:

- Apple (0)
- Banana (1)
- Cherry (2)

#### API Reference

##### Props

| Prop       | Type                                           | Description                             |
| ---------- | ---------------------------------------------- | --------------------------------------- |
| `children` | ReactNode                                      | Child elements to process               |
| `filter`   | (child: ReactNode, index: number) => boolean   | Optional function to filter children    |
| `map`      | (child: ReactNode, index: number) => ReactNode | Optional function to transform children |
| `...rest`  | any                                            | Additional props passed to all children |

#### Notes

- All children are rendered inside an `AsInstance` component, which handles proper prop merging
- The component internally uses React's `Children.toArray()` for stable keys and array operations
- When filtering, children are excluded completely rather than rendered conditionally

### AsNode Component

`AsNode` is a declarative conditional rendering component that simplifies the common pattern of rendering content only when a condition is met.

#### Features

- **Simplified Conditional Rendering**: Replaces ternary expressions and `&&` patterns
- **Declarative API**: Makes conditional rendering more readable
- **Function Conditions**: Supports functions and async functions as conditions
- **Falsy Value Handling**: Optional strict falsy checking for empty strings, zero, etc.
- **Prop Forwarding**: Passes additional props to rendered children

#### Basic Usage

```jsx
import { AsNode } from '@ffsmio/compositor';

function UserSection({ user }) {
  return (
    <AsNode of={user}>
      <div className="user-info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </AsNode>
  );
}
```

This renders the user info div only when `user` exists (is not `undefined` or `false`).

**Using Function Conditions**

You can use a function as the condition, which is useful for dynamic evaluations:

```jsx
<AsNode of={(props) => userService.hasPermission('admin')}>
  <AdminPanel />
</AsNode>
```

The function receives all props passed to AsNode, allowing for contextual conditions.

**Async Conditions**

AsNode also supports async functions for conditions that need to be resolved:

```jsx
<AsNode of={async () => await checkUserSubscription()}>
  <PremiumContent />
</AsNode>
```

#### Comparing with Traditional Conditional Rendering

Traditional approach:

```jsx
function UserSection({ user }) {
  return user ? (
    <div className="user-info">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  ) : null;
}
```

With `AsNode`:

```jsx
function UserSection({ user }) {
  return (
    <AsNode of={user}>
      <div className="user-info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </AsNode>
  );
}
```

#### Enhanced Falsy Checking

By default, `AsNode` only treats `undefined` and `false` as falsy. To extend this to all JavaScript falsy values (empty strings, 0, NaN, null), use the `falsy` prop:

```jsx
<AsNode of={searchResults.length} falsy>
  <SearchResultsList results={searchResults} />
</AsNode>
```

This will only render the list when there are actual results.

#### Passing Props to Children

`AsNode` uses `AsInstance` internally, so any additional props will be passed to the children:

```jsx
<AsNode of={isAdmin} className="admin-panel" data-testid="admin-section">
  <AdminControls />
</AsNode>
```

#### API Reference

##### Props

| Prop       | Type      | Default   | Description                                                                                     |
| ---------- | --------- | --------- | ----------------------------------------------------------------------------------------------- |
| `children` | ReactNode | required  | Content to conditionally render                                                                 |
| `of`       | unknown   | undefined | The condition that determines if children render. Maybe using as a function or promise function |
| `falsy`    | boolean   | false     | When true, any falsy value prevents rendering                                                   |
| `...rest`  | any       | -         | Additional props passed to children through `AsInstance`                                        |

#### Use Cases

- Conditional rendering based on user permissions
- Showing components only when data is available
- Feature flags and toggles
- Simplifying complex conditional rendering logic
- Dynamic conditions that depend on runtime state or API calls

### AsSlot Component

`AsSlot` implements a slot-based composition pattern for React, allowing children to be rendered within a specified outlet component or through a render function.

#### Features

- **Slot-Based Composition**: Inject content into wrapper components
- **Flexible API**: Use either component outlets or render functions
- **Prop Forwarding**: Pass props to both the outlet and the content
- **Ref Handling**: Properly forwards refs between components

#### Basic Usage

```jsx
import { AsSlot } from '@ffsmio/compositor';
import { Card } from './components';

function UserProfile({ user }) {
  return (
    <AsSlot outlet={<Card />}>
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </AsSlot>
  );
}
```

This renders the user profile content inside the `Card` component.

#### Using Outlet Props

You can pass specific props to the outlet component using `outletProps`:

```jsx
<AsSlot
  outlet={<Panel />}
  outletProps={{
    title: 'Settings',
    collapsible: true,
    defaultExpanded: true,
  }}
>
  <SettingsForm />
</AsSlot>
```

#### Render Function Pattern

For more dynamic scenarios, use a render function as the outlet:

```jsx
<AsSlot
  outlet={(props) => (
    <Modal isOpen={isModalOpen} onClose={handleClose} {...props} />
  )}
  className="modal-content"
>
  <h2>Confirm Deletion</h2>
  <p>This action cannot be undone.</p>
  <div className="button-group">
    <button onClick={handleConfirm}>Delete</button>
    <button onClick={handleCancel}>Cancel</button>
  </div>
</AsSlot>
```

#### Passing Props to Children

Additional props are passed to the children via `AsInstance`:

```jsx
<AsSlot outlet={<Card />} className="highlighted" data-testid="user-card">
  <UserProfile />
</AsSlot>
```

#### Comparison with Traditional Composition

Traditional approach:

```jsx
<Card>
  <div className="highlighted" data-testid="user-card">
    <UserProfile />
  </div>
</Card>
```

With `AsSlot`:

```jsx
<AsSlot outlet={<Card />} className="highlighted" data-testid="user-card">
  <UserProfile />
</AsSlot>
```

#### API Reference

##### Props

| Prop          | Type                               | Description                                        |
| ------------- | ---------------------------------- | -------------------------------------------------- |
| `children`    | ReactNode                          | Content to render inside the outlet                |
| `outlet`      | ReactNode \| RenderFunction<Props> | Component or function to wrap children             |
| `outletProps` | ObjectProps                        | Props to pass to the outlet component              |
| `...rest`     | ObjectProps                        | Additional props passed to children via AsInstance |

##### Type Definitions

```typescript
type ObjectProps = Record<string, any>;
type RenderFunction<Props> = (props: Props) => ReactNode;
```

#### Use Cases

- Creating composite UI patterns like cards, panels, and dialogs
- Building component libraries with consistent wrappers
- Implementing layout components with customizable content areas
- Creating higher-order components with enhanced behavior

### Condition Component

`Condition` is a declarative conditional rendering component that simplifies rendering different content based on conditions, with support for fallback content.

#### Features

- **If/Else Pattern**: Renders either main content or fallback content
- **Declarative API**: Makes conditional rendering more readable
- **Function Conditions**: Supports functions and async functions for dynamic evaluation
- **Falsy Value Handling**: Optional strict falsy checking
- **Prop Forwarding**: Passes props to whichever content is rendered

#### Basic Usage

```jsx
import { Condition } from '@ffsmio/compositor';

function ProfileSection({ user, isLoading }) {
  return (
    <Condition when={!isLoading && user} fallback={<LoadingSpinner />}>
      <UserProfile data={user} />
    </Condition>
  );
}
```

This renders the `UserProfile` when a user exists and it's not loading, or a `LoadingSpinner` otherwise.

**Using Function Conditions**

You can use a function as the condition, which is useful for dynamic evaluations:

```jsx
<Condition
  when={(props) => userService.hasPermission('admin')}
  fallback={<AccessDenied />}
>
  <AdminPanel />
</Condition>
```

The function receives all props passed to Condition, allowing for contextual conditions.

**Async Conditions**

Condition also supports async functions for conditions that need to be resolved:

```jsx
<Condition
  when={async () => await checkUserSubscription()}
  fallback={<SubscribePrompt />}
>
  <PremiumContent />
</Condition>
```

#### Enhanced Falsy Checking

By default, `Condition` only treats `undefined` and `false` as falsy. To extend this to all JavaScript falsy values (empty strings, 0, NaN, null), use the `falsy` prop:

```jsx
<Condition
  when={searchResults.length}
  falsy
  fallback={<EmptyState message="No results found" />}
>
  <SearchResults items={searchResults} />
</Condition>
```

#### Passing Props to Rendered Content

`Condition` uses `AsInstance` internally, so any additional props will be passed to whichever content is rendered:

```jsx
<Condition
  when={isAuthenticated}
  fallback={<LoginPage />}
  className="main-content"
  data-testid="content-section"
>
  <Dashboard />
</Condition>
```

#### No Fallback

If you don't provide a fallback, nothing is rendered when the condition is falsy:

```jsx
<Condition when={showBanner}>
  <AnnouncementBanner message={bannerText} />
</Condition>
```

#### Comparing with Traditional Conditional Rendering

Traditional approach:

```jsx
function ProfileSection({ user, isLoading }) {
  return !isLoading && user ? (
    <UserProfile data={user} className="profile-section" />
  ) : (
    <LoadingSpinner className="profile-section" />
  );
}
```

With `Condition`:

```jsx
function ProfileSection({ user, isLoading }) {
  return (
    <Condition
      when={!isLoading && user}
      fallback={<LoadingSpinner />}
      className="profile-section"
    >
      <UserProfile data={user} />
    </Condition>
  );
}
```

#### API Reference

##### Props

| Prop       | Type      | Default   | Description                                                                                        |
| ---------- | --------- | --------- | -------------------------------------------------------------------------------------------------- |
| `children` | ReactNode | required  | Content to display when condition is truthy                                                        |
| `when`     | unknown   | undefined | The condition that determines which content to show, maybe using as a function or promise function |
| `falsy`    | boolean   | false     | When true, any falsy value triggers fallback                                                       |
| `fallback` | ReactNode | undefined | Content to display when condition is falsy                                                         |
| `...rest`  | any       | -         | Props passed to whichever content is rendered                                                      |

#### Use Cases

- Toggling between loading states and loaded content
- Showing different UI based on user permissions or roles
- Displaying error states when operations fail
- Implementing feature flags or experimental features
- Dynamic conditions that depend on runtime state or API calls

### Empty Component

`Empty` is a utility component that simplifies handling empty or undefined children by rendering fallback content when needed.

#### Features

- **Empty State Handling**: Automatically detects undefined or false children
- **Fallback Content**: Provides alternative content when children are empty
- **Falsy Value Detection**: Optional strict checking for all falsy values
- **Prop Forwarding**: Passes props to whichever content is rendered

#### Basic Usage

```jsx
import { Empty } from '@ffsmio/compositor';

function UserDetails({ user }) {
  return (
    <Empty fallback={<p>No user information available</p>}>
      {user && (
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}
    </Empty>
  );
}
```

This renders the user details when they exist, or the fallback message when `user` is falsy.

#### Enhanced Falsy Checking

By default, `Empty` only treats `undefined` and `false` as empty. To extend this to all JavaScript falsy values (empty strings, 0, NaN, null), use the `falsy` prop:

```jsx
<Empty fallback={<NoResultsView />} falsy>
  {searchResults.length && <ResultsList results={searchResults} />}
</Empty>
```

#### Passing Props

`Empty` uses `AsInstance` internally, so any additional props will be passed to whichever content is rendered:

```jsx
<Empty
  fallback={<EmptyState />}
  className="content-container"
  data-testid="results-area"
>
  {data}
</Empty>
```

#### Comparing with Traditional Patterns

Traditional approach:

```jsx
function MessageDisplay({ message }) {
  return message ? (
    <div className="message">{message}</div>
  ) : (
    <div className="message">No message available</div>
  );
}
```

With `Empty`:

```jsx
function MessageDisplay({ message }) {
  return (
    <Empty fallback="No message available" className="message">
      {message}
    </Empty>
  );
}
```

#### API Reference

##### Props

| Prop       | Type      | Default   | Description                                   |
| ---------- | --------- | --------- | --------------------------------------------- |
| `children` | ReactNode | -         | The primary content to render if not empty    |
| `fallback` | ReactNode | undefined | Content to display when children are empty    |
| `falsy`    | boolean   | false     | When true, any falsy value triggers fallback  |
| `...rest`  | any       | -         | Props passed to whichever content is rendered |

#### Use Cases

- Displaying placeholders when data is not available
- Creating components with meaningful empty states
- Building more resilient UI components
- Simplifying conditional rendering in JSX

## Utilities

### `createEvent`

The `createEvent` function creates custom events for the Compositor system with full support for event bubbling, propagation control, and default action prevention.

#### Basic Usage

```typescript
import { createEvent } from '@ffsmio/compositor';

// Create a basic event
const myEvent = createEvent('button-click', { id: 'submit-button' });

// Use the event
element.dispatchEvent(myEvent);
```

#### Type Safety with Generics

```typescript
// Define a custom event type
interface ClickEvent {
  name: string;
  value: {
    x: number;
    y: number;
  };
  preventDefault(): void;
  stopPropagation(): void;
}

// Create a strongly-typed event
const clickEvent = createEvent<ClickEvent>('click', { x: 100, y: 200 });
```

#### Event Features

Created events include:

- **Event naming**: Associate a name with your event
- **Custom payload**: Attach any value to your event
- **Bubbling control**: Events bubble by default, configurable via constructor
- **Cancellation**: Events can be cancelled using `preventDefault()`
- **Propagation control**: Stop event propagation with `stopPropagation()`
- **Target tracking**: Both original target and current target are tracked

#### Event Properties and Methods

| Property/Method          | Description                            |
| ------------------------ | -------------------------------------- |
| `name`                   | Event name identifier                  |
| `value`                  | Event payload data                     |
| `target`                 | Original event target                  |
| `currentTarget`          | Current target in the propagation path |
| `preventDefault()`       | Prevents the default action            |
| `stopPropagation()`      | Stops event propagation                |
| `isDefaultPrevented()`   | Checks if default action was prevented |
| `isPropagationStopped()` | Checks if propagation was stopped      |

## Advanced Usage

### Composition Patterns

Components can be composed to create more complex patterns:

```jsx
<Condition when={hasData} fallback={<LoadingState />}>
  <AsArray filter={(item) => item.isVisible} className="data-item">
    {data.map((item) => (
      <DataItem key={item.id} {...item} />
    ))}
  </AsArray>
</Condition>
```

### Custom Hooks Integration

The components work well with custom hooks:

```jsx
function useUserData() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logic...

  return { data, isLoading, error };
}

function UserProfile() {
  const { data, isLoading, error } = useUserData();

  return (
    <Condition when={!isLoading} fallback={<LoadingSpinner />}>
      <Condition when={!error} fallback={<ErrorMessage error={error} />}>
        <UserCard user={data} />
      </Condition>
    </Condition>
  );
}
```

## Performance Considerations

- All components are optimized for minimal re-renders
- When using `AsArray` with large lists, consider memoizing filter and map functions
- For deeply nested component trees, consider composition at appropriate levels rather than passing props through many layers

## Browser Support

- Supports all modern browsers
- IE11 compatible with appropriate polyfills
- Works in both client-side and server-side rendering environments

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
