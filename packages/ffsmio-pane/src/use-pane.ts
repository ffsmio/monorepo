import { useContext } from 'react';
import { PaneContext } from './context';

export function usePane() {
  const context = useContext(PaneContext);

  if (!context) {
    throw new Error('usePane must be used within a PaneProvider');
  }

  return {
    ...context.state,
    updateContainerSize: context.updateContainerSize,
    updateItemSize: context.updateItemSize,
  };
}
