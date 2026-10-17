/**
 * tools/audit_connectivity.mjs — end-to-end wiring audit for the monorepo.
 *
 * Answers, objectively and repeatably:
 *   1. Which API routes does the server expose, under which mount, guarded by which role?
 *   2. Which /api/... paths does each frontend app call?
 *   3. Which app calls have NO matching server route (real breakages)?
 *   4. Which server routes are never called by any app (dead surface / undocumented)?
 *
 * Usage:  node tools/audit_connectivity.mjs            (summary to console)
 *         node tools/audit_connectivity.mjs --json     (also writes tools/connectivity_report.json)
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

/* ── 1. mounts: app.use('/api/x', routerVar) ───────────────────────────── */
const indexSrc = read('server/index.js');
const imports = {};
for (const m of indexSrc.matchAll(/import\s+(\w+)\s+from\s+'\.\/routes\/([\w.]+)'/g)) imports[m[1]] = `server/routes/${m[2]}`;

const mounts = [];
for (const m of indexSrc.matchAll(/app\.use\(\s*'([^']+)'\s*,\s*(\w+)\s*\)/g)) {
  const file = imports[m[2]];
  if (file) mounts.push({ prefix: m[1], routerVar: m[2], file });
}

/* ── 2. routes per file: method, paths, guard ─────────────────────────── */
const guardOf = (line) => {
  if (/contentAdminOnly/.test(line)) return 'content_admin|admin|sysadmin';
  if (/adminOnly/.test(line)) return 'admin|sysadmin|content_admin';
  if (/requireStaff/.test(line)) return 'staff(b2b,editor,admin,sysadmin)';
  if (/requireRole\(\s*\[([^\]]+)\]/.test(line)) return `role[${line.match(/requireRole\(\s*\[([^\]]+)\]/)[1].replace(/['\s]/g, '')}]`;
  if (/requireAuth/.test(line)) return 'any-authenticated';
  return 'PUBLIC';
};

const routes = [];
for (const mount of mounts) {
  const src = read(mount.file);
  const flat = src.replace(/\r?\n/g, '\n');
  // router.get(['/a','/b'], guard..., handler)
  for (const m of flat.matchAll(/router\.(get|post|put|patch|delete)\(\s*(\[[^\]]+\]|'[^']+'|`[^`]+`)\s*,([^\n]*)/g)) {
    const [, method, rawPaths, rest] = m;
    const paths = (rawPaths.match(/'[^']+'|`[^`]+`/g) || []).map((s) => s.slice(1, -1));
    routes.push({
      method: method.toUpperCase(),
      mount: mount.prefix,
      path: paths.join('|'),
      guard: guardOf(rest),
      file: mount.file,
    });
  }
}

/* ── 2b. app-level routes in index.js (e.g. app.get(['/api/health','/health'])) ── */
const appRoutes = [];
for (const m of indexSrc.matchAll(/app\.(get|post|put|patch|delete)\(\s*(\[[^\]]+\]|'[^']+'|`[^`]+`)/g)) {
  const paths = (m[2].match(/'[^']+'|`[^`]+`/g) || []).map((s) => s.slice(1, -1));
  for (const p of paths) {
    appRoutes.push({ method: m[1].toUpperCase(), mount: '', path: p, guard: 'app-level', file: 'server/index.js' });
  }
}

/* ── 3. app API references ─────────────────────────────────────────────── */
const apps = ['client', 'b2b-portal', 'editor-portal', 'sysadmin', 'uiadmin'];
const walk = (dir, out = []) => {
  if (!exists(dir)) return out;
  for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) {
      if (['node_modules', 'dist', 'build', '.git'].includes(e.name)) continue;
      walk(rel, out);
    } else if (/\.(jsx?|tsx?|mjs)$/.test(e.name) && !/__tests__|\.test\./.test(e.name)) out.push(rel);
  }
  return out;
};

const appRefs = [];
for (const app of apps) {
  for (const file of walk(`${app}/src`)) {
    const src = read(file);
    src.split('\n').forEach((line, i) => {
      /* Skip comments and console/log strings — a path mentioned in prose is not
       * a call. (Both used to show up as bogus "unmatched" refs.) */
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
      if (/console\.(log|warn|error|info|debug)/.test(line)) return;
      /* capture /api/... wherever it appears, including template literals whose
       * leading segment is an expression (e.g. `${API}/api/builder/services`). */
      for (const m of line.matchAll(/(\/api\/[A-Za-z0-9_\-/${}.:?]*)/g)) {
        let p = m[1]
          .replace(/([^/])\$\{[^}]*\}/g, '$1') // `${q}` glued to a word = query suffix → drop
          .replace(/\$\{[^}]*\}/g, ':p')   // `${id}` → `:p`
          .split('${')[0]                   // unterminated `${expr` suffix → drop
          .split('?')[0]                    // strip query string
          .replace(/\/+$/, '')
          .replace(/[`:,'"]+\s*$/, '');
        if (p.length < 5 || p === '/api') continue;
        if (!appRefs.some((r) => r.app === app && r.file === file && r.line === i + 1 && r.path === p)) {
          appRefs.push({ app, file, line: i + 1, path: p, absolute: /localhost:4000|https?:\/\//.test(line) });
        }
      }
    });
  }
}

/* ── 4. match refs → routes (prefix-aware, :param-aware) ───────────────── */
const norm = (s) => s.replace(/\/+$/, '').replace(/\/:[^/]+/g, '/:p');
const routeKeys = new Set();
for (const r of routes) for (const p of r.path.split('|')) routeKeys.add(norm(`${r.mount}${p === '/' ? '' : p}`));
for (const r of appRoutes) routeKeys.add(norm(r.path));

/* A route key and an app ref match when they have the same number of segments
 * and every segment agrees — where `:p` on EITHER side is a wildcard. This lets
 * dynamic calls like `/api/admin/jobs/${id}/${action}` line up with the concrete
 * `/api/admin/jobs/:id/approve` route (G8). */
const segsMatch = (a, b) => {
  const A = a.split('/');
  const B = b.split('/');
  if (A.length !== B.length) return false;
  return A.every((s, i) => s === ':p' || B[i] === ':p' || s === B[i]);
};

const matchRoute = (ref) => {
  const r0 = norm(ref);
  if (routeKeys.has(r0)) return true;
  // tolerate mount aliases: /api/builder/x is served by publicRouter too
  const swaps = [r0.replace('/api/builder/', '/api/public/'), r0.replace('/api/public/', '/api/builder/')]
    .map((x) => x.replace('/api/builder/', '/api/').replace('/api/public/', '/api/'));
  for (const s of swaps) if (routeKeys.has(s)) return true;
  // wildcard scan (either side may carry :p)
  for (const key of routeKeys) if (segsMatch(key, r0)) return true;
  return false;
};

const unmatched = appRefs.filter((r) => !matchRoute(r.path));
const usedRoutes = new Set();
for (const ref of appRefs) {
  const r0 = norm(ref.path);
  for (const key of routeKeys) if (segsMatch(key, r0)) usedRoutes.add(key);
}
const unusedRoutes = [...routeKeys].filter((k) => !usedRoutes.has(k));

/* ── 5. report ─────────────────────────────────────────────────────────── */
const guardCounts = {};
for (const r of routes) guardCounts[r.guard] = (guardCounts[r.guard] || 0) + 1;
for (const r of appRoutes) guardCounts[r.guard] = (guardCounts[r.guard] || 0) + 1;
const appCounts = {};
for (const r of appRefs) appCounts[r.app] = (appCounts[r.app] || 0) + 1;

console.log('════ CONNECTIVITY AUDIT ════');
console.log(`server route declarations : ${routes.length} router + ${appRoutes.length} app-level across ${mounts.length} mounts`);
console.log('mounts                    :', mounts.map((m) => `${m.prefix} → ${m.file}`).join('\n                             '));
console.log('guards                    :', JSON.stringify(guardCounts));
console.log('app API references        :', JSON.stringify(appCounts));
console.log(`\nUNMATCHED app calls (${unmatched.length}):`);
for (const u of unmatched) console.log(`  [${u.app}] ${u.path}   ${u.file}:${u.line}`);
console.log(`\nServer routes never referenced by any app (${unusedRoutes.length}):`);
for (const u of unusedRoutes.sort()) console.log(`  ${u}`);
console.log('\nHardcoded absolute URLs in app code:');
const abs = appRefs.filter((r) => r.absolute);
console.log(abs.length ? abs.map((a) => `  [${a.app}] ${a.file}:${a.line}`).join('\n') : '  none');

if (process.argv.includes('--json')) {
  const out = { generatedAt: new Date().toISOString(), mounts, routes, appRoutes, appRefs, unmatched, unusedRoutes };
  fs.writeFileSync(path.join(root, 'tools/connectivity_report.json'), JSON.stringify(out, null, 2));
  console.log('\nWrote tools/connectivity_report.json');
}
