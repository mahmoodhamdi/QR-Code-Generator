// Shared brand schema for vertical bundles.
// Each vertical's brand.config.ts must export a `brand: BrandConfig` matching
// this type. The build script (scripts/build-vertical.mjs) reads these files
// to produce a customised Next.js deployment.

import type { QRCodeType } from '../src/types/qr';

export type FeatureKey =
  | 'home'
  | 'scan'
  | 'batch'
  | 'templates'
  | 'history'
  | 'privacy'
  | 'brandKit'
  | 'dynamicQR'
  | 'analytics'
  | 'multiTenant';

export interface BrandConfig {
  /** Internal slug, must match the folder name. */
  slug: 'base' | 'menuqr' | 'eventqr' | 'bizcard' | 'printshop' | 'marketingqr';

  productName: { en: string; ar: string };
  tagline: { en: string; ar: string };
  hero: { en: string; ar: string };

  colors: {
    /** Primary brand color (used for buttons, links, theme). */
    primary: string;
    /** Secondary/accent color. */
    secondary: string;
    /** Status bar / theme-color for PWA. */
    themeColor: string;
  };

  assets: {
    logoLight: string;
    logoDark: string;
    favicon: string;
    ogImage: string;
  };

  identity: {
    domain: string;
    supportEmail: string;
    legalName: string;
    twitterHandle?: string;
    socialUrl?: string;
  };

  /** QR types visible in the type selector (others are hidden). */
  enabledQRTypes: QRCodeType[];
  /** App features (pages) visible in this vertical. */
  enabledFeatures: FeatureKey[];

  /** Template the home page boots into. */
  defaultTemplateId?: string;

  pricing: {
    tierName: string;
    /** Price in USD. */
    basicUSD: number;
    /** Price in EGP. */
    basicEGP: number;
    plusUSD?: number;
    plusEGP?: number;
    lifetimeUSD?: number;
    lifetimeEGP?: number;
  };

  /** Vertical-specific lead categories shown on the home hero. */
  bullets?: Array<{ en: string; ar: string }>;
}
