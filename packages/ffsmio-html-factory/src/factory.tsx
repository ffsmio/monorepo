import {
  ComponentType,
  DetailedHTMLProps,
  forwardRef,
  ForwardRefRenderFunction,
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
export type HTMLElementProps<El = HTMLElement> = DetailedHTMLProps<
  HTMLAttributes<El>,
  El
>;

/**
 * Type for HTML factory component props
 * @template El The HTML element type, defaults to HTMLElement
 */
export type HTMlFactoryProps<El = HTMLElement> = PropsWithChildren<
  HTMLElementProps<El>
>;

/**
 * Processes and merges HTML props with special handling for className
 * @template El The HTML element type
 * @param {HTMLElementProps<El>} overideProps - Props to override initial props with
 * @param {Ref<El>} [ref] - Optional ref to forward
 * @param {HTMLElementProps<El>} [initialProps] - Optional initial props
 * @returns {HTMLElementProps<El>} Merged props with className handling
 */
export function propsHTML<El = HTMLElement>(
  overideProps: HTMLElementProps<El>,
  ref?: Ref<El>,
  initialProps?: HTMLElementProps<El>
) {
  const { className: restClass, ...rest } = overideProps;
  return {
    ...initialProps,
    ...rest,
    ref,
    className: clsx(initialProps?.className, restClass),
  };
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
  tag: El,
  displayName: string,
  initialProps?: HTMlFactoryProps<El>
) {
  const Component = (props: HTMlFactoryProps<El>, ref: Ref<El>) => {
    const Comp = tag as unknown as ComponentType<HTMlFactoryProps<El>>;
    return <Comp {...propsHTML<El>(props, ref, initialProps)} />;
  };
  Component.displayName = displayName;

  return forwardRef(
    Component as ForwardRefRenderFunction<El, Omit<HTMlFactoryProps, 'ref'>>
  );
}
