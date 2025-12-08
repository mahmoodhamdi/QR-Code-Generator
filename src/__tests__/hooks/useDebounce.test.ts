import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated' });
    expect(result.current).toBe('initial'); // Still old value

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'change1' });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('initial');

    rerender({ value: 'change2' });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('initial');

    rerender({ value: 'change3' });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('change3');
  });

  it('should use custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('updated');
  });

  it('should handle different value types', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: { count: 0 } } }
    );

    expect(result.current).toEqual({ count: 0 });

    rerender({ value: { count: 1 } });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toEqual({ count: 1 });
  });
});
