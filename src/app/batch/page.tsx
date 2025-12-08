'use client';

import { useTranslations } from 'next-intl';
import { QRBatchGenerator } from '@/components/qr/QRBatchGenerator';

export default function BatchPage() {
  const t = useTranslations('batch');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <QRBatchGenerator />
    </div>
  );
}
