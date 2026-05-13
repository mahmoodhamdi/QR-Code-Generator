import { act } from '@testing-library/react';
import { useBrandKitStore } from '@/stores/brand-kit-store';
import type { QRCustomization } from '@/types/qr';

const baseCustomization: QRCustomization = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  gradientType: 'none',
  gradientColors: ['#000', '#fff'],
  patternStyle: 'squares',
  cornerStyle: 'square',
  logoSize: 20,
  size: 256,
  errorCorrection: 'M',
  margin: 4,
};

beforeAll(() => {
  if (!('randomUUID' in crypto)) {
    Object.defineProperty(crypto, 'randomUUID', {
      value: () => '00000000-0000-0000-0000-' + Math.random().toString(16).slice(2, 14).padEnd(12, '0'),
      configurable: true,
    });
  }
});

describe('useBrandKitStore', () => {
  beforeEach(() => {
    act(() => useBrandKitStore.setState({ kits: [], activeKitId: null }));
  });

  it('saves a new kit and returns its id', () => {
    let id = '';
    act(() => {
      id = useBrandKitStore.getState().saveKit({
        name: 'Acme Corp',
        primaryColor: '#1e40af',
        secondaryColor: '#eff6ff',
        patternStyle: 'rounded',
        cornerStyle: 'rounded',
      });
    });
    const state = useBrandKitStore.getState();
    expect(state.kits).toHaveLength(1);
    expect(state.kits[0].id).toBe(id);
    expect(state.kits[0].name).toBe('Acme Corp');
  });

  it('updates an existing kit', () => {
    let id = '';
    act(() => {
      id = useBrandKitStore.getState().saveKit({
        name: 'Old name',
        primaryColor: '#000',
        secondaryColor: '#fff',
        patternStyle: 'squares',
        cornerStyle: 'square',
      });
    });
    act(() => useBrandKitStore.getState().updateKit(id, { name: 'New name' }));
    expect(useBrandKitStore.getState().kits[0].name).toBe('New name');
  });

  it('deletes a kit and clears active selection', () => {
    let id = '';
    act(() => {
      id = useBrandKitStore.getState().saveKit({
        name: 'temp',
        primaryColor: '#000',
        secondaryColor: '#fff',
        patternStyle: 'squares',
        cornerStyle: 'square',
      });
    });
    act(() => useBrandKitStore.getState().setActive(id));
    act(() => useBrandKitStore.getState().deleteKit(id));
    const state = useBrandKitStore.getState();
    expect(state.kits).toHaveLength(0);
    expect(state.activeKitId).toBeNull();
  });

  it('applies kit to a customization', () => {
    let id = '';
    act(() => {
      id = useBrandKitStore.getState().saveKit({
        name: 'Brand',
        primaryColor: '#aa0000',
        secondaryColor: '#fff8f8',
        patternStyle: 'dots',
        cornerStyle: 'extra-rounded',
        logo: 'data:image/png;base64,xxx',
      });
    });
    const result = useBrandKitStore.getState().applyToCustomization(id, baseCustomization);
    expect(result).toMatchObject({
      foregroundColor: '#aa0000',
      backgroundColor: '#fff8f8',
      patternStyle: 'dots',
      cornerStyle: 'extra-rounded',
      logo: 'data:image/png;base64,xxx',
    });
  });

  it('returns null when applying an unknown kit', () => {
    const result = useBrandKitStore.getState().applyToCustomization('does-not-exist', baseCustomization);
    expect(result).toBeNull();
  });
});
