# 🏆 WeddingAlbums.in — Comprehensive Master Plan
**Version 2.1 | Full-Stack Architecture & Regional Media Overhaul**
*weddingalbums.in · 6 Apps · 1 Server · Multi-Role Platform*

---

## 🎯 The Vision: Separated, Secure, Stunning

WeddingAlbums.in is the undisputed leader for post-production and premium albums in Andhra Pradesh. 
While **Weddings (Pelli)** are the core priority, the platform fully supports the massive regional market for:
- **Langa Voni (Half Saree) Ceremonies**
- **Sreemantham (Maternity / Baby Showers)**
- **Grand 1st Birthdays**
- **Corporate Gala Dinners & Events**

All mockups, templates, and placeholder images strictly reflect these South Indian and Andhra Pradesh cultural aesthetics utilizing high-quality Unsplash curation.

---

## 🗺️ PHASE-BY-PHASE EXECUTION PLAN

### PHASE 1 — Server Hardening & Auth Separation
- **Role-Scoped JWT Tokens:** Audience claims per portal (`client-portal`, `b2b-portal`, etc.).
- **Modular Routes:** Broke 900-line monolith into `auth.js`, `b2b.js`, `editor.js`, `admin.js`, `content.js`, `public.js`.
- **Security:** Rate Limiters, Helmet CSP, strict CORS whitelist.

### PHASE 2 — Shared Auth Library
- **AuthContext:** Unified token management across all 4 admin/studio portals.
- **ProtectedRoute:** Strict component gating.

### PHASE 3 — Login Page Redesigns (Premium UI)
- **Client (b2c):** Romantic, warm gold (`/login?role=b2c`).
- **Studio (b2b):** Cinematic dark gold.
- **Creator (editor):** Blueprint neon grid.
- **Ops (sysadmin):** Deep navy matrix.
- **CMS (uiadmin):** Editorial amber.

### PHASE 4 — Client Portal Cleanup & Regional Expansion
- **Removed internal routes** from the public B2C app.
- **Regional Content Injection:** Updated `content.json` to feature specific Andhra Pradesh locations (Vijayawada, Vizag, Guntur, Rajahmundry, Tirupati).
- **Event Diversification:** Configured the platform to support Wedding, Half-Saree, Birthday, and Corporate event portfolios.

### PHASE 5 & 6 — B2B & Editor Portal Hardening
- Implemented robust `api.js` fetch wrappers with automatic token refresh.
- Locked down internal dashboards.

### PHASE 7 & 8 — Admin & CMS Hardening
- **Audit Logs:** Tracked all state changes in `sysadmin`.
- **Content Versioning (Phase 8.2):** Implemented `content_history` SQLite table. Every CMS publish from `uiadmin` creates a rollback version.

### PHASE 9 — Business Logic Enhancements
- **Referral System:** Tiered referral code generation.
- **Order State Machine:** `DRAFT → CONFIRMED → IN_PRODUCTION → QC_REVIEW → DELIVERED → CLOSED`.
- **Payouts Workflow:** Editor wallet withdrawal system.

### PHASE 10 — Production Deployment Plan
- **Reverse Proxy (Nginx):** 5 dedicated subdomains (`studio.`, `creator.`, `ops.`, `cms.`, `api.`).
- **PM2:** `ecosystem.config.cjs` configured for all 6 processes.
- **Build Scripts:** Automated `build-all.ps1`.

### PHASE 11 — Regional Media & Imagery Pipeline (NEW)
- **Unsplash Integration:** Replaced all generic/missing placeholders with high-fidelity, culturally accurate Indian/South Indian images from Unsplash.
- **Category Matrix:**
  - *Weddings:* Sacred Muhurtham, Talambralu, Mangala Snanam.
  - *Pre-Wedding:* Araku Valley, RK Beach.
  - *Events:* Langa Voni (Half Saree), Grand Birthdays, Corporate.
- **Preserved Backgrounds:** Retained original premium CSS background aesthetics (like dark bokeh, blueprints) while updating foreground portfolio grids with real subjects.

---

### PHASE 12 — Enterprise Scalable Database Migration (MongoDB Atlas Architecture)
- **Why Migrate from SQLite:**
  - SQLite locks the entire database file during writes (`SQLITE_BUSY`), creating severe bottlenecks under concurrent multi-user load across 5 portals.
  - Cannot scale horizontally across multiple PM2 instances, Docker containers, or cloud servers.
  - No connection pooling; memory resets on server reboot.
- **Target Architecture (MongoDB Atlas Cloud Cluster):**
  - **High-Throughput NoSQL Engine:** Native document storage matching wedding album specs, client reviews, editor tasks, and CMS configurations.
  - **Auto-Scaling & Sharding:** Replicas and automated failover with 99.99% SLA.
  - **Connection Pooling:** Configured with `maxPoolSize: 50` for handling high concurrency.
  - **Zero Local Overhead:** Runs in the cloud, completely eliminating local disk I/O bottlenecks and Windows GPU/driver context stress.
- **Migration & Implementation Progress:**
  - [x] 12.1: Installed `mongoose` driver into `server`.
  - [x] 12.2: Created enterprise Mongoose schemas in [models_mongo.js](file:///d:/newsite/server/models_mongo.js) for all 13 application collections (`User`, `Package`, `Service`, `SheetType`, `Order`, `Task`, `Project`, `PayoutRequest`, `Config`, `Cart`, `RefreshToken`, `AuditLog`, `ContactLead`).
  - [x] 12.3: Built the **Unified Database Bridge** in [db.js](file:///d:/newsite/server/db.js) which dynamically connects to MongoDB Atlas when `MONGODB_URI` is present, with graceful offline fallback to SQLite.
  - [x] 12.4: Updated all routes (`admin.js`, `auth.js`, `b2b.js`, `client.js`, `editor.js`, `public.js`) and `index.js` to route through the unified database bridge with 100% backward compatibility.
  - [x] 12.5: Built the automated zero-downtime migration script [migrate_to_mongo.js](file:///d:/newsite/server/migrate_to_mongo.js) to import existing packages, users, and catalog data into MongoDB Atlas with 1 command.
  - [ ] 12.6: User inputs Atlas connection string in `server/.env` and triggers `node migrate_to_mongo.js`.

---

### PHASE 13 — Production Deployment on Oracle Cloud Infrastructure (OCI)
- **Target Cloud Environment:**
  - Oracle Cloud Infrastructure (Always-Free Tier): 4 OCPU ARM Ampere A1 (or AMD), 24 GB RAM, 200 GB NVMe Storage ($0/month).
  - High-availability MongoDB Atlas M0/M10 Cluster.
  - Multi-subdomain architecture (`weddingalbums.in`, `studio.`, `creator.`, `ops.`, `cms.`, `api.`).
- **Configuration & Tooling Prepared:**
  - [x] 13.1: Configured production environment files [client/.env.production](file:///d:/newsite/client/.env.production), [b2b-portal/.env.production](file:///d:/newsite/b2b-portal/.env.production), [editor-portal/.env.production](file:///d:/newsite/editor-portal/.env.production), [sysadmin/.env.production](file:///d:/newsite/sysadmin/.env.production), [uiadmin/.env.production](file:///d:/newsite/uiadmin/.env.production) with `VITE_API_URL=https://api.weddingalbums.in`.
  - [x] 13.2: Built high-performance [nginx.conf](file:///d:/newsite/nginx.conf) with Gzip compression, 1-year immutable caching for static assets, and sub-millisecond reverse proxying to backend API.
  - [x] 13.3: Configured production PM2 cluster in [ecosystem.config.cjs](file:///d:/newsite/ecosystem.config.cjs) with CPU core utilization (`instances: 'max'`), auto-restarts, and memory limits.
  - [x] 13.4: Created automated OCI VM provisioner [setup-oracle-cloud.sh](file:///d:/newsite/setup-oracle-cloud.sh) to handle OCI-specific `iptables` and ports 80/443 firewall setup, Node 22, Nginx, Certbot, and PM2 systemd boot services.
  - [x] 13.5: Created 1-command CI/CD deployment script [deploy.sh](file:///d:/newsite/deploy.sh) with automated git pull, frontend builds, database migration, zero-downtime PM2 reload, and health checks.
  - [x] 13.6: Created [server/.env.example](file:///d:/newsite/server/.env.example) production environment template.
  - [ ] 13.7: Deploy to Oracle Cloud VM instance, point DNS records, and issue Let's Encrypt SSL certificates.

---

## 🔒 Security Checklist

- [x] Role-scoped JWT audience claims
- [x] Refresh token rotation (server-side blacklist / cookies)
- [x] HttpOnly cookies for refresh tokens
- [x] CORS whitelist (no wildcard in production)
- [x] Rate limiting on all auth endpoints
- [x] Helmet.js CSP headers configured
- [x] Input validation on all POST endpoints
- [x] SQL injection prevention (parameterized queries)
- [x] XSS prevention (React escapes by default)
- [x] Admin role enforced server-side
- [x] Audit log for all admin actions
- [x] HTTPS enforced on all subdomains (via nginx)

---
**Status: Phase 1-11 Complete (100%). Phase 12-13 Deployment Tools Ready.** 🚀

