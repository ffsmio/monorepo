'use client';

import {
  HTMLAttributes,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { clsx } from '@ffsm/utils';
import { usePane } from './use-pane';
import { Resizer } from './resizer';

export interface PaneItemProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  min?: number;
  max?: number;
}

type PropsWithIndex<Props> = Props & { index: number; total: number };

function PaneItemWithIndex(
  props: PropsWithChildren<PropsWithIndex<PaneItemProps>>
) {
  const {
    width,
    height,
    index,
    total,
    children,
    style = {},
    className,
    min,
    max,
    ...rest
  } = props;
  const pane = usePane();
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemRef.current || 'undefined' === typeof window) {
      return;
    }

    const computed = window.getComputedStyle(itemRef.current);
    let itemWidth = parseFloat(computed.width);
    let itemHeight = parseFloat(computed.height);

    if (pane.horizontal) {
      if (min && min > 0) {
        itemHeight = Math.max(itemHeight, min);
      }

      if (max && max > 0) {
        itemHeight = Math.min(itemHeight, max);
      }
    } else {
      if (min && min > 0) {
        itemWidth = Math.max(itemWidth, min);
      }

      if (max && max > 0) {
        itemWidth = Math.min(itemWidth, max);
      }
    }
    pane.updateItemSize(index, itemWidth, itemHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const item = useMemo(() => pane.items[index], [pane.items, index]);
  const isLast = useMemo(() => index === total - 1, [index, total]);

  return (
    <div
      {...rest}
      ref={itemRef}
      className={clsx(className)}
      style={
        !isLast
          ? {
              ...style,
              width: item?.width || width,
              height: item?.height || height,
              minWidth: item?.width || width,
              minHeight: item?.height || height,
            }
          : style
      }
    >
      {children}
      {!isLast && <Resizer index={index} min={min} max={max} />}
    </div>
  );
}

function withIndex() {
  return function PaneItemWithoutIndex(
    props: PropsWithChildren<PaneItemProps>
  ) {
    return <PaneItemWithIndex {...(props as PropsWithIndex<PaneItemProps>)} />;
  };
}

export const PaneItem = withIndex();
