import { Children, PropsWithChildren, ReactNode } from 'react';
import { AsInstance } from './as-instance';

/**
 * AsArray component props type
 * @typedef {Object} AsArrayProps
 * @property {React.ReactNode} children - Child elements to render
 * @property {Record<string, unknown>} [props] - Additional props to pass to all child elements
 */
export type AsArrayProps = {
  filter?(child: ReactNode, index: number): boolean;
  map?(child: ReactNode, index: number): ReactNode;
  [key: string]: unknown;
};

/**
 * Renders children as an array, with optional filtering and mapping transformations.
 *
 * @param {PropsWithChildren<AsArrayProps>} props - Component properties
 * @param {React.ReactNode} props.children - Child elements to process
 * @param {(child: ReactNode, index: number) => boolean} [props.filter] - Optional function to filter children
 * @param {(child: ReactNode, index: number) => ReactNode} [props.map] - Optional function to transform children
 * @param {...unknown} props.rest - Additional props to pass to each child element
 * @returns {JSX.Element} React Fragment containing the processed children
 *
 * @example
 * // Basic usage - pass className to all child buttons
 * <AsArray className="btn-primary">
 *   <button>Save</button>
 *   <button>Cancel</button>
 * </AsArray>
 *
 * @example
 * // Filter only button elements
 * <AsArray
 *   filter={(child) => React.isValidElement(child) && child.type === 'button'}
 *   className="btn-primary"
 * >
 *   <button>Save</button>
 *   <div>Not a button</div>
 *   <button>Cancel</button>
 * </AsArray>
 *
 * @example
 * // Transform children
 * <AsArray
 *   map={(child) => React.isValidElement(child)
 *     ? React.cloneElement(child, { disabled: true })
 *     : child
 *   }
 * >
 *   <button>Save</button>
 *   <button>Cancel</button>
 * </AsArray>
 */
export function AsArray(props: PropsWithChildren<AsArrayProps>) {
  const { children, filter, map, ...rest } = props;

  const items = Children.toArray(children);
  const filtered = filter ? items.filter(filter) : items;

  return (
    <>
      {filtered.map((child, index) => (
        <AsInstance key={index} {...rest}>
          {map ? map(child, index) : child}
        </AsInstance>
      ))}
    </>
  );
}
