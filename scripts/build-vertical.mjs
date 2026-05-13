#!/usr/bin/env node
// Build a vertical bundle. Usage:
//   node scripts/build-vertical.mjs <slug>
//
// Slugs: menuqr | eventqr | bizcard | printshop | marketingqr | base | all
//
// Output: .agent/builds/<slug>/ (standalone Next.js deployment ready to
//   `node server.js`) plus a zipped tarball at .agent/builds/<slug>.tar.gz.

import { spawnSync } from 'node:child_process';
import { readFile, writeFile, mkdir, rm, cp, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const buildsDir = path.join(root, '.agent', 'builds');

const ALL = ['base', 'menuqr', 'eventqr', 'bizcard', 'printshop', 'marketingqr'];

async function loadBrand(slug) {
  const file = path.join(root, 'brands', slug, 'brand.config.ts');
  const src = await readFile(file, 'utf8');
  // Minimal TS->JS: strip type annotations enough to JSON.parse the literal.
  // Easier approach: ask tsx/esbuild to transpile, but for keeping deps light
  // we extract the object via a regex.
  const match = src.match(/export const brand[^=]*=\s*({[\s\S]*});/);
  if (!match) throw new Error(`could not parse ${file}`);
  // Use Function constructor to evaluate the literal (controlled local source).
  const obj = new Function(`return (${match[1]});`)();
  return obj;
}

function patchManifest(manifest, brand) {
  return {
    ...manifest,
    name: brand.productName.en,
    short_name: brand.productName.en,
    description: brand.tagline.en,
    theme_color: brand.colors.themeColor,
    id: brand.slug,
  };
}

async function buildOne(slug) {
  const brand = await loadBrand(slug);
  console.log(`\n▶ Building vertical: ${slug} (${brand.productName.en})`);

  const outDir = path.join(buildsDir, slug);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  // 1. Patch manifest.json into a temporary public/ override.
  const manifestPath = path.join(root, 'public', 'manifest.json');
  const manifestBackup = path.join(buildsDir, `.manifest.${slug}.backup`);
  const original = await readFile(manifestPath, 'utf8');
  await writeFile(manifestBackup, original);

  try {
    const manifest = JSON.parse(original);
    await writeFile(manifestPath, JSON.stringify(patchManifest(manifest, brand), null, 2));

    // 2. Run the production build with BRAND env var.
    const result = spawnSync('npm', ['run', 'build'], {
      cwd: root,
      env: { ...process.env, BRAND: slug, NEXT_PUBLIC_BRAND: slug },
      stdio: 'inherit',
    });
    if (result.status !== 0) throw new Error(`build failed for ${slug}`);

    // 3. Copy the standalone output + public + static into builds/<slug>/.
    const standaloneDir = path.join(root, '.next', 'standalone');
    if (!(await exists(standaloneDir))) {
      console.warn('No standalone output (output: standalone must be set). Copying .next instead.');
      await cp(path.join(root, '.next'), path.join(outDir, '.next'), { recursive: true });
    } else {
      await cp(standaloneDir, outDir, { recursive: true });
      await cp(path.join(root, '.next', 'static'), path.join(outDir, '.next', 'static'), { recursive: true });
      await cp(path.join(root, 'public'), path.join(outDir, 'public'), { recursive: true });
    }

    // 4. Drop a brand.json next to the build for traceability.
    await writeFile(path.join(outDir, 'brand.json'), JSON.stringify(brand, null, 2));

    const size = await dirSize(outDir);
    console.log(`✔ ${slug}: built into ${path.relative(root, outDir)} (${(size / 1024 / 1024).toFixed(1)} MB)`);
  } finally {
    await writeFile(manifestPath, original);
  }
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function dirSize(dir) {
  let total = 0;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { readdir, stat: s } = await import('node:fs/promises');
  async function walk(d) {
    for (const entry of await readdir(d, { withFileTypes: true })) {
      const fp = path.join(d, entry.name);
      if (entry.isDirectory()) await walk(fp);
      else total += (await s(fp)).size;
    }
  }
  await walk(dir);
  return total;
}

async function main() {
  const arg = process.argv[2] || 'all';
  await mkdir(buildsDir, { recursive: true });

  const slugs = arg === 'all' ? ALL : [arg];
  if (!arg || (arg !== 'all' && !ALL.includes(arg))) {
    console.error(`Usage: node scripts/build-vertical.mjs <slug>\n  slugs: ${['all', ...ALL].join(' | ')}`);
    process.exit(1);
  }

  for (const slug of slugs) {
    await buildOne(slug);
  }
  console.log(`\n✔ Done. Builds in ${path.relative(root, buildsDir)}/`);
}

main().catch((err) => { console.error(err); process.exit(1); });
