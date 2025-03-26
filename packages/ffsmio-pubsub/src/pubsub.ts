/**
 * @interface PubSubDetail
 * @description Details about a PubSub event
 * @template Data - The type of data passed with the event
 */
export interface PubSubDetail<Data = unknown> {
  /** Name of the communication channel */
  channel: string;
  /** Name of the event */
  name: string;
  /** ID of the subscriber */
  id: string;
  /** Data sent with the event */
  data: Data;
}

/**
 * @interface PubSubTarget
 * @description Target object of the event
 * @template Value - The data type of the target value
 */
export interface PubSubTarget<Value = unknown> {
  /** Name of the target object */
  name?: string;
  /** Value of the target object */
  value?: Value;
}

/**
 * @interface PubSubEvent
 * @description Defines the structure of a PubSub event
 * @template Data - The type of data passed with the event
 * @template Value - The data type of the target value
 * @template NativeEvent - The type of the native event
 */
export interface PubSubEvent<Data = unknown, Value = unknown, NativeEvent = Event> {
  /** Native event */
  nativeEvent: NativeEvent;
  /** Event details */
  detail: PubSubDetail<Data>;
  /** Target object of the event */
  target: PubSubTarget<Value>;
}

/**
 * @interface IHandler
 * @description Event handler function definition
 * @template Data - The type of data passed with the event
 * @template Value - The data type of the target value
 * @template NativeEvent - The type of the native event
 */
export interface IHandler<Data = unknown, Value = unknown, NativeEvent = Event> {
  (e: PubSubEvent<Data, Value, NativeEvent>): void | Promise<void>;
}

/** Type for channel name */
export type TChannelName = string;
/** Type for event name */
export type TEventName = string;
/** Type for subscription ID */
export type TSubId = string;

/**
 * @class PubSub
 * @description Implementation of the Publish-Subscribe pattern with typed events and channels
 */
export class PubSub {

  /** Singleton instance */
  private static _instance: PubSub;

  /** Map of subscribers organized by channel, event name, and subscription ID */
  private _subscribers: Map<TChannelName, Map<TEventName, Map<TSubId, IHandler>>>;

  /**
   * @private
   * @constructor
   * @description Private constructor for singleton pattern
   */
  private constructor() {
    this._subscribers = new Map();
  }

  /**
   * @static
   * @method getInstance
   * @description Get the singleton instance of PubSub
   * @returns {PubSub} The PubSub instance
   */
  static getInstance() {
    if (!this._instance) {
      this._instance = new PubSub();
    }
    return this._instance;
  }

  /**
   * @static
   * @method createId
   * @description Generate a unique subscription ID
   * @returns {string} Unique ID for subscription
   */
  static createId() {
    return [
      Date.now().toString(16).slice(-6),
      Date.now().toString(16).slice(-4),
      Math.random().toString(16).slice(-4),
      Math.random().toString(16).slice(-6)
    ].join('-');
  }

  /**
   * @private
   * @static
   * @method normalizeTarget
   * @description Normalize the target object from event or provided target
   * @template NativeEvent - The type of the native event
   * @param {PubSubTarget | undefined} target - Optional target object
   * @param {NativeEvent} [nativeEvent] - Optional native event
   * @returns {PubSubTarget} Normalized target object
   */
  private static normalizeTarget<NativeEvent = Event>(
    target: PubSubTarget | undefined,
    nativeEvent?: NativeEvent
  ) {
    return target || {
      name: ((nativeEvent as Record<string, unknown>)?.target as Record<string, string>)?.name,
      value: ((nativeEvent as Record<string, unknown>)?.target as Record<string, string>)?.value,
    }
  }

  /**
   * @private
   * @static
   * @method createEvent
   * @description Create a PubSub event with the provided details
   * @template Data - The type of data passed with the event
   * @template Value - The data type of the target value
   * @template NativeEvent - The type of the native event
   * @param {PubSubDetail<Data>} detail - Event details
   * @param {PubSubTarget<Value>} [target] - Optional target object
   * @param {NativeEvent} [nativeEvent] - Optional native event
   * @returns {PubSubEvent<Data, Value, NativeEvent>} Created PubSub event
   */
  private static createEvent<Data = unknown, Value = unknown, NativeEvent = Event>(
    detail: PubSubDetail<Data>,
    target?: PubSubTarget<Value>,
    nativeEvent?: NativeEvent,
  ) {
    return {
      nativeEvent,
      detail,
      target: this.normalizeTarget(target, nativeEvent),
    } as PubSubEvent<Data, Value, NativeEvent>;
  }

  /**
   * @method register
   * @description Register a channel if it doesn't exist
   * @param {TChannelName} channelName - Name of the channel to register
   * @returns {Map<TEventName, Map<TSubId, IHandler>>} Map of events for the channel
   */
  register(channelName: TChannelName) {
    if (!this._subscribers.has(channelName)) {
      this._subscribers.set(channelName, new Map());
    }
    return this._subscribers.get(channelName)!;
  }

  /**
   * @method sub
   * @description Subscribe to an event on a channel
   * @template Data - The type of data passed with the event
   * @template Value - The data type of the target value
   * @template NativeEvent - The type of the native event
   * @param {TChannelName} channelName - Name of the channel
   * @param {string} eventName - Name of the event
   * @param {IHandler<Data, Value, NativeEvent>} handler - Event handler function
   * @param {TSubId} [id] - Optional subscription ID
   * @returns {Object} Subscription object with ID and unsubscribe function
   */
  sub<Data = unknown, Value = unknown, NativeEvent = Event>(
    channelName: TChannelName,
    eventName: string,
    handler: IHandler<Data, Value, NativeEvent>,
    id?: TSubId,
  ) {
    const channel = this.register(channelName);
    channel.has(eventName) || channel.set(eventName, new Map());

    const events = channel.get(eventName)!;
    id ? events.has(id) && events.delete(id) : (id = PubSub.createId());

    events.set(id, handler as IHandler);

    return {
      id,
      unsub: () => this.unsub(channelName, eventName, id),
    } as const;
  }

  /**
   * @method unsub
   * @description Unsubscribe from an event
   * @param {TChannelName} channelName - Name of the channel
   * @param {TEventName} eventName - Name of the event
   * @param {TSubId} id - Subscription ID
   * @returns {void}
   */
  unsub(channelName: TChannelName, eventName: TEventName, id: TSubId): void {
    if (!this._subscribers.has(channelName)) {
      return;
    }

    const channel = this._subscribers.get(channelName)!;

    if (!channel.has(eventName)) {
      return;
    }

    const events = channel.get(eventName)!;
    events.has(id) && events.delete(id);
  }

  /**
   * @method unsubAll
   * @description Unsubscribe from all events, a channel, or an event in a channel
   * @param {TChannelName} [channelName] - Optional channel name
   * @param {TEventName} [eventName] - Optional event name
   * @returns {void}
   */
  unsubAll(channelName?: TChannelName, eventName?: TEventName): void {
    if (!channelName) {
      this._subscribers.clear();
      return;
    }

    if (!this._subscribers.has(channelName)) {
      return;
    }

    if (!eventName) {
      this._subscribers.delete(channelName);
      return;
    }

    const channel = this._subscribers.get(channelName)!;

    if (!channel.has(eventName)) {
      return;
    }

    channel.delete(eventName);

  }

  /**
   * @method pub
   * @description Publish an event to a channel
   * @template Data - The type of data passed with the event
   * @template Value - The data type of the target value
   * @template NativeEvent - The type of the native event
   * @param {TChannelName} channelName - Name of the channel
   * @param {TEventName} eventName - Name of the event
   * @param {Data} [data] - Optional data to pass with the event
   * @param {PubSubTarget<Value>} [target] - Optional target object
   * @param {NativeEvent} [e] - Optional native event
   * @returns {void}
   */
  pub<Data = unknown, Value = unknown, NativeEvent = Event>(
    channelName: TChannelName,
    eventName: TEventName,
    data?: Data,
    target?: PubSubTarget<Value>,
    e?: NativeEvent,
  ) {
    if (!this._subscribers.has(channelName)) {
      return;
    }

    const channel = this._subscribers.get(channelName)!;

    if (!channel.has(eventName)) {
      return
    }

    const events = channel.get(eventName)!;

    events.forEach((handler, id) => {
      handler(PubSub.createEvent(
        {
          channel: channelName,
          name: eventName,
          id,
          data,
        },
        target,
        e
      ) as PubSubEvent);
    });

    if (
      typeof window === 'undefined' ||
      !('dispatchEvent' in window) ||
      typeof window.dispatchEvent !== 'function'
    ) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        `${channelName}:${eventName}`,
        PubSub.createEvent(
          {
            channel: channelName,
            name: eventName,
            data,
          } as PubSubDetail,
          target ,
          e
        ),
      ),
    )
  }
}
