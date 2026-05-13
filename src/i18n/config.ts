export const locales = ['en', 'ar', 'fr', 'es', 'pt', 'de', 'tr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  de: 'Deutsch',
  tr: 'Türkçe',
};

export const rtlLocales: Locale[] = ['ar'];

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
