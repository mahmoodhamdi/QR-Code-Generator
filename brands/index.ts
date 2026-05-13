// Brand resolver — picks the active brand based on BRAND env var.
// Default: 'base'. Used by build-vertical.mjs and (optionally) at runtime.

import type { BrandConfig } from './types';
import { brand as base } from './base/brand.config';
import { brand as menuqr } from './menuqr/brand.config';
import { brand as eventqr } from './eventqr/brand.config';
import { brand as bizcard } from './bizcard/brand.config';
import { brand as printshop } from './printshop/brand.config';
import { brand as marketingqr } from './marketingqr/brand.config';

export const brands: Record<BrandConfig['slug'], BrandConfig> = {
  base,
  menuqr,
  eventqr,
  bizcard,
  printshop,
  marketingqr,
};

export type { BrandConfig } from './types';

export function getActiveBrand(): BrandConfig {
  const slug = (process.env.NEXT_PUBLIC_BRAND || process.env.BRAND || 'base') as BrandConfig['slug'];
  return brands[slug] ?? base;
}
