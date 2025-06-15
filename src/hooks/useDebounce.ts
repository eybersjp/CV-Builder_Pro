
import { useEffect } from "react";

// Debounces execution of fn for delay ms after value changes
export function useDebounce<T>(value: T, delay: number, fn: (val: T) => void) {
  useEffect(() => {
    if (value === undefined) return;
    const handler = setTimeout(() => fn(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay, fn]);
}
