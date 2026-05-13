# Vertical Bundles

This directory holds 5 vertical product configurations of the same core QR Generator codebase. Each vertical is sold as its own product to a different audience, at its own price point.

## The 5 verticals

| Slug | Product | Audience | Price (USD) |
| --- | --- | --- | --- |
| `menuqr` | MenuQR Pro | Restaurants & cafés | $1,500 – $4,000 |
| `eventqr` | EventQR Suite | Event organisers | $2,500 – $5,500 |
| `bizcard` | BizCard Studio | Professionals, agencies | $1,000 – $2,500 |
| `printshop` | PrintShopQR | Print shops | $3,500 – $9,500 |
| `marketingqr` | MarketingQR Analytics | Marketing agencies | $3,500 – $15,000 |
| `base` | QR Generator (source-only) | Developers | $800 – $1,500 |

## Building a vertical

```bash
# Build one vertical
node scripts/build-vertical.mjs menuqr

# Build all five
node scripts/build-vertical.mjs all
```

Output lands in `.agent/builds/<slug>/`, ready to deploy as a standalone Next.js app (`node server.js`) or to copy onto Vercel/Netlify.

## How configuration is wired

- `brands/<slug>/brand.config.ts` — typed config (`BrandConfig` from `brands/types.ts`).
- `brands/index.ts` — runtime resolver, reads `BRAND` / `NEXT_PUBLIC_BRAND` env var.
- `scripts/build-vertical.mjs` — patches the manifest, sets `BRAND` env, runs `npm run build`.

Vertical-specific UI shows the brand's product name, tagline, hero copy, colors, and only the QR types the brand enables.

## Bundle deals

- 2 verticals: −15%
- 3 verticals: −25%
- All 5 (Master Bundle): $20,000 / 200,000 EGP — perpetual rights to all sources.
- White-label rights (resell to your clients): +50% on base price.
