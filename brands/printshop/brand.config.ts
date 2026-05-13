import type { BrandConfig } from '../types';

export const brand: BrandConfig = {
  slug: 'printshop',
  productName: { en: 'PrintShopQR', ar: 'مطبعة QR' },
  tagline: {
    en: 'Bulk QR generation for print shops',
    ar: 'توليد QR بالجملة للمطابع',
  },
  hero: {
    en: 'Generate hundreds of QR codes from a CSV with per-row customisation, export as print-ready PDF with CMYK notes, bleed margins, and crop marks. Built for production print shops.',
    ar: 'ولّد مئات رموز QR من ملف CSV مع تخصيص لكل سطر، صدّر كـ PDF جاهز للطباعة مع ملاحظات CMYK وهوامش bleed وعلامات قص. مصمّم للمطابع الإنتاجية.',
  },
  colors: {
    primary: '#0891b2',
    secondary: '#155e75',
    themeColor: '#0891b2',
  },
  assets: {
    logoLight: '/brand/logo-light.svg',
    logoDark: '/brand/logo-dark.svg',
    favicon: '/favicon.ico',
    ogImage: '/brand/og.png',
  },
  identity: {
    domain: 'printshopqr.app',
    supportEmail: 'support@printshopqr.app',
    legalName: 'PrintShopQR',
    twitterHandle: '@printshopqr',
  },
  enabledQRTypes: ['url', 'text', 'vcard', 'wifi', 'phone'],
  enabledFeatures: ['home', 'batch', 'templates', 'history', 'privacy', 'brandKit'],
  defaultTemplateId: 'product-label',
  pricing: {
    tierName: 'PrintShopQR',
    basicUSD: 3500,
    basicEGP: 35000,
    plusUSD: 5500,
    plusEGP: 55000,
    lifetimeUSD: 9500,
    lifetimeEGP: 95000,
  },
  bullets: [
    { en: 'CSV → 1000+ QR codes in seconds', ar: 'CSV ← آلاف رموز QR بثوانٍ' },
    { en: 'CMYK + bleed + crop marks PDF export', ar: 'تصدير PDF بـ CMYK و bleed وعلامات قص' },
    { en: 'Per-row colors and logos', ar: 'ألوان وشعارات لكل سطر' },
    { en: '300 / 600 / 1200 DPI export', ar: 'تصدير ٣٠٠ / ٦٠٠ / ١٢٠٠ DPI' },
  ],
};
