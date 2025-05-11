import {
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
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
import { AsSlot } from '@ffsm/compositor/as-slot';
import { AsNode } from '@ffsm/compositor/as-node';
import { Empty } from '@ffsm/compositor/empty';
import { Condition } from '@ffsm/compositor/condition';

/**
 * Creates a reusable factory component with built-in composition features.
 * Factory components support conditional rendering, slot-based composition,
 * empty state handling, and prop management in a declarative way.
 *
 * @template AdditionalProps - Additional props type that the factory component accepts
 * @template Element - The base element type, defaults to 'div'
 * @param {string} displayName - Display name for the component in React DevTools
 * @param {FactoryInitialProps<Element, AdditionalProps>} [init] - Initial props or props factory function
 * @param {FactoryOptions<ElementType, AdditionalProps>} [options={}] - Additional options for the factory
 * @returns {ForwardRefExoticComponent<PropsWithoutRef<FactoryProps<Element, AdditionalProps>> & RefAttributes<Factory<Element>>>}
 *   A forward ref component with all specified features
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
 * // With slot-based composition
 * const Panel = factory('Panel', {
 *   asSlot: true,
 *   outlet: <div className="panel-wrapper" />
 * });
 *
 * @example
 * // With conditional rendering
 * const AdminSection = factory('AdminSection', {
 *   condition: (props) => props.isAdmin,
 *   conditionFallback: <AccessDenied />
 * });
 *
 * @example
 * // With empty state handling
 * const UserList = factory('UserList', {
 *   emptyFallback: <p>No users found</p>,
 *   Component: 'ul'
 * });
 */
export function factory<
  AdditionalProps extends ObjectProps,
  Element extends ElementType = 'div',
>(
  displayName: string,
  init?: FactoryInitialProps<Element, AdditionalProps>,
  options: FactoryOptions<ElementType, AdditionalProps> = {}
) {
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
    const {
      Component,
      asSlot,
      outlet,
      children,
      asNode,
      asNodeFalsy,
      emptyFallback,
      condition,
      conditionFallback,
      conditionFalsy,
      merged,
      initProps,
    } = extractProps(
      solvedInit as InitialProps<Element, AdditionalProps>,
      props as PropsWithoutRef<FactoryProps<ElementType, AdditionalProps>>
    );
    const filtered = filterProps(
      merged,
      options
    ) as ComponentPropsWithRef<Element>;

    let content = children;

    if (emptyFallback) {
      content = <Empty fallback={emptyFallback}>{content}</Empty>;
    }

    if (condition !== undefined) {
      content = (
        <Condition
          when={condition}
          falsy={conditionFalsy}
          fallback={conditionFallback}
        >
          {content}
        </Condition>
      );
    }

    if (asSlot) {
      content = (
        <AsSlot outlet={outlet as ReactNode} outletProps={initProps}>
          {content}
        </AsSlot>
      );
    }

    const render = (
      <Component {...filtered} ref={ref}>
        {content}
      </Component>
    );

    if (asNode) {
      return (
        <AsNode of={children} falsy={asNodeFalsy}>
          {render}
        </AsNode>
      );
    }

    return render;
  }) as ForwardRefExoticComponent<
    PropsWithoutRef<FactoryProps<Element, AdditionalProps>> &
      RefAttributes<Factory<Element>>
  >;

  FactoryElement.displayName = displayName;
  return FactoryElement;
}
