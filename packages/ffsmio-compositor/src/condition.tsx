import { PropsWithChildren, ReactNode } from 'react';
import { AsInstance } from './as-instance';

export type ConditionProps = {
  /**
   * The condition or function that determines whether to show children or fallback.
   * Can be a boolean value, any value evaluated for truthiness, or a function.
   * If a function is provided, it will be called with the remaining props and awaited if it returns a Promise.
   */
  when?: unknown;

  /**
   * When true, treats all JavaScript falsy values (0, '', NaN, null, etc.) as false conditions.
   * When false (default), only undefined, null, and false are treated as falsy.
   */
  falsy?: boolean;

  /**
   * Content to display when the condition is falsy.
   * If not provided, nothing will be rendered when condition is falsy.
   */
  fallback?: ReactNode;

  /**
   * Additional props to pass to the rendered content via AsInstance.
   */
  [key: string]: unknown;
};

/**
 * A declarative conditional rendering component that displays either children or fallback content
 * based on a condition.
 *
 * @param {PropsWithChildren<ConditionProps>} props - Component properties
 * @param {React.ReactNode} props.children - Content to display when the condition is truthy
 * @param {unknown | ((props: any) => unknown | Promise<unknown>)} [props.when] - The condition or function that determines which content to show
 * @param {boolean} [props.falsy] - When true, treats all falsy values (0, '', etc) as false conditions
 * @param {React.ReactNode} [props.fallback] - Content to display when the condition is falsy
 * @param {...unknown} props.rest - Additional props to pass to the rendered content via AsInstance
 * @returns {Promise<JSX.Element>} Either the children or fallback content wrapped in AsInstance
 *
 * @example
 * // Basic usage with fallback
 * <Condition when={isLoggedIn} fallback={<LoginForm />}>
 *   <Dashboard />
 * </Condition>
 *
 * @example
 * // With function condition
 * <Condition when={(props) => userService.hasPermission('admin')} fallback={<AccessDenied />}>
 *   <AdminPanel />
 * </Condition>
 *
 * @example
 * // With async function condition
 * <Condition when={async () => await checkUserSubscription()} fallback={<SubscribePrompt />}>
 *   <PremiumContent />
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
export async function Condition(props: PropsWithChildren<ConditionProps>) {
  const { children, when, fallback, falsy, ...rest } = props;

  if (typeof when === 'undefined' || when === false || (falsy && !when)) {
    return <AsInstance {...rest}>{fallback}</AsInstance>;
  }

  if (typeof when === 'function') {
    const result = await when(rest);

    if (result === false || (falsy && !result)) {
      return <AsInstance {...rest}>{fallback}</AsInstance>;
    }
  }

  return <AsInstance {...rest}>{children}</AsInstance>;
}
