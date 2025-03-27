import {
  ComponentPropsWithRef,
  ComponentRef,
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  JSX,
  PropsWithChildren,
  Ref,
} from 'react';
import { clsx } from './clsx';

/**
 * Type for HTML element props with proper TypeScript support
 * @template El The HTML element type, defaults to HTMLElement
 */
export type HTMLElementProps<El extends keyof JSX.IntrinsicElements> =
  DetailedHTMLProps<HTMLAttributes<El>, El>;

/**
 * Type for HTML factory component props
 * @template El The HTML element type, defaults to HTMLElement
 */
export type HTMlFactoryProps<El extends keyof JSX.IntrinsicElements> =
  PropsWithChildren<HTMLElementProps<El>>;

/**
 * A type representing a reference to a React component factory for a specific HTML element.
 * This type combines React's ref functionality with the component reference for DOM elements.
 *
 * @template El - The HTML element type that extends keyof JSX.IntrinsicElements (e.g., 'div', 'span', 'button')
 * @type {Ref<ComponentRef<El>>} - A React ref pointing to the component reference of the specified element
 *
 * @example
 * // Declaring a ref for a button factory component
 * const buttonRef = useRef<HTMLFactory<'button'>>(null);
 *
 * // Using with a factory component
 * <Button ref={buttonRef}>Click me</Button>
 *
 * @since 0.0.2
 */
export type HTMLFactory<El extends keyof JSX.IntrinsicElements> = Ref<
  ComponentRef<El>
>;

/**
 * Processes and merges HTML props with special handling for className
 * @template El The HTML element type
 * @param {HTMLElementProps<El>} overideProps - Props to override initial props with
 * @param {Ref<El>} [ref] - Optional ref to forward
 * @param {HTMLElementProps<El>} [initialProps] - Optional initial props
 * @returns {HTMLElementProps<El>} Merged props with className handling
 */
export function propsHTML<El extends keyof JSX.IntrinsicElements>(
  overideProps: HTMLElementProps<El>,
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
