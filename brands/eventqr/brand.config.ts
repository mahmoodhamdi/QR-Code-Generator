import type { BrandConfig } from '../types';

export const brand: BrandConfig = {
  slug: 'eventqr',
  productName: { en: 'EventQR Suite', ar: 'إيفنت QR' },
  tagline: {
    en: 'Signed QR tickets + scanner check-in',
    ar: 'تذاكر QR موقّعة + ماسح للتسجيل',
  },
  hero: {
    en: 'Generate cryptographically signed QR tickets that expire on event day, ship a built-in scanner for gate check-in, and prevent ticket forgery — all without a server.',
    ar: 'ولّد تذاكر QR موقّعة بأمان تنتهي صلاحيتها يوم الفعالية، اشحن ماسح مدمج للتسجيل على البوابة، وامنع تزوير التذاكر — بدون خادم.',
  },
  colors: {
    primary: '#7c3aed',
    secondary: '#5b21b6',
    themeColor: '#7c3aed',
  },
  assets: {
    logoLight: '/brand/logo-light.svg',
    logoDark: '/brand/logo-dark.svg',
    favicon: '/favicon.ico',
    ogImage: '/brand/og.png',
  },
  identity: {
    domain: 'eventqr.app',
    supportEmail: 'support@eventqr.app',
    legalName: 'EventQR Suite',
    twitterHandle: '@eventqr',
  },
  enabledQRTypes: ['url', 'text', 'vcard'],
  enabledFeatures: ['home', 'scan', 'batch', 'templates', 'history', 'privacy', 'brandKit'],
  defaultTemplateId: 'event-ticket',
  pricing: {
    tierName: 'EventQR Lifetime',
    basicUSD: 2500,
    basicEGP: 25000,
    plusUSD: 3500,
    plusEGP: 35000,
    lifetimeUSD: 5500,
    lifetimeEGP: 55000,
  },
  bullets: [
    { en: 'HMAC-signed tickets (forgery-proof)', ar: 'تذاكر موقّعة (مقاومة للتزوير)' },
    { en: 'Expiring + one-time-use codes', ar: 'تذاكر منتهية + لاستخدام واحد' },
    { en: 'Built-in gate scanner', ar: 'ماسح بوابة مدمج' },
    { en: 'Bulk generate 1000+ tickets', ar: 'توليد آلاف التذاكر دفعة واحدة' },
  ],
};
