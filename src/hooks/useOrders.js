import { useEffect, useState } from 'react';
import { generateOrders } from '../data/generateOrders.js';

/**
 * Loads the order dataset with an explicit loading / success / error lifecycle.
 * A short simulated delay lets the loading state be seen, like a real API call would.
 */
export default function useOrders({ count = 5000, simulatedDelay = 600 } = {}) {
  const [state, setState] = useState({ status: 'loading', orders: [], error: null });

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      try {
        const orders = generateOrders(count);
        if (!cancelled) setState({ status: 'success', orders, error: null });
      } catch (error) {
        if (!cancelled) setState({ status: 'error', orders: [], error });
      }
    }, simulatedDelay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [count, simulatedDelay]);

  return state;
}
