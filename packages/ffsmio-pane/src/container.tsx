import {
  Children,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { clsx } from '@ffsm/utils';
import { usePane } from './use-pane';
import { PaneItem } from './pane-item';

export type PaneContainerProps = HTMLAttributes<HTMLDivElement>;

export const PaneContainer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<PaneContainerProps>
>(function PaneContainer(props, ref) {
  const { children, className, style = {} } = props;

  const pane = usePane();
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => containerRef.current!, [containerRef]);

  useEffect(() => {
    if (
      !containerRef.current ||
      'undefined' === typeof window ||
      'undefined' === typeof ResizeObserver
    ) {
      return;
    }

    const parent: Element | null = containerRef.current!.parentElement;

    function handleResize() {
      if (parent) {
        pane.updateContainerSize(parent.clientWidth, parent.clientHeight);
      } else {
        pane.updateContainerSize(window.innerWidth, window.innerHeight);
      }
    }

    const observer = new ResizeObserver(handleResize);

    if (parent) {
      observer.observe(parent as Element);
    } else {
      document.addEventListener('resize', handleResize);
    }

    handleResize();

    return () => {
      if (parent) {
        observer.disconnect();
      } else {
        document.removeEventListener('resize', handleResize);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const internalStyle = useMemo(() => {
    if (!pane.containerWidth || !pane.containerHeight) {
      return {};
    }

    return {
      width: pane.containerWidth,
      height: pane.containerHeight,
    };
  }, [pane.containerWidth, pane.containerHeight]);

  const arrChildren = Children.toArray(children).filter(
    (child) => !!child && isValidElement(child)
  );

  return (
    <div
      {...props}
      ref={containerRef}
      className={clsx(
        'Pane-container',
        { 'Pane-horizontal': pane.horizontal },
        className
      )}
      style={{ ...style, ...internalStyle }}
    >
      {arrChildren.map((child, index) => {
        const _props = child.props as Record<string, string | number | boolean>;

        const itemProps: Record<string, string | number | boolean | undefined> =
          {
            index,
            total: arrChildren.length,
            width: Number(_props['data-pane-width']) || undefined,
            height: Number(_props['data-pane-height']) || undefined,
            min: Number(_props['data-pane-min']) || undefined,
            max: Number(_props['data-pane-max']) || undefined,
            className: clsx('Pane-item', _props.className),
          };

        return (
          <PaneItem key={child.key} {...itemProps}>
            {child}
          </PaneItem>
        );
      })}
    </div>
  );
});
