/**
 * catalogMatch — tells the SysAdmin Pricing Engine whether a builder row is
 * currently LIVE in the couple estimator.
 *
 * PRECEDENCE (mirrors client/src/lib/pricing.js → PRICE_PRECEDENCE = 'cms'):
 * the CMS Studio catalog is authoritative. A builder row therefore only drives a
 * couple-facing price when it maps onto an item the CMS Studio has left UNPRICED.
 * Each row classifies as one of:
 *   'fills'     → maps onto an unpriced CMS item → drives the live price ✅
 *   'cms-wins'  → maps onto a CMS item that already has a price → ignored
 *   'unmatched' → maps onto nothing → not shown in the estimator at all
 *
 * Keep the matcher tables below in sync with client/src/lib/pricing.js.
 */

export const dimsKey = (s) => {
  const m = String(s || '').match(/(\d{1,2})\s*[×x]\s*(\d{1,2})/);
  return m ? `${m[1]}x${m[2]}` : '';
};

const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const key = (r) => String(r?._id || r?.id || '');
const hasPrice = (v) => v !== undefined && v !== null && v !== '';

/* ── Ordered id ↔ keyword tables (mirror client/src/lib/pricing.js) ────── */
const VIDEO_TARGETS = [
  ['reels-shorts-pack', /instagram|shorts|viral|reels?\s*pack/i],
  ['4k-teaser-trailer', /teaser|trailer/i],
  ['same-day-edit', /same-?day|\bsde\b/i],
  ['pre-wedding-teaser', /pre-?wedding|love\s*story|save-?the-?date/i],
  ['traditional-muhurtham-doc', /traditional|long-?form|full\s*video|documentary/i],
  ['cinematic-feature-film', /feature|highlight|cinematic\s*film/i],
  ['audio-devotional-score', /audio|sound|noise|mastering/i],
];
const FLEX_TARGETS = [
  ['whatsapp-video-invite', /whatsapp.*invit|animated.*invit|video\s*invit/i],
  ['telugu-patrika-foil', /patrika|foil.*card|wedding\s*card/i],
  ['mandap-entrance-flex', /mandap.*flex|entrance\s*flex/i],
  ['highway-hoarding', /hoarding|highway|roadside/i],
  ['rollup-standees', /standee|roll-?up/i],
  ['lifesize-cutouts', /cutout|life-?size/i],
];
const COVER_TARGETS = [
  ['royal-velvet-foil', /velvet|foil/i],
  ['leatherette-box', /leatherette|briefcase/i],
  ['acrylic-glass', /acrylic/i],
  ['hardcover-matte', /hardcover.*matte|anti-?scratch/i],
];

/* Which catalog list / field each service family targets. */
const SERVICE_GROUPS = [
  { list: (cat) => cat?.videoEditing || [], targets: VIDEO_TARGETS, catRe: /video/i, field: 'clientPrice' },
  { list: (cat) => cat?.invitationsAndFlex || [], targets: FLEX_TARGETS, catRe: /flex|banner|invit/i, field: 'clientPrice' },
  { list: (cat) => cat?.albumPrinting?.coverFinishes || [], targets: COVER_TARGETS, catRe: /print|album/i, field: 'clientExtra' },
];

const hasSizes = (cat) => (cat?.albumPrinting?.albumSizes || []).length > 0;
const hasSheets = (cat) => (cat?.albumPrinting?.sheetStyles || []).length > 0;
const hasServices = (cat) => SERVICE_GROUPS.some((g) => g.list(cat).length > 0);

/** Replicates the client engine's greedy row→item assignment (row claimed once). */
const assignServices = (rows, cat) => {
  const used = new Set();
  const map = new Map(); // rowKey → { item, field }
  SERVICE_GROUPS.forEach(({ list, targets, catRe, field }) => {
    list(cat).forEach((item) => {
      const t = targets.find(([id]) => id === item.id);
      if (!t) return;
      const row = (rows || []).find(
        (x) => !used.has(key(x)) && catRe.test(String(x.category || '')) && t[1].test(String(x.name || '')),
      );
      if (row) {
        used.add(key(row));
        map.set(key(row), { item, field });
      }
    });
  });
  return map;
};

/** Builder album-size row → classify against the CMS catalog. */
export const classifySize = (row, cat) => {
  if (!row || !hasSizes(cat)) return 'unmatched';
  const dk = dimsKey(row.dimensions || row.name);
  const hit = cat.albumPrinting.albumSizes.find((sz) =>
    sz.id === row.id ||
    (dk && dk === dimsKey(sz.id || sz.title)) ||
    (slug(row.name).length > 2 && (slug(sz.title).includes(slug(row.name)) || slug(row.name).includes(slug(sz.title).slice(0, 14))))
  );
  if (!hit) return 'unmatched';
  return hasPrice(hit.clientBasePrice) ? 'cms-wins' : 'fills';
};

/** Builder sheet row → classify against the CMS catalog. */
export const classifySheet = (row, cat) => {
  if (!row || !hasSheets(cat)) return 'unmatched';
  const hit = cat.albumPrinting.sheetStyles.find((sh) =>
    sh.id === row.id ||
    (slug(row.name).length > 2 && (slug(sh.title).includes(slug(row.name)) || slug(row.name).includes(slug(sh.title).slice(0, 14))))
  );
  if (!hit) return 'unmatched';
  return hasPrice(hit.clientPricePerSheet) ? 'cms-wins' : 'fills';
};

/** Builder service row → classify (needs all rows for the claim-once rule). */
export const classifyService = (row, cat, allRows) => {
  if (!row || !hasServices(cat)) return 'unmatched';
  const rows = Array.isArray(allRows) && allRows.length ? allRows : [row];
  const hit = assignServices(rows, cat).get(key(row));
  if (!hit) return 'unmatched';
  return hasPrice(hit.item[hit.field]) ? 'cms-wins' : 'fills';
};

/* Back-compat booleans: a row is "live" only when it actually drives a price. */
export const matchSize = (row, cat) => classifySize(row, cat) === 'fills';
export const matchSheet = (row, cat) => classifySheet(row, cat) === 'fills';
export const matchService = (row, cat, rows) => classifyService(row, cat, rows) === 'fills';

/** Counts for a section header, e.g. "2 of 11 fill gaps". */
export const matchCount = (rows, cat, kind) => {
  const fn = kind === 'sizes' ? classifySize : kind === 'sheets' ? classifySheet : classifyService;
  const list = Array.isArray(rows) ? rows : [];
  const counts = { fills: 0, 'cms-wins': 0, unmatched: 0 };
  list.forEach((r) => { counts[fn(r, cat, list)] += 1; });
  return { live: counts.fills, cmsWins: counts['cms-wins'], unmatched: counts.unmatched, total: list.length };
};
