# @ffsm/pubsub

A lightweight, type-safe implementation of the Publish-Subscribe pattern for JavaScript/TypeScript applications with integrated state management capabilities.

## Features

- 🔍 **Type-safe**: Full TypeScript support with generic types for events and data
- 🧩 **Channel-based**: Organize your events into logical channels
- 🔄 **Singleton pattern**: Easy to use across your application
- 📡 **DOM integration**: Automatically dispatches browser CustomEvents for cross-component communication
- 💾 **State management**: Integrated StoreBase for building state containers
- 🪶 **Lightweight**: No dependencies, small footprint
- 🧵 **Promise support**: Handlers can be async

## Installation

```bash
npm install @ffsm/pubsub
```

or

```bash
yarn add @ffsm/pubsub
```

## Table of Contents

- [Basic PubSub Usage](#basic-pubsub-usage)
- [PubSub API Reference](#pubsub-api-reference)
- [Type-Safe PubSub Usage](#type-safe-pubsub-usage)
- [Browser Integration](#browser-integration)
- [State Management with StoreBase](#state-management-with-storebase)
- [Advanced Store Patterns](#advanced-store-patterns)
- [Best Practices](#best-practices)

## Basic PubSub Usage

```typescript
import { PubSub } from '@ffsm/pubsub';

// Get the singleton instance
const pubsub = PubSub.getInstance();

// Subscribe to an event
const subscription = pubsub.sub('userChannel', 'login', (event) => {
  console.log('User logged in:', event.detail.data);
});

// Publish an event
pubsub.pub('userChannel', 'login', { userId: '123', username: 'john_doe' });

// Unsubscribe when done
subscription.unsub();
```

## PubSub API Reference

### PubSub Class

#### Static Methods

- `getInstance()`: Returns the singleton instance of the PubSub class
- `createId()`: Generates a unique subscription ID

#### Instance Methods

- `register(channelName: string)`: Registers a channel if it doesn't exist
- `sub<Data, Value, NativeEvent>(channelName: string, eventName: string, handler: Function, id?: string)`: Subscribes to an event
- `unsub(channelName: string, eventName: string, id: string)`: Unsubscribes from an event
- `unsubAll(channelName?: string, eventName?: string)`: Unsubscribes from all events, a channel, or an event in a channel
- `pub<Data, Value, NativeEvent>(channelName: string, eventName: string, data?: Data, target?: PubSubTarget<Value>, e?: NativeEvent)`: Publishes an event

## Type-Safe PubSub Usage

```typescript
interface UserData {
  userId: string;
  username: string;
  role: 'admin' | 'user';
}

// Type-safe subscription
pubsub.sub<UserData>('userChannel', 'login', (event) => {
  // TypeScript knows the type of event.detail.data
  const { userId, username, role } = event.detail.data;
  console.log(`User ${username} with role ${role} logged in`);
});

// Type-safe publication
pubsub.pub<UserData>('userChannel', 'login', {
  userId: '123',
  username: 'john_doe',
  role: 'admin'
});
```

## Browser Integration

The PubSub implementation automatically dispatches browser CustomEvents when publishing events in browser environments. This allows for cross-framework communication and integration with browser APIs.

```typescript
// Listen for PubSub events at the window level
window.addEventListener('userChannel:login', (event) => {
  console.log('Custom event received:', event);
});

// Publish a PubSub event
pubsub.pub('userChannel', 'login', { userId: '123' });
```

## State Management with StoreBase

The `@ffsm/pubsub` package includes a `StoreBase` class that provides a foundation for implementing state management with PubSub. This allows you to create typed stores that manage state and notify subscribers of changes.

### Basic Store Implementation

```typescript
import { StoreBase } from '@ffsm/pubsub';

// Define your state interface
interface CounterState {
  count: number;
  lastUpdated: Date;
}

// Define event types
const CounterEvents = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
  RESET: 'reset'
} as const;

// Create your store class
class CounterStore extends StoreBase<CounterState> {
  constructor() {
    super({
      count: 0,
      lastUpdated: new Date()
    });
  }

  increment() {
    const newState = {
      count: this.state.count + 1,
      lastUpdated: new Date()
    };
    this.dispatch(CounterEvents.INCREMENT, newState);
  }

  decrement() {
    const newState = {
      count: this.state.count - 1,
      lastUpdated: new Date()
    };
    this.dispatch(CounterEvents.DECREMENT, newState);
  }

  reset() {
    const newState = {
      count: 0,
      lastUpdated: new Date()
    };
    this.dispatch(CounterEvents.RESET, newState);
  }
}

// Create a singleton instance
const counterStore = new CounterStore();

// Subscribe to state changes
const subscription = counterStore.subscribe(CounterEvents.INCREMENT, (event) => {
  console.log('Counter incremented:', event.detail.data.count);
});

// Update state
counterStore.increment(); // Logs: "Counter incremented: 1"

// Unsubscribe when done
subscription.unsub();
```

### StoreBase API Reference

#### Methods

- `constructor(state: State)`: Initialize a store with the given state
- `get state()`: Get the current state
- `dispatch(name: string, state: State)`: Update state and publish event
- `subscribe<Value, NativeEvent>(name: string, handler: StoreEventHandler<State, Value, NativeEvent>)`: Subscribe to store events
- `unsubscribe(subId: string)`: Unsubscribe from a specific subscription
- `unsubscribeAll()`: Unsubscribe from all store events

### Integration with React

```typescript
import React, { useEffect, useState } from 'react';
import { CounterStore, CounterEvents } from './CounterStore';

// Create a singleton instance
const counterStore = new CounterStore();

// Custom hook for using the store
function useCounterStore() {
  const [count, setCount] = useState(counterStore.state.count);

  useEffect(() => {
    // Subscribe to all relevant events
    const incrementSub = counterStore.subscribe(CounterEvents.INCREMENT, (event) => {
      setCount(event.detail.data.count);
    });
    
    const decrementSub = counterStore.subscribe(CounterEvents.DECREMENT, (event) => {
      setCount(event.detail.data.count);
    });
    
    const resetSub = counterStore.subscribe(CounterEvents.RESET, (event) => {
      setCount(event.detail.data.count);
    });

    // Clean up
    return () => {
      incrementSub.unsub();
      decrementSub.unsub();
      resetSub.unsub();
    };
  }, []);

  return {
    count,
    increment: () => counterStore.increment(),
    decrement: () => counterStore.decrement(),
    reset: () => counterStore.reset()
  };
}

// In your component
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Integration with Vue

```javascript
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { counterStore, CounterEvents } from './CounterStore';

export default defineComponent({
  setup() {
    const count = ref(counterStore.state.count);
    let subscriptions = [];

    onMounted(() => {
      // Subscribe to events
      subscriptions.push(
        counterStore.subscribe(CounterEvents.INCREMENT, (event) => {
          count.value = event.detail.data.count;
        }),
        counterStore.subscribe(CounterEvents.DECREMENT, (event) => {
          count.value = event.detail.data.count;
        }),
        counterStore.subscribe(CounterEvents.RESET, (event) => {
          count.value = event.detail.data.count;
        })
      );
    });

    onUnmounted(() => {
      // Clean up subscriptions
      subscriptions.forEach(sub => sub.unsub());
    });

    return {
      count,
      increment: () => counterStore.increment(),
      decrement: () => counterStore.decrement(),
      reset: () => counterStore.reset()
    };
  }
});
```

## Advanced Store Patterns

### Combining Multiple Stores

You can create complex applications by combining multiple stores:

```typescript
// User store manages authentication
class UserStore extends StoreBase<UserState> {
  // Implementation...
}

// Cart store manages shopping cart
class CartStore extends StoreBase<CartState> {
  // Implementation...
}

// Order store manages order processing
class OrderStore extends StoreBase<OrderState> {
  // Implementation...
}

// Create singleton instances
const userStore = new UserStore();
const cartStore = new CartStore();
const orderStore = new OrderStore();

// Stores can listen to each other's events
userStore.subscribe('logout', () => {
  // Clear cart when user logs out
  cartStore.clearCart();
});

cartStore.subscribe('checkout', (event) => {
  // Create an order when cart checks out
  orderStore.createOrder(event.detail.data.items);
});
```

### Advanced PubSub Example with React Components

```tsx
import React, { useEffect } from 'react';
import { PubSub } from '@ffsm/pubsub';

const UserProfile = () => {
  useEffect(() => {
    const pubsub = PubSub.getInstance();
    
    // Subscribe to profile updates
    const { unsub } = pubsub.sub('userChannel', 'profileUpdate', (event) => {
      const userData = event.detail.data;
      console.log('Profile updated:', userData);
    });
    
    // Clean up subscription when component unmounts
    return () => {
      unsub();
    };
  }, []);
  
  const handleUpdateClick = () => {
    const pubsub = PubSub.getInstance();
    pubsub.pub('userChannel', 'profileUpdate', { 
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg'
    });
  };
  
  return (
    <div>
      <h2>User Profile</h2>
      <button onClick={handleUpdateClick}>Update Profile</button>
    </div>
  );
};
```

### Async Handlers

```typescript
// Using async handlers
pubsub.sub('dataChannel', 'fetch', async (event) => {
  try {
    const response = await fetch(`https://api.example.com/data/${event.detail.data.id}`);
    const data = await response.json();
    
    // Publish the result to another channel
    pubsub.pub('dataChannel', 'fetchComplete', data);
  } catch (error) {
    pubsub.pub('dataChannel', 'fetchError', { error: error.message });
  }
});
```

### Type-Safe Store with TypeScript

```typescript
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  items: TodoItem[];
  filter: 'all' | 'active' | 'completed';
}

class TodoStore extends StoreBase<TodoState> {
  constructor() {
    super({
      items: [],
      filter: 'all'
    });
  }
  
  // Type-safe methods with proper state typing
  addTodo(text: string) {
    const newState = {
      ...this.state,
      items: [
        ...this.state.items,
        {
          id: Math.random().toString(36).substring(2),
          text,
          completed: false
        }
      ]
    };
    
    this.dispatch('add', newState);
  }
  
  toggleTodo(id: string) {
    const newState = {
      ...this.state,
      items: this.state.items.map(item => 
        item.id === id 
          ? { ...item, completed: !item.completed } 
          : item
      )
    };
    
    this.dispatch('toggle', newState);
  }
  
  setFilter(filter: TodoState['filter']) {
    const newState = {
      ...this.state,
      filter
    };
    
    this.dispatch('filter', newState);
  }
}
```

## Best Practices

1. **Organize by domain**: Create channels based on logical domains or features in your application
2. **Be consistent with naming**: Use a consistent naming convention for events (e.g., past tense for completed actions)
3. **Document your events**: Maintain documentation about what events exist and what data they contain
4. **Clean up subscriptions**: Always unsubscribe when components unmount to prevent memory leaks
5. **Type your data**: Use TypeScript generics to ensure type safety for your event data
6. **Immutable state**: Always create new state objects in your store methods rather than mutating existing state
7. **Single responsibility**: Each store should manage a specific domain of your application
8. **Event constants**: Define event names as constants to avoid typos and improve maintainability

## License

MIT
