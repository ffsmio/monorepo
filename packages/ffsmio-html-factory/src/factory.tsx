import {
  ComponentPropsWithRef,
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  JSX,
  PropsWithChildren,
  Ref,
} from 'react';
import { clsx } from './clsx';

/**
 * A utility type that represents detailed HTML props for a specific element type.
 * This combines HTML attributes with the element type to create proper typing.
 *
 * @template El - The HTML element instance type (e.g., HTMLDivElement, HTMLButtonElement)
 * @type {DetailedHTMLProps<HTMLAttributes<El>, El>}
 */
export type HTMLFactoryInfer<El> = DetailedHTMLProps<HTMLAttributes<El>, El>;

/**
 * A utility type that extracts the props type for a specific JSX intrinsic element.
 * This provides direct access to the props type defined in JSX.IntrinsicElements.
 *
 * @template El - The HTML element tag that extends keyof JSX.IntrinsicElements (e.g., 'div', 'button')
 * @type {JSX.IntrinsicElements[El]}
 *
 * @example
 * // Type will be the props type for a div element
 * type DivProps = HTMLElementProps<'div'>;
 *
 * // Usage in a component
 * function CustomDiv(props: HTMLElementProps<'div'>) {
 *   return <div {...props} />;
 * }
 */
export type HTMLElementProps<El extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[El];

/**
 * A type utility that extracts the underlying HTML element instance type from a JSX intrinsic element.
 * Uses conditional type inference to determine the actual DOM element type that corresponds to
 * a given JSX element tag.
 *
 * @template El - The HTML element tag that extends keyof JSX.IntrinsicElements (e.g., 'div', 'button')
 * @returns If the element can be inferred using HTMLFactoryInfer, returns the inferred instance type;
 *          otherwise falls back to HTMLElement
 *
 * @example
 * // Type will be HTMLButtonElement
 * type ButtonElement = HTMLFactory<'button'>;
 *
 * // Type will be HTMLDivElement
 * type DivElement = HTMLFactory<'div'>;
 *
 * // Usage with useRef
 * const buttonRef = useRef<HTMLFactory<'button'>>(null);
 *
 * @example
 * // Using with the factory function
 * const Button = factory('button', 'Button');
 * function Component() {
 *   const ref = useRef<HTMLFactory<'button'>>(null);
 *   return <Button ref={ref}>Click me</Button>;
 * }
 */
export type HTMLFactory<El extends keyof JSX.IntrinsicElements> =
  JSX.IntrinsicElements[El] extends HTMLFactoryInfer<infer InstanceType>
    ? InstanceType
    : HTMLElement;

/**
 * Type for HTML factory component props
 * @template El The HTML element type, defaults to HTMLElement
 */
export type HTMlFactoryProps<El extends keyof JSX.IntrinsicElements> =
  PropsWithChildren<HTMLElementProps<El>>;

/**
 * Processes and merges HTML props with special handling for className
 * @template El The HTML element type
 * @param {HTMLElementProps<El>} overideProps - Props to override initial props with
 * @param {Ref<El>} [ref] - Optional ref to forward
 * @param {HTMLElementProps<El>} [initialProps] - Optional initial props
 * @returns {HTMLElementProps<El>} Merged props with className handling
 */
export function propsHTML<El extends keyof JSX.IntrinsicElements>(
  overideProps: HTMlFactoryProps<El>,
  ref?: Ref<HTMLFactory<El>>,
  initialProps?: HTMLElementProps<El>
) {
  const { className: restClass, ...rest } = overideProps;
  return {
    ...initialProps,
    ...rest,
    ref,
    className: clsx(initialProps?.className, restClass),
  } as ComponentPropsWithRef<El>;
}

/**
 * Creates a factory component for the specified HTML tag
 * @template El The HTML element type that extends keyof JSX.IntrinsicElements
 * @param {El} tag - The HTML tag to create a factory for
 * @param {string} displayName - The display name for the component
 * @param {HTMlFactoryProps<El>} [initialProps] - Optional initial props for the component
 * @returns {ForwardRefExoticComponent<PropsWithoutRef<HTMlFactoryProps<El>> & RefAttributes<El>>} A React component
 *
 * @example
 * // Create a custom paragraph component
 * const P = factory('p', 'Paragraph', { className: 'text-base' });
 *
 * // Use in your component
 * <P className="text-red-500">This will have both classes</P>
 */
export function factory<El extends keyof JSX.IntrinsicElements>(
  Tag: El,
  displayName: string,
  initialProps?: HTMlFactoryProps<El>
) {
  const Component = forwardRef<HTMLFactory<El>, HTMlFactoryProps<El>>(
    (props, ref) => {
      return <Tag {...(propsHTML<El>(props, ref, initialProps) as any)} />;
    }
  );
  Component.displayName = displayName;
  return Component;
}
