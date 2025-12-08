import { useQRStore } from '@/stores/qr-store';
import { act } from '@testing-library/react';
import { DEFAULT_CUSTOMIZATION } from '@/lib/constants';

describe('QR Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useQRStore.setState({
      qrType: 'url',
      qrData: null,
      customization: DEFAULT_CUSTOMIZATION,
      qrString: '',
      previewUrl: '',
      isGenerating: false,
      error: null,
    });
  });

  describe('qrType', () => {
    it('should have default type as url', () => {
      expect(useQRStore.getState().qrType).toBe('url');
    });

    it('should update qrType and reset related state', () => {
      act(() => {
        useQRStore.getState().setQRData({ type: 'text', data: { text: 'Hello' } });
        useQRStore.getState().setQRString('encoded');
        useQRStore.getState().setPreviewUrl('data:image/png;base64,...');
      });

      act(() => {
        useQRStore.getState().setQRType('email');
      });

      const state = useQRStore.getState();
      expect(state.qrType).toBe('email');
      expect(state.qrData).toBeNull();
      expect(state.qrString).toBe('');
      expect(state.previewUrl).toBe('');
    });
  });

  describe('qrData', () => {
    it('should update qrData', () => {
      const testData = { type: 'text' as const, data: { text: 'Hello World' } };

      act(() => {
        useQRStore.getState().setQRData(testData);
      });

      expect(useQRStore.getState().qrData).toEqual(testData);
    });
  });

  describe('customization', () => {
    it('should have default customization', () => {
      expect(useQRStore.getState().customization).toEqual(DEFAULT_CUSTOMIZATION);
    });

    it('should partially update customization', () => {
      act(() => {
        useQRStore.getState().setCustomization({
          foregroundColor: '#ff0000',
          size: 512,
        });
      });

      const state = useQRStore.getState();
      expect(state.customization.foregroundColor).toBe('#ff0000');
      expect(state.customization.size).toBe(512);
      expect(state.customization.backgroundColor).toBe(
        DEFAULT_CUSTOMIZATION.backgroundColor
      );
    });

    it('should reset customization to defaults', () => {
      act(() => {
        useQRStore.getState().setCustomization({
          foregroundColor: '#ff0000',
          size: 512,
        });
      });

      act(() => {
        useQRStore.getState().resetCustomization();
      });

      expect(useQRStore.getState().customization).toEqual(DEFAULT_CUSTOMIZATION);
    });
  });

  describe('qrString', () => {
    it('should update qrString', () => {
      act(() => {
        useQRStore.getState().setQRString('WIFI:S:MyNetwork;T:WPA;P:password;;');
      });

      expect(useQRStore.getState().qrString).toBe('WIFI:S:MyNetwork;T:WPA;P:password;;');
    });
  });

  describe('previewUrl', () => {
    it('should update previewUrl', () => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGgo...';

      act(() => {
        useQRStore.getState().setPreviewUrl(dataUrl);
      });

      expect(useQRStore.getState().previewUrl).toBe(dataUrl);
    });
  });

  describe('isGenerating', () => {
    it('should have default value of false', () => {
      expect(useQRStore.getState().isGenerating).toBe(false);
    });

    it('should update isGenerating', () => {
      act(() => {
        useQRStore.getState().setIsGenerating(true);
      });

      expect(useQRStore.getState().isGenerating).toBe(true);

      act(() => {
        useQRStore.getState().setIsGenerating(false);
      });

      expect(useQRStore.getState().isGenerating).toBe(false);
    });
  });

  describe('error', () => {
    it('should have default value of null', () => {
      expect(useQRStore.getState().error).toBeNull();
    });

    it('should update error', () => {
      act(() => {
        useQRStore.getState().setError('Something went wrong');
      });

      expect(useQRStore.getState().error).toBe('Something went wrong');

      act(() => {
        useQRStore.getState().setError(null);
      });

      expect(useQRStore.getState().error).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      // Set various state values
      act(() => {
        useQRStore.getState().setQRType('wifi');
        useQRStore.getState().setQRData({ type: 'wifi', data: { ssid: 'Test', encryption: 'WPA' } });
        useQRStore.getState().setCustomization({ foregroundColor: '#ff0000' });
        useQRStore.getState().setQRString('encoded string');
        useQRStore.getState().setPreviewUrl('data:image/png;base64,...');
        useQRStore.getState().setIsGenerating(true);
        useQRStore.getState().setError('Error');
      });

      // Reset
      act(() => {
        useQRStore.getState().reset();
      });

      const state = useQRStore.getState();
      expect(state.qrType).toBe('url');
      expect(state.qrData).toBeNull();
      expect(state.customization).toEqual(DEFAULT_CUSTOMIZATION);
      expect(state.qrString).toBe('');
      expect(state.previewUrl).toBe('');
      expect(state.isGenerating).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
