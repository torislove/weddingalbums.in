import React, { useState, useEffect } from 'react';
import { 
  FileType, CheckCircle, ChevronRight, HardDrive, Video, BookOpen, 
  Layers, UploadCloud, Film, ShieldCheck, Flag, Sparkles, Package,
  ArrowLeft, ArrowRight, Clock, Check
} from 'lucide-react';
import { API } from '../apiConfig';
import Toast from '../components/ui/Toast';

/* ── Visual configurator assets: RAW → Polished compare + cover mockups ── */
const COVER_MOCKUPS = {
  matte: '/images/mockup-layflat-spread.svg',
  acrylic: '/images/mockup-acrylic-cover.svg',
  leatherette: '/images/mockup-leatherette-embossed.svg',
  'velvet-foil': '/images/mockup-velvet-gold-foil.svg',
  default: '/images/mockup-leatherette-embossed.svg'
};

/** Interactive RAW→Polished wedge preview (zero-dependency compare slider). */
const ComparePreview = ({ label = 'EDITED OUTPUT', value = 55, raw = '/images/bride-raw.jpg', polished = '/images/bride-polished.jpg' }) => {
  const [pos, setPos] = useState(value);
  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
        <span>RAW FILE</span>
        <span>{label} — slide to preview</span>
      </div>
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '16/10', borderRadius: '12px',
        overflow: 'hidden', border: '1px solid var(--glass-border, rgba(255,255,255,0.12))', background: '#0d0d12',
        touchAction: 'none',
      }}>
        <img src={raw} alt="RAW file preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.72) contrast(0.96)' }} />
        <div style={{
          position: 'absolute', inset: 0, width: `${pos}%`, overflow: 'hidden',
          borderRight: '2px solid var(--gold-primary, var(--brand))',
          boxShadow: '0 0 24px rgba(212,175,55,0.35)',
        }}>
          <img src={polished} alt="Edited output preview" style={{ position: 'absolute', inset: 0, height: '100%', width: `${10000 / Math.max(pos, 1)}%`, maxWidth: 'none', objectFit: 'cover' }} />
        </div>
        <div style={{
          position: 'absolute', left: `${pos}%`, top: '50%', transform: 'translate(-50%, -50%)',
          width: 34, height: 34, borderRadius: '50%', background: 'rgba(13,13,18,0.85)',
          border: '1.5px solid var(--gold-primary, var(--brand))', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--gold-primary, var(--brand))', fontSize: 14, userSelect: 'none', pointerEvents: 'none',
        }}>⇔</div>
        <input
          type="range" min="8" max="92" value={pos}
          onChange={e => setPos(Number(e.target.value))}
          aria-label="Compare RAW and edited preview"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'ew-resize', margin: 0 }}
        />
      </div>
    </div>
  );
};

/** Cover-finish mockup preview card. */
const CoverMockup = ({ id }) => (
  <div style={{
    position: 'relative', alignSelf: 'stretch', borderRadius: '12px', overflow: 'hidden',
    border: '1px solid rgba(212,175,55,0.35)', minHeight: '150px', background: '#0d0d12',
  }}>
    <img
      src={COVER_MOCKUPS[id] || COVER_MOCKUPS.default}
      alt={`${id} cover finish mockup`}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
    <span style={{
      position: 'absolute', left: 10, bottom: 10, padding: '4px 10px', borderRadius: 999,
      background: 'rgba(13,13,18,0.8)', border: '1px solid rgba(212,175,55,0.4)',
      color: 'var(--gold-primary, var(--brand))', fontSize: '10.5px', letterSpacing: '1.5px', fontWeight: 600,
    }}>COVER MOCK PREVIEW</span>
  </div>
);

// Indian Market Standard Album Sizes for B2B Studios (Landscape & Portrait with Per-Sheet Rates)
const ALBUM_SIZES = [
  // LANDSCAPE SIZES (↔️)
  { id: '14x40', name: '14×40 Magnum Royal Mandap (↔️)', openSpread: '14" × 40"', orientation: 'landscape', wholesalePerSheet: 350, retailPerSheet: 550, wholesaleBase: 10500, suggestedRetail: 16500, category: 'Grand Landscape' },
  { id: '12x36', name: '12×36 Grand Imperial AP Standard (↔️)', openSpread: '12" × 36"', orientation: 'landscape', wholesalePerSheet: 180, retailPerSheet: 260, wholesaleBase: 7800, suggestedRetail: 12500, category: 'Most Popular in AP' },
  { id: '12x30', name: '12×30 Panoramic Cinema (↔️)', openSpread: '12" × 30"', orientation: 'landscape', wholesalePerSheet: 155, retailPerSheet: 230, wholesaleBase: 6800, suggestedRetail: 10500, category: 'Cinema Landscape' },
  { id: '10x30', name: '10×30 Slim Cinema (↔️)', openSpread: '10" × 30"', orientation: 'landscape', wholesalePerSheet: 145, retailPerSheet: 210, wholesaleBase: 5900, suggestedRetail: 9200, category: 'Slim Landscape' },
  { id: '15x30', name: '15×30 Royal Square Jumbo (↔️)', openSpread: '30" × 15"', orientation: 'landscape', wholesalePerSheet: 210, retailPerSheet: 320, wholesaleBase: 8500, suggestedRetail: 13200, category: 'Royal Square' },
  { id: '12x24', name: '12×24 Square Celebration (↔️)', openSpread: '12" × 24"', orientation: 'landscape', wholesalePerSheet: 140, retailPerSheet: 200, wholesaleBase: 5400, suggestedRetail: 7500, category: 'Square Classic' },
  { id: '10x24', name: '10×24 Compact Feast (↔️)', openSpread: '10" × 24"', orientation: 'landscape', wholesalePerSheet: 125, retailPerSheet: 180, wholesaleBase: 4200, suggestedRetail: 5800, category: 'Compact Feast' },
  { id: '12x18-horiz', name: '12×18 Traditional Horizontal (↔️)', openSpread: '12" × 18"', orientation: 'landscape', wholesalePerSheet: 115, retailPerSheet: 160, wholesaleBase: 3800, suggestedRetail: 5200, category: 'Traditional Horizontal' },
  { id: '6x9-pocket', name: '6×9 Companion Pocket Parent Book (↔️)', openSpread: '6" × 18"', orientation: 'landscape', wholesalePerSheet: 70, retailPerSheet: 105, wholesaleBase: 2100, suggestedRetail: 3200, category: 'Parent Mini Book' },

  // PORTRAIT SIZES (↕️)
  { id: '18x12-vert', name: '18×12 Grand Vertical Royal Magazine (↕️)', openSpread: '18"H × 24"W', orientation: 'portrait', wholesalePerSheet: 165, retailPerSheet: 240, wholesaleBase: 6200, suggestedRetail: 9000, category: 'Vertical Portrait' },
  { id: '15x12-vert', name: '15×12 Classic Vertical Portrait (↕️)', openSpread: '15"H × 24"W', orientation: 'portrait', wholesalePerSheet: 145, retailPerSheet: 210, wholesaleBase: 5400, suggestedRetail: 7800, category: 'Vertical Portrait' },
  { id: '14x11-vert', name: '14×11 Fine Art Editorial Vertical (↕️)', openSpread: '14"H × 22"W', orientation: 'portrait', wholesalePerSheet: 135, retailPerSheet: 190, wholesaleBase: 4900, suggestedRetail: 7200, category: 'Vertical Editorial' },
  { id: '12x9-vert', name: '12×9 Compact Vertical Storybook (↕️)', openSpread: '12"H × 18"W', orientation: 'portrait', wholesalePerSheet: 115, retailPerSheet: 160, wholesaleBase: 3900, suggestedRetail: 5500, category: 'Vertical Compact' },
  { id: '10x8-vert', name: '10×8 Family Keepsake Portrait (↕️)', openSpread: '10"H × 16"W', orientation: 'portrait', wholesalePerSheet: 95, retailPerSheet: 130, wholesaleBase: 3200, suggestedRetail: 4500, category: 'Family Gift' },
  { id: '8x12-vert', name: '8×12 Traditional Vertical (A4) (↕️)', openSpread: '12"H × 16"W', orientation: 'portrait', wholesalePerSheet: 85, retailPerSheet: 120, wholesaleBase: 2600, suggestedRetail: 3800, category: 'Vertical Compact' },
];

// 2-Dimensional Sheet Taxonomy: Base Substrates & Surface Finishes
const BASE_SUBSTRATES = [
  { id: 'ntr', name: 'NTR Synthetic BOPP (100% Waterproof / Tear-Proof)', wholesaleExtra: 0, suggestedRetailExtra: 0, desc: '80%+ Indian Wedding Industry Standard. Will not crease or sag.' },
  { id: 'art-paper', name: 'Regular Wood-Pulp Art Paper (250 GSM)', wholesaleExtra: 0, suggestedRetailExtra: 0, desc: 'Budget-friendly digital press substrate.' },
  { id: 'silver-halide', name: 'Silver Halide Fuji Crystal Archive RA-4 (+₹25/sheet)', wholesaleExtra: 25, suggestedRetailExtra: 40, desc: 'True optical continuous-tone photographic paper.' },
  { id: 'cotton-rag', name: 'Cotton Rag Fine Art (Hahnemühle Giclée +₹40/sheet)', wholesaleExtra: 40, suggestedRetailExtra: 60, desc: '100% cotton museum acid-free archival substrate.' }
];

const SHEET_TYPES = [
  { id: 'ntr-matte', name: 'NTR Anti-Glare Matte (Standard ₹0 Extra)', rate: 0, suggestedRetail: 0, gsm: 'Standard Lab Finish' },
  { id: 'ntr-gloss', name: 'NTR Crystal High-Gloss (Standard ₹0 Extra)', rate: 0, suggestedRetail: 0, gsm: 'Standard Lab Finish' },
  { id: 'silky', name: 'Silky / Silk Matte Pattu Texture (+₹15/sheet)', rate: 15, suggestedRetail: 25, gsm: 'Luxury Surface' },
  { id: 'velvet', name: 'Velvet Feather Touch Soft-Touch (+₹22/sheet)', rate: 22, suggestedRetail: 35, gsm: 'Luxury Surface' },
  { id: 'metallic', name: '24K Metallic Pearl Luxury Sheen (+₹28/sheet)', rate: 28, suggestedRetail: 45, gsm: 'Luxury Surface' },
  { id: 'sparkle', name: 'Sparkle Glitter Micro-Crystal (+₹32/sheet)', rate: 32, suggestedRetail: 50, gsm: 'Luxury Surface' },
  { id: 'luster', name: 'Luster / Satin Micro-Grain (+₹18/sheet)', rate: 18, suggestedRetail: 30, gsm: 'Luxury Surface' },
  { id: 'embossed', name: 'Leatherette / Canvas Embossed (+₹25/sheet)', rate: 25, suggestedRetail: 40, gsm: 'Luxury Surface' }
];

// Master Cover Finishes
const COVER_FINISHES = [
  { id: 'matte', name: 'Anti-Scratch Scuff-Free Hardcover Matte', wholesaleExtra: 0 },
  { id: 'acrylic', name: 'Diamond-Polished Crystal Acrylic 3D Glass', wholesaleExtra: 1500 },
  { id: 'leatherette', name: 'Italian Hand-Stitched Leatherette + Briefcase Box', wholesaleExtra: 1800 },
  { id: 'velvet-foil', name: 'Royal Velvet Hardcover + 24K Gold Debossed Foil', wholesaleExtra: 1200 }
];

// Video Editing Post-Production Options
const VIDEO_SERVICES = [
  { id: 'feature', name: '4K Cinematic Wedding Feature Film (15-20 min)', wholesaleRate: 6200, suggestedRetail: 10000 },
  { id: 'doc', name: 'Traditional Full Documentary (2-3 hrs)', wholesaleRate: 7500, suggestedRetail: 12000 },
  { id: 'teaser', name: '3-5 Min 4K Cinematic Teaser Trailer', wholesaleRate: 3600, suggestedRetail: 6000 },
  { id: 'reels', name: 'Viral Instagram Reels & Shorts Pack (5 Reels)', wholesaleRate: 2100, suggestedRetail: 3500 },
  { id: 'audio', name: 'Audio Mixing, Noise Cleanup & Mangala Vaadhyam Score', wholesaleRate: 1800, suggestedRetail: 3000 }
];

// Event Flex & Banners
const FLEX_SERVICES = [
  { id: 'mandap-flex', name: 'Grand Mandap & Entrance Flex (10×8 ft)', wholesaleRate: 1100, suggestedRetail: 1800 },
  { id: 'standee', name: 'Welcome Roll-Up Standee with Aluminum Stand (6×2.5 ft)', wholesaleRate: 850, suggestedRetail: 1400 },
  { id: 'hoarding', name: 'Highway & Roadside Wedding Hoarding (40×20 ft)', wholesaleRate: 2600, suggestedRetail: 4200 },
  { id: 'video-invite', name: '60s 4K WhatsApp Animated Video Invitation', wholesaleRate: 950, suggestedRetail: 1800 }
];

const SubmitJob = () => {
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null); // { msg, tone }
  
  // Parse query params for direct dashboard configurator pass-through
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sizeParam = params.get('size');
      const sheetParam = params.get('sheet');
      const sheetsParam = params.get('sheets');
      const videoParam = params.get('video');

      if (sizeParam || sheetParam || videoParam) {
        setFormData(prev => ({
          ...prev,
          jobType: 'album',
          albumSize: sizeParam || prev.albumSize,
          sheetType: sheetParam || prev.sheetType,
          sheetsCount: sheetsParam ? Number(sheetsParam) : prev.sheetsCount,
          selectedVideo: videoParam && videoParam !== 'none' ? [videoParam] : prev.selectedVideo
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  const [formData, setFormData] = useState({
    jobType: 'album', // 'album' | 'video' | 'flex' | 'bundle' | 'culling' | 'retouch'
    eventName: '',
    eventType: 'Full Wedding Package',
    eventDate: '',
    fileCount: '',
    editingStyle: 'Warm Gold Telugu Tones',
    referenceLink: '',
    instructions: '',
    
    // Album Specs
    albumSize: '12x36',
    substrateType: 'ntr',
    sheetType: 'ntr-matte',
    sheetsCount: 30,
    coverFinish: 'acrylic',
    
    // Video & Flex Specs
    selectedVideo: [],
    selectedFlex: [],
    
    // White Label Delivery
    isWhiteLabel: true,
    studioDebossName: '',
    shippingAddress: '',
    clientContactPhone: '',
    
    // Transfer Method
    deliveryFormat: 'Google Drive',
    uploadMethod: 'gdrive',
    cloudLink: '',
    
    // Studio Retail Billing
    studioBilledQuote: 18500
  });

  const [sizeOrientation, setSizeOrientation] = useState('all'); // 'all' | 'landscape' | 'portrait'

  // Calculate Wholesale Lab Cost
  const sizeObj = ALBUM_SIZES.find(s => s.id === formData.albumSize) || ALBUM_SIZES[1];
  const substrateObj = BASE_SUBSTRATES.find(s => s.id === formData.substrateType) || BASE_SUBSTRATES[0];
  const sheetObj = SHEET_TYPES.find(s => s.id === formData.sheetType) || SHEET_TYPES[0];
  const coverObj = COVER_FINISHES.find(c => c.id === formData.coverFinish) || COVER_FINISHES[1];
  
  let wholesaleTotal = 0;
  let suggestedRetailTotal = 0;

  if (formData.jobType === 'album' || formData.jobType === 'bundle') {
    const extraSheets = Math.max(0, formData.sheetsCount - 30);
    const perSheetWholesale = sizeObj.wholesalePerSheet || Math.round(sizeObj.wholesaleBase / 30);
    const perSheetRetail = sizeObj.retailPerSheet || Math.round(sizeObj.suggestedRetail / 30);
    const extraSheetsCost = extraSheets * perSheetWholesale;
    const finishCost = formData.sheetsCount * sheetObj.rate;
    const substrateCost = formData.sheetsCount * substrateObj.wholesaleExtra;

    wholesaleTotal += sizeObj.wholesaleBase + extraSheetsCost + finishCost + substrateCost + coverObj.wholesaleExtra;
    suggestedRetailTotal += sizeObj.suggestedRetail + (extraSheets * perSheetRetail) + (formData.sheetsCount * sheetObj.suggestedRetail) + (formData.sheetsCount * substrateObj.suggestedRetailExtra) + (coverObj.wholesaleExtra * 1.5);
  }

  if (formData.jobType === 'video' || formData.jobType === 'bundle') {
    formData.selectedVideo.forEach(vidId => {
      const v = VIDEO_SERVICES.find(item => item.id === vidId);
      if (v) {
        wholesaleTotal += v.wholesaleRate;
        suggestedRetailTotal += v.suggestedRetail;
      }
    });
  }

  if (formData.jobType === 'flex' || formData.jobType === 'bundle') {
    formData.selectedFlex.forEach(flexId => {
      const f = FLEX_SERVICES.find(item => item.id === flexId);
      if (f) {
        wholesaleTotal += f.wholesaleRate;
        suggestedRetailTotal += f.suggestedRetail;
      }
    });
  }

  if (formData.jobType === 'culling') {
    wholesaleTotal += 1200;
    suggestedRetailTotal += 2500;
  } else if (formData.jobType === 'retouch') {
    wholesaleTotal += 2200;
    suggestedRetailTotal += 4500;
  }

  const studioProfit = Math.max(0, Number(formData.studioBilledQuote) - wholesaleTotal);
  const marginPct = formData.studioBilledQuote > 0 ? Math.round((studioProfit / Number(formData.studioBilledQuote)) * 100) : 0;

  const nextDisabled = () => {
    if (step === 1) return !formData.jobType;
    if (step === 2) return !formData.eventName || !formData.eventDate;
    if (step === 4 && formData.uploadMethod !== 'physical' && !formData.cloudLink) return true;
    return false;
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const toggleVideo = (id) => {
    setFormData(prev => ({
      ...prev,
      selectedVideo: prev.selectedVideo.includes(id)
        ? prev.selectedVideo.filter(v => v !== id)
        : [...prev.selectedVideo, id]
    }));
  };

  const toggleFlex = (id) => {
    setFormData(prev => ({
      ...prev,
      selectedFlex: prev.selectedFlex.includes(id)
        ? prev.selectedFlex.filter(f => f !== id)
        : [...prev.selectedFlex, id]
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('b2bToken');
      if (!token) {
        setToast({ msg: 'Please login first to access studio trade submission', tone: 'danger' });
        return;
      }
      
      const payload = {
        job_type: formData.jobType,
        client_name: formData.eventName,
        event_date: formData.eventDate,
        event_type: formData.eventType,
        design_style: formData.editingStyle,
        specifications: {
          albumSize: formData.albumSize,
          sheetType: formData.sheetType,
          sheetsCount: formData.sheetsCount,
          coverFinish: formData.coverFinish,
          videoServices: formData.selectedVideo,
          flexServices: formData.selectedFlex,
          isWhiteLabel: formData.isWhiteLabel,
          studioDebossName: formData.studioDebossName,
          shippingAddress: formData.shippingAddress,
          clientContactPhone: formData.clientContactPhone,
          wholesaleCost: wholesaleTotal,
          clientBilledQuote: formData.studioBilledQuote,
          studioRetainedMargin: studioProfit
        },
        instructions: `Delivery Format: ${formData.deliveryFormat} | References: ${formData.referenceLink} | Notes: ${formData.instructions} | WhiteLabel: ${formData.isWhiteLabel ? 'YES' : 'NO'} (${formData.studioDebossName || 'Default'})`,
        raw_files_link: formData.cloudLink,
        region: 'Andhra/TS' 
      };

      const response = await fetch(`${API}/api/b2b/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        setToast({ msg: `Job submitted to Lab! ID ${data.id} · Lab cost ₹${wholesaleTotal.toLocaleString('en-IN')} · Your margin ₹${studioProfit.toLocaleString('en-IN')}`, tone: 'success' });
        setTimeout(() => { window.location.href = '/dashboard'; }, 1600);
      } else {
        setToast({ msg: data.error || 'Failed to submit job', tone: 'danger' });
      }
    } catch (err) {
      console.error(err);
      setToast({ msg: 'Network error while submitting job', tone: 'danger' });
    }
  };

  return (
    <div className="page-content reveal active" style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1rem, 3vw, 2rem)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '99px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold-primary)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          <Sparkles size={12} />
          <span>Andhra Pradesh Studio Trade Submission</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Submit Post-Production Job
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', margin: 0 }}>
          Dedicated wholesale printing, 4K video editing, and 100% white-label client drop-shipping.
        </p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch' }}>
        {[
          { num: 1, label: 'Service & Specs' },
          { num: 2, label: 'Event Details' },
          { num: 3, label: 'White-Label & Style' },
          { num: 4, label: 'RAW Files Ingest' },
          { num: 5, label: 'Margin & Confirm' }
        ].map((s, i, arr) => (
          <React.Fragment key={s.num}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: step >= s.num ? 'var(--gold-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: step >= s.num ? 'var(--gold-primary)' : 'var(--glass-border)', 
                color: step >= s.num ? 'var(--n-1000)' : 'var(--text-muted)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                boxShadow: step >= s.num ? '0 0 15px rgba(212,175,55,0.4)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {step > s.num ? <CheckCircle size={18} /> : s.num}
              </div>
              <span style={{ fontWeight: step >= s.num ? 600 : 400, fontSize: '13px' }}>{s.label}</span>
            </div>
            {i < arr.length - 1 && <ChevronRight size={18} color={step > s.num ? "var(--gold-primary)" : "var(--glass-border)"} style={{ opacity: 0.5, flexShrink: 0 }} />}
          </React.Fragment>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 'clamp(1.2rem, 3vw, 2.5rem)', position: 'relative', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '16px' }}>
        {/* Glow orb */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* STEP 1: SERVICE & SPECIFICATIONS */}
        {step === 1 && (
          <div style={{ animation: 'uiaFadeIn 0.4s ease forwards' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 600 }}>1. Select Core Service</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '13px' }}>All jobs are color-calibrated and crafted by senior editors matching your studio presets.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { id: 'album', icon: BookOpen, title: 'Luxury Album Print', desc: '10 AP Sizes & 5 Sheet Finishes' },
                { id: 'video', icon: Video, title: '4K Cinema Video', desc: 'Teasers, Feature Films & Reels' },
                { id: 'bundle', icon: Package, title: 'Full Master Bundle', desc: 'Album + 4K Cinema + Retouching' },
                { id: 'flex', icon: Flag, title: 'Flex & Invitations', desc: 'Mandap Banners & Video Cards' },
                { id: 'culling', icon: Layers, title: 'RAW Culling & Retouch', desc: 'Color correction & skin tones' }
              ].map(type => (
                <div 
                  key={type.id}
                  onClick={() => setFormData({...formData, jobType: type.id})}
                  style={{ 
                    border: `2px solid ${formData.jobType === type.id ? 'var(--gold-primary)' : 'var(--glass-border)'}`, 
                    padding: '1.25rem 1rem', 
                    borderRadius: '14px', 
                    cursor: 'pointer', 
                    textAlign: 'center', 
                    transition: 'all 0.2s ease', 
                    background: formData.jobType === type.id ? 'rgba(212,175,55,0.08)' : 'var(--bg-tertiary)',
                    transform: formData.jobType === type.id ? 'translateY(-2px)' : 'none',
                    boxShadow: formData.jobType === type.id ? '0 10px 20px rgba(212,175,55,0.15)' : 'none'
                  }}
                >
                  <type.icon size={30} color={formData.jobType === type.id ? 'var(--gold-primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.95rem', color: formData.jobType === type.id ? 'var(--paper)' : 'var(--text-secondary)' }}>{type.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>{type.desc}</p>
                </div>
              ))}
            </div>

            {/* Sub-Configurator for Album Printing */}
            {(formData.jobType === 'album' || formData.jobType === 'bundle') && (
              <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: '14px', border: '1px solid rgba(212,175,55,0.2)', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--gold-primary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} /> Album Print Specifications
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, margin: 0 }}>Album Dimension (Per Sheet)</label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          type="button" 
                          onClick={() => setSizeOrientation('all')}
                          style={{ background: sizeOrientation === 'all' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)', color: sizeOrientation === 'all' ? '#000' : '#888', border: 'none', borderRadius: '4px', fontSize: '10px', padding: '2px 6px', cursor: 'pointer', fontWeight: 600 }}
                        >All</button>
                        <button 
                          type="button" 
                          onClick={() => setSizeOrientation('landscape')}
                          style={{ background: sizeOrientation === 'landscape' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)', color: sizeOrientation === 'landscape' ? '#000' : '#888', border: 'none', borderRadius: '4px', fontSize: '10px', padding: '2px 6px', cursor: 'pointer', fontWeight: 600 }}
                        >↔️ Landscape</button>
                        <button 
                          type="button" 
                          onClick={() => setSizeOrientation('portrait')}
                          style={{ background: sizeOrientation === 'portrait' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)', color: sizeOrientation === 'portrait' ? '#000' : '#888', border: 'none', borderRadius: '4px', fontSize: '10px', padding: '2px 6px', cursor: 'pointer', fontWeight: 600 }}
                        >↕️ Portrait</button>
                      </div>
                    </div>
                    <select 
                      value={formData.albumSize} 
                      onChange={e => setFormData({...formData, albumSize: e.target.value})}
                      className="form-control"
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--paper)', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                    >
                      {ALBUM_SIZES
                        .filter(s => sizeOrientation === 'all' || s.orientation === sizeOrientation)
                        .map(s => (
                          <option key={s.id} value={s.id} style={{ background: 'var(--n-900)', color: 'var(--paper)' }}>
                            {s.name} — ₹{s.wholesalePerSheet}/sh (Base: ₹{s.wholesaleBase.toLocaleString('en-IN')})
                          </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>Base Substrate (Core Media)</label>
                    <select 
                      value={formData.substrateType} 
                      onChange={e => setFormData({...formData, substrateType: e.target.value})}
                      className="form-control"
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--paper)', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                    >
                      {BASE_SUBSTRATES.map(sub => (
                        <option key={sub.id} value={sub.id} style={{ background: 'var(--n-900)', color: 'var(--paper)' }}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>Surface Finish / Lamination</label>
                    <select 
                      value={formData.sheetType} 
                      onChange={e => setFormData({...formData, sheetType: e.target.value})}
                      className="form-control"
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--paper)', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                    >
                      {SHEET_TYPES.map(s => (
                        <option key={s.id} value={s.id} style={{ background: 'var(--n-900)', color: 'var(--paper)' }}>
                          {s.name} ({s.gsm} - ₹{s.rate}/sheet)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>
                      <span>Sheets Count</span>
                      <span style={{ color: 'var(--gold-primary)' }}>{formData.sheetsCount} Sheets ({formData.sheetsCount * 2} Pages)</span>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="60" 
                      value={formData.sheetsCount} 
                      onChange={e => setFormData({...formData, sheetsCount: Number(e.target.value)})}
                      style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 600 }}>Master Cover Finish</label>
                    <select 
                      value={formData.coverFinish} 
                      onChange={e => setFormData({...formData, coverFinish: e.target.value})}
                      className="form-control"
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--paper)', borderRadius: '8px', outline: 'none', fontSize: '13px' }}
                    >
                      {COVER_FINISHES.map(c => (
                        <option key={c.id} value={c.id} style={{ background: 'var(--n-900)', color: 'var(--paper)' }}>
                          {c.name} {c.wholesaleExtra > 0 ? `(+₹${c.wholesaleExtra.toLocaleString('en-IN')})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <CoverMockup id={formData.coverFinish} />
                </div>
              </div>
            )}

            {/* Sub-Configurator for Video Services */}
            {(formData.jobType === 'video' || formData.jobType === 'bundle') && (
              <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: '14px', border: '1px solid rgba(212,175,55,0.2)', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--gold-primary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Video size={18} /> Select 4K Cinematic Video Post-Production
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '0.75rem' }}>
                  {VIDEO_SERVICES.map(v => {
                    const isChecked = formData.selectedVideo.includes(v.id);
                    return (
                      <div 
                        key={v.id}
                        onClick={() => toggleVideo(v.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                          background: isChecked ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isChecked ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)'}`
                        }}
                      >
                        <div style={{ width: 18, height: 18, borderRadius: '4px', border: `2px solid ${isChecked ? 'var(--gold-primary)' : 'var(--n-600)'}`, background: isChecked ? 'var(--gold-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isChecked && <Check size={14} color="#000" strokeWidth={3} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--paper)' }}>{v.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--gold-primary)', fontFamily: 'monospace' }}>+₹{v.wholesaleRate.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-Configurator for Flex Services */}
            {(formData.jobType === 'flex' || formData.jobType === 'bundle') && (
              <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.5)', borderRadius: '14px', border: '1px solid rgba(212,175,55,0.2)', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--gold-primary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flag size={18} /> Select Event Flex & Video Invitations
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '0.75rem' }}>
                  {FLEX_SERVICES.map(f => {
                    const isChecked = formData.selectedFlex.includes(f.id);
                    return (
                      <div 
                        key={f.id}
                        onClick={() => toggleFlex(f.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                          background: isChecked ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isChecked ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)'}`
                        }}
                      >
                        <div style={{ width: 18, height: 18, borderRadius: '4px', border: `2px solid ${isChecked ? 'var(--gold-primary)' : 'var(--n-600)'}`, background: isChecked ? 'var(--gold-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isChecked && <Check size={14} color="#000" strokeWidth={3} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--paper)' }}>{f.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--gold-primary)', fontFamily: 'monospace' }}>+₹{f.wholesaleRate.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: EVENT DETAILS */}
        {step === 2 && (
          <div style={{ animation: 'uiaFadeIn 0.4s ease forwards', display: 'grid', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', margin: '0 0 0.35rem 0', fontWeight: 600 }}>2. Event Information</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '13px' }}>Tell us about the couple and the ceremony style for regional ritual matching.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Client / Couple Names <span style={{ color: 'red' }}>*</span></label>
                <input type="text" className="form-control" style={{ padding: '0.85rem' }} placeholder="e.g. Suresh & Ramya" value={formData.eventName} onChange={e => setFormData({...formData, eventName: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Ceremony Type</label>
                <select className="form-control" style={{ padding: '0.85rem' }} value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})}>
                  <option>Full Telugu Wedding Master Suite</option>
                  <option>Muhurtham & Jeelakarra Bellam</option>
                  <option>Pellikuturu / Haldi Ceremony</option>
                  <option>Sangeet & Reception</option>
                  <option>Pre-Wedding Outdoor Shoot</option>
                  <option>Naming Ceremony / Birthday Event</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Event Date <span style={{ color: 'red' }}>*</span></label>
                <input type="date" className="form-control" style={{ padding: '0.85rem' }} value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Estimated Assets</label>
                <input type="text" className="form-control" style={{ padding: '0.85rem' }} placeholder="e.g. 2,500 RAWs, 120GB 4K footage" value={formData.fileCount} onChange={e => setFormData({...formData, fileCount: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: WHITE-LABEL GUARANTEE & STYLE */}
        {step === 3 && (
          <div style={{ animation: 'uiaFadeIn 0.4s ease forwards', display: 'grid', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', margin: '0 0 0.35rem 0', fontWeight: 600 }}>3. White-Label Shipping & Aesthetics</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '13px' }}>We deliver directly to your client under your studio branding with zero lab marks.</p>
            </div>

            {/* White-Label Banner Card */}
            <div style={{ padding: '1.25rem', background: 'rgba(16,185,129,0.08)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <ShieldCheck size={24} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--ok)', fontSize: '14px' }}>100% Blind White-Label Protection</div>
                <div style={{ fontSize: '12px', color: 'var(--n-200)', marginTop: '2px' }}>
                  The presentation box, shipping invoice, and courier box will carry only YOUR studio identity. We strictly never contact or market to your clients.
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Studio Name to Deboss on Luxury Box</label>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ padding: '0.85rem' }} 
                  placeholder="e.g. Srikanth Photography Vijayawada" 
                  value={formData.studioDebossName} 
                  onChange={e => setFormData({...formData, studioDebossName: e.target.value})} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Editing Style Preset</label>
                <select className="form-control" style={{ padding: '0.85rem' }} value={formData.editingStyle} onChange={e => setFormData({...formData, editingStyle: e.target.value})}>
                  <option>Warm Gold Telugu Tones (Rich Pattu & Jewelry)</option>
                  <option>Cinematic Teal & Warm Gold</option>
                  <option>Natural Sathi-Ranga (True Eye Color)</option>
                  <option>Moody Film Emulation (Kodak Portra Style)</option>
                  <option>Custom Studio Presets (Upload LUTs in next step)</option>
                </select>
                <ComparePreview label={formData.editingStyle.replace(/\s*\(.*\)$/, '')} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Client Courier Delivery Address</label>
                <textarea 
                  className="form-control" 
                  rows="2" 
                  style={{ padding: '0.85rem', resize: 'vertical' }} 
                  placeholder="Door No, Street, Landmark, Town/City, PIN Code" 
                  value={formData.shippingAddress} 
                  onChange={e => setFormData({...formData, shippingAddress: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Client Phone (For Courier Delivery Only)</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  style={{ padding: '0.85rem' }} 
                  placeholder="+91 98765 43210" 
                  value={formData.clientContactPhone} 
                  onChange={e => setFormData({...formData, clientContactPhone: e.target.value})} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '13px' }}>Special Instructions / Color Grading Preferences</label>
              <textarea 
                className="form-control" 
                rows="2" 
                style={{ padding: '0.85rem', resize: 'vertical' }} 
                placeholder="e.g. Avoid oversaturating reds in Pellikuturu, highlight diamond necklace in stage portraits..." 
                value={formData.instructions} 
                onChange={e => setFormData({...formData, instructions: e.target.value})}
              />
            </div>
          </div>
        )}

        {/* STEP 4: RAW INGEST */}
        {step === 4 && (
          <div style={{ animation: 'uiaFadeIn 0.4s ease forwards', display: 'grid', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', margin: '0 0 0.35rem 0', fontWeight: 600 }}>4. Ingest Camera RAWs & 4K Footage</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '13px' }}>Choose your file transfer method for high-speed download at our lab.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '1rem' }}>
              {[
                { id: 'gdrive', label: 'Google Drive', icon: UploadCloud },
                { id: 'wetransfer', label: 'WeTransfer', icon: Film },
                { id: 'dropbox', label: 'Dropbox', icon: UploadCloud },
                { id: 'physical', label: 'Ship USB / SSD', icon: HardDrive }
              ].map(method => (
                <div 
                  key={method.id}
                  onClick={() => setFormData({...formData, uploadMethod: method.id})}
                  style={{ 
                    padding: '1.25rem 1rem', 
                    textAlign: 'center', 
                    border: `2px solid ${formData.uploadMethod === method.id ? 'var(--gold-primary)' : 'var(--glass-border)'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: formData.uploadMethod === method.id ? 'rgba(212, 175, 55, 0.08)' : 'var(--bg-tertiary)',
                    color: formData.uploadMethod === method.id ? 'var(--paper)' : 'var(--text-muted)',
                    transition: 'all 0.2s ease',
                    transform: formData.uploadMethod === method.id ? 'translateY(-2px)' : 'none'
                  }}
                >
                  <method.icon size={24} style={{ margin: '0 auto 0.5rem', color: formData.uploadMethod === method.id ? 'var(--gold-primary)' : 'var(--text-muted)' }} />
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{method.label}</span>
                </div>
              ))}
            </div>

            {formData.uploadMethod === 'physical' ? (
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <HardDrive size={36} color="var(--gold-primary)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ color: 'var(--paper)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Ship Hard Drive to Vijayawada Lab</h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '13px' }}>
                  Please pack your drive securely. Submit this job to generate your Job ID, and write the Job ID on the courier parcel.
                </p>
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '8px', border: '1px dashed rgba(212,175,55,0.3)', display: 'inline-block', textAlign: 'left', color: 'var(--n-200)', fontSize: '13px' }}>
                  <strong>WeddingAlbums.in Production Lab</strong><br/>
                  MG Road, Near Benz Circle<br/>
                  Vijayawada, Andhra Pradesh 520010<br/>
                  Coordinator: +91 98765 43210
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--paper)', fontWeight: 600, fontSize: '13px' }}>
                  Paste Cloud Link ({formData.uploadMethod === 'gdrive' ? 'Google Drive' : formData.uploadMethod === 'wetransfer' ? 'WeTransfer' : 'Dropbox'})
                </label>
                <input 
                  type="url" 
                  className="form-control" 
                  style={{ padding: '1rem', fontSize: '13px', border: '1px solid rgba(212,175,55,0.4)', background: 'rgba(0,0,0,0.6)' }} 
                  placeholder="https://drive.google.com/drive/folders/..." 
                  value={formData.cloudLink}
                  onChange={e => setFormData({...formData, cloudLink: e.target.value})}
                  required
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.75rem', color: 'var(--gold-primary)', fontSize: '12px' }}>
                  <CheckCircle size={14} />
                  <span>Ensure link permissions are set to "Anyone with the link can view/download".</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: MARGIN & ORDER CONFIRMATION */}
        {step === 5 && (
          <div style={{ animation: 'uiaFadeIn 0.4s ease forwards' }}>
            <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', margin: '0 0 0.5rem 0', fontWeight: 600 }}>5. Wholesale Quote & Retained Margin Breakdown</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 1.5rem 0', fontSize: '13px' }}>Review your wholesale production cost and estimated studio profit.</p>
            
            {/* Live Margin Calculation Card */}
            <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0,0,0,0.8) 100%)', border: '1px solid var(--gold-primary)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.5rem', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Wholesale Lab Cost (Payable)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--paper)', fontFamily: 'monospace' }}>
                    ₹{wholesaleTotal.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--gold-primary)' }}>100% Tax & Courier Included</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>What You Bill Client (Quote)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.2rem', color: 'var(--gold-primary)', fontWeight: 'bold' }}>₹</span>
                    <input 
                      type="number" 
                      value={formData.studioBilledQuote} 
                      onChange={e => setFormData({...formData, studioBilledQuote: Math.max(0, Number(e.target.value))})}
                      style={{ width: '130px', padding: '6px 10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,175,55,0.4)', color: 'var(--gold-primary)', borderRadius: '6px', fontWeight: 700, fontSize: '1.2rem', fontFamily: 'monospace', outline: 'none' }}
                    />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Suggested Retail: ₹{suggestedRetailTotal.toLocaleString('en-IN')}</div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ok)', letterSpacing: '0.5px', fontWeight: 'bold' }}>Your Studio Profit Margin</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ok)', fontFamily: 'monospace' }}>
                    +₹{studioProfit.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 600 }}>
                    {marginPct}% Profit Retained by Studio
                  </div>
                </div>
              </div>
            </div>

            {/* Itemized Specs Review */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem', fontSize: '13px' }}>
              <div style={{ fontWeight: 700, color: 'var(--paper)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Itemized Specifications</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', color: 'var(--text-secondary)' }}>
                <div><strong>Client:</strong> {formData.eventName} ({formData.eventType})</div>
                <div><strong>Event Date:</strong> {formData.eventDate}</div>
                <div><strong>Album:</strong> {sizeObj.name}</div>
                <div><strong>Sheets:</strong> {formData.sheetsCount} sheets ({sheetObj.name})</div>
                <div><strong>Cover:</strong> {coverObj.name}</div>
                <div><strong>White-Label:</strong> {formData.isWhiteLabel ? `Yes (Deboss: ${formData.studioDebossName || 'Studio'})` : 'No'}</div>
                <div><strong>SLA Guarantee:</strong> <span style={{ color: 'var(--ok)', fontWeight: 'bold' }}>⚡ 48-Hour Rapid Dispatch</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {step > 1 ? (
            <button 
              type="button" 
              className="btn-outline" 
              onClick={handlePrev} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.75rem 1.5rem', cursor: 'pointer', borderRadius: '8px', fontSize: '13px' }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}
          
          {step < 5 ? (
            <button 
              type="button" 
              className="liquid-btn" 
              onClick={handleNext} 
              disabled={nextDisabled()} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.75rem 2rem', opacity: nextDisabled() ? 0.4 : 1, cursor: nextDisabled() ? 'not-allowed' : 'pointer', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}
            >
              <span>Continue</span>
              <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              type="button" 
              className="liquid-btn" 
              onClick={handleSubmit} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.85rem 2.25rem', fontSize: '14px', fontWeight: 'bold', borderRadius: '8px', boxShadow: '0 0 25px rgba(212,175,55,0.4)', cursor: 'pointer' }}
            >
              <CheckCircle size={18} />
              <span>Confirm & Send to Lab</span>
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes uiaFadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <Toast message={toast?.msg} tone={toast?.tone} onDone={() => setToast(null)} />
    </div>
  );
};

export default SubmitJob;
