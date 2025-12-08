'use client';

import { useCallback, useRef, useState } from 'react';
import { useQRScanner } from '@/hooks/useQRScanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Camera,
  Upload,
  X,
  CheckCircle,
  Copy,
  ExternalLink,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function QRScanner() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleScan = useCallback((result: { text: string; format: string }) => {
    toast.success('QR code scanned successfully!');
  }, []);

  const handleError = useCallback((error: string) => {
    toast.error(error);
  }, []);

  const {
    isScanning,
    result,
    error,
    cameraPermission,
    scannerElementId,
    startScanning,
    stopScanning,
    scanFromFile,
    clearResult,
    clearError,
  } = useQRScanner({
    onScan: handleScan,
    onError: handleError,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      scanFromFile(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        scanFromFile(file);
      }
    },
    [scanFromFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(result.text);
      toast.success('Copied to clipboard');
    }
  };

  const openResult = () => {
    if (result) {
      try {
        const url = new URL(result.text);
        window.open(url.href, '_blank', 'noopener,noreferrer');
      } catch {
        toast.error('Result is not a valid URL');
      }
    }
  };

  const isURL = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Scanner Area */}
      <Card>
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>
            Use your camera or upload an image to scan a QR code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera Scanner */}
          <div
            id={scannerElementId}
            className={`relative aspect-square bg-muted rounded-lg overflow-hidden ${
              isScanning ? 'block' : 'hidden'
            }`}
          />

          {/* Placeholder when not scanning */}
          {!isScanning && !result && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative aspect-square bg-muted rounded-lg flex flex-col items-center justify-center gap-4 border-2 border-dashed transition-colors
                ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              `}
            >
              <div className="p-4 rounded-full bg-background">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-medium">Ready to scan</p>
                <p className="text-sm text-muted-foreground">
                  Start camera or drop an image here
                </p>
              </div>
            </div>
          )}

          {/* Result Display */}
          <AnimatePresence>
            {result && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center gap-4 p-6"
              >
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-medium">QR Code Scanned!</p>
                  <p className="text-xs text-muted-foreground">Format: {result.format}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Scan Error</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {isScanning ? (
              <Button variant="destructive" onClick={stopScanning} className="col-span-2">
                <X className="mr-2 h-4 w-4" />
                Stop Camera
              </Button>
            ) : (
              <>
                <Button onClick={startScanning} disabled={cameraPermission === 'denied'}>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {cameraPermission === 'denied' && (
            <p className="text-sm text-destructive text-center">
              Camera permission denied. Please enable camera access in your browser settings.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Result Card */}
      <Card>
        <CardHeader>
          <CardTitle>Scan Result</CardTitle>
          <CardDescription>
            The decoded content from your QR code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <>
              <div className="space-y-2">
                <Label>Content</Label>
                <div className="relative">
                  <textarea
                    readOnly
                    value={result.text}
                    className="w-full min-h-[200px] p-3 rounded-lg border bg-muted/50 text-sm font-mono resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={copyResult} className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                {isURL(result.text) && (
                  <Button variant="outline" onClick={openResult}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open URL
                  </Button>
                )}
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  clearResult();
                  clearError();
                }}
                className="w-full"
              >
                Scan Another
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Camera className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium">No Result Yet</p>
              <p className="text-sm text-muted-foreground">
                Scan a QR code to see the result here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
