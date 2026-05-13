import type { BrandConfig } from '../types';

export const brand: BrandConfig = {
  slug: 'marketingqr',
  productName: { en: 'MarketingQR Analytics', ar: 'ماركتنج QR' },
  tagline: {
    en: 'Trackable QR codes for marketing campaigns',
    ar: 'رموز QR قابلة للتتبع لحملاتك التسويقية',
  },
  hero: {
    en: 'Generate dynamic QR codes that redirect anywhere. Track scans by device, country, and time. A/B test destinations. Set expiry. Capture leads — all from a clean dashboard.',
    ar: 'ولّد رموز QR ديناميكية تعيد التوجيه لأي مكان. تتبّع المسحات حسب الجهاز والدولة والوقت. اختبر A/B للوجهات. اضبط تواريخ الانتهاء. اجمع بيانات العملاء — من لوحة تحكم نظيفة.',
  },
  colors: {
    primary: '#16a34a',
    secondary: '#166534',
    themeColor: '#16a34a',
  },
  assets: {
    logoLight: '/brand/logo-light.svg',
    logoDark: '/brand/logo-dark.svg',
    favicon: '/favicon.ico',
    ogImage: '/brand/og.png',
  },
  identity: {
    domain: 'marketingqr.app',
    supportEmail: 'support@marketingqr.app',
    legalName: 'MarketingQR Analytics',
    twitterHandle: '@marketingqr',
  },
  enabledQRTypes: ['url', 'text', 'vcard', 'phone', 'email', 'whatsapp'],
  enabledFeatures: [
    'home',
    'scan',
    'batch',
    'templates',
    'history',
    'privacy',
    'brandKit',
    'dynamicQR',
    'analytics',
    'multiTenant',
  ],
  pricing: {
    tierName: 'MarketingQR Analytics',
    basicUSD: 3500,
    basicEGP: 35000,
    plusUSD: 7500,
    plusEGP: 75000,
    lifetimeUSD: 15000,
    lifetimeEGP: 150000,
  },
  bullets: [
    { en: 'Dynamic QR — change destination after printing', ar: 'QR ديناميكي — غيّر الوجهة بعد الطباعة' },
    { en: 'Scan analytics: device, country, time', ar: 'تحليلات المسح: الجهاز، الدولة، الوقت' },
    { en: 'A/B test destinations', ar: 'اختبار A/B للوجهات' },
    { en: 'Self-hosted Docker, or managed on our servers', ar: 'استضافة ذاتية بـ Docker، أو إدارة على خوادمنا' },
  ],
};
