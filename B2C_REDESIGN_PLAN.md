# B2C CLIENT PANEL — FULL REIMAGINING PLAN
**Weddingalbums.in · "Simple for Indian families, premium for studios"**
Version 1.0 — October 2026 · Adds to: `IMPLEMENTATION_PLAN.md`, `PLAN.MD`

---

## 1. THE PROBLEM (what clients told us / audit findings)

| # | Problem today | Impact |
|---|---|---|
| E1 | Estimator has **no album page-count selection** presented as the primary choice (only a "sheets" slider buried in single-sheet mode; multi-sheet mode hides it entirely) | Couples can't answer their #1 question: *"How many pages am I buying?"* |
| E2 | Estimator never asks **what they actually need: photo editing, album printing, or both** (the builder supports `edit_and_print / only_editing / only_printing / standalone_services` but the estimator can't steer it) | Quotes mix services; builder closes the wrong pipeline; ops sees wrong tasks |
| E3 | Pricing math lives **only inside InstantEstimator.jsx** (269-line memo) — BookingPage/Checkout re-derive prices differently | "Estimate said ₹21,000, checkout says ₹23,900" → trust loss |
| E4 | Jargon everywhere: *sheets, spreads, GSM, substrate, soft-proof, layflat* | Indian retail clients think in **pages, photos, rupees, delivery days** |
| E5 | Desktop-first cards & hover-only affordances; mobile funnel is 9 vertical scrolls before any price | 70%+ of AP traffic is mobile |
| E6 | No parent/family copy, no photo-count guidance, no qty pickers for invites/flex | Missed upsell and repeated WhatsApp back-and-forth |

**Business goal:** a guided estimator that a non-technical client completes in **under 90 seconds**, producing a WhatsApp-able quote AND a pre-filled booking — converting estimates into orders, and printing-or-editing intent directly into the correct ops pipeline.

---

## 2. NEW JOURNEY (reimagined funnel)

```
LAND →  "Tell me about your wedding" (3 calm steps)
   1. WHAT DO YOU NEED?   →  ✍️ Editing only  🖨 Printing only  👑 Editing + Printing (BEST VALUE)  🎬 Only video/flex extras
   2. YOUR ALBUM          →  Event type · Album size (visual to-scale cards) · PAGES slider
                             (auto-suggested from photo count) · Page material chips
                             (Single-tone or Ritual-mix in plain Telugu/English) · Parent book qty
   3. COVER & EXTRAS      →  Cover finish (real mockup photos) · Name engraving · Express delivery
                             Video & Invite add-ons with quantities
   = YOUR QUOTE           →  Sticky itemized receipt, always visible
                             [WhatsApp this quote]  [Start my order →] (goes to /booking pre-filled)
```

Booking builder ("/booking") remains the deep configurator, but it **inherits** the estimator's choices and only asks what's missing.

---

## 3. DESIGN SYSTEM — "Deciphered Luxury"

Keep the gold-on-ink identity; make every word and control understandable.

### 3.1 Tokens (add to `client/src/index.css`)
| Token | Value | Use |
|---|---|---|
| `--gold` | `#D4AF37` | primary accent (unchanged) |
| `--gold-soft` | `#E6C667` | hover / icon fills |
| `--ink` | `#050505`, `--ink-2 #0a0a12` | page & card backgrounds |
| `--ivory` | `#F7F3EA` | light text on dark, light sections |
| `--trust` | `#22C55E` | "included", success, savings |
| `--warn` | `#F59E0B` | express/add-on badges |
| `--radius` | 14px cards / 999px pills | |
| `--shadow-gold` | `0 8px 40px rgba(212,175,55,0.15)` | CTA emphasize |
| Type | Display: Cormorant Garamond (serif, unchanged) · UI/body: **Inter 15–16px** · Telugu: **Noto Sans Telugu** for every `lang === 'TE'` string | |
| Type scale | Display 44/56 · H2 32 · H3 22 · body 16 · caption 13 (never below 12) | |
| Motion | 160–220ms ease-out, fade+8px rise; honour `prefers-reduced-motion` (already in LazyImage) | |
| Touch | All tap targets ≥48px; primary thumb zone bottom bar on mobile | |

### 3.2 Language rules ("Deciphered copy")
| Jargon today | Client-facing copy |
|---|---|
| Sheets (sh) | **Pages** (show "pages" primary, sheets only in review notes: "30 pages = 15 sheets") |
| Substrate / Sheet style | **Page finish** — "Gold Gloss (jewellery pages)", "Velvet Matte (portraits)", "Silk Pattu (ritual wear)", "Magic Waterproof (family & kids)" |
| GSM | drop entirely from cards (tooltip only) |
| Soft-proof | **"Free pre-print preview on WhatsApp"** |
| Layflat | **"Opens fully flat — no middam cut on faces"** |
| Turnaround | **Delivery days**, shown as date: *"Ready by Fri, 24 Oct"* (computed from today + SLA) |

All new strings route through one helper: `client/src/lib/i18n.js` — `t('est.pages', lang)` with EN/TE pairs (Telugu first where catalog already has it). Pairs reviewed for Andhra phrasing.

---

## 4. ESTIMATOR 2.0 — COMPONENT SPEC (answers E1, E2, E6)

Rewrites `client/src/components/blocks/InstantEstimator.jsx` (+ fresh CSS, replace 794-line file with ~640 lines of clean, typed-shape logic; CSS full rewrite).

### 4.1 Step 1 — Service type (NEW, default: Editing + Printing)
| Option key | Copy (EN/TE) | Effect on quote |
|---|---|---|
| `edit_print` | **Editing + Printing** 👑 "One roof, zero coordination" | full formula; badge "Save ₹1,500 vs separate studios" |
| `only_editing` | **Photo editing only** "You print locally / have design ready" | she-cull+edit per-photo tiers; hide album size/materials/cover |
| `only_printing` | **Album printing only** "Your design, our Royal press" | print-only formula (material × pages + cover); hide editing upsells |
| `standalone_services` | **Video / invitations / flex only** | opens Step 3 lists directly; album step skipped |
| Fotter note | "Not sure? Choose Editing + Printing — 9 in 10 AP couples do." | |

Persists into builder intent via deep link (`?intent=…` already supported) → ops receives correct task type.

### 4.2 Step 2 — Your Album (only when album involved)
Inputs, each answering a real client question:
1. **"What's the occasion?"** — Wedding / Half-Saree (Langa Voni) / Sreemantham / Birthday / Corporate → sets default material preset copy (e.g., Half-Saree suggests Silk + Poly mix).
2. **Album size** — to-scale visual cards (CSS aspect boxes at true proportions, not just text), grouped Landscape / Vertical / Square / Parent-book; each card shows spread photo + "Actual size preview" hover/print.
3. **PAGES — the headline control (NEW):**
   - Big range slider **20 → 120 pages** (ticks 20/40/60/80/100/120), default 60.
   - **"How many photos will you share?"** number stepper + quick chips (200/400/600/1000) → *PageBudgetAdvisor* recommends pages: `ceil(photos / 8)` pages min, sweet-spot `photos/6`. One-tap "Use recommended 68 pages".
   - Live helper line: "60 pages comfortably holds ~360-480 photos."
4. **Page finish** — simplified from 6 sheets × counters to **two modes**:
   - *Single finish* — one chip row of 4 client materials (mapped from the 6 catalog sheets; Gold Gloss & Silk merge guidance).
   - *Ritual mix* (AP favourite, kept) — max **3 groups** with stepper steppers per group: Muhurtham / Reception & Portraits / Ritual wear / Family & Kids. Steppers 4→40 in steps of 2 per group; sum = pages. When user drags the page slider in mix mode, groups **auto-scale proportionally** (presets remain one-tap).
5. **Parent books** — qty stepper 0–4: "Mini copies of your album for parents & in-laws" (+₹3,200 each, discount −10% qty≥2).

### 4.3 Step 3 — Cover & Extras
- **Cover finish** cards using the *real generated mockups* `/images/mockup-acrylic-cover.svg`, `mockup-leatherette-embossed`, `mockup-velvet-gold-foil`, `mockup-layflat-spread` (currently unused on B2C!) with "what it looks like" alt text.
- **24K name engraving** toggle (+₹800): "Couple names in gold foil on cover".
- **Express** toggle (+₹1,999): shows computed date: "Instead of Fri 31 Oct → Tue 28 Oct".
- **Video add-ons** (collapse if Step1 ≠ extras; qty steppers for Reels pack 1–5 packs, SDE etc.).
- **Invites & flex** with **quantity pickers** (Patrika 100/250/500 cards; flex 1–4 pieces each).

### 4.4 Quote receipt (sticky)
- Desktop: right rail. Mobile: **sticky bottom bar** "Your album · 64 pages · ₹21,450 → See breakdown" that expands into a bottom-sheet receipt.
- Every rupee line itemised incl. savings rows ("Bundled editing+printing saved ₹1,500").
- **Delivery date** computed live ("Ready by Sat, 26 Oct" = today + 7d, or +2d express; SDE overrides to "teaser same evening").
- Actions: `Start my order → /booking?service=<intent>&size=…&pages=…&photos=…&finish=…&mix=<a:b:c>&cover=…&engrave=1&parentbooks=n&express=1&city=&name=&phone=` — **the committed param contract**; `WhatsApp this quote` pre-fills plain Telugu summary; "Download quote" → client-side PDF-lite (window.print of the receipt section styled for print).

### 4.5 Validation & good defaults
Every step pre-answers so a tap-through user gets a sane ₹ quote immediately (Wedding + 12×36 + 60p + Gold+Velvet mix + Acrylic) with prominent Change affordances; zero dead-ends.

---

## 5. ONE PRICING ENGINE (answers E3)

New module **`client/src/lib/pricing.js`** — single source of truth, consumed by Estimator, BookingPage, Checkout, Cart:

```js
priceQuote({ intent, size, pages, photos, finishes, cover, engrave, parentBooks,
             express, videos[], flex[], city }) →
{ lines: [...], subtotal, savings, gstNote, deliveryEta, capacity, warnings[] }
```

Rules (documented + unit-testable):
- Base price per size (from `catalog.albumPrinting.albumSizes`, fallback constants as today).
- Pages: first 60 included in base; each extra page = avg finish rate × 0.5 overage (i.e., per-sheet rate ÷2, matching today's maths).
- `edit_print`: editing included at bundle rate; add `savings` line 1500.
- `only_editing`: per-photo editing tier (≤300 → 4,999; ≤600 → 8,999; >600 → 13,999 + ₹6/photo above 800).
- `only_printing`: materials × sheets + cover (no editing upsells).
- Parent books: 3,200 × qty − 10% when qty ≥ 2.
- Engrave +800; Express +1,999 (free coupon line when order ≥ 30k? defer to P-C6).
- Videos/Flex exact catalog prices × qty.
- Output includes `warnings` (e.g., "120 pages with only 200 photos → consider 80 pages").

Add `client/src/lib/__tests__/pricing.test.mjs` (plain node assert runner) — guards regressions when catalog changes.

---

## 6. PAGE-BY-PAGE REIMAGINING (client panel)

| Page | Redesign essentials |
|---|---|
| **Home** | Hero: fewer words, one heading in plain English/Telugu, 2 CTAs ("Build my quote" → /#estimator, "See real albums" → /albums). Trust strip directly under hero: ★4.9 · 12,000+ albums · Insured courier · WhatsApp support. Replace dense "pillar" cards with **3 tiles**: Albums (starting ₹7,200) · Photo+Video Editing (per-event) · Invitations & Flex. Then Estimator 2.0 mid-page, then 4 latest albums (Portfolio grid) + Telugu toggle visible top-right. |
| **Services** | Two-track layout: **Printing track** vs **Editing track** vs **Add-ons**, each ending in "See price in 60s →" launching estimator pre-set to that intent (`?service=` contract both directions). |
| **Pricing** | becomes "Prices made simple": Estimator 2.0 + transparent "what changes cost" explainer table (pages += ₹X · express = ₹2k · parent book = ₹3.2k). No burried sheet tables (keep expanded-on-tap "Details for photographers" preserving full sheets catalog for studio visitors). |
| **Booking (builder)** | Adopt 4 clean steps: 1 Setup (inherited summary + missing fields only) 2 Media upload+preferences 3 Contact & delivery 4 Review & pay. Sticky receipt everywhere (same component as estimator). Auto-fill prize params; unknowns become inline questions not tabs. Reuse SmartPageSlider & PageBudgetAdvisor. |
| **OrderTracking** | Horizontal progress rail (already good) + photo header + delivery-date ETA + "Questions? WhatsApp" pinned. |
| **ClientDashboard** | Order cards get: cover thumbnail, delivery ETA chip, next-action CTA (approve proof / pay / upload), wallet visible on home tab. |
| **Proofing (/proofing/:id)** | Mobile-first controls: thumb-friendly tool row, pinch-zoom page, per-page comment, Approve turns green full-width bottom. |
| **Albums/Portfolio** | Real-album first; category chips use plain labels ("Muhurtham", "Reception", "Before the wedding", "Family"). |
| **Nav/Footer** | Nav = Home · Albums · Services · Prices · Track • language toggle • "Build my quote" gold button. Footer: WhatsApp helpline prominent, festival greeting microcopy, *simplified* legal row. |

---

## 7. MOBILE-FIRST SPEC (answers E5)

- **Bottom sticky bars** for estimator + booking (quote total + Continue / See breakdown).
- All option grids: `grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))` → ≥2 columns even on 320px; never horizontal-scroll-only.
- Inputs `font-size: 16px` (no iOS zoom), `inputmode="numeric"` on steppers.
- Accordion groups instead of long scroll; step transitions slide horizontally with progress dots (4 dots).
- Steppers replace number inputs where possible (+/− 52px circles; value read-only between).
- Drawer nav gets estimator quick-link + language toggle.

---

## 8. ACCESSIBILITY & PERFORMANCE

- Contrast ≥ 4.5:1 for body text on all glass surfaces (bump `rgba(255,255,255,0.45)` → 0.6 min for informative text).
- Every option card: real `<button>`/`role="radio"` in `role="radiogroup"`; arrows navigate; focus-visible gold ring.
- `aria-live="polite"` on the receipt total; alt text describes materials ("gold glossy page with jewelry photo").
- Images: LazyImage everywhere (already built) + Estimator mockups in `images/opt` webp (from P1 pipeline) — LCP target < 2.5s on 4G.
- Bundle: InstantEstimator + CSS ≤ 40KB gzip; icon imports audited (no barrel explosion).

---

## 9. FILE INVENTORY (implementation scope)

| Phase | New | Modified |
|---|---|---|
| **P-C1** | `client/src/lib/pricing.js`, `lib/i18n.js`, `lib/__tests__/pricing.test.mjs` | content.json catalog keys frozen (audit names) |
| **P-C2** | `SmartPageSlider.jsx`, `PageBudgetAdvisor.jsx`, `QuoteReceipt.jsx`, `OptionCard.jsx`, `EstimatorStepper.jsx` (components/wizard/…) | `InstantEstimator.jsx` full rewrite, `InstantEstimator.css` full rewrite |
| **P-C3** | — | `BookingPage.jsx` (param contract `pages/photos/mix/engrave/parentbooks/service` + Step-1 SETUP summary + receipt reuse), `Cart.jsx`, `Checkout.jsx` (consume pricing lib) |
| **P-C4** | `client/src/lib/tokens.css` | `index.css` (tokens, buttons, type scale), Home/B2C/Services/Pricing section CSS, Navbar/Footer polish |
| **P-C5** | — | mobile pass across estimator/builder/tracking/dashboard/proofing; `MockWhatsApp` untouched |
| **P-C6** | QA checklist file | sitemap/OG update, `IMPLEMENTATION_PLAN.md` status |

Server: **no API changes required** (orders carry full `data`; intent/task mapping already exists). Content catalog keys audited so estimator/builder agree on ids.

---

## 10. PHASES & ACCEPTANCE

| Phase | Deliverable | Acceptance |
|---|---|---|
| **P-C1** Pricing core | `pricing.js` + tests + i18n helper | `node lib/__tests__/pricing.test.mjs` all-pass; same total from estimator & builder for 20 sample configs |
| **P-C2** Estimator 2.0 | rebuilt component + 4 subcomponents + CSS | Guides: service-type → pages → finish → cover; quote & deep-link correct on mobile/desktop |
| **P-C3** Builder contract | deep-link intake + shared receipt + 4-step flow | `/booking` receives every param; no double pricing logic left in BookingPage |
| **P-C4** Design system | tokens.css + restyled shared UI | Home/Services/Pricing pass visual QA; no legacy purple/vite colors remain |
| **P-C5** Mobile pass | sticky bars, steppers, drawers | 360px flow: estimate → booking complete; tap targets ≥48px; no horizontal scroll |
| **P-C6** QA & ship | a11y (axe), Lighthouse ≥ 85 mobile perf on Home/order path, builds green ×5 | checklist ticked; sitemap + plan updated |

**Sequencing note:** P-C1+P-C2 unblock 80% of the user-visible value; do them first, builder refactor next, polish last.

---

## 11. RISKS & GUARDRAILS

- **Catalog drift** (`content.json` vs fallback constants): pricing.js reads from the SAME feed endpoints (already `global.servicesCatalog`) and tests pin 6 sentinel SKUs (12×36 base, Gold rate, Velvet rate, Acrylic premium, Express, Patrika).
- **Telugu quality:** new TE strings need one review pass (strings isolated in `i18n.js` by design).
- **Revenue safety:** no pricing rule changes silently — every rate today is carried over; savings messaging must come from engine, not hardcoded JSX.
- **Old deep links:** BookingPage `?sheets=` remains accepted (maps to pages via ×2) for previously shared URLs.
- **CMS interplay:** estimator reads catalog via ContentContext; uiadmin edits propagate — P-C2 changes defaults only if catalog empty.

---

*Prepared as the client-panel companion to IMPLEMENTATION_PLAN.md. On approval, start with P-C1 (pricing engine + i18n) and P-C2 (Estimator rebuild).*

---

## 12. AS-BUILT (2026 — implementation record)

### 12.1 P-C7 — Global bilingual (EN ⇄ Telugu) ✅
- `client/src/context/LanguageContext.jsx`: persists `site_lang`, dispatches `languageChange`, sets `html[lang]`.
- Navbar / BookingPage / InstantEstimator consume it; Telugu webfont (Noto Sans Telugu) + `html[lang="te"]` rules live in `index.css`.
- Header carries ONE global EN/TE toggle for the whole site.

### 12.2 P-C9 — Services Architecture 2.0 (as-built) ✅
- **Panels**: estimator step-1 organises 📦 Packages → ✍️ Editing → 🖨️ Printing (sheet types & sizes) → 🎬 Video (grouped social/film/live/audio). Everything separately choosable or clubbed — copy says "club it or split it".
- **Sheet taxonomy**: 11 sizes (incl. 15×30 Royal Square Jumbo ₹13,200) + 9 finishes (incl. NTR Matte ₹85 / NTR Glossy ₹95 / Glitter ₹105 — `TODO(business)` rates) synced across `content.json` and `server/content_fallback.json`; size-detail strip + selected-finish explainer card + lay-flat binding note + "Photographer Standard" preset.
- **Engine**: one `client/src/lib/pricing.js` (legacy rates verbatim; extras = avg per-sheet rate × extra sheets; `only_printing` base = round((base−4500)×0.65) + material). Package cards quote via `pkgQuote` — the SAME engine — so card totals == receipt lines.
- **Marquee**: time-based rAF rebuild, seam-measured, reduced-motion honoured.
- **Deep links**: `?sheets=` legacy accepted; `?size=` incl. `size-15x30` intake on BookingPage.

### 12.3 P-C9 extension — Owner-built packages in the SysAdmin panel ✅
The couple-facing package cards now come from the **SysAdmin Pricing Engine**, not the codebase:
1. **Server**: `packages.apply JSONB` added (idempotent `ALTER TABLE … ADD COLUMN IF NOT EXISTS`) via `server/db_postgres.js`; `POST/PUT /api/packages` parse `apply` when sent as a string (`server/routes/admin.js`); public `GET /api/packages` passes `apply` through untouched.
2. **SysAdmin builder UI** (`sysadmin/src/pages/PricingEngine.jsx`, Packages tab): "🧮 Estimator Product Builder (price by sheets)" — size select (client-catalog prices), even-page stepper (60 pages = 30 sheets), per-sheet **mix steppers** showing each finish's ₹/sheet, cover select, parent-books, video chips (click-to-include w/ price), engraving toggle, plus a **live `quotePreview` total + itemised lines** (`sysadmin/src/lib/quotePreview.js` mirrors the client engine — labelled *approximate*; client estimator remains the authoritative receipt).
   - "Wire to Client Estimator" toggle → saved with the row as `apply` JSON; unwired rows stay marketing cards sent to BookingPage.
   - Owner sets whatever the business wants (weddings AND events: tier text is free-form, e.g. "Muhurtham Lite", "Event Desk Suite") — curated presets are only the offline fallback.
3. **Estimator contract** (`client/src/lib/packages.js`):
   - `mapSysadminToConfig` prefers an explicit `pkg.apply` (tier-keyword heuristics remain the fallback).
   - `resolveIdLike` tolerantly resolves size/cover/mix ids across engine-default ⇄ CMS spellings (e.g. `leatherette` ⇄ `leatherette-box`) — protects both curated rows and sysadmin rows from silent falls-back.
   - `resolveVideoMap` claims each CMS video row ONCE (id tested before title; used-pool) — fixes the cinematic-title double-count.
4. **Curated fallback slimmed** (they were "too high" because the full video menu was auto-bundled):

| Fallback tier | Album-side sheet math | Videos carried | Engine total |
|---|---|---|---|
| Silver (Economy) — 12×30, 30 sheets (24 NTR Matte + 4 Silk + 2 NTR Glossy) | ₹10,500 | Teaser only | **₹16,500** |
| Gold (Standard) — 12×36, 40 sheets (22 Velvet + 12 Metallic + 6 Silk) | ₹12,500 + 10 extra @avg130 = ₹1,300 + Leatherette ₹2,800 | Teaser + Reels | **₹26,100** |
| Platinum (Luxury) — 12×18-vert, 50 sheets (12 Glitter + 22 Velvet + 16 Metallic) | ₹9,800 + 20 extra = ₹2,333 + Acrylic ₹2,500 + Engrave ₹800 + 2 parent books ₹5,760 | Teaser + Reels + 4K Feature | **₹40,693** |

- Sheet-price parity is pinned by tests: totals must be **identical on the CMS-shaped catalog and the engine-default catalog** (`pkgQuote id-resolution` test, 24/24 pass).
- Every package card shows `· priced by sheet math` and itemises the same lines the receipt shows — no marketing numbers anywhere.

### 12.4 Verification (2026-10-16)
- Tests: `node client/src/lib/__tests__/pricing.test.mjs` → **27/27 PASS** (added `perSheetOfSize` + `applyBuilderOverrides` suite).
- Builds: client 521.68 kB (gzip 137 kB) + sysadmin 124.07 kB — green.
- Browser (dev :5174, backend :4000 down → CMS fallback): size cards render `₹12,500 · Most Popular in AP · ≈₹417/sh` (+ per-sheet equivalents for all 11 sizes); size-detail strip shows `≈ ₹417/sheet · 30 sheets in base`; printing panel carries the "Prices are for the sheets only — every base includes 30 sheets (60 pages); extra sheets are billed at the finish's ₹/sheet rate." explainer (TE mirrored). Package cards stay ₹16,500 / ₹26,100 / ₹40,693; apply-flow intact. (Screenshots blocked by harness desktop-window requirement; DOM asserted instead.)
- Backend CRUD (`apply` column incl.) compiles but needs a live `:4000` run to click through; next owner session: open SysAdmin → Pricing Engine → Packages → wire & price their own weddings/events.

### 12.5 P-C9b — Estimator prices ARE sysadmin-built ("prices only for the sheets") ✅
- **Single source of truth:** `ContentContext` now merges SysAdmin Pricing-Engine rows onto the CMS catalog at load: `GET /api/builder/album-sizes` → `clientBasePrice` (+ badge) and `GET /api/builder/sheets` → `clientPricePerSheet`, matched by id → dimensions-key ("12×36") → name-slug; only `isActive` rows may republish; offline/empty rows leave the catalog untouched.
- **Engine helpers** (`client/src/lib/pricing.js`): `perSheetOfSize(base) = round(base/30)` for display; `applyBuilderOverrides(catalog, sizeRows, sheetRows)` — unit-tested incl. inactive-row guard and offline no-op.
- **Client framing:** every album-size card shows the per-sheet equivalent (`≈₹417/sh`), the selected-size strip explains `30 sheets in base`, and the 🖨️ printing panel opens with the sheets-only explainer (EN + TE).
- **Sysadmin framing:** sizes/sheets tabs carry the hint that Customer prices publish straight into the couple estimator; size cards show `🧻 ≈₹X/sheet · base covers 30 sheets` so the owner always knows what couples will see.

### 12.6 P-C10 — "Instant cost estimator is not working" fix + wiring hardening (2026-10-16) ✅
- **Root cause (real, user-visible):** `ContentContext` declared `React.useMemo` **after** the loading-screen
  early-return. On a **cold cache / new origin / incognito** the hook count changed between renders
  (`Rendered more hooks than during the previous render`) → the whole app fell into the "System Recovery"
  error boundary; a reload silently fixed it (content had then been cached), which is why it looked intermittent.
  **Fix:** all hooks now run before any conditional return.
- **Prod-parity fix:** `client/src/lib/packages.js` had a second, **unguarded** `http://localhost:4000` API base
  (the only module in the whole monorepo like this) → would call localhost from production. Now uses the same
  guarded resolver (prod ⇒ `''` same-origin) while staying Node-testable.
- **Dev-port fix:** `client/vite.config.js` now pins `port: 5173, strictPort: true` so it can never silently
  drift onto b2b's 5174 (the source of the dead-tab confusion).
- **Verified end-to-end (server up):** builder row `{dimensions:"12×36", basePrice:9500}` → estimator renders
  **₹9,500 · ≈₹317/sh** (CMS was ₹12,500), `_sysadminPriced` on 4 sizes. Public endpoints 200; protected
  endpoints 401 without a token.
- Cross-app connectivity/roles/routes and the UI/UX inventory now live in
  [`SYSTEM_INTEGRATION_PLAN.md`](./SYSTEM_INTEGRATION_PLAN.md) and [`UI_UX_POLISH_PLAN.md`](./UI_UX_POLISH_PLAN.md).

### 12.7 P-C11 — Builder services drive videos/covers/flex + price-ownership copy (2026-10-16) ✅
- **G6 fixed:** `applyBuilderOverrides` now also maps SysAdmin builder **services** → a-la-carte **video**
  (`clientPrice`), **flex** (`clientPrice`) and **cover** (`clientExtra`) prices via keyword tables; each
  builder row is claimed at most once. `ContentContext` also fetches `/api/builder/services`. Live: all 7
  videos (₹7,500 teaser · ₹4,500 reels · ₹12,000 feature · ₹18,000 traditional · ₹10,000 SDE · ₹3,000 audio ·
  ₹15,000 pre-wedding), 4 flex items and 2 covers came from the builder.
- **Price-ownership copy fixed:** the estimator packages panel no longer says "SysAdmin configured" (misleading —
  prices are also set in CMS Studio). Chip is now neutral **"Set in Admin"**; the note reads *"Priced by you in
  CMS Studio · SysAdmin …"* (EN + TE). Both editors now carry a banner stating the runtime rule. *(Superseded — see §12.10: the rule was later flipped to CMS-first.)*
- Verified: client/uiadmin builds green; copy rendered live; tests 28 assertions pass.

### 12.8 P-UX0 — SysAdmin dialog polish + live-match badges (2026-10-16) ✅
- **New primitives:** `sysadmin/src/components/ui/ConfirmDialog.jsx` (accessible controlled modal: Esc/backdrop,
  focus, optional reason textarea, busy state) and `sysadmin/src/components/ui/Toast.jsx` (auto-dismissing,
  `role="status"`, stable timer via ref).
- **All SysAdmin native dialogs removed:** `Payouts`, `JobQC`, `UserManager`, `OrderManager`, `PricingEngine`
  now use `ConfirmDialog` + `Toast` (0 `window.confirm/prompt/alert` left in the app).
- **Pricing clarity in the Pricing Engine:** `sysadmin/src/lib/catalogMatch.js` mirrors the client matcher so each
  size/sheet/service row shows **✓ Live in couple estimator** or **⚠ No CMS match — CMS Studio value shows**, plus an
  *"N of M rows live"* count per tab. Verified in Node: `size-1`→live, unknown→not; `sheet-1` (generic seeded name)
  correctly reported **not live**; video/acrylic-cover/hoarding service rows→live, photo-editing→not.
- Verified: `npm --prefix sysadmin run build` green.

### 12.9 P-UX1 — Native dialogs eliminated across all 5 apps (2026-10-16) ✅
Replaced every blocking `window.alert/confirm/prompt` in the platform. Repo-wide grep now matches only doc
comments in the primitives — **0 native dialogs remain**.

| App | Pages migrated | Primitive used |
|---|---|---|
| **sysadmin** | Payouts, JobQC, UserManager, OrderManager, PricingEngine | new `components/ui/ConfirmDialog` + `components/ui/Toast` |
| **b2b-portal** | Wallet, SubmitJob, B2BRegister | new `components/ui/Toast` (no confirm needed) |
| **editor-portal** | EditorRegister | **existing `ToastContext`** (`useToast().error`) |
| **uiadmin** | CalendarEditor, PageEditor, History | **existing `components/Toast`** + new `ui/ConfirmDialog` |
| **client** | BookingPage (8 validation + 1 info), ProfileSettings (sign-out) | **existing `components/Toast`** + new `ui/ConfirmDialog` |

Notes: reused each app's existing toast where one already existed (editor/uiadmin/client) rather than adding a
second system. Multi-line success alerts became single-line toasts; SubmitJob delays its `/dashboard` redirect
1.6s so the success toast is visible. All 5 apps build green; pricing tests still pass.

### 12.10 P-UX1b — UX-1 closeout: ErrorBoundary + states, and price-precedence flip (2026-10-16) ✅
- **C6 — ErrorBoundary everywhere:** new `src/components/ErrorBoundary.jsx` copied to b2b / editor / sysadmin /
  uiadmin; each `App.jsx` wraps its provider tree with a per-app label + accent (Studio Portal gold · Creator
  Suite gold · Ops Center `#0ea5e9` · CMS Studio `#f59e0b`). Friendly recovery card (Reload / Go home) replaces a
  blank page; the client's existing "System Recovery" boundary is untouched.
- **C4 — loading / empty / error states:** sysadmin `Dashboard` (pulse + error banner + Retry); b2b
  `B2BDashboard` / `JobHistory` / `BusinessAnalytics` / `Invoices` (error banner + inline error row + Retry;
  Analytics empty-state hint); `Invoices` also gained a real `@media print` stylesheet so "Print PDF" is clean.
- **Price precedence flipped to CMS-first** (`PRICE_PRECEDENCE = 'cms'` in `client/src/lib/pricing.js`): the CMS
  Studio catalog is authoritative; a SysAdmin builder row now only **fills items the CMS left unpriced** (it no
  longer overwrites a CMS price). Both editor banners rewritten to say exactly this.
- **`sysadmin/src/lib/catalogMatch.js` reworked to 3-state classification** (mirrors the client engine, now
  CMS-first aware): `fills` / `cms-wins` / `unmatched`, plus `matchCount` → `{ live, cmsWins, unmatched, total }`.
  Pricing Engine rows show the matching badge and the tab header shows the three counts. Node-verified.
- **Tests updated** (`pricing.test.mjs`): `applyBuilderOverrides` cases now assert CMS wins and builder only fills
  gaps (sizes, sheets, services). All pricing assertions pass; all 5 apps build green.
