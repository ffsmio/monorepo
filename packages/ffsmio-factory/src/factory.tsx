import {
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import {
  Factory,
  FactoryInitialProps,
  FactoryOptions,
  FactoryProps,
  InitialProps,
  ObjectProps,
} from './types';
import { extractProps, filterProps } from './utils';

/**
 * Creates a reusable factory component with customizable rendering.
 * Factory components support dynamic props, type-safe forwarding,
 * and customizable rendering through template functions.
 *
 * @template AdditionalProps - Additional props type that the factory component accepts
 * @template Element - The base element type, defaults to 'div'
 * @param {string} displayName - Display name for the component in React DevTools
 * @param {FactoryInitialProps<Element, AdditionalProps>} [init] - Initial props or props factory function
 * @param {FactoryOptions<ElementType, AdditionalProps>} [options={}] - Additional options for the factory
 * @returns {ForwardRefExoticComponent<PropsWithoutRef<FactoryProps<Element, AdditionalProps>> & RefAttributes<Factory<Element>>>}
 *   A forward ref component with the specified features
 *
 * @example
 * // Basic usage - create a Button component
 * const Button = factory('Button', {
 *   className: 'btn'
 * });
 *
 * @example
 * // With dynamic initialization
 * const Card = factory('Card', (props) => ({
 *   className: clsx('card', props.variant && `card-${props.variant}`)
 * }));
 *
 * @example
 * // With custom template for form field layout
 * const FormInput = factory(
 *   'FormInput',
 *   {
 *     as: 'input',
 *     className: 'form-control'
 *   },
 *   {
 *     template: (Component, props, initProps) => (
 *       <div className="form-group">
 *         {props.label && <label>{props.label}</label>}
 *         <Component {...props} />
 *         {props.error && <div className="error">{props.error}</div>}
 *       </div>
 *     )
 *   }
 * );
 *
 * @example
 * // Filtering props with options
 * const Link = factory(
 *   'Link',
 *   { as: 'a' },
 *   {
 *     excludeProps: ['isExternal'],
 *     template: (Component, props, initProps) => (
 *       <Component
 *         {...props}
 *         target={initProps.isExternal ? '_blank' : undefined}
 *         rel={initProps.isExternal ? 'noopener noreferrer' : undefined}
 *       />
 *     )
 *   }
 * );
 */
export function factory<
  AdditionalProps extends ObjectProps,
  Element extends ElementType = 'div',
>(
  displayName: string,
  init?: FactoryInitialProps<Element, AdditionalProps>,
  options: FactoryOptions<ElementType, AdditionalProps> = {}
) {
  const template =
    options.template || ((Component, props) => <Component {...props} />);

  const FactoryElement = forwardRef(function FactoryElement<
    El extends ElementType = Element,
  >(
    props: PropsWithoutRef<FactoryProps<El, AdditionalProps>>,
    ref: ForwardedRef<Factory<El>>
  ) {
    const solvedInit =
      typeof init === 'function'
        ? init(props as FactoryProps<Element, AdditionalProps>)
        : init;

    const { Component, children, merged, initProps } = extractProps(
      solvedInit as InitialProps<Element, AdditionalProps>,
      props as PropsWithoutRef<FactoryProps<ElementType, AdditionalProps>>
    );

    const filtered = filterProps(
      merged,
      options
    ) as ComponentPropsWithRef<Element>;

    return template(
      Component,
      { ...filtered, ref, children },
      initProps as InitialProps<ElementType, AdditionalProps>
    );
  }) as ForwardRefExoticComponent<
    PropsWithoutRef<FactoryProps<Element, AdditionalProps>> &
      RefAttributes<Factory<Element>>
  >;

  FactoryElement.displayName = displayName;
  return FactoryElement;
}
