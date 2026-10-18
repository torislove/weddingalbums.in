# 🏆 WeddingAlbums.in — Unified Storefront, CMS & Lab Production Master Implementation Plan
**Version 12.0 | True WYSIWYG Living Page Replicas (Home, Storefront, B2B Studio & Editor Workbench), In-Place Direct Editing, Point-of-Use Direct Image Uploading & Bi-Directional Multi-Portal Sync**
*WeddingAlbums.in · Pure Customer Storefront · B2B Studio Portal · Lab Production Workbench · Commercial Ops · CMS Studio*

---

## 1. Executive Summary & Core Platform Architecture

WeddingAlbums.in operates as an **integrated digital storefront and commercial photographic lab**. We have completely replaced legacy freelance bidding wizards with an elite **5-Panel Unified E-Commerce & Production Platform**:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    EXPRESS SERVER (PORT 4000)                               │
│                   PostgreSQL / In-Memory DB · Real-Time Event Bus (SSE)                     │
│                  Strict Role-Based Middleware & Retail Data Sanitization                    │
└──────┬──────────────────────┬───────────────────────────────┬───────────────────────┬───────┘
       │                      │                               │                       │
       ▼                      ▼                               ▼                       ▼
┌───────────────┐      ┌───────────────┐               ┌───────────────┐       ┌───────────────┐
│ 1. CLIENT     │      │ 2. UIADMIN    │               │ 3. SYSADMIN   │       │ 4. B2B STUDIO │
│ STOREFRONT    │      │ CMS STUDIO    │               │ OPS COMMAND   │       │ TRADE PORTAL  │
│ (Port 5173)   │      │ (Port 5177)   │               │ (Port 5174)   │       │ (Port 5175)   │
├───────────────┤      ├───────────────┤               ├───────────────┤       ├───────────────┤
│ • 100% Retail │      │ • LIVE VISUAL │               │ • Order queue │       │ • Wholesale   │
│ • Clear Cards │      │   IN-PAGE     │               │ • Pen Drive   │       │   per-sheet   │
│ • Up to 150 Sh│      │   EDITOR      │               │   tracking    │       │ • Bulk upload │
│ • Custom Flex │      │ • No options  │               │ • Barcodes    │       │ • White-label │
│ • Dual Assets │      │ • 1-Click Pub │               │ • QC workflow │       │   shipping    │
└───────────────┘      └───────────────┘               └───────────────┘       └───────────────┘
                                      │                               │
                                      ▼                               ▼
                               ┌──────────────────────────────────────────────┐
                               │ 5. LAB PRODUCTION WORKBENCH (Port 5176)      │
                               │ • In-house editors, retouching & 3D proofing │
                               └──────────────────────────────────────────────┘
```

---

## 2. Live In-Context Visual Editor: Direct On-Page Editing (No Options Forms) & 1-Click Instant Publish

### A. The Problem with Legacy CMS Forms
Traditional CMS interfaces force administrators to:
1. Navigate through nested sidebars and menus.
2. Open complex forms, tabs, and option drawers.
3. Hunt for fields (e.g. `title`, `clientPricePerSheet`, `desc`).
4. Type in detached textboxes without seeing the real-world visual layout.

### B. The New Direct On-Page Visual Editor Architecture
In `uiadmin/src/pages/VisualLiveEditor.jsx` (and `/visual-editor`):
UIAdmin renders the **entire live Client Storefront panel inside an interactive full-canvas editing surface**:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ UIADMIN LIVE VISUAL EDITOR                                                                             │
│ [🏠 Home] [🛍️ Shop] [📖 About] [📞 Contact]  │  [🖥️ Desktop] [📱 Mobile]  │  [🚀 PUBLISH LIVE CHANGES]  │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │  [✨ COMPLETE ALL-INCLUSIVE (DESIGN + PRINT)]                                                  │   │
│   │                                                                                                │   │
│   │  12×36 Royal Heirloom Panoramic Album  ✏️ (Click to edit title directly)                      │   │
│   │  12×36 inches open spread with seamless 180° layflat binding. ✏️ (Click to edit text)           │   │
│   │                                                                                                │   │
│   │  ┌─────────────────────────┐   ┌─────────────────────────────┐                                 │   │
│   │  │ Per Sheet: ₹[ 260 ] ✏️  │   │ 30-Sh Base: ₹[ 9,500 ] ✏️   │                                 │   │
│   │  └─────────────────────────┘   └─────────────────────────────┘                                 │   │
│   │                                                                                                │   │
│   │  Sheets Range: Min [ 20 ]  Standard [ 30 ]  Max [ 150 ] ✏️                                     │   │
│   │                                                                                                │   │
│   │  [ + Add New Album Size Directly Here ]                                                        │   │
│   └────────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### C. Direct On-Page Interaction Mechanics:
1. **Click-to-Edit Anywhere**:
   - Click on any heading, paragraph, Telugu subtext, or button to edit text inline (`contentEditable` with instant state sync).
   - Click on any price tag (e.g. `₹260/sheet` or `₹9,500 base`) to type the new price directly on the card.
   - Click on any sheet limit (min, default, max up to 150) to change it directly on the card.
2. **Visual Feedback on Hover**:
   - Hovering over any editable element displays an ultra-clean gold dashed border (`border: 1px dashed var(--gold-primary)`) and a subtle pencil icon (`✏️`).
3. **On-Canvas Add Buttons**:
   - `[+ Add Album Size]`, `[+ Add Flex Banner]`, `[+ Add Video Package]` buttons sit right inside their respective product grids on the live page.
4. **1-Click "🚀 Publish Live Changes" Button**:
   - Prominently positioned in the persistent sticky top bar.
   - Glows radiant gold whenever uncommitted edits exist.
   - When clicked:
     - Saves payload to Express backend `POST /api/content`.
     - Backend writes to PostgreSQL / in-memory DB.
     - Backend writes to both `server/content_fallback.json` and `client/public/content.json`.
     - Backend broadcasts SSE event `content:updated`.
     - Displays instant toast: `✓ Published Live! Changes reflected on storefront immediately.`
     - Zero form hunting. Zero clicking options and drawers!

### D. Point-of-Use Direct Image Uploading & Strict Sizing/Alignment Architecture
To ensure images never appear stretched, distorted, or misaligned, every image on the live canvas uses the **Point-of-Use Direct Image Uploader**:
1. **Hover-to-Upload Trigger**:
   - Hovering over any album card thumbnail, paper texture, or hero backdrop displays a floating gold action pill: `📷 Edit / Upload Image`.
2. **Direct Computer File Upload (`POST /api/upload`)**:
   - Clicking opens the native file dialog supporting high-res JPG, PNG, and WebP.
   - Files are uploaded directly to the Express server `/api/upload` endpoint and saved in `/uploads`.
   - **Resilient Offline Fallback**: If the server is offline or fails, an in-memory `FileReader` generates a base64 Data URL so the administrator's workflow is never blocked.
3. **Curated Indian Wedding Archival Presets**:
   - 11 pre-loaded authentic spreads (12×36 layflat mandap, talambralu, saptapadi sacred phera, mangalya dharana, bride jewelry, family blessings).
4. **Strict Aspect-Ratio & Grid Alignment Enforcement**:
   - **Panoramic Album Cards (12×36, 14×40)**: Locked to `aspect-ratio: 16/9`, `object-fit: cover`, `border-radius: 12px 12px 0 0`.
   - **Landscape Album Cards (18×12, 15×10)**: Locked to `aspect-ratio: 3/2`, `object-fit: cover`, `border-radius: 12px 12px 0 0`.
   - **Square Album Cards (12×12, 10×10)**: Locked to `aspect-ratio: 1/1`, `object-fit: cover`, centered.
   - **Paper Finish Swatches**: Locked to `48×48px`, circular (`border-radius: 50%`) with gold border.
   - **Hero Banners**: Locked to `aspect-ratio: 21/9` on desktop and `16/9` on mobile with seamless gradient overlays.

### E. Full Page Replication Across All 3 Portals
UIAdmin replicates the actual page markup and CSS tokens across all 3 user-facing platforms:
- **🛍️ B2C Storefront (`client`)**: `Shop.jsx` (cards, 150-sheet slider, paper finishes, cart calculator), `Home.jsx` (hero scramble, marquee, stats, visual pillars), `About.jsx` (team, lab equipment), `Contact.jsx` (lab hotline & AP/Telangana location).
- **🏢 B2B Studio Trade Portal (`b2b-portal`)**: `B2BLanding.jsx` (hero, 3 KPI counters, announcements) and `B2BCatalog.jsx` (wholesale per-sheet rates, cover fees, express turnaround SLAs).
- **🎬 Lab Production Workbench (`editor-portal`)**: `EditorLanding.jsx` (technician onboarding, lab ACES color guidelines) and `Earnings.jsx` (Karizma layout ₹/sheet, RAW skin retouching ₹/photo, video editing ₹/minute).

---

## 3. Storefront Service Clarity Architecture: What is Editing, Printing, Complete Suite & Bundles

To eliminate customer confusion, **every product card on the storefront features crystal-clear, color-coded service taxonomy**, distinct badges, and an explicit **"What's Included" feature checklist**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 THE 6 DISTINCT STOREFRONT SERVICE TYPES                                  │
├──────────────────────────┬──────────────────────────┬─────────────────────────┬──────────────────────────┤
│ 1. 🎨 PURE DIGITAL       │ 2. 🖨️ PRINT & BIND ONLY   │ 3. ✨ COMPLETE SUITE    │ 4. 📦 ALL-IN-ONE BUNDLE  │
│    EDITING (NO PRINT)    │    (CUSTOMER PSDs)       │    (DESIGN + PRINT)     │    (COMBO PACKAGES)      │
├──────────────────────────┼──────────────────────────┼─────────────────────────┼──────────────────────────┤
│ • Badge: Violet / Indigo │ • Badge: Sky Blue / Cyan │ • Badge: Radiant Gold   │ • Badge: Emerald Green   │
│ • Deliverable: High-Res  │ • Deliverable: Physical  │ • Deliverable: Complete │ • Deliverable: Master    │
│   PSD/JPEG Cloud Link    │   Layflat Album from     │   Telugu Custom Design  │   Album + 2 Parent Books │
│ • No physical delivery   │   ready user PSDs        │   + HP Indigo Print     │   + 4K Video + Frame     │
│ • Included: Skin retouch,│ • Included: HP Indigo    │ • Included: Raw retouch,│ • Included: Everything   │
│   culling, color grading │   12000, 180° layflat,   │   Karizma page design,  │   combined with maximum  │
│   & Karizma page layout  │   hardcover & box        │   binding & luxury box  │   bundle discount        │
└──────────────────────────┴──────────────────────────┴─────────────────────────┴──────────────────────────┘
```

### Detailed Card Classification Matrix:

#### A. 🎨 Pure Digital Editing & Retouching (No Printing)
- **Target Audience**: Photographers with their own print lab, or couples wanting digital-ready files for social media and archiving.
- **Card Badge**: `🎨 PURE DIGITAL EDITING · NO PHYSICAL PRINT` (Border: `#a855f7`, Background: `rgba(168,85,247,0.15)`).
- **Deliverables**: High-resolution print-ready PSD files (300 DPI) + Web JPEGs delivered via secure Cloud Link.
- **Micro-Checklist on Card**:
  - `✓ AI + Master Skin Retouching (Blemish & Glare Removal)`
  - `✓ Cinematic Color Grading & Tone Balancing`
  - `✓ Complete Telugu Karizma PSD Page Layouts`
  - `✓ Cloud Download Link (Zero Shipping Needed)`

#### B. 🖨️ Pure Lab Print & Bind Only (Customer Supplies Ready PSDs)
- **Target Audience**: Photographers and graphic designers who have completed 12×36 or 18×12 PSD layouts and need world-class physical printing and binding.
- **Card Badge**: `🖨️ LAB PRINT & BIND ONLY · SUPPLY YOUR OWN PSDs` (Border: `#38bdf8`, Background: `rgba(56,189,248,0.15)`).
- **Price Advantage**: Applies an automatic **₹600 Print-Only Discount** compared to the Complete Suite.
- **Deliverables**: Physical archival lay-flat album delivered in a luxury presentation box.
- **Micro-Checklist on Card**:
  - `✓ HP Indigo 12000 HD 7-Color ElectroInk Press`
  - `✓ 180° Seamless Panoramic Layflat Binding (Zero Gutter)`
  - `✓ Scuff-Free Thermal Archival Lamination (200-Year Life)`
  - `✓ Luxury Hardcover Box & Free Insured Courier Delivery`

#### C. ✨ Complete Suite: Master Telugu Design + HP Indigo Print & Bind (Flagship)
- **Target Audience**: Couples and families who want an end-to-end white-glove solution. Provide raw photos; we handle layout design, retouching, printing, and binding.
- **Card Badge**: `✨ COMPLETE ALL-INCLUSIVE (MASTER DESIGN + PRINT & BIND)` (Border: `#D4AF37`, Background: `rgba(212,175,55,0.15)`).
- **Deliverables**: Full custom Karizma design + 3D digital proof for client approval + finished physical heirloom album.
- **Micro-Checklist on Card**:
  - `✓ Full Custom Telugu Layout (Temple Mandap & Ritual Themes)`
  - `✓ RAW Photo Color Correction & Bridal Skin Polishing`
  - `✓ Interactive 3D Digital Proof Approval Before Printing`
  - `✓ HP Indigo 12000 Layflat Archival Printing & Hardcover Box`

#### D. 📦 All-In-One Combo Bundles
- **Target Audience**: Couples wanting the complete royal celebration package with maximum package savings.
- **Card Badge**: `📦 ALL-IN-ONE COMBO BUNDLE · SAVE UP TO 35%` (Border: `#10b981`, Background: `rgba(16,185,129,0.15)`).
- **Included Items Breakdown**:
  - `✓ 1 Heirloom Master Album (12×36 or 14×40, 30–50 Sheets)`
  - `✓ 2 Mini Parent Keepsake Pocket Albums (6×9 inches)`
  - `✓ 4K Cinematic Wedding Teaser Video (3–5 Min)`
  - `✓ 20×30 Diamond Crystal Acrylic Wall Portrait Frame`
  - `✓ Animated WhatsApp Video Invitation with Mandap QR`

#### E. 🎬 4K Cinematic Video Post-Production
- **Card Badge**: `🎬 4K CINEMATIC VIDEO EDITING` (Border: `#f43f5e`, Background: `rgba(244,63,94,0.15)`).
- **Deliverables**: 4K UHD video files delivered via Cloud Link and optional Lab Pen Drive.

#### F. 🚩 Wedding Flex Banners & Signage
- **Card Badge**: `🚩 EVENT FLEX & SIGNAGE` (Border: `#22c55e`, Background: `rgba(34,197,94,0.15)`).
- **Deliverables**: Weatherproof flex banner shipped rolled inside heavy-duty cylindrical PVC pipe.

---

## 4. Dynamic Sheet Selection Architecture (Up to 150 Sheets) & Live Customizer

### A. The Commercial Lab Sheet Standard
- In commercial lab manufacturing: **1 Sheet = 2 Pages** (1 full open panoramic spread).
- Standard Album: **30 Sheets = 60 Pages**, accommodating 150 to 250 curated high-resolution photos.
- **Extended Range**: Selectable up to **150 Sheets = 300 Pages**, accommodating **600 to 750 high-resolution photos**.

### B. UIAdmin Live View Controls
Admin can edit directly on the live album cards:
1. `defaultSheets`: Base included sheets (default: 30 sheets).
2. `minSheets`: Minimum allowable sheets (default: 20 sheets).
3. `maxSheets`: Maximum allowable sheets (**up to 150 sheets**).
4. `clientPricePerSheet`: Retail additional sheet rate (e.g. ₹260/sheet).
5. `wholesalePerSheet`: Studio wholesale trade rate (e.g. ₹180/sheet).
6. **Active Paper Toggles**: Toggle on/off which sheet finishes appear on the storefront.

### C. Client Storefront UI/UX Excellence (`client/src/pages/Shop.jsx`)
1. **Interactive Luxury Slider**: Smooth drag from 20 up to 150 sheets with gold progress track.
2. **Preset Quick-Select Pills**:
   - `[20 Sheets (Slim - 40 Pgs)]`
   - `[30 Sheets (Standard - 60 Pgs)]`
   - `[50 Sheets (Celebration - 100 Pgs)]`
   - `[75 Sheets (Grand - 150 Pgs)]`
   - `[100 Sheets (Royal - 200 Pgs)]`
   - `[150 Sheets (Max Heirloom - 300 Pgs)]`
3. **Dynamic Photo Capacity Counter**:
   - Displays: `{sheets} Sheets = {sheets * 2} Pages`
   - Displays: `Photo Capacity: Accommodates ≈ {sheets * 4}–{sheets * 5} High-Res Wedding Photos`
4. **Transparent Price Breakdown**:
   $$\text{Total Price} = \text{Base Price} + \max(0, \text{sheets} - \text{defaultSheets}) \times \text{Per-Sheet Rate} + (\text{Paper Addon} \times \text{sheets}) + \text{Cover Addon}$$

---

## 5. Instant UIAdmin Live Editing & Server/Client Sync Pipeline

```
[UIAdmin Live Visual Editor] 
         │ 
         │ 1. POST /api/admin/content (with auth token)
         ▼
[Express Server: content.js]
         ├── 2. Upsert PostgreSQL / in-memory Content table
         ├── 3. Write to server/content_fallback.json
         ├── 4. Write directly to client/public/content.json (disk sync)
         ├── 5. Broadcast 'content:updated' via eventBus (SSE)
         ▼
[Client Storefront & B2B Portal]
         ├── 6. SSE Listener catches 'content:updated'
         └── 7. Triggers immediate background refetch of /api/content
```

### Key Technical Rules:
1. **Dual Disk Persistence**:
   - Server writes to both `server/content_fallback.json` (server seed) and `client/public/content.json` (client static bundle fallback).
2. **Zero-Rebuild Reactivity**:
   - `ContentContext.jsx` in `client/` connects to SSE `/api/events` to refresh catalog state dynamically without page refresh.
3. **Strict Client Data Sanitization**:
   - `sanitizeContentForClient(contentData, isB2B)` strips `studioPrice`, `wholesalePerSheet`, `studioBasePrice`, and profit margin badges for public storefront requests.
   - B2B portal requests with valid studio JWT retain full wholesale trade pricing.

---

## 6. SysAdmin Operations & Server Connectivity

The SysAdmin panel (`sysadmin/` on port 5174) connects directly to the backend (`server/` on port 4000) for complete commercial lifecycle operations:

### A. Commercial Order Pipeline (`/orders`)
- Stages: `DRAFT ──▶ CONFIRMED ──▶ PRE_FLIGHT ──▶ IN_PRODUCTION ──▶ QC_REVIEW ──▶ DISPATCHED ──▶ DELIVERED`.
- Renders full order parameters:
  - Service Type (`Pure Editing`, `Print Only`, `Complete Suite`, `Bundle`, `Video`, `Flex`).
  - Album Size and Configured Sheets (up to 150 Sheets / 300 Pages).
  - Selected Paper Substrate & Luxury Cover.
  - Custom Flex Dimensions (Width ft × Height ft, total sq.ft, material, finishing).
  - 4K Video Durations & Multicam Sync.
  - Dual Asset Handover Data (Cloud URL vs Courier Pen Drive with lab consignment number).

### B. Physical Media Tracker (Pen Drive / HDD Desk)
- Logs incoming physical storage devices received at the Guntur Central Lab.
- Links device serial/brand to Order ID.
- Tracks safety storage in the lab vault and **Safe Return Dispatch** inside the finished album luxury gift box.

### C. Courier & Barcode Dispatch Integration
- Generates shipping labels for DTDC, Professional Couriers, Speed Post, and Delhivery.
- Updates tracking numbers and notifies customer via SMS & WhatsApp.

---

## 7. B2B Studio Wholesale vs Client Storefront Rate Card Alignment

| Service / Parameter | Client Public Storefront (Retail) | B2B Studio Portal (Wholesale Trade) | Gating & Security |
|---|---|---|---|
| **12×36 Heirloom Album (30 Sheets)** | **₹9,500** (₹260/sheet extra) | **₹6,500** (₹180/sheet extra) | Stripped by `sanitizeContentForClient` |
| **14×40 Royal Panoramic (30 Sheets)**| **₹12,500** (₹320/sheet extra)| **₹8,800** (₹220/sheet extra) | Stripped for public client |
| **Max Sheets Selectable** | Up to **150 Sheets** | Up to **150 Sheets** | Configured in UIAdmin Hub |
| **NTR Anti-Glare Matte Sheet** | Included (₹0) | Included (₹0) | 1:1 Catalog Parity |
| **Metallic Gold / Velvet Paper** | +₹25 to +₹35 / sheet | +₹15 to +₹20 / sheet (Trade) | Wholesale margins visible only in B2B |
| **4mm Crystal Acrylic 3D Cover** | +₹1,500 | +₹1,000 | Studio Trade Discount |
| **10×8 ft Mandap Flex Banner** | **₹2,400** (₹30/sq.ft) | **₹1,600** (₹20/sq.ft trade) | Studio wholesale rate |
| **Custom Flex Dimensions** | Width ft × Height ft (₹30/sq.ft)| Width ft × Height ft (₹20/sq.ft)| Live formula calculation |
| **4K Video Story Highlights** | **₹10,000** | **₹6,800** (Wholesale) | Stripped for public client |
| **Asset Submission** | Cloud Link OR Courier Pen Drive | Cloud Link OR Studio Bulk Drive | Lab address & tracking provided |
| **Branding & Packaging** | WeddingAlbums Luxury Ribbon Box | 100% White-Label (Studio Logo) | Studio custom branding |

---

## 8. Step-by-Step Technical Implementation Roadmap

### Phase 1: Live In-Context Multi-Portal Visual Editor & Point-of-Use Media (`uiadmin/src/pages/VisualLiveEditor.jsx`)
1. Create unified `VisualLiveEditor.jsx` featuring:
   - 3-Way Portal Mode Switcher: `[🛍️ Client Storefront (B2C)]`, `[🏢 Studio Trade Portal (B2B)]`, `[🎬 Lab Production (Editor Portal)]`.
   - Full live interactive canvas matching the exact layout, CSS tokens, and typography of each portal.
   - **Point-of-Use Direct Image Uploading (`PointOfUseImageUploader.jsx`)**:
     - Hover over any album card, paper texture, or hero backdrop to reveal `📷 Edit / Upload Image`.
     - Direct local computer file upload (`POST /api/upload`) with instant `FileReader` base64 fallback.
     - 11 curated Telugu/Indian wedding photography presets (12×36 layflat mandap, talambralu, saptapadi, etc.).
     - Direct external image URL paste option.
     - Strict aspect-ratio and size alignment enforcement (`aspect-ratio: 16/9` for panoramic, `3/2` for landscape, `1/1` for square, `48×48px` circular for papers).
   - Inline text, price, image & boundary editing directly on cards with instant state sync.
   - On-canvas `+ Add` buttons for album sizes, flex banners, video tiers, and editor payout tasks.
   - Sticky top bar with portal switcher, viewport switcher (`[🖥️ Desktop]` / `[📱 Mobile]`), sync status indicator, and glowing gold **🚀 Publish Live Changes** button.
2. Remove non-editable/blurred iframe routes (`/pages/home`, `/pages/about`, etc.) from UIAdmin sidebar, keeping only 100% editable tools.

### Phase 2: Storefront Product Cards & Clarity Badges (`client/src/pages/Shop.jsx`, `Shop.css`)
1. Implement prominent color-coded Service Type Badges on all cards:
   - `✨ COMPLETE SUITE (DESIGN + PRINT)` (Gold)
   - `🖨️ PRINT & BIND ONLY (SUPPLY PSDs)` (Cyan)
   - `🎨 PURE DIGITAL EDITING (NO PRINT)` (Violet)
   - `📦 ALL-IN-ONE COMBO BUNDLE` (Emerald)
   - `🎬 4K CINEMATIC VIDEO EDITING` (Rose)
   - `🚩 EVENT FLEX & SIGNAGE` (Green)
2. Add the 3-point "What's Included" feature checklist directly inside each card body.
3. Update category filter tabs with clear descriptive subheadings explaining what each tab includes.

### Phase 3: Dynamic Sheet Slider & Photo Capacity (Up to 150 Sheets)
1. In `client/src/pages/Shop.jsx`:
   - Extend range slider to support `min={20}` and `max={selectedAlbum?.maxSheets || 150}`.
   - Add preset buttons: `[20 Sh]`, `[30 Sh]`, `[50 Sh]`, `[75 Sh]`, `[100 Sh]`, `[150 Sh]`.
   - Add real-time photo capacity indicator: `Accommodates ≈ {sheets * 4}–{sheets * 5} High-Res Photos`.
   - Update price formula: Base + extra sheets + paper upgrade + cover.

### Phase 4: Instant Live Sync & Server Hardening (`server/routes/content.js`)
1. In `POST /content`:
   - Persist `servicesCatalog`, `b2bPortal`, and `editorPortal` schemas.
   - Write content directly to `client/public/content.json` alongside `server/content_fallback.json`.
   - Broadcast `eventBus.broadcast('content:updated', { timestamp: Date.now() })`.
2. In `client`, `b2b-portal`, and `editor-portal`:
   - Listen to SSE `content:updated` to refetch live data instantly without rebuilds.

### Phase 5: B2B Studio & Editor Portal Dynamic Integration
1. In `b2b-portal/src/pages/B2BLanding.jsx` & `B2BCatalog.jsx`:
   - Dynamically render hero text, stats, studio announcements, and wholesale rates from `/api/content`.
2. In `editor-portal/src/pages/EditorLanding.jsx` & `EditorDashboard.jsx` & `Earnings.jsx`:
   - Dynamically render hero text, technician onboarding CTA, lab guidelines, and production payout rates from `/api/content`.

### Phase 6: SysAdmin Operations & Full Smoke Verification
1. Ensure `sysadmin/src/pages/Orders.jsx` displays full order specifications (service type, sheets up to 150, custom flex dimensions, video multicam, and pen drive return tracking).
2. Verify B2B Portal (`b2b-portal/`) shows wholesale prices while client storefront shows sanitized retail prices.
3. Run all test suites: `npm run test:pricing`, `npm run audit:ui`, `npm run smoke`.
4. Verify clean build across all 5 applications via `node build-all-unified.mjs`.

---
*WeddingAlbums.in — The definitive luxury Indian wedding album & lab post-production platform.*
