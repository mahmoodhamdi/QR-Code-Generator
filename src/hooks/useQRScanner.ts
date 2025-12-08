'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';

interface ScanResult {
  text: string;
  format: string;
}

interface UseQRScannerOptions {
  onScan?: (result: ScanResult) => void;
  onError?: (error: string) => void;
}

export function useQRScanner(options: UseQRScannerOptions = {}) {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = 'qr-reader';

  // Check camera permission
  const checkPermission = useCallback(async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(permission.state as 'granted' | 'denied' | 'prompt');

      permission.onchange = () => {
        setCameraPermission(permission.state as 'granted' | 'denied' | 'prompt');
      };
    } catch {
      // Permissions API might not be available
      setCameraPermission('prompt');
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // Start camera scanning
  const startScanning = useCallback(async () => {
    if (scannerRef.current) {
      await stopScanning();
    }

    try {
      setError(null);
      setResult(null);

      const scanner = new Html5Qrcode(scannerElementId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText, decodedResult) => {
          const scanResult: ScanResult = {
            text: decodedText,
            format: decodedResult.result.format?.formatName || 'QR_CODE',
          };
          setResult(scanResult);
          options.onScan?.(scanResult);
          stopScanning();
        },
        () => {
          // QR code not found in frame - this is normal, don't show error
        }
      );

      setIsScanning(true);
      setCameraPermission('granted');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start camera';
      setError(errorMessage);
      options.onError?.(errorMessage);

      if (errorMessage.includes('Permission')) {
        setCameraPermission('denied');
      }
    }
  }, [options]);

  // Stop camera scanning
  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {
        // Scanner might already be stopped
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  // Scan from file
  const scanFromFile = useCallback(
    async (file: File) => {
      try {
        setError(null);
        setResult(null);

        const scanner = new Html5Qrcode(scannerElementId);

        const decodedText = await scanner.scanFile(file, true);
        const scanResult: ScanResult = {
          text: decodedText,
          format: 'QR_CODE',
        };

        setResult(scanResult);
        options.onScan?.(scanResult);

        await scanner.clear();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to scan QR code from image';
        setError(errorMessage);
        options.onError?.(errorMessage);
      }
    },
    [options]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return {
    isScanning,
    result,
    error,
    cameraPermission,
    scannerElementId,
    startScanning,
    stopScanning,
    scanFromFile,
    clearResult: () => setResult(null),
    clearError: () => setError(null),
  };
}
