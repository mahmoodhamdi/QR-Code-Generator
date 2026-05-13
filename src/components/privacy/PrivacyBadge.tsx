'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrivacyBadgeProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function PrivacyBadge({ variant = 'compact', className }: PrivacyBadgeProps) {
  const t = useTranslations('privacy');

  return (
    <Link
      href="/privacy"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40',
        className
      )}
      aria-label={t('badgeLong')}
    >
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{t('badgeShort')}</span>
      {variant === 'full' && (
        <span className="text-muted-foreground hidden sm:inline">— {t('badgeLong')}</span>
      )}
    </Link>
  );
}
