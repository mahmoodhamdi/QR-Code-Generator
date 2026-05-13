#!/usr/bin/env node
// Build static landing pages for each vertical by combining the template with
// the brand config. Output: marketing/landing-pages/<slug>.html
//
//   node scripts/build-landing-pages.mjs

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const templatePath = path.join(root, 'marketing', 'landing-pages', '_template.html');

async function loadBrand(slug) {
  const src = await readFile(path.join(root, 'brands', slug, 'brand.config.ts'), 'utf8');
  const match = src.match(/export const brand[^=]*=\s*({[\s\S]*});/);
  return new Function(`return (${match[1]});`)();
}

const VERTICAL_FEATURES = {
  menuqr: [
    ['Per-table QR codes', 'Generate codes for tables 1–50 in one click. Each carries a ?table=N tag so you know which seat scanned.'],
    ['Bilingual menus', 'Generate two QRs from the same menu URL: one for English, one for Arabic.'],
    ['Print-ready PDFs', 'Export with bleed margins, crop marks, and CMYK conversion notes — your printer will love you.'],
    ['WiFi sharing built in', 'One QR for menu, another for WiFi. Customers scan both, never ask the staff.'],
    ['Restaurant templates', 'Warm amber café, fine-dining burgundy, fast-food vibrant — preloaded styles.'],
    ['Update once, works everywhere', 'Change your PDF menu — every existing QR keeps working.'],
  ],
  eventqr: [
    ['HMAC-signed tickets', 'Every QR carries a cryptographic signature your scanner verifies — forgery-proof.'],
    ['Expiring tickets', 'Tickets become invalid after event day. No more late entry abuse.'],
    ['One-time-use codes', 'Each ticket has a unique nonce; scanners detect duplicates instantly.'],
    ['Built-in gate scanner', 'Repurposed scanner page shows green/red on validation. No extra hardware.'],
    ['Bulk-generate 1000+ tickets', 'Feed in a CSV of attendees, get a ZIP of personalised QR PNGs.'],
    ['Event-themed templates', 'High-contrast for fast scanning, plus a corporate conference badge style.'],
  ],
  bizcard: [
    ['vCard 4.0 with photo', 'Embed your face into the contact. Recipients see who they just met.'],
    ['7 social networks', 'LinkedIn, X, Instagram, GitHub, Telegram, WhatsApp, Facebook — all in one card.'],
    ['Live preview', 'See how your contact card looks before saving the QR.'],
    ['Print-ready PDF', 'Drop onto a 90×54mm card template for a traditional paper backup.'],
    ['Multi-user mode', 'Agencies manage cards for many employees from one dashboard.'],
    ['Never run out of cards', 'Your phone is your card. Save trees, save money.'],
  ],
  printshop: [
    ['CSV → 1000+ QRs in seconds', 'Per-row URL, color, logo, and pattern customization from one upload.'],
    ['CMYK + bleed + crop marks', 'Print-shop ready PDF with conversion notes baked in.'],
    ['300 / 600 / 1200 DPI', 'Pick the resolution your press needs.'],
    ['ZIP, multi-page PDF, A4 sheet', 'Three output formats from one batch.'],
    ['Memory-safe for huge CSVs', 'Process 10,000+ rows without crashing.'],
    ['Reprintable', 'Same CSV always produces the same QRs.'],
  ],
  marketingqr: [
    ['Dynamic QR codes', 'Change destination after printing. The QR stays the same, the link changes.'],
    ['Scan analytics', 'Total scans, by device, by country, by browser — privacy-respecting, no IPs stored.'],
    ['A/B testing', 'Split traffic 50/50 between two destinations to find the winner.'],
    ['Time-bound QRs', 'Activate at a date, expire at another. Perfect for campaigns.'],
    ['Self-hosted or managed', 'Docker compose for self-host, or we manage it for $200/month.'],
    ['No Bitly fees', 'Pay once, own forever. No monthly creep.'],
  ],
  base: [
    ['12 QR types', 'URL, WiFi, vCard, email, phone, SMS, WhatsApp, calendar, location, crypto, app store, text.'],
    ['PNG, SVG, PDF, JPEG, WebP', 'Export in any format you need.'],
    ['Bilingual: EN + AR', 'Full RTL support for Arabic, including layout.'],
    ['PWA — install anywhere', 'Works offline once loaded.'],
    ['100% browser-based', 'No server, no tracking, no signups.'],
    ['MIT licensed source', 'Customize freely. Sell forks.'],
  ],
};

function featureHtml(items) {
  return items.map(([h, b]) => `  <div class="feature"><h3>${h}</h3><p>${b}</p></div>`).join('\n');
}

function pricingHtml(brand) {
  const basic = `<div class="tier"><h3>Basic</h3><div class="price">$${brand.pricing.basicUSD.toLocaleString()}<small>/once</small></div><ul class="tick"><li>Full source code</li><li>Self-host anywhere</li><li>30-day support</li></ul></div>`;
  const plus = brand.pricing.plusUSD ? `<div class="tier popular"><h3>Plus</h3><div class="price">$${brand.pricing.plusUSD.toLocaleString()}<small>/once</small></div><ul class="tick"><li>Everything in Basic</li><li>Branding setup</li><li>90-day support</li></ul></div>` : '';
  const life = brand.pricing.lifetimeUSD ? `<div class="tier"><h3>Lifetime</h3><div class="price">$${brand.pricing.lifetimeUSD.toLocaleString()}<small>/once</small></div><ul class="tick"><li>Everything in Plus</li><li>1 year support</li><li>2 custom features</li></ul></div>` : '';
  return [basic, plus, life].filter(Boolean).join('\n    ');
}

function lighten(hex) {
  // produce a very light background tint of the primary color
  const m = hex.replace('#', '');
  const r = parseInt(m.substring(0, 2), 16);
  const g = parseInt(m.substring(2, 4), 16);
  const b = parseInt(m.substring(4, 6), 16);
  const mix = (c) => Math.round(c + (255 - c) * 0.95);
  return `#${mix(r).toString(16).padStart(2, '0')}${mix(g).toString(16).padStart(2, '0')}${mix(b).toString(16).padStart(2, '0')}`;
}

function borderTint(hex) {
  const m = hex.replace('#', '');
  const r = parseInt(m.substring(0, 2), 16);
  const g = parseInt(m.substring(2, 4), 16);
  const b = parseInt(m.substring(4, 6), 16);
  const mix = (c) => Math.round(c + (255 - c) * 0.85);
  return `#${mix(r).toString(16).padStart(2, '0')}${mix(g).toString(16).padStart(2, '0')}${mix(b).toString(16).padStart(2, '0')}`;
}

async function build(slug) {
  const brand = await loadBrand(slug);
  const template = await readFile(templatePath, 'utf8');
  const features = VERTICAL_FEATURES[slug] || VERTICAL_FEATURES.base;

  const html = template
    .replace(/{{PRODUCT_NAME}}/g, brand.productName.en)
    .replace(/{{TAGLINE}}/g, brand.tagline.en)
    .replace(/{{DESCRIPTION}}/g, brand.hero.en)
    .replace(/{{HERO_TITLE}}/g, brand.tagline.en)
    .replace(/{{HERO_BODY}}/g, brand.hero.en)
    .replace(/{{PRIMARY}}/g, brand.colors.primary)
    .replace(/{{SECONDARY}}/g, brand.colors.secondary)
    .replace(/{{BG}}/g, lighten(brand.colors.primary))
    .replace(/{{BORDER}}/g, borderTint(brand.colors.primary))
    .replace(/{{FEATURES}}/g, featureHtml(features))
    .replace(/{{PRICING_TIERS}}/g, pricingHtml(brand))
    .replace(/{{SUPPORT_EMAIL}}/g, brand.identity.supportEmail);

  const outPath = path.join(root, 'marketing', 'landing-pages', `${slug}.html`);
  await writeFile(outPath, html);
  console.log(`wrote ${path.relative(root, outPath)}`);
}

const slugs = process.argv[2]
  ? [process.argv[2]]
  : ['base', 'menuqr', 'eventqr', 'bizcard', 'printshop', 'marketingqr'];

for (const slug of slugs) await build(slug);
