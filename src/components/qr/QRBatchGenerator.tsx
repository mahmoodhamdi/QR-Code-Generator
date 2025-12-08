'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { QRCodeType, BatchItem, QRCustomization } from '@/types/qr';
import { QR_TYPE_LABELS, DEFAULT_CUSTOMIZATION, SECURITY_LIMITS } from '@/lib/constants';
import { generateQRWithLogo } from '@/lib/qr/generator';
import { encodeQRData } from '@/lib/qr/encoder';
import {
  Upload,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  FileText,
  Trash2,
  Play,
  Pause,
} from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function QRBatchGenerator() {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [qrType, setQRType] = useState<QRCodeType>('url');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rawInput, setRawInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

  // Parse CSV content
  const parseCSV = useCallback((content: string): string[] => {
    const lines = content.split('\n').filter((line) => line.trim());
    // Skip header if present
    const firstLine = lines[0]?.toLowerCase();
    const hasHeader =
      firstLine?.includes('url') ||
      firstLine?.includes('text') ||
      firstLine?.includes('data');

    return (hasHeader ? lines.slice(1) : lines)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, SECURITY_LIMITS.maxBatchSize);
  }, []);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const data = parseCSV(content);

      if (data.length === 0) {
        toast.error('No valid data found in file');
        return;
      }

      const newItems: BatchItem[] = data.map((value, index) => ({
        id: `batch-${Date.now()}-${index}`,
        data: value,
        type: qrType,
        status: 'pending',
      }));

      setItems(newItems);
      toast.success(`Loaded ${newItems.length} items`);
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle manual input
  const handleManualInput = () => {
    const data = rawInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, SECURITY_LIMITS.maxBatchSize);

    if (data.length === 0) {
      toast.error('No valid data entered');
      return;
    }

    const newItems: BatchItem[] = data.map((value, index) => ({
      id: `batch-${Date.now()}-${index}`,
      data: value,
      type: qrType,
      status: 'pending',
    }));

    setItems(newItems);
    setRawInput('');
    toast.success(`Added ${newItems.length} items`);
  };

  // Generate all QR codes
  const generateAll = async () => {
    if (items.length === 0) return;

    setIsGenerating(true);
    setProgress(0);
    abortRef.current = false;

    const customization: QRCustomization = {
      ...DEFAULT_CUSTOMIZATION,
      size: 512,
    };

    for (let i = 0; i < items.length; i++) {
      if (abortRef.current) break;

      const item = items[i];

      setItems((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, status: 'generating' } : p
        )
      );

      try {
        // Create QR data based on type
        let qrData;
        if (qrType === 'url') {
          qrData = { type: 'url' as const, data: { url: item.data } };
        } else {
          qrData = { type: 'text' as const, data: { text: item.data } };
        }

        const encoded = encodeQRData(qrData);
        const preview = await generateQRWithLogo({
          data: encoded,
          customization,
        });

        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, status: 'completed', preview } : p
          )
        );
      } catch (error) {
        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Generation failed',
                }
              : p
          )
        );
      }

      setProgress(((i + 1) / items.length) * 100);

      // Small delay to prevent UI freezing
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setIsGenerating(false);
    toast.success('Batch generation complete');
  };

  // Stop generation
  const stopGeneration = () => {
    abortRef.current = true;
    setIsGenerating(false);
    toast.info('Generation stopped');
  };

  // Download all as ZIP
  const downloadAll = async () => {
    const completedItems = items.filter(
      (item) => item.status === 'completed' && item.preview
    );

    if (completedItems.length === 0) {
      toast.error('No completed QR codes to download');
      return;
    }

    const zip = new JSZip();

    completedItems.forEach((item, index) => {
      if (item.preview) {
        // Convert data URL to binary
        const base64 = item.preview.split(',')[1];
        zip.file(`qr-${index + 1}-${item.data.substring(0, 20)}.png`, base64, {
          base64: true,
        });
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `qr-codes-batch-${Date.now()}.zip`);
    toast.success('Download started');
  };

  // Clear all items
  const clearAll = () => {
    setItems([]);
    setProgress(0);
  };

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const errorCount = items.filter((i) => i.status === 'error').length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
      {/* Left Panel - Input */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Batch Input</CardTitle>
            <CardDescription>
              Upload a CSV file or enter data manually (one per line)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>QR Code Type</Label>
              <Select
                value={qrType}
                onValueChange={(value) => setQRType(value as QRCodeType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">URL / Website</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Upload CSV</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                CSV or TXT file with one item per line. Max {SECURITY_LIMITS.maxBatchSize} items.
              </p>
            </div>

            {/* Manual Input */}
            <div className="space-y-2">
              <Label>Or Enter Manually</Label>
              <Textarea
                placeholder="Enter URLs or text, one per line..."
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="min-h-[150px] font-mono text-sm"
              />
              <Button
                variant="secondary"
                onClick={handleManualInput}
                disabled={!rawInput.trim()}
                className="w-full"
              >
                Add Items
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        {items.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Items ({items.length})
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                    >
                      <span className="text-sm text-muted-foreground w-8">
                        #{index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{item.data}</p>
                        {item.error && (
                          <p className="text-xs text-destructive">{item.error}</p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {item.status === 'pending' && (
                          <div className="w-5 h-5 rounded-full border-2 border-muted" />
                        )}
                        {item.status === 'generating' && (
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        )}
                        {item.status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {item.status === 'error' && (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Panel - Actions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate</CardTitle>
            <CardDescription>
              Generate QR codes for all items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress */}
            {isGenerating && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center">
                  Generating... {Math.round(progress)}%
                </p>
              </div>
            )}

            {/* Stats */}
            {items.length > 0 && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold">{items.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                  <p className="text-xs text-muted-foreground">Errors</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              {isGenerating ? (
                <Button
                  variant="destructive"
                  onClick={stopGeneration}
                  className="w-full"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Stop Generation
                </Button>
              ) : (
                <Button
                  onClick={generateAll}
                  disabled={items.length === 0}
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Generate All
                </Button>
              )}

              <Button
                variant="outline"
                onClick={downloadAll}
                disabled={completedCount === 0}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download as ZIP
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Grid */}
        {completedCount > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-3 gap-2">
                  {items
                    .filter((item) => item.status === 'completed' && item.preview)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="aspect-square rounded-lg overflow-hidden border bg-white"
                      >
                        <img
                          src={item.preview}
                          alt="QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
