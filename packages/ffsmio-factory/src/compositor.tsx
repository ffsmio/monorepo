import { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import { factory as factoryBase } from './factory';
import { cloneProps, getAndDeleteProp } from './utils';
import { Empty } from '@ffsm/compositor/empty';
import { Condition } from '@ffsm/compositor/condition';
import { AsSlot } from '@ffsm/compositor/as-slot';
import { AsNode } from '@ffsm/compositor/as-node';
import {
  FactoryOptions as BaseFactoryOptions,
  InitialProps,
  ObjectProps,
} from './types';

/**
 * Factory options for components with Compositor integration
 *
 * @template Element - The base element type
 * @template AdditionalProps - Additional props specific to the component
 */
export type FactoryOptions<
  Element extends ElementType,
  AdditionalProps extends ObjectProps,
> = BaseFactoryOptions<Element, AdditionalProps> & {
  // Support AsSlot component
  /** Enable slot-based composition */
  asSlot?: boolean;

  // Support AsNode component
  /** Enable conditional rendering based on children */
  asNode?: boolean;

  /** Use strict falsy checking for asNode */
  asNodeFalsy?: boolean;

  // Support Empty component
  /** Content to display when children are empty */
  emptyFallback?: ReactNode;

  // Support Condition component
  /** Condition for conditional rendering */
  condition?: unknown;

  /** Content to display when condition is falsy */
  conditionFallback?: ReactNode;

  /** Use strict falsy checking for condition */
  conditionFalsy?: boolean;
};

function getCompositorOptions(options: FactoryOptions<ElementType, {}>) {
  const clonedOptions = cloneProps(options);

  const asSlot = getAndDeleteProp<boolean>(clonedOptions, 'asSlot');

  const asNode = getAndDeleteProp<boolean>(clonedOptions, 'asNode', false);
  const asNodeFalsy = getAndDeleteProp<boolean>(
    clonedOptions,
    'asNodeFalsy',
    false
  );
  const emptyFallback = getAndDeleteProp<ReactNode>(
    clonedOptions,
    'emptyFallback',
    null
  );
  const condition = getAndDeleteProp<unknown>(
    clonedOptions,
    'condition',
    undefined
  );
  const conditionFallback = getAndDeleteProp<ReactNode>(
    clonedOptions,
    'conditionFallback',
    null
  );
  const conditionFalsy = getAndDeleteProp<boolean>(
    clonedOptions,
    'conditionFalsy',
    false
  );

  return {
    asSlot,
    asNode,
    asNodeFalsy,
    emptyFallback,
    condition,
    conditionFallback,
    conditionFalsy,
  };
}

/**
 * Creates a factory component with integrated Compositor features
 *
 * This factory function combines the standard factory component creation with
 * automatic integration of @ffsm/compositor components. While the basic factory
 * focuses on creating reusable UI components with dynamic props and forwarding,
 * this compositor-enabled version adds support for advanced UI patterns:
 *
 * - Conditional rendering via Condition component
 * - Empty state handling via Empty component
 * - Children-based conditional rendering via AsNode component
 * - Content projection via AsSlot component
 *
 * @template AdditionalProps - Additional props type that the factory component accepts
 * @template Element - The base element type, defaults to 'div'
 * @param {string} displayName - Display name for the component in React DevTools
 * @param {InitialProps<Element, AdditionalProps>} [init] - Initial props or props factory function
 * @param {FactoryOptions<Element, AdditionalProps>} [options={}] - Factory options including compositor features
 * @returns {ForwardRefExoticComponent<PropsWithoutRef<FactoryProps<Element, AdditionalProps>> & RefAttributes<Factory<Element>>>}
 *   A forward ref component with compositor integration
 *
 * @example
 * // Create a card with empty state
 * const Card = factory('Card',
 *   { className: 'card p-4' },
 *   { emptyFallback: <p>No content available</p> }
 * );
 *
 * @example
 * // Create a component that only renders when authenticated
 * const ProtectedArea = factory('ProtectedArea',
 *   { className: 'protected-area' },
 *   {
 *     condition: (props) => props.isAuthenticated,
 *     conditionFallback: <LoginPrompt />
 *   }
 * );
 *
 * @example
 * // Create a component with slot-based composition
 * const Dialog = factory('Dialog',
 *   { className: 'dialog' },
 *   {
 *     asSlot: true,
 *     outlet: <div className="dialog-content" />
 *   }
 * );
 *
 * @example
 * // Create a component that only renders when it has children
 * const Section = factory('Section',
 *   { className: 'section' },
 *   { asNode: true }
 * );
 */
export function factory<
  AdditionalProps extends ObjectProps,
  Element extends ElementType = 'div',
>(
  displayName: string,
  init?: InitialProps<Element, AdditionalProps>,
  options: FactoryOptions<Element, AdditionalProps> = {}
) {
  const {
    emptyFallback,
    condition,
    conditionFalsy,
    conditionFallback,
    asSlot,
    asNode,
    asNodeFalsy,
  } = getCompositorOptions(options as FactoryOptions<ElementType, {}>);

  function template(
    Component: ElementType,
    props: ComponentPropsWithRef<Element>,
    initProps: InitialProps<Element, AdditionalProps>
  ) {
    const { children, ...rest } = props;

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

    const outlet = getAndDeleteProp<ReactNode>(initProps, 'outlet', null);

    if (asSlot) {
      content = (
        <AsSlot outlet={outlet} outletProps={initProps}>
          {content}
        </AsSlot>
      );
    }

    const templateOption =
      options?.template || ((Comp, props) => <Comp {...props} />);

    const render = templateOption(
      Component as ComponentPropsWithRef<Element>,
      {
        ...rest,
        children: content,
      } as ComponentPropsWithRef<Element>,
      initProps as InitialProps<Element, AdditionalProps>
    );

    if (asNode) {
      return (
        <AsNode of={content} falsy={asNodeFalsy}>
          {render}
        </AsNode>
      );
    }

    return render;
  }

  return factoryBase<AdditionalProps, Element>(displayName, init, {
    ...options,
    template,
  } as BaseFactoryOptions<ElementType, AdditionalProps>);
}
