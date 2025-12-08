import { useState, useCallback, useSyncExternalStore } from 'react';

// Helper to safely get value from localStorage
function getStorageValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Use useSyncExternalStore to avoid setState-in-effect warning
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return getStorageValue(key, initialValue);
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

  // This gives us the hydrated value from localStorage
  const hydratedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Local state for immediate updates
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hasLocalUpdate, setHasLocalUpdate] = useState(false);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const currentValue = hasLocalUpdate ? storedValue : hydratedValue;
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        setStoredValue(valueToStore);
        setHasLocalUpdate(true);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, hydratedValue, hasLocalUpdate]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      setHasLocalUpdate(true);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  const finalValue = hasLocalUpdate ? storedValue : hydratedValue;
  return [finalValue, setValue, removeValue];
}
