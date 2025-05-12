import {
  ComponentPropsWithRef,
  ComponentType,
  ElementType,
  PropsWithoutRef,
  ReactNode,
} from 'react';
import {
  ClsxFn,
  FactoryOptions,
  FactoryProps,
  InitialChildren,
  InitialClassName,
  InitialProps,
  InitialStyle,
  ObjectProps,
} from './types';
import { clsx as defaultClsx } from './clsx';

/**
 * Creates a shallow copy of props object or returns empty object if undefined
 * @internal
 */
export function cloneProps<Props extends ObjectProps>(
  props: Props | undefined
) {
  return (props ? { ...props } : {}) as Props;
}

/**
 * Retrieves and removes a property from an object
 * @internal
 */
export function getAndDeleteProp<Result>(
  props: Record<string, unknown>,
  key: string,
  defaultValue?: unknown
): Result {
  if (props && key in props) {
    const value = props[key];
    delete props[key];
    return value as Result;
  }

  return defaultValue as Result;
}

/**
 * Extracts and processes component props from init config and user props
 * @internal
 */
export function extractProps<
  Element extends ElementType,
  AdditionalProps extends ObjectProps,
>(
  init: InitialProps<Element, AdditionalProps> | undefined,
  props: PropsWithoutRef<FactoryProps<ElementType, AdditionalProps>>
) {
  const clonedInit = cloneProps(init);
  const clonedProps = cloneProps(props);

  if ('displayName' in clonedInit) {
    delete clonedInit.displayName;
  }

  const initClsx = getAndDeleteProp<ClsxFn>(clonedInit, 'clsx', defaultClsx);
  const asSlot = getAndDeleteProp<boolean>(clonedInit, 'asSlot');
  const outlet = getAndDeleteProp<InitialChildren<Element, AdditionalProps>>(
    clonedInit,
    'children'
  );
  const initClassName = getAndDeleteProp<
    InitialClassName<Element, AdditionalProps>
  >(clonedInit, 'className');
  const initStyle = getAndDeleteProp<InitialStyle<Element, AdditionalProps>>(
    clonedInit,
    'style'
  );

  const Component = getAndDeleteProp<
    ComponentType<ComponentPropsWithRef<Element>>
  >(clonedProps, 'as', 'div');
  const clsx = getAndDeleteProp<ClsxFn>(clonedProps, 'clsx', initClsx);
  const propClassName = getAndDeleteProp<string>(clonedProps, 'className');
  const propStyle = getAndDeleteProp<ObjectProps>(clonedProps, 'style');
  const children = getAndDeleteProp<ReactNode>(clonedProps, 'children');

  const merged = Object.assign(
    {},
    clonedInit,
    clonedProps
  ) as ComponentPropsWithRef<Element>;

  const solvedClassName =
    typeof initClassName === 'function' ? initClassName(merged) : initClassName;
  const solvedStyle =
    typeof initStyle === 'function'
      ? (initStyle as (props: ComponentPropsWithRef<Element>) => ObjectProps)(
          merged
        )
      : initStyle;

  const className = clsx(solvedClassName, propClassName);
  const style =
    solvedStyle || propStyle
      ? Object.assign({}, solvedStyle, propStyle)
      : undefined;

  return {
    Component,
    initProps: cloneProps(init),
    asSlot,
    outlet,
    children,
    merged: {
      ...merged,
      className,
      style,
    } as ComponentPropsWithRef<Element>,
  };
}

/**
 * Filters props based on provided options
 * @internal
 */
export function filterProps<
  Element extends ElementType,
  AdditionalProps extends ObjectProps,
>(
  props: FactoryProps<Element, AdditionalProps>,
  options: FactoryOptions<Element, AdditionalProps> = {}
) {
  type PropKey = keyof FactoryProps<Element, AdditionalProps>;
  const unionProps = [...(options.excludeProps || [])].filter(
    (v, i, s) => s.indexOf(v) === i
  ) as Array<PropKey>;
  const shouldForwardProps =
    options.shouldForwardProp || ((key: PropKey) => !unionProps.includes(key));

  return Object.entries(props).reduce(
    (acc, [k, v]) => {
      if (shouldForwardProps(k as PropKey)) {
        acc = Object.assign(acc, { [k]: v });
      }
      return acc;
    },
    {} as FactoryProps<Element, AdditionalProps>
  );
}
