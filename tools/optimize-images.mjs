#!/usr/bin/env node
/**
 * tools/optimize-images.mjs — P1 image pipeline
 * Generates width-optimised, WebP (and optionally AVIF) variants of heavy
 * public/images assets for each portal app, plus an inline manifest.
 *
 * Usage:  node tools/optimize-images.mjs [--avif] [--quality 82] [--widths 800,1600,2400]
 * Output: <app>/public/images/opt/<name>w<W>.webp (+ .avif when flagged)
 *         manifest written to tools/image-manifest.json
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const APPS = ['client', 'b2b-portal', 'editor-portal', 'sysadmin', 'uiadmin'];

const args = process.argv.slice(2);
const AVIF = args.includes('--avif');
const getArg = (key, dflt) => {
  const i = args.indexOf(`--${key}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : dflt;
};
const QUALITY = Number(getArg('quality', '82'));
const WIDTHS = getArg('widths', '800,1600,2400').split(',').map(Number).filter(w => w > 0);

// Source of truth: hero/pillar/photos live in client/public/images (mirrored to other apps)
const SOURCE_DIR = path.join(ROOT, 'client', 'public', 'images');

const HEAVY = [
  'weddingalbums-home-hero.png',
  'weddingalbums-layflat-album.png',
  'weddingalbums-talambralu.png',
  'mangalya-dharana.png',
  'appagintalu-farewell.png',
  'saptapadi.png',
  'family-blessings.png',
];

const SPAWNED = [
  'bride-polished.jpg',
  'bride-raw.jpg',
  'bridal.jpg',
  'prewedding.jpg',
  'cinematic.jpg',
  'cinematic-video-suite.jpg',
  'luxury-album-craftsmanship.jpg',
  'kalamkari-bg.jpg',
];

const manifest = { generatedAt: new Date().toISOString(), quality: QUALITY, widths: WIDTHS, avif: AVIF, files: [] };
let savedBytes = 0;

async function convertFile(app, srcAbs, name) {
  const outDir = path.join(ROOT, app, 'public', 'images', 'opt');
  await fs.mkdir(outDir, { recursive: true });
  const base = name.replace(/\.(png|jpe?g|webp)$/i, '');
  const srcStat = await fs.stat(srcAbs);

  for (const w of WIDTHS) {
    const outName = `${base}w${w}.webp`;
    const outPath = path.join(outDir, outName);
    let pip = sharp(srcAbs).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY });
    let info;
    try {
      info = await pip.toFile(outPath);
    } catch (e) {
      console.warn(`  ! skip ${app}/${outName}: ${e.message}`);
      continue;
    }
    savedBytes += Math.max(0, srcStat.size - info.size);
    manifest.files.push({ app, from: `/images/${name}`, to: `/images/opt/${outName}`, width: info.width, bytes: info.size });
    if (AVIF) {
      try {
        const avName = `${base}w${w}.avif`;
        const avInfo = await sharp(srcAbs)
          .resize({ width: w, withoutEnlargement: true })
          .avif({ quality: Math.max(50, QUALITY - 10) })
          .toFile(path.join(outDir, avName));
        savedBytes += Math.max(0, srcStat.size - avInfo.size);
        manifest.files.push({ app, from: `/images/${name}`, to: `/images/opt/${avName}`, width: avInfo.width, bytes: avInfo.size });
      } catch (e) {
        console.warn(`  ! skip avif ${app}/${base}w${w}: ${e.message}`);
      }
    }
  }
}

console.log('P1 optimize: source =', SOURCE_DIR);
const present = new Set(await fs.readdir(SOURCE_DIR).catch(() => []));
const targets = [
  ...HEAVY.filter(n => present.has(n)),
  ...SPAWNED.filter(n => present.has(n)),
];
if (targets.length === 0) {
  console.error('No target images found in', SOURCE_DIR, '— nothing done.');
  process.exit(1);
}
console.log('Processing', targets.length, 'images ×', WIDTHS.join('/'), 'px webp at q' + QUALITY + (AVIF ? ' + avif' : ''), 'into', APPS.length, 'apps…');

for (const app of APPS) {
  const srcDir = path.join(ROOT, app, 'public', 'images');
  for (const name of targets) {
    const srcAbs = path.join(srcDir, name);
    try {
      await fs.stat(srcAbs);
    } catch {
      // fall back to client copy if this app misses the file
      const fallback = path.join(SOURCE_DIR, name);
      try { await fs.stat(fallback); await convertFile(app, fallback, name); continue; }
      catch { continue; }
    }
    await convertFile(app, srcAbs, name);
  }
}

await fs.writeFile(path.join(ROOT, 'tools', 'image-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`DONE: ${manifest.files.length} variants · ~${(savedBytes / 1024 / 1024).toFixed(1)} MB potential savings · manifest → tools/image-manifest.json`);
