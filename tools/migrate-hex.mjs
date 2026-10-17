#!/usr/bin/env node
/**
 * tools/migrate-hex.mjs — C2 migration helper (one-shot, reviewable).
 *
 * Replaces the canonical brand/status hex literals with UX-2 tokens
 * (`var(--brand)`, `var(--ok)` …) across each app's src.
 *
 * Deliberately SKIPS contexts where a CSS custom property cannot resolve:
 *   • SVG presentation attributes (color=, fill=, stroke=, stopColor= …)
 *   • imperative canvas (getContext / fillStyle / strokeStyle lines)
 *   • the token definitions themselves (CSS custom-property lines)
 * Functional type colours (blue #3b82f6, pink #ec4899, yellow #eab308) are left
 * alone — they are intentional per UI_UX_POLISH_PLAN.md §3.3.
 *
 * Usage: node tools/migrate-hex.mjs [--write]   (default = dry run)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const WRITE = process.argv.includes('--write');
const APPS = ['client', 'b2b-portal', 'editor-portal', 'sysadmin', 'uiadmin'];

const MAP = new Map(Object.entries({
  '#d4af37': 'var(--brand)',
  '#e6c667': 'var(--brand-soft)',
  '#b8962e': 'var(--brand-deep)',
  '#10b981': 'var(--ok)',
  '#f59e0b': 'var(--warn)',
  '#ef4444': 'var(--danger)',
  '#050505': 'var(--ink)',
  '#ffffff': 'var(--paper)',
  '#fff': 'var(--paper)',
}));

const SKIP_ATTR = /(?:color|fill|stroke|stopColor|stop-color|floodColor|flood-color|content)\s*=\s*[{['"]?$/i;
const SKIP_LINE = /^\s*--[\w-]+\s*:|getContext|fillStyle|strokeStyle/;
/* Files that append an alpha suffix to a colour (e.g. `${c}22`) — a var() cannot
 * be concatenated, so the whole file is left untouched. */
const DANGER = /\$\{[^}]*\}[0-9a-fA-F]{2}\b|\+\s*['"][0-9a-fA-F]{2}['"]|\.concat\(\s*['"][0-9a-fA-F]{2}/;

const walk = (dir) => {
  let out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (['.js', '.jsx', '.css'].includes(extname(p))) out.push(p);
  }
  return out;
};

let total = 0;
const perFile = [];

for (const app of APPS) {
  let files = [];
  try { files = walk(join(process.cwd(), app, 'src')); } catch { continue; }

  for (const f of files) {
    const original = readFileSync(f, 'utf8');
    if (DANGER.test(original)) continue; // alpha-suffix concatenation → unsafe
    const lines = original.split('\n');
    let changed = 0;

    const next = lines.map((line) => {
      if (SKIP_LINE.test(line)) return line;
      return line.replace(/#[0-9a-fA-F]{3,8}\b/g, (hex, offset) => {
        const key = hex.toLowerCase();
        if (!MAP.has(key)) return hex;
        const before = line.slice(0, offset);
        if (SKIP_ATTR.test(before)) return hex; // SVG / attribute context
        changed += 1;
        return MAP.get(key);
      });
    }).join('\n');

    if (changed > 0) {
      total += changed;
      perFile.push({ file: `${app}/${f.split(/[\\/]src[\\/]/).pop()}`, changed });
      if (WRITE) writeFileSync(f, next);
    }
  }
}

perFile.sort((a, b) => b.changed - a.changed);
console.log(`\n${WRITE ? 'WROTE' : 'DRY RUN'} — ${total} replacements across ${perFile.length} files\n`);
for (const r of perFile.slice(0, 25)) console.log(`  ${String(r.changed).padStart(4)}  ${r.file}`);
if (perFile.length > 25) console.log(`  … and ${perFile.length - 25} more files`);
console.log('');
