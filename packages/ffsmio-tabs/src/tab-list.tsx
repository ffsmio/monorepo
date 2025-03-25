'use client';

import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from 'react';
import { AsArray } from '@ffsm/as-array';
import { css } from './css';
import { clsx } from './clsx';

export interface TabListProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value?: string;
  currentValue?: string;
  horizontal?: boolean;
  onChangeTab?(tab: string): void;
  variant?:
    | 'outlined-start'
    | 'outlined-end'
    | 'outlined-start-filled'
    | 'outlined-end-filled'
    | 'filled'
    | 'bordered';
}

export const TabList = forwardRef<
  HTMLDivElement,
  PropsWithChildren<TabListProps>
>(function TabList(props, ref) {
  const {
    value,
    onChangeTab,
    children,
    className,
    variant = 'filled',
    horizontal,
    ...rest
  } = props;
  const [posOfList, setPosOfList] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      let pos = 0;

      if (node) {
        const rect = node.getBoundingClientRect();
        pos = horizontal ? rect.top : rect.left;
      }

      setPosOfList(pos);
      listRef.current = node;
    },
    [horizontal]
  );

  const indicatorRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !listRef.current) {
        return;
      }

      const button = listRef.current.querySelector(
        `[data-tabs-value="${value}"]`
      ) as HTMLButtonElement;
      const rect = button.getBoundingClientRect();

      if (horizontal) {
        css(node, {
          height: `${rect.height}px`,
          top: `${rect.top - posOfList}px`,
        });
      } else {
        css(node, {
          width: `${rect.width}px`,
          left: `${rect.left - posOfList}px`,
        });
      }
    },
    [value, posOfList, horizontal]
  );

  return (
    <div {...rest} ref={ref} className={clsx('ffsmio-Tabs-list', className)}>
      <div ref={containerRef} className="ffsmio-Tabs-list-container">
        <AsArray onChangeTab={onChangeTab} currentValue={value}>
          {children}
        </AsArray>
      </div>
      <div
        ref={indicatorRef}
        className={clsx(
          'ffsmio-Tabs-indicator',
          `ffsmio-Tabs-indicator-${variant}`
        )}
      />
    </div>
  );
});
