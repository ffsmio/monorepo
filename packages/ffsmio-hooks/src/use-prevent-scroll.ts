import { useEffect, useRef } from 'react';

export function usePreventScroll<El extends HTMLElement>(
  prevent: boolean,
  element?: El | null
) {
  const overflow = useRef<string>('');
  // Safari mobile
  const scrollY = useRef<number>(0);
  const touchMoveHandler = useRef<((e: TouchEvent) => void) | null>(null);

  useEffect(() => {
    let el: HTMLElement | null | undefined = element;

    if (!el && 'undefined' !== typeof document) {
      el = document.body;
    }

    if (!el || 'undefined' === typeof window) {
      return;
    }

    if (prevent) {
      overflow.current = el.style.overflow;
      el.style.overflow = 'hidden';

      if (el === document.body) {
        const propName =
          window.scrollY === undefined ? 'pageYOffset' : 'scrollY';
        scrollY.current = window[propName];

        touchMoveHandler.current = (e: TouchEvent) => {
          if (e.target instanceof Element) {
            const targetElement = e.target as Element;
            const scrollableParent = targetElement.closest('[data-scrollable]');
            if (!scrollableParent) {
              e.preventDefault();
            }
          } else {
            e.preventDefault();
          }
        };

        document.addEventListener('touchmove', touchMoveHandler.current, {
          passive: false,
        });
      }
    } else {
      el.style.overflow = overflow.current;
      overflow.current = '';

      if (el === document.body) {
        window.scrollTo(0, scrollY.current);

        if (touchMoveHandler.current) {
          document.removeEventListener('touchmove', touchMoveHandler.current);
          touchMoveHandler.current = null;
        }
      }
    }

    return () => {
      if (overflow.current && el) {
        el.style.overflow = overflow.current;
      }

      if (
        'undefined' !== typeof document &&
        el === document.body &&
        touchMoveHandler.current
      ) {
        document.removeEventListener('touchmove', touchMoveHandler.current);
        touchMoveHandler.current = null;
      }
    };
  }, [prevent, element]);
}
