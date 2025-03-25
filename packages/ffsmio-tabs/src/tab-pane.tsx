import {
  DetailedHTMLProps,
  HTMLAttributes,
  JSX,
  PropsWithChildren,
  useMemo,
} from 'react';
import { clsx } from './clsx';

export type RenderPaneProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface TabPaneProps extends RenderPaneProps {
  value: string;
  currentValue?: string;
  onChangeTab?(tab: string): void;
  renderRoot?(props: RenderPaneProps, state: boolean): JSX.Element;
}

export function TabPane(props: PropsWithChildren<TabPaneProps>) {
  const {
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onChangeTab,
    value,
    currentValue,
    renderRoot,
    className,
    ...rest
  } = props;
  const isOpen = useMemo(() => value === currentValue, [value, currentValue]);

  if (renderRoot) {
    return (
      <>
        {renderRoot(
          {
            ...rest,
            'data-tabpane-value': value,
            className: clsx('ffsmio-Tabs-pane', className),
            children,
          } as RenderPaneProps,
          isOpen
        )}
      </>
    );
  }

  return <div className="ffsmio-Tabs-pane">{isOpen && children}</div>;
}
