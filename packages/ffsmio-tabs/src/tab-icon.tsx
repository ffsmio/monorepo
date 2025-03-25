import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
import { clsx } from './clsx';

export type TabIconProps = DetailedHTMLProps<
  HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>;

export function TabIcon(props: PropsWithChildren<TabIconProps>) {
  const { children, className, ...rest } = props;
  return (
    <span {...rest} className={clsx('ffsmio-Tabs-tab-icon', className)}>
      <span className="ffsmio-Tabs-tab-icon-inner">{children}</span>
    </span>
  );
}
