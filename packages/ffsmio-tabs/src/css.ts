import { CSSProperties } from 'react';

export function css(el: HTMLElement, style: CSSProperties) {
  Object.entries(style).forEach(([key, value]) => {
    (el.style as unknown as Record<string, string>)[key] = value;
  });
}
