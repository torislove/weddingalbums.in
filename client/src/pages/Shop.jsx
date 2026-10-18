import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Video, Gift, Layers, ShoppingBag, 
  ArrowRight, Sparkles, Filter, Flame, X, Sliders, UploadCloud,
  Check, Film, Music, Palette, CheckSquare, Square, ShieldCheck,
  Clock, Truck, HardDrive, Info, ChevronDown, ChevronUp, Copy, CheckCircle2,
  Camera, Phone, MessageCircle, ExternalLink
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import './Shop.css';

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
  { id: 'cover-matte', name: 'Scuff-Free Lay-Flat Matte', priceRetail: 0, desc: 'Included standard hardcover', image: '/images/weddingalbums-layflat-album.png' },
  { id: 'cover-acrylic', name: '4mm Diamond Crystal Acrylic 3D Glass', priceRetail: 1500, desc: 'Beveled 3D crystal glass face', image: '/images/cover-acrylic-3d.jpg' },
  { id: 'cover-velvet', name: 'Royal Velvet + 24K Gold Debossed Foil', priceRetail: 1200, desc: 'Ultra-luxury fabric with gold typography', image: '/images/cover-royal-velvet.jpg' },
  { id: 'cover-leatherette', name: 'Handcrafted Italian Leatherette + Box', priceRetail: 1800, desc: 'Magnetic briefcase presentation box', image: '/images/cover-leatherette-box.jpg' },
];

const ALBUM_SERVICE_SCOPES = [
  { id: 'design_and_print', name: '✨ Complete Suite: Master Telugu Design + HP Indigo Print & Bind', priceDelta: 0, desc: 'Full custom design, RAW skin retouching, color correction, and layflat archival binding' },
  { id: 'print_only', name: '🖨️ Print & Bind Only (I have ready PSD layouts)', priceDelta: -600, desc: 'Discount applied: you provide completed 12×36 / 18×12 print-ready PSD spreads' }
];

// ── Flex Configurator Datasets ───────────────────────────────────────────────
const FLEX_SIZES = [
  { id: '10x8', name: '10ft × 8ft', label: 'Grand Mandap Entrance (80 sq.ft)', sqft: 80, price: 2400 },
  { id: '8x6', name: '8ft × 6ft', label: 'Stage Ceremony Backdrop (48 sq.ft)', sqft: 48, price: 1800 },
  { id: '6x4', name: '6ft × 4ft', label: 'Photo Booth / Welcome Board (24 sq.ft)', sqft: 24, price: 1200 },
  { id: '6x3', name: '6ft × 3ft', label: 'Roll-Up Standee with Aluminum Stand (18 sq.ft)', sqft: 18, price: 1800, isStandee: true },
  { id: '12x10', name: '12ft × 10ft', label: 'Mega Mandap Royal Arch (120 sq.ft)', sqft: 120, price: 3600 },
  { id: '5x3', name: '5ft × 3ft', label: 'Intimate Haldi / Mehendi Banner (15 sq.ft)', sqft: 15, price: 900 },
  { id: 'custom', name: '✨ Custom Dimensions (Any Size You Want)', label: 'Enter custom Width ft × Height ft (₹30/sq.ft)', sqft: 0, price: 0, isCustom: true }
];

const FLEX_DESIGN_OPTIONS = [
  { id: 'design_needed', name: '🎨 Complete Custom Telugu Flex Design', price: 499, desc: 'Couple photo blending, golden Telugu shlokas, Lord Venkateswara/Ganesha motifs & venue map QR' },
  { id: 'print_only', name: '🖨️ Print-Ready File Ready (Print Only)', price: 0, desc: 'You provide completed high-resolution PSD/PDF/TIFF file via Drive link' }
];

const FLEX_MATERIALS = [
  { id: '340gsm', name: 'Standard 340 GSM Star Gloss Flex', price: 0, desc: 'Vibrant outdoor reflection under daylight' },
  { id: '440gsm_blackout', name: 'Premium 440 GSM Blackout Matte Flex', price: 250, desc: 'Heavy duty, zero camera flash glare, anti-curl' },
  { id: 'cloth_fabric', name: 'Eco-Solvent Cloth Fabric / Canvas Banner', price: 600, desc: 'Wrinkle-free cloth, luxury aesthetic, reusable' }
];

const FLEX_FINISHING = [
  { id: 'eyelets', name: 'Heavy Brass Eyelets + Hemmed Edges', price: 0, desc: 'Corner and edge grommets for easy rope tying' },
  { id: 'pole_pockets', name: 'Top & Bottom 2-inch Pole Pockets', price: 150, desc: 'Pockets for bamboo / truss pipe hanging' },
  { id: 'rollup_stand', name: 'Aluminum Retractable Stand + Padded Bag', price: 800, desc: 'Heavy-gauge aluminum stand with spring roller' }
];

// ── Video Configurator Datasets ──────────────────────────────────────────────
const VIDEO_DURATIONS = [
  { id: 'teaser', name: '3–5 Min Teaser / Trailer', price: 0, desc: 'High-energy cinematic trailer for Instagram & WhatsApp status' },
  { id: 'highlights', name: '10–15 Min Extended Highlights', price: 1500, desc: 'Emotional storytelling film with vows & key rituals' },
  { id: '45min', name: '45 Minutes Grand Feature Film', price: 3000, desc: 'Comprehensive coverage of main wedding ceremony' },
  { id: '1hour', name: '1 Hour Traditional Ceremony Film', price: 4500, desc: 'Complete traditional rituals documented with chapter index' },
  { id: '2hours', name: '2 Hours Full Ceremony Documentary', price: 6500, desc: 'Complete uninterrupted multicam documentary' },
  { id: '3hours', name: '3+ Hours Full Ritual Archive', price: 8500, desc: 'Master multi-event wedding archive (Haldi, Wedding, Reception)' },
];

const VIDEO_MULTICAM_OPTIONS = [
  { id: '2cam', name: '2-Camera Multicam Sync', price: 0, desc: 'Standard 2 angles (Groom stage & Bride entry / Wide + Close)' },
  { id: '3cam', name: '3-Camera Multicam Sync', price: 1200, desc: '3 synchronized angles (Bride, Groom, Parents/Crowd)' },
  { id: '4cam', name: '4-Camera Grand Production Sync', price: 2400, desc: 'Full studio multi-cam setup + drone timecode sync' },
];

const VIDEO_RESOLUTIONS = [
  { id: '4k', name: '4K UHD (3840×2160) Dolby Color', price: 0, desc: 'Maximum 4K clarity for smart TVs & master archiving' },
  { id: '1080p', name: 'Full HD 1080p Web & Social', price: 0, desc: 'Optimized for smooth mobile streaming & fast WhatsApp sharing' },
];

const VIDEO_AUDIO_THEMES = [
  { id: 'traditional', name: 'Traditional Telugu Mangala Vaadhyam', desc: 'Classical Nadaswaram, Shehnai & temple bells' },
  { id: 'fusion', name: 'Cinematic Fusion (Trending Telugu + Classical)', desc: 'Contemporary acoustic strings blended with ritual rhythms' },
  { id: 'custom', name: 'Custom Couple Song / Special Audio', desc: 'Specify your favorite song in instructions' },
];

const VIDEO_ADDONS = [
  { id: 'reels', name: '5-Pack 9:16 Viral Instagram Reels', price: 999, desc: 'Cut for 30s-60s vertical format with trending audio hooks' },
  { id: 'drone', name: 'Drone Aerial Footage Stabilization', price: 599, desc: '3-axis stabilization and color grading for drone views' },
  { id: 'rush', name: 'Express 24-Hour Rush Turnaround', price: 1499, desc: 'Priority lab editing delivered within 24 hours' },
];

// ── WhatsApp Invites Datasets ────────────────────────────────────────────────
const INVITE_THEMES = [
  { id: 'temple', name: 'Traditional Temple Mandap', desc: 'Lord Ganesha, golden lamps & falling jasmine animation' },
  { id: 'royal', name: 'Royal Palace & Golden Peacock', desc: '24K gold filigree, royal arch & debossed calligraphy' },
  { id: 'caricature', name: 'Cute Couple Caricature', desc: 'Personalized bride & groom cartoon animation' },
];

const INVITE_SCOPES = [
  { id: 'single', name: '1 Event (Muhurtham Only - 30s)', price: 0, desc: 'Focuses on wedding muhurtham and venue' },
  { id: 'multi', name: 'Multi-Event (Haldi, Mehendi, Muhurtham - 60s)', price: 499, desc: 'Includes separate cards for all ceremonies' },
  { id: 'grand', name: 'Grand 3-Day Wedding + QR Venue Map (90s)', price: 899, desc: 'Full celebration itinerary with Google Map QR code' },
];

const INVITE_LANGUAGES = [
  { id: 'telugu', name: 'Telugu (Traditional Script)' },
  { id: 'bilingual', name: 'Bilingual (Telugu + English)' },
  { id: 'english', name: 'English (Contemporary Luxury)' },
];

export default function Shop() {
  const { content } = useContent();
  const { lang } = useLanguage();
  const { addToCart, toggleCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const labSettings = content?.global?.siteSettings || content?.global?.footer || content?.global?.navbar || {};
  const labPhone = labSettings.phone || '+91 9346793364';
  const labWhatsapp = labSettings.whatsapp || '919346793364';
  const labAddress = labSettings.address || 'Door No. 4-12-88, Ring Road, Near Collectorate, Guntur - 522006, AP';

  const [activeTab, setActiveTab] = useState('editing'); // 'editing' | 'albums' | 'video' | 'flex' | 'all'
  const [orientationFilter, setOrientationFilter] = useState('all'); // 'all' | 'landscape' | 'portrait'

  // Modal State
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [driveLink, setDriveLink] = useState('');
  const [instructions, setInstructions] = useState('');

  // Dual Asset Handover State (Cloud vs Courier Pen Drive to Lab)
  const [assetMethod, setAssetMethod] = useState('cloud'); // 'cloud' | 'courier'
  const [courierCompany, setCourierCompany] = useState('');
  const [courierTracking, setCourierTracking] = useState('');
  const [addressCopied, setAddressCopied] = useState(false);

  // Market Specification Guides Accordion State
  const [showAlbumGuide, setShowAlbumGuide] = useState(false);
  const [showVideoGuide, setShowVideoGuide] = useState(false);
  const [showFlexGuide, setShowFlexGuide] = useState(false);

  // 1. Album Modal Configuration State
  const [albumScope, setAlbumScope] = useState('design_and_print');
  const [sheets, setSheets] = useState(30);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedCover, setSelectedCover] = useState(MASTER_COVERS[0]);

  // 2. Flex Modal Configuration State
  const [flexSize, setFlexSize] = useState('10x8');
  const [customWidthFt, setCustomWidthFt] = useState(10);
  const [customHeightFt, setCustomHeightFt] = useState(8);
  const [customFlexNotes, setCustomFlexNotes] = useState('');
  const [showCustomFlexModal, setShowCustomFlexModal] = useState(false);
  const [flexDesignOption, setFlexDesignOption] = useState('design_needed');
  const [flexMaterial, setFlexMaterial] = useState('340gsm');
  const [flexFinishing, setFlexFinishing] = useState('eyelets');

  // 3. Video Modal Configuration State
  const [videoDuration, setVideoDuration] = useState('teaser');
  const [videoMulticam, setVideoMulticam] = useState('2cam');
  const [videoResolution, setVideoResolution] = useState('4k');
  const [videoAudioTheme, setVideoAudioTheme] = useState('traditional');
  const [videoReelsAddon, setVideoReelsAddon] = useState(false);
  const [videoDroneAddon, setVideoDroneAddon] = useState(false);
  const [videoRushAddon, setVideoRushAddon] = useState(false);

  // 4. WhatsApp Invite Modal Configuration State
  const [inviteTheme, setInviteTheme] = useState('temple');
  const [inviteScope, setInviteScope] = useState('single');
  const [inviteLanguage, setInviteLanguage] = useState('telugu');

  // 5. Photo Editing & Designing Modal Configuration State
  const [photoQuantity, setPhotoQuantity] = useState(30);

  // Catalog Data
  const catalog = content?.global?.servicesCatalog || {};
  const albumSizes = catalog?.albumPrinting?.albumSizes || [];
  const sheetStyles = catalog?.albumPrinting?.sheetStyles || [];
  const photoServices = catalog?.photoEditing || [];
  const videoServices = catalog?.videoEditing || [];
  const flexServices = catalog?.invitationsAndFlex || [];

  // Support Action Handlers
  const handleWhatsAppSupport = (customText = '') => {
    const text = customText || 'Hi WeddingAlbums.in, I need assistance choosing services or custom sizing for my wedding album/flex/video.';
    const cleanNumber = labWhatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePhoneSupport = () => {
    const cleanNumber = labPhone.replace(/\s+/g, '');
    window.location.href = `tel:${cleanNumber}`;
  };

  const handleWhatsAppCustomFlex = (customW, customH, notes) => {
    const w = customW !== undefined ? customW : customWidthFt;
    const h = customH !== undefined ? customH : customHeightFt;
    const sqft = Math.round((parseFloat(w) || 10) * (parseFloat(h) || 8));
    const rate = catalog.ratePerSqFtClient || 30;
    const estPrice = Math.max(450, Math.round(sqft * rate));
    const notesText = notes || customFlexNotes || 'Custom event banner';
    const text = `Hi WeddingAlbums.in, I'd like to ask for a custom flex banner size: ${w}ft x ${h}ft (${sqft} sq.ft, est. ₹${estPrice.toLocaleString('en-IN')}). Notes / Venue: ${notesText}. Please confirm quote and delivery!`;
    handleWhatsAppSupport(text);
  };

  const renderCardSupportPrompt = (title, type = 'general') => {
    let prompt = 'Need custom size or guidance?';
    let waText = `Hi WeddingAlbums.in, I'm inquiring about ${title}. Can you guide me on options?`;
    if (type === 'flex') {
      prompt = 'Need any custom size or venue frame?';
      waText = `Hi WeddingAlbums.in, I need a custom flex size or advice for ${title}.`;
    } else if (type === 'video') {
      prompt = 'Need custom runtime or multi-cam sync?';
      waText = `Hi WeddingAlbums.in, I'm inquiring about 4K video editing for ${title}.`;
    } else if (type === 'photo') {
      prompt = 'Need studio bulk editing or test retouch?';
      waText = `Hi WeddingAlbums.in, I'm inquiring about photo editing rates for ${title}.`;
    }
    return (
      <div className="card-support-strip">
        <span className="card-support-label">{prompt}</span>
        <div className="card-support-btns">
          <button
            type="button"
            className="card-support-btn-wa"
            onClick={(e) => {
              e.stopPropagation();
              handleWhatsAppSupport(waText);
            }}
            title="Chat on WhatsApp"
          >
            <MessageCircle size={13} /> WhatsApp
          </button>
          <a
            href={`tel:${labPhone.replace(/\s+/g, '')}`}
            className="card-support-btn-tel"
            onClick={(e) => e.stopPropagation()}
            title={`Call ${labPhone}`}
          >
            <Phone size={13} /> Call
          </a>
        </div>
      </div>
    );
  };

  const renderModalSupportStrip = (serviceTitle = '', prefillText = '') => (
    <div className="modal-support-strip">
      <div className="modal-support-info">
        <span className="modal-support-title">Need custom specifications or instant guidance?</span>
        <span className="modal-support-desc">Our lab specialists are ready to help via WhatsApp and Phone.</span>
      </div>
      <div className="modal-support-actions">
        <button
          type="button"
          className="btn-modal-wa"
          onClick={() => handleWhatsAppSupport(prefillText || `Hi WeddingAlbums.in, I'm customizing ${serviceTitle} and have questions.`)}
        >
          <MessageCircle size={15} /> Chat on WhatsApp
        </button>
        <a
          href={`tel:${labPhone.replace(/\s+/g, '')}`}
          className="btn-modal-tel"
        >
          <Phone size={15} /> Call: {labPhone}
        </a>
      </div>
    </div>
  );

  // Deep-linking: auto-open tab or configurator modal if ?tab=... or ?size=... query param is passed
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['all', 'editing', 'albums', 'sheets', 'video', 'flex'].includes(tabParam)) {
      setActiveTab(tabParam === 'sheets' ? 'albums' : tabParam);
    }
    const sizeParam = searchParams.get('size');
    if (sizeParam && albumSizes.length > 0) {
      const found = albumSizes.find(s => s.id === sizeParam || s.id === `size-${sizeParam}` || s.dimensions?.toLowerCase().includes(sizeParam.toLowerCase()));
      if (found) {
        openAlbumModal(found);
      }
    }
  }, [searchParams, albumSizes]);

  // Filtered album sizes
  const filteredSizes = albumSizes.filter(s => {
    if (orientationFilter === 'all') return true;
    return s.orientation === orientationFilter;
  });

  const openAlbumModal = (size) => {
    setSelectedAlbum(size);
    setSelectedService(null);
    setAlbumScope('design_and_print');
    setSheets(size.defaultSheets || 30);
    setSelectedPaper(sheetStyles[0] || { name: 'NTR Anti-Glare Matte', clientPricePerSheet: 0 });
    setSelectedCover(MASTER_COVERS[0]);
    setDriveLink('');
    setInstructions('');
    setAssetMethod('cloud');
    setCourierCompany('');
    setCourierTracking('');
    setAddressCopied(false);
  };

  const openServiceModal = (service, type) => {
    setSelectedService({ ...service, serviceType: type });
    setSelectedAlbum(null);
    setDriveLink('');
    setInstructions('');
    setAssetMethod('cloud');
    setCourierCompany('');
    setCourierTracking('');
    setAddressCopied(false);

    // Set defaults according to service type
    if (type === 'flex') {
      const isStandee = service.id?.includes('standee') || service.title?.toLowerCase().includes('standee');
      setFlexSize(isStandee ? '6x3' : '10x8');
      setCustomWidthFt(10);
      setCustomHeightFt(8);
      setFlexDesignOption('design_needed');
      setFlexMaterial(isStandee ? '440gsm_blackout' : '340gsm');
      setFlexFinishing(isStandee ? 'rollup_stand' : 'eyelets');
    } else if (type === 'video') {
      setVideoDuration('teaser');
      setVideoMulticam('2cam');
      setVideoResolution('4k');
      setVideoAudioTheme('traditional');
      setVideoReelsAddon(false);
      setVideoDroneAddon(false);
      setVideoRushAddon(false);
    } else if (type === 'invite') {
      setInviteTheme('temple');
      setInviteScope('single');
      setInviteLanguage('telugu');
    } else if (type === 'photo') {
      setPhotoQuantity(service.defaultQty || 30);
    }
  };

  // ── Real-Time Math Calculations ───────────────────────────────────────────
  const calculateConfiguredPhotoPrice = () => {
    if (!selectedService) return 0;
    const unitPrice = selectedService.clientPrice || 45;
    const qty = Math.max(1, parseInt(photoQuantity) || 30);
    return unitPrice * qty;
  };
  const calculateConfiguredAlbumPrice = () => {
    if (!selectedAlbum) return 0;
    const baseRate = selectedAlbum.clientPricePerSheet || Math.round((selectedAlbum.clientBasePrice || 4500) / 30);
    const basePrice = selectedAlbum.clientBasePrice || (baseRate * 30);
    const defaultSheets = selectedAlbum.defaultSheets || 30;

    const extraSheets = Math.max(0, sheets - defaultSheets);
    const extraCost = extraSheets * baseRate;

    const paperRate = selectedPaper?.clientPricePerSheet || 0;
    const paperCost = paperRate * sheets;

    const coverCost = selectedCover?.priceRetail || 0;
    const scopeDelta = albumScope === 'print_only' ? -600 : 0;

    return Math.max(1000, basePrice + extraCost + paperCost + coverCost + scopeDelta);
  };

  const calculateConfiguredFlexPrice = () => {
    const isCustom = flexSize === 'custom';
    const chosenSize = FLEX_SIZES.find(s => s.id === flexSize) || FLEX_SIZES[0];
    const width = isCustom ? Math.max(1, parseFloat(customWidthFt) || 1) : 0;
    const height = isCustom ? Math.max(1, parseFloat(customHeightFt) || 1) : 0;
    const sqft = isCustom ? (width * height) : (chosenSize.sqft || 80);
    const sqftRate = catalog.ratePerSqFtClient || 30;
    const basePrice = isCustom ? Math.max(450, Math.round(sqft * sqftRate)) : chosenSize.price;
    const designAddon = flexDesignOption === 'design_needed' ? 499 : 0;
    const materialAddon = flexMaterial === '440gsm_blackout' 
      ? (isCustom ? Math.round(sqft * 5) : 250) 
      : flexMaterial === 'cloth_fabric' 
        ? (isCustom ? Math.round(sqft * 15) : 600) 
        : 0;
    const finishingAddon = flexFinishing === 'pole_pockets' ? 150 : (flexFinishing === 'rollup_stand' && !chosenSize.isStandee) ? 800 : 0;

    return basePrice + designAddon + materialAddon + finishingAddon;
  };

  const calculateConfiguredVideoPrice = () => {
    if (!selectedService) return 0;
    const base = selectedService.clientPrice || selectedService.price || 5000;
    const durObj = VIDEO_DURATIONS.find(d => d.id === videoDuration) || VIDEO_DURATIONS[0];
    const mcObj = VIDEO_MULTICAM_OPTIONS.find(m => m.id === videoMulticam) || VIDEO_MULTICAM_OPTIONS[0];
    const reels = videoReelsAddon ? 999 : 0;
    const drone = videoDroneAddon ? 599 : 0;
    const rush = videoRushAddon ? 1499 : 0;
    return base + durObj.price + mcObj.price + reels + drone + rush;
  };

  const calculateConfiguredInvitePrice = () => {
    const base = 1999;
    const scope = inviteScope === 'multi' ? 499 : inviteScope === 'grand' ? 899 : 0;
    return base + scope;
  };

  // Reusable Dual Asset Handover Section Component
  const renderAssetHandoverSection = (assetTypeLabel = 'RAW Photos / Media') => (
    <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
      <div className="config-section-title">
        <UploadCloud size={16} /> Asset Handover: How will you provide your {assetTypeLabel}?
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          onClick={() => setAssetMethod('cloud')}
          className={`option-card-btn ${assetMethod === 'cloud' ? 'selected' : ''}`}
        >
          <div className="option-title">☁️ High-Speed Cloud Link</div>
          <div className="option-subtitle">WeTransfer, Google Drive, Dropbox, OneDrive</div>
        </button>
        <button
          type="button"
          onClick={() => setAssetMethod('courier')}
          className={`option-card-btn ${assetMethod === 'courier' ? 'selected' : ''}`}
        >
          <div className="option-title">📦 Send Pen Drive / HDD to Lab</div>
          <div className="option-subtitle">Ship physical drive directly to our Central Lab</div>
        </button>
      </div>

      {assetMethod === 'cloud' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input 
            type="url" 
            placeholder="Paste WeTransfer, Google Drive, or Dropbox link"
            value={driveLink}
            onChange={e => setDriveLink(e.target.value)}
            className="config-input"
          />
          <div style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
            💡 You can paste your link now, or submit your cloud link via WhatsApp after ordering.
          </div>
        </div>
      ) : (
        <div style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 10, padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--gold-primary)', fontSize: '0.9rem' }}>
                🏢 Central Lab Shipping Address:
              </div>
              <div style={{ fontSize: '0.85rem', color: '#e4e4e7', marginTop: '0.25rem', lineHeight: 1.5 }}>
                <strong>WeddingAlbums Central Processing Lab</strong><br />
                {labAddress}<br />
                Lab Desk & WhatsApp: <strong>{labPhone}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(`WeddingAlbums Central Processing Lab, ${labAddress}. Ph: ${labPhone}`);
                setAddressCopied(true);
                setTimeout(() => setAddressCopied(false), 2500);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.35rem 0.65rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {addressCopied ? <CheckCircle2 size={13} color="#4ade80" /> : <Copy size={13} />}
              {addressCopied ? 'Copied!' : 'Copy Address'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input 
              type="text" 
              placeholder="Courier Partner (e.g. DTDC, Professional, Speed Post)"
              value={courierCompany}
              onChange={e => setCourierCompany(e.target.value)}
              className="config-input"
            />
            <input 
              type="text" 
              placeholder="Tracking / Consignment No. (or Sending within 48h)"
              value={courierTracking}
              onChange={e => setCourierTracking(e.target.value)}
              className="config-input"
            />
          </div>

          <div style={{ fontSize: '0.78rem', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={15} color="var(--gold-primary)" />
            <span><strong>100% Safe Return Guarantee:</strong> Your physical Pen Drive or Hard Drive will be safely returned inside your finished album luxury presentation box.</span>
          </div>
        </div>
      )}

      <div style={{ marginTop: '0.75rem' }}>
        <input 
          type="text" 
          placeholder="Bride & Groom names, specific song/font requests, or ritual moments to highlight"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          className="config-input"
        />
      </div>
    </div>
  );

  // ── Add To Cart Handlers ───────────────────────────────────────────────────
  const handleQuickAddAlbum = (size) => {
    const perSheet = size.clientPricePerSheet || Math.round((size.clientBasePrice || 4500) / 30);
    const basePrice = size.clientBasePrice || (perSheet * 30);

    const item = {
      id: `album-${size.id}-${Date.now()}`,
      title: size.name,
      name: size.name,
      telugu: size.telugu,
      category: 'Heirloom Wedding Album',
      image: size.image || ALBUM_IMAGES[size.id] || '/images/weddingalbums-layflat-album.png',
      sizeId: size.id,
      dimensions: size.dimensions,
      orientation: size.orientation,
      sheetRate: perSheet,
      sheets: 30,
      price: basePrice,
      quantity: 1,
      configDetails: [
        `Format: ${size.dimensions} (${size.orientation === 'portrait' ? '↕️ Portrait' : '↔️ Landscape'})`,
        `Sheets: 30 Spreads (60 Pages)`,
        `Paper: NTR Anti-Glare Matte (100% Waterproof)`,
        `Cover: Standard Layflat Hardcover Matte`,
        `Scope: Complete Master Design + Lab Print`
      ]
    };
    if (addToCart) addToCart(item);
    if (toggleCart) toggleCart();
  };

  const handleAddToCartAlbum = (goToCheckout = false) => {
    if (!selectedAlbum) return;
    const finalPrice = calculateConfiguredAlbumPrice();
    const assetConfigBadge = assetMethod === 'courier'
      ? `Asset Delivery: 📦 Courier Pen Drive to Lab (${courierCompany || 'Carrier Pending'}${courierTracking ? ` - #${courierTracking}` : ''})`
      : `Asset Delivery: ☁️ Cloud Link (${driveLink ? 'Attached' : 'Pending Link'})`;

    const item = {
      id: `album-${selectedAlbum.id}-${Date.now()}`,
      title: selectedAlbum.name,
      name: selectedAlbum.name,
      telugu: selectedAlbum.telugu,
      category: 'Heirloom Wedding Album',
      image: selectedAlbum.image || ALBUM_IMAGES[selectedAlbum.id] || '/images/weddingalbums-layflat-album.png',
      sizeId: selectedAlbum.id,
      dimensions: selectedAlbum.dimensions,
      orientation: selectedAlbum.orientation,
      sheets: sheets,
      price: finalPrice,
      quantity: 1,
      configDetails: [
        `Format: ${selectedAlbum.dimensions} (${selectedAlbum.orientation === 'portrait' ? '↕️ Portrait' : '↔️ Landscape'})`,
        `Scope: ${albumScope === 'design_and_print' ? 'Master Design + Print Suite' : 'Print & Bind Only'}`,
        `Sheets: ${sheets} Spreads (${sheets * 2} Pages)`,
        `Paper: ${selectedPaper?.name || 'NTR Anti-Glare Matte'}`,
        `Cover: ${selectedCover?.name || 'Standard Layflat Matte'}`,
        assetConfigBadge
      ],
      assetMethod: assetMethod,
      courierCompany: courierCompany,
      courierTracking: courierTracking,
      driveLink: driveLink,
      instructions: instructions
    };
    if (addToCart) addToCart(item);
    setSelectedAlbum(null);
    if (goToCheckout) navigate('/checkout');
    else if (toggleCart) toggleCart();
  };

  const handleAddToCartFlex = (goToCheckout = false) => {
    const isCustom = flexSize === 'custom';
    const chosenSize = FLEX_SIZES.find(s => s.id === flexSize) || FLEX_SIZES[0];
    const width = isCustom ? Math.max(1, parseFloat(customWidthFt) || 1) : 0;
    const height = isCustom ? Math.max(1, parseFloat(customHeightFt) || 1) : 0;
    const sqft = isCustom ? (width * height) : (chosenSize.sqft || 80);
    const sizeTitle = isCustom ? `Custom ${width}ft × ${height}ft (${sqft} sq.ft)` : `${chosenSize.name} (${chosenSize.label})`;
    const finalPrice = calculateConfiguredFlexPrice();

    const assetConfigBadge = assetMethod === 'courier'
      ? `Asset Delivery: 📦 Courier Pen Drive to Lab (${courierCompany || 'Carrier Pending'}${courierTracking ? ` - #${courierTracking}` : ''})`
      : `Asset Delivery: ☁️ Cloud Link (${driveLink ? 'Attached' : 'Pending Link'})`;

    const item = {
      id: `flex-${flexSize}-${Date.now()}`,
      title: `${selectedService?.title || 'Mandap Wedding Flex Banner'} (${sizeTitle})`,
      name: `${selectedService?.title || 'Mandap Wedding Flex Banner'} (${sizeTitle})`,
      telugu: selectedService?.telugu || 'మండపం ఎంట్రన్స్ ఫ్లెక్స్ బ్యానర్',
      category: 'Event Media & Signage',
      image: '/images/opt/weddingalbums-home-herow1600.webp',
      price: finalPrice,
      quantity: 1,
      configDetails: [
        `Size: ${sizeTitle}`,
        ...(isCustom && customFlexNotes ? [`Venue/Notes: ${customFlexNotes}`] : []),
        `Design: ${flexDesignOption === 'design_needed' ? 'Custom Telugu Design Included (+₹499)' : 'Print-Ready File Provided (₹0)'}`,
        `Material: ${flexMaterial === '440gsm_blackout' ? '440 GSM Blackout Matte Flex' : flexMaterial === 'cloth_fabric' ? 'Eco-Solvent Cloth Fabric Banner' : 'Standard 340 GSM Star Gloss Flex'}`,
        `Finishing: ${flexFinishing === 'pole_pockets' ? 'Top/Bottom Pole Pockets' : flexFinishing === 'rollup_stand' ? 'Aluminum Roll-Up Stand' : 'Heavy Brass Eyelets'}`,
        assetConfigBadge
      ],
      assetMethod: assetMethod,
      courierCompany: courierCompany,
      courierTracking: courierTracking,
      driveLink: driveLink,
      instructions: `${instructions ? `${instructions} | ` : ''}${customFlexNotes ? `Custom Notes: ${customFlexNotes}` : ''}`
    };
    if (addToCart) addToCart(item);
    setSelectedService(null);
    setShowCustomFlexModal(false);
    if (goToCheckout) navigate('/checkout');
    else if (toggleCart) toggleCart();
  };

  const handleAddToCartVideo = (goToCheckout = false) => {
    if (!selectedService) return;
    const finalPrice = calculateConfiguredVideoPrice();
    const durObj = VIDEO_DURATIONS.find(d => d.id === videoDuration) || VIDEO_DURATIONS[0];
    const mcObj = VIDEO_MULTICAM_OPTIONS.find(m => m.id === videoMulticam) || VIDEO_MULTICAM_OPTIONS[0];
    const audioObj = VIDEO_AUDIO_THEMES.find(a => a.id === videoAudioTheme);
    const addonsList = [];
    if (videoReelsAddon) addonsList.push('5-Pack 9:16 Instagram Reels');
    if (videoDroneAddon) addonsList.push('Drone Footage Stabilization');
    if (videoRushAddon) addonsList.push('24h Express Rush Turnaround');

    const assetConfigBadge = assetMethod === 'courier'
      ? `Asset Delivery: 📦 Courier Pen Drive to Lab (${courierCompany || 'Carrier Pending'}${courierTracking ? ` - #${courierTracking}` : ''})`
      : `Asset Delivery: ☁️ Cloud Link (${driveLink ? 'Attached' : 'Pending Link'})`;

    const item = {
      id: `video-${selectedService.id}-${Date.now()}`,
      title: `${selectedService.title || selectedService.name} (${durObj.name})`,
      name: `${selectedService.title || selectedService.name} (${durObj.name})`,
      telugu: selectedService.telugu,
      category: '4K Cinematic Video Editing',
      image: '/images/cinematic-video-suite.jpg',
      price: finalPrice,
      quantity: 1,
      configDetails: [
        `Duration: ${durObj.name}`,
        `Multicam: ${mcObj.name}`,
        `Resolution: ${videoResolution === '4k' ? '4K UHD (3840×2160) Dolby Vision' : 'Full HD 1080p'}`,
        `Soundtrack: ${audioObj?.name || 'Traditional Telugu Mangala Vaadhyam'}`,
        ...(addonsList.length > 0 ? [`Add-Ons: ${addonsList.join(' + ')}`] : [`Add-Ons: Standard Package`]),
        `SLA: ${videoRushAddon ? '24 Hours Rush' : selectedService.turnaround || '48-72h SLA'}`,
        assetConfigBadge
      ],
      assetMethod: assetMethod,
      courierCompany: courierCompany,
      courierTracking: courierTracking,
      driveLink: driveLink,
      instructions: instructions
    };
    if (addToCart) addToCart(item);
    setSelectedService(null);
    if (goToCheckout) navigate('/checkout');
    else if (toggleCart) toggleCart();
  };

  const handleAddToCartInvite = (goToCheckout = false) => {
    const finalPrice = calculateConfiguredInvitePrice();
    const themeObj = INVITE_THEMES.find(t => t.id === inviteTheme);
    const scopeObj = INVITE_SCOPES.find(s => s.id === inviteScope);
    const langObj = INVITE_LANGUAGES.find(l => l.id === inviteLanguage);

    const assetConfigBadge = assetMethod === 'courier'
      ? `Asset Delivery: 📦 Courier Pen Drive to Lab (${courierCompany || 'Carrier Pending'}${courierTracking ? ` - #${courierTracking}` : ''})`
      : `Asset Delivery: ☁️ Cloud Link (${driveLink ? 'Attached' : 'Pending Link'})`;

    const item = {
      id: `invite-${Date.now()}`,
      title: '60s Animated WhatsApp Video Invitation',
      name: '60s Animated WhatsApp Video Invitation',
      telugu: 'యానిమేటెడ్ వాట్సాప్ వీడియో ఆహ్వానం',
      category: 'Digital Wedding Stationery',
      image: '/images/opt/weddingalbums-home-herow1600.webp',
      price: finalPrice,
      quantity: 1,
      configDetails: [
        `Theme: ${themeObj?.name || 'Traditional Temple Mandap'}`,
        `Scope: ${scopeObj?.name || '1 Event (30s)'}`,
        `Language: ${langObj?.name || 'Telugu'}`,
        `Turnaround: 24 Hours WhatsApp Delivery`,
        assetConfigBadge
      ],
      assetMethod: assetMethod,
      courierCompany: courierCompany,
      courierTracking: courierTracking,
      driveLink: driveLink,
      instructions: instructions
    };
    if (addToCart) addToCart(item);
    setSelectedService(null);
    if (goToCheckout) navigate('/checkout');
    else if (toggleCart) toggleCart();
  };

  const handleAddToCartPhoto = (goToCheckout = false) => {
    if (!selectedService) return;
    const unitPrice = selectedService.clientPrice || 45;
    const qty = Math.max(1, parseInt(photoQuantity) || 30);
    const finalPrice = unitPrice * qty;
    const unitLabel = selectedService.unit || 'units';

    const assetConfigBadge = assetMethod === 'courier'
      ? `Asset Delivery: 📦 Courier Pen Drive to Lab (${courierCompany || 'Carrier Pending'}${courierTracking ? ` - #${courierTracking}` : ''})`
      : `Asset Delivery: ☁️ Cloud Link (${driveLink ? 'Attached' : 'Pending Link'})`;

    const item = {
      id: `photo-${selectedService.id}-${Date.now()}`,
      title: `${selectedService.title || selectedService.name} (${qty} ${unitLabel})`,
      name: `${selectedService.title || selectedService.name} (${qty} ${unitLabel})`,
      telugu: selectedService.telugu,
      category: 'Photo Editing & Designing',
      image: '/images/opt/weddingalbums-talambraluw800.webp',
      price: finalPrice,
      quantity: 1,
      configDetails: [
        `Quantity: ${qty} ${unitLabel}`,
        `Rate: ₹${unitPrice} per ${unitLabel}`,
        `SLA: ${selectedService.turnaround || '24-48 Hours'}`,
        `Special Instructions: ${instructions || 'Skin smoothing, frequency separation & color grading'}`,
        assetConfigBadge
      ],
      assetMethod,
      courierCompany,
      courierTracking,
      driveLink,
      instructions
    };
    if (addToCart) addToCart(item);
    setSelectedService(null);
    if (goToCheckout) navigate('/checkout');
    else if (toggleCart) toggleCart();
  };

  return (
    <div className="shop-page">
      <div className="container">
        
        {/* Hero Section */}
        {/* Hero Section */}
        <header className="shop-hero">
          <div className="shop-badge">
            <Sparkles size={14} />
            {lang === 'TE' ? 'అధికారిక లగ్జరీ స్టోర్‌ఫ్రంట్' : 'Official Heirloom Storefront'}
          </div>
          <h1 className="shop-title">
            {lang === 'TE' 
              ? 'ఫొటో ఎడిటింగ్, వెడ్డింగ్ ఆల్బమ్స్, వీడియో & ఫ్లెక్స్' 
              : 'Photo Editing, Heirloom Albums, 4K Video & Event Flex'}
          </h1>
          <p className="shop-subtitle">
            {lang === 'TE'
              ? 'ప్రత్యేకమైన 100% ఇన్-హౌస్ పోస్ట్-ప్రొడక్షన్ & ల్యాబ్ ప్రింటింగ్. ఫొటో రీటచింగ్, రాయల్ కరిజ్మా ఆల్బమ్స్, 4K సినిమాటిక్ వీడియోలు మరియు ఏ సైజులోనైనా ఫ్లెక్స్ బ్యానర్లు.'
              : 'Direct studio e-commerce store with transparent per-sheet & upfront pricing. Order pure digital photo editing, handcrafted lay-flat albums, 4K video post-production, or custom flex of all sizes.'}
          </p>
        </header>

        {/* Universal Support & Consultation Bar */}
        <aside className="shop-support-bar glass-3d" aria-label="Customer Support">
          <div className="shop-support-info">
            <div className="support-badge">
              <Sparkles size={14} /> Need Help or Custom Sizing?
            </div>
            <h3 className="support-title">Talk Directly to Our Lab Specialists & Designers</h3>
            <p className="support-desc">
              Have questions about wedding albums, 4K video editing, photo retouching, or custom flex sizes of any dimension? We are available via WhatsApp and phone 7 days a week.
            </p>
            <div className="support-topic-chips">
              <button 
                type="button" 
                className="support-topic-chip"
                onClick={() => handleWhatsAppSupport("Hi WeddingAlbums.in, I'd like to ask about digital photo editing & retouching rates.")}
              >
                🎨 Photo Editing Support
              </button>
              <button 
                type="button" 
                className="support-topic-chip"
                onClick={() => handleWhatsAppSupport("Hi WeddingAlbums.in, I'd like to ask about custom heirloom album sizes, paper finishes and luxury covers.")}
              >
                📖 Custom Album Sizing
              </button>
              <button 
                type="button" 
                className="support-topic-chip"
                onClick={() => handleWhatsAppSupport("Hi WeddingAlbums.in, I'd like to ask about 4K cinematic video editing packages and multicam sync.")}
              >
                🎬 4K Video Packages
              </button>
              <button 
                type="button" 
                className="support-topic-chip"
                onClick={() => handleWhatsAppSupport("Hi WeddingAlbums.in, I need a custom flex banner size for my event venue. Can you provide pricing for custom dimensions?")}
              >
                🚩 Custom Flex of Any Size
              </button>
            </div>
          </div>
          <div className="shop-support-actions">
            <button
              type="button"
              className="btn-whatsapp-direct"
              onClick={() => handleWhatsAppSupport(`Hi WeddingAlbums.in, I'm browsing your services store and need support choosing the right package or custom sizing.`)}
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </button>
            <a
              href={`tel:${labPhone.replace(/\s+/g, '')}`}
              className="btn-phone-direct"
            >
              <Phone size={18} /> Call: {labPhone}
            </a>
          </div>
        </aside>

        {/* Main Category Tabs */}
        <nav className="shop-tabs" aria-label="Catalog Categories">
          <button 
            type="button" 
            className={`shop-tab-btn ${activeTab === 'editing' ? 'active' : ''}`}
            onClick={() => setActiveTab('editing')}
          >
            <Camera size={18} />
            {lang === 'TE' ? 'ఫొటో ఎడిటింగ్ & డిజైనింగ్' : 'Photo Editing & Designing'}
          </button>

          <button 
            type="button" 
            className={`shop-tab-btn ${activeTab === 'albums' ? 'active' : ''}`}
            onClick={() => setActiveTab('albums')}
          >
            <BookOpen size={18} />
            {lang === 'TE' ? 'ఆల్బమ్స్ (ఎడిటింగ్ + ప్రింటింగ్)' : 'Album Editing + Printing'}
          </button>

          <button 
            type="button" 
            className={`shop-tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <Video size={18} />
            {lang === 'TE' ? 'సినిమాటిక్ వీడియో సర్వీసెస్' : 'Cinematic Video Services'}
          </button>

          <button 
            type="button" 
            className={`shop-tab-btn ${activeTab === 'flex' ? 'active' : ''}`}
            onClick={() => setActiveTab('flex')}
          >
            <Gift size={18} />
            {lang === 'TE' ? 'ఫ్లెక్స్ & కస్టమ్ సైజులు' : 'Flex of All Sizes & Invites'}
          </button>

          <button 
            type="button" 
            className={`shop-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Sparkles size={18} />
            {lang === 'TE' ? 'అన్నీ చూడండి' : 'View All'}
          </button>
        </nav>

        {/* Orientation Sub-Filter (Visible when viewing albums) */}
        {(activeTab === 'albums' || activeTab === 'all') && (
          <div className="sub-filter-bar">
            <span style={{ fontSize: '0.85rem', color: '#71717a', marginRight: '0.5rem' }}>
              <Filter size={14} style={{ display: 'inline', marginRight: 4 }} /> 
              {lang === 'TE' ? 'ఓరియంటేషన్:' : 'Orientation:'}
            </span>
            <button 
              type="button"
              className={`sub-filter-pill ${orientationFilter === 'all' ? 'active' : ''}`}
              onClick={() => setOrientationFilter('all')}
            >
              All Formats ({albumSizes.length})
            </button>
            <button 
              type="button"
              className={`sub-filter-pill ${orientationFilter === 'landscape' ? 'active' : ''}`}
              onClick={() => setOrientationFilter('landscape')}
            >
              ↔️ Landscape Panoramic ({albumSizes.filter(s => s.orientation === 'landscape').length})
            </button>
            <button 
              type="button"
              className={`sub-filter-pill ${orientationFilter === 'portrait' ? 'active' : ''}`}
              onClick={() => setOrientationFilter('portrait')}
            >
              ↕️ Portrait Royal Magazine ({albumSizes.filter(s => s.orientation === 'portrait').length})
            </button>
          </div>
        )}

        {/* 0. PHOTO EDITING & ALBUM DESIGNING (PURE DIGITAL POST-PRODUCTION) */}
        {(activeTab === 'editing' || activeTab === 'all') && (
          <div style={{ marginBottom: '4rem' }} id="dept-editing">
            {activeTab === 'all' && (
              <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem', borderLeft: '4px solid var(--gold-primary)', paddingLeft: '1rem' }}>
                🎨 {lang === 'TE' ? 'ఫొటో ఎడిటింగ్ & ఆల్బమ్ డిజైనింగ్' : 'Photo Editing & Album Designing (Digital)'}
              </h2>
            )}

            {/* Photo Editing Market Standards & Info Bar */}
            <div className="market-info-bar">
              <div className="market-badges-row">
                <span className="market-badge">✨ High-End Frequency Separation (Authentic Skin Micro-Pores)</span>
                <span className="market-badge">👑 24K Temple Gold & Diamond Jewelry Specular Shine</span>
                <span className="market-badge">📐 300 DPI Lab-Ready PSD Spreads (Zero Gutter Loss)</span>
                <span className="market-badge">⚡ 24 to 48 Hours Rapid Turnaround</span>
              </div>
            </div>

            <div className="shop-grid">
              {photoServices.map((photo) => {
                const price = photo.clientPrice || 45;
                const unit = photo.unit || (photo.id?.includes('psd') || photo.id?.includes('spread') ? 'per spread' : 'per photo');

                return (
                  <article key={photo.id} className="product-card">
                    <div className="product-card-image-wrapper" style={{ height: '160px' }}>
                      <img src="/images/opt/weddingalbums-talambraluw800.webp" alt={photo.title} className="product-card-image" loading="lazy" />
                      <div className="card-image-gradient" />
                      <div className="product-card-header" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                        <span className="orientation-tag landscape" style={{ color: 'var(--gold-primary)', borderColor: 'rgba(212,175,55,0.3)' }}>
                          ⏱️ {photo.turnaround || '24-48h SLA'}
                        </span>
                        <span className="product-badge">
                          Digital Post-Production
                        </span>
                      </div>
                    </div>

                    <div className="product-card-body" style={{ marginTop: '0.75rem' }}>
                      <div className="card-service-type-badge complete-suite">
                        🎨 100% IN-HOUSE EDITING UNIT
                      </div>
                      <h3 className="product-name">{photo.title}</h3>
                      {photo.telugu && <div className="product-telugu">{photo.telugu}</div>}
                      <p className="product-desc">{photo.desc}</p>

                      <ul className="card-checklist">
                        <li><span className="card-checklist-check">✓</span> <span>Frequency Separation & Blemish Cleanup</span></li>
                        <li><span className="card-checklist-check">✓</span> <span>22K/24K Gold Jewelry Luster & Saree Contrast</span></li>
                        <li><span className="card-checklist-check">✓</span> <span>Telugu Ritual Pacing & Elegant Typography</span></li>
                      </ul>

                      <div className="price-strip">
                        <div className="per-sheet-highlight">
                          <span className="per-sheet-label">Direct Rate</span>
                          <span className="per-sheet-rate">
                            ₹{price} <small style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>/ {unit}</small>
                          </span>
                        </div>
                      </div>

                      {renderCardSupportPrompt(photo.title, 'photo')}
                    </div>

                    <div className="product-card-footer">
                      <button 
                        type="button" 
                        onClick={() => openServiceModal(photo, 'photo')} 
                        className="btn-customize"
                      >
                        <Sliders size={16} />
                        {lang === 'TE' ? 'కాన్ఫిగర్ & ఆర్డర్ చేయండి' : 'Configure & Order Editing'} <ArrowRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* 1. ALBUM SIZES SECTION */}
        {(activeTab === 'albums' || activeTab === 'all') && (
          <div style={{ marginBottom: '4rem' }}>
            {activeTab === 'all' && (
              <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem', borderLeft: '4px solid var(--gold-primary)', paddingLeft: '1rem' }}>
                📖 {lang === 'TE' ? 'వెడ్డింగ్ ఆల్బమ్స్ (పర్-షీట్ ధరలు)' : 'Heirloom Wedding Albums (Per-Sheet Pricing)'}
              </h2>
            )}

            {/* Album Market Standards & Info Bar */}
            <div className="market-info-bar">
              <div className="market-badges-row">
                <span className="market-badge">🖨️ HP Indigo 12000 HD & Fuji Silver Halide</span>
                <span className="market-badge">📖 180° Seamless Panoramic Layflat (Zero Gutter Loss)</span>
                <span className="market-badge">🛡️ 200-Year Archival Life · 100% Waterproof</span>
                <span className="market-badge">🚚 Asset Handover: Cloud Link OR Courier Pen Drive to Lab</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAlbumGuide(!showAlbumGuide)} 
                className="btn-guide-toggle"
              >
                <Info size={15} /> 
                {showAlbumGuide ? 'Hide Lab Quality & Paper Guide' : 'View Lab Quality & Paper Guide'}
                {showAlbumGuide ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>

            {showAlbumGuide && (
              <div className="market-guide-panel">
                <div className="guide-grid">
                  <div className="guide-card">
                    <h4>💎 180° Layflat Binding Guarantee</h4>
                    <p>Every album opens completely 100% flat with seamless panoramic spreads. Zero gutter split ensures bride & groom faces in the center fold stay intact with zero image loss.</p>
                  </div>
                  <div className="guide-card">
                    <h4>🛡️ Archival Longevity & Protection</h4>
                    <p>200-year archival rating with thermal lamination. 100% waterproof and tear-resistant. Spilled water, puja turmeric, or fingerprints wipe clean without damage.</p>
                  </div>
                  <div className="guide-card">
                    <h4>✨ 6 Archival Paper Textures</h4>
                    <p>NTR Matte (anti-glare), 24K Metallic Pearl Gold (wedding silks), Royal Velvet (soft touch), Pure Silk Pattu (woven grain), Sparkle Glitter, and Fuji DP2 Professional.</p>
                  </div>
                  <div className="guide-card">
                    <h4>📦 Dual Asset Handover</h4>
                    <p>Provide photos via WeTransfer/Drive or courier your Pen Drive / Hard Disk directly to our Central Lab in Guntur. Returned safely inside your luxury album box.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="shop-grid">
              {filteredSizes.map((size) => {
                const perSheet = size.clientPricePerSheet || Math.round((size.clientBasePrice || 4500) / 30);
                const basePrice = size.clientBasePrice || (perSheet * 30);
                const productImage = size.image || ALBUM_IMAGES[size.id] || '/images/weddingalbums-layflat-album.png';

                return (
                  <article key={size.id} className="product-card">
                    <div className="product-card-image-wrapper">
                      <img 
                        src={productImage} 
                        alt={size.name} 
                        className="product-card-image"
                        loading="lazy"
                      />
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

                      {/* Service Clarity Checklist */}
                      <ul className="card-checklist">
                        <li><span className="card-checklist-check">✓</span> <span>Master Telugu Karizma Layout & RAW Skin Retouching</span></li>
                        <li><span className="card-checklist-check">✓</span> <span>HP Indigo 12000 Layflat Archival Print (0% Gutter Loss)</span></li>
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

                      {renderCardSupportPrompt(size.name, 'album')}
                    </div>

                    <div className="product-card-footer">
                      <button 
                        type="button"
                        onClick={() => openAlbumModal(size)}
                        className="btn-customize"
                      >
                        <Sliders size={16} />
                        {lang === 'TE' ? 'కాన్ఫిగర్ & ఆర్డర్ చేయండి' : 'Configure & Order'}
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
          </div>
        )}

        {/* 2. PAPER STYLES & FINISHES */}
        {(activeTab === 'sheets' || activeTab === 'all') && (
          <div style={{ marginBottom: '4rem' }}>
            {activeTab === 'all' && (
              <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem', borderLeft: '4px solid var(--gold-primary)', paddingLeft: '1rem' }}>
                🧻 {lang === 'TE' ? 'షీట్ల రకాలు & సర్ఫేస్ ఫినిషెస్' : 'Archival Paper Types & Surface Finishes'}
              </h2>
            )}

            <div className="shop-grid">
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
                        <span className="product-badge" style={{ background: `${sheet.color}20`, color: sheet.color }}>
                          {sheet.tier === 'standard' ? 'Standard Core' : 'Luxury Surface'}
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
                        {lang === 'TE' ? 'ఈ షీట్‌తో బుక్ చేయండి' : 'Configure Album With This Sheet'} <ArrowRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. VIDEO EDITING FOR ALL EVENTS */}
        {(activeTab === 'video' || activeTab === 'all') && (
          <div style={{ marginBottom: '4rem' }}>
            {activeTab === 'all' && (
              <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem', borderLeft: '4px solid #9C27B0', paddingLeft: '1rem' }}>
                🎬 {lang === 'TE' ? 'సినిమాటిక్ వీడియో ఎడిటింగ్' : 'Cinematic Video Editing for All Events'}
              </h2>
            )}

            {/* Video Market Standards & Info Bar */}
            <div className="market-info-bar">
              <div className="market-badges-row">
                <span className="market-badge">🎨 DaVinci Resolve Studio ACES Color Science</span>
                <span className="market-badge">🎵 Classical Telugu Nadaswaram & Mangala Vaadhyam Stems</span>
                <span className="market-badge">⏱️ 45m / 1hr / 2hr Documentary & 9:16 Instagram Reels</span>
                <span className="market-badge">⚡ 24-Hour Express Turnaround Available</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowVideoGuide(!showVideoGuide)} 
                className="btn-guide-toggle"
              >
                <Info size={15} /> 
                {showVideoGuide ? 'Hide Video Lab & Multicam Guide' : 'View Video Lab & Multicam Guide'}
                {showVideoGuide ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>

            {showVideoGuide && (
              <div className="market-guide-panel">
                <div className="guide-grid">
                  <div className="guide-card">
                    <h4>🎬 Multicam Synchronization</h4>
                    <p>Multi-angle timecode and waveform sync for up to 4 cameras (Bride entry, Groom stage, Drone & Crowd) paired with sound console line-in audio stems.</p>
                  </div>
                  <div className="guide-card">
                    <h4>🎨 South Indian Skin Tone Science</h4>
                    <p>Color grading calibrated specifically for Indian bridal skin tones, rich turmeric yellows (Pasupu), vermilion kumkum, and vibrant Kanjeevaram silk dyes.</p>
                  </div>
                  <div className="guide-card">
                    <h4>⏱️ Complete Runtime Formats</h4>
                    <p>Choose from 3-5 min trailers, 10-15 min highlights, 45 min feature films, 1 hr traditional films, or 2+ hr uncut ceremony documentaries with chapter index.</p>
                  </div>
                  <div className="guide-card">
                    <h4>📦 Footage Dispatch via Courier</h4>
                    <p>Avoid slow home broadband! Courier your camera memory cards or portable SSD/HDD to our Guntur Lab. Returned safely in your delivery box.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="shop-grid">
              {videoServices.map((video) => {
                const price = video.clientPrice || video.price || 0;
                return (
                  <article key={video.id} className="product-card">
                    <div className="product-card-image-wrapper" style={{ height: '160px' }}>
                      <img src="/images/cinematic-video-suite.jpg" alt={video.title} className="product-card-image" loading="lazy" />
                      <div className="card-image-gradient" />
                      <div className="product-card-header" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                        <span className="orientation-tag landscape" style={{ color: '#c084fc', borderColor: 'rgba(168,85,247,0.3)' }}>
                          ⏱️ {video.turnaround || '48h SLA'}
                        </span>
                        <span className="product-badge">
                          4K Dolby Color
                        </span>
                      </div>
                    </div>

                    <div className="product-card-body" style={{ marginTop: '0.75rem' }}>
                      <div className="card-service-type-badge video-badge">
                        🎬 4K CINEMATIC VIDEO EDITING
                      </div>
                      <h3 className="product-name">{video.title}</h3>
                      {video.telugu && <div className="product-telugu">{video.telugu}</div>}
                      <p className="product-desc">{video.desc}</p>

                      <ul className="card-checklist">
                        <li><span className="card-checklist-check">✓</span> <span>DaVinci Resolve Wide Gamut Color Grading</span></li>
                        <li><span className="card-checklist-check">✓</span> <span>2–4 Multi-Camera Audio & Waveform Sync</span></li>
                        <li><span className="card-checklist-check">✓</span> <span>Classical Nadaswaram & Ritual Audio Stems</span></li>
                      </ul>

                      <div className="price-strip">
                        <div className="per-sheet-highlight">
                          <span className="per-sheet-label">Package Price</span>
                          <span className="per-sheet-rate">
                            ₹{Number(price).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {renderCardSupportPrompt(video.title, 'video')}
                    </div>

                    <div className="product-card-footer">
                      <button 
                        type="button" 
                        onClick={() => openServiceModal(video, 'video')} 
                        className="btn-customize"
                      >
                        <Sliders size={16} />
                        {lang === 'TE' ? 'కాన్ఫిగర్ & ఆర్డర్ చేయండి' : 'Configure & Order Video'} <ArrowRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. WHATSAPP INVITES & EVENT FLEX */}
        {(activeTab === 'flex' || activeTab === 'all') && (
          <div style={{ marginBottom: '4rem' }}>
            {activeTab === 'all' && (
              <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem', borderLeft: '4px solid #2E7D32', paddingLeft: '1rem' }}>
                💌 {lang === 'TE' ? 'వాట్సాప్ వీడియో ఆహ్వానాలు & ఈవెంట్ ఫ్లెక్స్' : 'WhatsApp Video Invites & Event Flex'}
              </h2>
            )}

            {/* Flex Market Standards & Info Bar */}
            <div className="market-info-bar">
              <div className="market-badges-row">
                <span className="market-badge">📐 Standard Sizes & Any Custom ft × ft Dimensions</span>
                <span className="market-badge">🌟 440 GSM Heavy Blackout Matte (Zero Flash Glare)</span>
                <span className="market-badge">🎨 Custom Telugu Design (+₹499) with Shlokas & Venue Map QR</span>
                <span className="market-badge">📦 Shipped in Heavy Cylindrical PVC Pipe (Zero Creases)</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowFlexGuide(!showFlexGuide)} 
                className="btn-guide-toggle"
              >
                <Info size={15} /> 
                {showFlexGuide ? 'Hide Flex Material & Sizing Guide' : 'View Flex Material & Sizing Guide'}
                {showFlexGuide ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>

            {showFlexGuide && (
              <div className="market-guide-panel">
                <div className="guide-grid">
                  <div className="guide-card">
                    <h4>✨ Any Custom Size You Want</h4>
                    <p>Choose standard sizes (10×8 ft, 8×6 ft, 6×4 ft, 6×3 ft standee) or input your exact Width ft × Height ft with live sq.ft calculation at commercial lab rates (₹30/sq.ft).</p>
                  </div>
                  <div className="guide-card">
                    <h4>🌟 440 GSM Blackout Matte (Anti-Glare)</h4>
                    <p>Zero flash bounce for wedding photographers. 100% blackout backing blocks stage lighting shadows from showing through. Tear-proof and anti-curl.</p>
                  </div>
                  <div className="guide-card">
                    <h4>🎨 Telugu Cultural Designing</h4>
                    <p>In-house graphic designers integrate couple photo cutout blending, Lord Venkateswara / Ganesha blessings, traditional Telugu wedding shlokas, and venue map QR code.</p>
                  </div>
                  <div className="guide-card">
                    <h4>📦 Zero-Crease PVC Tube Delivery</h4>
                    <p>Banners are never folded. Every flex banner is rolled securely inside a heavy-duty cylindrical PVC pipe to ensure pristine, crease-free delivery.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Sizing & Direct Support Callout */}
            <div className="flex-custom-callout glass-3d" style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                  <Sparkles size={16} /> Need Any Custom Venue Dimensions or Stage Framing?
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', maxWidth: '650px', lineHeight: 1.5 }}>
                  Ask for whatever custom sizes you want (Width ft × Height ft at ₹{catalog.ratePerSqFtClient || 30}/sq.ft)! Or contact our lab specialist directly for custom scaffolding banners, truss framing, and same-day delivery.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowCustomFlexModal(true)}
                  style={{ background: 'rgba(212,175,55,0.18)', color: 'var(--gold-primary)', border: '1px solid rgba(212,175,55,0.45)', padding: '0.65rem 1.15rem', borderRadius: '8px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                  <Sliders size={16} /> 📐 Ask for Custom Size
                </button>
                <button
                  type="button"
                  className="btn btn-whatsapp-direct"
                  onClick={() => handleWhatsAppSupport(`Hi WeddingAlbums.in, I need a custom flex size for my event venue. Can you provide pricing and delivery timeline?`)}
                  style={{ background: '#25D366', color: '#fff', border: 'none', padding: '0.65rem 1.15rem', borderRadius: '8px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                >
                  <MessageCircle size={16} /> Ask on WhatsApp
                </button>
                <a
                  href={`tel:${labPhone.replace(/\s+/g, '')}`}
                  className="btn btn-phone-direct"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.65rem 1.15rem', borderRadius: '8px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                >
                  <Phone size={16} /> Call: {labPhone}
                </a>
              </div>
            </div>

            <div className="shop-grid">
              {/* Feature: Custom Size Interactive Card */}
              <article className="product-card" style={{ border: '2px dashed rgba(74,222,128,0.5)', background: 'rgba(74,222,128,0.02)' }}>
                <div className="product-card-image-wrapper" style={{ height: '160px', background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, rgba(0,0,0,0.6) 100%)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#4ade80' }}>
                    <Sliders size={36} style={{ marginBottom: '0.5rem' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em' }}>ANY CUSTOM SIZE YOU WANT</span>
                  </div>
                  <div className="product-card-header" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                    <span className="orientation-tag landscape" style={{ color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }}>
                      📐 Width ft × Height ft
                    </span>
                    <span className="product-badge" style={{ background: 'rgba(74,222,128,0.2)', color: '#4ade80' }}>
                      ₹{catalog.ratePerSqFtClient || 30} / sq.ft
                    </span>
                  </div>
                </div>

                <div className="product-card-body" style={{ marginTop: '0.75rem' }}>
                  <div className="card-service-type-badge flex-badge">
                    ✨ CUSTOM DIMENSION ENGINE
                  </div>
                  <h3 className="product-name">Custom Dimensions Flex Banner</h3>
                  <div className="product-telugu">మీకు కావలసిన ఏ సైజులోనైనా ఫ్లెక్స్ బ్యానర్</div>
                  <p className="product-desc">
                    Enter whatever custom Width in Feet and Height in Feet you want for live square-foot math. Ideal for odd stage backdrops, entrance arches, and photo walls.
                  </p>

                  <ul className="card-checklist">
                    <li><span className="card-checklist-check">✓</span> <span>Specify Any Exact Width (ft) & Height (ft)</span></li>
                    <li><span className="card-checklist-check">✓</span> <span>Heavy 440 GSM Blackout or Standard 340 GSM</span></li>
                    <li><span className="card-checklist-check">✓</span> <span>Brass Eyelets, Pole Pockets & Retractable Stand</span></li>
                  </ul>

                  <div className="price-strip">
                    <div className="per-sheet-highlight">
                      <span className="per-sheet-label">Base Rate</span>
                      <span className="per-sheet-rate">
                        ₹{catalog.ratePerSqFtClient || 30} <small style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>/ sq.ft</small>
                      </span>
                    </div>
                  </div>

                  {renderCardSupportPrompt('Custom Flex Dimensions', 'flex')}
                </div>

                <div className="product-card-footer" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      const flexItem = flexServices.find(f => !f.id?.includes('invite')) || flexServices[0] || { id: 'flex-custom', title: 'Custom Flex Banner' };
                      openServiceModal(flexItem, 'flex');
                      setFlexSize('custom');
                    }} 
                    className="btn-customize"
                    style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', color: '#fff', flex: 1 }}
                  >
                    <Sliders size={16} />
                    {lang === 'TE' ? 'కస్టమ్ సైజును ఎంటర్ చేయండి' : 'Enter Custom Size & Price'} <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomFlexModal(true)}
                    className="btn"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                    title="Ask for whatever custom size you want"
                  >
                    Ask Custom Size
                  </button>
                </div>
              </article>

              {flexServices.map((flex) => {
                const price = flex.clientPrice || flex.price || 0;
                const isInvite = flex.id?.includes('invite') || flex.title?.toLowerCase().includes('whatsapp');
                return (
                  <article key={flex.id} className="product-card">
                    <div className="product-card-image-wrapper" style={{ height: '160px' }}>
                      <img src="/images/opt/weddingalbums-home-herow1600.webp" alt={flex.title} className="product-card-image" loading="lazy" />
                      <div className="card-image-gradient" />
                      <div className="product-card-header" style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                        <span className="orientation-tag landscape" style={{ color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }}>
                          🚚 {flex.turnaround || '2 Days Dispatch'}
                        </span>
                        <span className="product-badge">
                          Waterproof Print
                        </span>
                      </div>
                    </div>

                    <div className="product-card-body" style={{ marginTop: '0.75rem' }}>
                      <div className="card-service-type-badge flex-badge">
                        🚩 EVENT FLEX & SIGNAGE
                      </div>
                      <h3 className="product-name">{flex.title}</h3>
                      {flex.telugu && <div className="product-telugu">{flex.telugu}</div>}
                      <p className="product-desc">{flex.desc}</p>

                      <ul className="card-checklist">
                        <li><span className="card-checklist-check">✓</span> <span>Standard Sizes & Custom ft × ft Dimensions</span></li>
                        <li><span className="card-checklist-check">✓</span> <span>440 GSM Blackout Matte (Zero Flash Glare)</span></li>
                        <li><span className="card-checklist-check">✓</span> <span>Shipped Rolled in Cylindrical PVC Pipe</span></li>
                      </ul>

                      <div className="price-strip">
                        <div className="per-sheet-highlight">
                          <span className="per-sheet-label">Direct Price</span>
                          <span className="per-sheet-rate">
                            ₹{Number(price).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {renderCardSupportPrompt(flex.title, 'flex')}
                    </div>

                    <div className="product-card-footer">
                      <button 
                        type="button" 
                        onClick={() => openServiceModal(flex, isInvite ? 'invite' : 'flex')} 
                        className="btn-customize"
                      >
                        <Sliders size={16} />
                        {isInvite ? 'Configure Video Invite' : 'Configure Flex Size & Design'} <ArrowRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. LUXURY ALBUM PRODUCT CONFIGURATOR MODAL
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
              {/* 1. Service Scope Toggle */}
              <div>
                <div className="config-section-title">
                  <Palette size={16} /> 1. Service Scope (Design + Print vs Print-Only)
                </div>
                <div className="options-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                  {ALBUM_SERVICE_SCOPES.map(scope => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setAlbumScope(scope.id)}
                      className={`option-card-btn ${albumScope === scope.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{scope.name}</div>
                      <div className="option-subtitle">{scope.desc}</div>
                      <div className="option-price-tag">
                        {scope.priceDelta === 0 ? 'Full Service (Standard)' : `${scope.priceDelta} Discount`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Sheets Slider & Count (Up to 150 Sheets) */}
              <div>
                <div className="config-section-title">
                  <BookOpen size={16} /> 2. Number of Sheets (Spreads) — Up to 150 Sheets
                </div>
                <div className="sheet-slider-card">
                  <div className="sheet-header-row">
                    <div>
                      <span style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>Album Thickness:</span>
                      <div style={{ fontSize: '0.8rem', color: '#71717a' }}>{sheets * 2} Pages (Spreads)</div>
                    </div>
                    <div className="sheet-count-display">
                      {sheets} Sheets
                    </div>
                  </div>

                  <input 
                    type="range" 
                    min={selectedAlbum?.minSheets || 20} 
                    max={selectedAlbum?.maxSheets || 150} 
                    step={1} 
                    value={sheets}
                    onChange={e => setSheets(Number(e.target.value))}
                    className="sheet-slider"
                  />

                  {/* Preset Quick-Select Pills */}
                  <div className="sheet-presets-container">
                    <span style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                      Quick Sheet Presets:
                    </span>
                    <div className="sheet-preset-row">
                      {[
                        { count: 20, label: '20 Sh (Slim)' },
                        { count: 30, label: '30 Sh (Standard)' },
                        { count: 50, label: '50 Sh (Celebration)' },
                        { count: 75, label: '75 Sh (Grand)' },
                        { count: 100, label: '100 Sh (Royal)' },
                        { count: 150, label: '150 Sh (Max Heirloom)' }
                      ].map(preset => (
                        <button
                          key={preset.count}
                          type="button"
                          className={`sheet-preset-btn ${sheets === preset.count ? 'active' : ''}`}
                          onClick={() => setSheets(preset.count)}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Photo Capacity Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div className="photo-capacity-badge">
                      <span>📸 Accommodates ≈ <strong>{sheets * 4}–{sheets * 5}</strong> High-Res Photos</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
                      30 Base Included · {sheets > 30 ? `+${sheets - 30} Extra Sheets (@ ₹${selectedAlbum?.clientPricePerSheet || 260}/sh)` : 'No Extra Sheet Charges'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Paper Substrate Selection */}
              <div>
                <div className="config-section-title">
                  <Layers size={16} /> 3. Paper Substrate & Surface Finish
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

              {/* 4. Luxury Master Cover Selection */}
              <div>
                <div className="config-section-title">
                  <Sparkles size={16} /> 4. Luxury Master Presentation Cover
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
                        {cover.image && (
                          <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px', border: '1px solid rgba(212,175,55,0.2)' }}>
                            <img src={cover.image} alt={cover.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
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

              {/* 5. Dual Asset Handover (Cloud vs Courier Pen Drive to Lab) */}
              {renderAssetHandoverSection('RAW Wedding Photos')}

              {/* Consultation & Custom Sizing Support */}
              {renderModalSupportStrip(selectedAlbum?.name, `Hi WeddingAlbums.in, I'm customizing ${selectedAlbum?.name} with ${sheets} sheets and need advice on custom sizes, paper finishes or luxury covers.`)}
            </div>

            <div className="modal-footer">
              <div className="modal-total-box">
                <span className="modal-total-label">
                  Configured Price ({sheets} Sheets):
                </span>
                <span className="modal-total-price">
                  ₹{Number(calculateConfiguredAlbumPrice()).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => handleAddToCartAlbum(false)} className="btn-modal-add-cart">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button type="button" onClick={() => handleAddToCartAlbum(true)} className="btn-buy-now">
                  Buy Now <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. ADVANCED FLEX BANNER CONFIGURATOR MODAL
          ───────────────────────────────────────────────────────────── */}
      {selectedService && selectedService.serviceType === 'flex' && (
        <div className="configurator-overlay" onClick={() => setSelectedService(null)}>
          <div className="configurator-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>🚩 {selectedService.title || 'Wedding Mandap Flex Banner'}</h2>
                <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                  High-resolution solvent & eco-solvent outdoor weatherproof printing
                </span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedService(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* 1. Flex Dimensions Selection */}
              <div>
                <div className="config-section-title">
                  <Sliders size={16} /> 1. Select Flex Dimensions (Standard Wedding Sizes or Custom)
                </div>
                <div className="options-grid">
                  {FLEX_SIZES.map(size => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setFlexSize(size.id)}
                      className={`option-card-btn ${flexSize === size.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{size.name}</div>
                      <div className="option-subtitle">{size.label}</div>
                      <div className="option-price-tag">
                        {size.isCustom ? '₹30 / sq.ft (Any Size)' : `Base Print: ₹${size.price.toLocaleString('en-IN')}`}
                      </div>
                    </button>
                  ))}
                </div>

                {flexSize === 'custom' && (
                  <div style={{ marginTop: '0.85rem', padding: '1rem', background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 10 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gold-primary)', marginBottom: '0.5rem' }}>
                      ✨ Enter Whatever Custom Dimensions You Want (Width × Height in Feet):
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.25rem' }}>Width in Feet (e.g. 15 or 12.5):</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="100"
                          step="0.5"
                          value={customWidthFt} 
                          onChange={e => setCustomWidthFt(e.target.value)}
                          className="config-input"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.25rem' }}>Height in Feet (e.g. 9 or 8.5):</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="100"
                          step="0.5"
                          value={customHeightFt} 
                          onChange={e => setCustomHeightFt(e.target.value)}
                          className="config-input"
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.25rem' }}>
                        Custom Dimensions & Venue Requirements (what size or shape do you need?):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 15×8.5 ft entrance arch, curved stage frame, pole pockets top & bottom, circular cutout..."
                        value={customFlexNotes}
                        onChange={e => setCustomFlexNotes(e.target.value)}
                        className="config-input"
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', background: 'rgba(0,0,0,0.25)', padding: '0.75rem 0.85rem', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#e4e4e7' }}>
                        Calculated Area: <strong>{Math.round((parseFloat(customWidthFt) || 0) * (parseFloat(customHeightFt) || 0))} sq.ft</strong> · Base Print Cost: <strong>₹{Math.max(450, Math.round((parseFloat(customWidthFt) || 0) * (parseFloat(customHeightFt) || 0) * (catalog.ratePerSqFtClient || 30))).toLocaleString('en-IN')}</strong> (₹{catalog.ratePerSqFtClient || 30}/sq.ft)
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleWhatsAppCustomFlex()}
                          style={{ background: '#25D366', color: '#fff', border: 'none', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                        >
                          <MessageCircle size={14} /> Ask This Size on WhatsApp
                        </button>
                        <a
                          href={`tel:${labPhone.replace(/\s+/g, '')}`}
                          style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                        >
                          <Phone size={14} /> Call
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Graphic Design & Editing Option */}
              <div>
                <div className="config-section-title">
                  <Palette size={16} /> 2. Graphic Design & Editing Service
                </div>
                <div className="options-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                  {FLEX_DESIGN_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFlexDesignOption(opt.id)}
                      className={`option-card-btn ${flexDesignOption === opt.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{opt.name}</div>
                      <div className="option-subtitle">{opt.desc}</div>
                      <div className="option-price-tag">
                        {opt.price === 0 ? 'Included (₹0)' : `+₹${opt.price} Custom Design Fee`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Substrate Material Selection */}
              <div>
                <div className="config-section-title">
                  <Layers size={16} /> 3. Material & Substrate Quality
                </div>
                <div className="options-grid">
                  {FLEX_MATERIALS.map(mat => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => setFlexMaterial(mat.id)}
                      className={`option-card-btn ${flexMaterial === mat.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{mat.name}</div>
                      <div className="option-subtitle">{mat.desc}</div>
                      <div className="option-price-tag">
                        {mat.price === 0 ? 'Standard (₹0)' : `+₹${mat.price}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Finishing & Accessories */}
              <div>
                <div className="config-section-title">
                  <ShieldCheck size={16} /> 4. Finishing & Mounting Accessories
                </div>
                <div className="options-grid">
                  {FLEX_FINISHING.map(fin => (
                    <button
                      key={fin.id}
                      type="button"
                      onClick={() => setFlexFinishing(fin.id)}
                      className={`option-card-btn ${flexFinishing === fin.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{fin.name}</div>
                      <div className="option-subtitle">{fin.desc}</div>
                      <div className="option-price-tag">
                        {fin.price === 0 ? 'Standard (₹0)' : `+₹${fin.price}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Dual Asset Handover (Cloud vs Courier Pen Drive to Lab) */}
              {renderAssetHandoverSection('Couple Photos or Design File')}

              {/* Consultation & Custom Venue Sizing Support */}
              {renderModalSupportStrip('Wedding Flex Banner', `Hi WeddingAlbums.in, I need a custom flex banner of size: ${flexSize === 'custom' ? `${customWidthFt}ft x ${customHeightFt}ft` : flexSize}. Notes: ${customFlexNotes || 'Custom event banner'}. Please confirm quote, turnaround & delivery.`)}
            </div>

            <div className="modal-footer">
              <div className="modal-total-box">
                <span className="modal-total-label">Total Amount:</span>
                <span className="modal-total-price">
                  ₹{calculateConfiguredFlexPrice().toLocaleString('en-IN')}
                </span>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => handleAddToCartFlex(false)} className="btn-modal-add-cart">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button type="button" onClick={() => handleAddToCartFlex(true)} className="btn-buy-now">
                  Order & Checkout <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. ADVANCED 4K VIDEO EDITING CONFIGURATOR MODAL
          ───────────────────────────────────────────────────────────── */}
      {selectedService && selectedService.serviceType === 'video' && (
        <div className="configurator-overlay" onClick={() => setSelectedService(null)}>
          <div className="configurator-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>🎬 {selectedService.title}</h2>
                <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                  ⏱️ Turnaround: {videoRushAddon ? '24 Hours Express Rush' : selectedService.turnaround || '48-72 Hours'}
                </span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedService(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* 1. Target Film Duration */}
              <div>
                <div className="config-section-title">
                  <Clock size={16} /> 1. Target Film Duration (45m, 1hr, 2hr & more)
                </div>
                <div className="options-grid">
                  {VIDEO_DURATIONS.map(dur => (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => setVideoDuration(dur.id)}
                      className={`option-card-btn ${videoDuration === dur.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{dur.name}</div>
                      <div className="option-subtitle">{dur.desc}</div>
                      <div className="option-price-tag">
                        {dur.price === 0 ? 'Included in Base' : `+₹${dur.price.toLocaleString('en-IN')}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Multi-Camera Synchronization */}
              <div>
                <div className="config-section-title">
                  <Film size={16} /> 2. Multi-Camera Synchronization
                </div>
                <div className="options-grid">
                  {VIDEO_MULTICAM_OPTIONS.map(mc => (
                    <button
                      key={mc.id}
                      type="button"
                      onClick={() => setVideoMulticam(mc.id)}
                      className={`option-card-btn ${videoMulticam === mc.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{mc.name}</div>
                      <div className="option-subtitle">{mc.desc}</div>
                      <div className="option-price-tag">
                        {mc.price === 0 ? 'Standard Sync (₹0)' : `+₹${mc.price.toLocaleString('en-IN')}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Resolution */}
              <div>
                <div className="config-section-title">
                  <Film size={16} /> 3. Master Output Resolution
                </div>
                <div className="options-grid">
                  {VIDEO_RESOLUTIONS.map(res => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setVideoResolution(res.id)}
                      className={`option-card-btn ${videoResolution === res.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{res.name}</div>
                      <div className="option-subtitle">{res.desc}</div>
                      <div className="option-price-tag">Included (₹0)</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Audio & Ceremonial Soundtrack Style */}
              <div>
                <div className="config-section-title">
                  <Music size={16} /> 4. Audio & Ceremonial Soundtrack Style
                </div>
                <div className="options-grid">
                  {VIDEO_AUDIO_THEMES.map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setVideoAudioTheme(theme.id)}
                      className={`option-card-btn ${videoAudioTheme === theme.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{theme.name}</div>
                      <div className="option-subtitle">{theme.desc}</div>
                      <div className="option-price-tag">Included (₹0)</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Optional Market Add-Ons */}
              <div>
                <div className="config-section-title">
                  <Sparkles size={16} /> 5. Popular Video Add-Ons
                </div>
                <div className="options-grid">
                  {VIDEO_ADDONS.map(addon => {
                    const isSelected = addon.id === 'reels' ? videoReelsAddon : addon.id === 'drone' ? videoDroneAddon : videoRushAddon;
                    const toggleAddon = () => {
                      if (addon.id === 'reels') setVideoReelsAddon(!videoReelsAddon);
                      if (addon.id === 'drone') setVideoDroneAddon(!videoDroneAddon);
                      if (addon.id === 'rush') setVideoRushAddon(!videoRushAddon);
                    };
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={toggleAddon}
                        className={`option-card-btn ${isSelected ? 'selected' : ''}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div className="option-title">{addon.name}</div>
                          {isSelected ? <CheckSquare size={16} color="var(--gold-primary)" /> : <Square size={16} color="#71717a" />}
                        </div>
                        <div className="option-subtitle">{addon.desc}</div>
                        <div className="option-price-tag">+₹{addon.price.toLocaleString('en-IN')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Dual Asset Handover (Cloud vs Courier Pen Drive to Lab) */}
              {renderAssetHandoverSection('RAW Video Footage / Cards')}

              {/* Consultation & Custom Songs / Multi-Cam Support */}
              {renderModalSupportStrip(selectedService?.title, `Hi WeddingAlbums.in, I'm customizing ${selectedService?.title} and have a custom multi-cam or special soundtrack requirement.`)}
            </div>

            <div className="modal-footer">
              <div className="modal-total-box">
                <span className="modal-total-label">Total Amount:</span>
                <span className="modal-total-price">
                  ₹{calculateConfiguredVideoPrice().toLocaleString('en-IN')}
                </span>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => handleAddToCartVideo(false)} className="btn-modal-add-cart">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button type="button" onClick={() => handleAddToCartVideo(true)} className="btn-buy-now">
                  Order & Checkout <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. ADVANCED WHATSAPP VIDEO INVITATION CONFIGURATOR MODAL
          ───────────────────────────────────────────────────────────── */}
      {selectedService && selectedService.serviceType === 'invite' && (
        <div className="configurator-overlay" onClick={() => setSelectedService(null)}>
          <div className="configurator-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>💌 60s Animated WhatsApp Video Invitation</h2>
                <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                  Delivered in 24 hours · 1080×1920 60fps MP4 with audio
                </span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedService(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* 1. Animated Theme */}
              <div>
                <div className="config-section-title">
                  <Palette size={16} /> 1. Select Animated Theme
                </div>
                <div className="options-grid">
                  {INVITE_THEMES.map(theme => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setInviteTheme(theme.id)}
                      className={`option-card-btn ${inviteTheme === theme.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{theme.name}</div>
                      <div className="option-subtitle">{theme.desc}</div>
                      <div className="option-price-tag">Included (₹0)</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Celebration Scope */}
              <div>
                <div className="config-section-title">
                  <Sliders size={16} /> 2. Celebration Scope & Duration
                </div>
                <div className="options-grid">
                  {INVITE_SCOPES.map(scope => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setInviteScope(scope.id)}
                      className={`option-card-btn ${inviteScope === scope.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{scope.name}</div>
                      <div className="option-subtitle">{scope.desc}</div>
                      <div className="option-price-tag">
                        {scope.price === 0 ? 'Standard (₹0)' : `+₹${scope.price}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Language Selection */}
              <div>
                <div className="config-section-title">
                  <BookOpen size={16} /> 3. Language & Typography
                </div>
                <div className="options-grid">
                  {INVITE_LANGUAGES.map(langOpt => (
                    <button
                      key={langOpt.id}
                      type="button"
                      onClick={() => setInviteLanguage(langOpt.id)}
                      className={`option-card-btn ${inviteLanguage === langOpt.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{langOpt.name}</div>
                      <div className="option-price-tag">Included (₹0)</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Event Details */}
              <div>
                <div className="config-section-title">
                  <UploadCloud size={16} /> 4. Couple & Wedding Details
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input 
                    type="text" 
                    placeholder="Bride & Groom Names (and Parents names if needed)"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    className="config-input"
                  />
                  <input 
                    type="url" 
                    placeholder="Google Maps link to venue (for QR code generation)"
                    value={driveLink}
                    onChange={e => setDriveLink(e.target.value)}
                    className="config-input"
                  />
                </div>
              </div>

              {/* Consultation & Support */}
              {renderModalSupportStrip('Animated WhatsApp Video Invite', `Hi WeddingAlbums.in, I'm customizing a WhatsApp video invitation and have specific event/caricature details.`)}
            </div>

            <div className="modal-footer">
              <div className="modal-total-box">
                <span className="modal-total-label">Total Amount:</span>
                <span className="modal-total-price">
                  ₹{calculateConfiguredInvitePrice().toLocaleString('en-IN')}
                </span>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => handleAddToCartInvite(false)} className="btn-modal-add-cart">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button type="button" onClick={() => handleAddToCartInvite(true)} className="btn-buy-now">
                  Order & Checkout <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. ADVANCED PHOTO EDITING CONFIGURATOR MODAL
          ───────────────────────────────────────────────────────────── */}
      {selectedService && selectedService.serviceType === 'photo' && (
        <div className="configurator-overlay" onClick={() => setSelectedService(null)}>
          <div className="configurator-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>🎨 {selectedService.title}</h2>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.25rem' }}>
                  <span className="orientation-tag landscape" style={{ color: 'var(--gold-primary)', borderColor: 'rgba(212,175,55,0.3)' }}>
                    ⏱️ Turnaround: {selectedService.turnaround || '24-48 Hours'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                    100% In-House Post-Production
                  </span>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedService(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* 1. Number of Units / Quantity */}
              <div>
                <div className="config-section-title">
                  <Sliders size={16} /> 1. Quantity ({selectedService.unit || 'Sheets / Photos'})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setPhotoQuantity(Math.max(1, photoQuantity - 5))}
                    style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold-primary)', fontSize: '1.4rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                      {photoQuantity} <small style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>{selectedService.unit || 'units'}</small>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                      Rate: ₹{selectedService.clientPrice || 45} / {selectedService.unit || 'unit'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoQuantity(photoQuantity + 5)}
                    style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold-primary)', fontSize: '1.4rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 2. Specific Instructions */}
              <div style={{ marginTop: '1rem' }}>
                <div className="config-section-title">
                  📝 Specific Retouching & Design Guidelines
                </div>
                <textarea 
                  className="config-input" 
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="e.g., Retouch bride's skin, remove hall reflections, emphasize 24K jewelry shine, ritual-based Telugu border layout..."
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                />
              </div>

              {/* 3. Dual Asset Handover */}
              {renderAssetHandoverSection('RAW Photos / Event Assets')}

              {/* 4. Consultation & Support */}
              {renderModalSupportStrip(selectedService?.title, `Hi WeddingAlbums.in, I'm customizing ${selectedService?.title} (${photoQuantity} units) and have questions on rates or instructions.`)}
            </div>

            <div className="modal-footer">
              <div className="modal-total-box">
                <span className="modal-total-label">Total Amount:</span>
                <span className="modal-total-price">
                  ₹{calculateConfiguredPhotoPrice().toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                  ({photoQuantity} × ₹{selectedService.clientPrice || 45})
                </span>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => handleAddToCartPhoto(false)} className="btn-modal-add-cart">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button type="button" onClick={() => handleAddToCartPhoto(true)} className="btn-buy-now">
                  Order & Checkout <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. DEDICATED CUSTOM FLEX SIZING MODAL (Ask for Any Dimensions)
          ───────────────────────────────────────────────────────────── */}
      {showCustomFlexModal && (
        <div className="configurator-overlay" onClick={() => setShowCustomFlexModal(false)}>
          <div className="configurator-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <div>
                <h2>📐 Ask for Custom Flex Sizing (Any Dimension)</h2>
                <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                  Whatever size, circular arch, stage backdrop, or venue frame you need
                </span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowCustomFlexModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ padding: '0.85rem 1rem', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '10px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#dcfce7', lineHeight: 1.5, display: 'block' }}>
                  Our commercial flex lab prints any custom dimensions at <strong>₹{catalog.ratePerSqFtClient || 30} per square foot</strong>. Tell us what you want or speak directly with our production specialists.
                </span>
              </div>

              {/* Dimensions */}
              <div>
                <div className="config-section-title">
                  <Sliders size={16} /> 1. Desired Dimensions (in Feet)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.25rem' }}>Width in Feet (e.g. 15 or 12.5):</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="100"
                      step="0.5"
                      value={customWidthFt} 
                      onChange={e => setCustomWidthFt(e.target.value)}
                      className="config-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginBottom: '0.25rem' }}>Height in Feet (e.g. 9 or 8.5):</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="100"
                      step="0.5"
                      value={customHeightFt} 
                      onChange={e => setCustomHeightFt(e.target.value)}
                      className="config-input"
                    />
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#e4e4e7', marginTop: '0.5rem' }}>
                  Calculated Area: <strong>{Math.round((parseFloat(customWidthFt) || 0) * (parseFloat(customHeightFt) || 0))} sq.ft</strong> · Approximate Cost: <strong>₹{Math.max(450, Math.round((parseFloat(customWidthFt) || 0) * (parseFloat(customHeightFt) || 0) * (catalog.ratePerSqFtClient || 30))).toLocaleString('en-IN')}</strong> (@ ₹{catalog.ratePerSqFtClient || 30}/sq.ft)
                </div>
              </div>

              {/* Free-form size/venue requirement description */}
              <div style={{ marginTop: '1rem' }}>
                <div className="config-section-title">
                  📝 2. Describe Whatever Custom Size or Venue Requirements You Want
                </div>
                <textarea
                  className="config-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="e.g. 15×8.5 ft entrance arch, curved stage frame, truss pipe hanging pockets, circle 8ft diameter, or 4 welcome standees..."
                  value={customFlexNotes}
                  onChange={e => setCustomFlexNotes(e.target.value)}
                />
              </div>

              {/* Substrate Material */}
              <div style={{ marginTop: '1rem' }}>
                <div className="config-section-title">
                  <Layers size={16} /> 3. Preferred Substrate Material
                </div>
                <div className="options-grid">
                  {FLEX_MATERIALS.map(mat => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => setFlexMaterial(mat.id)}
                      className={`option-card-btn ${flexMaterial === mat.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{mat.name}</div>
                      <div className="option-subtitle">{mat.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Finishing */}
              <div style={{ marginTop: '1rem' }}>
                <div className="config-section-title">
                  <ShieldCheck size={16} /> 4. Finishing Options
                </div>
                <div className="options-grid">
                  {FLEX_FINISHING.map(fin => (
                    <button
                      key={fin.id}
                      type="button"
                      onClick={() => setFlexFinishing(fin.id)}
                      className={`option-card-btn ${flexFinishing === fin.id ? 'selected' : ''}`}
                    >
                      <div className="option-title">{fin.name}</div>
                      <div className="option-subtitle">{fin.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Support Actions */}
              {renderModalSupportStrip('Custom Flex Sizing', `Hi WeddingAlbums.in, I need a custom flex banner of size: ${customWidthFt}ft x ${customHeightFt}ft (${Math.round(customWidthFt * customHeightFt)} sq.ft). Notes: ${customFlexNotes || 'Custom event banner'}. Please confirm quote & delivery!`)}
            </div>

            <div className="modal-footer">
              <div className="modal-total-box">
                <span className="modal-total-label">Estimated Rate:</span>
                <span className="modal-total-price">
                  ₹{Math.max(450, Math.round((parseFloat(customWidthFt) || 0) * (parseFloat(customHeightFt) || 0) * (catalog.ratePerSqFtClient || 30))).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => handleWhatsAppCustomFlex()}
                  className="btn-modal-add-cart"
                  style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', border: 'none' }}
                >
                  <MessageCircle size={18} /> Ask on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const flexItem = flexServices.find(f => !f.id?.includes('invite')) || flexServices[0] || { id: 'flex-custom', title: 'Custom Flex Banner' };
                    setSelectedService({ ...flexItem, serviceType: 'flex' });
                    setFlexSize('custom');
                    setShowCustomFlexModal(false);
                    handleAddToCartFlex(false);
                  }}
                  className="btn-buy-now"
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Universal Floating Support Dock (Bottom-Right) */}
      <aside className="store-floating-support" aria-label="Quick Store Support">
        <div className="floating-support-badge">
          <Sparkles size={13} /> Store Support & Custom Sizing
        </div>
        <div className="floating-support-text">
          Have questions about albums, video, photo editing or custom flex?
        </div>
        <div className="floating-support-buttons">
          <button
            type="button"
            className="floating-support-btn wa"
            onClick={() => handleWhatsAppSupport("Hi WeddingAlbums.in, I'm browsing your store and have questions about services/custom sizing.")}
          >
            <MessageCircle size={15} /> WhatsApp Us
          </button>
          <a
            href={`tel:${labPhone.replace(/\s+/g, '')}`}
            className="floating-support-btn tel"
          >
            <Phone size={15} /> Call: {labPhone}
          </a>
        </div>
      </aside>

      {/* SEO Schema.org JSON-LD structured data for Google Shopping & Search */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Wedding Album Store & Post-Production Services",
        "description": "Direct e-commerce storefront for wedding album editing and printing, 4K video editing, event flex of all sizes, and photo retouching across AP and Telangana.",
        "provider": {
          "@type": "LocalBusiness",
          "name": "WeddingAlbums.in",
          "telephone": "+919346793364",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Vijayawada",
            "addressRegion": "Andhra Pradesh",
            "addressCountry": "IN"
          }
        }
      })}} />

    </div>
  );
}
