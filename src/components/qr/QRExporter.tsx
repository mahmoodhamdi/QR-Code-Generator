'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQRStore } from '@/stores/qr-store';
import { useHistoryStore } from '@/stores/history-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  exportAsPNG,
  exportAsSVG,
  exportAsPDF,
  exportAsJPEG,
  exportAsWebP,
  copyToClipboard,
  shareQRCode,
  printQRCode,
} from '@/lib/qr/exporter';
import { ExportFormat, QRHistoryItem } from '@/types/qr';
import {
  Download,
  ChevronDown,
  Copy,
  Share2,
  Printer,
  FileImage,
  FileCode,
  FileText,
  Loader2,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

export function QRExporter() {
  const { qrString, customization, previewUrl, qrType, qrData } = useQRStore();
  const { addItem } = useHistoryStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const t = useTranslations('exporter');
  const tGen = useTranslations('generator');

  const isDisabled = !qrString || !previewUrl;

  const handleExport = async (format: ExportFormat) => {
    if (isDisabled) return;

    setIsExporting(true);
    setExportingFormat(format);

    try {
      const params = {
        data: qrString,
        customization,
        filename: `qrcode-${Date.now()}`,
      };

      switch (format) {
        case 'png':
          await exportAsPNG(params);
          break;
        case 'svg':
          await exportAsSVG(params);
          break;
        case 'pdf':
          await exportAsPDF(params);
          break;
        case 'jpeg':
          await exportAsJPEG(params);
          break;
        case 'webp':
          await exportAsWebP(params);
          break;
      }

      toast.success(tGen('exportSuccess', { format: format.toUpperCase() }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tGen('exportFailed'));
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const handleCopy = async () => {
    if (isDisabled) return;

    setIsExporting(true);
    setExportingFormat('copy');

    try {
      await copyToClipboard({
        data: qrString,
        customization,
      });
      toast.success(tGen('copySuccess'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tGen('copyFailed'));
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const handleShare = async () => {
    if (isDisabled) return;

    setIsExporting(true);
    setExportingFormat('share');

    try {
      await shareQRCode({
        data: qrString,
        customization,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not supported')) {
        toast.error(tGen('shareNotSupported'));
      }
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const handlePrint = () => {
    if (isDisabled) return;

    try {
      printQRCode(previewUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : tGen('printFailed'));
    }
  };

  const handleSaveToHistory = () => {
    if (isDisabled || !qrData) return;

    const historyItem: QRHistoryItem = {
      id: `qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: qrType,
      data: qrData.data,
      customization,
      preview: previewUrl,
      createdAt: new Date().toISOString(),
    };

    addItem(historyItem);
    toast.success(tGen('savedToHistory'));
  };

  const exportOptions = [
    { format: 'png' as ExportFormat, label: 'PNG', icon: FileImage, desc: t('pngDesc') },
    { format: 'svg' as ExportFormat, label: 'SVG', icon: FileCode, desc: t('svgDesc') },
    { format: 'pdf' as ExportFormat, label: 'PDF', icon: FileText, desc: t('pdfDesc') },
    { format: 'jpeg' as ExportFormat, label: 'JPEG', icon: FileImage, desc: t('jpegDesc') },
    { format: 'webp' as ExportFormat, label: 'WebP', icon: FileImage, desc: t('webpDesc') },
  ];

  return (
    <div className="space-y-3">
      {/* Main Download Button with Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full" size="lg" disabled={isDisabled || isExporting}>
            {isExporting && exportingFormat && !['copy', 'share'].includes(exportingFormat) ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                {tGen('exporting')}
              </>
            ) : (
              <>
                <Download className="me-2 h-4 w-4" />
                {t('download')}
                <ChevronDown className="ms-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {exportOptions.map(({ format, label, icon: Icon, desc }) => (
            <DropdownMenuItem
              key={format}
              onClick={() => handleExport(format)}
              disabled={isExporting}
            >
              <Icon className="me-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>{label}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={isDisabled || isExporting}
        >
          {exportingFormat === 'copy' ? (
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
          ) : (
            <Copy className="me-2 h-4 w-4" />
          )}
          {t('copy')}
        </Button>

        <Button
          variant="outline"
          onClick={handleShare}
          disabled={isDisabled || isExporting}
        >
          {exportingFormat === 'share' ? (
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
          ) : (
            <Share2 className="me-2 h-4 w-4" />
          )}
          {t('share')}
        </Button>

        <Button
          variant="outline"
          onClick={handlePrint}
          disabled={isDisabled}
        >
          <Printer className="me-2 h-4 w-4" />
          {t('print')}
        </Button>

        <Button
          variant="outline"
          onClick={handleSaveToHistory}
          disabled={isDisabled}
        >
          <Save className="me-2 h-4 w-4" />
          {t('save')}
        </Button>
      </div>
    </div>
  );
}
