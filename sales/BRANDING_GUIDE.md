# Branding Guide

How the vertical bundling / branding system works — for customers who buy the source and want to customise.

## The brand config

Each vertical has a file at `brands/<slug>/brand.config.ts`. It's typed against `brands/types.ts` so TypeScript catches mistakes.

Example (`brands/menuqr/brand.config.ts`):

```typescript
import type { BrandConfig } from '../types';

export const brand: BrandConfig = {
  slug: 'menuqr',
  productName: { en: 'MenuQR Pro', ar: 'ميومكيو آر برو' },
  tagline: { en: '...', ar: '...' },
  hero: { en: '...', ar: '...' },
  colors: { primary: '#d97706', secondary: '#92400e', themeColor: '#d97706' },
  // ...
};
```

## Changing the brand for a build

The build process reads the `BRAND` (or `NEXT_PUBLIC_BRAND`) environment variable to pick a brand:

```bash
# Build the MenuQR vertical
BRAND=menuqr npm run build

# Or use the helper that also patches the manifest:
node scripts/build-vertical.mjs menuqr

# Build all 5 verticals in sequence:
node scripts/build-vertical.mjs all
```

## What gets customised per brand

| Element | Source |
| --- | --- |
| Product name in `<title>` and headers | `brand.productName` |
| Hero copy on home page | `brand.hero` (via `<VerticalHero>`) |
| Primary color (buttons, links) | `brand.colors.primary` |
| Theme color (browser address bar) | `brand.colors.themeColor` |
| PWA manifest (name, theme) | Patched by `scripts/build-vertical.mjs` |
| Visible QR types in selector | `brand.enabledQRTypes` |
| Visible features (nav links) | `brand.enabledFeatures` |
| Default template loaded | `brand.defaultTemplateId` |
| Pricing tier name (used in checkout) | `brand.pricing.tierName` |

## Adding your own brand

If you bought the source and want a totally custom brand:

1. Create `brands/myproduct/brand.config.ts`:

```typescript
import type { BrandConfig } from '../types';

export const brand: BrandConfig = {
  slug: 'myproduct',  // also add to the slug union in brands/types.ts
  productName: { en: 'MyProduct', ar: 'منتجي' },
  tagline: { en: 'My tagline', ar: '...' },
  hero: { en: 'My hero text', ar: '...' },
  colors: { primary: '#xx', secondary: '#yy', themeColor: '#zz' },
  assets: {
    logoLight: '/brand/my-logo-light.svg',
    logoDark: '/brand/my-logo-dark.svg',
    favicon: '/favicon.ico',
    ogImage: '/brand/og.png',
  },
  identity: {
    domain: 'myproduct.com',
    supportEmail: 'hi@myproduct.com',
    legalName: 'My Product Inc.',
  },
  enabledQRTypes: ['url', 'wifi', 'vcard'],
  enabledFeatures: ['home', 'batch', 'templates', 'privacy'],
  pricing: { tierName: 'MyProduct', basicUSD: 100, basicEGP: 1000 },
};
```

2. Add `myproduct` to the union type in `brands/types.ts`.
3. Register in `brands/index.ts`:

```typescript
import { brand as myproduct } from './myproduct/brand.config';
export const brands = { ..., myproduct };
```

4. Build:

```bash
BRAND=myproduct npm run build
```

## Logo / asset files

Put your logo + OG image / favicon in `public/brand/` (you can override per vertical by replacing files at build time — see `scripts/build-vertical.mjs` for how the manifest is patched).

Recommended formats:

- **Logo**: SVG preferred (scales without artifacts).
- **Favicon**: 32×32 ICO.
- **OG image**: 1200×630 PNG.
- **Maskable icons**: 192×192 + 512×512 PNG (with safe zone — see the [maskable.app](https://maskable.app) guide).

## Translations

Vertical-specific copy lives inside `brand.productName.{en,ar}` etc. But the rest of the UI uses `messages/<locale>.json`. If you need to override a generic string for your vertical, the cleanest approach is:

1. Copy `messages/en.json` to `brands/myproduct/messages/en.json`.
2. Modify only the strings you want to change.
3. Wire a custom request handler in `src/i18n/request.ts` that prefers the brand-specific overrides when present.

A more advanced setup (custom overrides + automatic merge) can be built — ping us for $400 of dev-day work if you want it.

## Testing your brand

```bash
# Type check
npm run type-check

# Build for your brand
BRAND=myproduct npm run build

# Visual smoke test
BRAND=myproduct NEXT_PUBLIC_BRAND=myproduct npm run dev
# Open localhost:3000 and verify the hero, colors, and visible QR types match.
```
