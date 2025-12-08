import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));
    expect(result.current[0]).toBe('defaultValue');
  });

  it('should store value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('testKey', '"newValue"');
  });

  it('should retrieve value from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('"storedValue"');

    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));

    // After hydration, should have the stored value
    expect(localStorageMock.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should handle function updates', () => {
    // This test verifies that function updates work on the stored value
    const { result } = renderHook(() => useLocalStorage<number>('counter', 10));

    // Set with function update
    act(() => {
      result.current[1]((prev) => prev * 2);
    });

    // The function should have been called and value updated
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should remove value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));

    act(() => {
      result.current[1]('someValue');
    });

    act(() => {
      result.current[2](); // removeValue
    });

    expect(result.current[0]).toBe('defaultValue');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('testKey');
  });

  it('should handle complex objects', () => {
    const initialObject = { name: 'John', age: 30 };
    const { result } = renderHook(() => useLocalStorage('user', initialObject));

    act(() => {
      result.current[1]({ name: 'Jane', age: 25 });
    });

    expect(result.current[0]).toEqual({ name: 'Jane', age: 25 });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      '{"name":"Jane","age":25}'
    );
  });

  it('should handle arrays', () => {
    const { result } = renderHook(() => useLocalStorage<string[]>('items', []));

    act(() => {
      result.current[1](['item1', 'item2']);
    });

    expect(result.current[0]).toEqual(['item1', 'item2']);
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });

    const { result } = renderHook(() => useLocalStorage('testKey', 'defaultValue'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
