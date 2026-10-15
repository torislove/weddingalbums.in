import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, Clock, CheckCircle2, ArrowRight, Sparkles, Shield, 
  Truck, BookOpen, Video, Send, Layers, Award, Film, MessageCircle, CheckSquare, Square
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import ScrollReveal from '../ScrollReveal';
import './InstantEstimator.css';

// Fallback catalog if API content is still loading
const FALLBACK_SIZES = [
  { id: "size-14x40", title: "14×40 Magnum Royal Mandap", openSpread: "14\" × 40\"", clientBasePrice: 16500, orientation: "landscape", scaleCategory: "big", tag: "Grand Landscape" },
  { id: "size-12x36", title: "12×36 Grand Imperial (AP Standard)", openSpread: "12\" × 36\"", clientBasePrice: 12500, orientation: "landscape", scaleCategory: "big", popular: true, tag: "Most Popular in AP" },
  { id: "size-12x30", title: "12×30 Royal Wide Panoramic", openSpread: "12\" × 30\"", clientBasePrice: 10500, orientation: "landscape", scaleCategory: "big", tag: "Cinema Landscape" },
  { id: "size-10x30", title: "10×30 Slim Cinema Landscape", openSpread: "10\" × 30\"", clientBasePrice: 9200, orientation: "landscape", scaleCategory: "medium", tag: "Slim Landscape" },
  { id: "size-12x24", title: "12×24 Classic Celebration Square", openSpread: "12\" × 24\"", clientBasePrice: 8500, orientation: "square", scaleCategory: "medium", tag: "Square Classic" },
  { id: "size-10x20", title: "10×20 Compact Celebration Square", openSpread: "10\" × 20\"", clientBasePrice: 7200, orientation: "square", scaleCategory: "small", tag: "Square Compact" },
  { id: "size-12x18-vert", title: "12×18 Royal Vertical Portrait", openSpread: "18\" × 24\" (18\"H)", clientBasePrice: 9800, orientation: "vertical", scaleCategory: "big", popular: true, tag: "Vertical Portrait" },
  { id: "size-10x15-vert", title: "10×15 Editorial Vertical Portrait", openSpread: "15\" × 20\" (15\"H)", clientBasePrice: 7600, orientation: "vertical", scaleCategory: "medium", tag: "Vertical Editorial" },
  { id: "size-8x12-vert", title: "8×12 Traditional Vertical", openSpread: "12\" × 16\" (12\"H)", clientBasePrice: 5800, orientation: "vertical", scaleCategory: "small", tag: "Vertical Compact" },
  { id: "size-6x9-pocket", title: "6×9 Companion Pocket Parent Book", openSpread: "6\" × 18\"", clientBasePrice: 3200, orientation: "pocket", scaleCategory: "small", tag: "Parent Mini Book" }
];

const FALLBACK_SHEETS = [
  { id: "metallic-gold", title: "24K Metallic Gold Gloss", telugu: "24K మెటాలిక్ గోల్డ్", gsm: "350 GSM Archival", clientPricePerSheet: 110, color: "#E6C667", bestFor: "Muhurtham & 22K Gold Jewelry", ritualSection: "Muhurtham & Talambralu Spreads" },
  { id: "royal-velvet", title: "Royal Velvet Feather Touch", telugu: "రాయల్ వెల్వెట్ టచ్", gsm: "400 GSM Rigid", clientPricePerSheet: 135, color: "#722F37", bestFor: "Zero Glare Candid Portraits", ritualSection: "Reception & Couple Portraits" },
  { id: "pure-silk", title: "Pure Silk Texture (Pattu)", telugu: "ప్యూర్ సిల్క్ (పట్టు)", gsm: "380 GSM Textured", clientPricePerSheet: 145, color: "#D4AF37", bestFor: "Traditional Saree Moments", ritualSection: "Kanyadaanam & Saptapadi" },
  { id: "non-tearable", title: "Non-Tearable Poly-Luster", telugu: "నాన్-టియరబుల్ పాలీ", gsm: "300 GSM Poly", clientPricePerSheet: 85, color: "#4A90E2", bestFor: "100% Waterproof Durability", ritualSection: "Extended Family & Group Spreads" },
  { id: "crystal-gloss", title: "HD Silver Halide Crystal", telugu: "సిల్వర్ హాలైడ్ క్రిస్టల్", gsm: "320 GSM Photographic", clientPricePerSheet: 120, color: "#E0E0E0", bestFor: "True Optical Continuous Tone", ritualSection: "Stage Fireworks & Close-ups" },
  { id: "matte-linen", title: "Natural Matte Fine Art Linen", telugu: "ఫైన్ ఆర్ట్ లినెన్", gsm: "350 GSM Cotton", clientPricePerSheet: 105, color: "#E8DFD8", bestFor: "European Understated Elegance", ritualSection: "Pre-Wedding Outdoor Shoots" }
];

const FALLBACK_COVERS = [
  { id: 'acrylic', label: 'Diamond Acrylic 3D Glass', sub: '+₹2,500', extra: 2500 },
  { id: 'leatherette', label: 'Italian Leatherette + Presentation Box', sub: '+₹2,800', extra: 2800 },
  { id: 'velvet-foil', label: 'Royal Velvet Hardcover + 24K Gold Foil', sub: '+₹2,200', extra: 2200 },
  { id: 'matte-hardcover', label: 'Anti-Scratch Scuff-Free Hardcover Matte', sub: 'Standard (Included)', extra: 0 }
];

const FALLBACK_VIDEOS = [
  { id: "video-feature", title: "4K Cinematic Wedding Feature Film (15-20 min)", price: 10000, turnaround: "5-7 Days" },
  { id: "video-traditional", title: "Traditional Long-Form Documentary (2-3 hrs)", price: 12000, turnaround: "7-10 Days" },
  { id: "video-teaser", title: "3-5 Min 4K Cinematic Teaser Trailer", price: 6000, turnaround: "48-72 Hrs" },
  { id: "video-sde", title: "Same-Day Edit (SDE) Reception Screening", price: 12000, turnaround: "Same Evening" },
  { id: "video-reels", title: "Viral Instagram Reels & Shorts Pack (5 Reels)", price: 3500, turnaround: "48 Hrs" },
  { id: "video-audio", title: "Audio Mixing, Noise Cleanup & Devotional Score", price: 3000, turnaround: "24-48 Hrs" }
];

const FALLBACK_FLEX = [
  { id: "flex-whatsapp", title: "60s 4K WhatsApp Animated Video Invitation", price: 1800 },
  { id: "flex-patrika", title: "Traditional Gold Foil Wedding Patrika (100 Cards)", price: 4500 },
  { id: "flex-mandap", title: "Grand Mandap & Entrance Flex Banner (10×8 ft)", price: 1800 },
  { id: "flex-hoarding", title: "Highway & Roadside Wedding Hoarding (40×20 ft)", price: 4200 },
  { id: "flex-standee", title: "Welcome Roll-Up Standee with Aluminum Stand (6×2.5 ft)", price: 1400 }
];

export default function InstantEstimator({
  eyebrow = '✦ ANDHRA PRADESH #1 POST-PRODUCTION HUB ✦',
  title = 'Instant Album & Video Cost Estimator',
  subtitle = 'Customize your dimensions, multi-sheet material mix, cover finishes, and cinema video options for real-time pricing and guaranteed SLA schedules.',
  ctaText = 'Lock In Estimate & Start Order',
  ctaLink = '/order'
}) {
  const { content } = useContent();

  const catalog = content?.global?.servicesCatalog || content?.servicesCatalog;
  
  const albumSizes = useMemo(() => {
    return catalog?.albumPrinting?.albumSizes?.length ? catalog.albumPrinting.albumSizes : FALLBACK_SIZES;
  }, [catalog]);

  const sheetStyles = useMemo(() => {
    return catalog?.albumPrinting?.sheetStyles?.length ? catalog.albumPrinting.sheetStyles : FALLBACK_SHEETS;
  }, [catalog]);

  const videoServices = useMemo(() => {
    return catalog?.videoEditing?.length 
      ? catalog.videoEditing.map(v => ({ id: v.id, title: v.title, price: v.clientPrice || 6000, turnaround: v.turnaround || '3-5 Days' }))
      : FALLBACK_VIDEOS;
  }, [catalog]);

  const flexItems = useMemo(() => {
    return catalog?.invitationsAndFlex?.length
      ? catalog.invitationsAndFlex.map(f => ({ id: f.id, title: f.title, price: f.clientPrice || 1800 }))
      : FALLBACK_FLEX;
  }, [catalog]);

  // Orientation filter state for album sizes
  const [sizeFilter, setSizeFilter] = useState('all'); // 'all' | 'landscape' | 'vertical' | 'square' | 'pocket'

  // Estimator Selection States
  const [selectedSizeId, setSelectedSizeId] = useState('size-12x36');
  
  // Sheet Selection Mode: 'single' | 'multi'
  const [sheetMode, setSheetMode] = useState('multi'); // default to Indian market multi-sheet standard
  const [singleSheetId, setSingleSheetId] = useState('metallic-gold');
  
  // Multi-sheet selection map: sheetId -> count
  const [multiSheetAllocations, setMultiSheetAllocations] = useState({
    'metallic-gold': 12, // Muhurtham & Talambralu
    'royal-velvet': 12,  // Reception & Candid Portraits
    'pure-silk': 6       // Sacred Pattu & Saptapadi
  });

  const [totalSheetsCount, setTotalSheetsCount] = useState(30); // 30 sheets = 60 pages
  const [selectedCoverId, setSelectedCoverId] = useState('acrylic');
  const [selectedVideoIds, setSelectedVideoIds] = useState([]);
  const [selectedFlexIds, setSelectedFlexIds] = useState([]);
  const [isExpressDelivery, setIsExpressDelivery] = useState(false);

  // Active category tab in estimator controls
  const [activeTab, setActiveTab] = useState('album'); // 'album' | 'video' | 'flex'

  // Filtered album sizes based on orientation filter
  const filteredSizes = useMemo(() => {
    if (sizeFilter === 'all') return albumSizes;
    return albumSizes.filter(s => s.orientation === sizeFilter);
  }, [albumSizes, sizeFilter]);

  // Selected Objects
  const selectedSize = albumSizes.find(s => s.id === selectedSizeId) || albumSizes[1] || FALLBACK_SIZES[1];
  const selectedCover = FALLBACK_COVERS.find(c => c.id === selectedCoverId) || FALLBACK_COVERS[0];

  // Toggle helper for multi-sheet selection
  const toggleMultiSheet = (sheetId) => {
    setMultiSheetAllocations(prev => {
      const next = { ...prev };
      if (next[sheetId]) {
        // Only delete if there is at least 1 other sheet selected
        if (Object.keys(next).length > 1) {
          delete next[sheetId];
        }
      } else {
        // Add with default 8 sheets
        next[sheetId] = 8;
      }
      return next;
    });
  };

  const updateSheetAllocation = (sheetId, count) => {
    const val = Math.max(2, Math.min(60, Number(count) || 2));
    setMultiSheetAllocations(prev => ({
      ...prev,
      [sheetId]: val
    }));
  };

  // Indian Wedding Preset Combos
  const applyPresetCombo = (presetKey) => {
    setSheetMode('multi');
    if (presetKey === 'royal-ap') {
      setMultiSheetAllocations({
        'metallic-gold': 14,
        'royal-velvet': 12,
        'pure-silk': 6
      });
      setTotalSheetsCount(32);
    } else if (presetKey === 'heirloom-archival') {
      setMultiSheetAllocations({
        'royal-velvet': 18,
        'non-tearable': 12
      });
      setTotalSheetsCount(30);
    } else if (presetKey === 'fashion-fineart') {
      setMultiSheetAllocations({
        'crystal-gloss': 15,
        'matte-linen': 15
      });
      setTotalSheetsCount(30);
    }
  };

  // Toggle helpers for video & flex
  const toggleVideo = (id) => {
    setSelectedVideoIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleFlex = (id) => {
    setSelectedFlexIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Calculation logic supporting Multi-Sheet Hybrid combinations
  const calculation = useMemo(() => {
    const baseAlbumPrice = selectedSize.clientBasePrice || 12500;
    const coverExtra = selectedCover.extra || 0;

    let computedSheetsCount = totalSheetsCount;
    let sheetCostBreakdown = [];
    let extraSheetsCost = 0;

    if (sheetMode === 'multi') {
      const selectedKeys = Object.keys(multiSheetAllocations);
      computedSheetsCount = selectedKeys.reduce((sum, k) => sum + (multiSheetAllocations[k] || 0), 0);

      // In Indian album pricing, baseline 30 sheets is covered by baseAlbumPrice.
      // Weighted per-sheet cost calculation for multi-sheet mixes:
      sheetCostBreakdown = selectedKeys.map(k => {
        const sheetObj = sheetStyles.find(s => s.id === k) || FALLBACK_SHEETS[0];
        const count = multiSheetAllocations[k] || 0;
        const rate = sheetObj.clientPricePerSheet || 110;
        return {
          id: k,
          title: sheetObj.title,
          count,
          rate,
          total: count * rate,
          ritualSection: sheetObj.ritualSection || sheetObj.bestFor
        };
      });

      // Extra sheets above base 30 calculated proportionally
      const extraSheets = Math.max(0, computedSheetsCount - 30);
      const avgRate = sheetCostBreakdown.reduce((sum, item) => sum + item.rate, 0) / (sheetCostBreakdown.length || 1);
      extraSheetsCost = Math.round(extraSheets * avgRate);
    } else {
      const singleObj = sheetStyles.find(s => s.id === singleSheetId) || sheetStyles[0] || FALLBACK_SHEETS[0];
      const rate = singleObj.clientPricePerSheet || 110;
      const extraSheets = Math.max(0, totalSheetsCount - 30);
      extraSheetsCost = extraSheets * rate;
      sheetCostBreakdown = [{
        id: singleObj.id,
        title: singleObj.title,
        count: totalSheetsCount,
        rate,
        total: totalSheetsCount * rate,
        ritualSection: "100% of Album Pages"
      }];
    }

    // Video Services total
    const videoCost = selectedVideoIds.reduce((sum, id) => {
      const match = videoServices.find(v => v.id === id);
      return sum + (match ? match.price : 0);
    }, 0);

    // Flex items total
    const flexCost = selectedFlexIds.reduce((sum, id) => {
      const match = flexItems.find(f => f.id === id);
      return sum + (match ? match.price : 0);
    }, 0);

    // Express priority fee
    const expressCost = isExpressDelivery ? 1999 : 0;

    const total = baseAlbumPrice + coverExtra + extraSheetsCost + videoCost + flexCost + expressCost;

    let turnaroundText = '5-7 Business Days (Standard Air/Ground Courier)';
    if (isExpressDelivery) {
      turnaroundText = '48-72 Hours Express SLA (Priority Courier Dispatch)';
    } else if (selectedVideoIds.includes('video-sde')) {
      turnaroundText = 'Same Evening for SDE + 5 Days for Master Album';
    }

    return {
      total,
      baseAlbumPrice,
      coverExtra,
      computedSheetsCount,
      extraSheetsCost,
      sheetCostBreakdown,
      videoCost,
      flexCost,
      expressCost,
      turnaround: turnaroundText,
      photoCapacity: computedSheetsCount * 5
    };
  }, [selectedSize, sheetMode, singleSheetId, multiSheetAllocations, totalSheetsCount, selectedCover, selectedVideoIds, selectedFlexIds, isExpressDelivery, sheetStyles, videoServices, flexItems]);

  // Construct WhatsApp enquiry message with full customized quote
  const whatsappQuoteText = useMemo(() => {
    const sheetDetails = calculation.sheetCostBreakdown.map(
      s => `• ${s.title}: ${s.count} షీట్లు (${s.ritualSection})`
    ).join('\n');

    const lines = [
      `నమస్కారం! నేను WeddingAlbums.in ద్వారా ఈ కొటేషన్ తయారు చేసుకున్నాను:`,
      `📖 ఆల్బమ్ సైజు: ${selectedSize.title} (${selectedSize.openSpread})`,
      `✨ షీట్ మెటీరియల్స్:\n${sheetDetails}`,
      `📄 మొత్తం షీట్లు: ${calculation.computedSheetsCount} షీట్లు (${calculation.computedSheetsCount * 2} పేజీలు)`,
      `💎 కవర్ ఫినిష్: ${selectedCover.label}`,
      selectedVideoIds.length ? `🎥 వీడియో సర్వీసెస్: ${selectedVideoIds.length} ఎంపిక చేయబడ్డాయి` : null,
      selectedFlexIds.length ? `💌 ఫ్లెక్స్ & ఇన్విటేషన్స్: ${selectedFlexIds.length} ఎంపిక చేయబడ్డాయి` : null,
      `💰 మొత్తం కొటేషన్: ₹${calculation.total.toLocaleString('en-IN')}`,
      `⏱️ డెలివరీ: ${calculation.turnaround}`
    ].filter(Boolean);
    return lines.join('\n');
  }, [selectedSize, calculation, selectedCover, selectedVideoIds, selectedFlexIds]);

  return (
    <section className="est-section" id="estimator">
      <div className="container">
        {/* Section Header */}
        <div className="text-center est-header">
          <ScrollReveal>
            <div className="est-eyebrow">{eyebrow}</div>
            <h2 className="est-title font-serif text-gradient">{title}</h2>
            <p className="est-subtitle">{subtitle}</p>
          </ScrollReveal>
        </div>

        {/* 2-Column Calculator Card */}
        <ScrollReveal delay={100}>
          <div className="est-card">
            {/* Left Column: Interactive Tabbed Controls */}
            <div className="est-controls">
              {/* Pillar Selector Tabs */}
              <div className="est-nav-tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab('album')}
                  className={`est-tab-btn ${activeTab === 'album' ? 'active' : ''}`}
                >
                  <BookOpen size={16} />
                  <span>1. Heirloom Album & Sheets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('video')}
                  className={`est-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                >
                  <Video size={16} />
                  <span>2. Cinematic Video ({selectedVideoIds.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('flex')}
                  className={`est-tab-btn ${activeTab === 'flex' ? 'active' : ''}`}
                >
                  <Layers size={16} />
                  <span>3. Flex & Invites ({selectedFlexIds.length})</span>
                </button>
              </div>

              {/* TAB 1: ALBUM CONFIGURATOR */}
              {activeTab === 'album' && (
                <div className="est-tab-pane">
                  {/* Orientation Filter */}
                  <div className="est-control-group">
                    <div className="est-control-label">
                      <span>Choose Album Format & Spread Orientation</span>
                      <span className="est-label-highlight">{selectedSize.tag || 'Indian Market Standard'}</span>
                    </div>
                    <div className="est-orientation-filters">
                      {[
                        { id: 'all', label: 'All Dimensions (10)' },
                        { id: 'landscape', label: '🌅 Landscape / Panoramic (4)' },
                        { id: 'vertical', label: '📱 Vertical / Portrait (3)' },
                        { id: 'square', label: '📐 Square Formats (2)' },
                        { id: 'pocket', label: '🎁 Parent Pocket (1)' }
                      ].map(f => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setSizeFilter(f.id)}
                          className={`est-filter-pill ${sizeFilter === f.id ? 'active' : ''}`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    {/* Album Size Grid */}
                    <div className="est-size-grid">
                      {filteredSizes.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          className={`est-size-card ${selectedSizeId === s.id ? 'active' : ''}`}
                          onClick={() => setSelectedSizeId(s.id)}
                        >
                          <div className="est-size-badge-strip">
                            <span className="est-size-ratio">{s.openSpread}</span>
                            {s.popular && <span className="est-popular-tag">Telugu Favorite</span>}
                          </div>
                          <div className="est-size-title">{s.title}</div>
                          <div className="est-size-price">Base: ₹{s.clientBasePrice?.toLocaleString('en-IN')}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Sheet Selection Mode Switcher */}
                  <div className="est-control-group">
                    <div className="est-control-label">
                      <span>Luxury Sheet Style & Material Selection</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSheetMode('multi')}
                          className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                            sheetMode === 'multi' 
                              ? 'bg-[#D4AF37] text-black shadow' 
                              : 'bg-white/5 text-gray-400 hover:text-white'
                          }`}
                        >
                          ✨ Multi-Sheet Hybrid Mix (Indian Standard)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSheetMode('single')}
                          className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                            sheetMode === 'single' 
                              ? 'bg-[#D4AF37] text-black shadow' 
                              : 'bg-white/5 text-gray-400 hover:text-white'
                          }`}
                        >
                          Single Sheet
                        </button>
                      </div>
                    </div>

                    {/* MULTI-SHEET HYBRID SELECTION (Indian Wedding Market Tradition) */}
                    {sheetMode === 'multi' ? (
                      <div className="multi-sheet-container">
                        <div className="multi-sheet-explanation">
                          💡 <strong>How it works in Indian Weddings:</strong> A luxury 30-page album divides rituals across specialized sheets: 
                          <em>24K Gold for Muhurtham</em>, <em>Velvet for Reception</em>, and <em>Silk Pattu for Sacred Saree rituals</em>.
                        </div>

                        {/* Quick Presets */}
                        <div className="multi-sheet-presets-strip">
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Popular AP Combos:</span>
                          <button
                            type="button"
                            onClick={() => applyPresetCombo('royal-ap')}
                            className="preset-btn"
                          >
                            👑 AP Royal Trio (Gold + Velvet + Pattu)
                          </button>
                          <button
                            type="button"
                            onClick={() => applyPresetCombo('heirloom-archival')}
                            className="preset-btn"
                          >
                            🛡️ Velvet + Poly-Luster (Anti-Tear)
                          </button>
                          <button
                            type="button"
                            onClick={() => applyPresetCombo('fashion-fineart')}
                            className="preset-btn"
                          >
                            🎨 Crystal + Linen (Fashion)
                          </button>
                        </div>

                        {/* Sheet Selection Cards with Checkboxes & Sheet Count Controls */}
                        <div className="est-sheet-grid">
                          {sheetStyles.map(sheet => {
                            const isSelected = Boolean(multiSheetAllocations[sheet.id]);
                            const count = multiSheetAllocations[sheet.id] || 0;

                            return (
                              <div
                                key={sheet.id}
                                className={`est-sheet-pill multi-mode ${isSelected ? 'active' : ''}`}
                                onClick={() => toggleMultiSheet(sheet.id)}
                              >
                                <div className="flex items-center gap-2.5 w-full">
                                  <div className="sheet-checkbox-wrap text-[#D4AF37]">
                                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} className="text-gray-500" />}
                                  </div>
                                  <div className="sheet-swatch-indicator" style={{ backgroundColor: sheet.color }} />
                                  <div className="flex-1">
                                    <div className="sheet-swatch-name">{sheet.title}</div>
                                    <div className="sheet-swatch-meta">
                                      <span>{sheet.gsm.split(' ')[0]} GSM</span>
                                      <span>•</span>
                                      <span className="text-[#D4AF37]">₹{sheet.clientPricePerSheet}/sheet</span>
                                    </div>
                                    <div className="text-[11px] text-gray-400 mt-0.5">
                                      {sheet.ritualSection || sheet.bestFor}
                                    </div>
                                  </div>
                                </div>

                                {/* Sheet Counter when selected */}
                                {isSelected && (
                                  <div className="sheet-count-adjuster" onClick={e => e.stopPropagation()}>
                                    <label className="text-[11px] text-gray-300 font-semibold">Sheets for this ritual:</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <input
                                        type="number"
                                        min="2"
                                        max="50"
                                        step="2"
                                        value={count}
                                        onChange={e => updateSheetAllocation(sheet.id, e.target.value)}
                                        className="sheet-count-input"
                                      />
                                      <span className="text-xs text-gray-400 font-mono">
                                        sheets ({count * 2} pgs) = ₹{(count * sheet.clientPricePerSheet).toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      /* SINGLE SHEET SELECTION */
                      <div className="est-sheet-grid">
                        {sheetStyles.map(sheet => (
                          <button
                            key={sheet.id}
                            type="button"
                            className={`est-sheet-pill ${singleSheetId === sheet.id ? 'active' : ''}`}
                            onClick={() => setSingleSheetId(sheet.id)}
                            style={{ '--sheet-color': sheet.color }}
                          >
                            <div className="sheet-swatch-indicator" style={{ backgroundColor: sheet.color }} />
                            <div className="sheet-swatch-info">
                              <div className="sheet-swatch-name">{sheet.title}</div>
                              <div className="sheet-swatch-meta">
                                <span>{sheet.gsm.split(' ')[0]} GSM</span>
                                <span>•</span>
                                <span className="text-[#D4AF37]">₹{sheet.clientPricePerSheet}/sheet</span>
                              </div>
                              <div className="text-[11px] text-gray-400 mt-0.5">{sheet.bestFor}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sheets Slider (for Single Mode or Global scaling) */}
                  {sheetMode === 'single' && (
                    <div className="est-control-group">
                      <div className="est-control-label">
                        <span>Album Sheets Count (Pages = Sheets × 2)</span>
                        <span className="est-label-highlight">
                          {totalSheetsCount} Sheets ({totalSheetsCount * 2} Pages · ~{calculation.photoCapacity} Photos)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="70"
                        step="5"
                        value={totalSheetsCount}
                        onChange={e => setTotalSheetsCount(Number(e.target.value))}
                        className="est-range-input"
                      />
                      <div className="est-range-ticks">
                        <span>20 Sheets (40 Pgs)</span>
                        <span>30 Sheets (Base 60 Pgs)</span>
                        <span>50 Sheets (100 Pgs)</span>
                        <span>70 Sheets (140 Pgs)</span>
                      </div>
                    </div>
                  )}

                  {/* Master Cover Finish */}
                  <div className="est-control-group">
                    <div className="est-control-label">
                      <span>Master Cover Finish</span>
                      <span className="est-label-highlight">{selectedCover.label}</span>
                    </div>
                    <div className="est-choices">
                      {FALLBACK_COVERS.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          className={`est-choice-btn ${selectedCoverId === c.id ? 'active' : ''}`}
                          onClick={() => setSelectedCoverId(c.id)}
                        >
                          <span>{c.label}</span>
                          <span className="est-choice-sub">{c.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CINEMATIC VIDEO ESTIMATOR */}
              {activeTab === 'video' && (
                <div className="est-tab-pane">
                  <div className="est-control-group">
                    <div className="est-control-label">
                      <span>Select 4K Cinema Video Post-Production Services</span>
                      <span className="est-label-highlight">Selected ({selectedVideoIds.length})</span>
                    </div>
                    <div className="est-addons">
                      {videoServices.map(v => {
                        const isChecked = selectedVideoIds.includes(v.id);
                        return (
                          <div
                            key={v.id}
                            className={`est-addon-item ${isChecked ? 'selected' : ''}`}
                            onClick={() => toggleVideo(v.id)}
                          >
                            <div className="est-addon-label">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="est-checkbox"
                              />
                              <div>
                                <div className="font-semibold text-sm text-white">{v.title}</div>
                                <div className="text-xs text-gray-400">Turnaround: {v.turnaround}</div>
                              </div>
                            </div>
                            <span className="est-addon-price">+₹{v.price.toLocaleString('en-IN')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INVITATIONS & FLEX */}
              {activeTab === 'flex' && (
                <div className="est-tab-pane">
                  <div className="est-control-group">
                    <div className="est-control-label">
                      <span>Telugu Wedding Invitations & Event Flex Signage</span>
                      <span className="est-label-highlight">Selected ({selectedFlexIds.length})</span>
                    </div>
                    <div className="est-addons">
                      {flexItems.map(f => {
                        const isChecked = selectedFlexIds.includes(f.id);
                        return (
                          <div
                            key={f.id}
                            className={`est-addon-item ${isChecked ? 'selected' : ''}`}
                            onClick={() => toggleFlex(f.id)}
                          >
                            <div className="est-addon-label">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="est-checkbox"
                              />
                              <div>
                                <div className="font-semibold text-sm text-white">{f.title}</div>
                              </div>
                            </div>
                            <span className="est-addon-price">+₹{f.price.toLocaleString('en-IN')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Express Rush Option */}
              <div className="est-express-toggle-box">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isExpressDelivery}
                    onChange={e => setIsExpressDelivery(e.target.checked)}
                    className="est-checkbox"
                  />
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      <Truck size={15} className="text-[#D4AF37]" />
                      <span>Priority Express Delivery (48 Hours SLA)</span>
                      <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-mono">+₹1,999</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Express rush production pipeline for tight Muhurtham schedules.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Right Column: Live Price, Itemized Breakdown & WhatsApp CTA */}
            <div className="est-output">
              <div>
                <div className="est-output-badge">
                  <Sparkles size={14} />
                  <span>Real-time Studio Investment Quote</span>
                </div>

                {/* Price Display */}
                <div className="est-price-box">
                  <div className="est-price-caption">Total Estimated Investment</div>
                  <div className="est-price-val">₹{calculation.total.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-400">
                    Includes {calculation.computedSheetsCount} Sheets ({calculation.computedSheetsCount * 2} Pages) · Free Soft-Proofing
                  </div>
                </div>

                {/* Itemized Live Breakdown */}
                <div className="est-receipt-card">
                  <div className="receipt-row">
                    <span className="text-gray-300">{selectedSize.title.split('(')[0]}</span>
                    <span className="font-mono text-white">₹{calculation.baseAlbumPrice.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Multi-Sheet Detailed Receipt Breakdown */}
                  <div className="my-1.5 py-1.5 border-t border-b border-white/5 flex flex-col gap-1">
                    <span className="text-[10.5px] font-bold text-[#D4AF37] uppercase tracking-wider">Selected Sheets Mix:</span>
                    {calculation.sheetCostBreakdown.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11.5px] text-gray-300">
                        <span>• {s.count} sh {s.title.split(' ')[0]} ({s.ritualSection})</span>
                        <span className="font-mono text-white">₹{s.total.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {calculation.coverExtra > 0 && (
                    <div className="receipt-row">
                      <span className="text-gray-300">{selectedCover.label}</span>
                      <span className="font-mono text-white">+₹{calculation.coverExtra.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {calculation.videoCost > 0 && (
                    <div className="receipt-row">
                      <span className="text-gray-300">Video Services ({selectedVideoIds.length})</span>
                      <span className="font-mono text-white">+₹{calculation.videoCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {calculation.flexCost > 0 && (
                    <div className="receipt-row">
                      <span className="text-gray-300">Flex & Invites ({selectedFlexIds.length})</span>
                      <span className="font-mono text-white">+₹{calculation.flexCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {calculation.expressCost > 0 && (
                    <div className="receipt-row">
                      <span className="text-[#D4AF37]">Express 48h SLA</span>
                      <span className="font-mono text-[#D4AF37]">+₹{calculation.expressCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Turnaround Box */}
                <div className="est-turnaround-box">
                  <Clock size={20} className="est-turnaround-icon text-[#D4AF37]" />
                  <div>
                    <div className="est-turnaround-title">Estimated Turnaround Schedule</div>
                    <div className="est-turnaround-days">{calculation.turnaround}</div>
                  </div>
                </div>

                {/* Perks Checklist */}
                <ul className="est-perks-list">
                  <li className="est-perk-item">
                    <CheckCircle2 size={15} className="est-perk-check" />
                    <span>Free 3D Digital Flipbook Preview before printing</span>
                  </li>
                  <li className="est-perk-item">
                    <CheckCircle2 size={15} className="est-perk-check" />
                    <span>Free Doorstep Insured Express Courier across AP & TS</span>
                  </li>
                  <li className="est-perk-item">
                    <CheckCircle2 size={15} className="est-perk-check" />
                    <span>Unlimited soft-proof revisions on spread layouts</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="est-action-buttons">
                <Link 
                  to={`${ctaLink}?size=${selectedSize.id}&sheets=${calculation.computedSheetsCount}&cover=${selectedCover.id}&price=${calculation.total}`} 
                  className="btn btn-gold-3d est-cta-btn"
                >
                  {ctaText} <ArrowRight size={16} />
                </Link>

                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(whatsappQuoteText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline est-whatsapp-quote-btn"
                >
                  <MessageCircle size={16} />
                  <span>Send Estimate to WhatsApp</span>
                </a>

                <div className="text-center mt-2 text-xs text-gray-500">
                  No payment required to submit files and request a soft proof
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
