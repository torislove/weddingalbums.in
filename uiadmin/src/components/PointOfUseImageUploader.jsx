import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Link as LinkIcon, X, Check, Loader2 } from 'lucide-react';
import { API } from '../apiConfig';

const PRESET_ALBUM_IMAGES = [
  { url: '/images/weddingalbums-layflat-album.png', label: '12×36 Layflat Mandap' },
  { url: '/images/luxury-album-craftsmanship.jpg', label: 'Craftsmanship Spread' },
  { url: '/images/weddingalbums-talambralu.png', label: 'Talambralu Emotion' },
  { url: '/images/prewedding.jpg', label: 'Pre-Wedding Sunset' },
  { url: '/images/saptapadi.png', label: 'Saptapadi Sacred Phera' },
  { url: '/images/mangalya-dharana.png', label: 'Mangalya Dharana' },
  { url: '/images/bride-polished.jpg', label: 'Bride 24K Jewelry' },
  { url: '/images/bridal.jpg', label: 'Bridal Kanjeevaram' },
  { url: '/images/cover-acrylic-3d.jpg', label: '4mm 3D Acrylic Glass Cover' },
  { url: '/images/cover-royal-velvet.jpg', label: 'Royal Velvet & 24K Gold Foil' },
  { url: '/images/cover-leatherette-box.jpg', label: 'Italian Leatherette & Box' }
];

export default function PointOfUseImageUploader({
  imageUrl,
  onImageChange,
  alt = 'Product Image',
  height = 160
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // 1. Direct Local File Upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const token = localStorage.getItem('uiadminToken') || localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onImageChange(data.url);
          setShowModal(false);
          setUploading(false);
          return;
        }
      }
      throw new Error('Upload API returned non-200');
    } catch {
      // Offline/Local fallback: Read as high-res base64 data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageChange(event.target.result);
          setShowModal(false);
        }
        setUploading(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read image file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (customUrl.trim()) {
      onImageChange(customUrl.trim());
      setCustomUrl('');
      setShowModal(false);
    }
  };

  return (
    <div 
      style={{ position: 'relative', height, width: '100%', background: '#0e0e14', overflow: 'hidden' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Target Image */}
      <img
        src={imageUrl || '/images/weddingalbums-layflat-album.png'}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,18,26,0.9) 0%, transparent 60%)' }} />

      {/* Point-of-Use Upload Trigger Bar */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isHovered ? 'rgba(0,0,0,0.65)' : 'transparent',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '8px', opacity: isHovered ? 1 : 0, transition: 'all 0.2s', zIndex: 10
      }}>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--gold-primary, #d4af37)', color: '#000',
            border: 'none', borderRadius: '8px', padding: '8px 14px',
            fontSize: '12px', fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(212,175,55,0.4)'
          }}
        >
          <UploadCloud size={14} /> Edit / Upload Image
        </button>
        <span style={{ fontSize: '10px', color: '#e4e4e7', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
          Click to replace image at this point
        </span>
      </div>

      {/* Point-of-Use Modal Popover */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            background: '#12121a', border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '24px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.8)', position: 'relative'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={20} color="var(--gold-primary)" />
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}>
                  Point-of-Use Image Selector & Uploader
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Option 1: Upload from Computer */}
            <div style={{
              background: 'rgba(212, 175, 55, 0.05)', border: '1px dashed rgba(212, 175, 55, 0.3)',
              borderRadius: '12px', padding: '16px', textAlign: 'center', marginBottom: '16px'
            }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, #d4af37, #b8860b)', color: '#000',
                  border: 'none', borderRadius: '8px', padding: '10px 20px',
                  fontWeight: 800, fontSize: '0.9rem', cursor: uploading ? 'wait' : 'pointer'
                }}
              >
                {uploading ? <Loader2 size={16} className="spin" /> : <UploadCloud size={16} />}
                {uploading ? 'Processing Image...' : '📁 Upload Image From Computer'}
              </button>
              <div style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '6px' }}>
                Supports JPG, PNG, WebP up to 50MB. Uploads directly into this product card.
              </div>
              {uploadError && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '6px' }}>{uploadError}</div>}
            </div>

            {/* Option 2: Curated Stock Presets */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Or Select from Archival Presets:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                {PRESET_ALBUM_IMAGES.map((preset, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => {
                      onImageChange(preset.url);
                      setShowModal(false);
                    }}
                    style={{
                      cursor: 'pointer', borderRadius: '8px', overflow: 'hidden',
                      border: imageUrl === preset.url ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                      position: 'relative', height: '65px'
                    }}
                    title={preset.label}
                  >
                    <img src={preset.url} alt={preset.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '9px',
                      padding: '2px 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {preset.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Option 3: Direct URL Paste */}
            <div>
              <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Or Paste Image Web Link:
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  placeholder="https://example.com/album-image.jpg"
                  value={customUrl}
                  onChange={e => setCustomUrl(e.target.value)}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px', color: '#fff', padding: '8px 12px', fontSize: '0.85rem'
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  style={{
                    background: 'rgba(212,175,55,0.2)', border: '1px solid var(--gold-primary)',
                    color: 'var(--gold-primary)', borderRadius: '8px', padding: '8px 14px',
                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
