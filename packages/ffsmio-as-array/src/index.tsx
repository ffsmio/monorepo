import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  PropsWithChildren,
} from 'react';

/**
 * AsArray component props type
 * @typedef {Object} AsArrayProps
 * @property {React.ReactNode} children - Child elements to render
 * @property {Record<string, unknown>} [props] - Additional props to pass to all child elements
 */
export type AsArrayProps = {
  [key: string]: unknown;
};

/**
 * AsArray component that renders an array of children and passes the same props to each child.
 *
 * This component takes children elements and any additional props, then renders each child with
 * both its original props and the additional props passed to AsArray.
 *
 * Text nodes and non-valid React elements are rendered inside Fragment components.
 * Valid React elements are cloned with merged props.
 *
 * @param {PropsWithChildren<AsArrayProps>} props - Component properties
 * @param {React.ReactNode} props.children - Child elements to render
 * @param {Record<string, unknown>} props.rest - Additional props to pass to all child elements
 * @returns {JSX.Element} React Fragment containing the rendered children
 *
 * @example
 * // Pass className to all child buttons
 * <AsArray className="btn-primary">
 *   <button>Save</button>
 *   <button>Cancel</button>
 * </AsArray>
 */
export function AsArray(props: PropsWithChildren<AsArrayProps>) {
  const { children, ...rest } = props;
  return (
    <>
      {Children.toArray(children).map((child, index) => {
        if (!isValidElement(child)) {
          return <Fragment key={index}>{child}</Fragment>;
        }

        return cloneElement(child, {
          ...(child.props as Record<string, string>),
          ...rest,
        });
      })}
    </>
  );
}
