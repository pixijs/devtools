import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    // Execute the callback immediately before setting the interval
    if (delay !== null) {
      tick(); // Execute callback immediately
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]); // Execute this effect when `delay` changes
};
