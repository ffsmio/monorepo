'use client';

import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react';
import { clsx } from './clsx';

export interface TabItemProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  value: string;
  onChangeTab?(tab: string): void;
  currentValue?: string;
}

export const TabItem = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<TabItemProps>
>(function TabItem(props, ref) {
  const { value, onChangeTab, currentValue, children, ...rest } = props;

  const isCurrent = useMemo(
    () => value === currentValue,
    [value, currentValue]
  );
  const handleClick = useCallback(() => {
    isCurrent || onChangeTab?.(value);
  }, [onChangeTab, value, isCurrent]);

  return (
    <button
      {...rest}
      ref={ref}
      data-tabs-value={value}
      onClick={handleClick}
      className={clsx('ffsmio-Tabs-tab', isCurrent && 'ffsmio-Tabs-tab-active')}
    >
      {children}
    </button>
  );
});
