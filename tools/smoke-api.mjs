#!/usr/bin/env node
/**
 * tools/smoke-api.mjs — live API smoke test + cross-portal separation matrix.
 *
 * Answers the question "is the backend actually wired, and are the portals really
 * isolated from each other?" by talking to a RUNNING server (it will boot one for
 * you if none is listening):
 *
 *   1. Health             — /api/health answers and reports the DB engine.
 *   2. Public surface     — every unauthenticated catalog/lead route returns 2xx.
 *   3. Auth boundary      — every protected route returns 401 without a token.
 *   4. Login              — all six seeded demo accounts authenticate and get a JWT.
 *   5. Separation matrix  — each portal's token is accepted ONLY by its own routes
 *                           (plus the global admin/sysadmin bypass). This is the
 *                           "connectivity separation" guarantee: a couples' token can
 *                           never read the studio book, an editor token can never read
 *                           back-office stats, etc.
 *
 * Usage:
 *   node tools/smoke-api.mjs              # boot server if needed, run everything
 *   node tools/smoke-api.mjs --no-boot    # require an already-running server on :4000
 *   node tools/smoke-api.mjs --json       # also write tools/smoke_api_report.json
 *   SMOKE_BASE=http://localhost:4000 node tools/smoke-api.mjs
 *
 * Exit code is 0 only when every check passes.
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const BASE = (process.env.SMOKE_BASE || 'http://localhost:4000').replace(/\/+$/, '');
const NO_BOOT = process.argv.includes('--no-boot');
const JSON_OUT = process.argv.includes('--json');
const SEED_PASSWORD = process.env.ADMIN_SEED_PASSWORD || 'admin123';
const ROOT = process.cwd();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── tiny HTTP helper ───────────────────────────────────────────────────── */
async function req(method, p, { token, body } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(BASE + p, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    const text = await res.text();
    let payload;
    try { payload = JSON.parse(text); } catch { payload = text.slice(0, 240); }
    return { status: res.status, payload };
  } catch (e) {
    return { status: 0, error: e.message };
  } finally {
    clearTimeout(timer);
  }
}

/* ── check bookkeeping ──────────────────────────────────────────────────── */
const results = [];
let area = 'general';
const areaTitle = (t) => { area = t; console.log(`\n── ${t} ${'─'.repeat(Math.max(0, 58 - t.length))}`); };
const check = (name, ok, detail = '') => {
  results.push({ area, name, ok: Boolean(ok), detail: String(detail) });
  console.log(`  ${ok ? '✅' : '❌'} ${name}${detail ? `  — ${detail}` : ''}`);
  return ok;
};

/* ── fixtures ───────────────────────────────────────────────────────────── */
const USERS = [
  { role: 'admin',         email: 'admin@weddingalbums.in' },
  { role: 'sysadmin',      email: 'sysadmin@weddingalbums.in' },
  { role: 'content_admin', email: 'contentadmin@weddingalbums.in' },
  { role: 'b2b',           email: 'studio@weddingalbums.in' },
  { role: 'editor',        email: 'editor@weddingalbums.in' },
  { role: 'b2c',           email: 'client@weddingalbums.in' },
];

/* One representative protected route per portal surface. All are GETs with no
 * side effects, so the smoke test is safe to run against a live-ish server. */
const PROBES = [
  { key: 'admin',   label: 'back-office',  path: '/api/admin/stats' },
  { key: 'editor',  label: 'editor',       path: '/api/editor/stats' },
  { key: 'b2b',     label: 'studio',       path: '/api/b2b/wallet' },
  { key: 'client',  label: 'couples',      path: '/api/client/profile' },
  { key: 'content', label: 'cms-studio',   path: '/api/content/history' },
  { key: 'staff',   label: 'staff-tools',  path: '/api/public/tasks' },
];

/* Which surfaces each role is ALLOWED past the gate. Admin + sysadmin are global
 * (requireRole grants them a cross-portal bypass by design). */
const ALLOW = {
  admin:         new Set(['admin', 'editor', 'b2b', 'client', 'content', 'staff']),
  sysadmin:      new Set(['admin', 'editor', 'b2b', 'client', 'content', 'staff']),
  content_admin: new Set(['admin', 'content']),
  b2b:           new Set(['b2b', 'staff']),
  editor:        new Set(['editor', 'staff']),
  b2c:           new Set(['client']),
};

const PUBLIC_READS = [
  '/api/health',
  '/api/public/packages',
  '/api/public/services',
  '/api/public/sheets',
  '/api/public/album-sizes',
  '/api/public/muhurtham',
  '/api/public/portfolio',
  '/api/public/testimonials',
  '/api/public/configs',
  '/api/content',
  '/api/images',
];

const DENIED = (s) => s === 401 || s === 403;
const ALLOWED = (s) => s >= 200 && s < 400;

/* ── boot the server if needed ──────────────────────────────────────────── */
let child = null;
async function ensureServer() {
  const h = await req('GET', '/api/health');
  if (h.status === 200) {
    console.log(`ℹ️  Using already-running server at ${BASE}`);
    return;
  }
  if (NO_BOOT) throw new Error(`No server on ${BASE} (and --no-boot was given).`);
  console.log(`ℹ️  Nothing on ${BASE} — booting server/index.js …`);
  child = spawn(process.execPath, ['index.js'], {
    cwd: path.join(ROOT, 'server'),
    stdio: 'ignore',
    env: { ...process.env, PORT: '4000', SERVER_PORT: '4000' },
  });
  for (let i = 0; i < 60; i++) {
    await sleep(1000);
    const r = await req('GET', '/api/health');
    if (r.status === 200) {
      console.log('ℹ️  Server is healthy.');
      return;
    }
  }
  throw new Error('Server did not become healthy within 60s.');
}

/* ── run ────────────────────────────────────────────────────────────────── */
async function run() {
  await ensureServer();

  /* 1. health */
  areaTitle('1. Server health');
  const health = await req('GET', '/api/health');
  check('GET /api/health → 200', health.status === 200, `status ${health.status}`);
  if (health.status === 200) {
    check('reports status "ok"', health.payload?.status === 'ok', `status=${health.payload?.status}`);
    check('reports a database engine', Boolean(health.payload?.database?.engine), health.payload?.database?.engine);
  }
  if (health.status === 503 && health.payload?.code === 'JWT_SECRET_MISSING') {
    check('JWT_SECRET configured', false, 'server refuses to serve (JWT_SECRET_MISSING)');
    return;
  }

  /* 2. public surface */
  areaTitle('2. Public (unauthenticated) surface');
  for (const p of PUBLIC_READS) {
    const r = await req('GET', p);
    check(`GET ${p}`, r.status === 200 || r.status === 204, `status ${r.status}`);
  }

  /* 3. auth boundary */
  areaTitle('3. Auth boundary (no token ⇒ 401)');
  for (const probe of PROBES) {
    const r = await req('GET', probe.path);
    check(`GET ${probe.path} → 401`, r.status === 401, `status ${r.status}`);
  }

  /* 4. login */
  areaTitle('4. Login (seeded demo accounts)');
  const tokens = {};
  for (const u of USERS) {
    const r = await req('POST', '/api/auth/login', { body: { email: u.email, password: SEED_PASSWORD } });
    const ok = r.status === 200 && typeof r.payload?.token === 'string' && r.payload.token.length > 20;
    tokens[u.role] = ok ? r.payload.token : null;
    check(`login ${u.role} (${u.email})`, ok, ok ? `role=${r.payload?.user?.role}` : `status ${r.status} ${JSON.stringify(r.payload)?.slice(0, 120)}`);
    if (ok && r.payload.user?.role !== u.role) {
      check(`login ${u.role} returns role ${u.role}`, false, `got ${r.payload.user.role}`);
    }
  }

  /* 5. separation matrix */
  areaTitle('5. Portal separation matrix (token × surface)');
  const header = ['role'.padEnd(14), ...PROBES.map((p) => p.key.padEnd(11))].join('');
  console.log(`     ${header}`);
  for (const u of USERS) {
    const token = tokens[u.role];
    if (!token) { check(`matrix row ${u.role}`, false, 'no token (login failed)'); continue; }
    const cells = [];
    let rowOk = true;
    for (const probe of PROBES) {
      const r = await req('GET', probe.path, { token });
      const passed = ALLOWED(r.status);
      const expected = ALLOW[u.role].has(probe.key);
      const cellOk = passed === expected;
      if (!cellOk) rowOk = false;
      const mark = passed ? (expected ? '·ok' : '✗LEAK') : (expected ? '✗BLOCKED' : '·deny');
      cells.push(mark.padEnd(11));
      if (!cellOk) {
        results.push({
          area, name: `separation ${u.role} → ${probe.key}`,
          ok: false,
          detail: `status ${r.status}; expected ${expected ? 'allowed' : 'denied'}`,
        });
      }
    }
    console.log(`     ${[u.role.padEnd(14), ...cells].join('')}`);
    check(`${u.role} separation row`, rowOk, rowOk ? '' : 'mismatch (see ✗ above)');
  }

  /* 6. wrong-portal login is refused */
  areaTitle('6. Portal-role mismatch is refused');
  const mismatch = await req('POST', '/api/auth/login', {
    body: { email: 'client@weddingalbums.in', password: SEED_PASSWORD, portalRole: 'editor' },
  });
  check('couples account cannot log into the editor portal', mismatch.status === 403, `status ${mismatch.status}`);

  const bad = await req('POST', '/api/auth/login', { body: { email: 'client@weddingalbums.in', password: 'definitely-wrong' } });
  check('wrong password is rejected', bad.status === 401, `status ${bad.status}`);
}

/* ── report ─────────────────────────────────────────────────────────────── */
let exitCode = 0;
try {
  await run();
} catch (e) {
  check('harness', false, e.message);
}

const failed = results.filter((r) => !r.ok);
console.log('\n' + '='.repeat(64));
console.log(`SMOKE-API: ${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log(`\nFailures (${failed.length}):`);
  for (const f of failed) console.log(`  ❌ [${f.area}] ${f.name} — ${f.detail}`);
}
console.log('='.repeat(64));

if (JSON_OUT) {
  const out = { generatedAt: new Date().toISOString(), base: BASE, total: results.length, failed: failed.length, results };
  writeFileSync(path.join(ROOT, 'tools', 'smoke_api_report.json'), JSON.stringify(out, null, 2));
  console.log('Wrote tools/smoke_api_report.json');
}

if (child) {
  child.kill();
  // Give nodemon/node a moment before we hard-exit.
  await sleep(200);
}

exitCode = failed.length ? 1 : 0;
process.exit(exitCode);
