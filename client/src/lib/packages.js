/**
 * client/src/lib/packages.js — B2C bundled packages for the estimator.
 *
 * Source of truth: the SysAdmin "Pricing Engine" panel (sysadmin → /api/packages,
 * rows with { tier, category, price, features[], popular, b2bOrB2c, isActive, color }).
 * When the server is unavailable, curated ESTIMATOR-NATIVE presets below render so the
 * estimator always shows packages (dev + built preview parity).
 *
 * "Price according to the sheets": every package card displays the ENGINE quote of its
 * config (size base + per-sheet material math + videos + cover) — no magic marketing
 * prices; the receipt line items ARE the package price.
 */
import { priceQuote, SERVICE_INTENTS, normaliseCatalog } from './pricing.js';
import { DEFAULT_B2C_PACKAGES as _core } from './packageData.js';

export const DEFAULT_B2C_PACKAGES = _core;

/* API base resolver — mirrors client/src/apiConfig.js so this module keeps ZERO
 * browser-only imports (it must stay importable from Node tests).
 *   prod (any non-localhost host) → '' ⇒ same-origin "/api" behind the reverse proxy
 *   dev / Node                    → VITE_API_URL || http://localhost:4000
 * Never hard-code a production host here: doing so silently broke prod parity. */
const resolveApiBase = () => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (!host.includes('localhost') && !host.includes('127.0.0.1')) return '';
  }
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  return env.VITE_API_URL || 'http://localhost:4000';
};
const API_BASE = resolveApiBase();

/* Legacy/CRM video id keywords → estimator video inventory, resolved at runtime */
const VIDEO_MATCHERS = [
  [/teaser|trailer|reel|short/i, 'teaser'],
  [/pre[- ]?wedding|save[- ]?the[- ]?date/i, 'pre-wedding'],
  [/feature|cinematic film/i, 'feature'],
  [/traditional|documentary|muhurtham doc/i, 'traditional'],
  [/sde|same[- ]?day/i, 'sde'],
  [/audio|mixing|noise/i, 'audio'],
];

/**
 * Map a sysadmin package row to an estimator config (intent/size/pages/sheets/videos).
 * Uses tier keyword heuristics — the estimator-native presets carry the exact configs.
 */
export const mapSysadminToConfig = (pkg) => {
  /* 1) Explicit estimator config authored in the SysAdmin panel wins */
  if (pkg && typeof pkg.apply === 'object' && pkg.apply !== null && (pkg.apply.sizeId || pkg.apply.mix || pkg.apply.pages)) {
    return { ...pkg.apply };
  }
  /* 2) Fallback: tier keyword heuristics mapped onto estimator-native presets */
  const t = String(pkg.tier || pkg.category || '').toLowerCase();
  const match = (word) => DEFAULT_B2C_PACKAGES.find((p) => p.key.includes(word) && t.includes(word));
  const hit = match('silver') || match('gold') || match('platinum') || match('platinum');
  return hit ? { ...hit.apply } : null;
};

/**
 * Tolerant id resolution: match a config id (engine-default style) against an ACTIVE
 * catalog list (CMS style), in both directions. E.g. coverId 'leatherette' ⇄ CMS
 * 'leatherette-box', 'hardcover-matte' ⇄ 'hardcover'. Same shape reasoning as
 * resolveVideoMap — keeps curated presets and sysadmin rows honest across both shapes.
 */
export const resolveIdLike = (id, list = []) => {
  if (!id || !list.length || list.some((x) => x.id === id)) return id;
  const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9××]+/g, ' ').trim();
  const toks = norm(id).split(' ').filter(Boolean);
  let best = null;
  for (const x of list) {
    const hay = norm(`${x.id} ${x.title || x.label || ''}`);
    if (!hay) continue;
    let score = 0;
    for (const tk of toks) if (hay.includes(tk)) score += 1;
    const dir = hay.replace(/ /g, '').includes(norm(id).replace(/ /g, '')) ? 1 : 0;
    const s = dir ? 2 + score : score / toks.length;
    if (s >= 0.5 && (!best || s > best.s)) best = { id: x.id, s };
  }
  return best ? best.id : id;
};

/**
 * Resolve estimator video keys against the ACTIVE catalog video list (CMS uses
 * descriptive ids like 'cinematic-feature-film' while the engine defaults use
 * 'video-feature'). Returns a {videoId: qty} map that actually exists today.
 */
export const resolveVideoMap = (videos = {}, catalogVideos = []) => {
  const out = {};
  const list = catalogVideos.length ? catalogVideos : [];
  /* claim pool: a CMS row may only satisfy ONE key; ids are matched before titles */
  const used = new Set();
  const claim = (needle) =>
    list.find((v) => !used.has(v.id) && needle.test(v.id))
    || list.find((v) => !used.has(v.id) && needle.test(v.title || ''));
  const direct = {
    teaser: /teaser|trailer/i,
    feature: /feature|full[- ]?length|wedding[- ]?film/i,
    traditional: /traditional|documentary/i,
    reels: /reels|shorts/i,
    sde: /same-day|sde/i,
    audio: /audio|mixing/i,
    'pre-wedding': /pre-wedding|save-the-date/i,
  };
  Object.entries(videos).forEach(([key, qty]) => {
    if (!qty) return;
    if (used.has(key)) { /* key already resolved by an earlier alias */ out[key] = qty; return; }
    if (list.some((v) => v.id === key)) { used.add(key); out[key] = qty; return; }
    const needle = direct[key] || VIDEO_MATCHERS.find(([re]) => re.test(key))?.[0];
    if (!needle) return;
    const found = claim(needle);
    if (found) { used.add(found.id); out[found.id] = (out[found.id] || 0) + qty; }
  });
  return out;
};

/** Engine-priced quote for a package (catalog-aware → totals match what the couple will build). */
export const pkgQuote = (pkg, catalog = null) => {
  const raw = catalog || {};
  const norm = normaliseCatalog(catalog);
  /* videos may arrive in RAW CMS shape (videoEditing) or normalised shape (videos) */
  const candidate = raw.videoEditing || raw.videos || [];
  const videos = resolveVideoMap(pkg.apply?.videos, candidate.length ? candidate : norm.videos);
  const cfgIn = pkg.apply || {};
  const mixIn = cfgIn.mix || {};
  const mix = {};
  Object.entries(mixIn).forEach(([sheetId, n]) => { mix[resolveIdLike(sheetId, norm.sheetStyles)] = n; });
  return priceQuote(
    {
      intent: SERVICE_INTENTS.EDIT_PRINT,
      ...cfgIn,
      sizeId: resolveIdLike(cfgIn.sizeId, norm.albumSizes),
      coverId: resolveIdLike(cfgIn.coverId, norm.covers),
      mix,
      videos,
    },
    catalog,
  );
};

/** Public packages from the SysAdmin panel; [] when offline (caller falls back to defaults). */
export const loadPackages = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/packages`);
    if (!res.ok) return [];
    const rows = await res.json();
    return (Array.isArray(rows) ? rows : [])
      .filter((p) => p.isActive !== false && (!p.b2bOrB2c || p.b2bOrB2c === 'b2c'))
      .map((p) => ({ ...p, sysadmin: true, apply: mapSysadminToConfig(p) }));
  } catch {
    return [];
  }
};
