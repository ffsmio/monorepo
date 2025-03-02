import { useEffect, useState } from 'react';

export type Breakpoint = number | 'sm' | 'md' | 'lg' | 'xl';

export interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export const MediaBreakpoints: Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function getBreakpointValue(
  breakpoint: Breakpoint,
  breakpoints: Partial<Breakpoints> = {}
): number {
  if (typeof breakpoint === 'number') {
    return breakpoint;
  }

  const merged = Object.assign({}, MediaBreakpoints, breakpoints);
  return merged[breakpoint];
}

export function useMediaQuery(
  breakpoint: Breakpoint,
  breakpoints: Partial<Breakpoints> = {}
) {
  const [query, setQuery] = useState(
    `(max-width: ${getBreakpointValue(breakpoint, breakpoints)}px)`
  );

  const [matches, setMatches] = useState(() => {
    return typeof window !== 'undefined'
      ? window.matchMedia(query).matches
      : false;
  });

  useEffect(() => {
    const newQuery = `(max-width: ${getBreakpointValue(
      breakpoint,
      breakpoints
    )}px)`;
    newQuery === query || setQuery(newQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakpoint, breakpoints]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    const media = window.matchMedia(query);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
