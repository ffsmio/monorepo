import {
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactElement,
} from 'react';

export type AsInstanceProps = {
  [key: string]: unknown;
};

/**
 * Clones a React element and merges additional props with its existing props.
 * If the child is not a valid React element, it's returned unchanged.
 *
 * @param {PropsWithChildren<AsInstanceProps>} props - Component properties
 * @param {React.ReactNode} props.children - Child element to enhance with additional props
 * @param {...unknown} props.rest - Additional props to merge with the child element
 * @returns {JSX.Element} Enhanced React element with merged props or unchanged children
 *
 * @example
 * // Basic usage - add className to a button
 * <AsInstance className="primary-btn">
 *   <button>Submit</button>
 * </AsInstance>
 *
 * @example
 * // Merge with existing props
 * <AsInstance disabled={true}>
 *   <button className="btn" onClick={handleClick}>Cancel</button>
 * </AsInstance>
 * // Result: <button className="btn" onClick={handleClick} disabled={true}>Cancel</button>
 *
 * @example
 * // Non-element children pass through unchanged
 * <AsInstance className="wrapper">
 *   Just some text
 * </AsInstance>
 * // Result: Just some text
 */
export function AsInstance(props: PropsWithChildren<AsInstanceProps>) {
  const { children, ...rest } = props;

  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  const passedProps = {
    ...(children.props as Record<string, unknown>),
    ...rest,
  };

  return cloneElement(children as unknown as ReactElement, passedProps);
}
