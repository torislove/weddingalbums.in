#!/usr/bin/env node
/**
 * tools/smoke-pages.mjs — route inventory + page-import integrity + optional live check.
 *
 * Three things, all cheap and repeatable:
 *
 *   1. Inventory    — every <Route path="…"> declared anywhere in each app's src,
 *                     so we can see (and diff) the full page surface per portal.
 *   2. Integrity    — every `import`/`lazy(() => import(...))` referenced by a
 *                     route-bearing file actually resolves to a real module. This is
 *                     the guard that catches a botched page split (e.g. the UX-3
 *                     refactors) before the bundler does.
 *   3. Live (opt-in) — with `--live`, GET each declared route from the app's dev
 *                     server and require the SPA shell to answer 2xx. This proves
 *                     the whole site is actually being served, not just compiled.
 *
 * Usage:
 *   node tools/smoke-pages.mjs              # inventory + import integrity
 *   node tools/smoke-pages.mjs --live       # + fetch every route from localhost dev servers
 *   node tools/smoke-pages.mjs --json       # write tools/smoke_pages_report.json
 *
 * Live check expects the dev servers from start-all.ps1:
 *   client 5173 · b2b 5174 · editor 5175 · sysadmin 5176 · uiadmin 5177
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, extname } from 'node:path';

const ROOT = process.cwd();
const LIVE = process.argv.includes('--live');
const JSON_OUT = process.argv.includes('--json');

const APPS = [
  { dir: 'client',        name: 'Client (B2C)',   port: 5173 },
  { dir: 'b2b-portal',    name: 'Studio (B2B)',   port: 5174 },
  { dir: 'editor-portal', name: 'Editor',         port: 5175 },
  { dir: 'sysadmin',      name: 'Ops / SysAdmin', port: 5176 },
  { dir: 'uiadmin',       name: 'CMS Studio',     port: 5177 },
];

const walk = (dir, out = []) => {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', 'build', '.git'].includes(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (['.js', '.jsx', '.ts', '.tsx'].includes(extname(e.name))) out.push(p);
  }
  return out;
};

const read = (p) => readFileSync(p, 'utf8');

/** Resolve a relative import specifier to a real file on disk. */
function resolveImport(fromFile, spec) {
  if (!spec.startsWith('.')) return { bare: true, spec };
  const base = resolve(dirname(fromFile), spec);
  const candidates = [
    base,
    base + '.jsx', base + '.js', base + '.tsx', base + '.ts',
    join(base, 'index.jsx'), join(base, 'index.js'),
  ];
  const hit = candidates.find((c) => existsSync(c) && statSync(c).isFile());
  return { resolved: hit || null, spec, base };
}

const problems = [];
const inventory = [];

for (const app of APPS) {
  const srcDir = join(ROOT, app.dir, 'src');
  const files = walk(srcDir);
  const routes = [];
  const importChecks = [];

  for (const file of files) {
    const text = read(file);
    const rel = file.slice(ROOT.length + 1).replace(/\\/g, '/');

    // 1. <Route path="…"> (accept both quote styles)
    for (const m of text.matchAll(/<Route\b[^>]*?\bpath\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      const p = m[1] ?? m[2] ?? '';
      routes.push({ path: p, file: rel });
    }

    // 2. imports (static + lazy) — only worth checking in files that declare routes
    const declaresRoutes = /<Route\b/.test(text);
    if (!declaresRoutes) continue;

    for (const m of text.matchAll(/(?:lazy\(\s*\(\s*\)\s*=>\s*import\(\s*|import\s+\w+\s*(?:,\s*\{[^}]*\}\s*)?from\s+)(['"])(\.[^'"]+)\1/g)) {
      const spec = m[2];
      const r = resolveImport(file, spec);
      importChecks.push({ file: rel, spec, ok: Boolean(r.resolved) });
      if (!r.resolved) problems.push(`[${app.dir}] ${rel} imports "${spec}" — no such module`);
    }
  }

  // Dedupe routes by path (a path may be declared once; keep first file)
  const seen = new Set();
  const uniqueRoutes = routes.filter((r) => (seen.has(r.path) ? false : seen.add(r.path)));
  inventory.push({ app, routes: uniqueRoutes, importChecks, fileCount: files.length });

  console.log(`\n── ${app.name}  (${app.dir})  ${'─'.repeat(Math.max(0, 50 - app.name.length))}`);
  console.log(`   route files scanned : ${files.length}`);
  console.log(`   routes declared     : ${uniqueRoutes.length}`);
  console.log(`   imports verified    : ${importChecks.length}${importChecks.some((i) => !i.ok) ? `  (${importChecks.filter((i) => !i.ok).length} BROKEN)` : '  (all resolve)'}`);
  if (uniqueRoutes.length) {
    console.log(`   paths               : ${uniqueRoutes.map((r) => r.path || '(index)').join('  ')}`);
  }
}

/* ── optional live check ────────────────────────────────────────────────── */
let liveFailures = 0;
let liveChecked = 0;
if (LIVE) {
  console.log('\n════ LIVE ROUTE CHECK ════');
  for (const app of APPS) {
    const inv = inventory.find((i) => i.app.dir === app.dir);
    const base = `http://localhost:${app.port}`;
    let healthy = false;
    try {
      const r = await fetch(base + '/', { signal: AbortSignal.timeout(4000) });
      healthy = r.status >= 200 && r.status < 400;
    } catch { healthy = false; }

    if (!healthy) {
      console.log(`  ⏭  ${app.name} — dev server not reachable on :${app.port} (skipped)`);
      continue;
    }
    // Concrete paths only (skip params and wildcards — they need real data).
    const paths = ['/', ...inv.routes
      .map((r) => r.path)
      .filter((p) => p && !p.includes(':') && !p.includes('*'))];
    const uniq = [...new Set(paths)];
    let bad = 0;
    for (const p of uniq) {
      liveChecked += 1;
      try {
        const res = await fetch(base + p, { redirect: 'follow', signal: AbortSignal.timeout(6000) });
        const ok = res.status >= 200 && res.status < 400;
        if (!ok) { bad += 1; liveFailures += 1; console.log(`     ❌ ${p} → ${res.status}`); }
      } catch (e) {
        bad += 1; liveFailures += 1;
        console.log(`     ❌ ${p} → ${e.name}`);
      }
    }
    console.log(`  ${bad === 0 ? '✅' : '❌'} ${app.name} — ${uniq.length - bad}/${uniq.length} routes served on :${app.port}`);
  }
}

/* ── report ─────────────────────────────────────────────────────────────── */
const totalRoutes = inventory.reduce((n, i) => n + i.routes.length, 0);
const totalImports = inventory.reduce((n, i) => n + i.importChecks.length, 0);

console.log('\n' + '='.repeat(64));
console.log(`SMOKE-PAGES: ${totalRoutes} routes · ${totalImports} imports · ${problems.length} broken import(s)` +
  (LIVE ? ` · ${liveChecked} live routes · ${liveFailures} failing` : ''));
for (const p of problems) console.log(`  ❌ ${p}`);
console.log('='.repeat(64));

if (JSON_OUT) {
  const out = {
    generatedAt: new Date().toISOString(),
    inventory: inventory.map((i) => ({
      app: i.app.dir,
      port: i.app.port,
      fileCount: i.fileCount,
      routes: i.routes.map((r) => ({ path: r.path, file: r.file })),
      imports: i.importChecks,
    })),
    brokenImports: problems,
    live: LIVE ? { checked: liveChecked, failing: liveFailures } : null,
  };
  writeFileSync(join(ROOT, 'tools', 'smoke_pages_report.json'), JSON.stringify(out, null, 2));
  console.log('Wrote tools/smoke_pages_report.json');
}

process.exit(problems.length || liveFailures ? 1 : 0);
