'use client';

import { useCallback, useEffect } from 'react';
import { useQRStore } from '@/stores/qr-store';
import { useHistoryStore } from '@/stores/history-store';
import { useDebounce } from './useDebounce';
import { encodeQRData } from '@/lib/qr/encoder';
import { generateQRWithLogo } from '@/lib/qr/generator';
import { QRData, QRHistoryItem } from '@/types/qr';

export function useQRGenerator() {
  const {
    qrType,
    qrData,
    customization,
    qrString,
    previewUrl,
    isGenerating,
    error,
    setQRType,
    setQRData,
    setCustomization,
    resetCustomization,
    setQRString,
    setPreviewUrl,
    setIsGenerating,
    setError,
    reset,
  } = useQRStore();

  const { addItem } = useHistoryStore();

  // Debounce the QR string for preview generation
  const debouncedQRString = useDebounce(qrString, 300);

  // Generate QR string when data changes
  useEffect(() => {
    if (qrData) {
      try {
        const encoded = encodeQRData(qrData);
        setQRString(encoded);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to encode data');
        setQRString('');
      }
    } else {
      setQRString('');
    }
  }, [qrData, setQRString, setError]);

  // Generate preview when debounced string or customization changes
  useEffect(() => {
    if (!debouncedQRString) {
      setPreviewUrl('');
      return;
    }

    const generatePreview = async () => {
      setIsGenerating(true);
      try {
        const dataUrl = await generateQRWithLogo({
          data: debouncedQRString,
          customization,
        });
        setPreviewUrl(dataUrl);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate QR code');
        setPreviewUrl('');
      } finally {
        setIsGenerating(false);
      }
    };

    generatePreview();
  }, [debouncedQRString, customization, setPreviewUrl, setIsGenerating, setError]);

  // Save to history
  const saveToHistory = useCallback(
    (label?: string) => {
      if (!qrData || !previewUrl) return;

      const historyItem: QRHistoryItem = {
        id: `qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: qrType,
        data: qrData.data,
        customization,
        preview: previewUrl,
        createdAt: new Date().toISOString(),
        label,
      };

      addItem(historyItem);
    },
    [qrData, qrType, customization, previewUrl, addItem]
  );

  // Update QR data
  const updateQRData = useCallback(
    (data: QRData['data']) => {
      setQRData({ type: qrType, data } as QRData);
    },
    [qrType, setQRData]
  );

  // Change QR type
  const changeQRType = useCallback(
    (type: typeof qrType) => {
      setQRType(type);
    },
    [setQRType]
  );

  return {
    // State
    qrType,
    qrData,
    customization,
    qrString,
    previewUrl,
    isGenerating,
    error,

    // Actions
    changeQRType,
    updateQRData,
    setCustomization,
    resetCustomization,
    saveToHistory,
    reset,
  };
}
