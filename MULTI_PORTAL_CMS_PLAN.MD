# 🌐 Unified Multi-Portal CMS & Live Visual Editor Implementation Plan
**Version 9.0 | Direct Canvas Editing for Client Storefront (B2C), Studio Portal (B2B) & Lab Production (Editor Portal)**
*WeddingAlbums.in · Pure Live In-Context Editing · Unified Content Schema · Real-Time SSE Propagation*

---

## 1. Executive Summary & Core Objectives

### The Problem Identified:
1. **Unwanted / Non-Editable Clutter in UIAdmin**:
   - The UIAdmin sidebar previously featured legacy routes (`/pages/home`, `/pages/about`, `/pages/services`, etc.) that loaded `PageEditor.jsx` with an `<iframe>` set to `pointer-events: none` and overlaid with `backdrop-blur-md`.
   - Administrators could not edit directly on the page, resulting in a frozen, blurred experience with confusing sidebar block forms.
2. **Missing CMS Control for B2B & Editor Portals**:
   - While the B2C Client Storefront catalog was editable, content for the **B2B Studio Portal** (`b2b-portal/`) and the **Editor Portal** (`editor-portal/`) remained hardcoded in static JSX files.
   - Administrators could not edit B2B landing announcements, studio wholesale rates, editor technician onboarding text, or production payout rates (Karizma layout ₹/sheet, RAW retouching ₹/photo).
3. **Disjointed User Experience**:
   - The administrator had no single command center to oversee and update the entire customer-to-lab lifecycle across all 3 user-facing applications.

### The Solution:
1. **Remove Unwanted Clutter & Keep Only 100% Editable Surfaces**:
   - Strip out obsolete iframe page editors and dead links.
   - Streamline UIAdmin sidebar to 4 high-value, active tools:
     - 🌟 **Multi-Portal Live Canvas Editor** (`/` & `/visual-editor`)
     - 📖 **Universal Catalog & Wholesale Rates** (`/catalog`)
     - 🖼️ **Media Asset Library** (`/images`)
     - 📜 **Publish History & Audit Log** (`/history`)
2. **Unified Multi-Portal Live Canvas Editor**:
   - An on-canvas direct editor in `uiadmin/src/pages/VisualLiveEditor.jsx` with a 3-way portal switcher:
     - **[🛍️ Client Storefront (B2C)]**: Hero, Telugu subtext, 150-sheet album formats, retail per-sheet prices, paper finishes, 4K video editing, event flex banners, and combo bundles.
     - **[🏢 Studio Trade Portal (B2B)]**: Studio landing hero, value propositions, partner registration CTA, studio announcements banner, wholesale per-sheet rates, cover charges, and turnaround SLAs.
     - **[🎬 Lab Production (Editor Portal)]**: Technician landing hero, workbench description, lab quality standards & announcements, and production payout rate cards (album Karizma layout, photo retouching, video teaser/documentary).
3. **True Live On-Canvas Direct Editing (Zero Option Modals)**:
   - Click directly on text to edit.
   - Click directly on prices to update rates.
   - Click on images to switch presets or paste URLs.
   - Click `+ Add` directly on the card grids to introduce new sizes or services.
   - 1-click **🚀 PUBLISH LIVE CHANGES** immediately commits to the database, writes fallback JSON files to disk, and broadcasts SSE updates to all running portals.
4. **Dynamic Portal Consumption**:
   - `client`, `b2b-portal`, and `editor-portal` dynamically fetch and render CMS content from `/api/content`, updating in real-time when published.

---

## 2. Multi-Portal Architecture & Data Schema

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SERVER CONTENT SCHEMA (/api/content)                         │
│                                                                                             │
│  ┌────────────────────────┐   ┌───────────────────────────┐   ┌──────────────────────────┐  │
│  │ 1. servicesCatalog     │   │ 2. b2bPortal              │   │ 3. editorPortal          │  │
│  │ (B2C Client Storefront)│   │ (B2B Studio Trade Portal) │   │ (Lab Production Portal)  │  │
│  ├────────────────────────┤   ├───────────────────────────┤   ├──────────────────────────┤  │
│  │ • hubBanner (EN & TE)  │   │ • landingHero             │   │ • landingHero            │  │
│  │ • albumSizes (150 sh)  │   │ • studioAnnouncements     │   │ • labAnnouncements       │  │
│  │ • sheetStyles (NTR etc)│   │ • wholesaleRateCard       │   │ • productionPayouts:     │  │
│  │ • videoEditing (4K)    │   │ • coverCharges            │   │   - Karizma Layout ₹/sh  │  │
│  │ • invitationsAndFlex   │   │ • slaGuarantees           │   │   - RAW Retouching ₹/pic │  │
│  │ • photoEditing         │   │ • partnerBenefits         │   │   - Video Teaser & Film  │  │
│  └────────────────────────┘   └───────────────────────────┘   └──────────────────────────┘  │
└──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              UIADMIN LIVE VISUAL CANVAS (`/`)                               │
│                                                                                             │
│  [  🛍️ Client Storefront (B2C)  │  🏢 Studio Trade Portal (B2B)  │  🎬 Lab Production (Editor)  ] │
│  Viewport: [🖥️ Desktop] [📱 Mobile]  │  Status: [🟢 Synced]  │  [ 🚀 PUBLISH LIVE CHANGES ]   │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  • Inline text, price, image & boundary editing directly on cards                           │
│  • On-canvas [+ Add Product] buttons within each category                                   │
│  • 1-Click instant save -> DB + Disk fallback + SSE broadcast                               │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### JSON Data Structure Specification (`global` in `content.json`):
```json
{
  "global": {
    "servicesCatalog": {
      "hubBanner": {
        "eyebrow": "✦ ANDHRA PRADESH & TELANGANA #1 POST-PRODUCTION & PRINT LAB ✦",
        "eyebrowTel": "ఆంధ్రప్రదేశ్ & తెలంగాణ నెం.1 పోస్ట్ ప్రొడక్షన్ & ప్రింట్ ల్యాబ్",
        "title": "Complete Wedding Media Storefront for Couples & Elite Studios",
        "titleTel": "కపుల్స్ & స్టూడియోల కోసం పూర్తి వెడ్డింగ్ మీడియా స్టోర్‌ఫ్రంట్",
        "subtitle": "Transparent Per-Sheet pricing on all album sizes, Netflix-grade cinematic video editing, animated WhatsApp invitations, and heavy-duty event flex."
      },
      "albumPrinting": {
        "albumSizes": [ ... ],
        "sheetStyles": [ ... ]
      },
      "videoEditing": [ ... ],
      "invitationsAndFlex": [ ... ],
      "photoEditing": [ ... ]
    },
    "b2bPortal": {
      "landingHero": {
        "eyebrow": "✦ FOR COMMERCIAL WEDDING STUDIOS & LAB PARTNERS ✦",
        "title": "The Invisible Engine For Elite Studios",
        "subtitle": "Offload your post-production to a 20-member dedicated team. We edit, we design, we print. You shoot and scale.",
        "stats": [
          { "value": "120+", "label": "Partner Studios" },
          { "value": "24-48h", "label": "Express Lab Dispatch" },
          { "value": "40%", "label": "Higher Studio Margins" }
        ],
        "partnerCtaText": "Partner With Us"
      },
      "announcements": [
        {
          "id": "b2b-ann-1",
          "tag": "⚡ EXPRESS DISPATCH",
          "title": "Muhurtham Season Priority Turnaround Active",
          "desc": "All 12×36 and 18×12 album orders submitted before 2 PM dispatched within 48 hours with complimentary white-label packing."
        }
      ],
      "wholesaleRates": {
        "note": "Wholesale prices accessible exclusively to authenticated studio partners."
      }
    },
    "editorPortal": {
      "landingHero": {
        "eyebrow": "✦ AUTHORIZED LAB PRODUCTION WORKBENCH ✦",
        "title": "Craft Royal Heirloom Albums & 4K Wedding Cinema",
        "subtitle": "Authorized workbench for WeddingAlbums.in's certified colorists, retouchers, and album layout specialists.",
        "technicianCtaText": "Technician Onboarding"
      },
      "announcements": [
        {
          "id": "ed-ann-1",
          "tag": "🎨 COLOR PIPELINE",
          "title": "DaVinci Resolve ACES Color Science Mandatory",
          "desc": "Ensure all video color grading adheres to Rec.709 / ACEScct pipeline for calibrated HP Indigo and OLED print-to-video harmony."
        }
      ],
      "productionPayouts": [
        {
          "id": "pay-karizma",
          "role": "Album Layout Designer",
          "task": "12×36 / 18×12 Karizma Spread Layout",
          "rate": 60,
          "unit": "per spread / sheet",
          "turnaround": "24h SLA",
          "badge": "Core Volume"
        },
        {
          "id": "pay-retouch",
          "role": "Master Retoucher",
          "task": "RAW Skin Texture Retouching & Lighting Clean-up",
          "rate": 15,
          "unit": "per approved photo",
          "turnaround": "12h SLA",
          "badge": "High Demand"
        },
        {
          "id": "pay-video-teaser",
          "role": "Cinematographer / Editor",
          "task": "3-5 Min 4K Cinematic Teaser / Reel Pack",
          "rate": 1500,
          "unit": "per completed film",
          "turnaround": "48h SLA",
          "badge": "Premium"
        },
        {
          "id": "pay-video-doc",
          "role": "Senior Video Editor",
          "task": "45 Min / 1 Hr Traditional Ceremony Documentary",
          "rate": 4500,
          "unit": "per completed master",
          "turnaround": "72h SLA",
          "badge": "Major Project"
        },
        {
          "id": "pay-flex-invite",
          "role": "Motion Graphic Designer",
          "task": "60s Animated WhatsApp Video Invitation",
          "rate": 500,
          "unit": "per invitation",
          "turnaround": "24h SLA",
          "badge": "Quick Turn"
        }
      ]
    }
  }
}
```

---

## 3. Step-by-Step Implementation Strategy

### Step 1: Clean & Streamline UIAdmin Navigation (`uiadmin/src/App.jsx`)
- **Remove Obsolete Routes**: Delete sidebar items pointing to `/pages/home`, `/pages/about`, `/pages/services`, `/pages/portfolio`, `/pages/testimonials`, `/pages/contact`, `/calendar`, and `/push`.
- **Refactor Sidebar Navigation**:
  - `🌟 Live Multi-Portal Canvas` (`/` & `/visual-editor`) -> Primary workspace.
  - `📖 Universal Catalog & Wholesale Rates` (`/catalog`) -> Centralized rate matrix.
  - `🖼️ Media Asset Library` (`/images`) -> Asset uploads and stock picker.
  - `📜 Publish History` (`/history`) -> Audit log.
- **Ensure Zero Dead Links**: Every route opens an active, working, responsive tool.

### Step 2: Build the Multi-Portal Live Canvas Editor (`uiadmin/src/pages/VisualLiveEditor.jsx`)
- **Portal Mode Switcher Tabs**:
  - `[🛍️ Client Storefront (B2C)]` (Gold theme)
  - `[🏢 Studio Trade Portal (B2B)]` (Cyan/Gold theme)
  - `[🎬 Lab Production (Editor Portal)]` (Violet/Gold theme)
- **B2C Mode Features**:
  - Hero banner with inline Telugu & English text editing.
  - Album cards with color-coded service badges (`✨ COMPLETE SUITE`, `🖨️ PRINT ONLY`, `🎨 PURE EDITING`), inline name, dimensions, sheet limits (20 to 150), retail per-sheet rate, 30-sheet base total, and live image picker.
  - Paper finishes, 4K video editing, event flex, and combo bundle cards with inline rate editing.
  - On-canvas `+ Add` buttons.
- **B2B Mode Features**:
  - B2B landing hero banner (eyebrow, title, subtitle, studio stats, partner CTA) editable inline.
  - Studio announcements banner editable inline.
  - Wholesale album catalog with wholesale per-sheet rate, customer retail comparison, studio savings per sheet, cover charges, and turnaround SLAs editable inline.
  - B2B paper and video trade rates editable inline.
- **Editor Mode Features**:
  - Editor landing hero banner (eyebrow, title, subtitle, technician CTA) editable inline.
  - Lab quality guidelines & announcements banner editable inline.
  - Production compensation rate cards (Karizma layout ₹/sheet, RAW retouching ₹/photo, video teaser/doc ₹/film) editable inline.
  - On-canvas `+ Add Payout Task` button.
- **Top Command Bar**:
  - Sticky at top: portal mode selector, viewport switcher (`[🖥️ Desktop]` / `[📱 Mobile]`), sync status indicator (`🟢 All Published` / `🟡 Unsaved Edits`), live site preview link, and glowing **🚀 PUBLISH LIVE CHANGES** button.

### Step 3: Server Schema & Persistence Hardening (`server/routes/content.js`)
- Support saving and fetching of `b2bPortal` and `editorPortal` within `global` content.
- Ensure `sanitizeContentForClient(contentData, isB2B)` securely strips studio wholesale prices for public client requests while serving full wholesale data to authenticated studio partners and admins.
- Write published content to both `client/public/content.json` and `server/content_fallback.json`.
- Broadcast SSE event `content:updated` so all open tabs reload their data in real-time.

### Step 4: Dynamic Portal Consumption (`b2b-portal` & `editor-portal`)
- In `b2b-portal/src/pages/B2BLanding.jsx`: Bind landing hero, stats, and studio announcements to `/api/content` with resilient fallbacks.
- In `b2b-portal/src/pages/B2BCatalog.jsx`: Keep synced with live wholesale rates from `/api/content`.
- In `editor-portal/src/pages/EditorLanding.jsx`: Bind landing hero and technician text to `/api/content`.
- In `editor-portal/src/pages/EditorDashboard.jsx` & `Earnings.jsx`: Display live production payout rate cards and lab announcements from `/api/content`.

### Step 5: Verification & Quality Assurance
- Run automated pricing test suite: `npm run test:pricing`.
- Run UI dialog audit: `npm run audit:ui` (0 native `alert`/`confirm` calls).
- Run smoke tests across pages and endpoints: `npm run smoke`.
- Run unified multi-portal build: `node build-all-unified.mjs`.

---

## 4. Key Deliverables & Changes Summary

| Portal / Module | File Path | Scope of Enhancement |
|---|---|---|
| **UIAdmin App** | `uiadmin/src/App.jsx` | Removed non-editable/blurred iframe routes; streamlined sidebar to 4 working tools; default route opens Visual Canvas. |
| **Visual Live Canvas** | `uiadmin/src/pages/VisualLiveEditor.jsx` | Full 3-portal live editor (B2C Storefront, B2B Studio Portal, Editor Portal); direct on-canvas editing for all text, prices, and banners. |
| **Server Content Route** | `server/routes/content.js` | Multi-portal schema persistence; strict retail sanitization; dual-disk fallback; real-time SSE broadcast. |
| **Content Fallback** | `server/content_fallback.json` | Seeded with comprehensive `b2bPortal` and `editorPortal` schemas alongside `servicesCatalog`. |
| **Client Content** | `client/public/content.json` | Updated with full multi-portal schema. |
| **B2B Landing** | `b2b-portal/src/pages/B2BLanding.jsx` | Dynamic binding to CMS hero, stats, and studio announcements. |
| **Editor Landing & Dash** | `editor-portal/src/pages/EditorLanding.jsx`, `EditorDashboard.jsx` | Dynamic binding to CMS hero, lab guidelines, and production payout rates. |

---

*WeddingAlbums.in — The definitive luxury Indian wedding album & lab post-production platform.*
