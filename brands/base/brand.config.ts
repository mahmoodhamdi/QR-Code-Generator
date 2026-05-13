import type { BrandConfig } from '../types';

export const brand: BrandConfig = {
  slug: 'base',
  productName: { en: 'QR Generator', ar: 'مولد QR' },
  tagline: {
    en: 'Free, fast, browser-based QR codes',
    ar: 'رموز QR مجانية وسريعة تعمل في المتصفح',
  },
  hero: {
    en: 'Create professional QR codes for URLs, WiFi, vCards, menus, events, and more — without sending your data to any server.',
    ar: 'أنشئ رموز QR احترافية للروابط والواي فاي وجهات الاتصال والقوائم والفعاليات — بدون إرسال بياناتك إلى أي خادم.',
  },
  colors: {
    primary: '#3b82f6',
    secondary: '#1e40af',
    themeColor: '#3b82f6',
  },
  assets: {
    logoLight: '/brand/logo-light.svg',
    logoDark: '/brand/logo-dark.svg',
    favicon: '/favicon.ico',
    ogImage: '/brand/og.png',
  },
  identity: {
    domain: 'qrgenerator.example.com',
    supportEmail: 'support@qrgenerator.example',
    legalName: 'QR Generator',
    twitterHandle: '@qrgenerator',
  },
  enabledQRTypes: [
    'text',
    'url',
    'email',
    'phone',
    'sms',
    'whatsapp',
    'wifi',
    'vcard',
    'calendar',
    'location',
    'crypto',
    'appstore',
  ],
  enabledFeatures: ['home', 'scan', 'batch', 'templates', 'history', 'privacy', 'brandKit'],
  pricing: {
    tierName: 'Source Bundle',
    basicUSD: 800,
    basicEGP: 8000,
    plusUSD: 1500,
    plusEGP: 15000,
  },
  bullets: [
    { en: '12 QR types', ar: '١٢ نوع QR' },
    { en: 'Bilingual: EN + AR', ar: 'ثنائي اللغة: إن + عر' },
    { en: '100% offline-capable PWA', ar: 'PWA يعمل دون اتصال' },
  ],
};
