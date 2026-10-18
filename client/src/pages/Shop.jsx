import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Video, Gift, Layers, ShoppingBag, 
  ArrowRight, Sparkles, Filter, Flame, X, Sliders, UploadCloud,
  Check, Film, Music, Palette, CheckSquare, Square, ShieldCheck,
  Clock, Truck, HardDrive, Info, ChevronDown, ChevronUp, Copy, CheckCircle2,
  Camera, Phone, MessageCircle, ExternalLink, Search, Grid, List, RotateCcw,
  Star, Tag, ChevronRight
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
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under_1000' | '1000_3000' | '3000_7000' | 'above_7000'
  const [slaFilter, setSlaFilter] = useState('all'); // 'all' | '24h' | '48h' | 'standard'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_asc' | 'price_desc' | 'fastest' | 'rating'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  // Deep-linking: auto-open tab or configurator modal if ?tab=... or ?size=... or ?search=... query param is passed
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
    const searchParam = searchParams.get('search');
    if (searchParam !== null) {
      setSearchQuery(searchParam);
    }
  }, [searchParams, albumSizes]);

  // ── Unified Filtering & Sorting Predicates ─────────────────────────────────
  const matchesSearch = (item, extraFields = []) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const haystacks = [
      item.title || item.name || '',
      item.telugu || '',
      item.desc || item.description || '',
      item.category || '',
      item.dimensions || '',
      item.id || '',
      ...extraFields
    ].map(s => String(s).toLowerCase());
    return haystacks.some(h => h.includes(q));
  };

  const matchesPrice = (price) => {
    if (priceFilter === 'all') return true;
    const num = Number(price) || 0;
    if (priceFilter === 'under_1000') return num < 1000;
    if (priceFilter === '1000_3000') return num >= 1000 && num <= 3000;
    if (priceFilter === '3000_7000') return num > 3000 && num <= 7000;
    if (priceFilter === 'above_7000') return num > 7000;
    return true;
  };

  const matchesSla = (turnaround = '') => {
    if (slaFilter === 'all') return true;
    const t = String(turnaround).toLowerCase();
    if (slaFilter === '24h') return t.includes('24');
    if (slaFilter === '48h') return t.includes('48');
    if (slaFilter === 'standard') return !t.includes('24') && !t.includes('48');
    return true;
  };

  const sortItems = (items, getPrice, getTurnaround) => {
    return [...items].sort((a, b) => {
      if (sortBy === 'price_asc') return getPrice(a) - getPrice(b);
      if (sortBy === 'price_desc') return getPrice(b) - getPrice(a);
      if (sortBy === 'fastest') {
        const aT = String(getTurnaround(a) || '');
        const bT = String(getTurnaround(b) || '');
        const aRank = aT.includes('24') ? 1 : aT.includes('48') ? 2 : 3;
        const bRank = bT.includes('24') ? 1 : bT.includes('48') ? 2 : 3;
        return aRank - bRank;
      }
      if (sortBy === 'rating') {
        const aR = a.popular ? 5.0 : 4.8;
        const bR = b.popular ? 5.0 : 4.8;
        return bR - aR;
      }
      // featured
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return 0;
    });
  };

  // Filtered & Sorted Datasets
  const filteredPhotos = sortItems(
    photoServices.filter(p => matchesSearch(p) && matchesPrice(p.clientPrice || 45) && matchesSla(p.turnaround)),
    p => p.clientPrice || 45,
    p => p.turnaround
  );

  const filteredAlbums = sortItems(
    albumSizes.filter(s => {
      if (orientationFilter !== 'all' && s.orientation !== orientationFilter) return false;
      const basePrice = s.clientBasePrice || ((s.clientPricePerSheet || 260) * 30);
      return matchesSearch(s, [s.dimensions, s.category]) && matchesPrice(basePrice) && matchesSla('3-5 Days');
    }),
    s => s.clientBasePrice || ((s.clientPricePerSheet || 260) * 30),
    () => '3-5 Days'
  );

  const filteredVideos = sortItems(
    videoServices.filter(v => matchesSearch(v) && matchesPrice(v.clientPrice || v.price || 5000) && matchesSla(v.turnaround)),
    v => v.clientPrice || v.price || 5000,
    v => v.turnaround
  );

  const filteredFlex = sortItems(
    flexServices.filter(f => matchesSearch(f) && matchesPrice(f.clientPrice || f.price || 1200) && matchesSla(f.turnaround)),
    f => f.clientPrice || f.price || 1200,
    f => f.turnaround
  );

  const filteredSheets = sheetStyles.filter(sh => matchesSearch(sh) && matchesPrice(sh.clientPricePerSheet || 0));

  const totalFilteredCount = 
    (activeTab === 'editing' ? filteredPhotos.length :
     activeTab === 'albums' ? filteredAlbums.length :
     activeTab === 'video' ? filteredVideos.length :
     activeTab === 'flex' ? filteredFlex.length :
     (filteredPhotos.length + filteredAlbums.length + filteredVideos.length + filteredFlex.length));

  const totalCatalogCount = photoServices.length + albumSizes.length + videoServices.length + flexServices.length;

  const activeFiltersCount = 
    (priceFilter !== 'all' ? 1 : 0) + 
    (slaFilter !== 'all' ? 1 : 0) + 
    (orientationFilter !== 'all' ? 1 : 0) + 
    (searchQuery.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriceFilter('all');
    setSlaFilter('all');
    setOrientationFilter('all');
    setSortBy('featured');
  };

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
        {/* ── Compact E-Commerce Utility Header (65–70px) ───────────────── */}
        <header className="shop-compact-header">
          <div className="header-breadcrumbs-row">
            <div className="breadcrumbs-trail">
              <span className="crumb-item" onClick={() => navigate('/')}>Home</span>
              <ChevronRight size={13} className="crumb-arrow" />
              <span className="crumb-item" onClick={handleResetFilters}>Store</span>
              <ChevronRight size={13} className="crumb-arrow" />
              <span className="crumb-current">
                {activeTab === 'editing' ? (lang === 'TE' ? 'ఫొటో ఎడిటింగ్' : 'Photo Editing') :
                 activeTab === 'albums' ? (lang === 'TE' ? 'ఆల్బమ్స్' : 'Heirloom Albums') :
                 activeTab === 'video' ? (lang === 'TE' ? 'వీడియో సర్వీసెస్' : '4K Video Services') :
                 activeTab === 'flex' ? (lang === 'TE' ? 'ఫ్లెక్స్ & ఇన్విటేషన్స్' : 'Flex of All Sizes & Invites') :
                 (lang === 'TE' ? 'అన్ని సర్వీసులు' : 'All Services')}
              </span>
            </div>

            <div className="catalog-live-badge">
              <span className="live-dot" />
              <span>{totalFilteredCount} {lang === 'TE' ? 'సర్వీసులు అందుబాటులో ఉన్నాయి' : 'Items & Formats'}</span>
            </div>
          </div>

          <div className="header-controls-row">
            {/* Live Instant Search Input */}
            <div className="compact-search-bar">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'TE' ? 'సర్వీస్, సైజు లేదా ఫార్మాట్ వెతకండి...' : 'Search editing, 12×36 albums, 4K video, flex sizes...'}
                className="compact-search-input"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="compact-sort-wrapper">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="compact-sort-select"
                aria-label="Sort products"
              >
                <option value="featured">✨ Featured & Best Sellers</option>
                <option value="price_asc">💰 Price: Low to High</option>
                <option value="price_desc">💎 Price: High to Low</option>
                <option value="fastest">⚡ SLA: Fastest (24h Express)</option>
                <option value="rating">⭐ Rating: Highest Rated</option>
              </select>
            </div>

            {/* Desktop Filter Toggle Button */}
            <button 
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`btn-sidebar-toggle ${!sidebarCollapsed ? 'active' : ''}`}
              title="Toggle Filter Sidebar"
            >
              <Filter size={14} />
              <span>{sidebarCollapsed ? 'Show Filters' : 'Hide Filters'}</span>
              {activeFiltersCount > 0 && <span className="active-filters-pill">{activeFiltersCount}</span>}
            </button>

            {/* Mobile Filter Sheet Trigger */}
            <button 
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="btn-mobile-filters"
            >
              <Filter size={15} />
              <span>Filters</span>
              {activeFiltersCount > 0 && <span className="active-filters-pill">{activeFiltersCount}</span>}
            </button>

            {/* View Mode Density Toggle */}
            <div className="density-toggle-group">
              <button 
                type="button" 
                className={`density-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View (3–4 Cards)"
              >
                <Grid size={15} />
              </button>
              <button 
                type="button" 
                className={`density-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="High-Density List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </header>

        {/* ── Sticky Department Carousel / Pills ─────────────────────────── */}
        <div className="store-category-carousel">
          <button 
            type="button" 
            className={`category-pill ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Sparkles size={14} />
            <span>{lang === 'TE' ? 'అన్నీ' : 'All Services'}</span>
            <span className="category-pill-count">{totalCatalogCount}</span>
          </button>

          <button 
            type="button" 
            className={`category-pill ${activeTab === 'editing' ? 'active' : ''}`}
            onClick={() => setActiveTab('editing')}
          >
            <Camera size={14} className="cat-icon-editing" />
            <span>{lang === 'TE' ? 'ఫొటో ఎడిటింగ్' : 'Photo Editing'}</span>
            <span className="category-pill-count">{photoServices.length}</span>
          </button>

          <button 
            type="button" 
            className={`category-pill ${activeTab === 'albums' ? 'active' : ''}`}
            onClick={() => setActiveTab('albums')}
          >
            <BookOpen size={14} className="cat-icon-album" />
            <span>{lang === 'TE' ? 'రాయల్ ఆల్బమ్స్' : 'Heirloom Albums'}</span>
            <span className="category-pill-count">{albumSizes.length}</span>
          </button>

          <button 
            type="button" 
            className={`category-pill ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <Video size={14} className="cat-icon-video" />
            <span>{lang === 'TE' ? '4K వీడియో సర్వీసెస్' : '4K Video Editing'}</span>
            <span className="category-pill-count">{videoServices.length}</span>
          </button>

          <button 
            type="button" 
            className={`category-pill ${activeTab === 'flex' ? 'active' : ''}`}
            onClick={() => setActiveTab('flex')}
          >
            <Gift size={14} className="cat-icon-flex" />
            <span>{lang === 'TE' ? 'ఫ్లెక్స్ & ఇన్వైట్స్' : 'Flex of All Sizes & Invites'}</span>
            <span className="category-pill-count">{flexServices.length}</span>
          </button>
        </div>

        {/* ── Main Store Two-Column Layout ──────────────────────────────── */}
        <div className={`store-body-layout ${sidebarCollapsed ? 'sidebar-hidden' : ''}`}>
          
          {/* Faceted Filter Sidebar (Collapsible) */}
          <aside className="store-filter-sidebar">
            {/* Active Filters Bar */}
            {activeFiltersCount > 0 && (
              <div className="sidebar-filter-block active-filters-summary">
                <div className="active-filters-header">
                  <span className="filter-block-title">Active Filters ({activeFiltersCount})</span>
                  <button 
                    type="button" 
                    onClick={handleResetFilters}
                    className="btn-reset-filters"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>
                <div className="active-chips-wrap">
                  {searchQuery && (
                    <span className="active-chip">
                      Search: "{searchQuery}"
                      <X size={12} onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  {priceFilter !== 'all' && (
                    <span className="active-chip">
                      Price: {priceFilter.replace('_', ' ')}
                      <X size={12} onClick={() => setPriceFilter('all')} />
                    </span>
                  )}
                  {slaFilter !== 'all' && (
                    <span className="active-chip">
                      SLA: {slaFilter}
                      <X size={12} onClick={() => setSlaFilter('all')} />
                    </span>
                  )}
                  {orientationFilter !== 'all' && (
                    <span className="active-chip">
                      Orientation: {orientationFilter}
                      <X size={12} onClick={() => setOrientationFilter('all')} />
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Department Selection */}
            <div className="sidebar-filter-block">
              <span className="filter-block-title">Department</span>
              <div className="filter-options-list">
                {[
                  { id: 'all', label: 'All Departments', count: totalCatalogCount },
                  { id: 'editing', label: '🎨 Photo Editing & Designing', count: photoServices.length },
                  { id: 'albums', label: '📖 Heirloom Layflat Albums', count: albumSizes.length },
                  { id: 'video', label: '🎬 4K Cinematic Video Editing', count: videoServices.length },
                  { id: 'flex', label: '🚩 Event Flex & Custom Sizing', count: flexServices.length }
                ].map(dept => (
                  <label key={dept.id} className={`filter-radio-row ${activeTab === dept.id ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="store_dept" 
                      checked={activeTab === dept.id} 
                      onChange={() => setActiveTab(dept.id)} 
                    />
                    <span className="filter-label-text">{dept.label}</span>
                    <span className="filter-badge-count">{dept.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="sidebar-filter-block">
              <span className="filter-block-title">Price Range</span>
              <div className="filter-options-list">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under_1000', label: 'Under ₹1,000 (Per Photo/Sq.Ft)' },
                  { id: '1000_3000', label: '₹1,000 to ₹3,000 (Banners/Invites)' },
                  { id: '3000_7000', label: '₹3,000 to ₹7,000 (Popular Albums)' },
                  { id: 'above_7000', label: '₹7,000+ (Grand Imperial & Full 4K)' }
                ].map(p => (
                  <label key={p.id} className={`filter-radio-row ${priceFilter === p.id ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="store_price" 
                      checked={priceFilter === p.id} 
                      onChange={() => setPriceFilter(p.id)} 
                    />
                    <span className="filter-label-text">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SLA / Turnaround Filter */}
            <div className="sidebar-filter-block">
              <span className="filter-block-title">Turnaround SLA</span>
              <div className="filter-options-list">
                {[
                  { id: 'all', label: 'All Turnaround Times' },
                  { id: '24h', label: '⚡ 24 Hours Express Rush' },
                  { id: '48h', label: '⏱️ 48 Hours Lab SLA' },
                  { id: 'standard', label: '📦 3–5 Days Archival Dispatch' }
                ].map(s => (
                  <label key={s.id} className={`filter-radio-row ${slaFilter === s.id ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="store_sla" 
                      checked={slaFilter === s.id} 
                      onChange={() => setSlaFilter(s.id)} 
                    />
                    <span className="filter-label-text">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Album Orientation (Always available or for Albums) */}
            {(activeTab === 'albums' || activeTab === 'all') && (
              <div className="sidebar-filter-block">
                <span className="filter-block-title">Album Spread Orientation</span>
                <div className="filter-options-list">
                  {[
                    { id: 'all', label: `All Formats (${albumSizes.length})` },
                    { id: 'landscape', label: `↔️ Landscape (${albumSizes.filter(s => s.orientation === 'landscape').length})` },
                    { id: 'portrait', label: `↕️ Portrait Magazine (${albumSizes.filter(s => s.orientation === 'portrait').length})` }
                  ].map(o => (
                    <label key={o.id} className={`filter-radio-row ${orientationFilter === o.id ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="store_orientation" 
                        checked={orientationFilter === o.id} 
                        onChange={() => setOrientationFilter(o.id)} 
                      />
                      <span className="filter-label-text">{o.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Lab Concierge Support Card */}
            <div className="sidebar-concierge-card">
              <div className="concierge-badge">
                <Sparkles size={12} /> Direct Lab Desk
              </div>
              <h4 className="concierge-title">Need Custom Sizes or Guidance?</h4>
              <p className="concierge-desc">
                Talk to our lead designers for custom flex dimensions, 4K multicam sync, or paper finishes.
              </p>
              <div className="concierge-actions">
                <button
                  type="button"
                  className="btn-concierge-wa"
                  onClick={() => handleWhatsAppSupport("Hi WeddingAlbums.in, I'm browsing the store and need support choosing packages or custom sizing.")}
                >
                  <MessageCircle size={14} /> WhatsApp Us
                </button>
                <a href={`tel:${labPhone.replace(/\s+/g, '')}`} className="btn-concierge-tel">
                  <Phone size={14} /> Call: {labPhone}
                </a>
              </div>
            </div>

            {/* Lab Standards Badges */}
            <div className="sidebar-standards-box">
              <div className="standard-item">
                <span className="standard-icon">🖨️</span>
                <span className="standard-text">HP Indigo 12000 HD 7-Color Print</span>
              </div>
              <div className="standard-item">
                <span className="standard-icon">📖</span>
                <span className="standard-text">180° Seamless Layflat Guarantee</span>
              </div>
              <div className="standard-item">
                <span className="standard-icon">🛡️</span>
                <span className="standard-text">200-Year Archival & 100% Waterproof</span>
              </div>
              <div className="standard-item">
                <span className="standard-icon">📦</span>
                <span className="standard-text">Cloud Link or Pen Drive to Lab</span>
              </div>
            </div>
          </aside>

          {/* Catalog Products Area */}
          <main className="store-catalog-main">

            {/* Compact Support Consultation Banner */}
            <div className="compact-support-strip">
              <div className="support-strip-left">
                <Sparkles size={15} className="support-strip-sparkle" />
                <span>
                  <strong>Need any custom flex size (W×H ft) or rush delivery?</strong> Ask our lab specialists directly:
                </span>
              </div>
              <div className="support-strip-right">
                <button
                  type="button"
                  className="btn-strip-wa"
                  onClick={() => handleWhatsAppSupport("Hi WeddingAlbums.in, I'd like custom sizing assistance for my wedding order.")}
                >
                  <MessageCircle size={13} /> WhatsApp
                </button>
                <a href={`tel:${labPhone.replace(/\s+/g, '')}`} className="btn-strip-tel">
                  <Phone size={13} /> {labPhone}
                </a>
              </div>
            </div>

            {/* No Results Empty State */}
            {totalFilteredCount === 0 && (
              <div className="store-empty-state">
                <Filter size={42} className="empty-icon" />
                <h3>No services match your active filters</h3>
                <p>Try clearing your search query or relaxing your price/SLA filters to see all available services.</p>
                <button type="button" onClick={handleResetFilters} className="btn btn-gold-3d">
                  <RotateCcw size={15} /> Reset All Filters
                </button>
              </div>
            )}

            {/* 0. PHOTO EDITING & ALBUM DESIGNING (DIGITAL) */}
            {(activeTab === 'editing' || activeTab === 'all') && filteredPhotos.length > 0 && (
              <section className="catalog-section" id="dept-editing">
                <div className="catalog-section-header">
                  <div className="section-title-wrap">
                    <h2 className="catalog-section-title">
                      🎨 {lang === 'TE' ? 'ఫొటో ఎడిటింగ్ & డిజైనింగ్' : 'Photo Editing & Designing (Digital Post-Production)'}
                    </h2>
                    <span className="section-item-count">({filteredPhotos.length} items)</span>
                  </div>
                  <div className="section-pills">
                    <span className="spec-pill">✨ Frequency Separation</span>
                    <span className="spec-pill">👑 24K Temple Gold Glow</span>
                    <span className="spec-pill">⚡ 24h Rush Available</span>
                  </div>
                </div>

                <div className={`products-grid ${viewMode === 'list' ? 'density-list' : ''}`}>
                  {filteredPhotos.map((photo) => {
                    const price = photo.clientPrice || 45;
                    const unit = photo.unit || (photo.id?.includes('psd') || photo.id?.includes('spread') ? 'spread' : 'photo');
                    const strikePrice = Math.round(price * 1.5);

                    return (
                      <article key={photo.id} className="compact-product-card">
                        <div className="card-media-wrapper">
                          <img 
                            src="/images/opt/weddingalbums-talambraluw800.webp" 
                            alt={photo.title} 
                            className="card-media-img" 
                            loading="lazy" 
                          />
                          <div className="card-media-overlay" />
                          <div className="card-floating-tags">
                            <span className="card-dept-tag photo-tag">🎨 Digital Lab</span>
                            <span className="card-sla-tag">⏱️ {photo.turnaround || '24-48h SLA'}</span>
                          </div>
                          <span className="card-rating-chip">
                            <Star size={11} className="rating-star-icon" /> 4.9
                          </span>
                        </div>

                        <div className="card-body">
                          <h3 className="card-title">{photo.title}</h3>
                          {photo.telugu && <div className="card-telugu">{photo.telugu}</div>}
                          <p className="card-desc">{photo.desc}</p>

                          <div className="card-specs-row">
                            <span className="mini-spec">Skin Polishing</span>
                            <span className="mini-spec">Jewelry Luster</span>
                            <span className="mini-spec">300 DPI PSD</span>
                          </div>

                          <div className="card-pricing-block">
                            <div className="price-primary">
                              <span className="price-currency">₹</span>
                              <span className="price-amount">{price}</span>
                              <span className="price-unit">/{unit}</span>
                            </div>
                            <div className="price-mrp-group">
                              <span className="price-mrp">₹{strikePrice}</span>
                              <span className="price-save-badge">Save 33%</span>
                            </div>
                          </div>

                          {renderCardSupportPrompt(photo.title, 'photo')}
                        </div>

                        <div className="card-actions-row">
                          <button 
                            type="button" 
                            onClick={() => openServiceModal(photo, 'photo')} 
                            className="btn-card-primary"
                          >
                            <Sliders size={14} />
                            <span>{lang === 'TE' ? 'ఆర్డర్ చేయండి' : 'Configure & Order'}</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 1. HEIRLOOM WEDDING ALBUMS SECTION */}
            {(activeTab === 'albums' || activeTab === 'all') && filteredAlbums.length > 0 && (
              <section className="catalog-section" id="dept-albums">
                <div className="catalog-section-header">
                  <div className="section-title-wrap">
                    <h2 className="catalog-section-title">
                      📖 {lang === 'TE' ? 'రాయల్ వెడ్డింగ్ ఆల్బమ్స్' : 'Heirloom Wedding Albums (Per-Sheet Pricing)'}
                    </h2>
                    <span className="section-item-count">({filteredAlbums.length} formats)</span>
                  </div>
                  <div className="section-pills">
                    <span className="spec-pill">🖨️ HP Indigo 12000 HD</span>
                    <span className="spec-pill">📖 180° Layflat (0% Gutter Loss)</span>
                    <span className="spec-pill">🛡️ 100-Year Life</span>
                  </div>
                </div>

                <div className={`products-grid ${viewMode === 'list' ? 'density-list' : ''}`}>
                  {filteredAlbums.map((size) => {
                    const perSheet = size.clientPricePerSheet || Math.round((size.clientBasePrice || 4500) / 30);
                    const basePrice = size.clientBasePrice || (perSheet * 30);
                    const strikeBase = Math.round(basePrice * 1.35);
                    const productImage = size.image || ALBUM_IMAGES[size.id] || '/images/weddingalbums-layflat-album.png';

                    return (
                      <article key={size.id} className="compact-product-card">
                        <div className="card-media-wrapper">
                          <img 
                            src={productImage} 
                            alt={size.name} 
                            className="card-media-img" 
                            loading="lazy" 
                          />
                          <div className="card-media-overlay" />
                          <div className="card-floating-tags">
                            <span className={`card-dept-tag ${size.orientation === 'portrait' ? 'portrait-tag' : 'album-tag'}`}>
                              {size.orientation === 'portrait' ? '↕️ Portrait' : '↔️ Landscape'}
                            </span>
                            {size.popular && (
                              <span className="card-bestseller-tag">
                                <Flame size={11} /> {size.badge || 'Best Seller'}
                              </span>
                            )}
                          </div>
                          <span className="card-rating-chip">
                            <Star size={11} className="rating-star-icon" /> 5.0
                          </span>
                        </div>

                        <div className="card-body">
                          <h3 className="card-title">{size.name}</h3>
                          {size.telugu && <div className="card-telugu">{size.telugu}</div>}
                          <p className="card-desc">{size.description || `${size.dimensions} Open Spread with archival lay-flat binding.`}</p>

                          <div className="card-specs-row">
                            <span className="mini-spec">{size.dimensions} Open</span>
                            <span className="mini-spec">180° Layflat</span>
                            <span className="mini-spec">NTR Matte / Velvet</span>
                          </div>

                          <div className="card-pricing-block">
                            <div className="price-primary">
                              <span className="price-currency">₹</span>
                              <span className="price-amount">{perSheet}</span>
                              <span className="price-unit">/ sheet</span>
                            </div>
                            <div className="price-mrp-group">
                              <span className="price-mrp">₹{strikeBase.toLocaleString('en-IN')} (30sh)</span>
                              <span className="price-save-badge">Save 26%</span>
                            </div>
                          </div>

                          <div className="card-base-note">
                            30-Sheet (60-Page) Base: <strong>₹{Number(basePrice).toLocaleString('en-IN')}</strong>
                          </div>

                          {renderCardSupportPrompt(size.name, 'album')}
                        </div>

                        <div className="card-actions-row">
                          <button 
                            type="button" 
                            onClick={() => openAlbumModal(size)} 
                            className="btn-card-primary"
                          >
                            <Sliders size={14} />
                            <span>{lang === 'TE' ? 'కాన్ఫిగర్ చేయండి' : 'Configure & Order'}</span>
                            <ArrowRight size={14} />
                          </button>
                          <button 
                            type="button" 
                            className="btn-card-quick"
                            title="Quick Add 30-Sheet Standard Base"
                            onClick={() => handleQuickAddAlbum(size)}
                          >
                            <ShoppingBag size={16} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 2. 4K CINEMATIC VIDEO SECTION */}
            {(activeTab === 'video' || activeTab === 'all') && filteredVideos.length > 0 && (
              <section className="catalog-section" id="dept-video">
                <div className="catalog-section-header">
                  <div className="section-title-wrap">
                    <h2 className="catalog-section-title">
                      🎬 {lang === 'TE' ? '4K సినిమాటిక్ వీడియో ఎడిటింగ్' : '4K Cinematic Video Post-Production'}
                    </h2>
                    <span className="section-item-count">({filteredVideos.length} packages)</span>
                  </div>
                  <div className="section-pills">
                    <span className="spec-pill">🎨 DaVinci Resolve Wide Gamut</span>
                    <span className="spec-pill">🎵 Telugu Nadaswaram Stems</span>
                    <span className="spec-pill">⚡ 24h Rush Available</span>
                  </div>
                </div>

                <div className={`products-grid ${viewMode === 'list' ? 'density-list' : ''}`}>
                  {filteredVideos.map((video) => {
                    const price = video.clientPrice || video.price || 5000;
                    const strikePrice = Math.round(price * 1.3);

                    return (
                      <article key={video.id} className="compact-product-card">
                        <div className="card-media-wrapper">
                          <img 
                            src="/images/cinematic-video-suite.jpg" 
                            alt={video.title} 
                            className="card-media-img" 
                            loading="lazy" 
                          />
                          <div className="card-media-overlay" />
                          <div className="card-floating-tags">
                            <span className="card-dept-tag video-tag">🎬 4K UHD</span>
                            <span className="card-sla-tag">⏱️ {video.turnaround || '48h SLA'}</span>
                          </div>
                          <span className="card-rating-chip">
                            <Star size={11} className="rating-star-icon" /> 4.9
                          </span>
                        </div>

                        <div className="card-body">
                          <h3 className="card-title">{video.title}</h3>
                          {video.telugu && <div className="card-telugu">{video.telugu}</div>}
                          <p className="card-desc">{video.desc}</p>

                          <div className="card-specs-row">
                            <span className="mini-spec">4K (3840×2160)</span>
                            <span className="mini-spec">Multicam Sync</span>
                            <span className="mini-spec">Sound Stems</span>
                          </div>

                          <div className="card-pricing-block">
                            <div className="price-primary">
                              <span className="price-currency">₹</span>
                              <span className="price-amount">{Number(price).toLocaleString('en-IN')}</span>
                              <span className="price-unit">package</span>
                            </div>
                            <div className="price-mrp-group">
                              <span className="price-mrp">₹{strikePrice.toLocaleString('en-IN')}</span>
                              <span className="price-save-badge">Save 23%</span>
                            </div>
                          </div>

                          {renderCardSupportPrompt(video.title, 'video')}
                        </div>

                        <div className="card-actions-row">
                          <button 
                            type="button" 
                            onClick={() => openServiceModal(video, 'video')} 
                            className="btn-card-primary"
                          >
                            <Sliders size={14} />
                            <span>{lang === 'TE' ? 'వీడియో ఆర్డర్ చేయండి' : 'Configure & Order Video'}</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3. EVENT FLEX OF ALL SIZES & WHATSAPP INVITES */}
            {(activeTab === 'flex' || activeTab === 'all') && (filteredFlex.length > 0 || !searchQuery) && (
              <section className="catalog-section" id="dept-flex">
                <div className="catalog-section-header">
                  <div className="section-title-wrap">
                    <h2 className="catalog-section-title">
                      🚩 {lang === 'TE' ? 'ఫ్లెక్స్ బ్యానర్లు (అన్ని సైజులు) & ఇన్వైట్స్' : 'Event Flex of All Sizes & WhatsApp Video Invites'}
                    </h2>
                    <span className="section-item-count">({filteredFlex.length + 1} items)</span>
                  </div>
                  <div className="section-pills">
                    <span className="spec-pill">📐 Any Custom Width × Height ft</span>
                    <span className="spec-pill">🌟 440 GSM Blackout Matte</span>
                    <span className="spec-pill">📦 Zero-Crease PVC Tube Delivery</span>
                  </div>
                </div>

                <div className={`products-grid ${viewMode === 'list' ? 'density-list' : ''}`}>
                  {/* Interactive Custom Dimension Flex Engine Card */}
                  <article className="compact-product-card custom-flex-highlight-card">
                    <div className="card-media-wrapper custom-flex-media">
                      <div className="custom-flex-icon-center">
                        <Sliders size={32} />
                        <span className="custom-engine-label">CUSTOM DIMENSION ENGINE</span>
                      </div>
                      <div className="card-floating-tags">
                        <span className="card-dept-tag flex-custom-tag">📐 Width ft × Height ft</span>
                        <span className="card-sla-tag">⚡ Any Custom Size</span>
                      </div>
                    </div>

                    <div className="card-body">
                      <h3 className="card-title">Custom Dimensions Flex Banner (Any Size)</h3>
                      <div className="card-telugu">మీకు కావలసిన ఏ సైజులోనైనా ఫ్లెక్స్ బ్యానర్ (₹{catalog.ratePerSqFtClient || 30}/sq.ft)</div>
                      <p className="card-desc">
                        Enter whatever custom Width in Feet and Height in Feet you want for live square-foot math.
                      </p>

                      <div className="card-specs-row">
                        <span className="mini-spec">Any W×H ft</span>
                        <span className="mini-spec">440 GSM Blackout</span>
                        <span className="mini-spec">Eyelets & Standees</span>
                      </div>

                      <div className="card-pricing-block">
                        <div className="price-primary">
                          <span className="price-currency">₹</span>
                          <span className="price-amount">{catalog.ratePerSqFtClient || 30}</span>
                          <span className="price-unit">/ sq.ft</span>
                        </div>
                        <div className="price-mrp-group">
                          <span className="price-mrp">₹45/sq.ft</span>
                          <span className="price-save-badge">Lab Rate</span>
                        </div>
                      </div>

                      {renderCardSupportPrompt('Custom Flex Dimensions', 'flex')}
                    </div>

                    <div className="card-actions-row">
                      <button 
                        type="button" 
                        onClick={() => {
                          const flexItem = flexServices.find(f => !f.id?.includes('invite')) || flexServices[0] || { id: 'flex-custom', title: 'Custom Flex Banner' };
                          openServiceModal(flexItem, 'flex');
                          setFlexSize('custom');
                        }} 
                        className="btn-card-primary btn-custom-flex-cta"
                      >
                        <Sliders size={14} />
                        <span>{lang === 'TE' ? 'సైజు ఎంటర్ చేయండి' : 'Enter Custom Size & Price'}</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomFlexModal(true)}
                        className="btn-card-quick"
                        title="Ask for custom size"
                      >
                        📐
                      </button>
                    </div>
                  </article>

                  {/* Standard Flex & WhatsApp Invite Cards */}
                  {filteredFlex.map((flex) => {
                    const price = flex.clientPrice || flex.price || 0;
                    const isInvite = flex.id?.includes('invite') || flex.title?.toLowerCase().includes('whatsapp');
                    const strikePrice = Math.round(price * 1.3);

                    return (
                      <article key={flex.id} className="compact-product-card">
                        <div className="card-media-wrapper">
                          <img 
                            src="/images/opt/weddingalbums-home-herow1600.webp" 
                            alt={flex.title} 
                            className="card-media-img" 
                            loading="lazy" 
                          />
                          <div className="card-media-overlay" />
                          <div className="card-floating-tags">
                            <span className="card-dept-tag flex-tag">
                              {isInvite ? '💌 Video Invite' : '🚩 Event Flex'}
                            </span>
                            <span className="card-sla-tag">🚚 {flex.turnaround || '2 Days'}</span>
                          </div>
                          <span className="card-rating-chip">
                            <Star size={11} className="rating-star-icon" /> 4.8
                          </span>
                        </div>

                        <div className="card-body">
                          <h3 className="card-title">{flex.title}</h3>
                          {flex.telugu && <div className="card-telugu">{flex.telugu}</div>}
                          <p className="card-desc">{flex.desc}</p>

                          <div className="card-specs-row">
                            <span className="mini-spec">{isInvite ? '60s Animated' : '440 GSM Matte'}</span>
                            <span className="mini-spec">{isInvite ? 'Telugu Shlokas' : 'PVC Tube Ship'}</span>
                            <span className="mini-spec">{isInvite ? 'Map QR' : 'Eyelets/Stand'}</span>
                          </div>

                          <div className="card-pricing-block">
                            <div className="price-primary">
                              <span className="price-currency">₹</span>
                              <span className="price-amount">{Number(price).toLocaleString('en-IN')}</span>
                              <span className="price-unit">direct</span>
                            </div>
                            <div className="price-mrp-group">
                              <span className="price-mrp">₹{strikePrice.toLocaleString('en-IN')}</span>
                              <span className="price-save-badge">Save 23%</span>
                            </div>
                          </div>

                          {renderCardSupportPrompt(flex.title, 'flex')}
                        </div>

                        <div className="card-actions-row">
                          <button 
                            type="button" 
                            onClick={() => openServiceModal(flex, isInvite ? 'invite' : 'flex')} 
                            className="btn-card-primary"
                          >
                            <Sliders size={14} />
                            <span>{isInvite ? 'Configure Video Invite' : 'Configure Flex Size & Finish'}</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

          </main>
        </div>

        {/* ── Mobile Filter Off-Canvas Drawer ────────────────────────────── */}
        <div className={`mobile-filter-backdrop ${mobileFiltersOpen ? 'open' : ''}`} onClick={() => setMobileFiltersOpen(false)} />
        <div className={`mobile-filter-drawer ${mobileFiltersOpen ? 'open' : ''}`}>
          <div className="mobile-drawer-header">
            <div className="drawer-title-group">
              <Filter size={18} />
              <h3>Filters & Specifications</h3>
              {activeFiltersCount > 0 && <span className="active-filters-pill">{activeFiltersCount}</span>}
            </div>
            <button 
              type="button" 
              className="drawer-close-btn"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="mobile-drawer-body">
            {/* Department */}
            <div className="drawer-filter-group">
              <span className="group-title">Department</span>
              <div className="chips-selector">
                {[
                  { id: 'all', label: 'All Services' },
                  { id: 'editing', label: '🎨 Photo Editing' },
                  { id: 'albums', label: '📖 Albums' },
                  { id: 'video', label: '🎬 4K Video' },
                  { id: 'flex', label: '🚩 Flex & Invites' }
                ].map(d => (
                  <button 
                    key={d.id} 
                    type="button"
                    className={`drawer-chip ${activeTab === d.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(d.id)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="drawer-filter-group">
              <span className="group-title">Price Range</span>
              <div className="chips-selector">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'under_1000', label: '< ₹1,000' },
                  { id: '1000_3000', label: '₹1k–₹3k' },
                  { id: '3000_7000', label: '₹3k–₹7k' },
                  { id: 'above_7000', label: '₹7k+' }
                ].map(p => (
                  <button 
                    key={p.id} 
                    type="button"
                    className={`drawer-chip ${priceFilter === p.id ? 'active' : ''}`}
                    onClick={() => setPriceFilter(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SLA Filter */}
            <div className="drawer-filter-group">
              <span className="group-title">SLA Turnaround</span>
              <div className="chips-selector">
                {[
                  { id: 'all', label: 'All' },
                  { id: '24h', label: '⚡ 24h Express' },
                  { id: '48h', label: '48h SLA' },
                  { id: 'standard', label: '3-5 Days' }
                ].map(s => (
                  <button 
                    key={s.id} 
                    type="button"
                    className={`drawer-chip ${slaFilter === s.id ? 'active' : ''}`}
                    onClick={() => setSlaFilter(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Album Orientation */}
            {(activeTab === 'albums' || activeTab === 'all') && (
              <div className="drawer-filter-group">
                <span className="group-title">Album Orientation</span>
                <div className="chips-selector">
                  {[
                    { id: 'all', label: 'All Formats' },
                    { id: 'landscape', label: '↔️ Landscape' },
                    { id: 'portrait', label: '↕️ Portrait' }
                  ].map(o => (
                    <button 
                      key={o.id} 
                      type="button"
                      className={`drawer-chip ${orientationFilter === o.id ? 'active' : ''}`}
                      onClick={() => setOrientationFilter(o.id)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mobile-drawer-footer">
            <button 
              type="button" 
              onClick={handleResetFilters} 
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Reset All
            </button>
            <button 
              type="button" 
              onClick={() => setMobileFiltersOpen(false)} 
              className="btn btn-gold-3d"
              style={{ flex: 2, justifyContent: 'center' }}
            >
              Show ({totalFilteredCount}) Services
            </button>
          </div>
        </div>

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
