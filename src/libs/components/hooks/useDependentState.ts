import { useState, useEffect } from 'react';

/**
 * React useState hook with dependencies.
 * Updates a state when dependency value changes.
 */
export function useDependentState<D>(dependency: D): [D, (data: D) => void] {
  const [state, setState] = useState<D>(dependency);

  useEffect(() => {
    setState(dependency);
  }, [dependency]);

  return [state, setState];
}