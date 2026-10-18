import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Video, Gift, Layers, ShoppingBag, 
  ArrowRight, Sparkles, Sliders, X, Flame, UploadCloud 
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import '../../pages/Shop.css';

const ALBUM_IMAGES = {
  'size-12x36': '/images/weddingalbums-layflat-album.png',
  'size-14x40': '/images/luxury-album-craftsmanship.jpg',
  'size-12x30': '/images/weddingalbums-talambralu.png',
  'size-10x30': '/images/prewedding.jpg',
  'size-15x30': '/images/saptapadi.png',
  'size-12x24': '/images/mangalya-dharana.png',
  'size-10x24': '/images/cover-acrylic-3d.jpg',
  'size-12x18': '/images/weddingalbums-layflat-album.png',
  'size-6x9': '/images/cover-leatherette-box.jpg',
  'size-18x12': '/images/bride-polished.jpg',
  'size-15x12': '/images/bridal.jpg',
  'size-14x11': '/images/bride-polished.jpg',
  'size-12x9': '/images/prewedding.jpg',
  'size-10x8': '/images/family-blessings.png',
  'size-8x12': '/images/cover-royal-velvet.jpg',
};

const SHEET_IMAGES = {
  'sheet-ntr-matte': '/images/weddingalbums-talambralu.png',
  'sheet-ntr-gloss': '/images/weddingalbums-layflat-album.png',
  'sheet-metallic-gold': '/images/cover-acrylic-3d.jpg',
  'sheet-royal-velvet': '/images/cover-royal-velvet.jpg',
  'sheet-pure-silk': '/images/cover-leatherette-box.jpg',
  'sheet-sparkle-glitter': '/images/cover-acrylic-3d.jpg',
  'sheet-fuji-dp2': '/images/luxury-album-craftsmanship.jpg',
};

const MASTER_COVERS = [
  { id: 'cover-matte', name: 'Scuff-Free Lay-Flat Matte', priceRetail: 0, desc: 'Included standard hardcover' },
  { id: 'cover-acrylic', name: '4mm Diamond Crystal Acrylic 3D Glass', priceRetail: 1500, desc: 'Beveled 3D crystal glass face' },
  { id: 'cover-velvet', name: 'Royal Velvet + 24K Gold Debossed Foil', priceRetail: 1200, desc: 'Ultra-luxury fabric with gold typography' },
  { id: 'cover-leatherette', name: 'Handcrafted Italian Leatherette + Box', priceRetail: 1800, desc: 'Magnetic briefcase presentation box' },
];

export default function InstantEstimator({
  eyebrow = '✦ DIRECT HEIRLOOM ALBUM STOREFRONT ✦',
  title = 'Wedding Albums & Media Collection',
  subtitle = 'Direct per-sheet pricing across all Indian Landscape & Portrait album formats. Choose your size, configure sheets and finishes, and add directly to your cart.',
  ctaText = 'Explore Full Storefront',
  ctaLink = '/shop'
}) {
  const { content } = useContent();
  const { lang } = useLanguage();
  const { addToCart, toggleCart } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'landscape' | 'portrait' | 'sheets' | 'video' | 'flex'

  // Configurator Modal State
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [sheets, setSheets] = useState(30);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedCover, setSelectedCover] = useState(MASTER_COVERS[0]);
  const [driveLink, setDriveLink] = useState('');
  const [instructions, setInstructions] = useState('');

  // Catalog
  const catalog = content?.global?.servicesCatalog || {};
  const albumSizes = catalog?.albumPrinting?.albumSizes || [];
  const sheetStyles = catalog?.albumPrinting?.sheetStyles || [];
  const videoServices = catalog?.videoEditing || [];
  const flexServices = catalog?.invitationsAndFlex || [];

  // Filtered albums based on tab
  const getFilteredAlbums = () => {
    if (activeTab === 'landscape') return albumSizes.filter(s => s.orientation === 'landscape');
    if (activeTab === 'portrait') return albumSizes.filter(s => s.orientation === 'portrait');
    if (activeTab === 'all') return albumSizes.slice(0, 8); // top 8 featured on showcase
    return [];
  };

  const openAlbumModal = (size) => {
    navigate(`/shop?size=${size.id}`);
  };

  const openServiceModal = (service, type) => {
    navigate(`/shop?tab=${type === 'video' ? 'video' : 'flex'}`);
  };

  const calculateConfiguredPrice = () => {
    if (!selectedAlbum) return 0;
    const baseRate = selectedAlbum.clientPricePerSheet || Math.round((selectedAlbum.clientBasePrice || 4500) / 30);
    const basePrice = selectedAlbum.clientBasePrice || (baseRate * 30);
    const defaultSheets = selectedAlbum.defaultSheets || 30;

    const extraSheets = Math.max(0, sheets - defaultSheets);
    const extraCost = extraSheets * baseRate;

    const paperRate = selectedPaper?.clientPricePerSheet || 0;
    const paperCost = paperRate * sheets;

    const coverCost = selectedCover?.priceRetail || 0;

    return basePrice + extraCost + paperCost + coverCost;
  };

  const handleQuickAddAlbum = (size) => {
    const perSheet = size.clientPricePerSheet || Math.round((size.clientBasePrice || 4500) / 30);
    const basePrice = size.clientBasePrice || (perSheet * 30);

    const item = {
      id: `album-${size.id}-${Date.now()}`,
      title: size.name,
      telugu: size.telugu,
      image: size.image || ALBUM_IMAGES[size.id] || '/images/weddingalbums-layflat-album.png',
      sizeId: size.id,
      dimensions: size.dimensions,
      orientation: size.orientation,
      sheetRate: perSheet,
      sheets: 30,
      price: basePrice,
      quantity: 1,
      coverType: 'Standard Layflat Matte',
      paperType: 'NTR Anti-Glare Matte (100% Waterproof)'
    };
    if (addToCart) addToCart(item);
    if (toggleCart) toggleCart();
  };

  const handleAddToCartConfigured = (goToCheckout = false) => {
    if (!selectedAlbum) return;
    const finalPrice = calculateConfiguredPrice();
    const item = {
      id: `album-${selectedAlbum.id}-${Date.now()}`,
      title: selectedAlbum.name,
      telugu: selectedAlbum.telugu,
      image: selectedAlbum.image || ALBUM_IMAGES[selectedAlbum.id] || '/images/weddingalbums-layflat-album.png',
      sizeId: selectedAlbum.id,
      dimensions: selectedAlbum.dimensions,
      orientation: selectedAlbum.orientation,
      sheets: sheets,
      price: finalPrice,
      quantity: 1,
      coverType: selectedCover?.name || 'Standard Layflat Matte',
      paperType: selectedPaper?.name || 'NTR Anti-Glare Matte',
      driveLink: driveLink,
      instructions: instructions
    };
    if (addToCart) addToCart(item);
    setSelectedAlbum(null);
    if (goToCheckout) {
      navigate('/checkout');
    } else {
      if (toggleCart) toggleCart();
    }
  };

  const handleBookServiceConfigured = (goToCheckout = false) => {
    if (!selectedService) return;
    const price = selectedService.clientPrice || selectedService.price || 0;
    const item = {
      id: `${selectedService.serviceType}-${selectedService.id}-${Date.now()}`,
      title: selectedService.title || selectedService.name,
      telugu: selectedService.telugu,
      price: price,
      quantity: 1,
      turnaround: selectedService.turnaround || '2-3 Days',
      type: selectedService.serviceType,
      driveLink: driveLink,
      instructions: instructions
    };
    if (addToCart) addToCart(item);
    setSelectedService(null);
    if (goToCheckout) {
      navigate('/checkout');
    } else {
      if (toggleCart) toggleCart();
    }
  };

  const filteredAlbums = getFilteredAlbums();

  return (
    <section id="estimator" className="storefront-showcase-section" style={{ padding: '80px 0', background: 'linear-gradient(180deg, #07070a 0%, #0d0d14 100%)', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Showcase Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
          <div className="shop-badge">
            <Sparkles size={14} />
            {eyebrow}
          </div>
          <h2 className="shop-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
            {title}
          </h2>
          <p className="shop-subtitle" style={{ fontSize: '1.05rem', margin: 0 }}>
            {subtitle}
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <nav className="shop-tabs" style={{ marginBottom: '2.5rem' }} aria-label="Showcase Categories">
          <button 
            type="button" 
            className={`shop-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Sparkles size={16} /> All Formats
          </button>

          <button 
            type="button" 
            className={`shop-tab-btn ${activeTab === 'landscape' ? 'active' : ''}`}
            onClick={() => setActiveTab('landscape')}
          >
            <BookOpen size={16} /> ↔️ Landscape Panoramic
          </button>

          <button 
            type="button" 
            className={`shop-tab-btn ${activeTab === 'portrait' ? 'active' : ''}`}
            onClick={() => setActiveTab('portrait')}
          >
            <BookOpen size={16} /> ↕️ Portrait Royal Magazine
          </button>

          <button 
            type="button" 
            className={`shop-tab-btn ${activeTab === 'sheets' ? 'active' : ''}`}
            onClick={() => setActiveTab('sheets')}
          >
            <Layers size={16} /> Paper Finishes
          </button>

          <button 
            type="button" 
            className={`shop-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <Video size={16} /> 4K Video Editing
          </button>

          <button 
            type="button" 
            className={`shop-tab-btn ${activeTab === 'flex' ? 'active' : ''}`}
            onClick={() => setActiveTab('flex')}
          >
            <Gift size={16} /> WhatsApp & Flex
          </button>
        </nav>

        {/* Product Grid: Albums */}
        {(activeTab === 'all' || activeTab === 'landscape' || activeTab === 'portrait') && (
          <div className="shop-grid" style={{ marginBottom: '3rem' }}>
            {filteredAlbums.map((size) => {
              const perSheet = size.clientPricePerSheet || Math.round((size.clientBasePrice || 4500) / 30);
              const basePrice = size.clientBasePrice || (perSheet * 30);
              const productImage = size.image || ALBUM_IMAGES[size.id] || '/images/weddingalbums-layflat-album.png';

              return (
                <article key={size.id} className="product-card">
                  <div className="product-card-image-wrapper">
                    <img src={productImage} alt={size.name} className="product-card-image" loading="lazy" />
                    <div className="card-image-gradient" />
                    <div className="product-card-header" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                      <span className={`orientation-tag ${size.orientation}`}>
                        {size.orientation === 'portrait' ? '↕️ Portrait' : '↔️ Landscape'}
                      </span>
                      {size.popular && (
                        <span className="product-badge">
                          <Flame size={12} style={{ display: 'inline', marginRight: 3 }} />
                          {size.badge || '⭐ Best Seller'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="product-card-body">
                    <div className="card-service-type-badge complete-suite">
                      ✨ COMPLETE SUITE · DESIGN + PRINT & BIND
                    </div>
                    <h3 className="product-name">{size.name}</h3>
                    {size.telugu && <div className="product-telugu">{size.telugu}</div>}
                    <p className="product-desc">{size.description || `${size.dimensions} Open Spread with archival lay-flat binding.`}</p>

                    <ul className="card-checklist">
                      <li><span className="card-checklist-check">✓</span> <span>Master Telugu Karizma Layout & Skin Retouching</span></li>
                      <li><span className="card-checklist-check">✓</span> <span>HP Indigo 12000 Layflat Archival Print (0% Gutter)</span></li>
                      <li><span className="card-checklist-check">✓</span> <span>Luxury Hardcover & Box · Select Up to 150 Sheets</span></li>
                    </ul>

                    <div className="price-strip">
                      <div className="per-sheet-highlight">
                        <span className="per-sheet-label">Per Sheet Price</span>
                        <span className="per-sheet-rate">
                          ₹{perSheet} <small style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>/ sheet</small>
                        </span>
                      </div>
                      <div className="base-total-note">
                        <span>30 Sheets (60 Pages) Base:</span>
                        <strong style={{ color: '#fff' }}>₹{Number(basePrice).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="product-card-footer">
                    <button 
                      type="button"
                      onClick={() => openAlbumModal(size)}
                      className="btn-customize"
                    >
                      <Sliders size={16} /> Configure & Book
                    </button>
                    <button 
                      type="button" 
                      className="btn-quick-add"
                      title="Quick Add 30-Sheet Base"
                      onClick={() => handleQuickAddAlbum(size)}
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Product Grid: Paper Finishes */}
        {activeTab === 'sheets' && (
          <div className="shop-grid" style={{ marginBottom: '3rem' }}>
            {sheetStyles.map((sheet) => {
              const addOn = sheet.clientPricePerSheet || 0;
              const sheetImg = SHEET_IMAGES[sheet.id] || '/images/weddingalbums-layflat-album.png';
              return (
                <article key={sheet.id} className="product-card">
                  <div className="product-card-image-wrapper" style={{ height: '140px' }}>
                    <img src={sheetImg} alt={sheet.name} className="product-card-image" loading="lazy" />
                    <div className="card-image-gradient" />
                    <div className="product-card-header" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                      <span className="orientation-tag landscape" style={{ color: sheet.color, borderColor: `${sheet.color}55` }}>
                        {sheet.gsm || 'Archival Sheet'}
                      </span>
                    </div>
                  </div>
                  <div className="product-card-body" style={{ marginTop: '0.75rem' }}>
                    <h3 className="product-name">{sheet.name}</h3>
                    {sheet.telugu && <div className="product-telugu">{sheet.telugu}</div>}
                    <p className="product-desc">{sheet.description}</p>
                    <div className="price-strip">
                      <div className="per-sheet-highlight">
                        <span className="per-sheet-label">Sheet Upgrade Rate</span>
                        <span className="per-sheet-rate">
                          {addOn === 0 ? 'Included (₹0)' : `+₹${addOn} / sheet`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="product-card-footer">
                    <button 
                      type="button" 
                      onClick={() => {
                        const firstAlbum = albumSizes[0];
                        if (firstAlbum) {
                          openAlbumModal(firstAlbum);
                          setSelectedPaper(sheet);
                        }
                      }}
                      className="btn-customize"
                    >
                      Configure Album With This Sheet <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Product Grid: Video */}
        {activeTab === 'video' && (
          <div className="shop-grid" style={{ marginBottom: '3rem' }}>
            {videoServices.map((video) => {
              const price = video.clientPrice || video.price || 0;
              return (
                <article key={video.id} className="product-card">
                  <div className="product-card-image-wrapper" style={{ height: '160px' }}>
                    <img src="/images/cinematic-video-suite.jpg" alt={video.title} className="product-card-image" loading="lazy" />
                    <div className="card-image-gradient" />
                    <div className="product-card-header" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                      <span className="orientation-tag landscape" style={{ color: '#c084fc' }}>
                        ⏱️ {video.turnaround || '48h SLA'}
                      </span>
                    </div>
                  </div>
                  <div className="product-card-body" style={{ marginTop: '0.75rem' }}>
                    <h3 className="product-name">{video.title}</h3>
                    {video.telugu && <div className="product-telugu">{video.telugu}</div>}
                    <p className="product-desc">{video.desc}</p>
                    <div className="price-strip">
                      <div className="per-sheet-highlight">
                        <span className="per-sheet-label">Package Price</span>
                        <span className="per-sheet-rate">₹{Number(price).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="product-card-footer">
                    <button type="button" onClick={() => openServiceModal(video, 'video')} className="btn-customize">
                      Book Video Cut <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Product Grid: Flex & Invites */}
        {activeTab === 'flex' && (
          <div className="shop-grid" style={{ marginBottom: '3rem' }}>
            {flexServices.map((flex) => {
              const price = flex.clientPrice || flex.price || 0;
              return (
                <article key={flex.id} className="product-card">
                  <div className="product-card-image-wrapper" style={{ height: '160px' }}>
                    <img src="/images/opt/weddingalbums-home-herow1600.webp" alt={flex.title} className="product-card-image" loading="lazy" />
                    <div className="card-image-gradient" />
                    <div className="product-card-header" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                      <span className="orientation-tag landscape" style={{ color: '#4ade80' }}>
                        🚚 {flex.turnaround || '2 Days'}
                      </span>
                    </div>
                  </div>
                  <div className="product-card-body" style={{ marginTop: '0.75rem' }}>
                    <h3 className="product-name">{flex.title}</h3>
                    {flex.telugu && <div className="product-telugu">{flex.telugu}</div>}
                    <p className="product-desc">{flex.desc}</p>
                    <div className="price-strip">
                      <div className="per-sheet-highlight">
                        <span className="per-sheet-label">Direct Price</span>
                        <span className="per-sheet-rate">₹{Number(price).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="product-card-footer">
                    <button type="button" onClick={() => openServiceModal(flex, 'flex')} className="btn-customize">
                      Configure & Order Now <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* View All Storefront CTA Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            type="button" 
            onClick={() => navigate(ctaLink || '/shop')}
            className="btn-buy-now" 
            style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', margin: '0 auto' }}
          >
            {ctaText} <ArrowRight size={20} />
          </button>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          PRODUCT CONFIGURATOR MODAL (REPLACES WIZARD)
          ───────────────────────────────────────────────────────────── */}
      {selectedAlbum && (
        <div className="configurator-overlay" onClick={() => setSelectedAlbum(null)}>
          <div className="configurator-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedAlbum.name}</h2>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                  <span className={`orientation-tag ${selectedAlbum.orientation}`}>
                    {selectedAlbum.orientation === 'portrait' ? '↕️ Portrait' : '↔️ Landscape'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                    {selectedAlbum.dimensions} Open Spread Lay-Flat
                  </span>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedAlbum(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Sheets Slider */}
              <div>
                <div className="config-section-title">
                  <BookOpen size={16} /> 1. Number of Sheets (Spreads)
                </div>
                <div className="sheet-slider-card">
                  <div className="sheet-header-row">
                    <div>
                      <span style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Thickness:</span>
                      <div style={{ fontSize: '0.8rem', color: '#71717a' }}>{sheets * 2} Pages Included</div>
                    </div>
                    <div className="sheet-count-display">
                      {sheets} Sheets
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min={20} 
                    max={70} 
                    step={1} 
                    value={sheets}
                    onChange={e => setSheets(Number(e.target.value))}
                    className="sheet-slider"
                  />
                  <div className="sheet-meta-row">
                    <span>20 Sheets (Slim)</span>
                    <span style={{ color: 'var(--gold-primary)' }}>Standard: 30 Sheets</span>
                    <span>70 Sheets (Jumbo)</span>
                  </div>
                </div>
              </div>

              {/* Paper Selection */}
              <div>
                <div className="config-section-title">
                  <Layers size={16} /> 2. Paper Substrate & Surface Finish
                </div>
                <div className="options-grid">
                  {sheetStyles.map(sheet => {
                    const isSelected = selectedPaper?.id === sheet.id;
                    const addOn = sheet.clientPricePerSheet || 0;
                    return (
                      <button
                        key={sheet.id}
                        type="button"
                        onClick={() => setSelectedPaper(sheet)}
                        className={`option-card-btn ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="option-title">{sheet.name}</div>
                        <div className="option-subtitle">{sheet.gsm || 'Archival Print'}</div>
                        <div className="option-price-tag">
                          {addOn === 0 ? 'Included (₹0)' : `+₹${addOn}/sheet`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Master Cover Selection */}
              <div>
                <div className="config-section-title">
                  <Sparkles size={16} /> 3. Luxury Master Presentation Cover
                </div>
                <div className="options-grid">
                  {MASTER_COVERS.map(cover => {
                    const isSelected = selectedCover?.id === cover.id;
                    const addOn = cover.priceRetail || 0;
                    return (
                      <button
                        key={cover.id}
                        type="button"
                        onClick={() => setSelectedCover(cover)}
                        className={`option-card-btn ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="option-title">{cover.name}</div>
                        <div className="option-subtitle">{cover.desc}</div>
                        <div className="option-price-tag">
                          {addOn === 0 ? 'Included (₹0)' : `+₹${addOn.toLocaleString('en-IN')}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drive Link & Notes */}
              <div>
                <div className="config-section-title">
                  <UploadCloud size={16} /> 4. RAW Photos Link & Instructions (Optional)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input 
                    type="url" 
                    placeholder="Paste Google Drive / Dropbox link for photos (optional)"
                    value={driveLink}
                    onChange={e => setDriveLink(e.target.value)}
                    className="config-input"
                  />
                  <input 
                    type="text" 
                    placeholder="Any special design requests (e.g. Haldi yellow background, Telugu font)"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    className="config-input"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-total-box">
                <span className="modal-total-label">
                  Calculated Price ({sheets} Sheets):
                </span>
                <span className="modal-total-price">
                  ₹{Number(calculateConfiguredPrice()).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => handleAddToCartConfigured(false)} className="btn-modal-add-cart">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button type="button" onClick={() => handleAddToCartConfigured(true)} className="btn-buy-now">
                  Buy Now <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE MODAL */}
      {selectedService && (
        <div className="configurator-overlay" onClick={() => setSelectedService(null)}>
          <div className="configurator-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedService.title || selectedService.name}</h2>
                <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                  ⏱️ Turnaround: {selectedService.turnaround || '2-3 Days'}
                </span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedService(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0 }}>
                {selectedService.desc}
              </p>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#D4AF37', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Drive Link for Source Files (Optional)
                </label>
                <input 
                  type="url" 
                  placeholder="https://drive.google.com/..."
                  value={driveLink}
                  onChange={e => setDriveLink(e.target.value)}
                  className="config-input"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#D4AF37', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Notes & Special Instructions
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Wedding Date, Couple Names, Song preference"
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  className="config-input"
                />
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-total-box">
                <span className="modal-total-label">Total Amount:</span>
                <span className="modal-total-price">
                  ₹{Number(selectedService.clientPrice || selectedService.price || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => handleBookServiceConfigured(false)} className="btn-modal-add-cart">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button type="button" onClick={() => handleBookServiceConfigured(true)} className="btn-buy-now">
                  Book & Checkout <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
