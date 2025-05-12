import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ComponentType,
  ElementType,
  JSX,
  ReactNode,
  Ref,
} from 'react';

/**
 * Generic object properties type
 * @template O - Object type with default empty object
 */
export type ObjectProps<O = {}> = {
  [K in keyof O]: O[K];
};

/**
 * Type that can be either a value or a function that returns that value
 * @template Result - The result type
 * @template Props - The props type passed to the function version
 */
export type MaybeFn<Result, Props = unknown> =
  | Result
  | ((props: Props) => Result);

/**
 * Extracts all properties from T except those with keys in K
 * @template T - Source type
 * @template K - Keys to exclude
 */
export type ExtractProps<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

/**
 * Utility type to preserve property types in mapped types
 * @template P - Properties type
 */
export type ExtendedProps<P> = { [K in keyof P]: P[K] };

/**
 * Type for className utility functions like clsx or classnames
 */
export type ClsxFn = (...args: any[]) => string;

/**
 * Extracts the style prop type from a component
 * @template Element - The element type to extract style from
 */
export type StyleProp<Element extends ElementType> =
  ComponentProps<Element> extends { style?: infer S } ? S : never;

/**
 * Props type for factory-created components
 * @template Element - The base element type
 * @template AdditionalProps - Additional props specific to the component
 */
export type FactoryProps<
  Element extends ElementType,
  AdditionalProps extends ObjectProps,
> = AdditionalProps & {
  /** Alternative element to render */
  as?: Element;

  /** Class name utility function */
  clsx?: ClsxFn;

  /** CSS class name */
  className?: string;

  /** Component children */
  style?: StyleProp<Element>;

  children?: ReactNode;
} & ExtendedProps<
    ExtractProps<
      ComponentPropsWithoutRef<Element>,
      keyof AdditionalProps | 'children'
    >
  >;

/**
 * Options for configuring factory component behavior
 * @template Element - The base element type
 * @template AdditionalProps - Additional props specific to the component
 */
export type FactoryOptions<
  Element extends ElementType,
  AdditionalProps extends ObjectProps,
> = {
  /** Props to exclude from being forwarded to the DOM */
  excludeProps?: Array<keyof FactoryProps<Element, AdditionalProps>>;

  /** Custom function to determine if a prop should be forwarded */
  shouldForwardProp?: (
    key: keyof FactoryProps<Element, AdditionalProps>
  ) => boolean;

  /**
   * Template function to customize rendering of the component
   * @param Component - The component type to render (div, button, custom component, etc.)
   * @param props - The processed props including ref and children
   * @param initProps - The initial props provided to the factory
   * @returns A React node representing the rendered content
   */
  template?(
    Component: ComponentType<ComponentPropsWithRef<Element>>,
    props: ComponentPropsWithRef<Element>,
    initProps: InitialProps<Element, AdditionalProps>
  ): ReactNode;
};

/**
 * Type for initial children that can be static or derived from props
 * @template Element - The base element type
 * @template AdditionalProps - Additional props specific to the component
 */
export type InitialChildren<
  Element extends ElementType,
  AdditionalProps extends ObjectProps = {},
> = MaybeFn<JSX.Element | null, FactoryProps<Element, AdditionalProps>>;

/**
 * Type for initial className that can be static or derived from props
 * @template Element - The base element type
 * @template AdditionalProps - Additional props specific to the component
 */
export type InitialClassName<
  Element extends ElementType,
  AdditionalProps extends ObjectProps = {},
> = MaybeFn<string, FactoryProps<Element, AdditionalProps>>;

/**
 * Type for initial style that can be static or derived from props
 * @template Element - The base element type
 * @template AdditionalProps - Additional props specific to the component
 */
export type InitialStyle<
  Element extends ElementType,
  AdditionalProps extends ObjectProps = {},
> = MaybeFn<StyleProp<Element>, FactoryProps<Element, AdditionalProps>>;

/**
 * Type for initial props configuration of a factory component
 * @template Element - The base element type
 * @template AdditionalProps - Additional props specific to the component
 */
export type InitialProps<
  Element extends ElementType,
  AdditionalProps extends ObjectProps = {},
> = {
  /** Initial children content */
  children?: InitialChildren<Element, AdditionalProps>;

  /** Class name utility function */
  clsx?: ClsxFn;

  /** Initial CSS class name (string or function returning string) */
  className?: InitialClassName<Element, AdditionalProps>;

  /** Initial style (object or function returning style object) */
  style?: InitialStyle<Element, AdditionalProps>;

  /** Default element type to render */
  as?: Element;
} & AdditionalProps &
  ExtendedProps<
    ExtractProps<
      ComponentPropsWithoutRef<Element>,
      keyof AdditionalProps | 'children'
    >
  >;

/**
 * Type for initial props that can be static or derived from props
 * @template Element - The base element type
 * @template AdditionalProps - Additional props specific to the component
 */
export type FactoryInitialProps<
  Element extends ElementType,
  AdditionalProps extends ObjectProps,
> = MaybeFn<
  InitialProps<Element, AdditionalProps>,
  FactoryProps<Element, AdditionalProps>
>;

/**
 * Type representing the ref object type of an element
 * @template Element - The element type to extract ref from
 */
export type Factory<Element extends ElementType> =
  ComponentPropsWithRef<Element> extends { ref?: Ref<infer R> } ? R : unknown;
