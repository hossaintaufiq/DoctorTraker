/**
 * Converts a filter and pagination state object into a clean query string.
 * Filters out undefined, null, empty strings, and 'All' sentinel values.
 */
export function buildFilterQueryString(filters: Record<string, any>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "" || value === "All") {
      continue;
    }
    params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Standard debounce utility that cancels prior timers and invokes the callback
 * once the delay has elapsed.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): { (...args: Parameters<T>): void; cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
