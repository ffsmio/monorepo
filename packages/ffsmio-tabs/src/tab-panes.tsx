import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
} from 'react';
import { AsArray } from '@ffsm/as-array';
import { clsx } from './clsx';

export interface TabPanesProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  onChangeTab?(tab: string): void;
  value?: string;
}

export const TabPanes = forwardRef<
  HTMLDivElement,
  PropsWithChildren<TabPanesProps>
>(function TabPanes(props, ref) {
  const { children, onChangeTab, value, className, ...rest } = props;

  return (
    <div {...rest} ref={ref} className={clsx('ffsmio-Tabs-panes', className)}>
      <AsArray onChangeTab={onChangeTab} currentValue={value}>
        {children}
      </AsArray>
    </div>
  );
});
