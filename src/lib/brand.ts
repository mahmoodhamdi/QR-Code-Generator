// Runtime brand resolver — picks the brand based on the NEXT_PUBLIC_BRAND env
// var that the build script sets. Imported by client components to render
// vertical-specific copy, colors, and feature toggles.

import { brands, type BrandConfig } from '../../brands';

const SLUG = (process.env.NEXT_PUBLIC_BRAND || 'base') as BrandConfig['slug'];

export const brand: BrandConfig = brands[SLUG] ?? brands.base;

export function isFeatureEnabled(feature: BrandConfig['enabledFeatures'][number]): boolean {
  return brand.enabledFeatures.includes(feature);
}

export function isQRTypeEnabled(type: BrandConfig['enabledQRTypes'][number]): boolean {
  return brand.enabledQRTypes.includes(type);
}
