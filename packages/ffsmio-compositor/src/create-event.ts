class CompositorEvent {
  private _isDefaultPrevented = false;
  private _isPropagationStopped = false;

  target: {
    name: string | undefined;
    value: unknown;
  };

  currentTarget: {
    name: string | undefined;
    value: unknown;
  };

  constructor(
    public name: string | undefined,
    public value: unknown,
    public bubbles: boolean = true,
    public cancelable: boolean = true
  ) {
    this.target = {
      name,
      value,
    };
    this.currentTarget = {
      name,
      value,
    };
  }

  preventDefault() {
    this._isDefaultPrevented = true;
  }

  stopPropagation() {
    this._isPropagationStopped = true;
  }

  isDefaultPrevented() {
    return this._isDefaultPrevented;
  }

  isPropagationStopped() {
    return this._isPropagationStopped;
  }
}

/**
 * Creates a new Compositor event with specified name and value.
 *
 * @template Ev - The type to cast the returned event to
 * @param {string | undefined} name - The name of the event, can be undefined
 * @param {unknown} value - The value associated with the event
 * @returns {Ev} A new CompositorEvent instance cast to the specified type Ev
 *
 * @example
 * // Create a simple event
 * const clickEvent = createEvent<ClickEvent>('click', { x: 100, y: 200 });
 *
 * @example
 * // Create an event with a specific type
 * interface FormSubmitEvent extends CompositorEvent {
 *   formData: Record<string, unknown>;
 * }
 * const submitEvent = createEvent<FormSubmitEvent>('submit', { formData: { name: 'John' } });
 */
export function createEvent<Ev>(name: string | undefined, value: unknown) {
  return new CompositorEvent(name, value) as Ev;
}
