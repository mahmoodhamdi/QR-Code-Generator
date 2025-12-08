'use client';

import { useTranslations } from 'next-intl';
import { QRTemplates } from '@/components/qr/QRTemplates';

export default function TemplatesPage() {
  const t = useTranslations('templates');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <QRTemplates />
    </div>
  );
}
