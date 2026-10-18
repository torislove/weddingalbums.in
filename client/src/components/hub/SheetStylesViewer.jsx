import React, { useState, useRef } from 'react';
import { Sparkles, Droplets, ShieldCheck, Layers, Eye, HandMetal, CheckCircle2, Sliders, Info, Shield, Award } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import './SheetStylesViewer.css';

// ============================================================================
// DIMENSION 1: SURFACE FINISHES & COATINGS (8 INDUSTRY LAB FINISHES)
// ============================================================================
const SURFACE_FINISHES = [
  {
    id: "ntr-matte",
    n: "01",
    title: "NTR Anti-Glare Matte",
    telugu: "నాన్-టియరబుల్ మ్యాట్ (స్టాండర్డ్)",
    tier: "standard",
    surchargePerSheet: 0,
    priceLabel: "Included in Base Price (₹0 Extra)",
    badge: "Standard Price",
    gsm: "350 GSM Lay-Flat",
    texture: "Smooth non-reflective glare-free coating",
    shineType: "matte-soft",
    color: "#4A90E2",
    waterResistance: "100% Waterproof",
    bestFor: "Stage group photos, ambient room lighting, fingerprint-free handling",
    description: "Traditional lab matte lamination over non-tearable synthetic core. Diffuses reflections under direct tungsten and LED lights. Perfectly clean and clear from every viewing angle.",
    sampleCaption: "Zero-Reflection Soft Matte Finish (Standard)",
    mockImage: "/images/weddingalbums-layflat-album.png"
  },
  {
    id: "ntr-glossy",
    n: "02",
    title: "NTR Crystal High Gloss",
    telugu: "క్రిస్టల్ అల్ట్రా మిర్రర్ గ్లోస్",
    tier: "standard",
    surchargePerSheet: 0,
    priceLabel: "Included in Base Price (₹0 Extra)",
    badge: "Standard Price",
    gsm: "350 GSM Lay-Flat",
    texture: "Super-reflective crystal mirror gloss",
    shineType: "crystal-reflection",
    color: "var(--n-200)",
    waterResistance: "100% Immersion Proof",
    bestFor: "Vivid saturated colors, deep blacks, high-contrast night shots",
    description: "Ultra-glossy clear thermal finish that maximizes color saturation and contrast. Highlights the deep reds of bridal silk and sparkling mandap decor with vivid punch.",
    sampleCaption: "Mirror Reflection Vivid Crystal Gloss (Standard)",
    mockImage: "/images/luxury-album-craftsmanship.jpg"
  },
  {
    id: "silky-matte",
    n: "03",
    title: "Silky / Silk Matte Pearl",
    telugu: "సిల్కీ / సిల్క్ మ్యాట్ పెర్ల్ లస్టర్",
    tier: "luxury",
    surchargePerSheet: 25,
    priceLabel: "+₹25 / sheet upgrade",
    badge: "Popular Upgrade",
    gsm: "360 GSM Rigid",
    texture: "Micro-pearlescent satin texture with silky glide",
    shineType: "silk-weave",
    color: "var(--brand)",
    waterResistance: "100% Moisture Protected",
    bestFor: "Natural Indian skin tones, bridal makeup, elegant portraits",
    description: "Subtle satin micro-texture bridging glossy vibrancy and matte restraint. Renders warm Telugu bridal skin tones with natural radiance and zero harsh glare.",
    sampleCaption: "Micro-Pearlescent Silky Satin Finish (+₹25/sheet)",
    mockImage: "/images/bride-polished.jpg"
  },
  {
    id: "royal-velvet",
    n: "04",
    title: "Velvet / Feather Touch Soft",
    telugu: "రాయల్ వెల్వెట్ ఫెదర్ టచ్ (యాంటీ-స్క్రాచ్)",
    tier: "luxury",
    surchargePerSheet: 35,
    priceLabel: "+₹35 / sheet upgrade",
    badge: "Luxury Favorite",
    gsm: "400 GSM Rigid Core",
    texture: "Peach-fuzz tactile velvet, 100% anti-scratch & anti-smudge",
    shineType: "velvet-matte",
    color: "#722F37",
    waterResistance: "Hydrophobic & Scuff-Proof",
    bestFor: "Candid emotional portraits, editorial shots, premium handling",
    description: "Premium European soft-touch thermal lamination. When hands touch the album spread, the peach-fuzz tactile velvet feel evokes royal luxury. Completely resists fingerprint oils.",
    sampleCaption: "Peach-Fuzz Tactile Velvet Anti-Smudge (+₹35/sheet)",
    mockImage: "/images/weddingalbums-talambralu.png"
  },
  {
    id: "24k-metallic",
    n: "05",
    title: "24K Metallic Pearl Sheen",
    telugu: "24K మెటాలిక్ పెర్ల్ గోల్డ్ గ్లోస్",
    tier: "luxury",
    surchargePerSheet: 45,
    priceLabel: "+₹45 / sheet upgrade",
    badge: "Jewelry Specialist",
    gsm: "380 GSM Rigid",
    texture: "High-gloss metallic pearlized specular shimmer",
    shineType: "metallic",
    color: "var(--brand-soft)",
    waterResistance: "100% Waterproof",
    bestFor: "Muhurtham, Talambralu, 22K Gold jewelry, Zari sarees",
    description: "Archival pearlized metallic film with micro-mica particles. Catches ambient room lighting to create an authentic 3D shimmer across gold jewelry, crowns, and Kanjeevaram zari.",
    sampleCaption: "24K Pearlescent Specular Shimmer (+₹45/sheet)",
    mockImage: "/images/mangalya-dharana.png"
  },
  {
    id: "sparkle-glitter",
    n: "06",
    title: "Sparkle / Glitter Film",
    telugu: "స్పార్కిల్ / గ్లిట్టర్ లామినేషన్",
    tier: "luxury",
    surchargePerSheet: 50,
    priceLabel: "+₹50 / sheet upgrade",
    badge: "Celebration Spec",
    gsm: "380 GSM Rigid",
    texture: "Micro-crystalline diamond glitter sparkle",
    shineType: "sparkle",
    color: "#C084FC",
    waterResistance: "100% Waterproof",
    bestFor: "Sangeet dance, fireworks, reception entries, cocktail night",
    description: "Micro-crystalline glitter film embedded directly into the protective lamination. When light strikes at an angle, thousands of pinpoint diamond sparkles light up night celebration photos.",
    sampleCaption: "Diamond Crystalline Sparkle Shimmer (+₹50/sheet)",
    mockImage: "/images/prewedding.jpg"
  },
  {
    id: "luster-satin",
    n: "07",
    title: "Luster / Satin Archival",
    telugu: "లస్టర్ / శాటిన్ ఆర్కైవల్ ఫినిష్",
    tier: "luxury",
    surchargePerSheet: 30,
    priceLabel: "+₹30 / sheet upgrade",
    badge: "Studio Classic",
    gsm: "350 GSM Lay-Flat",
    texture: "Fine stipple orange-peel photographic luster",
    shineType: "poly-luster",
    color: "#38BDF8",
    waterResistance: "Archival Resin Coated",
    bestFor: "Traditional studio portraits, family group shots, outdoor lawn events",
    description: "The gold standard of lab portraiture with fine orange-peel micro-grain. Perfectly balances high contrast with anti-glare viewing under direct living room spotlights.",
    sampleCaption: "Fine-Grain Studio Photographic Luster (+₹30/sheet)",
    mockImage: "/images/weddingalbums-home-hero.png"
  },
  {
    id: "leatherette-embossed",
    n: "08",
    title: "Canvas / Leatherette Embossed",
    telugu: "లెథరెట్ / కాన్వాస్ ఎంబోస్డ్ టెక్స్చర్",
    tier: "luxury",
    surchargePerSheet: 40,
    priceLabel: "+₹40 / sheet upgrade",
    badge: "Artisan Craft",
    gsm: "400 GSM Heavy Core",
    texture: "Deep woven cross-hatch canvas & leather grain embossing",
    shineType: "organic-matte",
    color: "var(--warn)",
    waterResistance: "Tough Protective Film",
    bestFor: "Fine art weddings, royal palace themes, timeless family keepsakes",
    description: "Mechanically embossed with tactile canvas weave and soft leatherette relief. Transforms modern digital photographic prints into timeless oil-painting style royal masterpieces.",
    sampleCaption: "Deep Tactile Woven Canvas Embossed (+₹40/sheet)",
    mockImage: "/images/client-album-preview.svg"
  }
];

// ============================================================================
// DIMENSION 2: BASE SUBSTRATES & CORE MEDIA (4 LAB FOUNDATIONS)
// ============================================================================
const BASE_SUBSTRATES = [
  {
    id: "ntr-bopp",
    title: "NTR (Non-Tearable BOPP / Synthetic)",
    telugu: "నాన్-టియరబుల్ సింథటిక్ BOPP షీట్",
    standardShare: "80%+ of Indian Weddings",
    tearResistance: "100% Unbreakable (Cannot Tear)",
    waterProofing: "100% Waterproof (Zero Swell)",
    coreMaterial: "Biaxially Oriented Polypropylene (BOPP) / Cosmo Synthetic",
    lifespan: "100+ Years Lifetime Archival",
    pricingNote: "Standard Base Sheet (Included in All Packages)",
    description: "Engineered from high-density synthetic polymer sheets that cannot be torn by hand, creased permanently, or damaged by moisture, coastal humidity, or curious toddlers. 100% waterproof immersion proof.",
    color: "#4A90E2"
  },
  {
    id: "art-paper",
    title: "Regular Wood-Pulp Art Paper (170-300 GSM)",
    telugu: "రెగ్యులర్ ఆర్ట్ పేపర్ (వుడ్-పల్ప్)",
    standardShare: "Budget & Pocket Books",
    tearResistance: "Standard (Can be torn)",
    waterProofing: "Moisture Sensitive (Paper Swell)",
    coreMaterial: "Virgin Wood-Pulp Bleached Chemical Cardstock",
    lifespan: "20-30 Years (Dry Storage)",
    pricingNote: "Economical / Budget Tier",
    description: "Standard high-bulk coated printing paper. Excellent for economical pocket parent books and lightweight guest albums, but requires careful indoor handling and dry storage away from humidity.",
    color: "var(--n-400)"
  },
  {
    id: "silver-halide",
    title: "Silver Halide Chemical Paper (Fuji / Kodak RA-4)",
    telugu: "ట్రూ సిల్వర్ హాలైడ్ కెమికల్ పేపర్ (Fuji DP2)",
    standardShare: "True Continuous-Tone Labs",
    tearResistance: "Resin-Coated Photographic (Tear Resistant)",
    waterProofing: "Water Resistant Resin-Coated Base",
    coreMaterial: "Silver Halide Crystals Optical RGB Laser Minilab",
    lifespan: "100-Year Lab Optical Standard",
    pricingNote: "+₹40 / sheet upgrade over NTR base",
    description: "Genuine continuous-tone optical photographic paper exposed via RGB laser diode and wet chemical processing (RA-4). Completely free of digital ink-jet screening dots for unmatched micro-detail.",
    color: "var(--ok)"
  },
  {
    id: "cotton-rag",
    title: "100% Cotton Rag Fine Art (Hahnemühle / Giclée)",
    telugu: "100% కాటన్ రాగ్ ఫైన్ ఆర్ట్ (మ్యూజియం గ్రేడ్)",
    standardShare: "Fine Art & Museum Grade",
    tearResistance: "Dense Natural Cotton Fibers",
    waterProofing: "Acid-Free Archival (Requires dry care)",
    coreMaterial: "Pure Cotton Linter / Alpha Cellulose Fibers",
    lifespan: "200+ Year Museum Conservation",
    pricingNote: "+₹60 / sheet upgrade over NTR base",
    description: "Museum-grade natural cotton rag paper crafted without optical brightening agents (OBAs). Velvety watercolor texture with archival acid-free rating for ultra-luxury bespoke fine art weddings.",
    color: "var(--warn)"
  }
];

export default function SheetStylesViewer() {
  const { content } = useContent();
  const rawWa = content?.siteSettings?.whatsapp || content?.global?.siteSettings?.whatsapp || content?.global?.navbar?.whatsapp || '919494845111';
  const cleanWa = String(rawWa).replace(/[^0-9]/g, '') || '919494845111';

  const [activeDimension, setActiveDimension] = useState('finishes'); // 'finishes' | 'substrates'
  const [selectedFinishId, setSelectedFinishId] = useState('ntr-matte');
  const [selectedSubstrateId, setSelectedSubstrateId] = useState('ntr-bopp');
  
  // Sheet Count Simulator (Standard Base = 30 sheets = 60 pages)
  const [sheetCount, setSheetCount] = useState(30);

  // Interactive 3D Simulator States
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isWaterTestActive, setIsWaterTestActive] = useState(false);
  const [isFingerprintTestActive, setIsFingerprintTestActive] = useState(false);
  const [isPageCurled, setIsPageCurled] = useState(false);
  const sheetCardRef = useRef(null);

  const selectedFinish = SURFACE_FINISHES.find(s => s.id === selectedFinishId) || SURFACE_FINISHES[0];
  const selectedSubstrate = BASE_SUBSTRATES.find(s => s.id === selectedSubstrateId) || BASE_SUBSTRATES[0];

  // Mathematical Calculation for Sheet Count and Luxury Finish
  const baseAlbumPrice = 9500; // Standard 12×36 with 30 sheets in NTR Matte/Gloss
  const baseSheetsIncluded = 30;
  const extraSheetBaseRate = 70; // Cost per extra sheet for base substrate
  const sheetDelta = sheetCount - baseSheetsIncluded;
  const sheetCountAdjustment = sheetDelta * extraSheetBaseRate;
  const finishSurchargeTotal = sheetCount * selectedFinish.surchargePerSheet;
  const calculatedTotal = baseAlbumPrice + sheetCountAdjustment + finishSurchargeTotal;

  const handleMouseMove = (e) => {
    if (!sheetCardRef.current) return;
    const rect = sheetCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = Math.round((x / rect.width) * 100);
    const percentY = Math.round((y / rect.height) * 100);

    const tiltY = ((percentX - 50) / 50) * 12;
    const tiltX = -((percentY - 50) / 50) * 10;

    setTilt({ x: tiltX, y: tiltY });
    setLightPos({ x: percentX, y: percentY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setLightPos({ x: 50, y: 50 });
  };

  const triggerWaterTest = () => {
    setIsWaterTestActive(true);
    setTimeout(() => setIsWaterTestActive(false), 4500);
  };

  const triggerFingerprintTest = () => {
    setIsFingerprintTestActive(true);
    setTimeout(() => setIsFingerprintTestActive(false), 4000);
  };

  return (
    <div className="sheet-mock-viewer-container" id="sheets-catalog">
      {/* Section Header */}
      <div className="sheet-viewer-header text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/30 text-[var(--brand)] text-xs font-bold mb-3 tracking-widest uppercase">
          <Sparkles size={14} />
          <span>Indian Professional Lab Sheet Taxonomy</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-3">
          The Two Dimensions of Wedding Album Paper
        </h2>
        <p className="text-sm md:text-base text-gray-300 max-w-3xl mx-auto font-sans leading-relaxed">
          In professional Indian wedding printing labs, sheets are categorized across two distinct technical dimensions:
          the <strong className="text-white">Base Substrate</strong> (core media strength & water resistance) and the <strong className="text-white">Surface Finish</strong> (lamination coating & optical specular reflection).
        </p>

        {/* Dimension Switcher Buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => setActiveDimension('finishes')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeDimension === 'finishes'
                ? 'bg-[var(--brand)] text-black shadow-lg shadow-[var(--brand)]/20 scale-105'
                : 'bg-white/10 text-gray-300 hover:bg-white/15 border border-white/10'
            }`}
          >
            <Sparkles size={16} />
            <span>Dimension 1: Surface Finishes & Laminations (8 Types)</span>
          </button>
          <button
            onClick={() => setActiveDimension('substrates')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeDimension === 'substrates'
                ? 'bg-[var(--brand)] text-black shadow-lg shadow-[var(--brand)]/20 scale-105'
                : 'bg-white/10 text-gray-300 hover:bg-white/15 border border-white/10'
            }`}
          >
            <Layers size={16} />
            <span>Dimension 2: Base Substrates & Core Media (4 Labs)</span>
          </button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* TAB 1: SURFACE FINISHES & LAMINATIONS */}
      {/* ================================================================== */}
      {activeDimension === 'finishes' && (
        <div className="finishes-dimension-view">
          {/* Swatch Navigation Tabs Grid */}
          <div className="sheet-swatch-tabs-grid">
            {SURFACE_FINISHES.map((sheet, index) => {
              const isActive = sheet.id === selectedFinish.id;
              const isStandard = sheet.tier === 'standard';
              return (
                <button
                  key={sheet.id}
                  onClick={() => {
                    setSelectedFinishId(sheet.id);
                    setIsWaterTestActive(false);
                    setIsFingerprintTestActive(false);
                  }}
                  className={`sheet-tab-card ${isActive ? 'active' : ''} ${isStandard ? 'standard-tier-card' : 'luxury-tier-card'}`}
                  style={{ '--accent-color': sheet.color }}
                >
                  <div className="sheet-tab-badge-strip">
                    <span className="sheet-number">{sheet.n}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isStandard ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[var(--brand)]/20 text-[var(--brand)] border border-[var(--brand)]/30'
                    }`}>
                      {sheet.badge}
                    </span>
                  </div>
                  <div className="sheet-tab-name">{sheet.title}</div>
                  <div className="sheet-tab-telugu">{sheet.telugu}</div>
                  <div className={`sheet-tab-price ${isStandard ? 'text-emerald-400' : 'text-[var(--brand)]'}`}>
                    {sheet.priceLabel}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive 3D Sheet Stage */}
          <div className="sheet-interactive-stage">
            {/* Left Side: 3D Sheet Simulation Card */}
            <div className="sheet-card-perspective-box">
              <div
                ref={sheetCardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`sheet-simulation-card ${selectedFinish.shineType} ${isPageCurled ? 'curled' : ''}`}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  '--light-x': `${lightPos.x}%`,
                  '--light-y': `${lightPos.y}%`,
                  '--accent': selectedFinish.color
                }}
              >
                {/* Sheet Media Sample */}
                <div className="sheet-photo-surface">
                  <img
                    src={selectedFinish.mockImage || '/images/weddingalbums-layflat-album.png'}
                    alt={selectedFinish.title}
                    className="sheet-sample-image"
                    loading="lazy"
                  />
                  
                  {/* Dynamic Texture Overlay Layer */}
                  <div className={`sheet-texture-shimmer-layer ${selectedFinish.shineType}`} />

                  {/* Dynamic Specular Light Flare */}
                  <div
                    className="sheet-specular-light-flare"
                    style={{
                      left: `${lightPos.x}%`,
                      top: `${lightPos.y}%`
                    }}
                  />

                  {/* Water droplet simulation overlay */}
                  {isWaterTestActive && (
                    <div className="sheet-water-splash-simulation">
                      <div className="water-droplet d1" />
                      <div className="water-droplet d2" />
                      <div className="water-droplet d3" />
                      <div className="water-droplet d4" />
                      <div className="water-droplet d5" />
                      <div className="water-splash-badge">
                        <Droplets size={14} /> 100% Hydrophobic Archival Shield (Zero Absorption)
                      </div>
                    </div>
                  )}

                  {/* Fingerprint smudge test simulation overlay */}
                  {isFingerprintTestActive && (
                    <div className="sheet-fingerprint-test-simulation">
                      <div className="fingerprint-scan-line" />
                      <div className="fingerprint-badge">
                        <ShieldCheck size={14} />
                        {selectedFinish.shineType === 'velvet-matte'
                          ? 'Feather-Touch Matte: 0% Fingerprint Smudges'
                          : 'Protective UV Lamination: Wipes Clean Instantly'}
                      </div>
                    </div>
                  )}

                  {/* Page Curl / Core Thickness Corner */}
                  <div 
                    className="sheet-curl-corner"
                    onClick={() => setIsPageCurled(!isPageCurled)}
                    title="Click to view rigid core thickness"
                  >
                    <span className="curl-hint">{isPageCurled ? 'Flatten' : 'Touch Edge'}</span>
                  </div>
                </div>

                {/* Bottom Surface Badge on Sheet */}
                <div className="sheet-surface-watermark">
                  <div className="sheet-material-type-pill">
                    <span className="dot" style={{ backgroundColor: selectedFinish.color }} />
                    <span>{selectedFinish.texture}</span>
                  </div>
                  <div className="sheet-caption-text">{selectedFinish.sampleCaption}</div>
                </div>
              </div>

              {/* Interactive Stage Controls Bar */}
              <div className="sheet-stage-controls">
                <button
                  onClick={triggerWaterTest}
                  className={`stage-action-btn ${isWaterTestActive ? 'btn-active' : ''}`}
                >
                  <Droplets size={15} className="text-cyan-400" />
                  <span>Splash Water Test</span>
                </button>
                <button
                  onClick={triggerFingerprintTest}
                  className={`stage-action-btn ${isFingerprintTestActive ? 'btn-active' : ''}`}
                >
                  <HandMetal size={15} className="text-emerald-400" />
                  <span>Touch & Smudge Test</span>
                </button>
                <button
                  onClick={() => setIsPageCurled(v => !v)}
                  className={`stage-action-btn ${isPageCurled ? 'btn-active' : ''}`}
                >
                  <Layers size={15} className="text-amber-400" />
                  <span>{isPageCurled ? 'Flatten Page' : 'Inspect Lay-Flat Core'}</span>
                </button>
              </div>
              <div className="sheet-tilt-hint">
                💡 Move mouse or drag finger to sweep ambient lighting across the surface finish.
              </div>
            </div>

            {/* Right Side: Detailed Finish Specs & Live Sheet-Count Calculator */}
            <div className="sheet-specs-detail-panel">
              <div className="specs-card-glass">
                <div className="specs-card-header">
                  <span className={`specs-tag ${selectedFinish.tier === 'standard' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-[var(--brand)]'}`}>
                    {selectedFinish.badge}
                  </span>
                  <div className={`specs-pricing-badge ${selectedFinish.tier === 'standard' ? 'text-emerald-400' : 'text-[var(--brand)]'}`}>
                    {selectedFinish.priceLabel}
                  </div>
                </div>

                <h3 className="specs-title">{selectedFinish.title}</h3>
                <h4 className="specs-telugu">{selectedFinish.telugu}</h4>
                <p className="specs-description">{selectedFinish.description}</p>

                {/* Specification Metrics */}
                <div className="specs-metrics-grid">
                  <div className="metric-box">
                    <span className="metric-label">Paper Weight & Core</span>
                    <span className="metric-value font-mono text-[var(--brand)]">{selectedFinish.gsm}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Water & Moisture</span>
                    <span className="metric-value font-mono text-cyan-400">{selectedFinish.waterResistance}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Tactile Texture</span>
                    <span className="metric-value font-mono text-white">{selectedFinish.texture}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-label">Recommended Ritual</span>
                    <span className="metric-value font-mono text-emerald-400">{selectedFinish.bestFor}</span>
                  </div>
                </div>

                {/* LIVE SHEET COUNT & PRICING CALCULATOR */}
                <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                      <Sliders size={13} className="text-[var(--brand)]" />
                      Sheet Count Calculator (1 Sheet = 2 Pages)
                    </span>
                    <span className="text-xs font-mono font-bold text-[var(--brand)]">
                      {sheetCount} Sheets ({sheetCount * 2} Pages)
                    </span>
                  </div>

                  {/* Sheet Count Preset Buttons */}
                  <div className="grid grid-cols-6 gap-1.5 mb-4">
                    {[20, 25, 30, 35, 40, 50].map((count) => (
                      <button
                        key={count}
                        onClick={() => setSheetCount(count)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          sheetCount === count
                            ? 'bg-[var(--brand)] text-black border-[var(--brand)]'
                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {count} S
                        {count === 30 && <span className="block text-[9px] opacity-75 font-normal">Base</span>}
                      </button>
                    ))}
                  </div>

                  {/* Itemized Calculation Breakdown */}
                  <div className="text-xs space-y-1.5 pt-3 border-t border-white/10 font-mono">
                    <div className="flex justify-between text-gray-400">
                      <span>Base 12×36 Album (30 Sheets Standard):</span>
                      <span className="text-white">₹{baseAlbumPrice.toLocaleString('en-IN')}</span>
                    </div>
                    {sheetDelta !== 0 && (
                      <div className="flex justify-between text-gray-400">
                        <span>Sheet Count Delta ({sheetDelta > 0 ? `+${sheetDelta}` : sheetDelta} sheets @ ₹{extraSheetBaseRate}):</span>
                        <span className={sheetDelta > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                          {sheetDelta > 0 ? `+₹${sheetCountAdjustment.toLocaleString('en-IN')}` : `-₹${Math.abs(sheetCountAdjustment).toLocaleString('en-IN')}`}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-400">
                      <span>{selectedFinish.title} Surcharge ({sheetCount} sheets × ₹{selectedFinish.surchargePerSheet}):</span>
                      <span className={selectedFinish.surchargePerSheet > 0 ? 'text-[var(--brand)]' : 'text-emerald-400'}>
                        {selectedFinish.surchargePerSheet > 0 ? `+₹${finishSurchargeTotal.toLocaleString('en-IN')}` : '₹0 (Included)'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/15">
                      <span>Total Estimated Album Cost:</span>
                      <span className="text-[var(--brand)]">₹{calculatedTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="specs-actions-bar mt-5 flex gap-3">
                  <a
                    href={`/order?finish=${selectedFinish.id}&sheets=${sheetCount}`}
                    className="btn btn-gold-3d flex-1 py-3 text-center font-bold text-sm"
                  >
                    Configure {selectedFinish.title.split(' ')[0]} in Booking →
                  </a>
                  <a
                    href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`నమస్కారం! నేను ${selectedFinish.title} (${sheetCount} షీట్స్) గురించి మరిన్ని వివరాలు మరియు శాంపిల్స్ తెలుసుకోవాలనుకుంటున్నాను.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline py-3 px-4 text-[#25D366] border-[#25D366]/40 hover:bg-[#25D366]/15 flex items-center justify-center text-sm font-semibold"
                  >
                    WhatsApp Sample
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TAB 2: BASE SUBSTRATES & CORE MEDIA */}
      {/* ================================================================== */}
      {activeDimension === 'substrates' && (
        <div className="substrates-dimension-view mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BASE_SUBSTRATES.map((substrate) => {
              const isNtr = substrate.id === 'ntr-bopp';
              return (
                <div
                  key={substrate.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isNtr
                      ? 'bg-gradient-to-br from-blue-950/40 via-black/80 to-black/90 border-blue-500/40 shadow-xl shadow-blue-500/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        {substrate.standardShare}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white">{substrate.title}</h3>
                      <h4 className="text-xs text-gray-400 telugu-text">{substrate.telugu}</h4>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isNtr ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/10 text-gray-300'
                    }`}>
                      {substrate.pricingNote}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    {substrate.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-black/40 p-3.5 rounded-xl border border-white/5">
                    <div>
                      <span className="text-gray-400 block text-[11px]">Tear Resistance:</span>
                      <span className="text-white font-bold">{substrate.tearResistance}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Waterproofing:</span>
                      <span className="text-cyan-400 font-bold">{substrate.waterProofing}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Core Composition:</span>
                      <span className="text-gray-200">{substrate.coreMaterial}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Archival Longevity:</span>
                      <span className="text-[var(--brand)] font-bold">{substrate.lifespan}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {isNtr ? '⭐ Recommended for 100% of Andhra & Telangana Weddings' : 'Bespoke Order Available'}
                    </span>
                    <a
                      href={`/order?substrate=${substrate.id}`}
                      className={`text-xs font-bold py-1.5 px-3.5 rounded-lg border transition-all ${
                        isNtr ? 'bg-[var(--brand)] text-black border-[var(--brand)]' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      Select Base Substrate →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

