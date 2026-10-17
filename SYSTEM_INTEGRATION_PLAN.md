# System Integration Plan — Apps ↔ Server ↔ DB ↔ Roles

> Objective: every app is **properly connected** (routes, database, roles, portals), the wiring is
> **verified**, and remaining gaps are tracked with owners, fixes and acceptance criteria.
>
> Status: **v1 — verified baseline**. Evidence below was captured by running the server locally and
> hitting every mount, plus a live estimator round-trip (sysadmin price → client UI).

Related: [`UI_UX_POLISH_PLAN.md`](./UI_UX_POLISH_PLAN.md), [`B2C_REDESIGN_PLAN.md`](./B2C_REDESIGN_PLAN.md).
Tooling: [`tools/audit_connectivity.mjs`](./tools/audit_connectivity.mjs) (`--json` → `tools/connectivity_report.json`).

---

## 1. Topology

| Service | Package | Dev port | Prod origin | API base in code |
|---|---|---|---|---|
| Backend API | `server/` | **4000** | (behind reverse proxy / Firebase functions) | — |
| B2C client (+ customer portal) | `client/` | **5173** ✅ pinned (`strictPort`) | `weddingalbums.in` | `API` / `API_BASE` |
| B2B studio portal | `b2b-portal/` | **5174** | `studio.weddingalbums.in` | `API` |
| Editor portal | `editor-portal/` | **5175** | `creator.weddingalbums.in` | `API` |
| Sysadmin ops | `sysadmin/` | **5176** | `ops.weddingalbums.in` | `API` |
| CMS studio | `uiadmin/` | **5177** | `cms.weddingalbums.in` | `API` |

- **Canonical launcher:** `npm run dev` → `start-all.ps1` (starts all six, ports pinned). Per-app dev:
  `npm --prefix <app> run dev` (all five `vite.config.js` now pin their port; client uses `strictPort`
  so a collision fails loudly instead of silently drifting).
- **API base resolver** (identical logic in each `*/src/apiConfig.js`): non-localhost host ⇒ `''`
  (same-origin `/api`, requires the reverse proxy in prod); localhost ⇒ `VITE_API_URL || http://localhost:4000`.
- **Every app proxies `/api` → `http://127.0.0.1:4000`** in Vite; the client's `apiClient`/`apiConfig`
  additionally call the absolute dev host (CORS-allowed), so both paths work in dev.

---

## 2. Server route mounts (`server/index.js`)

| Mount | Router | Purpose |
|---|---|---|
| `/api/auth` | `routes/auth.js` | login/register/OTP/firebase/refresh/logout |
| `/api/admin` | `routes/admin.js` | users, orders, jobs, payouts, audit, **builder CRUD**, stats |
| `/api/b2b` | `routes/b2b.js` | studio: jobs, albums, invoices, wallet, analytics, referral |
| `/api/editor` | `routes/editor.js` | task queue, claim/submit, stats, payouts |
| `/api/client` | `routes/client.js` | profile, referral, projects |
| `/api/content` | `routes/content.js` | published CMS content + history |
| `/api/public` | `routes/public.js` | public catalog (packages, services, sheets, album-sizes) |
| `/api/builder` | `routes/public.js` | **same router re-mounted** (customer-facing builder reads) |
| `/api` | `content.js` **and** `public.js` | flat aliases for legacy + client calls (`/api/packages`, `/api/orders`, …) |

Guards (from the audit): `PUBLIC` ×100 · `admin|sysadmin|content_admin` ×39 · `content_admin|admin|sysadmin` ×8 · `staff(b2b,editor,admin,sysadmin)` ×18.

> Note: `/api/*` is mounted **twice** (`content` + `public`) and `public.js` is mounted at `/api`,
> `/api/builder` and `/api/public`. This produces harmless alias paths (e.g. `/api/builder/builder/…`,
> `/api/public/<x>`, `/api/<x>`). **Follow-up (low):** consolidate to one mount per router to remove
> the duplicate-"builder" paths and audit noise.

---

## 3. Roles, audiences & portal gating

`server/routes/auth.js` issues an 8h JWT (`issuer: weddingalbums.in`) whose **audience** is derived from the role:

| Role | JWT audience | Portal (dev) | Token storage key(s) |
|---|---|---|---|
| `b2c` | `client-portal` | client 5173 | `token` (fallback `clientToken`) |
| `b2b` | `b2b-portal` | b2b 5174 | `token` / `b2bToken` |
| `editor` | `editor-portal` | editor 5175 | `token` / `editorToken` |
| `admin` | `admin-portal` | sysadmin 5176 | `sysadminToken` → `adminToken` |
| `sysadmin` | `sysadmin-portal` | sysadmin 5176 | `sysadminToken` → `adminToken` |
| `content_admin` | `uiadmin-portal` | uiadmin 5177 | `uiadminToken` → `adminToken` |

`server/middleware/auth.js → requireRole(role, audience)`:
- verifies audience ∈ `{requested audiences} ∪ {admin-portal, sysadmin-portal}` and issuer;
- passes if `decoded.role ∈ allowedRoles` **or** role is `admin`/`sysadmin` (cross-portal super-admins).
- `login`/`login-with-otp`/`firebase-login` reject a mismatched `portalRole` unless admin/sysadmin.

**Login flow is portal-gated** (a `b2c` token cannot be used on b2b/editor/sysadmin routes and vice-versa),
which the live guard test below confirms.

---

## 4. Verified evidence (this session)

Server booted standalone (`node server/index.js`) → `PostgreSQL Active` + "resilient fallback mode
with pre-seeded wedding catalog data", listening on `http://localhost:4000`.

| Endpoint | Method | Guard | Result |
|---|---|---|---|
| `/api/health` | GET | public | **200** (~234 B) |
| `/api/content` | GET | public | **200** (~85 KB, full CMS catalog) |
| `/api/builder/album-sizes` | GET | public | **200** (array; 11+ rows) |
| `/api/builder/sheets` | GET | public | **200** (array) |
| `/api/builder/services` | GET | public | **200** (~16 KB) |
| `/api/public/packages` | GET | public | **200** (~1.5 KB) |
| `/api/admin/users` | GET | admin | **401** (no token) ✅ |
| `/api/b2b/jobs` | GET | b2b/staff | **401** (no token) ✅ |
| `/api/editor/my-jobs` | GET | editor/staff | **401** (no token) ✅ |
| `/api/content/history` | GET | content_admin | **401** (no token) ✅ |

**End-to-end pricing round-trip (the key B2C requirement):**
1. Builder album-size row `{ id: size-1, dimensions: "12×36 inches", basePrice: 9500 }`.
2. `ContentContext` fetches `/api/builder/album-sizes` + `/api/builder/sheets`, calls
   `applyBuilderOverrides(catalog, sizes, sheets)` (matches by **id → dimensions key → name slug**).
3. Live estimator then renders **₹9,500** for 12×36 (CMS was ₹12,500) with **≈₹317/sh**;
   `_sysadminPriced: true` on 4 sizes in the cached catalog. ✅ *SysAdmin-authored prices reach the couple UI.*
4. **Services too (G6):** builder Service rows in `Video Editing` / `Flex & Banners` / `Album Printing`
   now drive a-la-carte **video / flex / cover** prices. Verified live: all 7 videos
   (₹7,500 teaser · ₹4,500 reels · ₹12,000 feature · ₹18,000 traditional · ₹10,000 SDE · ₹3,000 audio · ₹15,000 pre-wedding),
   4 flex items and 2 cover finishes came from the builder.

> Note: because packages are engine-priced from the same catalog (`pkgQuote` → `resolveVideoMap`), the
> live package totals now **track the builder's video prices** (e.g. Silver rises with the builder teaser
> price). The pinned ₹16,500 / ₹26,100 / ₹40,693 totals in the tests are computed on the **CMS-shaped
> catalog without builder rows**, so they still pin engine parity; the owner's live numbers are whatever
> they price in the builder — by design.

> Data caveat: the seeded builder rows use generic ids/names (`size-1`, `sheet-1`) and therefore only
> partially align with the curated CMS catalog (4 sizes matched by dimensions; seeded sheet names do
> **not** match CMS sheet titles, so sheet overrides require authoring from the Pricing Engine builder,
> which emits CMS-aligned ids). **Follow-up:** have the builder default new rows to the CMS item's
> `id`/title, and surface a "matched / unmatched" count in the builder UI.

---

## 5. Findings & fixes

| # | Severity | Finding | Status |
|---|---|---|---|
| G1 | **High** | `client/src/lib/packages.js` hard-coded `http://localhost:4000` with **no host guard** → prod would call localhost for `/api/packages`. | ✅ **Fixed** — inlined the guarded resolver (prod ⇒ `''`), kept the module Node-testable. |
| G2 | **High** | `ContentContext` had `useMemo` **after** the loading-screen early-return ⇒ hook-order crash on **cold cache / new origin / incognito** (full-app "System Recovery"). | ✅ **Fixed** — all hooks now run before any conditional return. |
| G3 | Med | Client dev port was **unpinned** → could auto-increment onto 5174 (b2b) and cause dead/confusing tabs. | ✅ **Fixed** — `port: 5173, strictPort: true`. |
| G4 | Med | `uiadmin/src/hooks/useAdminContent.js` hard-coded prod CDN `https://weddingalbums-b4bcd.web.app/content.json`. | ✅ **Fixed** — overridable via `VITE_CONTENT_CDN_URL`. |
| G5 | Med | Four **dead** service layers (`{b2b,editor,sysadmin,uiadmin}/src/services/api.js`) call non-existent `/api/wallet`, `/api/payout`, etc. and are imported nowhere; they mislead future wiring. | ✅ **Fixed** — deleted the four unreferenced files; repointed the live callers (`ClientDashboard` → `/api/client/profile`; `EditorDashboard` → `/api/editor/stats` + `/api/editor/payout-request`). |
| G6 | Med | Estimator merged builder **album-sizes + sheets** only; builder **services/videos/covers** prices did not flow to the client. | ✅ **Fixed** — `applyBuilderOverrides` now also maps builder **services** → a-la-carte **video / flex / cover** prices (keyword tables, each row claimed once). Verified live: all 7 videos, 4 flex items, 2 covers driven by the builder. |
| G7 | Low | `public.js` mounted at 3 prefixes ⇒ duplicate `…/builder/builder/…` alias paths. | ✅ **Fixed** — removed the in-router `/builder/*` aliases in `public.js` (the `/api/builder` mount covers them) and the redundant `contentRouter` mount at `/api/content`; junk aliases (`/api/builder/builder/*`, `/api/content/content`) are gone, real paths intact. |
| G8 | Low | Audit script false positives (dynamic `${id}` paths, `:p` params, alias mounts). | ✅ **Fixed** — audit now skips comment/`console.*` lines, parses template-literal paths + `?`/`${q}` suffixes, includes app-level routes, and wildcards `:p` on either side ⇒ **0 unmatched**. |
| G9 | Info | Client dev calls the absolute API host rather than the Vite proxy (fine; CORS-allowed). Consider preferring relative in dev to exercise the proxy. | ⏳ Backlog |
| G10 | Info | `/api/health` exists (`server/index.js:117`); the audit's "unmatched" was a path-join artifact. | ✅ Verified |
| G11 | Med | Sysadmin `TaskBoard` PATCHed `/api/admin/jobs/:id` to change task status / assign an editor, but **no such route existed** — the update silently 404'd. | ✅ **Fixed** — added `PATCH`/`PUT /api/admin/jobs/:id` (`server/routes/admin.js`) updating `status`/`assigned_editor_id`/etc. with an audit log. |
| G12 | **High** | CI deploy failed on **runs #22–#30** with *"Missing permissions required for functions deploy … `iam.serviceAccounts.ActAs` on `weddingalbums-b4bcd@appspot.gserviceaccount.com`"*. Because the single deploy command ran functions before hosting, the **public site never shipped** (live bundles were stale from run #21). | ✅ **Workflow fixed + documented** — deploy is split **hosting → rules → functions**, `firebase-tools` is pinned, and the required IAM grant + a deploy-identity preflight are documented in the workflow header and §8. ⚠️ The IAM grant itself is a Google Cloud action for the project owner (see §8). |
| G13 | Med | Tailwind v4 builds were fragile: a hand-written escaped selector in `sysadmin/src/premium.css` (`.bg-\[\#111\]`) was re-scanned as a candidate, and a sibling portal's `dist` was being auto-scanned up to the git root — either could abort `lightningcss` minify. | ✅ **Fixed** — arbitrary values now use v4 shorthand (`bg-(--n-900)`), `sysadmin`/`uiadmin` pin their sources (`@import "tailwindcss" source(none)` + `@source`), and the escaped selector was restored. |

### 5.1 Price ownership — two admin surfaces (by design)

Prices are intentionally editable from **both** admin surfaces; the estimator copy now says so ("Set in Admin · CMS Studio · SysAdmin") instead of implying only SysAdmin.

| Surface | Where | Writes | Scope |
|---|---|---|---|
| **CMS Studio** | `uiadmin` → Hub Catalog Editor | `content.global.servicesCatalog` → `POST /api/content` | sizes (`clientBasePrice`), sheets (`clientPricePerSheet`), videos & flex (`clientPrice`) |
| **SysAdmin** | `sysadmin` → Pricing Engine | builder tables (`album-sizes` / `sheets` / `services`) | same items via `basePrice` / `pricePerSheet` |

**Runtime precedence (CMS-first, flipped 2026-10-16):** `ContentContext` loads the CMS catalog, then `applyBuilderOverrides` applies SysAdmin builder rows — **the CMS Studio value wins; a builder row only fills an item whose CMS price is blank** (`PRICE_PRECEDENCE = 'cms'` in `client/src/lib/pricing.js`). Unmatched builder rows are ignored. Both editors display this rule, and the estimator chip reads "Set in Admin" (neutral).

> **Live-match badges (done):** the SysAdmin Pricing Engine now shows, per row, a **3-state** status matching
> the CMS-first precedence — **✓ Fills an unpriced item (drives the live price)** vs
> **⚠ CMS Studio price wins (row ignored)** vs **— No CMS match (not in the estimator)** — plus a
> *"N of M rows fill a blank CMS price · X eclipsed · Y unmatched"* count per tab
> (`sysadmin/src/lib/catalogMatch.js` mirrors the client matching). This surfaced a real gap: the seeded
> `sheet-*` rows have generic names that don't match any CMS sheet, so they are (correctly) reported as unmatched.
> Follow-up (low): let the owner **link** a builder row to a CMS item (or default new rows to the CMS id) so the two surfaces line up 1:1.

**Production hardening (done 2026-10-17):**

- **`JWT_SECRET`** — `server/config.js` is the single source of truth (`JWT_SECRET` + `JWT_ISSUER`). In
  production a missing/default secret is **fail-closed**: a loud startup error, `process.exit(1)` for the
  standalone server, and `503 JWT_SECRET_MISSING` on every non-health route. Import still succeeds so Cloud
  Functions discovery/deploy is not blocked. CI writes `JWT_SECRET` from the `JWT_SECRET` repository secret
  into `server/.env.<projectId>` and fails fast when the secret is absent.
- **CORS** — the allow-list is `DEFAULT_ORIGINS` **plus** the comma-separated `CORS_ORIGINS` env var, so a new
  origin no longer needs a code change.
- **Reverse proxy `/api`** — mapped in `firebase.json` (`/api/**` → the `api` function); the client keeps
  calling a relative `/api` in production.
- **Smoke tests** — `npm run smoke` (pages + API) and the static audits below are the pre-deploy gate.

---

## 6. Roadmap & acceptance

**Phase S0 — done this session:** port pinning, prod API-base fix, ContentContext crash fix, uiadmin CDN
config, server boot + mount/guard verification, estimator round-trip proof.

**Phase S1 — Clean wiring (safe, no behaviour change):**
- G5: delete/rewrite the four dead `services/api.js`; standardise on one `api` client per app.
- G7/G8: consolidate `public.js` mounts; fix the audit matcher and commit `connectivity_report.json`.
- Add a tiny `/api/health` deep-check page/CLI used in CI.
- *Acceptance:* `node tools/audit_connectivity.mjs` reports **0 unmatched** app calls; every app's
  `services/api.js` (or removal) resolves to a real route.

**Phase S2 — Price-parity (B2C):**
- G6: extend builder → estimator merge to services/covers/videos; builder rows default to CMS ids;
  show matched/unmatched in the builder.
- *Acceptance:* editing *any* priced item in SysAdmin changes the couple estimator after a reload;
  pinned package totals stay consistent (tests assert parity).

**Phase S3 — Roles & portals:**
- Add automated role tests (token for role A rejected on role B route; admin/sysadmin bypass works).
- Confirm each portal's `ProtectedRoute roles` matches its JWT audience.
- *Acceptance:* a scripted matrix (6 roles × 6 portals) passes; all 401/403 paths verified.

**Phase S4 — Production:**
- Secrets/env (`JWT_SECRET`, `VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`, `VITE_CONTENT_CDN_URL`), reverse-proxy
  `/api`, real Postgres (drop resilient fallback for prod), CORS allow-list final.
- *Acceptance:* smoke test on each prod origin: health, content, packages, login, one protected call.

---

## 7. How to run & verify

```powershell
# all services (recommended)
npm run dev                    # start-all.ps1 → 4000 + 5173..5177

# backend alone
node server/index.js

# connectivity audit (static: mounts/routes/guards vs app API references)
node tools/audit_connectivity.mjs            # human report
node tools/audit_connectivity.mjs --json     # → tools/connectivity_report.json

# pricing engine tests
node --test client/src/lib/__tests__/pricing.test.mjs

# smoke tests
npm run smoke:api                            # boots the server: 34 checks incl. the 6-role separation matrix
npm run smoke:pages                          # route inventory + import integrity across all 5 apps
npm run smoke:pages:live                     # …plus a live fetch of each route (needs the dev servers)
npm run smoke                                # pages + api

# UI/UX audit (HARD GATE: 0 native dialogs) + grey-scale sweep
npm run audit:ui
node tools/tokenize-greys.mjs                # dry run + histogram; add --write to apply
```

---

## 8. Deploying (CI/CD)

`.github/workflows/firebase-hosting-merge.yml` runs on every push to `main` and deploys in **three ordered
steps** so an API/permissions problem can never block the public site again:

1. `firebase deploy --only hosting` (all 5 sites)
2. `firebase deploy --only firestore:rules`
3. `firebase deploy --only functions` — after writing `server/.env.<projectId>`

**Required repository secrets**

| Secret | Purpose |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_WEDDINGALBUMS_B4BCD` | JSON key of the CI deployer service account |
| `JWT_SECRET` | API signing key (≥ 64 random chars). The functions step fails fast without it, because the API now refuses to serve production traffic with a guessable key. |

**Required IAM for the deployer service account** (project `weddingalbums-b4bcd`). A Functions / Cloud Run
deploy must be allowed to *act as* the runtime service account. Without this the CLI aborts with
*"Missing permissions required for functions deploy … `iam.serviceAccounts.ActAs` on
`weddingalbums-b4bcd@appspot.gserviceaccount.com`"* — which, before the split, failed the whole job **ahead of
hosting** (see G12):

```bash
gcloud iam service-accounts add-iam-policy-binding \
  weddingalbums-b4bcd@appspot.gserviceaccount.com \
  --member="serviceAccount:<CI_DEPLOYER_SA_EMAIL>" \
  --role="roles/iam.serviceAccountUser" \
  --project=weddingalbums-b4bcd
```

Typical additional roles for the deployer: `roles/firebasehosting.admin`, `roles/firebaserules.admin`,
`roles/cloudfunctions.developer`, `roles/run.developer`, `roles/artifactregistry.writer`,
`roles/cloudbuild.builds.editor`, `roles/storage.admin`, `roles/serviceusage.serviceUsageAdmin`.

> `<CI_DEPLOYER_SA_EMAIL>` is the `client_email` inside the `FIREBASE_SERVICE_ACCOUNT_WEDDINGALBUMS_B4BCD`
> secret. In the Cloud console: **IAM & Admin → IAM → Grand access →** that SA → role **Service Account User**,
> scoped by adding it on the `weddingalbums-b4bcd@appspot.gserviceaccount.com` principal.
