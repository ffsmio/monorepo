"use client";

import { forwardRef, PropsWithChildren } from "react";
import { PaneProvider, PaneProviderProps } from "./provider";
import { PaneContainer } from "./container";

export type PaneProps = Partial<PaneProviderProps> & {
  className?: string;
};

export const Pane = forwardRef<HTMLDivElement, PropsWithChildren<PaneProps>>(
  function Pane(props, ref) {
    const { children, horizontal = false, className, ...rest } = props;

    return (
      <PaneProvider {...rest} horizontal={horizontal}>
        <PaneContainer ref={ref} className={className}>
          {children}
        </PaneContainer>
      </PaneProvider>
    );
  }
);
