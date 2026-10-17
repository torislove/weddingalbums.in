# WeddingAlbums.in — Full Platform Understanding & Implementation Plan
**Generated:** Oct 2026 · Source of truth: every source file read (all 6 apps + server + root configs)
**Status baseline:** Phases 1–11 written in PLAN.MD are built; deployment (12/13) is *partially* real and drifted (Postgres DB, not Mongo; 1 PM2 process, not 6; two deployment paths coexist).
**B2C client-panel redesign (Oct 2026):** P-C1→P-C4 as-built (estimator 2.0, one pricing engine, sheet-taxonomy panels, bundled packages priced per sheet, global EN/TE) — see `B2C_REDESIGN_PLAN.md` §12. P-C5/P-C6 in wrap-up; couple-facing packages AND estimator album-size/sheet prices are now SysAdmin-authorable (`packages.apply` JSONB + estimator-product builder with live per-sheet preview; builder rows merge onto the CMS catalog at load); curated fallbacks slimmed to ₹16,500/₹26,100/₹40,693 with shape-parity + builder-override tests (27/27).

---

## 1. Verified Platform & Connectivity Map

```
                        ┌────────────────────────────┐
   weddingalbums.in ────▶  client  (B2C site + portal)  ────┐
   studio.weddingalbums.in ─ b2b-portal (photographers) ────┤
   creator.weddingalbums.in → editor-portal (creators) ─────┼──▶ /api/* ──▶ Express server  (PM2 :4000
   ops.weddingalbums.in ────→ sysadmin  (operations) ───────┤              + Firebase `api` Function)
   cms.weddingalbums.in ────→ uiadmin   (CMS) ──────────────┘
                        └───────── Postgres (DATABASE_URL) / in-memory fallback
                                   Firebase: Auth · Firestore(proofing) · Storage(uploads) · FCM · Analytics
```

| App | Dev port | dist | Auth role (JWT aud) | Token keys |
|---|---|---|---|---|
| client | 5173 | `dist/` (root) | `b2c` | `token`, guest mode OK |
| b2b-portal | 5174 | `dist/studio` | `b2b` | `token` + `b2bToken` |
| editor-portal | 5175 | `dist/creator` | `editor` | `token` + `editorToken` |
| sysadmin | 5176 | `dist/ops` | `admin` | `sysadminToken` (fallback `adminToken`) |
| uiadmin | 5177 | `dist/cms` | `content_admin` | `uiadminToken` |
| server | 4000 | — | issues JWT per role | refresh cookie (7d, rotating) |

All portals share one pattern: Bearer access token (8 h) + httpOnly rotating refresh cookie via `POST /api/auth/refresh`, single retry on 401. Server routers: `/api/auth`, `/api/admin`, `/api/b2b`, `/api/editor`, `/api/client`, `/api/content`, `/api/public` (+ legacy `/api/builder`, `/api` aliases).

**Key data/auth facts**
- Order state machine: `DRAFT → CONFIRMED → IN_PRODUCTION → QC_REVIEW → DELIVERED → CLOSED` (admin transitions, audit-logged).
- Catalog: `packages` (+`includedServiceIds`), `services`, `sheet_types` (dual B2C/B2B pricing), `album_sizes` (+bundles).
- CMS: `content` (key `main_site`) with whole-doc publishing to `content_history`; media library = DB `media` + curated list.
- Uploads: `POST /api/upload` → Firebase Storage `uploads/<file>` → fallback disk (`server/uploads`, served at `/uploads`) → fallback base64.
- SSE bus `/api/events/stream` broadcasts `task:created` etc.
- Fallback content chain: API → `content_fallback.json` (server) / `content.json` (client/public) → localStorage cache.

---

## 2. Image & Mockup Asset Manifest

### 2.1 Generated this session (new assets, synced to all 5 `public/images/` dirs)
| File | Purpose | Fills gap at |
|---|---|---|
| `mockup-layflat-spread.svg` | Layflat 12×36 open-spread album mockup (gold-framed dual photo blocks + gutter shading) | Sheet styles / pricing boards, portfolio, b2b configurator |
| `mockup-acrylic-cover.svg` | 5 mm acrylic glass cover over leather, streak gloss + monogram | Cover finish (Acrylic +₹1500) |
| `mockup-leatherette-embossed.svg` | Italian leatherette debossed mandala + gold-foil monogram | Cover finish (Leatherette +₹1800) |
| `mockup-pocket-mini-book.svg` | Parent Pocket Mini Book bundle (1 main + 2 mini) | Album sizes — pocket bundle |
| `client-album-preview.svg` | Leatherette-emboss sample card for the **Sheet Styles** viewer | `SheetStylesViewer.jsx` swatch |
| `media-notification-icon.svg` | Gold aperture bell FCM notification icon | `firebase-messaging-sw.js` |
| `favicon.svg` (gold aperture) | Replaces the default **purple Vite favicon** in all 5 apps + client | `index.html` favicons |

**Fixed broken references:**
- `client/src/components/hub/SheetStylesViewer.jsx:159` — `client-album-preview.png` (missing) → now `client-album-preview.svg` ✔
- `client/public/firebase-messaging-sw.js:23` — `hero-1.webp` (missing) → now `media-notification-icon.svg` ✔

### 2.2 Existing used images (verified on disk)
`weddingalbums-home-hero.png` (hero + About bg), `weddingalbums-layflat-album.png` (services/portfolio/flipbook), `weddingalbums-talambralu.png` (pillar 03, gallery, AboutTeaser), `luxury-album-craftsmanship.jpg` (pillar 01), `cinematic-video-suite.jpg` (pillar 02), `bride-raw.jpg` / `bride-polished.jpg` (InteractiveBeforeAfter), `mangalya-dharana.png`, `saptapadi.png`, `family-blessings.png`, `appagintalu-farewell.png` (CraftsmanshipDetails), `bridal.jpg`, `prewedding.jpg` (flipbook/hub), `kalamkari-bg.jpg` (Contact/Careers/Testimonials/PageHero), `google-g.svg` (reviews bar + favicon), `bgm.mp3`.

### 2.3 Orphaned / decisions needed
- `exec-*.png` ×6 (2.4–2.6 MB each) — zero code references. → Replace with real production screenshots or delete from all mirrors.
- `cinematic.jpg` — unused (only `cinematic-video-suite.jpg` is consumed). → Candidate for Video task cards, else delete.

### 2.4 Known imagery weakness
Only **~5 hero/ritual photos recycled ~30 times**; Portfolio, B2C masonry, Blogs, ClientProofing are padded with Unsplash hotlinks (47 hits repo-wide). Portfolio page ignores the CMS gallery and hardcodes its own Unsplash list.

---

## 3. Critical Findings (blockers first)

| # | Severity | Finding | File |
|---|---|---|---|
| 1 | 🔴 NEW-BREAKER | LoginModal calls `/api/login`, `/api/register` — endpoints don't exist (server = `/api/auth/*`) → 404 | client/src/components/LoginModal.jsx:24 |
| 2 | 🔴 DATA-LOSS | Orders, Tasks, Projects, Carts, RefreshTokens, AuditLogs, Payouts, ContactLeads models are **memory-only** — restart wipes all business data | server/db_postgres.js:824–1034 |
| 3 | 🔴 SECURITY | All `/api/public` order/task/payment surfaces unauthenticated; `/pay/verify` has **no signature check**; `GET /api/admin/*configs` missing its guard | server/routes/public.js:119–470, admin.js:472 |
| 4 | 🔴 SECURITY | Seeded admin password `admin123`; `.env` committed-adjacent; JWT secret fallback constant | server/seed.js, auth.js:14 |
| 5 | 🟠 UX-BROKEN | uiadmin "Preview Live Site" hardcodes `http://localhost:5173` (dead in prod); "Operations Panel" link hardcodes 5176 | uiadmin App.jsx:210, AdminLogin.jsx:220 |
| 6 | 🟠 PATCH-NEEDED | b2b sidebar has dead nav links `/albums`, `/team`, `/sla` (no routes); client Blog links `/blog/:slug` (no route); Careers links `/login?role=editor` (unsupported) | b2b Sidebar.jsx:20–29, client Blog.jsx:64, Careers.jsx:46 |
| 7 | 🟠 Payments | Razorpay is mocked (`order_<hex>` locally); real SDK installed but unused; no webhook | server/routes/public.js:396–444 |
| 8 | 🟠 Performance | Hero/ritual PNGs 2.2–2.7 MB ship raw; no WebP/AVIF, no srcset, no LazyImage | client/public/images |
| 9 | 🟡 CMS | uiadmin dead code `services/api.js` (pages hand-roll fetch without 401-refresh); unified `servicesCatalog` duplicated at top level of content.json (lines 1578–2422); portfolios require whole-doc overwrite | uiadmin, client content.json |
| 10 | 🟡 DEAD CODE | PhotographerDashboard + EditorDashboard fully built but unrouted in client; `react-compare-slider` installed but unused | client App.jsx, sysadmin |
| 11 | 🟡 Docs drift | PLAN.MD references `d:/newsite`, Mongo migration; README unreadable UTF-16 | PLAN.MD, README.md |
| 12 | 🟡 Dup deploy | OCI-nginx-PM2 path *and* Firebase-hosting path both configured; must pick one canonical | deploy.sh vs firebase.json |

---

## 4. Implementation Plan

### P0 — Connectivity & breakage fixes (1 day) — ✅ DONE Oct 2026
- [x] Replace missing `client-album-preview.png` & `hero-1.webp` references (done — SVG assets generated).
- [x] Gold brand favicon in all 5 apps (done).
- [x] Fix `LoginModal.jsx:24` → `/api/auth/login`, `/api/auth/register` (+ `portalRole: 'b2c'`).
- [x] Add `/blog/:slug` route → new `BlogPost.jsx` full-article page (own body content, CTA, related links) + `LazyImage`.
- [x] Fix uiadmin preview URLs: new `src/config/urls.js` (env-driven VITE_PREVIEW_URL/VITE_OPS_URL/STUDIO/CREATOR), wired into App.jsx "Preview Live Site", PageEditor, GlobalEditor, PushNotificationEditor, AdminLogin ops link; `.env`s updated.
- [x] b2b dead nav: `Album Orders` now a real page (`AlbumOrders.jsx`, live `/api/b2b/albums`), `SLA Guarantees` now a real page (`SLA.jsx`); dead "My Team" removed.
- [x] Careers `/login?role=editor` now works: PortalLogin redirects creators to the Creator Portal (dev/prod aware).

### P1 — Image pipeline (2 days) — 🟡 LazyImage shipped
- [ ] Build script `tools/optimize-images.mjs` (sharp): all PNG/JPG → WebP + AVIF width-sets (hero 2880→768), quality 78; regenerate `exec-*` or delete.
- [x] Add shared `LazyImage` component (IntersectionObserver, deferral, blur-arrival, `prefers-reduced-motion`, zero layout shift) + progressive-reveal CSS — wired into Portfolio, FeaturedGallery, B2C, AlbumsShowcase, Blog, BlogPost.
- [ ] Replace remaining Unsplash hotlinks with locally stored curated photos (B2C/Blog/Flipbook fallbacks still hotlink).
- [x] Extend `CURATED_DEFAULT_IMAGES` (server/routes/content.js) with the 6 generated SVG assets (+dropped 7 Unsplash hotlinks from the admin catalog defaults); uiadmin Media Library now surfaces them.

### P2 — Mockup & dashboard wiring (3 days) — ✅ DONE Oct 2026
- [x] **b2b:** SubmitJob — interactive RAW→polished wedge preview under Editing Style Preset (bride-raw/bride-polished, drag to compare); live cover-finish mockup card wired to all 4 finishes (acrylic / leatherette / velvet+24K-foil has its own new mockup). SLA page ships the service-credit policy (10% credit, white-label, peak-season lanes).
- [x] **sysadmin QC:** Visual QC modal using the previously-unused `react-compare-slider` — RAW vs edited with job payload images when present, on-brand sample fallbacks, Esc/backdrop close, deliverable link.
- [x] **editor TaskQueue:** per-specialisation hero visual (Photo → bride-polished, Video → cinematic-video-suite, Album → layflat-spread mockup).
- [ ] Declutter: swap `exec-*.png` orphans or remove from all 5 mirrors.

### P3 — Data persistence (highest risk, 3 days)
- [ ] Implement real PG persistence for `Order`, `Task`, `Project`, `PayoutRequest` models (pattern: copy the `Content` upsert model — currently `contents/media/content_history` are the only tables that persist business state beside users).
- [ ] Replace memory-only `refresh_tokens`/`audit_logs`/`carts`/`contact_leads` with PG tables (schema already printed in `db_postgres.js:239–394`).
- [ ] Seed script guard: refuse `admin123` in production (`seed.js`), force-change on first login; document `.env` rotation + JWT secret rotation.

### P4 — Payments & orders (2 days)
- [ ] Real Razorpay: `orders.create` in `/pay/create-order`; verify HMAC signature in `/pay/verify`; add `POST /api/pay/webhook` (signature-verified) for authority; confirm fiscal fields on invoice.
- [ ] Order/Task & project routes behind auth (client may only read own `user_id`; b2b only `studio_id`); add Zod-style validation per payload.

### P5 — CMS / uiadmin polish (2 days)
- [ ] Delete dead `uiadmin/src/services/api.js` or make pages use it (gives 401 auto-refresh to Dashboard/MediaLibrary/Calendar).
- [ ] Add Publish **version list + rollback** UI reading `content_history` (data already written server-side).
- [ ] De-duplicate `servicesCatalog` top-level copy in content.json; migrate readers to `global.servicesCatalog`.
- [ ] RTL-rounded image-key heuristics in BlockEditor stay free-form; add crop-hint badges for hero-size fields.

### P6 — Deploy canonicalization (1 day)
- [ ] Choose one path (recommend: **Firebase Hosting + Functions**; keep nginx files only for OCI fallback).
- [ ] If OCI: fix `ecosystem.config.cjs` (single `max` cluster OK) + nginx `/uploads` alias; if Firebase: keep `firebase.json` rewrite + Storage-only uploads and drop host-alias copy step.
- [ ] Update PLAN.MD/README (encode UTF-8) to document reality: Postgres dual-mode, Firebase Storage upload chain, 6 dev processes / 1 PM2 process.

### P7 — SEO, compliance, QA (2 days) — 🟡 SEO done
- [x] Sitemap expanded: `/b2c`, `/albums`, `/order`, `/pricing`, `/muhurtham`, `/blog`, `/careers`, `/testimonials`.
- [x] Careers route handling (`/login?role=editor` → Creator Portal redirect with loading state UX).
- [ ] Terms/Privacy links on Booking.
- [ ] QA matrix: login+refresh per portal (5 e2e), booking→order→pay→invoice→track, submit-job→claim→QC→payout, CMS publish→client render + offline cache.

### P8 — Growth backlog
- [ ] Firestore proofing comment notifications via FCM (icon fix in place); Operations audit page (UI exists) reading `/api/admin/audit-logs`; settings page for brand config.
- [ ] Stock-portfolio acquisition: shoot/curate ~30 distinct Andhra ritual photos (Muhurtham, Jeelakarra, Talambralu, Mangala Snanam, Saptapadi, Appagintalu, Langa Voni, Sreemantham, 1st Birthday) replacing every Unsplash site.

---

## 5. Acceptance checklist for "all images ready"
- [x] No broken `<img>`/icon references anywhere (both fixed)
- [x] Album mockups exist for every sheet style × size × cover finish (7 on-brand SVG masters in all 5 mirrors)
- [x] Notification icon + brand favicon on-brand
- [x] Every portal dashboard visually wired (SubmitJob configurator, Visual QC, TaskQueue heroes, SLA policy page, Album Orders)
- [x] Progressive-image loading on storefront surfaces (LazyImage blur-arrival)
- [ ] WebP/AVIF optimized set committed (P1 — needs `sharp`, no local raster tool)
- [ ] 0 Unsplash hotlinks in production HTML (P1 — B2C/Blog/Flipbook fallbacks remain)
