#!/usr/bin/env node
/**
 * tools/ui-audit.mjs — UI/UX polish guardrail (see UI_UX_POLISH_PLAN.md §4).
 *
 * Reports, per app:
 *   • native alert/confirm/prompt calls        (HARD GATE — must be 0)
 *   • raw hex colour literals                  (C2 — should trend to 0)
 *   • icon-only <button>s missing aria-label   (C3)
 *   • <img> tags missing alt (or alt=)         (C5)
 *
 * Usage:  node tools/ui-audit.mjs [--strict]
 *   --strict  also fail on any missing aria-label / img alt (hex is advisory).
 * Exit code is non-zero when a HARD GATE fails (native dialogs), or when
 * --strict is set and any C3/C5 finding exists.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const APPS = ['client', 'b2b-portal', 'editor-portal', 'sysadmin', 'uiadmin'];
const ROOT = process.cwd();
const STRICT = process.argv.includes('--strict');

const walk = (dir) => {
  let out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out = out.concat(walk(p));
    else if (['.js', '.jsx', '.css'].includes(extname(p))) out.push(p);
  }
  return out;
};

/* Matches a real call, not a doc-comment mention (".alert(" / "alert()" prose). */
const NATIVE_DIALOG = /(?<![.\w])(?:window\.)?(alert|confirm|prompt)\s*\(/g;
const RAW_HEX = /#[0-9a-fA-F]{3,8}\b/g;
/** A <button> whose entire content is a single self-closing component, no aria-label. */
const ICON_BUTTON = /<button\b([^>]*?)>\s*<([A-Z][A-Za-z0-9]*)\b[^>]*?\/>\s*<\/button>/gs;
/** An <img> with no literal alt= and no {...spread} (which may carry alt). */
const IMG_NO_ALT = /<img\b(?![^>]*\balt=)(?![^>]*\{\.\.\.)[^>]*>/g;

const countMatches = (text, re) => (text.match(re) || []).length;
const isCommentLine = (line) =>
  /^\s*(\/\/|\*|\/\*)/.test(line) || /\bnative\b|\breplaces?\b/i.test(line);

const rows = [];
let hardFail = false;
let softFail = false;

for (const app of APPS) {
  const src = join(ROOT, app, 'src');
  let files = [];
  try { files = walk(src); } catch { continue; }

  const r = { app, dialogs: 0, hex: 0, iconBtns: 0, imgsNoAlt: 0, dialogFiles: [] };

  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    const ext = extname(f);
    const rel = relative(ROOT, f);

    if (ext !== '.css') {
      for (const m of text.matchAll(NATIVE_DIALOG)) {
        const line = text.slice(0, m.index).split('\n').length;
        const snippet = text.split('\n')[line - 1] || '';
        if (isCommentLine(snippet)) continue; // prose mention, not a call
        r.dialogs += 1;
        r.dialogFiles.push(`${rel}:${line}`);
      }
      for (const m of text.matchAll(ICON_BUTTON)) {
        if (!/\baria-label\b/.test(m[1])) r.iconBtns += 1;
      }
      for (const m of text.matchAll(IMG_NO_ALT)) {
        const line = text.slice(0, m.index).split('\n').length;
        const snippet = text.split('\n')[line - 1] || '';
        if (isCommentLine(snippet)) continue; // prose in a doc comment
        r.imgsNoAlt += 1;
      }
    }

    r.hex += countMatches(text, RAW_HEX);
  }

  if (r.dialogs > 0) hardFail = true;
  if (r.iconBtns > 0 || r.imgsNoAlt > 0) softFail = true;
  rows.push(r);
}

const pad = (s, n) => String(s).padEnd(n);
console.log('\nUI/UX audit — UI_UX_POLISH_PLAN.md\n');
console.log(`${pad('app', 15)}${pad('dialogs', 9)}${pad('hex', 7)}${pad('icon-btn no aria', 18)}${pad('img no alt', 11)}`);
console.log('-'.repeat(60));
let tot = { dialogs: 0, hex: 0, iconBtns: 0, imgsNoAlt: 0 };
for (const r of rows) {
  console.log(`${pad(r.app, 15)}${pad(r.dialogs, 9)}${pad(r.hex, 7)}${pad(r.iconBtns, 18)}${pad(r.imgsNoAlt, 11)}`);
  for (const k of Object.keys(tot)) tot[k] += r[k];
}
console.log('-'.repeat(60));
console.log(`${pad('TOTAL', 15)}${pad(tot.dialogs, 9)}${pad(tot.hex, 7)}${pad(tot.iconBtns, 18)}${pad(tot.imgsNoAlt, 11)}\n`);

for (const r of rows) {
  if (r.dialogFiles.length) console.log(`✖ ${r.app}: native dialogs → ${r.dialogFiles.slice(0, 10).join(', ')}`);
}

const hardPass = !hardFail;
console.log(hardPass ? '✔ HARD GATE: 0 native dialogs' : '✖ HARD GATE: native dialogs present');
console.log(`ℹ Advisory: ${tot.hex} raw hex literals remaining (C2), ${tot.iconBtns} icon buttons + ${tot.imgsNoAlt} imgs to label (C3/C5).\n`);

process.exitCode = hardFail || (STRICT && softFail) ? 1 : 0;
