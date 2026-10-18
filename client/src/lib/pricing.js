/**
 * client/src/lib/pricing.js — ONE source of truth for B2C quotes.
 * Used by: InstantEstimator (quote), BookingPage (breakdown), Checkout/Cart (totals).
 *
 * REVENUE SAFETY: every legacy rate from the original InstantEstimator maths is
 * carried over verbatim. New business rules (editing-only tiers, print-only split,
 * engraving, parent books) are centralised in PRICE_RULES below and marked
 * `TODO(business)` where a number is an assumption pending owner confirmation.
 */

/* ── Legacy fallback catalog (mirrors InstantEstimator FALLBACK_*) ─────── */
export const DEFAULT_SIZES = [
  /* ── GRAND / JUMBO (main wedding albums) ── */
  { id: 'size-14x40', title: '14×40 Magnum Royal Mandap', tradeName: 'Super Jumbo / Maharaja', openSpread: '14" × 40"', closedSize: '20" × 14"', clientBasePrice: 16500, orientation: 'landscape', scaleCategory: 'big', tag: 'Grand Landscape', popular: false, description: 'The largest commercial size in India. Massive stage mandap shots and 100-member family groups unfold edge to edge.', teluguNote: 'భారత్‌లో అతిపెద్ద కమర్షియల్ సైజు — పెద్ద స్టేజ్ గ్రూప్ ఫోటోలకు.' },
  { id: 'size-12x36', title: '12×36 Grand Imperial (AP Standard)', tradeName: 'Commercial King (Karizma / Canvera)', openSpread: '12" × 36"', closedSize: '18" × 12"', clientBasePrice: 12500, orientation: 'landscape', scaleCategory: 'big', tag: 'Most Popular in AP', popular: true, description: '80%+ of all Indian wedding albums print at this size. Wide mandap rituals, stage shots and baraat spreads fit without seam cuts.', teluguNote: 'భారతానికి నం.1 ఆల్బమ్ సైజు — పెళ్లి ఆల్బమ్స్‌లో 80% ఇదే.' },
  { id: 'size-15x30', title: '15×30 Royal Square Jumbo', tradeName: 'Royal Square Jumbo', openSpread: '30" × 15"', closedSize: '15" × 15"', clientBasePrice: 13200, orientation: 'landscape', scaleCategory: 'big', tag: 'Royal Square Jumbo', popular: false, description: 'Premium grand weddings. Immersive square spread with maximum height and width for panoramic ceremony displays.', teluguNote: 'ప్రీమియం గ్రాండ్ పెళ్లిళ్లకు — రాయల్ స్క్వేర్ జంబో.' },
  { id: 'size-12x18-vert', title: '12×18 Royal Vertical Portrait', tradeName: 'Royal / Jumbo Portrait', openSpread: '18"H × 24"', closedSize: '12" × 17~18"', clientBasePrice: 9800, orientation: 'vertical', scaleCategory: 'big', tag: 'Vertical Portrait', popular: true, description: 'Vertical luxury book — full-bleed bridal portraits stand nearly 1.5 ft tall when closed.', teluguNote: 'వర్టికల్ లక్సరీ బుక్ — 1.5 అడుగుల పొడవైన బ్రైడల్ పోర్ట్రెయిట్‌లు.' },
  /* ── MID-SIZE (secondary ceremonies & boutique) ── */
  { id: 'size-12x30', title: '12×30 Royal Wide Panoramic', tradeName: 'Medium Standard', openSpread: '12" × 30"', closedSize: '15" × 12"', clientBasePrice: 10500, orientation: 'landscape', scaleCategory: 'big', tag: 'Cinema Landscape', popular: false, description: 'Very popular in South & West India for haldi, mehendi, engagement and sangeet albums. Slightly more portable than 12×36.', teluguNote: 'హల్దీ · మెహందీ · ఎంగేజ్‌మెంట్ ఆల్బమ్స్‌కి జనప్రియం.' },
  { id: 'size-10x30', title: '10×30 Slim Cinema Landscape', tradeName: 'Slim Cinema', openSpread: '10" × 30"', closedSize: '15" × 10"', clientBasePrice: 9200, orientation: 'landscape', scaleCategory: 'medium', tag: 'Slim Landscape', popular: false, description: 'Slim panoramic storytelling — ideal for pre-wedding outdoor shoots.', teluguNote: 'స్లిమ్ పానోరమిక్ — ప్రీ-వెడింగ్ షూట్‌లకు.' },
  { id: 'size-12x24', title: '12×24 Classic Celebration Square', tradeName: 'Square Contemporary', openSpread: '12" × 24"', closedSize: '12" × 12"', clientBasePrice: 8500, orientation: 'square', scaleCategory: 'medium', tag: 'Square Classic', popular: false, description: 'The modern cinematic square — Instagram-curated layouts and boutique wedding books.', teluguNote: 'మాడర్న్ సినిమాటిక్ స్క్వేర్ బుక్.' },
  { id: 'size-10x15-vert', title: '10×15 Editorial Vertical Portrait', tradeName: 'Mid-Portrait', openSpread: '15"H × 20"', closedSize: '10" × 14"', clientBasePrice: 7600, orientation: 'vertical', scaleCategory: 'medium', tag: 'Vertical Editorial', popular: false, description: 'Compact vertical storytelling for pre-wedding couple shoots and fashion portfolios.', teluguNote: 'ప్రీ-వెడింగ్ కపుల్ షూట్‌లకు కాంపాక్ట్.' },
  /* ── SMALL / GIFT / POCKET (high-margin gifting) ── */
  { id: 'size-10x20', title: '10×20 Compact Celebration Square', tradeName: 'Square Coffee Table Book', openSpread: '10" × 20"', closedSize: '10" × 10"', clientBasePrice: 7200, orientation: 'square', scaleCategory: 'small', tag: 'Square Compact', popular: false, description: 'Sleek coffee-table book — smaller functions, Gruhapravesam, birthdays.', teluguNote: 'కాఫీ టేబుల్ బుక్ — చిన్న ఫంక్షన్లు · బర్త్‌డేలకు.' },
  { id: 'size-8x12-vert', title: '8×12 Traditional Vertical', tradeName: 'Magazine Photo Storybook', openSpread: '12"H × 16"', closedSize: '8" × 12" (A4)', clientBasePrice: 5800, orientation: 'vertical', scaleCategory: 'small', tag: 'Vertical Compact', popular: false, description: 'Flexible-page magazine storybook — guest signing books and family return gifts.', teluguNote: 'మ్యాగజైన్ స్టోరీబుక్ — గెస్ట్ సైనింగ్ · కుటుంబ బహుమతులు.' },
  { id: 'size-6x9-pocket', title: '6×9 Companion Pocket Parent Book', tradeName: 'Parent Mini Master (50% of 12×36)', openSpread: '6" × 18"', closedSize: '9" × 6"', clientBasePrice: 3200, orientation: 'pocket', scaleCategory: 'small', tag: 'Parent Mini Book', popular: false, description: 'Exact 50% scale-down of a 12×36 master — gifted copies so parents do not handle the heavy 5–8 kg master book.', teluguNote: 'మాస్టర్ ఆల్బమ్‌కి సగం పరిమాణం — పేరెంట్స్‌కు గిఫ్ట్ కాపీ.' },
];

export const DEFAULT_SHEETS = [
  /* ── LUXURY (specialty print surfaces) ── */
  { id: 'metallic-gold', title: '24K Metallic Gold Gloss', telugu: '24K మెటాలిక్ గోల్డ్', gsm: '350 GSM Archival', clientPricePerSheet: 110, color: 'var(--brand-soft)', bestFor: 'Muhurtham & 22K Gold Jewelry', ritualSection: 'Muhurtham & Talambralu Spreads', group: 'muhurtham', alias: 'Metallic / Silver Pearl · Pearlised', tier: 'luxury', description: 'Mica-infused pearlised gloss that lifts jewelry and zardozi work into shimmering 3D pop.', teluguDesc: 'నగలు · జర్దోజీ మెరిసేలా పెర్ల్ షైన్.', points: ['High-gloss reflective sheen', 'Deep black D-max density', '100+ year fade resistance'] },
  { id: 'royal-velvet', title: 'Royal Velvet Feather Touch', telugu: 'రాయల్ వెల్వెట్ టచ్', gsm: '400 GSM Rigid', clientPricePerSheet: 135, color: '#722F37', bestFor: 'Zero Glare Candid Portraits', ritualSection: 'Reception & Couple Portraits', group: 'reception', alias: 'Velvet / Feather Touch / Soft Touch', tier: 'luxury', description: 'Peach-skin velvet coat with zero glare — scuff-free even when pages rub together.', teluguDesc: 'జీరో గ్లేర్ వెల్వెట్ టచ్ — పేజీలు రాసుకున్నా గీతలు పడవు.', points: ['Zero-glare viewing angle', 'Anti-scratch & anti-smudge (scuff-free)', 'Deep contrast for candid portraits'] },
  { id: 'pure-silk', title: 'Pure Silk Texture (Pattu)', telugu: 'ప్యూర్ సిల్క్ (పట్టు)', gsm: '380 GSM Textured', clientPricePerSheet: 145, color: 'var(--brand)', bestFor: 'Traditional Saree Moments', ritualSection: 'Kanyadaanam & Saptapadi', group: 'ritual', alias: 'Silky / Silk Matte', tier: 'luxury', description: 'Fine weave texture like raw pattu silk — scatters glare during family viewing.', teluguDesc: 'పట్టు వస్త్రం లాంటి సిల్క్ టెక్స్చర్.', points: ['Silky fingerprint-proof coat', 'Textured tactile weave', 'Soft pastel skin rendition'] },
  { id: 'crystal-gloss', title: 'HD Silver Halide Crystal', telugu: 'సిల్వర్ హాలైడ్ క్రిస్టల్', gsm: '320 GSM Photographic', clientPricePerSheet: 120, color: 'var(--n-200)', bestFor: 'True Optical Continuous Tone', ritualSection: 'Stage Fireworks & Close-ups', group: 'reception', alias: 'Silver Halide Crystal Archive (Fuji / Kodak labs)', tier: 'luxury', description: 'True optical lab paper — continuous tone like a traditional darkroom print, luster between matte and gloss.', teluguDesc: 'అసలైన డార్క్‌రూమ్ ప్రింట్ క్వాలిటీ.', points: ['True optical continuous tone', 'Luster / satin micro-pebble texture', 'Colour pop without harsh reflections'] },
  { id: 'glitter-sheet', title: 'Sparkle / Glitter Sheet', telugu: 'స్పార్కల్ గ్లిటర్', gsm: '320 GSM Sparkle Coat', clientPricePerSheet: 105, color: '#D9C98A', bestFor: 'Reception · Sangeet · Bridal Portraits', ritualSection: 'Reception & Sangeet Glitter Spreads', group: 'reception', alias: 'Diamond Dust · Sparkle', tier: 'special', description: 'Micro diamond-dust glitter coat that shimmers under stage and sangeet lighting.', teluguDesc: 'డైమండ్ డస్ట్ మెరుపు — సేజీట్ · రిసెప్షన్ షూట్‌లకు.', points: ['Micro diamond-dust shimmer', 'Reserved for reception & sangeet spreads', 'Pops under warm stage lighting'] },
  /* ── STANDARD (workhorse trade finishes) ── */
  { id: 'non-tearable', title: 'Non-Tear Poly-Luster (NT Core)', telugu: 'నాన్-టియరబుల్ పాలీ', gsm: '300 GSM Poly', clientPricePerSheet: 85, color: '#4A90E2', bestFor: '100% Waterproof Durability', ritualSection: 'Extended Family & Group Spreads', group: 'family', alias: 'NT Waterproof Core', tier: 'standard', description: 'Synthetic polymer core impervious to beverage spills, humidity and enthusiastic kids.', teluguDesc: 'నీళ్లు · తడి · పిల్లల ఆటాపాటీ — ఏదీ ఆల్బమ్‌కి అంటవు.', points: ['100% waterproof composite', 'Resists warping & creasing', 'Rigid 450 GSM core'] },
  { id: 'matte-linen', title: 'Natural Matte Fine Art Linen', telugu: 'నేచురల్ మ్యాట్ లినెన్', gsm: '350 GSM Cotton', clientPricePerSheet: 105, color: '#E8DFD8', bestFor: 'European Understated Elegance', ritualSection: 'Pre-Wedding Outdoor Shoots', group: 'reception', alias: 'Leatherette / Canvas Embossed', tier: 'standard', description: 'Cold-roller embossed grain (linen, leather or canvas) that adds structural texture to the print.', teluguDesc: 'లినెన్ · లెదర్ గ్రెయిన్ ఎంబాసింగ్ టెక్స్చర్.', points: ['Embossed linen / canvas grain', 'Natural matte, zero sheen', 'Understated fine-art elegance'] },
  { id: 'ntr-matte', title: 'NTR Matte (Standard Trade)', telugu: 'NTR మ్యాట్ (స్టాండ‌ర్డ్)', gsm: '350 GSM Lay-Flat', clientPricePerSheet: 85, color: '#7B8794', bestFor: 'Stage Groups · Ambient Room Light', ritualSection: 'Extended Family & Stage Groups', group: 'family', alias: 'NTR Matte · Normal Matte', tier: 'standard', description: 'Flat anti-glare smooth finish — the standard tier most AP photographers give (typically ~26 of every 30 sheets).', teluguDesc: 'ఫ్లాట్ యాంటీ-గ్లేర్ మ్యాట్ — ఫోటోగ్రాఫర్లు ఇచ్చే మామూలు స్టాండ‌ర్డ్ షీట్.', points: ['Flat, non-reflective under warm lights', 'Fingerprint-resistant standard tier', 'Most common in commercial packages'] },
  { id: 'ntr-glossy', title: 'NTR Glossy', telugu: 'NTR గ్లాసీ', gsm: '350 GSM Lay-Flat', clientPricePerSheet: 95, color: '#2F86D6', bestFor: 'Outdoor Daylight · Bright Stage', ritualSection: 'Stage & Daylight Spreads', group: 'family', alias: 'Mirror Gloss', tier: 'standard', description: 'Mirror shine with high contrast and punchy saturation — pops red/gold attire in daylight, but shows smudges.', teluguDesc: 'మిర్రర్ షైన్ — రంగులు కాంతిమంతంగా, కానీ వేళ్ల మార్కులు అంటతాయి.', points: ['Mirror-like gloss & contrast', 'Punchy colour for outdoor shots', 'Wipe with microfiber before viewing'] },
];

export const DEFAULT_COVERS = [
  { id: 'acrylic', label: 'Diamond Acrylic 3D Glass', extra: 2500, mockup: '/images/cover-acrylic-3d.jpg' },
  { id: 'leatherette', label: 'Italian Leatherette + Box', extra: 2800, mockup: '/images/cover-leatherette-box.jpg' },
  { id: 'velvet-foil', label: 'Royal Velvet + 24K Gold Foil', extra: 2200, mockup: '/images/cover-royal-velvet.jpg' },
  { id: 'matte-hardcover', label: 'Scuff-Free Hardcover Matte', extra: 0, mockup: '/images/weddingalbums-layflat-album.png' },
];

export const DEFAULT_VIDEOS = [
  { id: 'video-feature', title: '4K Cinematic Wedding Feature Film (15-20 min)', price: 10000, turnaround: '5-7 Days', group: 'film', desc: 'Non-linear story cut across rituals — vows, speeches, drone overlays, cinematic grade.', descTe: 'వోవ్స్ · ప్రీస్ట్ చంటలు · మల్టీ-క్యామ్ కట్ — పూర్తి సినిమాటిక్ గ్రేడ్.' },
  { id: 'video-traditional', title: 'Traditional Long-Form Documentary (2-3 hrs)', price: 12000, turnaround: '7-10 Days', group: 'film', desc: 'Full multi-cam ritual coverage for the elders — Baraat, Talambralu, Kanyadaan chapters.', descTe: 'పెద్దల కోసం పూర్తి రిచువల్ కవరేజ్ — చాప్టర్లుగా విడిపించిన డాక్యుమెంటరీ.' },
  { id: 'video-teaser', title: '3-5 Min 4K Cinematic Teaser Trailer', price: 6000, turnaround: '48-72 Hrs', group: 'social', desc: 'High-energy beat-synced trailer with cinematic teal-orange or warm AP LUTs.', descTe: 'బీట్-సింక్ హై-ఎనర్జీ ట్రైల‌ర్ — సినిమాటిక్ కలర్ గ్రేడ్.', telugu: '3-5 నిమి 4K సినిమాటిక్ టీజ‌ర్ ట్రైల‌ర్' },
  { id: 'video-sde', title: 'Same-Day Edit (SDE) Reception Screening', price: 12000, turnaround: 'Same Evening', group: 'live', desc: 'Edited live on-site during the reception; screened on the LED wall the same evening.', descTe: 'రిసెప్షన్ సాయంత్రమే LED స్క్రీన్‌పై ప్రీమియ‌ర్.', },
  { id: 'video-reels', title: 'Viral Instagram Reels & Shorts Pack (5 Reels)', price: 3500, turnaround: '48 Hrs', qtyMax: 5, group: 'social', desc: 'Five 9:16 vertical reels (1080×1920) synced to trending audio — Instagram, WhatsApp status ready.', descTe: '5× 9:16 వర్టికల్ రీల్స్ (1080×1920) — ట్రెండింగ్ ఆడియో‌తో.', telugu: 'వైరల్ ఇన్‌స్టాగ్రామ్ రీల్స్ & షార్ట్స్ ప్యాక్ (5 రీల్స్)' },
  { id: 'video-audio', title: 'Audio Mixing, Noise Cleanup & Devotional Score', price: 3000, turnaround: '24-48 Hrs', group: 'audio', desc: 'Dialogue de-noise, chant clarity, devotional background score, loudness-normalised master.', descTe: 'పూజా పఠనం స్పష్టత · నాయిస్ క్లీనప్ · దైవిక బ్యాక్‌గ్రౌండ్ స్కోర్.' },
];

export const DEFAULT_FLEX = [
  { id: 'flex-whatsapp', title: '60s 4K WhatsApp Animated Video Invitation', price: 1800, qtyMax: 1 },
  { id: 'flex-patrika', title: 'Traditional Gold Foil Wedding Patrika', price: 4500, qtyMax: 5, qtyUnit: 100, qtyLabel: '100 cards' },
  { id: 'flex-mandap', title: 'Grand Mandap & Entrance Flex Banner (10×8 ft)', price: 1800, qtyMax: 4 },
  { id: 'flex-hoarding', title: 'Highway & Roadside Wedding Hoarding (40×20 ft)', price: 4200, qtyMax: 4 },
  { id: 'flex-standee', title: 'Welcome Roll-Up Standee with Stand (6×2.5 ft)', price: 1400, qtyMax: 4 },
];

/* ── Central price rules ──────────────────────────────────────────────── */
export const PRICE_RULES = {
  BASE_SHEETS_INCLUDED: 30,          // 30 sheets = 60 pages are inside every size's base price
  EXPRESS_FEE: 1999,
  ENGRAVE_FEE: 800,                  // TODO(business): confirm 24K name engraving rate
  PARENT_BOOK_PRICE: 3200,           // 6×9 companion book
  PARENT_BOOK_BUNDLE_DISCOUNT: 0.10, // 10% off when qty >= 2
  EDITING_IN_BUNDLE: 4500,           // TODO(business): editing component inside edit_print base
  EDITING_TIERS: [                   // TODO(business): per-event standalone editing menu
    { maxPhotos: 300, price: 4999 },
    { maxPhotos: 600, price: 8999 },
    { maxPhotos: 800, price: 13999 },
  ],
  EDITING_PER_PHOTO_ABOVE: 6,        // per photo beyond last tier
  PRINT_ONLY_FACTOR: 0.65,           // TODO(business): print share of edit_print base
  PARENT_BOOK_BUNDLE_MIN_QTY: 2,
  PAGE_MIN: 20,
  PAGE_MAX: 120,
  PHOTOS_PER_PAGE_MIN: 8,            // comfort capacity
  PHOTOS_PER_PAGE_SWEET: 6,
  VIDEO_REELS_QTY_MAX: 5,
  COVER_MOCKUPS: true,
};

/** Display-only per-sheet equivalent of a size's base (base covers 30 sheets). P-C9: "prices are for the sheets". */
export const perSheetOfSize = (base) => Math.round(Number(base || 0) / PRICE_RULES.BASE_SHEETS_INCLUDED);

/** Extract a matchable dimensions key from arbitrary text ("12×36", 'size-12x36', '12" × 18"'). */
const dimsKey = (s) => {
  const m = String(s || '').match(/(\d{1,2})\s*[×x]\s*(\d{1,2})/);
  return m ? `${m[1]}x${m[2]}` : '';
};

/* ── SysAdmin "Pricing Engine" overrides → estimator catalog (P-C9/P-C9b) ─
 * The owner can set Customer prices in EITHER editor:
 *   • CMS Studio (uiadmin → Catalog) — the authoritative catalog values.
 *   • SysAdmin Pricing Engine builder:
 *       album sizes  --> basePrice      (album base)
 *       print sheets --> pricePerSheet  (₹/sheet)
 *       services     --> basePrice      (video editing / covers / flex & banners)
 * This merge applies the builder numbers onto the live CMS catalog.
 * PRECEDENCE: CMS Studio wins by default — builder rows only fill items whose
 * CMS price is blank (see PRICE_PRECEDENCE). Rows that do not match (id,
 * dimensions, name slug or service keyword) are left untouched; empty arrays
 * leave the catalog untouched (offline-safe).
 */

/* Builder Service rows carry a `category` + `name` (see server seed). These
 * tables map a catalog item id → the keyword that identifies its builder row.
 * Order matters: earlier (more specific) matchers win, and each builder row is
 * claimed at most once, so one service never bleeds into several catalog items. */
const SERVICE_VIDEO_MATCHERS = [
  ['reels-shorts-pack', /instagram|shorts|viral|reels?\s*pack/i],
  ['4k-teaser-trailer', /teaser|trailer/i],
  ['same-day-edit', /same-?day|\bsde\b/i],
  ['pre-wedding-teaser', /pre-?wedding|love\s*story|save-?the-?date/i],
  ['traditional-muhurtham-doc', /traditional|long-?form|full\s*video|documentary/i],
  ['cinematic-feature-film', /feature|highlight|cinematic\s*film/i],
  ['audio-devotional-score', /audio|sound|noise|mastering/i],
];
const SERVICE_FLEX_MATCHERS = [
  ['whatsapp-video-invite', /whatsapp.*invit|animated.*invit|video\s*invit/i],
  ['telugu-patrika-foil', /patrika|foil.*card|wedding\s*card/i],
  ['mandap-entrance-flex', /mandap.*flex|entrance\s*flex/i],
  ['highway-hoarding', /hoarding|highway|roadside/i],
  ['rollup-standees', /standee|roll-?up/i],
  ['lifesize-cutouts', /cutout|life-?size/i],
];
const SERVICE_COVER_MATCHERS = [
  ['royal-velvet-foil', /velvet|foil/i],
  ['leatherette-box', /leatherette|briefcase/i],
  ['acrylic-glass', /acrylic/i],
  ['hardcover-matte', /hardcover.*matte|anti-?scratch/i],
];

/* ── Price precedence (owner-editable in BOTH CMS Studio and SysAdmin) ──
 *   'cms'     → CMS Studio catalog values win; SysAdmin builder rows only
 *               fill items that have NO CMS price (default, CMS-first).
 *   'builder' → SysAdmin builder rows override matching CMS values.
 * Flipped to CMS-first so the owner's CMS Studio edits are authoritative and
 * the SysAdmin engine acts as a fallback for anything left blank. */
export const PRICE_PRECEDENCE = 'cms';

export const applyBuilderOverrides = (catalog, sizeRows0 = [], sheetRows0 = [], serviceRows0 = []) => {
  /* double guard: only active builder rows may republish prices (caller filters too) */
  const sizeRows = sizeRows0.filter((r) => r.isActive !== false);
  const sheetRows = sheetRows0.filter((r) => r.isActive !== false);
  const serviceRows = serviceRows0.filter((r) => r.isActive !== false);
  const cmsFirst = PRICE_PRECEDENCE === 'cms';
  const hasNum = (v) => v !== undefined && v !== null && v !== '';
  const doc = catalog && typeof catalog === 'object' ? JSON.parse(JSON.stringify(catalog)) : {};
  if (!doc || typeof doc !== 'object') return doc;
  doc.albumPrinting = doc.albumPrinting || {};
  doc.albumPrinting.albumSizes = doc.albumPrinting.albumSizes || [];
  doc.albumPrinting.sheetStyles = doc.albumPrinting.sheetStyles || [];

  const byId = (rows) => new Map(rows.map((r) => [r.id, r]));

  const sizesById = byId(sizeRows);
  const sheetsById = byId(sheetRows);
  const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

  doc.albumPrinting.albumSizes.forEach((sz) => {
    const row = sizesById.get(sz.id)
      || sizeRows.find((r) => dimsKey(r.dimensions || r.name) === dimsKey(sz.id || sz.title))
      || sizeRows.find((r) => {
        const rl = slug(r.name);
        return rl.length > 2 && (slug(sz.title).includes(rl) || rl.includes(slug(sz.title).slice(0, 14)));
      });
    if (row && hasNum(row.basePrice)) {
      /* CMS-first: only fill when the CMS catalog left this size unpriced. */
      if (!cmsFirst || !hasNum(sz.clientBasePrice)) {
        sz.clientBasePrice = Number(row.basePrice);
        sz.clientPriceBadge = `₹${Number(row.basePrice).toLocaleString('en-IN')} (${PRICE_RULES.BASE_SHEETS_INCLUDED} Sheets / ${(PRICE_RULES.BASE_SHEETS_INCLUDED * 2)} Pages)`;
        sz._sysadminPriced = true;
      }
    }
  });

  doc.albumPrinting.sheetStyles.forEach((sh) => {
    const row = sheetsById.get(sh.id)
      || sheetRows.find((r) => {
        const rl = slug(r.name);
        return rl.length > 2 && (slug(sh.title).includes(rl) || rl.includes(slug(sh.title).slice(0, 14)));
      });
    if (row && hasNum(row.pricePerSheet)) {
      /* CMS-first: only fill when the CMS catalog left this sheet unpriced. */
      if (!cmsFirst || !hasNum(sh.clientPricePerSheet)) {
        sh.clientPricePerSheet = Number(row.pricePerSheet);
        sh._sysadminPriced = true;
      }
    }
  });

  /* ── Builder services → a-la-carte video / flex / cover prices ──────────
   * Each builder row is claimed at most once (`usedRows`) so a single service
   * never overwrites several catalog items; no match ⇒ CMS price is kept. */
  const usedRows = new Set();
  const num = (v) => (v === undefined || v === null || v === '' ? null : Number(v));
  const claim = (catRe, nameRe) => {
    const row = serviceRows.find(
      (x) => !usedRows.has(x) && catRe.test(String(x.category || '')) && nameRe.test(String(x.name || '')),
    );
    if (row) usedRows.add(row);
    return row;
  };
  const applyList = (list, matchers, catRe, field) => {
    (list || []).forEach((item) => {
      const m = matchers.find(([id]) => id === item.id);
      if (!m) return;
      const row = claim(catRe, m[1]);
      const p = row ? num(row.basePrice) : null;
      /* CMS-first: only fill when the CMS catalog left this item unpriced. */
      if (p !== null && (!cmsFirst || !hasNum(item[field]))) {
        item[field] = p;
        item._sysadminPriced = true;
      }
    });
  };

  applyList(doc.videoEditing, SERVICE_VIDEO_MATCHERS, /video/i, 'clientPrice');
  applyList(doc.invitationsAndFlex, SERVICE_FLEX_MATCHERS, /flex|banner|invit/i, 'clientPrice');
  applyList(doc.albumPrinting.coverFinishes, SERVICE_COVER_MATCHERS, /print|album/i, 'clientExtra');

  return doc;
};

/* ── Normalise the CMS catalog into engine shapes ──────────────────────── */
export const normaliseCatalog = (catalog) => {
  const c = catalog || {};
  const albumSizes = c.albumPrinting?.albumSizes?.length ? c.albumPrinting.albumSizes : DEFAULT_SIZES;
  const sheetStyles = c.albumPrinting?.sheetStyles?.length ? c.albumPrinting.sheetStyles : DEFAULT_SHEETS;
  const covers = c.albumPrinting?.coverFinishes?.length
    ? c.albumPrinting.coverFinishes.map((f) => {
        const alias = COVER_CMS_ALIAS[f.id] || {};
        const legacy = DEFAULT_COVERS.find((x) => x.id === f.id);
        return {
          id: f.id,
          label: f.label || f.title,
          extra: Number(f.extra ?? f.clientExtra ?? alias.extra ?? legacy?.extra ?? 0),
          mockup: f.mockup || alias.mockup || legacy?.mockup,
        };
      })
    : DEFAULT_COVERS;
  const videos = c.videoEditing?.length
    ? c.videoEditing.map((v) => ({ id: v.id, title: v.title, price: Number(v.clientPrice ?? v.price ?? 6000), turnaround: v.turnaround || '3-5 Days', qtyMax: v.qtyMax || 1, qtyUnit: v.qtyUnit || 1, qtyLabel: v.qtyLabel }))
    : DEFAULT_VIDEOS;
  const flex = c.invitationsAndFlex?.length
    ? c.invitationsAndFlex.map((f) => ({ id: f.id, title: f.title, price: Number(f.clientPrice ?? f.price ?? 1800), qtyMax: f.qtyMax || 1, qtyUnit: f.qtyUnit || 1, qtyLabel: f.qtyLabel }))
    : DEFAULT_FLEX;
  return { albumSizes, sheetStyles, covers, videos, flex };
};

/* ── Pure helpers ─────────────────────────────────────────────────────── */
export const pagesToSheets = (pages) => Math.max(1, Math.ceil(Number(pages || 0) / 2));

/** Photos → recommended page count (rounded to multiple of 2, clamped 20..120). */
export const recommendPages = (photos) => {
  const p = Number(photos || 0);
  if (!p) return null;
  const sweet = p / PRICE_RULES.PHOTOS_PER_PAGE_SWEET;
  const rec = Math.ceil(sweet / 2) * 2;
  return Math.min(PRICE_RULES.PAGE_MAX, Math.max(20, rec));
};

/** Capacity copy: comfortable min photos for a page count. */
export const pageCapacity = (pages) => ({
  sheets: pagesToSheets(pages),
  photosMin: Math.floor(pages * 5),
  photosComfort: Math.floor(pages * PRICE_RULES.PHOTOS_PER_PAGE_SWEET),
});

const round2 = (n) => Math.round(Number(n) * 100) / 100;
const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

/* ── Distribution: scale a mix to a target sheet count proportionally ──── */
export const scaleMixToSheets = (mix, sheets) => {
  // mix: { groupOrSheetId: count } -> returns allocation honouring even (sheet) counts
  const keys = Object.keys(mix).filter((k) => mix[k] > 0);
  if (!keys.length) return {};
  const totalOld = keys.reduce((s, k) => s + mix[k], 0);
  const scaled = {};
  let allocated = 0;
  keys.forEach((k) => {
    const even = Math.max(2, Math.round(2 * (sheets * mix[k]) / totalOld / 2)); // even units
    scaled[k] = even;
    allocated += even;
  });
  // rebalance rounding drift onto the largest group
  const drift = sheets - allocated;
  if (drift !== 0) {
    const biggest = keys.reduce((a, b) => (scaled[a] >= scaled[b] ? a : b));
    const fixed = Math.max(2, scaled[biggest] + drift);
    scaled[biggest] = fixed % 2 === 0 ? fixed : fixed + (drift > 0 ? 1 : -1);
  }
  return scaled;
};

/* ── THE ENGINE ───────────────────────────────────────────────────────── */
/* CMS coverFinishes use descriptive ids and omit price fields — keep legacy
   retail premiums + real mockups attached via this alias table. */
export const COVER_CMS_ALIAS = {
  'acrylic-glass': { extra: 2500, mockup: '/images/cover-acrylic-3d.jpg' },
  'leatherette-box': { extra: 2800, mockup: '/images/cover-leatherette-box.jpg' },
  'royal-velvet-foil': { extra: 2200, mockup: '/images/cover-royal-velvet.jpg' },
  'hardcover-matte': { extra: 0, mockup: '/images/weddingalbums-layflat-album.png' },
};

export const SERVICE_INTENTS = Object.freeze({
  EDIT_PRINT: 'edit_print',
  ONLY_EDITING: 'only_editing',
  ONLY_PRINTING: 'only_printing',
  STANDALONE: 'standalone_services',
});

/**
 * priceQuote(config) → itemised quote.
 * config = {
 *   intent: 'edit_print'|'only_editing'|'only_printing'|'standalone_services',
 *   sizeId, pages, photos, finishMode: 'single'|'mix', singleSheetId, mix: {sheetId:count},
 *   coverId, engrave, parentBooks, express, city,
 *   videos: {videoId: qty}, flex: {flexId: qty}, catalog (from useContent)
 * }
 */
export function priceQuote(config = {}, rawCatalog = null) {
  const cat = normaliseCatalog(rawCatalog);
  const intent = config.intent || SERVICE_INTENTS.EDIT_PRINT;
  const size = cat.albumSizes.find((s) => s.id === config.sizeId) || cat.albumSizes.find((s) => s.id === 'size-12x36') || cat.albumSizes[1];
  const cover = cat.covers.find((c) => c.id === config.coverId) || cat.covers[0];

  const lines = [];
  const warnings = [];
  const add = (key, label, amount, detail) => lines.push({ key, label, amount: Math.round(amount), detail });

  /* Scope pipes: "album in scope" = a PHYSICAL album is produced (cover/engrave/parent books apply) */
  const printingInScope = intent === SERVICE_INTENTS.EDIT_PRINT || intent === SERVICE_INTENTS.ONLY_PRINTING;
  const editingInScope = intent === SERVICE_INTENTS.EDIT_PRINT || intent === SERVICE_INTENTS.ONLY_EDITING;
  const albumInScope = printingInScope;

  const pages = Math.min(PRICE_RULES.PAGE_MAX, Math.max(PRICE_RULES.PAGE_MIN, Number(config.pages) || 60));
  const sheetsFromPages = pagesToSheets(pages);

  /* Finish material allocation (for the receipt + print ops) */
  let allocation = null; // [{id,title,count,rate,total,group}]
  let avgRate = 0;
  if (albumInScope && config.finishMode === 'mix') {
    const keys = Object.keys(config.mix || {}).filter((k) => (config.mix[k] || 0) > 0);
    if (!keys.length) {
      allocation = [{ id: cat.sheetStyles[0].id, title: cat.sheetStyles[0].title, count: sheetsFromPages, rate: cat.sheetStyles[0].clientPricePerSheet, total: sheetsFromPages * cat.sheetStyles[0].clientPricePerSheet, group: cat.sheetStyles[0].group }];
    } else {
      allocation = keys.map((k) => {
        const sheetObj = cat.sheetStyles.find((s) => s.id === k) || cat.sheetStyles.find((s) => s.group === k) || cat.sheetStyles[0];
        return { id: sheetObj.id, title: sheetObj.title, group: sheetObj.group, count: config.mix[k], rate: sheetObj.clientPricePerSheet, total: config.mix[k] * sheetObj.clientPricePerSheet, ritualSection: sheetObj.ritualSection };
      });
    }
    avgRate = allocation.reduce((s, a) => s + a.rate, 0) / allocation.length;
  } else if (albumInScope) {
    const single = cat.sheetStyles.find((s) => s.id === config.singleSheetId) || cat.sheetStyles[0];
    allocation = [{ id: single.id, title: single.title, count: sheetsFromPages, rate: single.clientPricePerSheet, total: sheetsFromPages * single.clientPricePerSheet, group: single.group, ritualSection: single.ritualSection }];
    avgRate = single.clientPricePerSheet;
  }

  /* Effective sheet count = what the allocation ACTUALLY totals (mix truth > slider truth).
     UI guarantees these agree; engine trusts allocation so the receipt never lies. */
  const sheets = allocation ? allocation.reduce((s, a) => s + a.count, 0) : sheetsFromPages;
  const extrasSheets = Math.max(0, sheets - PRICE_RULES.BASE_SHEETS_INCLUDED);

  /* Base album (printing side) */
  if (printingInScope && intent !== SERVICE_INTENTS.ONLY_PRINTING) {
    // edit_print: legacy maths — base covers 30 sheets; extras charged at avg rate
    add('album', `${size.title} album base`, size.clientBasePrice, `Includes first ${PRICE_RULES.BASE_SHEETS_INCLUDED} sheets (${PRICE_RULES.BASE_SHEETS_INCLUDED * 2} pages)`);
    if (extrasSheets > 0) {
      const extraCost = Math.round(extrasSheets * avgRate);
      add('extra_sheets', `Extra pages (${extrasSheets * 2} pages)`, extraCost, `${extrasSheets} sheets × ${inr(avgRate)}/sheet`);
    }
  } else if (intent === SERVICE_INTENTS.ONLY_PRINTING) {
    // print-only: print share of base + full material for ALL sheets
    const printBase = Math.round((size.clientBasePrice - PRICE_RULES.EDITING_IN_BUNDLE) * PRICE_RULES.PRINT_ONLY_FACTOR);
    add('album_print_base', `${size.title} print base`, printBase, 'Press-ready production lead');
    const materialTotal = Math.round(sheets * avgRate);
    add('material', `Page finish material`, materialTotal, `${sheets} sheets of ${allocation[0]?.title || 'your finish'} × ${inr(avgRate)}`);
    if (extrasSheets > 0) add('print_extra', `Extended length`, Math.round(extrasSheets * avgRate * 0.5), `above ${PRICE_RULES.BASE_SHEETS_INCLUDED}-sheet standard`);
  }

  /* Editing side */
  if (intent === SERVICE_INTENTS.ONLY_EDITING) {
    const photos = Math.max(0, Number(config.photos) || 0);
    const tier = PRICE_RULES.EDITING_TIERS.find((t) => photos <= t.maxPhotos) || PRICE_RULES.EDITING_TIERS[PRICE_RULES.EDITING_TIERS.length - 1];
    const over = Math.max(0, photos - PRICE_RULES.EDITING_TIERS[PRICE_RULES.EDITING_TIERS.length - 1].maxPhotos);
    add('editing', `Photo editing & album design (${photos} photos)`, tier.price, photos > PRICE_RULES.EDITING_TIERS[PRICE_RULES.EDITING_TIERS.length - 1].maxPhotos ? `+ ${over} × ${inr(PRICE_RULES.EDITING_PER_PHOTO_ABOVE)}` : 'Culling · retouch · layout design');
    if (over > 0) add('editing_over', `Additional photos`, over * PRICE_RULES.EDITING_PER_PHOTO_ABOVE, 'Professional layer editing');
  } else if (intent === SERVICE_INTENTS.EDIT_PRINT) {
    // editing is inside the bundle; show as included for trust (no price line)
    add('editing_incl', 'Professional editing & design', 0, 'Included in bundle — no third-party coordination');
  }

  /* Cover */
  if (albumInScope && cover.extra > 0) add('cover', cover.label, cover.extra);

  /* Engraving */
  if (albumInScope && config.engrave) add('engrave', '24K Gold name engraving on cover', PRICE_RULES.ENGRAVE_FEE);

  /* Parent books */
  const parentBooks = Math.min(4, Math.max(0, Number(config.parentBooks) || 0));
  if (parentBooks > 0) {
    const gross = parentBooks * PRICE_RULES.PARENT_BOOK_PRICE;
    const disc = parentBooks >= PRICE_RULES.PARENT_BOOK_BUNDLE_MIN_QTY ? Math.round(gross * PRICE_RULES.PARENT_BOOK_BUNDLE_DISCOUNT) : 0;
    add('parent_books', `Parent pocket books × ${parentBooks}`, gross - disc, disc ? `${inr(PRICE_RULES.PARENT_BOOK_PRICE)} each · bundle −${inr(disc)}` : `${inr(PRICE_RULES.PARENT_BOOK_PRICE)} each`);
  }

  /* Video add-ons (qty aware) */
  Object.entries(config.videos || {}).forEach(([id, qty]) => {
    const v = cat.videos.find((x) => x.id === id);
    if (!v || !qty) return;
    add(`video_${id}`, `${v.title}${qty > 1 ? ` × ${qty}` : ''}`, v.price * qty, v.turnaround ? `Turnaround ${v.turnaround}` : undefined);
  });

  /* Invites / flex (qty aware) */
  Object.entries(config.flex || {}).forEach(([id, qty]) => {
    const f = cat.flex.find((x) => x.id === id);
    if (!f || !qty) return;
    add(`flex_${id}`, `${f.title}${qty > 1 ? ` × ${qty}` : ''}`, f.price * qty, f.qtyLabel && qty > 1 ? `${inr(f.price)} per ${f.qtyLabel}` : undefined);
  });

  /* Express */
  if (config.express) add('express', 'Express production — 48-hour SLA', PRICE_RULES.EXPRESS_FEE);

  /* Totals */
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const savings = intent === SERVICE_INTENTS.EDIT_PRINT ? PRICE_RULES.EDITING_IN_BUNDLE : 0;

  /* Warnings */
  if (albumInScope) {
    const cap = pageCapacity(pages);
    if (config.photos && Number(config.photos) > cap.photosComfort * 1.5) {
      warnings.push(`Many more photos than pages fit comfortably — consider ${recommendPages(config.photos)} pages or tell us which shots to drop.`);
    }
    if (config.photos && Number(config.photos) < cap.photosMin * 0.4) {
      warnings.push(`${pages} pages with only ${config.photos} photos means sparse layouts — ${Math.max(20, Math.ceil(config.photos / PRICE_RULES.PHOTOS_PER_PAGE_SWEET / 2) * 2)} pages is usually perfect.`);
    }
  }

  /* Delivery ETA */
  const etaDate = (days) => new Date(Date.now() + days * 864e5);
  const fmtEta = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const hasSDE = Boolean((config.videos || {}).video_sde);
  const deliveryEtaText = config.express
    ? `Ready by ${fmtEta(etaDate(2))} (Express)`
    : hasSDE && !albumInScope
      ? `Released same evening`
      : `Ready by ${fmtEta(etaDate(7))}`;

  return {
    intent,
    albumInScope,
    editingInScope,
    printingInScope,
    size,
    cover,
    pages,
    sheets,
    extrasSheets,
    allocation,
    avgRate,
    lines,
    subtotal,
    savings,
    total: subtotal,
    gstIncluded: true,
    capacity: pageCapacity(pages),
    deliveryEtaText,
    warnings,
    helpers: { inr },
  };
}

export default { priceQuote, normaliseCatalog, recommendPages, pageCapacity, pagesToSheets, scaleMixToSheets, PRICE_RULES, SERVICE_INTENTS, DEFAULT_SIZES, DEFAULT_SHEETS, DEFAULT_COVERS, DEFAULT_VIDEOS, DEFAULT_FLEX, perSheetOfSize, applyBuilderOverrides, PRICE_PRECEDENCE, dimsKey };
