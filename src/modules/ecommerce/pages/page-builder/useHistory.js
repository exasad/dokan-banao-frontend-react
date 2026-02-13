import { useCallback, useRef, useState } from 'react';

const MAX_HISTORY = 50;

export default function useHistory(initialState) {
  const [state, setState] = useState(initialState);
  const pastRef = useRef([]);
  const futureRef = useRef([]);

  const set = useCallback((newState) => {
    setState((current) => {
      pastRef.current = [...pastRef.current.slice(-(MAX_HISTORY - 1)), current];
      futureRef.current = [];
      return typeof newState === 'function' ? newState(current) : newState;
    });
  }, []);

  const undo = useCallback(() => {
    setState((current) => {
      if (pastRef.current.length === 0) return current;
      const previous = pastRef.current[pastRef.current.length - 1];
      pastRef.current = pastRef.current.slice(0, -1);
      futureRef.current = [...futureRef.current, current];
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    setState((current) => {
      if (futureRef.current.length === 0) return current;
      const next = futureRef.current[futureRef.current.length - 1];
      futureRef.current = futureRef.current.slice(0, -1);
      pastRef.current = [...pastRef.current, current];
      return next;
    });
  }, []);

  const reset = useCallback((newState) => {
    setState(newState);
    pastRef.current = [];
    futureRef.current = [];
  }, []);

  return {
    state,
    set,
    undo,
    redo,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    reset,
  };
}
