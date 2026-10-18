import React, { useState } from 'react';
import { 
  BookOpen, Video, Flag, Package, Sparkles, Plus, Trash2, 
  Save, Check, AlertCircle, TrendingUp, IndianRupee, Layers,
  Scissors, Eye, ShieldCheck, CheckCircle2, Clock
} from 'lucide-react';

export default function HubCatalogEditor({ adminState }) {
  const { content, updateGlobal, setContent, saveContent, isDirty, saving } = adminState;
  const [activeTab, setActiveTab] = useState('sizes'); // 'sizes' | 'sheets' | 'photo' | 'video' | 'flex' | 'bundles'
  const [sizeOrientationFilter, setSizeOrientationFilter] = useState('all'); // 'all' | 'landscape' | 'portrait'
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch or initialize catalog from content
  const catalog = content?.global?.servicesCatalog || content?.servicesCatalog || {
    photoEditing: [],
    videoEditing: [],
    albumPrinting: { sheetStyles: [], albumSizes: [], coverFinishes: [] },
    invitationsAndFlex: [],
    bundles: []
  };

  const albumSizes = catalog.albumPrinting?.albumSizes || [];
  const sheetStyles = catalog.albumPrinting?.sheetStyles || [];
  const photoEditing = catalog.photoEditing || [];
  const videoEditing = catalog.videoEditing || [];
  const invitationsAndFlex = catalog.invitationsAndFlex || [];
  const bundles = catalog.bundles || [];

  const handleCatalogUpdate = (newCatalog) => {
    updateGlobal('servicesCatalog', newCatalog);
    if (setContent && content) {
      setContent({
        ...content,
        servicesCatalog: newCatalog,
        global: {
          ...(content.global || {}),
          servicesCatalog: newCatalog
        }
      });
    }
  };

  // ----------------------------------------------------
  // ALBUM SIZES ACTIONS
  // ----------------------------------------------------
  const updateAlbumSize = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.albumPrinting) updated.albumPrinting = {};
    if (!updated.albumPrinting.albumSizes) updated.albumPrinting.albumSizes = [];
    
    updated.albumPrinting.albumSizes[index][field] = value;
    
    // Auto-compute badges
    if (field === 'clientPricePerSheet') {
      updated.albumPrinting.albumSizes[index].clientPriceBadge = `₹${value} / sheet`;
    }
    if (field === 'wholesalePerSheet') {
      updated.albumPrinting.albumSizes[index].studioPriceBadge = `₹${value} / sheet (Wholesale)`;
    }
    handleCatalogUpdate(updated);
  };

  const addAlbumSize = (orientation = 'landscape') => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.albumPrinting) updated.albumPrinting = {};
    if (!updated.albumPrinting.albumSizes) updated.albumPrinting.albumSizes = [];

    const newSize = {
      id: `size-custom-${Date.now()}`,
      title: orientation === 'landscape' ? '12×36 New Landscape Size' : '18×12 New Portrait Size',
      dimensions: orientation === 'landscape' ? '12×36 inches' : '18×12 inches',
      openSpread: orientation === 'landscape' ? '12×36 inches' : '18×12 inches',
      orientation: orientation,
      clientPricePerSheet: orientation === 'landscape' ? 260 : 245,
      wholesalePerSheet: orientation === 'landscape' ? 180 : 170,
      clientBasePrice: orientation === 'landscape' ? 9500 : 9000,
      studioBasePrice: orientation === 'landscape' ? 6500 : 6150,
      defaultSheets: 30,
      coverChargeRetail: 1700,
      coverChargeStudio: 1100,
      turnaround: '2-3 Working Days',
      badge: 'New Size',
      popular: false
    };

    updated.albumPrinting.albumSizes.push(newSize);
    handleCatalogUpdate(updated);
  };

  const deleteAlbumSize = (index) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.albumPrinting?.albumSizes) return;
    updated.albumPrinting.albumSizes.splice(index, 1);
    handleCatalogUpdate(updated);
  };

  // ----------------------------------------------------
  // SHEET STYLES ACTIONS
  // ----------------------------------------------------
  const updateSheetStyle = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.albumPrinting) updated.albumPrinting = {};
    if (!updated.albumPrinting.sheetStyles) updated.albumPrinting.sheetStyles = [];
    
    updated.albumPrinting.sheetStyles[index][field] = value;
    if (field === 'clientPricePerSheet') {
      updated.albumPrinting.sheetStyles[index].clientPriceBadge = `₹${value} / sheet`;
    }
    if (field === 'studioPricePerSheet') {
      updated.albumPrinting.sheetStyles[index].studioPriceBadge = `₹${value} / sheet (Trade)`;
    }
    handleCatalogUpdate(updated);
  };

  const addSheetStyle = () => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.albumPrinting) updated.albumPrinting = {};
    if (!updated.albumPrinting.sheetStyles) updated.albumPrinting.sheetStyles = [];

    const newSheet = {
      id: `sheet-custom-${Date.now()}`,
      title: 'New Luxury Sheet Style',
      telugu: 'కొత్త లగ్జరీ షీట్',
      clientPricePerSheet: 50,
      studioPricePerSheet: 30,
      gsm: '300 GSM',
      waterResistance: '100% Waterproof Archival',
      color: '#eab308',
      bestFor: 'Bridal ceremonies & portrait spreads'
    };
    updated.albumPrinting.sheetStyles.push(newSheet);
    handleCatalogUpdate(updated);
  };

  const deleteSheetStyle = (index) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.albumPrinting?.sheetStyles) return;
    updated.albumPrinting.sheetStyles.splice(index, 1);
    handleCatalogUpdate(updated);
  };

  // ----------------------------------------------------
  // PHOTO EDITING ACTIONS
  // ----------------------------------------------------
  const updatePhotoService = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.photoEditing) updated.photoEditing = [];
    updated.photoEditing[index][field] = value;
    handleCatalogUpdate(updated);
  };

  const addPhotoService = () => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.photoEditing) updated.photoEditing = [];
    updated.photoEditing.push({
      id: `photo-${Date.now()}`,
      title: 'New Photo Retouching Tier',
      telugu: 'ఫొటో ఎడిటింగ్ సర్వీస్',
      clientPrice: 2500,
      studioPrice: 1500,
      turnaround: '48 Hours',
      unit: 'per 100 photos'
    });
    handleCatalogUpdate(updated);
  };

  const deletePhotoService = (index) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.photoEditing) return;
    updated.photoEditing.splice(index, 1);
    handleCatalogUpdate(updated);
  };

  // ----------------------------------------------------
  // VIDEO EDITING ACTIONS
  // ----------------------------------------------------
  const updateVideoService = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.videoEditing) updated.videoEditing = [];
    updated.videoEditing[index][field] = value;
    handleCatalogUpdate(updated);
  };

  const addVideoService = () => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.videoEditing) updated.videoEditing = [];
    updated.videoEditing.push({
      id: `video-${Date.now()}`,
      title: 'New Video Edit Package',
      clientPrice: 5000,
      studioPrice: 3200,
      turnaround: '72 Hours',
      deliverables: 'Cinematic color grading & audio sync'
    });
    handleCatalogUpdate(updated);
  };

  const deleteVideoService = (index) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.videoEditing) return;
    updated.videoEditing.splice(index, 1);
    handleCatalogUpdate(updated);
  };

  // ----------------------------------------------------
  // FLEX & INVITES ACTIONS
  // ----------------------------------------------------
  const updateFlexItem = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.invitationsAndFlex) updated.invitationsAndFlex = [];
    updated.invitationsAndFlex[index][field] = value;
    handleCatalogUpdate(updated);
  };

  const addFlexItem = () => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.invitationsAndFlex) updated.invitationsAndFlex = [];
    updated.invitationsAndFlex.push({
      id: `flex-${Date.now()}`,
      title: 'New Flex / Invitation Item',
      clientPrice: 1500,
      studioPrice: 850,
      turnaround: '24 Hours'
    });
    handleCatalogUpdate(updated);
  };

  const deleteFlexItem = (index) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.invitationsAndFlex) return;
    updated.invitationsAndFlex.splice(index, 1);
    handleCatalogUpdate(updated);
  };

  // ----------------------------------------------------
  // SAVE ACTION
  // ----------------------------------------------------
  const handleSaveNow = async () => {
    const ok = await saveContent();
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  // Filtered Album Sizes
  const filteredAlbumSizes = albumSizes.map((s, originalIdx) => ({ ...s, originalIdx })).filter(s => {
    if (sizeOrientationFilter === 'all') return true;
    return s.orientation === sizeOrientationFilter;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 99, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: 'var(--warn)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            <Sparkles size={12} />
            <span>Storefront & B2B Master Catalog Engine</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--paper)', margin: 0 }}>
            Services, Indian Sizes & Per-Sheet Pricing Management
          </h1>
          <p style={{ fontSize: 13, color: 'var(--n-400)', margin: '4px 0 0 0' }}>
            Configure client retail and studio wholesale per-sheet rates. Synchronized live across Storefront (client) & Studio Portal (b2b-portal).
          </p>
        </div>

        {/* Global Save Button */}
        <button
          onClick={handleSaveNow}
          disabled={!isDirty || saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 10, border: 'none',
            background: isDirty && !saving ? 'linear-gradient(135deg, var(--warn), #d97706)' : 'rgba(255,255,255,0.06)',
            color: isDirty && !saving ? '#000' : 'rgba(255,255,255,0.3)',
            fontWeight: 800, fontSize: 14, cursor: isDirty && !saving ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s', boxShadow: isDirty && !saving ? '0 4px 20px rgba(245,158,11,0.4)' : 'none'
          }}
        >
          {saving ? (
            <span>Publishing to Storefront…</span>
          ) : saveSuccess ? (
            <>
              <Check size={18} /> <span>Published & Live!</span>
            </>
          ) : (
            <>
              <Save size={18} /> <span>{isDirty ? 'Publish Changes Live' : 'All Catalog Changes Live'}</span>
            </>
          )}
        </button>
      </div>

      {/* Info Banner */}
      <div style={{
        display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px',
        marginBottom: 20, borderRadius: 12,
        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)'
      }}>
        <AlertCircle size={18} style={{ color: 'var(--warn)', flexShrink: 0 }} />
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--n-200)' }}>
          <strong>Per-Sheet Pricing Formula Active:</strong> Indian labs calculate album cost as 
          <code> Total = (Sheets × PerSheetPrice) + CoverCharge</code>. When you edit per-sheet or cover prices here, 
          both the customer Storefront (Shop / Estimator / Booking) and Studio Portal (B2B Rates / Job Submission) update immediately.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12, marginBottom: 24, overflowX: 'auto' }}>
        {[
          { id: 'sizes', label: `📐 Album Sizes & Per-Sheet (${albumSizes.length})` },
          { id: 'sheets', label: `✨ Luxury Sheet Substrates (${sheetStyles.length})` },
          { id: 'photo', label: `🎨 Photo Editing & Turnkey (${photoEditing.length})` },
          { id: 'video', label: `🎬 4K Video Post-Production (${videoEditing.length})` },
          { id: 'flex', label: `💌 WhatsApp Invites & Flex (${invitationsAndFlex.length})` },
          { id: 'bundles', label: `📦 Bundles & Suites (${bundles.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 18px', borderRadius: 8, border: 'none',
              background: activeTab === t.id ? 'rgba(245,158,11,0.18)' : 'transparent',
              color: activeTab === t.id ? 'var(--warn)' : 'var(--n-400)',
              fontWeight: activeTab === t.id ? 700 : 500,
              fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
              borderBottom: activeTab === t.id ? '2px solid var(--warn)' : '2px solid transparent'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INDIAN ALBUM SIZES (LANDSCAPE & PORTRAIT)                          */}
      {/* ========================================================================= */}
      {activeTab === 'sizes' && (
        <div>
          {/* Sub-Header Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            {/* Orientation Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--n-400)', textTransform: 'uppercase', fontWeight: 600 }}>Filter Orientation:</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { id: 'all', label: `All Sizes (${albumSizes.length})` },
                  { id: 'landscape', label: `↔️ Landscape (${albumSizes.filter(s => s.orientation === 'landscape').length})` },
                  { id: 'portrait', label: `↕️ Portrait (${albumSizes.filter(s => s.orientation === 'portrait').length})` }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSizeOrientationFilter(f.id)}
                    style={{
                      padding: '6px 12px', borderRadius: 6,
                      border: sizeOrientationFilter === f.id ? '1px solid var(--warn)' : '1px solid rgba(255,255,255,0.1)',
                      background: sizeOrientationFilter === f.id ? 'rgba(245,158,11,0.2)' : 'transparent',
                      color: sizeOrientationFilter === f.id ? 'var(--warn)' : 'var(--n-400)',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Size Buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => addAlbumSize('landscape')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(56,189,248,0.4)',
                  background: 'rgba(56,189,248,0.1)', color: '#38bdf8',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer'
                }}
              >
                <Plus size={14} /> Add Landscape Size (↔️)
              </button>
              <button
                onClick={() => addAlbumSize('portrait')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(236,72,153,0.4)',
                  background: 'rgba(236,72,153,0.1)', color: '#ec4899',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer'
                }}
              >
                <Plus size={14} /> Add Portrait Size (↕️)
              </button>
            </div>
          </div>

          {/* Sizes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 18 }}>
            {filteredAlbumSizes.map((size) => {
              const idx = size.originalIdx;
              const retailPerSheet = Number(size.clientPricePerSheet || 260);
              const wholesalePerSheet = Number(size.wholesalePerSheet || 180);
              const marginPerSheet = retailPerSheet - wholesalePerSheet;
              const defaultSheets = Number(size.defaultSheets || 30);
              const retail30Sheet = (defaultSheets * retailPerSheet) + Number(size.coverChargeRetail || 1700);
              const wholesale30Sheet = (defaultSheets * wholesalePerSheet) + Number(size.coverChargeStudio || 1100);
              const totalMargin = retail30Sheet - wholesale30Sheet;

              return (
                <div key={size.id || idx} style={{ background: 'var(--n-950)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18, position: 'relative' }}>
                  
                  {/* Top Bar with Orientation & Delete */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <span style={{ 
                        fontSize: 11, padding: '2px 8px', borderRadius: 4, 
                        background: size.orientation === 'landscape' ? 'rgba(56,189,248,0.15)' : 'rgba(236,72,153,0.15)', 
                        color: size.orientation === 'landscape' ? '#38bdf8' : '#ec4899', 
                        fontWeight: 700, textTransform: 'uppercase', marginRight: 8 
                      }}>
                        {size.orientation === 'landscape' ? '↔️ Landscape' : '↕️ Portrait'}
                      </span>
                      {size.popular && (
                        <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.2)', color: 'var(--warn)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                          ⭐ POPULAR
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => deleteAlbumSize(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4, opacity: 0.7 }}
                      title="Delete this album size"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Size Title & Dimensions Input */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>Size Title</label>
                    <input
                      type="text"
                      value={size.title || ''}
                      onChange={e => updateAlbumSize(idx, 'title', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--paper)', fontSize: 13, fontWeight: 600, boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Open Panoramic Spread Dimensions */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Spread Dimensions (inches / cm)</label>
                    <input
                      type="text"
                      value={size.dimensions || size.openSpread || ''}
                      onChange={e => {
                        updateAlbumSize(idx, 'dimensions', e.target.value);
                        updateAlbumSize(idx, 'openSpread', e.target.value);
                      }}
                      style={{ width: '100%', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--paper)', fontSize: 12, boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* CRITICAL: PER-SHEET DUAL PRICING GRID */}
                  <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--warn)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>
                      ⭐ Exact Per-Sheet Pricing Formula
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, color: 'var(--warn)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                          Retail (₹ / Sheet)
                        </label>
                        <input
                          type="number"
                          value={size.clientPricePerSheet || 0}
                          onChange={e => updateAlbumSize(idx, 'clientPricePerSheet', Number(e.target.value))}
                          style={{ width: '100%', padding: '7px 10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, color: 'var(--paper)', fontSize: 14, fontWeight: 800, boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, color: '#38bdf8', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                          Studio Wholesale (₹ / Sheet)
                        </label>
                        <input
                          type="number"
                          value={size.wholesalePerSheet || 0}
                          onChange={e => updateAlbumSize(idx, 'wholesalePerSheet', Number(e.target.value))}
                          style={{ width: '100%', padding: '7px 10px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 6, color: 'var(--paper)', fontSize: 14, fontWeight: 800, boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#34d399', fontWeight: 600 }}>
                      <span>Per-Sheet Studio Margin:</span>
                      <span>+₹{marginPerSheet} / sheet</span>
                    </div>
                  </div>

                  {/* Cover Charge Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>
                        Retail Cover Charge (₹)
                      </label>
                      <input
                        type="number"
                        value={size.coverChargeRetail || 0}
                        onChange={e => updateAlbumSize(idx, 'coverChargeRetail', Number(e.target.value))}
                        style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'var(--paper)', fontSize: 12, boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>
                        Studio Cover Charge (₹)
                      </label>
                      <input
                        type="number"
                        value={size.coverChargeStudio || 0}
                        onChange={e => updateAlbumSize(idx, 'coverChargeStudio', Number(e.target.value))}
                        style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'var(--paper)', fontSize: 12, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* Selectable Sheets Configuration (Up to 150 Sheets) */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 8, padding: 10, marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: 'var(--warn)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
                      📚 Sheets Range Selection (Up to 150 Sheets)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 9, color: 'var(--n-400)', marginBottom: 2 }}>Min Sheets</label>
                        <input
                          type="number"
                          value={size.minSheets || 20}
                          onChange={e => updateAlbumSize(idx, 'minSheets', Number(e.target.value))}
                          style={{ width: '100%', padding: '4px 6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, color: 'var(--paper)', fontSize: 12, boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 9, color: 'var(--n-400)', marginBottom: 2 }}>Base Included</label>
                        <input
                          type="number"
                          value={size.defaultSheets || 30}
                          onChange={e => updateAlbumSize(idx, 'defaultSheets', Number(e.target.value))}
                          style={{ width: '100%', padding: '4px 6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, color: 'var(--paper)', fontSize: 12, boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 9, color: 'var(--warn)', fontWeight: 700, marginBottom: 2 }}>Max (Up to 150)</label>
                        <input
                          type="number"
                          value={size.maxSheets || 150}
                          onChange={e => updateAlbumSize(idx, 'maxSheets', Number(e.target.value))}
                          style={{ width: '100%', padding: '4px 6px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 4, color: 'var(--warn)', fontSize: 12, fontWeight: 800, boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Turnaround & Popular Flag */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="checkbox"
                        id={`pop-${idx}`}
                        checked={Boolean(size.popular)}
                        onChange={e => updateAlbumSize(idx, 'popular', e.target.checked)}
                        style={{ cursor: 'pointer', accentColor: 'var(--warn)' }}
                      />
                      <label htmlFor={`pop-${idx}`} style={{ fontSize: 11, color: 'var(--n-300)', cursor: 'pointer' }}>Feature as Bestseller</label>
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--n-400)' }}>
                      Standard 30-Sh Total: <strong style={{ color: 'var(--warn)' }}>₹{retail30Sheet.toLocaleString('en-IN')}</strong> (Trade: ₹{wholesale30Sheet.toLocaleString('en-IN')})
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LUXURY SHEET SUBSTRATES                                            */}
      {/* ========================================================================= */}
      {activeTab === 'sheets' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--n-400)' }}>Configure add-on per-sheet upgrade charges for luxury archival finishes.</p>
            <button
              onClick={addSheetStyle}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', background: 'var(--warn)', color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Luxury Sheet Finish
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {sheetStyles.map((sheet, idx) => {
              const retailRate = Number(sheet.clientPricePerSheet || 0);
              const studioRate = Number(sheet.studioPricePerSheet || 0);

              return (
                <div key={sheet.id || idx} style={{ background: 'var(--n-950)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 14, height: 14, borderRadius: '50%', background: sheet.color || 'var(--brand)', display: 'inline-block' }} />
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--paper)' }}>{sheet.title}</span>
                    </div>
                    <button onClick={() => deleteSheetStyle(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: 'var(--warn)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Retail (₹ / sheet)</label>
                      <input
                        type="number"
                        value={sheet.clientPricePerSheet || 0}
                        onChange={e => updateSheetStyle(idx, 'clientPricePerSheet', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#38bdf8', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Studio Trade (₹ / sheet)</label>
                      <input
                        type="number"
                        value={sheet.studioPricePerSheet || 0}
                        onChange={e => updateSheetStyle(idx, 'studioPricePerSheet', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 10px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Paper Weight & Core</label>
                    <input
                      type="text"
                      value={sheet.gsm || ''}
                      onChange={e => updateSheetStyle(idx, 'gsm', e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--paper)', fontSize: 12, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PHOTO EDITING & TURNKEY SUITES                                     */}
      {/* ========================================================================= */}
      {activeTab === 'photo' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--n-400)' }}>Configure RAW culling, Telugu skin retouching, and Karizma PSD layout services.</p>
            <button
              onClick={addPhotoService}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', background: 'var(--warn)', color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Photo Service
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {photoEditing.map((p, idx) => (
              <div key={p.id || idx} style={{ background: 'var(--n-950)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <input
                    type="text"
                    value={p.title || ''}
                    onChange={e => updatePhotoService(idx, 'title', e.target.value)}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'var(--paper)', fontSize: 15, fontWeight: 700, width: '80%' }}
                  />
                  <button onClick={() => deletePhotoService(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--warn)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Client Retail (₹)</label>
                    <input
                      type="number"
                      value={p.clientPrice || 0}
                      onChange={e => updatePhotoService(idx, 'clientPrice', Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#38bdf8', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Studio Trade (₹)</label>
                    <input
                      type="number"
                      value={p.studioPrice || 0}
                      onChange={e => updatePhotoService(idx, 'studioPrice', Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 10px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Turnaround SLA</label>
                  <input
                    type="text"
                    value={p.turnaround || ''}
                    onChange={e => updatePhotoService(idx, 'turnaround', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--n-300)', fontSize: 12, boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VIDEO EDITING FOR ALL EVENTS                                       */}
      {/* ========================================================================= */}
      {activeTab === 'video' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--n-400)' }}>Configure Reels, 4K Teasers, Traditional films, and Same-Day Edits.</p>
            <button
              onClick={addVideoService}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', background: 'var(--warn)', color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Video Package
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {videoEditing.map((v, idx) => (
              <div key={v.id || idx} style={{ background: 'var(--n-950)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <input
                    type="text"
                    value={v.title || ''}
                    onChange={e => updateVideoService(idx, 'title', e.target.value)}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'var(--paper)', fontSize: 14, fontWeight: 700, width: '80%' }}
                  />
                  <button onClick={() => deleteVideoService(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--warn)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Client Retail (₹)</label>
                    <input
                      type="number"
                      value={v.clientPrice || 0}
                      onChange={e => updateVideoService(idx, 'clientPrice', Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#38bdf8', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Studio Trade (₹)</label>
                    <input
                      type="number"
                      value={v.studioPrice || 0}
                      onChange={e => updateVideoService(idx, 'studioPrice', Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 10px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Turnaround SLA</label>
                  <input
                    type="text"
                    value={v.turnaround || ''}
                    onChange={e => updateVideoService(idx, 'turnaround', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--n-300)', fontSize: 12, boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: WHATSAPP VIDEO INVITES & MANDAP FLEX                               */}
      {/* ========================================================================= */}
      {activeTab === 'flex' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--n-400)' }}>Configure WhatsApp 4K invitations, roll-up standees, and mandap banners.</p>
            <button
              onClick={addFlexItem}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: 'none', background: 'var(--warn)', color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              <Plus size={14} /> Add Flex / Invite Item
            </button>
          </div>

          {/* Custom Size Dimension Rate Configuration */}
          <div style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4ade80', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
              <Sparkles size={16} /> Interactive Custom Dimension Sizing Engine (Per Sq.Ft Rates)
            </div>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--n-300)', marginBottom: 12 }}>
              When customers enter custom Width (ft) × Height (ft) on the store, these live rates per square foot are dynamically calculated.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--warn)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                  Client Retail Rate (₹ / sq.ft)
                </label>
                <input
                  type="number"
                  value={catalog.ratePerSqFtClient || 30}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(catalog));
                    updated.ratePerSqFtClient = Number(e.target.value);
                    handleCatalogUpdate(updated);
                  }}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#38bdf8', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                  Studio Wholesale Rate (₹ / sq.ft)
                </label>
                <input
                  type="number"
                  value={catalog.ratePerSqFtStudio || 18}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(catalog));
                    updated.ratePerSqFtStudio = Number(e.target.value);
                    handleCatalogUpdate(updated);
                  }}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {invitationsAndFlex.map((f, idx) => (
              <div key={f.id || idx} style={{ background: 'var(--n-950)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <input
                    type="text"
                    value={f.title || ''}
                    onChange={e => updateFlexItem(idx, 'title', e.target.value)}
                    style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'var(--paper)', fontSize: 14, fontWeight: 700, width: '80%' }}
                  />
                  <button onClick={() => deleteFlexItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--warn)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Client Retail (₹)</label>
                    <input
                      type="number"
                      value={f.clientPrice || 0}
                      onChange={e => updateFlexItem(idx, 'clientPrice', Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#38bdf8', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Studio Trade (₹)</label>
                    <input
                      type="number"
                      value={f.studioPrice || 0}
                      onChange={e => updateFlexItem(idx, 'studioPrice', Number(e.target.value))}
                      style={{ width: '100%', padding: '8px 10px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Turnaround</label>
                  <input
                    type="text"
                    value={f.turnaround || ''}
                    onChange={e => updateFlexItem(idx, 'turnaround', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--n-300)', fontSize: 12, boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: TURNKEY BUNDLES & PACKAGES                                         */}
      {/* ========================================================================= */}
      {activeTab === 'bundles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
          {bundles.map((b, idx) => (
            <div key={b.id || idx} style={{ background: 'var(--n-950)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--paper)' }}>{b.title}</span>
                <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.2)', color: 'var(--warn)', padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>
                  {b.badge}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--n-400)', lineHeight: 1.5, marginBottom: 12 }}>{b.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {b.inclusions?.map((inc, iIdx) => (
                  <div key={iIdx} style={{ fontSize: 11, color: 'var(--n-300)', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ color: 'var(--warn)' }}>✓</span> <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
