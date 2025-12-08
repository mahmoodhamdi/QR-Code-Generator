import { create } from 'zustand';
import { QRCodeType, QRCustomization, QRData } from '@/types/qr';
import { DEFAULT_CUSTOMIZATION } from '@/lib/constants';

interface QRState {
  // Current QR type
  qrType: QRCodeType;
  setQRType: (type: QRCodeType) => void;

  // Current QR data
  qrData: QRData | null;
  setQRData: (data: QRData) => void;

  // Customization options
  customization: QRCustomization;
  setCustomization: (customization: Partial<QRCustomization>) => void;
  resetCustomization: () => void;

  // Generated QR string
  qrString: string;
  setQRString: (str: string) => void;

  // Preview URL (data URL of generated QR)
  previewUrl: string;
  setPreviewUrl: (url: string) => void;

  // Loading state
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;

  // Reset all state
  reset: () => void;
}

const initialState = {
  qrType: 'url' as QRCodeType,
  qrData: null,
  customization: DEFAULT_CUSTOMIZATION,
  qrString: '',
  previewUrl: '',
  isGenerating: false,
  error: null,
};

export const useQRStore = create<QRState>((set) => ({
  ...initialState,

  setQRType: (type) => set({ qrType: type, qrData: null, qrString: '', previewUrl: '' }),

  setQRData: (data) => set({ qrData: data }),

  setCustomization: (customization) =>
    set((state) => ({
      customization: { ...state.customization, ...customization },
    })),

  resetCustomization: () => set({ customization: DEFAULT_CUSTOMIZATION }),

  setQRString: (str) => set({ qrString: str }),

  setPreviewUrl: (url) => set({ previewUrl: url }),

  setIsGenerating: (loading) => set({ isGenerating: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
