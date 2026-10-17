#!/usr/bin/env node
/**
 * tools/tokenize-greys.mjs — follow-up to migrate-hex.mjs: tokenise the neutral /
 * grey scale that was deliberately left as raw hex the first time round.
 *
 * Only *achromatic / near-neutral* values are touched (greys, blacks, white-ish
 * surfaces). Saturated colours — including the functional type colours blue/pink/
 * yellow and the gold brand ramp — are never in scope.
 *
 * Same context guards as migrate-hex.mjs:
 *   • skips SVG presentation attributes (fill=/stroke=/stopColor= …)
 *   • skips imperative canvas (getContext / fillStyle / strokeStyle)
 *   • skips CSS custom-property *definition* lines
 *   • skips whole files that concatenate an alpha suffix onto a colour
 *
 * Usage:
 *   node tools/tokenize-greys.mjs           # dry run + histogram of what's left
 *   node tools/tokenize-greys.mjs --write   # apply changes
 *   node tools/tokenize-greys.mjs --scan    # histogram only, no map
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const WRITE = process.argv.includes('--write');
const SCAN_ONLY = process.argv.includes('--scan');
const APPS = ['client', 'b2b-portal', 'editor-portal', 'sysadmin', 'uiadmin'];

/* status / brand (already done by migrate-hex.mjs — kept so a re-run is idempotent) */
const STATUS = {
  '#d4af37': 'var(--brand)',
  '#e6c667': 'var(--brand-soft)',
  '#b8962e': 'var(--brand-deep)',
  '#10b981': 'var(--ok)',
  '#f59e0b': 'var(--warn)',
  '#ef4444': 'var(--danger)',
};

/* Neutral ramp (Tailwind-zinc-aligned; defined in every app's src/index.css).
 * Only achromatic / near-neutral values live here — the gold ramp, the crimson
 * brand, the WhatsApp green and the functional type colours are deliberately
 * NOT in this map. */
const NEUTRAL = {
  '#000000': 'var(--n-1000)', '#000': 'var(--n-1000)',
  '#060504': 'var(--n-950)', '#080808': 'var(--n-950)', '#0a0a0a': 'var(--n-950)',
  '#0e0e0e': 'var(--n-950)', '#0e0e12': 'var(--n-950)', '#0f0f0f': 'var(--n-950)',
  '#111': 'var(--n-900)', '#111827': 'var(--n-900)', '#18181b': 'var(--n-900)', '#1a1a1a': 'var(--n-900)',
  '#1f2937': 'var(--n-800)', '#222': 'var(--n-800)', '#262626': 'var(--n-800)', '#27272a': 'var(--n-800)', '#2a2a2a': 'var(--n-800)', '#303030': 'var(--n-800)',
  '#333': 'var(--n-700)', '#374151': 'var(--n-700)', '#3f3f46': 'var(--n-700)', '#404040': 'var(--n-700)',
  '#444': 'var(--n-600)', '#4b5563': 'var(--n-600)', '#52525b': 'var(--n-600)', '#555': 'var(--n-600)', '#666': 'var(--n-600)',
  '#64748b': 'var(--n-500)', '#6b7280': 'var(--n-500)', '#71717a': 'var(--n-500)', '#737373': 'var(--n-500)', '#777': 'var(--n-500)', '#888': 'var(--n-500)',
  '#94a3b8': 'var(--n-400)', '#999': 'var(--n-400)', '#9ca3af': 'var(--n-400)', '#a1a1aa': 'var(--n-400)', '#a3a3a3': 'var(--n-400)',
  '#aaa': 'var(--n-300)', '#bbb': 'var(--n-300)', '#cbd5e1': 'var(--n-300)', '#ccc': 'var(--n-300)',
  '#d1d5db': 'var(--n-300)', '#d4d4d4': 'var(--n-300)', '#d4d4d8': 'var(--n-300)',
  '#ddd': 'var(--n-200)', '#e0e0e0': 'var(--n-200)', '#e2e8f0': 'var(--n-200)', '#e4e4e7': 'var(--n-200)', '#e5e5e5': 'var(--n-200)', '#e5e7eb': 'var(--n-200)',
  '#eee': 'var(--n-100)', '#f1f5f9': 'var(--n-100)', '#f3f4f6': 'var(--n-100)', '#f4f4f5': 'var(--n-100)', '#f5f5f5': 'var(--n-100)',
  '#f8f8f8': 'var(--n-50)', '#f8fafc': 'var(--n-50)', '#f9fafb': 'var(--n-50)', '#fafafa': 'var(--n-50)',
  '#ffffff': 'var(--paper)', '#fff': 'var(--paper)',
  '#050505': 'var(--ink)',
};

const MAP = new Map(Object.entries({ ...(SCAN_ONLY ? {} : { ...STATUS, ...NEUTRAL }) }));

const SKIP_ATTR = /(?:color|fill|stroke|stopColor|stop-color|floodColor|flood-color)\s*=\s*[{['"]?$/i;

/* True when `offset` sits inside a Tailwind arbitrary value (bg-[#111], border-[…]).
 * Those must use v4's CSS-variable shorthand — `bg-(--n-900)` — because the
 * square-bracket spelling makes Tailwind emit a class selector with unescaped
 * parentheses that lightningcss cannot minify. */
const inArbitraryValue = (line, offset) => {
  const open = line.lastIndexOf('[', offset);
  if (open < 0) return false;
  const close = line.indexOf(']', open);
  if (close !== -1 && close < offset) return false;
  return /[\w-]/.test(line[open - 1] || '');
};
const SKIP_LINE = /^\s*--[\w-]+\s*:|getContext|fillStyle|strokeStyle/;
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
const remaining = new Map(); // hex → count not covered by MAP
const covered = new Map();   // hex → count covered by MAP

for (const app of APPS) {
  let files = [];
  try { files = walk(join(process.cwd(), app, 'src')); } catch { continue; }

  for (const f of files) {
    const original = readFileSync(f, 'utf8');
    const danger = DANGER.test(original);
    const lines = original.split('\n');
    let changed = 0;

    const next = lines.map((line) => {
      if (SKIP_LINE.test(line)) return line;
      return line.replace(/#[0-9a-fA-F]{3,8}\b/g, (hex, offset) => {
        const before = line.slice(0, offset);
        if (SKIP_ATTR.test(before)) return hex;
        /* Escaped CSS selector class, e.g. `.bg-\[\#111\]` — a hand-written
         * Tailwind-style override. Rewriting the hex would corrupt the selector. */
        if (before.endsWith('\\')) return hex;
        const key = hex.toLowerCase();
        if (danger) return hex;
        if (MAP.has(key)) {
          covered.set(key, (covered.get(key) || 0) + 1);
          changed += 1;
          const value = MAP.get(key);
          const shorthand = value.startsWith('var(') && value.endsWith(')')
            ? `(${value.slice(4, -1)})`
            : value;
          return inArbitraryValue(line, offset) ? shorthand : value;
        }
        remaining.set(key, (remaining.get(key) || 0) + 1);
        return hex;
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
for (const r of perFile.slice(0, 20)) console.log(`  ${String(r.changed).padStart(4)}  ${r.file}`);
if (perFile.length > 20) console.log(`  … and ${perFile.length - 20} more files`);

const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
console.log('\n── top values being tokenised ──');
for (const [h, c] of top(covered, 25)) console.log(`  ${String(c).padStart(4)}  ${h} → ${MAP.get(h)}`);

console.log(`\n── still-raw hex after this pass (${remaining.size} distinct, ${[...remaining.values()].reduce((a, b) => a + b, 0)} total) ──`);
for (const [h, c] of top(remaining, 45)) console.log(`  ${String(c).padStart(4)}  ${h}`);
console.log('');
