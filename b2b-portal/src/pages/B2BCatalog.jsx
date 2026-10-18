import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Sparkles, Video, Flag, ArrowRight, CheckCircle2, 
  Layers, Clock, ShieldCheck, IndianRupee, Printer, Scissors, Eye
} from 'lucide-react';
import { API } from '../apiConfig';

const ALBUM_SIZES = [
  // LANDSCAPE SIZES
  {
    id: 'size-14x40',
    title: '14×40 Grand Imperial Panoramic',
    dimensions: '14×40 inches (35.5×101.6 cm)',
    orientation: 'landscape',
    wholesalePerSheet: 220,
    retailPerSheet: 320,
    defaultSheets: 30,
    coverChargeStudio: 1400,
    coverChargeRetail: 2200,
    turnaround: '3-4 Working Days',
    badge: 'Elite Luxury',
    tag: 'Ultra-wide royal mandap & grand banquet spreads',
    popular: false
  },
  {
    id: 'size-12x36',
    title: '12×36 Royal Spread (Panoramic)',
    dimensions: '12×36 inches (30.5×91.4 cm)',
    orientation: 'landscape',
    wholesalePerSheet: 180,
    retailPerSheet: 260,
    defaultSheets: 30,
    coverChargeStudio: 1100,
    coverChargeRetail: 1700,
    turnaround: '2-3 Working Days',
    badge: "India's #1 Bestseller ⭐",
    tag: 'Telugu wedding industry benchmark size',
    popular: true
  },
  {
    id: 'size-12x30',
    title: '12×30 Classic Landscape',
    dimensions: '12×30 inches (30.5×76.2 cm)',
    orientation: 'landscape',
    wholesalePerSheet: 160,
    retailPerSheet: 230,
    defaultSheets: 30,
    coverChargeStudio: 1000,
    coverChargeRetail: 1600,
    turnaround: '2-3 Working Days',
    badge: 'Popular',
    tag: 'Standard widescreen lay-flat format',
    popular: true
  },
  {
    id: 'size-10x30',
    title: '10×30 Slim Panoramic',
    dimensions: '10×30 inches (25.4×76.2 cm)',
    orientation: 'landscape',
    wholesalePerSheet: 145,
    retailPerSheet: 210,
    defaultSheets: 30,
    coverChargeStudio: 900,
    coverChargeRetail: 1400,
    turnaround: '2-3 Working Days',
    badge: null,
    tag: 'Modern cinematic format with sleek profile',
    popular: false
  },
  {
    id: 'size-15x30',
    title: '15×30 Grand Square Spread',
    dimensions: '15×30 inches (38.1×76.2 cm)',
    orientation: 'landscape',
    wholesalePerSheet: 195,
    retailPerSheet: 280,
    defaultSheets: 30,
    coverChargeStudio: 1250,
    coverChargeRetail: 1900,
    turnaround: '3-4 Working Days',
    badge: 'Grand',
    tag: 'Maximum height & panoramic width combined',
    popular: false
  },
  {
    id: 'size-12x24',
    title: '12×24 Compact Landscape',
    dimensions: '12×24 inches (30.5×61.0 cm)',
    orientation: 'landscape',
    wholesalePerSheet: 130,
    retailPerSheet: 185,
    defaultSheets: 30,
    coverChargeStudio: 850,
    coverChargeRetail: 1350,
    turnaround: '2-3 Working Days',
    badge: 'Budget Value',
    tag: 'Ideal for engagement & sangeet functions',
    popular: false
  },
  {
    id: 'size-10x24',
    title: '10×24 Compact Feast Landscape',
    dimensions: '10×24 inches (25.4×61.0 cm)',
    orientation: 'landscape',
    wholesalePerSheet: 115,
    retailPerSheet: 165,
    defaultSheets: 30,
    coverChargeStudio: 750,
    coverChargeRetail: 1200,
    turnaround: '2-3 Working Days',
    badge: null,
    tag: 'Lightweight family celebrations & reception events',
    popular: false
  },
  {
    id: 'size-12x18',
    title: '12×18 Traditional Landscape',
    dimensions: '12×18 inches (30.5×45.7 cm)',
    orientation: 'landscape',
    wholesalePerSheet: 95,
    retailPerSheet: 140,
    defaultSheets: 30,
    coverChargeStudio: 650,
    coverChargeRetail: 1050,
    turnaround: '2-3 Working Days',
    badge: null,
    tag: 'Timeless traditional horizontal format',
    popular: false
  },
  {
    id: 'size-6x9',
    title: '6×9 Companion Pocket Parent Book',
    dimensions: '6×9 inches (15.2×22.8 cm)',
    orientation: 'landscape',
    wholesalePerSheet: 45,
    retailPerSheet: 70,
    defaultSheets: 30,
    coverChargeStudio: 400,
    coverChargeRetail: 650,
    turnaround: '2-3 Working Days',
    badge: 'Add-On Special',
    tag: 'Mini duplicate keepsake for parents & in-laws',
    popular: false
  },

  // PORTRAIT SIZES
  {
    id: 'size-18x12',
    title: '18×12 Grand Vertical Portrait',
    dimensions: '18×12 inches (45.7×30.5 cm)',
    orientation: 'portrait',
    wholesalePerSheet: 170,
    retailPerSheet: 245,
    defaultSheets: 30,
    coverChargeStudio: 1050,
    coverChargeRetail: 1650,
    turnaround: '2-3 Working Days',
    badge: 'Portrait Top Choice ⭐',
    tag: 'Royal fashion magazine look for full bridal portraits',
    popular: true
  },
  {
    id: 'size-15x12',
    title: '15×12 Classic Vertical Portrait',
    dimensions: '15×12 inches (38.1×30.5 cm)',
    orientation: 'portrait',
    wholesalePerSheet: 150,
    retailPerSheet: 215,
    defaultSheets: 30,
    coverChargeStudio: 950,
    coverChargeRetail: 1500,
    turnaround: '2-3 Working Days',
    badge: null,
    tag: 'Traditional upright bridal framing for mandap poses',
    popular: false
  },
  {
    id: 'size-14x11',
    title: '14×11 Fine Art Vertical Portrait',
    dimensions: '14×11 inches (35.5×27.9 cm)',
    orientation: 'portrait',
    wholesalePerSheet: 135,
    retailPerSheet: 195,
    defaultSheets: 30,
    coverChargeStudio: 850,
    coverChargeRetail: 1350,
    turnaround: '2-3 Working Days',
    badge: null,
    tag: 'Editorial portrait format for contemporary photography',
    popular: false
  },
  {
    id: 'size-12x9',
    title: '12×9 Compact Vertical Portrait',
    dimensions: '12×9 inches (30.5×22.8 cm)',
    orientation: 'portrait',
    wholesalePerSheet: 105,
    retailPerSheet: 150,
    defaultSheets: 30,
    coverChargeStudio: 700,
    coverChargeRetail: 1100,
    turnaround: '2-3 Working Days',
    badge: null,
    tag: 'Convenient vertical album for Haldi & Mehendi shoots',
    popular: false
  },
  {
    id: 'size-10x8',
    title: '10×8 Family Gift Portrait',
    dimensions: '10×8 inches (25.4×20.3 cm)',
    orientation: 'portrait',
    wholesalePerSheet: 85,
    retailPerSheet: 125,
    defaultSheets: 30,
    coverChargeStudio: 600,
    coverChargeRetail: 950,
    turnaround: '2-3 Working Days',
    badge: null,
    tag: 'Compact portrait book for family and close guests',
    popular: false
  },
  {
    id: 'size-8x12',
    title: '8×12 Traditional Vertical',
    dimensions: '8×12 inches (20.3×30.5 cm)',
    orientation: 'portrait',
    wholesalePerSheet: 75,
    retailPerSheet: 110,
    defaultSheets: 30,
    coverChargeStudio: 550,
    coverChargeRetail: 850,
    turnaround: '2-3 Working Days',
    badge: null,
    tag: 'Standard studio vertical album',
    popular: false
  }
];

const SHEET_TYPES = [
  {
    id: 'sheet-ntr-matte',
    title: 'NTR Feather Touch Matte',
    telugu: 'NTR నాన్-టియరబుల్ మ్యాట్ (వాటర్‌ప్రూఫ్)',
    wholesalePerSheet: 0, // included in base
    retailPerSheet: 0,
    gsm: '250 Micron Non-Tearable Poly',
    tag: '100% Waterproof, Zero Fingerprint Gloss, 25-Year Archival Life',
    color: '#3b82f6',
    isBase: true
  },
  {
    id: 'sheet-metallic-pearl',
    title: '24K Metallic Pearl Shimmer',
    telugu: 'మెటాలిక్ పెర్ల్ లగ్జరీ షీట్',
    wholesalePerSheet: 30,
    retailPerSheet: 50,
    gsm: '310 GSM Pearl Luster Core',
    tag: 'Gleams under warm lighting. Perfect for bridal gold & Kanjeevaram silks',
    color: '#eab308',
    isBase: false
  },
  {
    id: 'sheet-royal-velvet',
    title: 'Royal Velvet Touch Ultra-Matte',
    telugu: 'రాయల్ వెల్వెట్ సాఫ్ట్ టచ్',
    wholesalePerSheet: 40,
    retailPerSheet: 65,
    gsm: '320 GSM Scuff-Resistant',
    tag: 'Zero-reflection cashmere matte. Premium deep blacks and skin tones',
    color: '#a855f7',
    isBase: false
  },
  {
    id: 'sheet-pure-silk',
    title: 'Pure Silk Pattu Weave Texture',
    telugu: 'పట్టు సిల్క్ వీవ్ టెక్స్‌చర్',
    wholesalePerSheet: 45,
    retailPerSheet: 75,
    gsm: '300 GSM Organic Texture',
    tag: 'Embossed silk weave feel honoring South Indian handloom heritage',
    color: '#ec4899',
    isBase: false
  },
  {
    id: 'sheet-silver-halide',
    title: 'Fuji Silver Halide True Photo',
    telugu: 'సిల్వర్ హాలైడ్ ట్రూ ఫోటో పేపర్',
    wholesalePerSheet: 55,
    retailPerSheet: 90,
    gsm: '280 GSM Continuous Tone',
    tag: 'Chemical lab exposure. Absolute true-to-life skin tones and 75-year longevity',
    color: '#06b6d4',
    isBase: false
  }
];

const VIDEO_SERVICES = [
  {
    id: 'video-reels-pack',
    title: '5-Pack Viral Instagram Reels (9:16 Vertical)',
    wholesalePrice: 2400,
    retailPrice: 3800,
    turnaround: '48 Hours Express',
    deliverables: '5 vertical 4K edits, trending audio sync, cinematic color grade, ready for viral IG sharing'
  },
  {
    id: 'video-teaser',
    title: '4K Cinematic Wedding Teaser (2-3 Minutes)',
    wholesalePrice: 3800,
    retailPrice: 6000,
    turnaround: '72 Hours',
    deliverables: 'Hollywood style pacing, voiceover vows, drone shots integrated, cinematic sound design'
  },
  {
    id: 'video-highlights',
    title: 'Cinematic Story Highlights Film (10-15 Minutes)',
    wholesalePrice: 5500,
    retailPrice: 8500,
    turnaround: '5 Working Days',
    deliverables: 'Multi-cam ritual synchronisation, emotional family speeches, professional color master'
  },
  {
    id: 'video-full-traditional',
    title: 'Full Traditional Documentary (2-3 Hours)',
    wholesalePrice: 7000,
    retailPrice: 11500,
    turnaround: '7 Working Days',
    deliverables: 'Complete ritual coverage, crystal clear audio mixing, chapter markers, digital delivery'
  },
  {
    id: 'video-same-day',
    title: 'Same-Day Reception Edit (SDE)',
    wholesalePrice: 4800,
    retailPrice: 7500,
    turnaround: 'Same Evening Delivery (6-8 Hours)',
    deliverables: 'Morning muhurtham edited & color graded on-site for grand evening reception screen projection'
  }
];

const FLEX_AND_INVITES = [
  {
    id: 'invite-video-60s',
    title: '60s 4K Animated WhatsApp Video Invitation',
    wholesalePrice: 950,
    retailPrice: 1800,
    turnaround: '24 Hours Express',
    deliverables: 'Couple caricatures/photos, auspicious muhurtham muhurth details, devotional Sannai Melam BGM'
  },
  {
    id: 'flex-welcome-standee',
    title: 'Roll-Up Welcome Standee (6×3 ft with Stand)',
    wholesalePrice: 750,
    retailPrice: 1400,
    turnaround: '24-48 Hours',
    deliverables: 'Star flex 340 GSM printing + aluminum pull-up stand mechanism, waterproof, venue entrance'
  },
  {
    id: 'flex-mandap-backdrop',
    title: 'Mandap Welcome Flex Banner (10×8 ft Star Media)',
    wholesalePrice: 1200,
    retailPrice: 2200,
    turnaround: '24-48 Hours',
    deliverables: 'Ultra HD digital print, reinforced eyelets, seamless installation ready'
  },
  {
    id: 'merch-desk-calendar',
    title: '12-Month Tabletop Desk Calendar (Couple Gift)',
    wholesalePrice: 450,
    retailPrice: 850,
    turnaround: '48 Hours',
    deliverables: 'Hardbound stand, 12 luxury photo sheets, gold wire-o binding'
  }
];

export default function B2BCatalog() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('albums'); // 'albums' | 'sheets' | 'video' | 'flex'
  const [orientationFilter, setOrientationFilter] = useState('all'); // 'all' | 'landscape' | 'portrait'

  const [albumSizes, setAlbumSizes] = useState(ALBUM_SIZES);
  const [sheetTypes, setSheetTypes] = useState(SHEET_TYPES);
  const [videoServices, setVideoServices] = useState(VIDEO_SERVICES);
  const [flexItems, setFlexItems] = useState(FLEX_AND_INVITES);

  useEffect(() => {
    let isMounted = true;
    async function loadDynamicCatalog() {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API}/api/content`, { headers });
        if (res.ok) {
          const data = await res.json();
          const cat = data?.catalog || data?.global?.catalog || data?.global?.servicesCatalog;
          if (cat && isMounted) {
            if (Array.isArray(cat.albumPrinting?.albumSizes) && cat.albumPrinting.albumSizes.length > 0) {
              setAlbumSizes(cat.albumPrinting.albumSizes.map(s => ({
                id: s.id,
                title: s.name || s.title,
                dimensions: s.dimensions || `${s.name}`,
                orientation: s.orientation || 'landscape',
                wholesalePerSheet: s.wholesalePerSheet ?? s.studioPricePerSheet ?? 180,
                retailPerSheet: s.clientPricePerSheet ?? 260,
                defaultSheets: s.defaultSheets || s.baseSheets || 30,
                coverChargeStudio: s.coverChargeStudio ?? 1100,
                coverChargeRetail: s.coverChargeRetail ?? 1700,
                turnaround: s.turnaround || '2-3 Working Days',
                badge: s.badge || null,
                tag: s.description || s.tag || '',
                popular: Boolean(s.popular)
              })));
            }
            if (Array.isArray(cat.albumPrinting?.sheetStyles) && cat.albumPrinting.sheetStyles.length > 0) {
              setSheetTypes(cat.albumPrinting.sheetStyles.map(sh => ({
                id: sh.id,
                title: sh.name || sh.title,
                telugu: sh.telugu || '',
                wholesalePerSheet: sh.wholesalePerSheet ?? sh.studioPricePerSheet ?? sh.extraPricePerSheet ?? 0,
                retailPerSheet: sh.clientPricePerSheet ?? sh.extraPricePerSheet ?? 0,
                gsm: sh.gsm || '300 GSM Archival Core',
                tag: sh.description || sh.bestFor || '',
                color: sh.color || '#3b82f6',
                isBase: (sh.wholesalePerSheet === 0 || sh.clientPricePerSheet === 0)
              })));
            }
            if (Array.isArray(cat.videoEditing) && cat.videoEditing.length > 0) {
              setVideoServices(cat.videoEditing.map(v => ({
                id: v.id,
                title: v.title,
                wholesalePrice: v.studioPrice || v.wholesalePrice || 3500,
                retailPrice: v.clientPrice || v.retailPrice || 5500,
                turnaround: v.turnaround || '3-5 Days',
                deliverables: v.deliverables || v.desc || ''
              })));
            }
            if (Array.isArray(cat.invitationsAndFlex) && cat.invitationsAndFlex.length > 0) {
              setFlexItems(cat.invitationsAndFlex.map(f => ({
                id: f.id,
                title: f.title,
                wholesalePrice: f.studioPrice || f.wholesalePrice || 850,
                retailPrice: f.clientPrice || f.retailPrice || 1500,
                turnaround: f.turnaround || '24-48 Hours',
                deliverables: f.deliverables || f.desc || ''
              })));
            }
          }
        }
      } catch (err) {
        console.warn('B2B dynamic catalog notice (using trade defaults):', err.message);
      }
    }
    loadDynamicCatalog();

    let sseSource;
    try {
      sseSource = new EventSource(`${API}/api/events`);
      sseSource.addEventListener('content:updated', () => {
        loadDynamicCatalog();
      });
    } catch { /* SSE unavailable */ }

    return () => { 
      isMounted = false; 
      if (sseSource) sseSource.close();
    };
  }, []);

  const filteredSizes = albumSizes.filter(s => {
    if (orientationFilter === 'all') return true;
    return s.orientation === orientationFilter;
  });

  return (
    <div className="page-content fade-in" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(20,20,24,0.95) 100%)',
        border: '1px solid rgba(212,175,55,0.3)',
        borderRadius: '20px',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600, marginBottom: '1rem' }}>
          <Sparkles size={14} /> Platinum Studio Trade Wholesale Rate Card
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', margin: '0 0 0.8rem 0', fontWeight: 800 }}>
          Direct Lab Wholesale Pricing for <span className="liquid-gold-text">Partner Studios</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
          Transparent <strong>Per-Sheet Lab Rates</strong> for all Indian wedding formats. We edit, design Karizma spreads, print on archival lay-flat sheets, and deliver directly to your couple anonymously under your brand name.
        </p>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '1.5rem' }}>
        {[
          { id: 'albums', label: '📖 Album Printing (Per-Sheet)', icon: BookOpen },
          { id: 'sheets', label: '✨ Luxury Sheet Substrates', icon: Layers },
          { id: 'video', label: '🎬 4K Video Post-Production', icon: Video },
          { id: 'flex', label: '💌 WhatsApp Invites & Flex', icon: Flag }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '12px',
              border: activeTab === tab.id ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
              background: activeTab === tab.id ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
              color: activeTab === tab.id ? 'var(--gold-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ALBUM SIZES & PER-SHEET PRICING */}
      {activeTab === 'albums' && (
        <div>
          {/* Orientation Filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '12px 18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Filter Orientation:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'all', label: `All Indian Formats (${albumSizes.length})` },
                  { id: 'landscape', label: `↔️ Landscape Panoramic (${albumSizes.filter(s => s.orientation === 'landscape').length})` },
                  { id: 'portrait', label: `↕️ Portrait Magazine (${albumSizes.filter(s => s.orientation === 'portrait').length})` }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setOrientationFilter(f.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: orientationFilter === f.id ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                      background: orientationFilter === f.id ? 'var(--gold-primary)' : 'transparent',
                      color: orientationFilter === f.id ? '#000' : 'var(--text-secondary)',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <ShieldCheck size={16} /> 100% Lay-Flat 180° Archival Core Binding
            </div>
          </div>

          {/* Album Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {filteredSizes.map(size => {
              const standardSheets = size.defaultSheets;
              const studioBaseTotal = (standardSheets * size.wholesalePerSheet) + size.coverChargeStudio;
              const retailBaseTotal = (standardSheets * size.retailPerSheet) + size.coverChargeRetail;
              const perSheetSaving = size.retailPerSheet - size.wholesalePerSheet;
              const totalAlbumSaving = retailBaseTotal - studioBaseTotal;
              const marginPercent = Math.round((totalAlbumSaving / retailBaseTotal) * 100);

              return (
                <div 
                  key={size.id} 
                  className="glass-panel" 
                  style={{ 
                    borderRadius: '16px', 
                    padding: '20px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    borderTop: size.popular ? '3px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Header line */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: size.orientation === 'landscape' ? 'rgba(56,189,248,0.15)' : 'rgba(236,72,153,0.15)', color: size.orientation === 'landscape' ? '#38bdf8' : '#ec4899', fontWeight: 700, textTransform: 'uppercase' }}>
                            {size.orientation === 'landscape' ? '↔️ Landscape' : '↕️ Portrait'}
                          </span>
                          {size.badge && (
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(212,175,55,0.15)', color: 'var(--gold-primary)', fontWeight: 700 }}>
                              {size.badge}
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontSize: '1.25rem', margin: '0 0 4px 0', fontWeight: 700, color: 'var(--paper)' }}>{size.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{size.dimensions}</p>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4', margin: '8px 0 16px 0' }}>{size.tag}</p>

                    {/* Per-Sheet Price Strip */}
                    <div style={{ 
                      background: 'linear-gradient(90deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.03) 100%)', 
                      border: '1px solid rgba(212,175,55,0.3)', 
                      borderRadius: '12px', 
                      padding: '12px 14px',
                      marginBottom: '14px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--gold-primary)', fontWeight: 700, textTransform: 'uppercase' }}>Studio Wholesale Rate</span>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold-primary)' }}>₹{size.wholesalePerSheet}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}> / sheet</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '6px', marginTop: '6px' }}>
                        <span>Customer Retail: <del>₹{size.retailPerSheet}/sheet</del></span>
                        <span style={{ color: '#34d399', fontWeight: 700 }}>You Save ₹{perSheetSaving}/sheet</span>
                      </div>
                    </div>

                    {/* 30-Sheet Standard Album Breakdown */}
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Standard 30 Sheets (60 Pages):</span>
                        <span style={{ color: 'var(--paper)', fontWeight: 600 }}>₹{standardSheets * size.wholesalePerSheet}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Standard Leatherette/Acrylic Cover:</span>
                        <span style={{ color: 'var(--paper)', fontWeight: 600 }}>₹{size.coverChargeStudio}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px', fontWeight: 700 }}>
                        <span style={{ color: 'var(--gold-primary)' }}>Total Standard 30-Sheet Cost:</span>
                        <span style={{ color: 'var(--gold-primary)' }}>₹{studioBaseTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#34d399', textAlign: 'right' }}>
                        Studio Margin vs Market Retail: ₹{totalAlbumSaving.toLocaleString('en-IN')} ({marginPercent}%)
                      </div>
                    </div>
                  </div>

                  {/* Submit Job Button */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/submit?size=${size.id.replace('size-', '')}`)}
                      className="liquid-btn"
                      style={{ 
                        flex: 1, 
                        padding: '10px 14px', 
                        borderRadius: '8px', 
                        fontSize: '0.88rem', 
                        fontWeight: 700, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Submit Job for this Size <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LUXURY SHEET FINISHES */}
      {activeTab === 'sheets' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {sheetTypes.map(sheet => (
            <div key={sheet.id} className="glass-panel" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: sheet.color, display: 'inline-block' }} />
                  <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, color: 'var(--paper)' }}>{sheet.title}</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', margin: '0 0 10px 0', fontWeight: 600 }}>{sheet.telugu}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>{sheet.tag}</p>

                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '10px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Paper Weight & Core:</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--paper)', fontWeight: 600 }}>{sheet.gsm}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', textTransform: 'uppercase', fontWeight: 700 }}>Studio Upgrade Rate</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                      {sheet.isBase ? 'Included in Base' : `+ ₹${sheet.wholesalePerSheet} / sheet`}
                    </div>
                  </div>
                  {!sheet.isBase && (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Retail Value</span>
                      <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                        + ₹{sheet.retailPerSheet} / sheet
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate('/submit')}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(212,175,55,0.4)',
                  background: 'transparent',
                  color: 'var(--gold-primary)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Select in Job Submission <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: VIDEO POST-PRODUCTION */}
      {activeTab === 'video' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {videoServices.map(v => {
            const margin = v.retailPrice - v.wholesalePrice;
            const marginPercent = Math.round((margin / v.retailPrice) * 100);

            return (
              <div key={v.id} className="glass-panel" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: 'var(--paper)', flex: 1 }}>{v.title}</h3>
                    <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {v.turnaround}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>{v.deliverables}</p>

                  <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: 700, textTransform: 'uppercase' }}>Studio Wholesale</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold-primary)' }}>₹{v.wholesalePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '6px' }}>
                      <span>Client Suggested Retail: <del>₹{v.retailPrice.toLocaleString('en-IN')}</del></span>
                      <span style={{ color: '#34d399', fontWeight: 700 }}>Profit: ₹{margin.toLocaleString('en-IN')} ({marginPercent}%)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/submit')}
                  className="liquid-btn"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  Order Video Editing <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: WHATSAPP INVITES & MANDAP FLEX */}
      {activeTab === 'flex' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {flexItems.map(f => {
            const margin = f.retailPrice - f.wholesalePrice;
            const marginPercent = Math.round((margin / f.retailPrice) * 100);

            return (
              <div key={f.id} className="glass-panel" style={{ borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: 'var(--paper)', flex: 1 }}>{f.title}</h3>
                    <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {f.turnaround}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>{f.deliverables}</p>

                  <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: 700, textTransform: 'uppercase' }}>Studio Wholesale</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold-primary)' }}>₹{f.wholesalePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '6px' }}>
                      <span>Client Suggested Retail: <del>₹{f.retailPrice.toLocaleString('en-IN')}</del></span>
                      <span style={{ color: '#34d399', fontWeight: 700 }}>Profit: ₹{margin.toLocaleString('en-IN')} ({marginPercent}%)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/submit')}
                  className="liquid-btn"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  Order This Item <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Guarantee */}
      <div style={{ marginTop: '3rem', padding: '1.5rem', borderRadius: '16px', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldCheck size={32} color="var(--gold-primary)" />
          <div>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--paper)' }}>100% White-Label Anonymous Guarantee</h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Albums and digital exports are delivered directly to your couple with YOUR studio branding. Our lab name is never shown.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/submit')}
          className="liquid-btn"
          style={{ padding: '0.8rem 1.8rem', borderRadius: '50px', fontSize: '0.95rem' }}
        >
          Submit New Studio Job
        </button>
      </div>

    </div>
  );
}
