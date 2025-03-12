"use client";

import { createContext } from "react";

export interface PaneItemState {
  width: number;
  height: number;
}

export interface PaneState {
  horizontal: boolean;
  containerWidth: number;
  containerHeight: number;
  items: Record<number, PaneItemState>;
  resizeSize: number;
  resizeColor: string;
  resizeHoverColor: string;
  resizeActiveColor: string;
}

export interface PaneValue {
  state: PaneState;
  updateContainerSize(width: number, height: number): void;
  updateItemSize(index: number, width: number, height: number): void;
}

export const initialState: PaneState = {
  horizontal: false,
  containerWidth: 0,
  containerHeight: 0,
  items: {},
  resizeSize: 4,
  resizeColor: 'transparent',
  resizeHoverColor: '#93C5FD',
  resizeActiveColor: '#60A5FA',
};

export const PaneContext = createContext<PaneValue>({
  state: initialState,
  updateContainerSize: () => {},
  updateItemSize: () => {},
});
