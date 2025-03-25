import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
import { clsx } from './clsx';

export type TabLabelProps = DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>;

export function TabLabel(props: PropsWithChildren<TabLabelProps>) {
  const { children, className, ...rest } = props;

  return (
    <span {...rest} className={clsx('ffsmio-Tabs-tab-label', className)}>
      {children}
    </span>
  );
}
