import { useEffect, useState } from 'react';

/**
 * Returns `value` only after it has stopped changing for `delay` milliseconds.
 * Keeps expensive filtering from running on every keystroke.
 */
export default function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
