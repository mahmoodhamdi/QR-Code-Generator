import { act } from '@testing-library/react';
import { useThemeStore } from '@/stores/theme-store';

describe('useThemeStore', () => {
  beforeEach(() => {
    act(() => {
      useThemeStore.setState({ theme: 'system' });
    });
  });

  it('initialises with system theme', () => {
    expect(useThemeStore.getState().theme).toBe('system');
  });

  it('updates to light', () => {
    act(() => useThemeStore.getState().setTheme('light'));
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('updates to dark', () => {
    act(() => useThemeStore.getState().setTheme('dark'));
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('resets to system', () => {
    act(() => useThemeStore.getState().setTheme('dark'));
    act(() => useThemeStore.getState().setTheme('system'));
    expect(useThemeStore.getState().theme).toBe('system');
  });
});
