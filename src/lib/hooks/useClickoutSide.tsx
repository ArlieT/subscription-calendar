import { useRef, useEffect, useCallback } from 'react';

type TCallback = (e: MouseEvent) => void;

const useClickOutside = <T extends HTMLElement>(callback: TCallback) => {
  const ref = useRef<T>(null);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const el = ref?.current;
      if (!el) {
        return;
      }
      console.log(el?.id);
      //do noting if the target is self, descendant
      if (el.contains(e.target as Node)) {
        return;
      }

      callback(e);
    },
    [callback]
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return ref;
};

export default useClickOutside;
