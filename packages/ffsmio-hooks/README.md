# Utility hooks for ReactJS

```bash
npm i @ffsm/hooks
```

OR

```bash
yarn add @ffsm/hooks
```

## useDisclosure

```tsx
function useDisclorure(
  props: UseDisclosureProps = {},
  ref?: ForwardedRef<Disclosure | null>
): [boolean, Function];
```

The hook provides a simple way to control the open/closed state of components such as modals, drawers, dialogs, and other togglable UI elements.

**Props**

```ts
export interface UseDisclosureProps {
  open?: boolean;
  onOpen?(): void;
  onBeforeOpen?(): void;
  onBeforeOpenAsync?(): void;
  onClose?(): void;
  onBeforeClose?(): void;
  onBeforeCloseAsync?(): void;
}
```

- **open**: Initialize state for disclosure. Defaults to false if not provided.
- **onOpen**: Callback function that executes when the state changes to `true`.
- **onBeforeOpen**: Callback function that executes before state changes to `true`.
- **onBeforeOpenAsync**: Callback function that executes before state changes to `true`. Call with `await`.
- **onClose**: Callback function that executes when the state changes to `false`.
- **onBeforeClose**: Callback function that executes before state changes to `false`.
- **onBeforeCloseAsync**: Callback function that executes before state changes to `false`. Call with `await`.

**Ref**

You can pass a ref to access the disclosure methods imperatively:

```ts
export interface Disclosure {
  open(): void;
  close(): void;
}
```

- **open**: Method call to open via ref.
- **close**: Method call to close via ref.

**Return values**

The hook returns an array containing:

- **isOpen**: _boolean_ - The current state of the disclosure
- **toggle**: _Function_ - A function to toggle the disclosure state

**Example**:

```tsx
import { forwardRef, PropsWithChildren, useRef, useState } from 'react';
import { Disclosure, useDisclosure } from '@ffsm/hooks';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export interface ModalProps {
  open?: boolean;
  onOpen?(): void;
  onClose?(): void;
}

const Modal = forwardRef<Disclosure, PropsWithChildren<ModalProps>>(
  function Modal(props, ref) {
    const { children, open = false, onOpen, onClose } = props;
    const [isOpen, setIsOpen] = useDisclosure({ open, onOpen, onClose }, ref);

    return (
      <Dialog open={open} onOpenChange={setIsOpen}>
        {children}
      </Dialog>
    );
  }
);

export function Example1() {
  const modalRef = useRef<Disclosure>(null);

  const handleClick = () => modalRef.current?.open();

  return (
    <div>
      <Button onClick={handleClick}>Open modal</Button>
      <Modal ref={ref}>{/** Content of modal */}</Modal>
    </div>
  );
}

export default function Example2() {
  const [isOpen, setIsOpen] = useState(false); // Maybe using useDisclosure({ open: false })

  const handleClick = () => setIsOpen((p) => !p);

  return (
    <div>
      <Button onClick={handleClick}>Open modal</Button>
      <Modal open={open}>{/** Content of modal */}</Modal>
    </div>
  );
}
```

## useMediaQuery

```tsx
function useMediaQuery(
  breakpoint: Breakpoint,
  breakpoints: Partial<Breakpoints> = {}
): boolean;
```

A responsive React hook that helps you detect when a specific breakpoint is matched in the browser's viewport. The hook is designed to work with both predefined breakpoints (`sm`, `md`, `lg`, `xl`) and custom numerical values.

**Breakpoint**

Either a predefined breakpoint key (`'sm'`, `'md'`, `'lg'`, `'xl'`) or a custom number value in pixels.

```ts
export type Breakpoint = number | 'sm' | 'md' | 'lg' | 'xl';
```

**Breakpoints**

Custom breakpoint values to override the defaults.

```ts
export interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}
```

**Default Breakpoints**

The hook uses the following default breakpoint values:

```ts
export const MediaBreakpoints: Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};
```

**Return value**

_boolean_ - `true` when the viewport width is less than or equal to the specified breakpoint.

**Example**

```tsx
import { useMediaQuery } from '@ffsm/hooks';

export default function App() {
  const isMobile = useMediaQuery('sm');
  const isTablet = useMediaQuery(800);

  if (isMobile) {
    return <MobileApp />;
  }

  if (isTablet) {
    return <TabletApp />;
  }

  return <DesktopApp />;
}
```

## usePreventScroll

```ts
function usePreventScroll<El extends HTMLElement>(
  prevent: boolean,
  element?: El | null
): void;
```

A React hook that prevents scrolling on specified HTML elements, with special handling for mobile Safari. This is useful when displaying modals, dialogs, or drawers where background scrolling should be disabled.

**Parameters**

- **prevent**: _boolean_ - When `true`, scrolling will be prevented on the target element.
- **element**: _(optional)_ - The HTML element on which to prevent scrolling. Defaults to `document.body` when not provided.

**Example**:

```tsx
import { useState } from 'react';
import { usePreventScroll } from '@ffsm/hooks';

function Modal() {
  const [isOpen, setIsOpen] = useState(false);

  usePreventScroll(isOpen);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Modal Content</h2>
            <p>This is a modal with scroll lock on the background.</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
```
