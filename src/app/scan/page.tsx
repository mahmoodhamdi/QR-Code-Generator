'use client';

import { useTranslations } from 'next-intl';
import { QRScanner } from '@/components/qr/QRScanner';

export default function ScanPage() {
  const t = useTranslations('scanner');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <QRScanner />
    </div>
  );
}
