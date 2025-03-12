# Split Pane for ReactJS

React Component Split Pane, support vertical and horizontal

## Installation

```bash
npm i @ffsm/pane
```

OR

```bash
yarn add @ffsm/pane
```

## Using

```tsx
import { Pane } from '@ffsm/pane';

export default function App() {
  return (
    <div className="w-screen h-screen">
      <Pane>
        <div data-pane-width={200} data-pane-min={150}>
          Item vertical 1
        </div>
        <div>Item vertical 2</div>
        <Pane
          horizontal
          resizerSize={4}
          resizerColor="transparent"
          resizerHoverColor="red"
          resizerActiveColor="green"
        >
          <div data-pane-height={300}>Item horizontal 1</div>
          <div>Item horizontal 2</div>
        </Pane>
      </Pane>
    </div>
  );
}
```

## Updating

- Emit events
- Check and reset size when initialize items.
