import { IHandler, PubSub, PubSubEvent, TEventName, TSubId } from "./pubsub";

/**
 * @typedef {PubSubEvent<State, Value, NativeEvent>} StoreEvent
 * @description PubSub event specialized for Store state
 * @template State - The state type of the store
 * @template Value - The data type of the target value (default: unknown)
 * @template NativeEvent - The type of the native event (default: Event)
 */
export type StoreEvent<State, Value = unknown, NativeEvent = Event> = PubSubEvent<State, Value, NativeEvent>;

/**
 * @typedef {IHandler<State, Value, NativeEvent>} StoreEventHandler
 * @description Event handler function for Store events
 * @template State - The state type of the store
 * @template Value - The data type of the target value (default: unknown)
 * @template NativeEvent - The type of the native event (default: Event)
 */
export type StoreEventHandler<State, Value = unknown, NativeEvent = Event> = IHandler<State, Value, NativeEvent>;

/**
 * @class StoreBase
 * @description Base class for implementing state stores with PubSub communication
 * @template State - The state type of the store
 */
export class StoreBase<State> {
  /** Current state of the store */
  protected _state: State;
   /** Store name used as channel name for PubSub communication */
  protected name: string = '';

  /** PubSub instance */
  protected bus = PubSub.getInstance();

   /** Map of subscribers with subscription ID as key and event name as value */
  protected _subscribers: Map<TSubId, TEventName> = new Map();

  /**
   * @constructor
   * @param {State} state - Initial state for the store
   */
  constructor(state: State) {
    this._state = state;

    if (!this.name) {
      this.name = this.constructor.name;
    }
  }

  /**
   * @getter state
   * @description Get the current state of the store
   * @returns {State} Current state
   */
  get state() {
    return this._state;
  }

  /**
   * @method dispatch
   * @description Update state and publish the event
   * @param {string} name - Event name
   * @param {State} state - New state
   * @returns {void}
   */
  dispatch(name: string, state: State) {
    this._state = state;
    this.bus.pub(this.name, name, state);
  }

  /**
   * @method subscribe
   * @description Subscribe to a store event
   * @template Value - The data type of the target value (default: unknown)
   * @template NativeEvent - The type of the native event (default: Event)
   * @param {string} name - Event name
   * @param {StoreEventHandler<State, Value, NativeEvent>} handler - Event handler function
   * @returns {Object} Subscription object with ID and unsubscribe function
   */
  subscribe<Value = unknown, NativeEvent = Event>(
    name: string,
    handler: StoreEventHandler<State, Value, NativeEvent>
  ) {
    const sub = this.bus.sub(this.name, name, handler);
    this._subscribers.set(sub.id, name);
    return sub;
  }

  /**
   * @method unsubscribe
   * @description Unsubscribe from a store event
   * @param {string} subId - Subscription ID
   * @returns {void}
   */
  unsubscribe(subId: string): void {
    if (!this._subscribers.has(subId)) {
      return;
    }

    const name = this._subscribers.get(subId)!;
    this.bus.unsub(this.name, name, subId);
  }

  /**
   * @method unsubscribeAll
   * @description Unsubscribe from all store events
   * @returns {void}
   */
  unsubscribeAll() {
    this._subscribers.forEach((name, subId) => {
      this.bus.unsub(this.name, name, subId);
    });
    this._subscribers.clear();
  }
}
