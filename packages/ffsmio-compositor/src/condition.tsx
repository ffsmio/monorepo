import { PropsWithChildren, ReactNode } from 'react';
import { AsInstance } from './as-instance';

export type ConditionProps = {
  when?: unknown;
  falsy?: boolean;
  fallback?: ReactNode;
  [key: string]: unknown;
};

/**
 * A declarative conditional rendering component that displays either children or fallback content
 * based on a condition.
 *
 * @param {PropsWithChildren<ConditionProps>} props - Component properties
 * @param {React.ReactNode} props.children - Content to display when the condition is truthy
 * @param {unknown} [props.when] - The condition that determines which content to show
 * @param {boolean} [props.falsy] - When true, treats all falsy values (0, '', etc) as false conditions
 * @param {React.ReactNode} [props.fallback] - Content to display when the condition is falsy
 * @param {...unknown} props.rest - Additional props to pass to the rendered content via AsInstance
 * @returns {JSX.Element} Either the children or fallback content wrapped in AsInstance
 *
 * @example
 * // Basic usage with fallback
 * <Condition when={isLoggedIn} fallback={<LoginForm />}>
 *   <Dashboard />
 * </Condition>
 *
 * @example
 * // With falsy option to handle empty arrays
 * <Condition when={results.length} falsy fallback={<NoResultsMessage />}>
 *   <ResultsList items={results} />
 * </Condition>
 *
 * @example
 * // Passing props to the rendered content
 * <Condition when={hasPermission} fallback={<AccessDenied />} className="content-area">
 *   <AdminPanel />
 * </Condition>
 */
export function Condition(props: PropsWithChildren<ConditionProps>) {
  const { children, when, fallback, falsy, ...rest } = props;

  if (typeof when === 'undefined' || when === false || (falsy && !when)) {
    return <AsInstance {...rest}>{fallback}</AsInstance>;
  }

  return <AsInstance {...rest}>{children}</AsInstance>;
}
