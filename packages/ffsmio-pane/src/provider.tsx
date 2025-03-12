import { PropsWithChildren, useReducer } from 'react';
import { initialState, PaneContext } from './context';
import { createSlice, reducer } from './reducer';

export interface PaneProviderProps {
  horizontal: boolean;
  resizeSize?: number;
  resizeColor?: string;
  resizeHoverColor?: string;
  resizeActiveColor?: string;
}

export function PaneProvider(props: PropsWithChildren<PaneProviderProps>) {
  const {
    children,
    horizontal,
    resizeSize,
    resizeColor,
    resizeHoverColor,
    resizeActiveColor,
  } = props;

  const initial = Object.assign({}, initialState, {
    horizontal,
    resizeSize: resizeSize || initialState.resizeSize,
    resizeColor: resizeColor || initialState.resizeColor,
    resizeHoverColor: resizeHoverColor || initialState.resizeHoverColor,
    resizeActiveColor: resizeActiveColor || initialState.resizeActiveColor,
  });

  const [state, dispatch] = useReducer(reducer, initial);
  const slice = createSlice(dispatch);

  return (
    <PaneContext.Provider value={{ state, ...slice }}>
      {children}
    </PaneContext.Provider>
  );
}
