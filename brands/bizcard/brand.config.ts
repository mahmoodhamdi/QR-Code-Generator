import type { BrandConfig } from '../types';

export const brand: BrandConfig = {
  slug: 'bizcard',
  productName: { en: 'BizCard Studio', ar: 'بطاقة الأعمال الرقمية' },
  tagline: {
    en: 'Your digital business card — share with a scan',
    ar: 'بطاقتك الرقمية — شاركها بمسح ضوئي',
  },
  hero: {
    en: 'Turn your phone into your business card. Generate a vCard 4.0 QR with your photo, social profiles, and contact details. Save trees, save money, never run out of cards.',
    ar: 'حوّل هاتفك إلى بطاقة عملك. ولّد vCard 4.0 QR مع صورتك وحساباتك الاجتماعية وبيانات التواصل. وفّر الأشجار، ووفّر المال، ولن تنفد بطاقاتك أبداً.',
  },
  colors: {
    primary: '#0f172a',
    secondary: '#475569',
    themeColor: '#0f172a',
  },
  assets: {
    logoLight: '/brand/logo-light.svg',
    logoDark: '/brand/logo-dark.svg',
    favicon: '/favicon.ico',
    ogImage: '/brand/og.png',
  },
  identity: {
    domain: 'bizcardstudio.app',
    supportEmail: 'support@bizcardstudio.app',
    legalName: 'BizCard Studio',
    twitterHandle: '@bizcardstudio',
  },
  enabledQRTypes: ['vcard', 'url', 'email', 'phone'],
  enabledFeatures: ['home', 'templates', 'history', 'privacy', 'brandKit'],
  defaultTemplateId: 'bizcard-classic',
  pricing: {
    tierName: 'BizCard Studio',
    basicUSD: 1000,
    basicEGP: 10000,
    plusUSD: 2500,
    plusEGP: 25000,
  },
  bullets: [
    { en: 'vCard 4.0 with photo + 7 social networks', ar: 'vCard 4.0 مع صورة + ٧ شبكات اجتماعية' },
    { en: 'Live preview of your contact card', ar: 'معاينة مباشرة لبطاقة التواصل' },
    { en: 'Print-ready PDF for traditional cards', ar: 'PDF جاهز للطباعة للبطاقات الورقية' },
    { en: 'Multi-user mode for agencies', ar: 'وضع متعدد المستخدمين للوكالات' },
  ],
};
