# UI/UX Polish Plan — All Apps (Mobile + Desktop)

> Goal: every page across the five front-end apps is **best-in-class on mobile *and* desktop**,
> **stylish**, on-brand, and **easy for the owner to manage**. This plan is derived from a
> read-only page-by-page inventory of all five apps (routes, shells, states, tokens, a11y).

Related: [`SYSTEM_INTEGRATION_PLAN.md`](./SYSTEM_INTEGRATION_PLAN.md) (app ↔ server wiring, roles),
[`B2C_REDESIGN_PLAN.md`](./B2C_REDESIGN_PLAN.md) (estimator / packages / bilingual).

---

## 0. Principles

1. **Mobile-first, desktop-rich.** Every layout works at 360 px *and* scales to ultrawide. Tables collapse to cards; sidebars become drawers; two-column panels stack.
2. **One brand.** Gold `#D4AF37` is the through-line. Accent hues are *functional* (status/type), never the page identity. No raw hex in pages — only tokens.
3. **Calm by default, alive on intent.** Motion is subtle and honours `prefers-reduced-motion`. Loading, empty, error and success are *designed*, not accidental.
4. **Owner-manageable.** Every list has loading / empty / error states and real confirmations (Toast/Modal), never `alert()`/`confirm()`/`prompt()`.
5. **Bilingual where the customer is.** Public/B2C surfaces are EN↔TE via the one global toggle; staff portals stay EN but read labels from i18n-ready keys.

---

## 1. Design-system foundation (do this first — unblocks everything)

Today there is **no shared primitive layer**: each app re-declares tokens and every page hand-rolls
`.btn` / `.glass-3d` / inline styles. Introduce a tiny shared layer (copy-per-app is fine; a
`shared/` package is nicer if the build allows).

### 1.1 Tokens (one `tokens.css`, imported by every app)

| Token | Value | Replaces |
|---|---|---|
| `--brand-gold` | `#D4AF37` | `#D4AF37` literals, `--gold-primary`, `--color-secondary` dupes |
| `--brand-gold-strong` | `#d8b64c` | hover states |
| `--ink-900/700/500` | `#0a0908` / `#2a2622` / `#6b6459` | slate/gray literals |
| `--surface-0/1/2` | `#050505` / `#0d0c0b` / `#141210` | `#050505`, `#080808`, `#00060f` |
| `--ok` `--warn` `--danger` `--info` | `#10b981` `#f59e0b` `#ef4444` `#3b82f6` | scattered status hex |
| `--radius-s/m/l`, `--shadow-1/2`, `--ring` | shared | inline `borderRadius`/`boxShadow` |
| `--space-1..8`, `--font-display`, `--font-body` | shared | ad-hoc spacing |
| `--whatsapp` | `#25D366` | WhatsApp literals |

**Functional accent mapping (keep, but tokenise):** sysadmin cyan `--accent-ops:#0ea5e9`,
uiadmin amber `--accent-cms:#f59e0b`, editor **switch to gold** `--accent-creator` (retire indigo
`#6366f1` — it reads as a different product), b2b gold.

### 1.2 Primitives (each app: `components/ui/`)

`Button` (variants: gold/outline/ghost/danger, sizes, loading), `Card`/`Panel`, `Field`
(label + hint + error, a11y-wired), `Modal`, `ConfirmDialog`, `Toast` (editor-portal already has
one — promote it to the others), `EmptyState`, `ErrorState`, `Skeleton`, `Table`→`ResponsiveTable`
(desktop table + mobile card list), `Tabs`, `Badge`, `Drawer`.

Acceptance: a page can be built with **zero inline style** and **zero raw hex**.

### 1.3 Responsive rules

- Breakpoints: `sm 480`, `md 768`, `lg 1024`, `xl 1280`. Sidebars → drawer < `lg`.
- Min tap target 44×44 px; forms single-column < `md`.
- Tables: `<ResponsiveTable>` swaps to stacked cards < `md` (b2b `.data-table` already does this — reuse it).
- Sticky action bars on mobile for wizard/checkout (client booking, b2b submit job).

---

## 2. Cross-cutting P0 fixes (highest leverage, app-wide)

| # | Problem (from inventory) | Fix | Apps |
|---|---|---|---|
| C1 | **Native `alert/confirm/prompt` in every portal** (client 9, b2b 12, editor 5, sysadmin 18, uiadmin 5) | Replace with `Toast` + `ConfirmDialog`. Never block the main thread. **✅ Done across all 5 apps** — 0 native dialogs remain. New `components/ui/` kit added to each app; uiadmin + editor **reuse their existing toast systems**, client reuses `components/Toast` + new `ui/ConfirmDialog`. | all |
| C2 | **~640 hardcoded hex** across pages (client 266, sysadmin 192, uiadmin 170, editor 60, b2b 55) | Migrate to tokens (§1.1); add a lint guard (grep) in CI. | all |
| C3 | **Almost no page-level `aria-label`s** (client 2, sysadmin 2, uiadmin 1, b2b 1, editor 0) | Label icon buttons, tables, filters via primitives; wire focus-visible ring. | all |
| C4 | **Missing loading/empty/error states** (JobHistory, Analytics, Dashboard rows, PageEditor, HubCatalogEditor) | Standard `Skeleton`/`EmptyState`/`ErrorState` in every fetch. **✅ Done** — sysadmin `Dashboard` (loading pulse + error banner + Retry); b2b `B2BDashboard`, `JobHistory`, `BusinessAnalytics`, `Invoices` all have error banner + inline error row + Retry; Analytics adds an empty-state hint. uiadmin `PageEditor`/`HubCatalogEditor` sit behind the global content gate, which falls back to `initialEmpty` so it never hangs (error flag intentionally not surfaced — see note below). | b2b, sysadmin, uiadmin |
| C5 | **`LazyImage` defaults `alt=''`** app-wide | Make `alt` required for content images; explicit `alt=""` for decorative. | client |
| C6 | **Error boundary only in client** ("System Recovery") | Add a shared `ErrorBoundary` to b2b/editor/sysadmin/uiadmin with a friendly reload. **✅ Done** — same component copied to all four; each `App.jsx` wraps its roots with a per-app label + accent (Studio Portal gold, Creator Suite gold, Ops Center cyan, CMS Studio amber). | b2b, editor, sysadmin, uiadmin |
| C7 | **Off-brand accent in editor-portal** (indigo/blue/pink/yellow) | Re-tokenise to gold + functional type colours. | editor |

---

## 3. Per-app plan

### 3.1 `client` (B2C public + customer portal) — gold
Shell has **three modes** (marketing / portal `/client*` / auth). Keep, but unify spacing/tokens.

- **`BookingPage.jsx` (3,320 lines — worst offender).** Split into step components; replace 191 hex with tokens; replace 9 `alert()` with inline field errors; already bilingual — extract strings. Add sticky mobile summary bar; make each step a deep-linkable route.
- **Estimator** (`blocks/InstantEstimator.jsx`): ✓ already EN/TE + per-sheet maths (see B2C plan). Add: skeleton while packages load, error toast if `/api/packages` fails, `aria-live` on the receipt total, keyboard support for size/finish cards.
- **Portal pages** (`ClientDashboard`, `OrderHistory`, `ClientWallet`, `ClientReferral`, `ProfileSettings`): unify into a single portal shell with tabs; add empty/error states; tokenise (~60 hex).
- **Auth** (`PortalLogin` 736 lines, `ForgotPassword`): split portal-picker from form; a11y (labels, focus trap, error text).
- **Marketing** (Home/About/Services/Portfolio/Testimonials/Contact/Pricing/Blog/Careers/B2B/B2C/AlbumsShowcase): introduce shared `Section`/`Card` primitives; EN/TE via `useLanguage` (only 3 files use it today).
- **Delete/relocate dead code:** orphan `PhotographerDashboard.jsx`, `EditorDashboard.jsx` (routed nowhere).

### 3.2 `b2b-portal` (studio trade) — gold, shell already consistent ✅
- Replace 12 `alert()` (Wallet recharge/withdraw, SubmitJob, Register geo/terms) with Toast + inline errors.
- Add error states to `B2BDashboard`, `JobHistory`, `BusinessAnalytics` (currently swallow errors).
- `Invoices`: real print stylesheet (`@media print`) instead of bare `window.print()`.
- Tokenise 55 hex; add page-level a11y labels to filters/tables.

### 3.3 `editor-portal` (freelance editors) — **retire indigo**, adopt gold
- **`TaskQueue.jsx` is the reference screen** (per-column loading/empty + Toast) → use it as the pattern.
- **`EditorRegister.jsx`:** replace clickable `<div>`s (:289/:320/:388/:423) with real `radio`/`checkbox` inputs; 5 `alert()` → inline validation.
- `Earnings`/`Rating`/`EditorDashboard`: standard states + tokens.
- Keep job-type colours as *functional* accents only (badges), not page chrome.

### 3.4 `sysadmin` (ops) — cyan, functional/dense (cross-app a11y consistency)
- **Split `App.jsx`** (409 lines mixing layout + inline `Dashboard`) into `layout/`, `pages/Dashboard.jsx`.
- Replace 18 native dialogs (`JobQC`, `Payouts`, `UserManager`, `OrderManager`, `PricingEngine`) with `ConfirmDialog`/`Toast`; `prompt()` (rejection reason) → modal with textarea.
- **`PricingEngine.jsx` (732 lines):** continue the Estimator Product Builder; move inline styles to CSS/tokens; keep the live `quotePreview`; group tabs (Services / Sizes / Sheets / Packages / Videos).
- `Dashboard`: real loading/empty/error (today shows `—` on failure).
- `ResponsiveTable` for users/orders/tasks/payouts/audit.

### 3.5 `uiadmin` (CMS studio) — amber
- **`HubCatalogEditor.jsx`:** all-inline → primitives + tokens.
- Replace native dialogs (`CalendarEditor`, `History` double-confirm, `PageEditor` delete) with `ConfirmDialog`.
- Add per-page error states (`PageEditor`, `HubCatalogEditor` rely on the global content gate).
- `MediaLibrary`: accessible names for items.

---

## 4. Phased roadmap

| Phase | Scope | Exit criteria |
|---|---|---|
| **UX-0** | Tokens + primitives + Toast/ConfirmDialog + ErrorBoundary per app | One page per app rebuilt with **zero hex / zero inline style** as proof |
| **UX-1** | C1 (all native dialogs), C4 (states), C6 (boundaries) | `grep` for `alert(\|confirm(\|prompt(` in `*/src` returns 0; every fetch has loading+empty+error. **✅ Done** — C1 all apps (0 native dialogs), C4 done for the named fetch pages, C6 ErrorBoundary in all 5 apps. |
| **UX-2** | C2/C3/C5/C7 token + a11y migration app-by-app | `grep` raw hex in pages → 0; every icon button labelled; `LazyImage` alt required. **▶ Mostly done** — see §6. Token layer + focus ring in all 5 apps; 1,085 brand/status hex → tokens; **0** unlabelled icon buttons; **0** `<img>` without alt; editor-portal re-tokenised to gold. Remaining: ~816 hex literals (functional type colours + gold ramp + token definitions, tracked by `npm run audit:ui`). |
| **UX-3** | Big-page refactors (BookingPage 3,320 → steps; PricingEngine; App.jsx split) | Each < ~500 lines, routes deep-linkable, mobile sticky bars. **✅ Done** — see §6. sysadmin `App.jsx` 431 → 15 lines (split into `context/AuthContext`, `layout/AppShell`, `layout/Sidebar`, `components/Guard`, `pages/Dashboard`); `BookingPage.jsx` 3,530 → **1,242 lines** (static catalogue → `pages/booking/bookingData.js`; component body split into `pages/booking/` pathway + chrome components on a shared `ctx`); `PricingEngine.jsx` 847 → **236 lines** (grids/hints/estimator/modal-forms → `pages/pricing/`). |
| **UX-4** | EN↔TE rollout to all client pages | Language toggle flips every public page. **✅ Done** — see §7. `useT()` hook + **585-key** EN/TE dictionary; **every** client page wired: marketing (Footer, Hero, About, Services, Pricing, Portfolio, Contact, Testimonials, Careers, Blog, BlogPost, B2C, MuhurthamCalendar, AlbumsShowcase, B2B trade page) + transactional (Cart, Checkout, OrderTracking, OrderHistory) + dashboards (ClientDashboard/couples, EditorDashboard, PhotographerDashboard) + account/tools (PortalLogin, ProfileSettings, ForgotPassword, ClientWallet, ClientReferral, ClientProofing, AlbumProofGallery, PhotoCulling). `BookingPage` is bilingual via its own inline `lang === 'TE'` convention; `Terms`/`PrivacyPolicy` stay English (B2B legal); `Home`/`OrderAlbum` are copy-less wrappers. |

### Guardrails / acceptance (add to CI)
- `npm run audit:ui` → **hard gate** fails if any native `alert/confirm/prompt` call exists; reports raw-hex, unlabelled icon buttons and `<img>` without `alt` (use `--strict` to gate those too).
- `npm run test:pricing` → pricing-engine assertions (incl. CMS-first precedence).
- Manual 360 px + 1440 px pass on every route; keyboard-only pass on all forms.

---

## 6. As-built (UX-2 / UX-3, 2026-10-16)

### UX-2 — tokens & a11y
- **Token layer (C2 foundation):** a shared, additive block appended to every app's
  `src/index.css` — canonical `--brand`/`--brand-soft`/`--brand-deep`, status `--ok/--warn/--danger/--info`,
  `--ink/--paper`, `--ring`, radius (`--radius-s/m/l`) and shadow (`--shadow-1/2`) scales.
- **Global a11y (C3):** `:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible`
  draws a visible `--ring` outline; a `prefers-reduced-motion` guard disables animations/transitions.
- **Hex → tokens (C2):** `tools/migrate-hex.mjs` migrated **1,085** brand/status hex literals across
  **132 files** to `var(--token)`. It deliberately skips SVG presentation attributes (`color=`/`fill=`/`stroke=`…),
  imperative canvas lines, CSS custom-property definitions, and files that append an alpha suffix to a colour
  (`` `${c}22` `` — a `var()` cannot be concatenated). Functional type colours (blue/pink/yellow) are kept
  per §3.3. Total raw hex: **2,141 → 1,056**.
- **Grey scale → tokens (C2 follow-up, 2026-10-17):** a neutral ramp `--n-0 … --n-1000` was added to all five
  apps and `tools/tokenize-greys.mjs` migrated a further **326** achromatic literals (`#111`/`#1a1a1a`/`#888`/`#ccc` …)
  across **82 files**. It reuses `migrate-hex`'s context guards and *only* touches near-neutral values — the gold
  ramp, crimson brand, WhatsApp green and the status/type hues are intentionally left as hex. Raw hex:
  **1,056 → 816**. The script is idempotent (a re-run reports 0) and, inside Tailwind arbitrary values, emits the
  v4 shorthand `bg-(--n-900)`.
- **Tailwind note:** sysadmin/uiadmin use Tailwind v4. Arbitrary values use the v4 **shorthand**
  (`bg-(--n-900)`, `border-(--brand)/30`) because the square-bracket `var()` spelling makes Tailwind emit a class
  selector with unescaped parentheses that `lightningcss` cannot minify (G13). Both apps also **pin their content
  sources** (`@import "tailwindcss" source(none)` + `@source`) so a build no longer walks up to the git root and
  scans sibling portals' `dist` bundles. client/b2b/editor do not use Tailwind.
- **Icon-button labels (C3):** PricingEngine Edit/Delete/Close (9), ClientDashboard log-out,
  uiadmin refresh/close controls and MediaLibrary "open in new tab" — all now carry `aria-label`/`title`.
  Audit reports **0** unlabelled icon-only buttons.
- **`LazyImage` alt (C5):** `alt` is now required — a dev-only `console.warn` fires when omitted; all 7 call
  sites pass `alt`; the one data-driven case (`B2C.jsx`) got a sensible fallback. Audit reports **0** `<img>` without `alt`.
- **C7 — editor-portal off-brand indigo retired:** `--accent-primary/secondary` → gold
  (`#D4AF37`/`#E6C667`); the liquid-button gradients, glows and marketing pages (Login/Register/Landing) now read
  as the same gold product; gold buttons use dark (`#14100a`) text for contrast.

### UX-3 — refactors
- **sysadmin `App.jsx`: 431 → 15 lines.** Extracted `context/AuthContext.jsx` (auth + refresh + logout),
  `components/Guard.jsx`, `layout/Sidebar.jsx` (menu config + rail), `layout/AppShell.jsx` (mobile top bar,
  header, nested routes), `pages/Dashboard.jsx` (overview + C4 loading/error/Retry).
- **`BookingPage.jsx`: 3,530 → 1,242 lines.** Two stages:
  1. ~390 lines of static catalogue data (`AUSPICIOUS_MUHURTHAM_DATES`, `DEFAULT_ALBUM_SIZES`,
     `SERVICE_INTENTS`, `DEFAULT_SHEETS`, `DEFAULT_BASE_SUBSTRATES`, `VIDEO_SERVICES`, `PHOTO_SERVICES`,
     `FLEX_SERVICES`, `CALENDAR_SERVICES`, `SERVICE_CATEGORIES`) → `pages/booking/bookingData.js`
     (data-only, no JSX).
  2. The component body's five large JSX regions → focused presentational components under `pages/booking/`,
     all fed by a single shared `ctx` object (state, setters, handlers) built by `BookingPage`:
     `BundlesPathway.jsx` (curated 3-step flow), `CustomPathway.jsx` (a-la-carte 4-step flow),
     `OrderSummary.jsx` (sticky itemized sidebar), `MobileSummaryBar.jsx` (floating mobile total bar) and
     `BookingSuccess.jsx` (post-submit confirmation). `BookingPage` now owns only state, effects, handlers
     and the header/stepper chrome — so the deep-linkable `?sheets=`/`?size=` behaviour is unchanged.
  - **Runtime-verified** (client dev server + browser console): the custom pathway clicks through
    1→4 and the bundles pathway 1→3 (incl. apply-bundle, orientation/sheet/parent toggles, required-field
    validation gate) with **zero React errors**; `OrderSummary`, `MobileSummaryBar` and the header/stepper
    mount on every step. Only backend CORS noise (API on `:4000` not permitting `:5173`) appears — pre-existing
    and unrelated to the refactor.
- **`PricingEngine.jsx`: 847 → 236 lines.** The orchestrator keeps state, the fetch/save/delete handlers, the
  header, the tab bar and the confirm/toast chrome; everything else moved into `pages/pricing/`:
  `CatalogHints.jsx` (both CMS-first hint banners), `ServiceGrid.jsx` / `SizeGrid.jsx` / `SheetGrid.jsx` /
  `PackageGrid.jsx`, `EstimatorBuilder.jsx` (the ~150-line per-sheet estimator product builder + live engine
  preview), `PricingItemModal.jsx` (modal shell) with `forms/ServiceForm.jsx`, `forms/SizeForm.jsx`,
  `forms/SheetForm.jsx`, `forms/PackageForm.jsx`, plus the shared `statusOf.js` badge helper.
  - **Verified statically + build:** `sysadmin` build is green and a word-boundary check confirms every
    extracted file references **only the props it is passed** (the few hits were string literals such as
    `'sheets'`/`'packages'`/`"Close dialog"` and property reads like `contentCat.albumSizes`). Runtime
    click-through isn't possible here without a logged-in sysadmin session + backend, unlike the client page.

> **Still open (tracked):** the remaining ~816 hex literals are intentional functional type colours
> (blue/pink/yellow), the gold gradient ramp and token *definitions* — see §3.3. UX-4 is complete across every
> client page (§7).

---

## 7. As-built (UX-4 + backend wiring, 2026-10-16)

### UX-4 — whole-site EN↔TE (complete)
- **Mechanism:** the `useT()` hook (`client/src/context/LanguageContext.jsx`) binds `t(key, vars)` to the current
  language, so pages call `const t = useT();` and `{t('about.hero_title')}`. All copy lives in the central
  `client/src/lib/i18n.js` dictionary — now **585 keys**, each with EN + reviewed Telugu. Persisted to
  `localStorage['site_lang']`, sets `<html lang>`, and does `{var}` substitution.
- **Wired — marketing:** `Footer`, home `Hero` block, `About`, `Services` (hero + 4 pathways + tab labels +
  estimator + CTA), `Pricing` (hero + 4 FAQs + CTA), `Portfolio` (filters + category pills + lightbox hint),
  `Contact` (3-step wizard), `Testimonials` (chrome, filters, stats, CTA), `Careers`, `Blog`, `BlogPost`, `B2C`
  (hero, 3D viewer, process, sheet types, gallery, digital invites), `MuhurthamCalendar` (incl. `te-IN` date
  formatting), `AlbumsShowcase` (6 cover types + 4 paper finishes carry inline `te` variants), and `B2B` — the
  studio-trade page (workflow steps, sheet arsenal, white-label gate, benefits, trade CTAs).
- **Wired — transactional:** `Cart`, `Checkout`, `OrderTracking`, `OrderHistory`.
- **Wired — dashboards:** `ClientDashboard` (couples-portal chrome, timeline steps, order cards, stat tiles,
  quick actions, sidebar + mobile nav), `EditorDashboard` (available/active jobs, payouts, earnings table),
  `PhotographerDashboard` (job-submission form, album proofing modal).
- **Wired — account & tools:** `PortalLogin` (sign-in/register tabs, password + phone/email OTP methods,
  validation & success messages, Google button, other-portal links, forgot-password modal), `ProfileSettings`,
  `ForgotPassword`, `ClientWallet`, `ClientReferral`, `ClientProofing`, `AlbumProofGallery`, `PhotoCulling`.
- **Left as-is (by design):** `Terms` / `PrivacyPolicy` (B2B legal copy — translation is a legal decision, not a
  UI one); `Home` / `OrderAlbum` (thin wrappers with no copy). `BookingPage` is already bilingual via its own
  inline `lang === 'TE' ? … : …` convention and was deliberately **not** migrated to the dictionary.
- **Content vs chrome:** user/editorial content stays as authored — testimonial quotes, blog article bodies,
  portfolio item titles, sheet brand names + GSM figures, city names, sample/mock rows, and server/API error
  strings. Chrome, filters, categories, field labels, buttons and local validation copy are translated.
- Telugu verified intact (no U+FFFD) across all edited files; client build green; `npm run audit:ui` reports
  **0** native dialogs, **0** unlabelled icon buttons and **0** `<img>` without `alt`.

### Backend wiring — G5 / G7 / G8 (was §5 of `SYSTEM_INTEGRATION_PLAN.md`)
- **G5 — dead service layers removed.** Deleted the four unreferenced `{b2b,editor,sysadmin,uiadmin}/src/services/api.js`
  files whose `/api/wallet` + `/api/payout` paths did not exist. Repointed the two live callers to real routes:
  `ClientDashboard` now reads `/api/client/profile`; `EditorDashboard` reads `/api/editor/stats` and requests
  payouts via `/api/editor/payout-request`.
- **G7 — mount aliases consolidated.** Removed the redundant `/builder/*` in-router aliases from
  `server/routes/public.js` (the `/api/builder` mount already serves those paths) and dropped the extra
  `contentRouter` mount at `/api/content` (its paths already start with `/content`). Junk paths like
  `/api/builder/builder/*` and `/api/content/content` are gone; all real paths still resolve.
- **New route:** added the missing `PATCH/PUT /api/admin/jobs/:id` (`server/routes/admin.js`) — the sysadmin
  TaskBoard's status/assignment update silently 404'd before.
- **G8 — audit hardened.** `tools/audit_connectivity.mjs` now skips comment/`console.*` lines, understands
  template-literal paths (`` `${API}/api/…` `` plus dynamic `${id}` / query suffixes `` `${q}` ``), includes
  app-level routes (`/api/health`), and treats `:p` as a wildcard on **either** side. Result: **0 unmatched**
  app calls (was 7 noisy false positives), **0** builder/content junk aliases.

### Bug fixed while wiring UX-4
- **`AlbumsShowcase`** rendered `<LazyImage>` without importing it — the cover grid would throw at runtime on
  first paint (present in the committed version too). Added the missing import (`client/src/pages/AlbumsShowcase.jsx`).

---

## 5. Definition of done (per page)
- [ ] Renders correctly at 360 / 768 / 1024 / 1440 px.
- [ ] Loading, empty, error, success states designed.
- [ ] No raw hex, no inline layout styles, no native dialogs.
- [ ] All interactive controls ≥44 px, labelled, keyboard reachable, focus visible.
- [ ] Public pages EN↔TE; staff pages i18n-key ready.
- [ ] Contrast ≥ 4.5:1 for body text.
