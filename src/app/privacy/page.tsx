import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Lock, EyeOff, Code2, Server } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta');
  return {
    title: t('privacyTitle'),
    description: t('privacyDescription'),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');

  const pillars = [
    { icon: Server, title: t('pillar1Title'), body: t('pillar1Body') },
    { icon: EyeOff, title: t('pillar2Title'), body: t('pillar2Body') },
    { icon: Lock, title: t('pillar3Title'), body: t('pillar3Body') },
    { icon: Code2, title: t('pillar4Title'), body: t('pillar4Body') },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-4">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{t('badgeShort')}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t('pageTitle')}</h1>
        <p className="text-muted-foreground leading-relaxed">{t('intro')}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t('pillarsTitle')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-lg border bg-card p-4 transition hover:border-primary/40"
            >
              <Icon className="mb-2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-lg border bg-muted/30 p-5">
        <h2 className="text-xl font-semibold">{t('techTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('techIntro')}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t('scopeTitle')}</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm leading-relaxed text-muted-foreground rtl:pr-6 rtl:pl-0">
          <li>{t('scopeItem1')}</li>
          <li>{t('scopeItem2')}</li>
          <li>{t('scopeItem3')}</li>
        </ul>
        <p className="text-sm font-medium">{t('scopeOutro')}</p>
      </section>

      <section className="space-y-3 rounded-lg border border-dashed p-5">
        <h2 className="text-xl font-semibold">{t('trustTitle')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{t('trustBody')}</p>
      </section>
    </div>
  );
}
