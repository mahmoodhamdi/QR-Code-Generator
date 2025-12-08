'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useQRGenerator } from '@/hooks/useQRGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRTypeSelector } from './QRTypeSelector';
import { QRFormRenderer } from './QRFormRenderer';
import { QRPreview } from './QRPreview';
import { QRCustomizer } from './QRCustomizer';
import { QRExporter } from './QRExporter';

export function QRGenerator() {
  const { qrType, changeQRType, updateQRData } = useQRGenerator();
  const t = useTranslations('generator');
  const tTypes = useTranslations('qrTypes');

  const handleDataChange = useCallback(
    (data: Record<string, unknown>) => {
      updateQRData(data);
    },
    [updateQRData]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
      {/* Left Panel - Form */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('createTitle')}</CardTitle>
            <CardDescription>
              {t('createDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type Selector */}
            <QRTypeSelector value={qrType} onChange={changeQRType} />

            {/* Dynamic Form */}
            <div className="min-h-[200px]">
              <h3 className="text-lg font-medium mb-4">{tTypes(qrType)}</h3>
              <QRFormRenderer type={qrType} onDataChange={handleDataChange} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Preview & Options */}
      <div className="space-y-6">
        {/* Preview */}
        <QRPreview />

        {/* Export Options */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t('exportTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <QRExporter />
          </CardContent>
        </Card>

        {/* Customization */}
        <Card>
          <CardContent className="pt-6">
            <QRCustomizer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
