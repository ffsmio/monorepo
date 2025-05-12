import { PropsWithChildren, ReactNode } from 'react';
import { AsInstance } from './as-instance';

export type AsNodeProps = {
  /**
   * The condition value or function that determines if children should render.
   * If a function is provided, it will be called with the rest props and its
   * result will determine if children should render.
   */
  of?: unknown;

  /**
   * When true, treats any falsy value (0, '', etc) as false, not just null/undefined/false
   */
  falsy?: boolean;

  /**
   * Additional props to pass to rendered children
   */
  [key: string]: unknown;
};

/**
 * Conditionally renders children based on a condition node or function.
 * Acts as a declarative replacement for conditional rendering patterns.
 *
 * @param {PropsWithChildren<AsNodeProps>} props - Component properties
 * @param {React.ReactNode} props.children - Content to render when condition is truthy
 * @param {unknown | ((props: any) => unknown | Promise<unknown>)} [props.of] - The condition value or function that determines if children should render
 * @param {boolean} [props.falsy] - When true, treats any falsy value (0, '', etc) as false, not just false/undefined
 * @param {...unknown} props.rest - Additional props to pass to the rendered children via AsInstance
 * @returns {JSX.Element|null} The children wrapped in AsInstance if condition is truthy, otherwise null
 *
 * @example
 * // Basic usage - render only when user exists
 * <AsNode of={user}>
 *   <UserProfile />
 * </AsNode>
 *
 * @example
 * // With function condition
 * <AsNode of={(props) => userService.hasPermission('admin')}>
 *   <AdminPanel />
 * </AsNode>
 *
 * @example
 * // With async function condition
 * <AsNode of={async () => await checkUserSubscription()}>
 *   <PremiumContent />
 * </AsNode>
 *
 * @example
 * // With falsy option to treat empty string as false
 * <AsNode of={username} falsy>
 *   <WelcomeMessage name={username} />
 * </AsNode>
 *
 * @example
 * // With props passed to children
 * <AsNode of={isLoggedIn} className="user-section">
 *   <Dashboard />
 * </AsNode>
 */
export async function AsNode(props: PropsWithChildren<AsNodeProps>) {
  const { children, of: ofNode, falsy, ...rest } = props;

  if (typeof ofNode === 'undefined' || ofNode === false || (falsy && !ofNode)) {
    return null;
  }

  if (typeof ofNode === 'function') {
    const result = await ofNode(rest);

    if (result === false || (falsy && !result)) {
      return null;
    }
  }

  return <AsInstance {...rest}>{children}</AsInstance>;
}
