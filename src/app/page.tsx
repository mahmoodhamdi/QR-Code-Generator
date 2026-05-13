'use client';

import { useTranslations } from 'next-intl';
import { QRGenerator } from '@/components/qr';
import { StructuredData } from '@/components/seo/StructuredData';
import { PrivacyBadge } from '@/components/privacy/PrivacyBadge';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="space-y-6">
      <StructuredData name={t('title')} description={t('description')} />
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <PrivacyBadge variant="full" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <QRGenerator />
    </div>
  );
}
