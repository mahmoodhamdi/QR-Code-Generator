'use client';

import { useLocale } from 'next-intl';
import { brand } from '@/lib/brand';
import { PrivacyBadge } from '@/components/privacy/PrivacyBadge';

export function VerticalHero() {
  const locale = useLocale();
  const lang: 'en' | 'ar' = locale === 'ar' ? 'ar' : 'en';

  if (brand.slug === 'base') return null;

  return (
    <section className="space-y-4 rounded-2xl border bg-gradient-to-br from-primary/5 to-secondary/5 p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <PrivacyBadge />
      </div>
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
        {brand.productName[lang]}
      </h2>
      <p className="text-sm text-muted-foreground md:text-base leading-relaxed max-w-2xl">
        {brand.hero[lang]}
      </p>
      {brand.bullets && (
        <ul className="grid gap-2 text-sm md:grid-cols-2">
          {brand.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 flex-none rounded-full bg-primary" aria-hidden />
              <span>{b[lang]}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
