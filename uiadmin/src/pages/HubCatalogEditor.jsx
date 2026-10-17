import React, { useState } from 'react';
import { 
  BookOpen, Video, Flag, Package, Sparkles, Plus, Trash2, 
  Save, Check, AlertCircle, TrendingUp, IndianRupee, Layers
} from 'lucide-react';

export default function HubCatalogEditor({ adminState }) {
  const { content, updateGlobal, saveContent, isDirty, saving } = adminState;
  const [activeTab, setActiveTab] = useState('sheets'); // 'sheets' | 'sizes' | 'video' | 'flex' | 'bundles'
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch or initialize catalog from content
  const catalog = content?.global?.servicesCatalog || content?.servicesCatalog || {
    photoEditing: [],
    videoEditing: [],
    albumPrinting: { sheetStyles: [], albumSizes: [], coverFinishes: [] },
    invitationsAndFlex: [],
    bundles: []
  };

  const handleCatalogUpdate = (newCatalog) => {
    updateGlobal('servicesCatalog', newCatalog);
  };

  // Helper updaters
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

  const updateAlbumSize = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.albumPrinting) updated.albumPrinting = {};
    if (!updated.albumPrinting.albumSizes) updated.albumPrinting.albumSizes = [];
    
    updated.albumPrinting.albumSizes[index][field] = value;
    if (field === 'clientBasePrice') {
      updated.albumPrinting.albumSizes[index].clientPriceBadge = `₹${Number(value).toLocaleString('en-IN')}`;
    }
    if (field === 'studioBasePrice') {
      updated.albumPrinting.albumSizes[index].studioPriceBadge = `₹${Number(value).toLocaleString('en-IN')} (Trade Wholesale)`;
    }
    handleCatalogUpdate(updated);
  };

  const updateVideoService = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.videoEditing) updated.videoEditing = [];
    
    updated.videoEditing[index][field] = value;
    if (field === 'clientPrice') {
      updated.videoEditing[index].clientPriceBadge = `from ₹${Number(value).toLocaleString('en-IN')}`;
    }
    if (field === 'studioPrice') {
      updated.videoEditing[index].studioPriceBadge = `from ₹${Number(value).toLocaleString('en-IN')} (Trade)`;
    }
    handleCatalogUpdate(updated);
  };

  const updateFlexItem = (index, field, value) => {
    const updated = JSON.parse(JSON.stringify(catalog));
    if (!updated.invitationsAndFlex) updated.invitationsAndFlex = [];
    
    updated.invitationsAndFlex[index][field] = value;
    if (field === 'clientPrice') {
      updated.invitationsAndFlex[index].clientPriceBadge = `from ₹${Number(value).toLocaleString('en-IN')}`;
    }
    if (field === 'studioPrice') {
      updated.invitationsAndFlex[index].studioPriceBadge = `from ₹${Number(value).toLocaleString('en-IN')} (Trade)`;
    }
    handleCatalogUpdate(updated);
  };

  const handleSaveNow = async () => {
    const ok = await saveContent();
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1360px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 99, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: 'var(--warn)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            <Sparkles size={12} />
            <span>Post-Production Hub Pricing Engine</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--paper)', margin: 0 }}>
            Hub Services, Sheet Styles & Indian Market Sizes
          </h1>
          <p style={{ fontSize: 13, color: 'var(--n-400)', margin: '4px 0 0 0' }}>
            Configure client retail rates, studio wholesale rates, and orientation hierarchies synced live across all 5 portals.
          </p>
        </div>

        {/* Global Save Button */}
        <button
          onClick={handleSaveNow}
          disabled={!isDirty || saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10, border: 'none',
            background: isDirty && !saving ? 'linear-gradient(135deg, var(--warn), #d97706)' : 'rgba(255,255,255,0.06)',
            color: isDirty && !saving ? 'var(--n-1000)' : 'rgba(255,255,255,0.3)',
            fontWeight: 700, fontSize: 13, cursor: isDirty && !saving ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s', boxShadow: isDirty && !saving ? '0 4px 16px rgba(245,158,11,0.3)' : 'none'
          }}
        >
          {saving ? (
            <span>Publishing…</span>
          ) : saveSuccess ? (
            <>
              <Check size={16} /> <span>Published!</span>
            </>
          ) : (
            <>
              <Save size={16} /> <span>{isDirty ? 'Publish Changes' : 'All Changes Published'}</span>
            </>
          )}
        </button>
      </div>

      {/* Price ownership note — two admin surfaces can set these numbers */}
      <div style={{
        display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 13px',
        marginBottom: 18, borderRadius: 10,
        background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)'
      }}>
        <AlertCircle size={16} style={{ color: 'var(--warn)', flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: 'var(--n-300)' }}>
          <strong style={{ color: 'var(--warn)' }}>Two ways to set prices — you win.</strong> What you publish
          here (<strong>CMS Studio</strong>) is the live catalog the couple estimator reads, and your value
          is authoritative. <strong> SysAdmin → Pricing Engine</strong> builder rows can also set prices,
          but they only <em>fill items you have left blank</em> here — they never overwrite a CMS Studio
          price. Leave a field empty to let the SysAdmin engine price it.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12, marginBottom: 24, overflowX: 'auto' }}>
        {[
          { id: 'sheets', label: `✨ 6 Luxury Sheet Styles (${catalog.albumPrinting?.sheetStyles?.length || 6})` },
          { id: 'sizes', label: `📐 10 Indian Market Sizes (${catalog.albumPrinting?.albumSizes?.length || 10})` },
          { id: 'video', label: `🎥 4K Video Post-Production (${catalog.videoEditing?.length || 7})` },
          { id: 'flex', label: `💌 Invitations & Mandap Flex (${catalog.invitationsAndFlex?.length || 6})` },
          { id: 'bundles', label: `📦 Bundles & Retainers (${catalog.bundles?.length || 3})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: activeTab === t.id ? 'rgba(245,158,11,0.15)' : 'transparent',
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

      {/* TAB 1: LUXURY SHEET STYLES */}
      {activeTab === 'sheets' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {catalog.albumPrinting?.sheetStyles?.map((sheet, idx) => {
              const retailRate = Number(sheet.clientPricePerSheet || 110);
              const studioRate = Number(sheet.studioPricePerSheet || 70);
              const studioMargin = retailRate - studioRate;
              const marginPercent = Math.round((studioMargin / retailRate) * 100);

              return (
                <div key={sheet.id || idx} style={{ background: 'var(--n-950)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 14, height: 14, borderRadius: '50%', background: sheet.color || 'var(--brand)', display: 'inline-block' }} />
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--paper)' }}>{sheet.title}</span>
                    </div>
                    <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                      Studio Profit: ₹{studioMargin} ({marginPercent}%)
                    </span>
                  </div>

                  {/* Telugu Name */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Telugu Name</label>
                    <input
                      type="text"
                      value={sheet.telugu || ''}
                      onChange={e => updateSheetStyle(idx, 'telugu', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--paper)', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Dual Pricing Grid: Client vs Studio */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: 'var(--warn)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                        Client Retail (₹ / sheet)
                      </label>
                      <input
                        type="number"
                        value={sheet.clientPricePerSheet || 0}
                        onChange={e => updateSheetStyle(idx, 'clientPricePerSheet', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#38bdf8', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                        Studio Trade Wholesale (₹ / sheet)
                      </label>
                      <input
                        type="number"
                        value={sheet.studioPricePerSheet || 0}
                        onChange={e => updateSheetStyle(idx, 'studioPricePerSheet', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 10px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* GSM & Texture */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Paper Weight & Core</label>
                      <input
                        type="text"
                        value={sheet.gsm || ''}
                        onChange={e => updateSheetStyle(idx, 'gsm', e.target.value)}
                        style={{ width: '100%', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--paper)', fontSize: 12, boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Water Resistance</label>
                      <input
                        type="text"
                        value={sheet.waterResistance || ''}
                        onChange={e => updateSheetStyle(idx, 'waterResistance', e.target.value)}
                        style={{ width: '100%', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--paper)', fontSize: 12, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* Best For */}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Recommended Ritual / Moments</label>
                    <input
                      type="text"
                      value={sheet.bestFor || ''}
                      onChange={e => updateSheetStyle(idx, 'bestFor', e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--n-300)', fontSize: 12, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INDIAN MARKET ALBUM SIZES */}
      {activeTab === 'sizes' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {catalog.albumPrinting?.albumSizes?.map((size, idx) => {
              const retailBase = Number(size.clientBasePrice || 12500);
              const studioBase = Number(size.studioBasePrice || 7800);
              const studioMargin = retailBase - studioBase;
              const marginPercent = Math.round((studioMargin / retailBase) * 100);

              return (
                <div key={size.id || idx} style={{ background: 'var(--n-950)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--paper)' }}>{size.title}</span>
                      <span style={{ marginLeft: 8, fontSize: 10, background: 'rgba(245,158,11,0.15)', color: 'var(--warn)', padding: '1px 6px', borderRadius: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                        {size.orientation || 'landscape'}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                      Studio Profit: ₹{studioMargin.toLocaleString('en-IN')} ({marginPercent}%)
                    </span>
                  </div>

                  {/* Open Spread Dimensions */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Open Panoramic Spread</label>
                    <input
                      type="text"
                      value={size.openSpread || ''}
                      onChange={e => updateAlbumSize(idx, 'openSpread', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--paper)', fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>

                  {/* Dual Pricing Grid: Client Retail vs Studio Trade */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: 'var(--warn)', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                        Client Retail Base (₹)
                      </label>
                      <input
                        type="number"
                        value={size.clientBasePrice || 0}
                        onChange={e => updateAlbumSize(idx, 'clientBasePrice', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#38bdf8', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>
                        Studio Trade Base (₹)
                      </label>
                      <input
                        type="number"
                        value={size.studioBasePrice || 0}
                        onChange={e => updateAlbumSize(idx, 'studioBasePrice', Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 10px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 8, color: 'var(--paper)', fontSize: 14, fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {/* Orientation & Scale */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Orientation</label>
                      <select
                        value={size.orientation || 'landscape'}
                        onChange={e => updateAlbumSize(idx, 'orientation', e.target.value)}
                        style={{ width: '100%', padding: '7px 10px', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--paper)', fontSize: 12, boxSizing: 'border-box' }}
                      >
                        <option value="landscape">Landscape / Panoramic</option>
                        <option value="vertical">Royal Vertical / Portrait</option>
                        <option value="square">Square Format</option>
                        <option value="pocket">Parent Pocket Mini Book</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: 'var(--n-400)', marginBottom: 4, textTransform: 'uppercase' }}>Scale Category</label>
                      <select
                        value={size.scaleCategory || 'big'}
                        onChange={e => updateAlbumSize(idx, 'scaleCategory', e.target.value)}
                        style={{ width: '100%', padding: '7px 10px', background: '#1c1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--paper)', fontSize: 12, boxSizing: 'border-box' }}
                      >
                        <option value="big">Big / Grand Edition</option>
                        <option value="medium">Medium Standard</option>
                        <option value="small">Small / Compact</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: VIDEO POST-PRODUCTION */}
      {activeTab === 'video' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {catalog.videoEditing?.map((v, idx) => {
              const retailRate = Number(v.clientPrice || 6000);
              const studioRate = Number(v.studioPrice || 3800);
              const studioMargin = retailRate - studioRate;

              return (
                <div key={v.id || idx} style={{ background: 'var(--n-950)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--paper)' }}>{v.title}</span>
                    <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                      Studio Profit: ₹{studioMargin.toLocaleString('en-IN')}
                    </span>
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
                      <label style={{ display: 'block', fontSize: 11, color: '#38bdf8', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Studio Wholesale (₹)</label>
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
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: INVITATIONS & MANDAP FLEX */}
      {activeTab === 'flex' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {catalog.invitationsAndFlex?.map((f, idx) => {
              const retailRate = Number(f.clientPrice || 1800);
              const studioRate = Number(f.studioPrice || 950);
              const studioMargin = retailRate - studioRate;

              return (
                <div key={f.id || idx} style={{ background: 'var(--n-950)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--paper)' }}>{f.title}</span>
                    <span style={{ fontSize: 11, background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                      Studio Profit: ₹{studioMargin.toLocaleString('en-IN')}
                    </span>
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
                      <label style={{ display: 'block', fontSize: 11, color: '#38bdf8', marginBottom: 4, textTransform: 'uppercase', fontWeight: 700 }}>Studio Wholesale (₹)</label>
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
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: BUNDLES & PACKAGES */}
      {activeTab === 'bundles' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {catalog.bundles?.map((b, idx) => (
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
        </div>
      )}
    </div>
  );
}
