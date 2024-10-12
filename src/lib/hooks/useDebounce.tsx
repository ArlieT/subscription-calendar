import { useRef, useCallback } from 'react';

type CallbackFunction<T extends any[]> = (...args: T) => void;

const useDebounce = <T extends any[]>(
  callback: CallbackFunction<T>,
  delay: number
) => {
  const timeoutRef = useRef<number | null>(null);

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

export default useDebounce;
