'use client';

import { useState, useCallback, useRef, useEffect, useSyncExternalStore } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface ScanResult {
  text: string;
  format: string;
}

interface UseQRScannerOptions {
  onScan?: (result: ScanResult) => void;
  onError?: (error: string) => void;
}

// Camera permission store for useSyncExternalStore
let permissionState: 'granted' | 'denied' | 'prompt' = 'prompt';
const permissionListeners: Set<() => void> = new Set();

function subscribeToPermission(callback: () => void) {
  permissionListeners.add(callback);

  // Initialize permission check on first subscription
  if (permissionListeners.size === 1 && typeof navigator !== 'undefined' && navigator.permissions) {
    navigator.permissions.query({ name: 'camera' as PermissionName })
      .then((permission) => {
        permissionState = permission.state as 'granted' | 'denied' | 'prompt';
        permissionListeners.forEach(listener => listener());

        permission.onchange = () => {
          permissionState = permission.state as 'granted' | 'denied' | 'prompt';
          permissionListeners.forEach(listener => listener());
        };
      })
      .catch(() => {
        // Permissions API might not be available
        permissionState = 'prompt';
      });
  }

  return () => {
    permissionListeners.delete(callback);
  };
}

function getPermissionSnapshot() {
  return permissionState;
}

function getServerPermissionSnapshot() {
  return 'prompt' as const;
}

function updatePermissionState(newState: 'granted' | 'denied' | 'prompt') {
  permissionState = newState;
  permissionListeners.forEach(listener => listener());
}

export function useQRScanner(options: UseQRScannerOptions = {}) {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use useSyncExternalStore instead of useState + useEffect for permission
  const cameraPermission = useSyncExternalStore(
    subscribeToPermission,
    getPermissionSnapshot,
    getServerPermissionSnapshot
  );

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = 'qr-reader';

  // Stop camera scanning - defined first to avoid reference before declaration
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
      updatePermissionState('granted');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start camera';
      setError(errorMessage);
      options.onError?.(errorMessage);

      if (errorMessage.includes('Permission')) {
        updatePermissionState('denied');
      }
    }
  }, [options, stopScanning]);

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
