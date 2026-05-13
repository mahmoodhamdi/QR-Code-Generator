// Capture marketing screenshots for a given vertical.
//
//   BRAND=menuqr npx playwright test marketing/screenshots-script/capture-vertical.ts
//
// Output: marketing/screenshots/<brand>/{desktop,mobile,dark}/*.png

import { test, type Page } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const BRAND = process.env.BRAND || 'base';
const OUT_DIR = path.join(process.cwd(), 'marketing', 'screenshots', BRAND);

const DESKTOP = { width: 1920, height: 1080 };
const MOBILE = { width: 390, height: 844 };

function outFile(folder: 'desktop' | 'mobile' | 'dark', name: string) {
  const dir = path.join(OUT_DIR, folder);
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${name}.png`);
}

async function shoot(page: Page, name: string, folder: 'desktop' | 'mobile' | 'dark') {
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: outFile(folder, name), fullPage: false });
}

const SHOTS = [
  { name: '01-hero', url: '/' },
  { name: '02-generator', url: '/' },
  { name: '03-scan', url: '/scan' },
  { name: '04-batch', url: '/batch' },
  { name: '05-templates', url: '/templates' },
  { name: '06-privacy', url: '/privacy' },
];

test.describe(`marketing screenshots for ${BRAND}`, () => {
  test('desktop captures', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: DESKTOP });
    const page = await ctx.newPage();
    for (const s of SHOTS) {
      await page.goto(s.url);
      await shoot(page, s.name, 'desktop');
    }
    await ctx.close();
  });

  test('mobile captures', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: MOBILE });
    const page = await ctx.newPage();
    for (const s of SHOTS.slice(0, 4)) {
      await page.goto(s.url);
      await shoot(page, s.name, 'mobile');
    }
    await ctx.close();
  });

  test('dark mode captures', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: DESKTOP, colorScheme: 'dark' });
    const page = await ctx.newPage();
    for (const s of SHOTS.slice(0, 2)) {
      await page.goto(s.url);
      await shoot(page, s.name, 'dark');
    }
    await ctx.close();
  });
});
