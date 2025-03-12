import { Dispatch } from 'react';
import { initialState, PaneItemState, PaneState } from './context';

export enum PaneActionTypes {
  UPDATE_CONTAINER_SIZE = 'pane/UPDATE_CONTAINER_SIZE',
  UPDATE_ITEM_SIZE = 'pane/UPDATE_ITEM_SIZE',
}

export interface PaneUpdateContainerSizeAction {
  type: PaneActionTypes.UPDATE_CONTAINER_SIZE;
  payload: {
    width: number;
    height: number;
  };
}

export interface PaneUpdateItemSizeAction {
  type: PaneActionTypes.UPDATE_ITEM_SIZE;
  payload: {
    index: number;
    width: number;
    height: number;
  };
}

export type PaneAction =
  | PaneUpdateContainerSizeAction
  | PaneUpdateItemSizeAction;

function cloneState(state: PaneState) {
  const nextState = { ...state };

  nextState.items = Object.keys(state.items).reduce((acc, key) => {
    acc[key as unknown as number] = {
      ...state.items[key as unknown as number],
    };
    return acc;
  }, {} as Record<number, PaneItemState>);

  return nextState;
}

export const reducer = (state = initialState, action: PaneAction) => {
  const nextState = cloneState(state);

  switch (action.type) {
    case PaneActionTypes.UPDATE_CONTAINER_SIZE:
      nextState.containerWidth = action.payload.width;
      nextState.containerHeight = action.payload.height;

      if (nextState.horizontal) {
        Object.keys(nextState.items).forEach((key) => {
          nextState.items[key as unknown as number] = {
            width: nextState.containerWidth,
            height: nextState.items[key as unknown as number].height,
          };
        });
      } else {
        Object.keys(nextState.items).forEach((key) => {
          nextState.items[key as unknown as number] = {
            width: nextState.items[key as unknown as number].width,
            height: nextState.containerHeight,
          };
        });
      }

      return nextState;

    case PaneActionTypes.UPDATE_ITEM_SIZE:
      nextState.items[action.payload.index] = {
        width: action.payload.width,
        height: action.payload.height,
      };
      return nextState;

    default:
      return nextState;
  }
};

export function createSlice(dispatch: Dispatch<PaneAction>) {
  return {
    updateContainerSize(width: number, height: number) {
      dispatch({
        type: PaneActionTypes.UPDATE_CONTAINER_SIZE,
        payload: { width, height },
      });
    },
    updateItemSize(index: number, width: number, height: number) {
      dispatch({
        type: PaneActionTypes.UPDATE_ITEM_SIZE,
        payload: { index, width, height },
      });
    },
  };
}
