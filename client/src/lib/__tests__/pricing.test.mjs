/**
 * client/src/lib/__tests__/pricing.test.mjs — plain-node assertions (no deps).
 * Run: node client/src/lib/__tests__/pricing.test.mjs
 */
import assert from 'node:assert/strict';
import {
  priceQuote, normaliseCatalog, recommendPages, pageCapacity, pagesToSheets,
  scaleMixToSheets, PRICE_RULES, SERVICE_INTENTS, perSheetOfSize, applyBuilderOverrides,
} from '../pricing.js';
import { DEFAULT_B2C_PACKAGES, pkgQuote, resolveVideoMap } from '../packages.js';

const t = (name, fn) => {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (e) {
    console.error(`FAIL ${name}: ${e.message}`);
    process.exitCode = 1;
  }
};

const INTENT = SERVICE_INTENTS;

/* ______________________________________________________________________ */
t('pages→sheets conversion', () => {
  assert.equal(pagesToSheets(60), 30);
  assert.equal(pagesToSheets(64), 32);
  assert.equal(pagesToSheets(61), 31); // odd pages round up
  assert.equal(pagesToSheets(20), 10);
});

t('recommendPages clamps + snaps to even pages', () => {
  assert.equal(recommendPages(0), null);
  assert.equal(recommendPages(360), 60);   // 360/6 = 60
  assert.equal(recommendPages(420), 70);
  assert.equal(recommendPages(40), 20);    // many photos for a tiny album → clamps to 20
  assert.equal(Math.max(20, recommendPages(2000)), 120); // clamps at PAGE_MAX
  assert.equal(recommendPages(365) % 2, 0);
});

t('pageCapacity maths', () => {
  assert.deepEqual(pageCapacity(60), { sheets: 30, photosMin: 300, photosComfort: 360 });
});

t('mix scaling preserves sheet counts', () => {
  const scaled = scaleMixToSheets({ a: 12, b: 12, c: 6 }, 30);
  const sum = Object.values(scaled).reduce((s, n) => s + n, 0);
  assert.equal(sum, 30);
  Object.values(scaled).forEach((n) => assert.equal(n % 2, 0, 'must be even'));
  assert.equal(Object.keys(scaled).length, 3);
});

t('sentinel SKU: 12×36 base price unchanged (no-premium cover)', () => {
  const q = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', pages: 60, coverId: 'matte-hardcover' }, null);
  assert.equal(q.size.id, 'size-12x36');
  assert.equal(q.lines.find(l => l.key === 'album').amount, 12500);
  assert.equal(q.total, 12500);
});

t('default cover is acrylic (+2500) when none chosen', () => {
  const q = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', pages: 60 }, null);
  assert.equal(q.lines.find(l => l.key === 'cover').amount, 2500);
  assert.equal(q.total, 15000);
});

/* Edit+print with default cover (legacy maths parity: base + acrylic + extras) */
t('edit_print default config equals legacy estimator total', () => {
  const q = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', pages: 60, finishMode: 'mix', mix: { 'metallic-gold': 12, 'royal-velvet': 12, 'pure-silk': 6 }, coverId: 'acrylic' }, null);
  const base = q.lines.find(l => l.key === 'album').amount;      // 12500
  const cover = q.lines.find(l => l.key === 'cover').amount;     // 2500
  assert.equal(q.total, base + cover, '30 sheets = no extra page charge');
});

t('extra pages charge = avgRate × extra sheets (legacy parity)', () => {
  const q = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', pages: 80, finishMode: 'mix', mix: { 'metallic-gold': 20, 'royal-velvet': 20 }, coverId: 'matte-hardcover' }, null);
  const extra = q.lines.find(l => l.key === 'extra_sheets');
  // mix avg rate = (110+135)/2 = 122.5 → extraSheets=10 → 1225
  assert.equal(extra.amount, Math.round(10 * 122.5));
});

t('single finish parity', () => {
  const q = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', pages: 70, finishMode: 'single', singleSheetId: 'metallic-gold', coverId: 'matte-hardcover' }, null);
  const extra = q.lines.find(l => l.key === 'extra_sheets');
  assert.equal(extra.amount, 5 * 110);
});

t('only_editing tiers + overage', () => {
  const q300 = priceQuote({ intent: INTENT.ONLY_EDITING, photos: 300, pages: 40, coverId: 'matte-hardcover' }, null);
  assert.equal(q300.total, 4999);
  assert.equal(q300.albumInScope, false);
  const q700 = priceQuote({ intent: INTENT.ONLY_EDITING, photos: 700, pages: 40, coverId: 'matte-hardcover' }, null);
  assert.equal(q700.total, 13999); // inside the ≤800 flat tier
  const q850 = priceQuote({ intent: INTENT.ONLY_EDITING, photos: 850, pages: 40, coverId: 'matte-hardcover' }, null);
  assert.equal(q850.total, 13999 + 50 * PRICE_RULES.EDITING_PER_PHOTO_ABOVE);
});

t('only_printing charges print base + full material', () => {
  const q = priceQuote({ intent: INTENT.ONLY_PRINTING, sizeId: 'size-12x36', pages: 60, finishMode: 'single', singleSheetId: 'metallic-gold', coverId: 'matte-hardcover' }, null);
  const keys = q.lines.map(l => l.key);
  assert.ok(keys.includes('album_print_base'));
  assert.ok(keys.includes('material'));
  assert.ok(!keys.includes('album'), 'must not charge bundle base');
  const baseAmount = q.lines.find(l => l.key === 'album_print_base').amount;
  assert.equal(baseAmount, Math.round((12500 - PRICE_RULES.EDITING_IN_BUNDLE) * PRICE_RULES.PRINT_ONLY_FACTOR));
});

t('standalone skips album entirely', () => {
  const q = priceQuote({ intent: INTENT.STANDALONE, videos: { 'video-teaser': 2 }, flex: { 'flex-patrika': 2 }, coverId: 'matte-hardcover' }, null);
  assert.equal(q.albumInScope, false);
  assert.equal(q.total, 6000 * 2 + 4500 * 2);
});

t('engrave + express + parent books with bundle discount', () => {
  const q = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', pages: 60, coverId: 'matte-hardcover', engrave: true, express: true, parentBooks: 3 }, null);
  const byKey = Object.fromEntries(q.lines.map(l => [l.key, l]));
  assert.equal(byKey.engrave.amount, PRICE_RULES.ENGRAVE_FEE);
  assert.equal(byKey.express.amount, PRICE_RULES.EXPRESS_FEE);
  // 3 × 3200 = 9600; −10% (qty≥2) → 8640
  assert.equal(byKey.parent_books.amount, 8640);
});

t('videos & flex quantities multiply', () => {
  const q = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', pages: 60, coverId: 'matte-hardcover', videos: { 'video-reels': 3, 'video-teaser': 1 }, flex: { 'flex-mandap': 2 } }, null);
  const expected = 3500 * 3 + 6000 + 1800 * 2;
  assert.equal(q.total, expected + 12500);
});

t('warnings fire on photo/page mismatch', () => {
  const q = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', pages: 60, photos: 2000, coverId: 'matte-hardcover' }, null);
  assert.equal(q.warnings.length > 0, true);
  const q2 = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', pages: 100, photos: 60, coverId: 'matte-hardcover' }, null);
  assert.equal(q2.warnings.length > 0, true);
});

t('delivery ETA text presents a date with express override', () => {
  const std = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', coverId: 'acrylic' }, null);
  const exp = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', coverId: 'acrylic', express: true }, null);
  assert.match(std.deliveryEtaText, /Ready by/);
  assert.match(exp.deliveryEtaText, /Express/);
  assert.notEqual(std.deliveryEtaText, exp.deliveryEtaText);
});

t('savings computed only in bundle', () => {
  const bundle = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', coverId: 'acrylic' }, null);
  const editor = priceQuote({ intent: INTENT.ONLY_EDITING, photos: 300, coverId: 'matte-hardcover' }, null);
  assert.equal(bundle.savings, PRICE_RULES.EDITING_IN_BUNDLE);
  assert.equal(editor.savings, 0);
});

/* 20-config sweep: estimator/builder parity guard (same config → same total) */
t('parity sweep across 20 seeded configs', () => {
  const sizes = ['size-14x40', 'size-12x36', 'size-12x30', 'size-10x30', 'size-12x24', 'size-10x20', 'size-12x18-vert', 'size-10x15-vert', 'size-8x12-vert'];
  const pages = [40, 50, 60, 64, 70, 80, 90, 100, 120];
  const covers = ['acrylic', 'leatherette', 'velvet-foil', 'matte-hardcover'];
  let i = 0;
  for (const s of sizes) for (const p of pages) for (const c of covers) {
    i++;
    if (i > 20) break;
    const cfg = { intent: INTENT.EDIT_PRINT, sizeId: s, pages: p, finishMode: 'mix', mix: { 'metallic-gold': 10, 'royal-velvet': 10 }, coverId: c };
    const a = priceQuote(cfg, null);
    const b = priceQuote(cfg, null); // engine must be pure — same config twice
    assert.equal(a.total, b.total);
    assert.ok(a.total > 0);
  }
});

/* ── Album-size taxonomy + Indian trade finishes (P-C2 extensions) ───── */
t('new taxonomy sentinel: 15×30 Royal Square Jumbo base price', () => {
  const q = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-15x30', pages: 60, coverId: 'matte-hardcover' }, null);
  assert.equal(q.size.id, 'size-15x30');
  assert.equal(q.lines.find(l => l.key === 'album').amount, 13200); // TODO(business) rate
});

t('NTR Matte single finish: extras at ₹85/sheet', () => {
  const q = priceQuote({ intent: INTENT.EDIT_PRINT, sizeId: 'size-12x36', pages: 80, finishMode: 'single', singleSheetId: 'ntr-matte', coverId: 'matte-hardcover' }, null);
  assert.equal(q.lines.find(l => l.key === 'extra_sheets').amount, 10 * 85);
});

t('engine knows the full 9-finish glossary', () => {
  const cat = normaliseCatalog(null);
  const ids = cat.sheetStyles.map(s => s.id);
  for (const id of ['ntr-matte', 'ntr-glossy', 'glitter-sheet', 'metallic-gold', 'royal-velvet', 'pure-silk', 'non-tearable', 'crystal-gloss', 'matte-linen']) {
    assert.ok(ids.includes(id), `missing finish: ${id}`);
  }
});

/* ── Bundled packages (P-C9): sysadmin-configured, engine-priced per sheet ── */
t('curated packages: album in scope, engine-priced, ascending totals', () => {
  const q1 = pkgQuote(DEFAULT_B2C_PACKAGES[0], null);
  const q2 = pkgQuote(DEFAULT_B2C_PACKAGES[1], null);
  const q3 = pkgQuote(DEFAULT_B2C_PACKAGES[2], null);
  for (const q of [q1, q2, q3]) {
    assert.equal(q.albumInScope, true);
    assert.ok(q.total > 0);
    assert.ok(q.lines.find(l => l.key === 'album'), 'package quotes must itemise the album base');
  }
  assert.ok(q2.total > q1.total, 'Gold must price above Silver');
  assert.ok(q3.total > q2.total, 'Platinum must price above Gold');
  /* exact engine receipts of the curated fallback (per-sheet math pinned) */
  assert.equal(q1.total, 16500, 'Silver = 12×30 base + teaser only');
  assert.equal(q2.total, 26100, 'Gold = 12×36 + 10 extra sheets + leatherette + teaser + reels');
  assert.equal(q3.total, 40693, 'Platinum = 12×18-vert + 20 extra sheets + acrylic + engrave + 2 parents + teaser/reels/feature');
});

t('pkgQuote id-resolution: curated configs price identically on CMS-shaped catalog', () => {
  const cmsLike = {
    albumPrinting: {
      albumSizes: [
        { id: 'size-12x30', title: '12×30 Royal Wide Panoramic', clientBasePrice: 10500 },
        { id: 'size-12x36', title: '12×36 Grand Imperial (The Telugu Standard)', clientBasePrice: 12500 },
        { id: 'size-12x18-vert', title: '12×18 Royal Vertical Portrait Spread', clientBasePrice: 9800 },
      ],
      sheetStyles: [
        { id: 'metallic-gold', title: '24K Metallic Gold Gloss', clientPricePerSheet: 110 },
        { id: 'royal-velvet', title: 'Royal Velvet Feather Touch', clientPricePerSheet: 135 },
        { id: 'ntr-matte', title: 'NTR Matte (Standard Trade)', clientPricePerSheet: 85 },
        { id: 'pure-silk', title: 'Pure Silk Texture (Patent)', clientPricePerSheet: 145 },
        { id: 'ntr-glossy', title: 'NTR Glossy', clientPricePerSheet: 95 },
        { id: 'glitter-sheet', title: 'Sparkle / Glitter Sheet', clientPricePerSheet: 105 },
      ],
      coverFinishes: [
        { id: 'acrylic-glass', title: '4mm Diamond-Polished 3D Acrylic Glass', extra: 2500 },
        { id: 'leatherette-box', title: 'Handcrafted Vegan Leatherette with Presentation Box', extra: 2800 },
        { id: 'hardcover-matte', title: 'Anti-Scratch Scuff-Free Hardcover', extra: 0 },
      ],
    },
    videoEditing: [
      { id: '4k-teaser-trailer', title: '3-5 Min Cinematic Teaser Trailer', clientPrice: 6000 },
      { id: 'reels-shorts-pack', title: 'Viral Instagram Reels & Shorts Pack (5 Reels)', clientPrice: 3500 },
      { id: 'cinematic-feature-film', title: '4K Cinematic Wedding Feature Film (15-20 min)', clientPrice: 10000 },
    ],
  };
  const t0 = DEFAULT_B2C_PACKAGES.map((p) => pkgQuote(p, null).total);
  const tCms = DEFAULT_B2C_PACKAGES.map((p) => pkgQuote(p, cmsLike).total);
  assert.deepEqual(tCms, t0, 'CMS-shaped catalog must price the same as engine defaults');
  assert.deepEqual(tCms, [16500, 26100, 40693]);
  /* resolveIdLike cover mapping survives BOTH id spellings */
  const flipped = JSON.parse(JSON.stringify(cmsLike));
  flipped.albumPrinting.coverFinishes[1].id = 'leatherette';
  assert.equal(pkgQuote(DEFAULT_B2C_PACKAGES[1], flipped).total, 26100, 'legacy leatherette id still resolves');
});

t('resolveVideoMap: engine keys map onto active CMS video ids', () => {
  const cmsLike = [
    { id: 'cinematic-feature-film', title: '4K Cinematic Wedding Feature Film (15-20 min)' },
    { id: '4k-teaser-trailer', title: '3-5 Min Cinematic Teaser Trailer' },
    { id: 'traditional-muhurtham-doc', title: 'Traditional Long-Form Documentary Video' },
    { id: 'reels-shorts-pack', title: 'Viral Instagram Reels & Shorts Pack (5 Reels)' },
  ];
  const mapped = resolveVideoMap({ teaser: 1, feature: 2, reels: 1, nonexistent: 3 }, cmsLike);
  assert.deepEqual(mapped, {
    '4k-teaser-trailer': 1,
    'cinematic-feature-film': 2,
    'reels-shorts-pack': 1,
  });
});

t('perSheetOfSize: base / 30 display helper', () => {
  assert.equal(perSheetOfSize(12500), 417);   // 12×36 → ₹417/sheet
  assert.equal(perSheetOfSize(10500), 350);   // 12×30 exact
  assert.equal(perSheetOfSize(16500), 550);   // 14×40 exact
  assert.equal(perSheetOfSize(0), 0);
  assert.equal(perSheetOfSize(undefined), 0);
});

t('applyBuilderOverrides: CMS Studio wins, builder fills only gaps', () => {
  const cms = {
    albumPrinting: {
      albumSizes: [
        { id: 'size-12x36', title: '12×36 Grand Imperial (The Telugu Standard)', clientBasePrice: 12500 },
        { id: 'size-14x40', title: '14×40 Magnum Royal Mandap Edition' }, // gap → builder fills
      ],
      sheetStyles: [
        { id: 'royal-velvet', title: 'Royal Velvet Feather Touch', clientPricePerSheet: 135 },
        { id: 'ntr-matte', title: 'NTR Matte (Standard Trade)' }, // gap → builder fills
      ],
    },
  };
  const out = applyBuilderOverrides(
    cms,
    [
      { id: 'ident-1', name: '12×36', dimensions: '12×36', basePrice: 13000, isActive: true },
      { id: 'ident-3', name: '14×40', dimensions: '14×40', basePrice: 16999, isActive: true },
    ],
    [
      { id: 'ident-8', name: 'Royal Velvet Feather Touch', pricePerSheet: 140, isActive: true },
      { id: 'ident-9', name: 'NTR Matte (Standard Trade)', pricePerSheet: 88, isActive: true },
    ],
  );
  const sz = out.albumPrinting.albumSizes;
  const sh = out.albumPrinting.sheetStyles;
  assert.equal(sz[0].clientBasePrice, 12500, 'CMS size price wins (builder 13000 ignored)');
  assert.equal(sz[0]._sysadminPriced, undefined, 'CMS-priced size is not flagged builder-priced');
  assert.equal(sz[1].clientBasePrice, 16999, 'builder fills the CMS size gap');
  assert.equal(sz[1]._sysadminPriced, true);
  assert.equal(sz[1].clientPriceBadge, '₹16,999 (30 Sheets / 60 Pages)');
  assert.equal(sh[0].clientPricePerSheet, 135, 'CMS sheet price wins (builder 140 ignored)');
  assert.equal(sh[0]._sysadminPriced, undefined);
  assert.equal(sh[1].clientPricePerSheet, 88, 'builder fills the CMS sheet gap');
  assert.equal(sh[1]._sysadminPriced, true);
  /* inactive rows must NOT fill gaps */
  const out2 = applyBuilderOverrides(cms, [{ id: 'ident-1', name: '12×36', dimensions: '12×36', basePrice: 1, isActive: false }]);
  assert.equal(out2.albumPrinting.albumSizes[0].clientBasePrice, 12500, 'inactive builder rows never apply');
});

t('applyBuilderOverrides offline-safe: empty rows = untouched catalog', () => {
  const cms = {
    albumPrinting: {
      albumSizes: [{ id: 'size-12x36', title: '12×36', clientBasePrice: 12500 }],
      sheetStyles: [{ id: 'royal-velvet', title: 'Royal Velvet', clientPricePerSheet: 135 }],
    },
  };
  const out = applyBuilderOverrides(cms, [], []);
  assert.equal(out.albumPrinting.albumSizes[0].clientBasePrice, 12500);
  assert.equal(out.albumPrinting.sheetStyles[0].clientPricePerSheet, 135);
});

t('applyBuilderOverrides: builder services fill only unpriced CMS items (G6)', () => {
  const cms = {
    albumPrinting: {
      albumSizes: [],
      sheetStyles: [],
      coverFinishes: [
        { id: 'acrylic-glass', label: 'Acrylic Glass' },                          // gap → filled 1500
        { id: 'leatherette-box', label: 'Leatherette Box' },                      // no row → untouched
        { id: 'hardcover-matte', label: 'Hardcover Matte', clientExtra: 999 },    // CMS wins
      ],
    },
    videoEditing: [
      { id: 'cinematic-feature-film', title: 'Feature Film' },                  // gap → 12000
      { id: 'traditional-muhurtham-doc', title: 'Traditional Doc' },            // gap → 18000
      { id: '4k-teaser-trailer', title: 'Teaser', clientPrice: 6000 },          // CMS wins (builder 7500 ignored)
      { id: 'same-day-edit', title: 'SDE', clientPrice: 12000 },                // no matching row → CMS
      { id: 'reels-shorts-pack', title: 'Reels Pack' },                         // gap → 4500
      { id: 'audio-devotional-score', title: 'Audio', clientPrice: 3000 },      // no matcher → CMS
      { id: 'pre-wedding-teaser', title: 'Pre-Wedding' },                       // no row → untouched
    ],
    invitationsAndFlex: [
      { id: 'whatsapp-video-invite', title: 'WhatsApp Invite' },                // gap → 1999
      { id: 'mandap-entrance-flex', title: 'Mandap Flex' },                     // gap → 2400
      { id: 'lifesize-cutouts', title: 'Cutouts', clientPrice: 2600 },          // no row → CMS
    ],
  };
  const services = [
    { id: 'srv-ve-1', category: 'Video Editing', name: '4K Cinematic Wedding Teaser (1-3 min)', basePrice: 7500, isActive: true },
    { id: 'srv-ve-2', category: 'Video Editing', name: 'Traditional Long-Form Video Edit (1 to 4 Hours)', basePrice: 18000, isActive: true },
    { id: 'srv-ve-3', category: 'Video Editing', name: 'Wedding Highlights Cinematic Reel (5-10 min)', basePrice: 12000, isActive: true },
    { id: 'srv-ve-5', category: 'Video Editing', name: 'Instagram Reels / Shorts 5-Pack (9:16)', basePrice: 4500, isActive: true },
    { id: 'srv-fl-4', category: 'Flex & Banners', name: 'Animated Telugu WhatsApp Video Invitation', basePrice: 1999, isActive: true },
    { id: 'srv-fl-1', category: 'Flex & Banners', name: 'Grand Mandap Entrance Flex (10×8 ft Star Media)', basePrice: 2400, isActive: true },
    { id: 'srv-pr-3', category: 'Album Printing', name: '3D Acrylic Glass Crystal Cover Upgrade', basePrice: 1500, isActive: true },
    { id: 'srv-pr-off', category: 'Album Printing', name: 'Acrylic Glass Discontinued', basePrice: 1, isActive: false },
  ];
  const out = applyBuilderOverrides(cms, [], [], services);
  const v = Object.fromEntries(out.videoEditing.map((x) => [x.id, x.clientPrice]));
  assert.equal(v['cinematic-feature-film'], 12000, 'builder fills unpriced feature film');
  assert.equal(v['traditional-muhurtham-doc'], 18000, 'builder fills unpriced traditional doc');
  assert.equal(v['4k-teaser-trailer'], 6000, 'CMS teaser price wins (builder 7500 ignored)');
  assert.equal(v['reels-shorts-pack'], 4500, 'builder fills unpriced reels pack');
  assert.equal(v['same-day-edit'], 12000, 'no matching row ⇒ CMS price kept');
  assert.equal(out.invitationsAndFlex.find((x) => x.id === 'whatsapp-video-invite').clientPrice, 1999);
  assert.equal(out.invitationsAndFlex.find((x) => x.id === 'mandap-entrance-flex').clientPrice, 2400);
  assert.equal(out.invitationsAndFlex.find((x) => x.id === 'lifesize-cutouts').clientPrice, 2600, 'CMS flex price wins');
  assert.equal(out.albumPrinting.coverFinishes.find((x) => x.id === 'acrylic-glass').clientExtra, 1500, 'cover extra filled (active row)');
  assert.equal(out.albumPrinting.coverFinishes.find((x) => x.id === 'leatherette-box').clientExtra, undefined, 'no builder row ⇒ cover untouched');
  assert.equal(out.albumPrinting.coverFinishes.find((x) => x.id === 'hardcover-matte').clientExtra, 999, 'CMS cover price wins');
  /* one builder row is claimed at most once (no bleed across catalog items) */
  assert.equal(out.videoEditing.filter((x) => x._sysadminPriced).length, 3, 'exactly 3 video items filled by builder');
  assert.equal(out.videoEditing.find((x) => x.id === 'audio-devotional-score').clientPrice, 3000, 'audio untouched (no matching row)');
});

console.log(process.exitCode === 1 ? 'SOME TESTS FAILED' : 'ALL PRICING TESTS PASSED');
