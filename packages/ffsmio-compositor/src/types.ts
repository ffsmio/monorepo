import { ReactNode } from 'react';

export type ObjectProps<O = {}> = {
  [K in keyof O]: O[K];
};

export type RenderFunction<Props extends ObjectProps = ObjectProps> = (
  props: Props
) => ReactNode;
