import {
  createContext,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';
import {
  createSlice,
  CreateSliceOptions,
  PayloadAction,
  SliceReducers,
} from './create-slice';
import { mergeObject } from '@ffsm/utils/merge-object';

export type Store<State, Reducers extends SliceReducers<State>> = StoreActions<
  State,
  Reducers
> & {
  state: State;
};

export type StoreActions<State, Reducers extends SliceReducers<State>> = {
  [K in keyof Reducers]: Reducers[K] extends (state: State) => void
    ? () => void
    : Reducers[K] extends (state: State, action: PayloadAction<infer P>) => void
      ? (payload: P) => void
      : Reducers[K] extends (state: State, ...args: infer A) => void
        ? (...args: A) => void
        : () => void;
};

export type StoreContext<State, Reducers extends SliceReducers<State>> = {
  state: State;
} & StoreActions<State, Reducers>;

export function createStore<State, Reducers extends SliceReducers<State>>(
  options: CreateSliceOptions<State, Reducers>
) {
  const slice = createSlice(options);

  const defaultActions = mergeObject(
    ...Object.keys(slice.actions).map((key) => ({
      [key]: () => {
        console.log('called');
      },
    }))
  ) as StoreActions<State, Reducers>;

  type Reducer = (prevState: State, action: PayloadAction) => State;

  const Context = createContext({
    state: options.initialState,
    ...defaultActions,
  });

  function useStoreReducer() {
    const [state, dispatch] = useReducer(
      slice.reducer as Reducer,
      options.initialState
    );

    const actions = mergeObject(
      ...Object.entries(slice.actions).map(([key, action]) => ({
        [key]: (...args: unknown[]) => dispatch(action(...args)),
      }))
    );

    return mergeObject({ state }, actions) as StoreContext<State, Reducers>;
  }

  function StoreProvider(props: PropsWithChildren<{}>) {
    const { children } = props;
    const value = useStoreReducer();

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useStore() {
    const context = useContext(Context);

    if (!context) {
      throw new Error('useStore must be used within a StoreProvider');
    }

    const { state, ...methods } = context;

    return mergeObject(
      state as Record<string, unknown>,
      methods as Record<string, unknown>
    ) as State & StoreActions<State, Reducers>;
  }

  return {
    useStore,
    Provider: StoreProvider,
  };
}
