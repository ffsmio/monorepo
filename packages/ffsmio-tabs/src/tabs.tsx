import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { AsArray } from '@ffsm/as-array';
import { clsx } from './clsx';

export interface TabsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value?: string;
  onChangeTab?(tab: string): void;
  horizontal?: boolean;
}

export const Tabs = forwardRef<HTMLDivElement, PropsWithChildren<TabsProps>>(
  function Tabs(props, ref) {
    const { children, className, value, horizontal, onChangeTab, ...rest } =
      props;

    return (
      <div
        {...rest}
        ref={ref}
        className={clsx(
          'ffsmio-Tabs-root',
          horizontal && 'ffsmio-Tabs-horizontal',
          className
        )}
      >
        <AsArray
          value={value}
          onChangeTab={onChangeTab}
          horizontal={horizontal}
        >
          {children}
        </AsArray>
      </div>
    );
  }
);
