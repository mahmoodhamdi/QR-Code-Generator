import type { BrandConfig } from '../types';

export const brand: BrandConfig = {
  slug: 'menuqr',
  productName: { en: 'MenuQR Pro', ar: 'ميومكيو آر برو' },
  tagline: {
    en: 'Digital QR menus for restaurants & cafés',
    ar: 'قوائم QR رقمية للمطاعم والكافيهات',
  },
  hero: {
    en: 'Replace plastic menus with a QR code customers scan. Multi-language, dietary tags, per-table codes, and printable PDFs included.',
    ar: 'استبدل القوائم البلاستيكية بـ QR يمسحه الزبون. متعدد اللغات، علامات غذائية، QR لكل طاولة، وملفات PDF جاهزة للطباعة.',
  },
  colors: {
    primary: '#d97706',
    secondary: '#92400e',
    themeColor: '#d97706',
  },
  assets: {
    logoLight: '/brand/logo-light.svg',
    logoDark: '/brand/logo-dark.svg',
    favicon: '/favicon.ico',
    ogImage: '/brand/og.png',
  },
  identity: {
    domain: 'menuqr.app',
    supportEmail: 'support@menuqr.app',
    legalName: 'MenuQR Pro',
    twitterHandle: '@menuqr',
  },
  enabledQRTypes: ['url', 'wifi', 'text', 'vcard'],
  enabledFeatures: ['home', 'batch', 'templates', 'history', 'privacy', 'brandKit'],
  defaultTemplateId: 'restaurant-menu',
  pricing: {
    tierName: 'MenuQR Pro Lifetime',
    basicUSD: 1500,
    basicEGP: 15000,
    plusUSD: 2500,
    plusEGP: 25000,
    lifetimeUSD: 4000,
    lifetimeEGP: 40000,
  },
  bullets: [
    { en: 'Per-table QR codes (1 → 50 in one click)', ar: 'QR لكل طاولة (١ ← ٥٠ بنقرة)' },
    { en: 'Print-ready PDF with bleed + crop marks', ar: 'PDF جاهز للطباعة مع bleed و crop marks' },
    { en: 'Multi-language menu support', ar: 'دعم قوائم متعددة اللغات' },
    { en: 'WiFi sharing built in', ar: 'مشاركة الواي فاي مدمجة' },
  ],
};
