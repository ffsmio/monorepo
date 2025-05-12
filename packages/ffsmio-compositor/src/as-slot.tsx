import {
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactNode,
  Ref,
} from 'react';
import { ObjectProps, RenderFunction } from './types';
import { AsInstance } from './as-instance';

export type AsSlotProps<Props extends ObjectProps> = {
  outlet?: ReactNode | RenderFunction<Props>;
  outletProps?: ObjectProps;
} & ObjectProps;

type AsComponentProps = {
  ref: Ref<unknown>;
  props: ObjectProps;
};

/**
 * A component that implements slot-based composition, allowing children to be rendered
 * within an outlet component or render function.
 *
 * @template Props - The type of props that can be passed to the outlet
 * @param {PropsWithChildren<AsSlotProps<Props>>} props - Component properties
 * @param {React.ReactNode} props.children - The content to be rendered inside the outlet
 * @param {React.ReactNode | RenderFunction<Props>} [props.outlet] - The wrapper component or render function
 * @param {ObjectProps} [props.outletProps] - Additional props to pass to the outlet component
 * @param {...ObjectProps} props.rest - Additional props passed to children via AsInstance
 * @returns {JSX.Element} The composed component hierarchy
 *
 * @example
 * // Basic usage with an outlet component
 * <AsSlot outlet={<Card />}>
 *   <p>This content will be rendered inside the Card</p>
 * </AsSlot>
 *
 * @example
 * // With outlet props
 * <AsSlot
 *   outlet={<Panel />}
 *   outletProps={{ title: "User Settings", elevated: true }}
 * >
 *   <UserPreferences />
 * </AsSlot>
 *
 * @example
 * // With a render function
 * <AsSlot
 *   outlet={(props) => <Dialog open={isOpen} {...props} />}
 *   className="dialog-content"
 * >
 *   <h2>Confirm Action</h2>
 *   <p>Are you sure you want to continue?</p>
 * </AsSlot>
 */
export function AsSlot<Props extends ObjectProps>(
  props: PropsWithChildren<AsSlotProps<Props>>
) {
  const { children, outlet, outletProps, ...rest } = props;

  if (typeof outlet === 'function') {
    return <>{outlet({ ...rest, children } as unknown as Props)}</>;
  }

  if (!isValidElement(outlet)) {
    return <>{children}</>;
  }

  const { props: olProps, ref } = outlet as unknown as AsComponentProps;

  const newOutletProps = {
    ...olProps,
    ...outletProps,
    ref,
  };

  return cloneElement(outlet, {
    ...newOutletProps,
    children: (
      <AsInstance {...rest} ref={ref}>
        {children}
      </AsInstance>
    ),
  } as PropsWithChildren<AsComponentProps>);
}
