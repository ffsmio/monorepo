import { PropsWithChildren, ReactNode } from 'react';
import { AsInstance } from './as-instance';

export interface EmptyProps {
  fallback?: ReactNode;
  falsy?: boolean;
  [key: string]: unknown;
}

/**
 * A component that renders fallback content when the children are empty.
 * Useful for handling null, undefined, or falsy children in a declarative way.
 *
 * @param {PropsWithChildren<EmptyProps>} props - Component properties
 * @param {React.ReactNode} props.children - The primary content to render if not empty
 * @param {React.ReactNode} [props.fallback] - Content to display when children are empty
 * @param {boolean} [props.falsy] - When true, treats all falsy values (0, '', etc) as empty
 * @param {...unknown} props.rest - Additional props to pass to the rendered content
 * @returns {JSX.Element} Either the children or fallback content wrapped in AsInstance
 *
 * @example
 * // Basic usage with fallback
 * <Empty fallback={<NoDataMessage />}>
 *   {userData}
 * </Empty>
 *
 * @example
 * // With falsy option to handle empty arrays or strings
 * <Empty fallback={<EmptyList />} falsy>
 *   {items.length && <ItemsList items={items} />}
 * </Empty>
 *
 * @example
 * // Passing props to rendered content
 * <Empty fallback={<Placeholder />} className="content-box">
 *   {content}
 * </Empty>
 */
export function Empty(props: PropsWithChildren<EmptyProps>) {
  const { children, fallback, falsy, ...rest } = props;

  if (
    typeof children === 'undefined' ||
    children === false ||
    (falsy && !children)
  ) {
    return <AsInstance {...rest}>{fallback}</AsInstance>;
  }

  return <AsInstance {...rest}>{children}</AsInstance>;
}
