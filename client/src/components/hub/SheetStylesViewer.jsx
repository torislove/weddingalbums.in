import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Droplets, ShieldCheck, Layers, Eye, RefreshCw, HandMetal } from 'lucide-react';
import './SheetStylesViewer.css';

const DEFAULT_SHEETS = [
  {
    id: "metallic-gold",
    n: "01",
    title: "24K Metallic Gold Gloss",
    telugu: "24K మెటాలిక్ గోల్డ్ గ్లోస్",
    gsm: "350 GSM Archival",
    texture: "Rich reflective pearlescent luster",
    clientPriceBadge: "₹110 / sheet",
    description: "Rich reflective pearlescent finish that captures ambient warm lighting. High-gloss pearlized luster with water-resistant archival film. Elevates Mangalasutram, Talambralu, and heavy 22K gold jewelry into luminous museum art.",
    color: "#E6C667",
    shineType: "metallic",
    rigidity: "High Rigid Core (350 GSM)",
    waterResistance: "100% Waterproof",
    bestFor: "Muhurtham, Talambralu, 22K Gold Jewelry Moments",
    mockImage: "/images/weddingalbums-talambralu.png",
    sampleCaption: "Talambralu Pearlized Specular Shimmer"
  },
  {
    id: "royal-velvet",
    n: "02",
    title: "Royal Velvet Feather Touch",
    telugu: "రాయల్ వెల్వెట్ ఫెదర్ టచ్",
    gsm: "400 GSM Rigid Core",
    texture: "Ultra-soft, anti-scratch, anti-fingerprint matte",
    clientPriceBadge: "₹135 / sheet",
    description: "Ultra-luxurious peach-fuzz tactile velvet feel. 100% anti-glare, anti-fingerprint scuff-resistant surface. When hands touch the page, the softness evokes heirloom royalty with zero glare under room spotlights.",
    color: "#722F37",
    shineType: "velvet-matte",
    rigidity: "Maximum 400 GSM Rigid Core",
    waterResistance: "Splash & Scratch Resistant",
    bestFor: "Candid Portraits, Reception Glamour, Editorial Poses",
    mockImage: "/images/bride-polished.jpg",
    sampleCaption: "Anti-Glare Zero-Smudge Peach Fuzz Touch"
  },
  {
    id: "pure-silk",
    n: "03",
    title: "Pure Silk Texture (Pattu)",
    telugu: "ప్యూర్ సిల్క్ టెక్స్చర్ (పట్టు)",
    gsm: "380 GSM Textured",
    texture: "Woven South Indian silk fabric finish",
    clientPriceBadge: "₹145 / sheet",
    description: "Embossed with micro-woven silk threads mimicking sacred Kanjeevaram and Dharmavaram pattu sarees. Shimmers dynamically under room lighting with genuine textile texture.",
    color: "#D4AF37",
    shineType: "silk-weave",
    rigidity: "High Rigid Core (380 GSM)",
    waterResistance: "Moisture Protected",
    bestFor: "Traditional Saree Moments, Vedic Rituals, Bridal Silk",
    mockImage: "/images/mangalya-dharana.png",
    sampleCaption: "Authentic Pattu Silk Woven Textile Luster"
  },
  {
    id: "non-tearable",
    n: "04",
    title: "Non-Tearable Poly-Luster Archival",
    telugu: "నాన్-టియరబుల్ పాలీ-లస్టర్",
    gsm: "300 GSM Archival Poly",
    texture: "100% waterproof, untearable synthetic sheet",
    clientPriceBadge: "₹85 / sheet",
    description: "Engineered from high-density synthetic polymer sheets that cannot be torn, folded, or damaged by moisture, coastal humidity, or curious toddlers. Lifetime archival guarantee.",
    color: "#4A90E2",
    shineType: "poly-luster",
    rigidity: "Flexible & Indestructible (300 GSM Poly)",
    waterResistance: "100% Immersion Proof",
    bestFor: "Lifetime Family Heirlooms, Frequent Viewing, Coastal Climate",
    mockImage: "/images/weddingalbums-layflat-album.png",
    sampleCaption: "100% Waterproof & Untearable Synthetic Core"
  },
  {
    id: "crystal-gloss",
    n: "05",
    title: "HD Silver Halide Crystal Gloss",
    telugu: "HD సిల్వర్ హాలైడ్ క్రిస్టల్ గ్లోస్",
    gsm: "320 GSM Photographic",
    texture: "True optical continuous-tone photographic print",
    clientPriceBadge: "₹120 / sheet",
    description: "Genuine continuous-tone photographic silver halide paper. Provides deeper blacks, radiant contrast, and razor-sharp clarity without any digital dot pattern.",
    color: "#E0E0E0",
    shineType: "crystal-reflection",
    rigidity: "Rigid Board Core (320 GSM)",
    waterResistance: "Archival Resin Coated",
    bestFor: "High-DPI Close-Ups, High-Fashion Bridal Shoots, Fireworks",
    mockImage: "/images/luxury-album-craftsmanship.jpg",
    sampleCaption: "True Optical Continuous-Tone Razor Clarity"
  },
  {
    id: "matte-linen",
    n: "06",
    title: "Natural Matte Fine Art Linen",
    telugu: "నేచురల్ మ్యాట్ ఫైన్ ఆర్ట్ లినెన్",
    gsm: "350 GSM Organic Cotton",
    texture: "Minimalist European organic cross-grain finish",
    clientPriceBadge: "₹105 / sheet",
    description: "Crafted from fine cotton rag with organic cross-hatch linen texture. Museum-grade anti-reflective finish with timeless European understated elegance.",
    color: "#E8DFD8",
    shineType: "organic-matte",
    rigidity: "High Rigid Core (350 GSM)",
    waterResistance: "Archival Matte Film",
    bestFor: "Pre-Wedding Outdoor Shoots, Monochromatic Fine Art",
    mockImage: "/images/prewedding.jpg",
    sampleCaption: "European Organic Cross-Hatch Fine Art Grain"
  }
];

export default function SheetStylesViewer({ sheets = DEFAULT_SHEETS }) {
  const activeSheets = sheets && sheets.length ? sheets : DEFAULT_SHEETS;
  const [selectedSheetId, setSelectedSheetId] = useState(activeSheets[0].id);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isWaterTestActive, setIsWaterTestActive] = useState(false);
  const [isFingerprintTestActive, setIsFingerprintTestActive] = useState(false);
  const [isPageCurled, setIsPageCurled] = useState(false);
  const sheetCardRef = useRef(null);

  const selectedSheet = activeSheets.find(s => s.id === selectedSheetId) || activeSheets[0];

  const handleMouseMove = (e) => {
    if (!sheetCardRef.current) return;
    const rect = sheetCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = Math.round((x / rect.width) * 100);
    const percentY = Math.round((y / rect.height) * 100);

    // Subtle 3D tilt
    const tiltY = ((percentX - 50) / 50) * 12; // -12 to 12 deg
    const tiltX = -((percentY - 50) / 50) * 10; // -10 to 10 deg

    setTilt({ x: tiltX, y: tiltY });
    setLightPos({ x: percentX, y: percentY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setLightPos({ x: 50, y: 50 });
  };

  // Toggle demo states
  const triggerWaterTest = () => {
    setIsWaterTestActive(true);
    setTimeout(() => setIsWaterTestActive(false), 4500);
  };

  const triggerFingerprintTest = () => {
    setIsFingerprintTestActive(true);
    setTimeout(() => setIsFingerprintTestActive(false), 4000);
  };

  return (
    <div className="sheet-mock-viewer-container">
      {/* Section Header */}
      <div className="sheet-viewer-header text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold mb-3 tracking-widest uppercase">
          <Sparkles size={13} />
          <span>Interactive Material & Texture Simulator</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
          Touch & Feel Andhra Pradesh's 6 Luxury Sheet Textures
        </h2>
        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto font-sans">
          Hover, tilt, or test water & smudge resistance to see how each archival material reflects warm venue lighting and protects family memories for 100+ years.
        </p>
      </div>

      {/* Swatch Navigation Tabs */}
      <div className="sheet-swatch-tabs-grid">
        {activeSheets.map((sheet, index) => {
          const isActive = sheet.id === selectedSheet.id;
          return (
            <button
              key={sheet.id}
              onClick={() => {
                setSelectedSheetId(sheet.id);
                setIsWaterTestActive(false);
                setIsFingerprintTestActive(false);
              }}
              className={`sheet-tab-card ${isActive ? 'active' : ''}`}
              style={{ '--accent-color': sheet.color }}
            >
              <div className="sheet-tab-badge-strip">
                <span className="sheet-number">{sheet.n || `0${index + 1}`}</span>
                <span className="sheet-tab-gsm">{sheet.gsm.split(' ')[0]} GSM</span>
              </div>
              <div className="sheet-tab-name">{sheet.title}</div>
              <div className="sheet-tab-telugu">{sheet.telugu}</div>
              <div className="sheet-tab-price">{sheet.clientPriceBadge}</div>
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
            className={`sheet-simulation-card ${selectedSheet.shineType} ${isPageCurled ? 'curled' : ''}`}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              '--light-x': `${lightPos.x}%`,
              '--light-y': `${lightPos.y}%`,
              '--accent': selectedSheet.color
            }}
          >
            {/* Sheet Media Sample */}
            <div className="sheet-photo-surface">
              <img
                src={selectedSheet.mockImage || '/images/weddingalbums-layflat-album.png'}
                alt={selectedSheet.title}
                className="sheet-sample-image"
                loading="lazy"
              />
              
              {/* Dynamic Texture Overlay Layer */}
              <div className={`sheet-texture-shimmer-layer ${selectedSheet.shineType}`} />

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
                    {selectedSheet.shineType === 'velvet-matte'
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
                <span className="dot" style={{ backgroundColor: selectedSheet.color }} />
                <span>{selectedSheet.texture}</span>
              </div>
              <div className="sheet-caption-text">{selectedSheet.sampleCaption}</div>
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
              <span>{isPageCurled ? 'Flatten Page' : 'Inspect Core Rigidity'}</span>
            </button>
          </div>
          <div className="sheet-tilt-hint">
            💡 Move your mouse or drag across the sheet to sweep lighting across the texture.
          </div>
        </div>

        {/* Right Side: Detailed Sheet Specs & Highlights */}
        <div className="sheet-specs-detail-panel">
          <div className="specs-card-glass">
            <div className="specs-card-header">
              <span className="specs-tag">{selectedSheet.bestFor}</span>
              <div className="specs-pricing-badge">{selectedSheet.clientPriceBadge}</div>
            </div>

            <h3 className="specs-title">{selectedSheet.title}</h3>
            <h4 className="specs-telugu">{selectedSheet.telugu}</h4>
            <p className="specs-description">{selectedSheet.description}</p>

            {/* Specification Metrics */}
            <div className="specs-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Paper Weight & Core</span>
                <span className="metric-value font-mono text-[#D4AF37]">{selectedSheet.gsm}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Water & Moisture</span>
                <span className="metric-value font-mono text-cyan-400">{selectedSheet.waterResistance}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Tactile Texture</span>
                <span className="metric-value font-mono text-white">{selectedSheet.texture}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Rigidity Structure</span>
                <span className="metric-value font-mono text-emerald-400">{selectedSheet.rigidity}</span>
              </div>
            </div>

            {/* Why Choose This Sheet */}
            <div className="specs-why-choose">
              <div className="why-label font-bold text-xs uppercase tracking-wider text-gray-400 mb-2">
                Recommended For
              </div>
              <div className="why-content text-sm text-gray-200 bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 font-bold">
                  ✓
                </div>
                <span>{selectedSheet.bestFor}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="specs-actions-bar mt-6 flex gap-3">
              <a
                href="/order"
                className="btn btn-gold-3d flex-1 py-3 text-center font-bold text-sm"
              >
                Choose {selectedSheet.title.split(' ')[0]} Sheet →
              </a>
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`నమస్కారం! నేను ${selectedSheet.title} (${selectedSheet.telugu}) షీట్ శాంపిల్స్ గురించి వివరాలు తెలుసుకోవాలనుకుంటున్నాను.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline py-3 px-4 text-[#25D366] border-[#25D366]/40 hover:bg-[#25D366]/15 flex items-center justify-center text-sm font-semibold"
              >
                Request Physical Swatch
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
