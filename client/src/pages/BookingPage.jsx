import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import {
  ShoppingCart, CheckCircle2, Package, Image, Video,
  UploadCloud, Truck, MonitorPlay, Printer, Film,
  Palette, MessageCircle, Sparkles, MapPin, Phone,
  HelpCircle, HardDrive, ArrowRight, ArrowLeft, Check,
  Clock, ShieldCheck, Music, Box, BookOpen, Layers,
  Calendar, CheckSquare, ChevronRight, Award, Zap,
  Building2, Eye, Tag, FileText
} from 'lucide-react';
import './OrderAlbum.css';

const API = (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:4000'));

// COMPREHENSIVE ALBUM SIZES (LANDSCAPE ↔️ & PORTRAIT ↕️)
const DEFAULT_ALBUM_SIZES = [
  // LANDSCAPE SIZES
  {
    id: '12x36',
    name: '12×36 Royal Spread (Panoramic)',
    dimensions: '12×36 inches',
    orientation: 'landscape',
    telugu: '12×36 రాయల్ పానోరమిక్ (ఆంధ్ర నెం.1 ఎంపిక ⭐)',
    basePrice: 9500,
    studioBasePrice: 6800,
    popular: true,
    description: '36 inch wide panoramic lay-flat views. India\'s #1 wedding choice.'
  },
  {
    id: '12x30',
    name: '12×30 Classic Landscape',
    dimensions: '12×30 inches',
    orientation: 'landscape',
    telugu: '12×30 క్లాసిక్ ల్యాండ్‌స్కేప్',
    basePrice: 8500,
    studioBasePrice: 6000,
    popular: false,
    description: 'Traditional Telugu standard widescreen layout for mandap & stage spreads.'
  },
  {
    id: '12x24',
    name: '12×24 Compact Landscape',
    dimensions: '12×24 inches',
    orientation: 'landscape',
    telugu: '12×24 కాంపాక్ట్ ల్యాండ్‌స్కేప్',
    basePrice: 7500,
    studioBasePrice: 5200,
    popular: false,
    description: 'Budget-friendly album with modern sleek aspect ratio.'
  },
  {
    id: '12x18',
    name: '12×18 Traditional Landscape',
    dimensions: '12×18 inches',
    orientation: 'landscape',
    telugu: '12×18 ట్రెడిషనల్ ల్యాండ్‌స్కేప్',
    basePrice: 6500,
    studioBasePrice: 4500,
    popular: false,
    description: 'Traditional portrait-landscape balance, timeless horizontal format.'
  },
  {
    id: '10x24',
    name: '10×24 Compact Feast Landscape',
    dimensions: '10×24 inches',
    orientation: 'landscape',
    telugu: '10×24 కాంపాక్ట్ ఫీస్ట్ ల్యాండ్‌స్కేప్',
    basePrice: 5800,
    studioBasePrice: 4000,
    popular: false,
    description: 'Lightweight easy-to-carry format for family functions.'
  },
  {
    id: 'bundle_12x36_parent',
    name: 'Royal Family Bundle (12×36 + 2x 6×18 Parent)',
    dimensions: '12×36 + 2x 6×18',
    orientation: 'landscape',
    telugu: 'రాయల్ ఫ్యామిలీ బండిల్ (కపుల్ + 2 పేరెంట్ ఆల్బమ్స్)',
    basePrice: 11500,
    studioBasePrice: 8200,
    popular: true,
    isBundle: true,
    description: 'Master 12×36 album for couple + 2 matching 6×18 parent duplicate copies.'
  },

  // PORTRAIT SIZES
  {
    id: '18x12',
    name: '18×12 Grand Vertical Portrait',
    dimensions: '18×12 inches',
    orientation: 'portrait',
    telugu: '18×12 గ్రాండ్ వర్టికల్ పోర్ట్రెయిట్ (రాయల్ మ్యాగజైన్)',
    basePrice: 9000,
    studioBasePrice: 6400,
    popular: true,
    description: 'Tall royal magazine format. Stunning full-length bridal silk & jewellery spreads.'
  },
  {
    id: '15x12',
    name: '15×12 Classic Vertical Portrait',
    dimensions: '15×12 inches',
    orientation: 'portrait',
    telugu: '15×12 క్లాసిక్ వర్టికల్ పోర్ట్రెయిట్',
    basePrice: 8000,
    studioBasePrice: 5600,
    popular: false,
    description: 'Traditional vertical bridal album for stage portraits and couple framing.'
  },
  {
    id: '14x11',
    name: '14×11 Fine Art Vertical Portrait',
    dimensions: '14×11 inches',
    orientation: 'portrait',
    telugu: '14×11 ఫైన్ ఆర్ట్ పోర్ట్రెయిట్',
    basePrice: 7200,
    studioBasePrice: 5000,
    popular: false,
    description: 'Editorial fashion photography format for candid contemporary stories.'
  },
  {
    id: '12x9',
    name: '12×9 Compact Vertical Portrait',
    dimensions: '12×9 inches',
    orientation: 'portrait',
    telugu: '12×9 కాంపాక్ట్ వర్టికల్ పోర్ట్రెయిట్',
    basePrice: 5500,
    studioBasePrice: 3800,
    popular: false,
    description: 'Handy vertical book for intimate Haldi, Mehendi & Sangeet moments.'
  },
  {
    id: '10x8',
    name: '10×8 Family Gift Portrait',
    dimensions: '10×8 inches',
    orientation: 'portrait',
    telugu: '10×8 ఫ్యామిలీ గిఫ్ట్ పోర్ట్రెయిట్',
    basePrice: 4500,
    studioBasePrice: 3100,
    popular: false,
    description: 'Compact vertical keepsake gift album for parents and close relatives.'
  }
];

// COMPREHENSIVE SHEET FINISHES (8 INDUSTRY LAB TYPES)
const DEFAULT_SHEETS = [
  {
    id: 'velvet',
    name: 'Non-Tearable Velvet Touch',
    telugu: 'సిల్కీ వెల్వెట్ మ్యాట్ (వాటర్ ప్రూఫ్)',
    pricePerSheet: 65,
    studioPricePerSheet: 42,
    premiumCoverSurcharge: 1200,
    studioCoverSurcharge: 750,
    note: 'Ultra-smooth matte finish, 100% waterproof, tear-resistant, feather touch.'
  },
  {
    id: 'gloss',
    name: 'Crystal High Gloss (Ultra Mirror)',
    telugu: 'క్రిస్టల్ అల్ట్రా మిర్రర్ గ్లోస్',
    pricePerSheet: 75,
    studioPricePerSheet: 48,
    premiumCoverSurcharge: 1000,
    studioCoverSurcharge: 650,
    note: 'Super-reflective mirror gloss. Vivid colors, deep blacks and saturated wedding reds.'
  },
  {
    id: 'metallic',
    name: 'High-Gloss Metallic Pearl Sheen',
    telugu: 'రాయల్ హై-గ్లాస్ మెటాలిక్',
    pricePerSheet: 85,
    studioPricePerSheet: 55,
    premiumCoverSurcharge: 1400,
    studioCoverSurcharge: 900,
    note: 'Lustrous high-contrast sheen that brings gold jewellery and wedding silks alive.'
  },
  {
    id: 'leatherette',
    name: 'Royal Feather Touch Leatherette',
    telugu: 'రాయల్ ఫెదర్ టచ్ లెథరెట్',
    pricePerSheet: 110,
    studioPricePerSheet: 72,
    premiumCoverSurcharge: 1800,
    studioCoverSurcharge: 1150,
    note: 'Ultra-luxury textured sheets with genuine tactile grain and rich gold hot-stamping.'
  },
  {
    id: 'thermal',
    name: 'HD Thermal Lamination Matte',
    telugu: 'హై-డెఫినిషన్ థర్మల్ లామినేషన్',
    pricePerSheet: 50,
    studioPricePerSheet: 32,
    premiumCoverSurcharge: 800,
    studioCoverSurcharge: 500,
    note: 'Durable, crystal scratch-resistant thermal coating. Ideal for everyday studio handling.'
  },
  {
    id: 'silk_matte',
    name: 'Silk Matte Pearl Lustre',
    telugu: 'సిల్క్ మ్యాట్ పెర్ల్ లస్టర్',
    pricePerSheet: 95,
    studioPricePerSheet: 62,
    premiumCoverSurcharge: 1500,
    studioCoverSurcharge: 950,
    note: 'Micro-pearlescent sheen with true-to-life skin tones and natural highlights without glare.'
  },
  {
    id: 'silver_halide',
    name: 'Silver Halide True Photographic (Fuji DP2)',
    telugu: 'సిల్వర్ హాలైడ్ ట్రూ ఫోటో పేపర్',
    pricePerSheet: 125,
    studioPricePerSheet: 82,
    premiumCoverSurcharge: 2000,
    studioCoverSurcharge: 1300,
    note: 'Continuous tone optical RGB exposure. 100-year archival laboratory rating without dots.'
  },
  {
    id: 'canvas',
    name: 'Embossed Canvas Texture Fine Art',
    telugu: 'కాన్వాస్ ఎంబోస్డ్ ఫైన్ ఆర్ట్ టెక్స్చర్',
    pricePerSheet: 105,
    studioPricePerSheet: 68,
    premiumCoverSurcharge: 1600,
    studioCoverSurcharge: 1050,
    note: 'Tactile painterly woven fabric texture with artistic micro-embossing for timeless art.'
  }
];

// ALL VIDEO EDITING SERVICES
const VIDEO_SERVICES = [
  { id: 'teaser', name: '4K Cinematic Wedding Teaser (1-3 min)', telugu: '4K సినిమాటిక్ టీజర్', price: 6000, studioPrice: 4200, note: 'Fast-paced emotional cut, WhatsApp & family ready' },
  { id: 'reels', name: 'Instagram Reels & Shorts 5-Pack (9:16)', telugu: 'ఇన్‌స్టాగ్రామ్ రీల్స్ 5-ప్యాక్', price: 3500, studioPrice: 2200, note: 'Trending music synced 9:16 vertical hooks' },
  { id: 'highlights', name: 'Story Highlights Film (10-15 min)', telugu: 'స్టోరీ హైలైట్స్ ఫిలిం', price: 10000, studioPrice: 7000, note: 'Emotional story with couple vows & speech sync' },
  { id: 'traditional', name: 'Full Traditional Long-Form Video (60+ min)', telugu: 'ఫుల్ ట్రెడిషనల్ వీడియో', price: 12000, studioPrice: 8500, note: 'All rituals: Talambralu, Agni Sakshi multi-cam' },
  { id: 'sde', name: 'Same-Day Edit (SDE Express for Reception)', telugu: 'సేమ్-డే ఎడిట్ (రిసెప్షన్)', price: 12000, studioPrice: 8500, note: 'Morning wedding edited for reception night LED screen' },
  { id: 'prewedding', name: 'Pre-Wedding Love Story Film', telugu: 'ప్రీ-వెడ్డింగ్ లవ్ స్టోరీ', price: 5000, studioPrice: 3500, note: 'Romantic couple teaser with licensed music' },
  { id: 'sound', name: 'Mangalasnanam Sound & Mantra Mastering', telugu: 'సంప్రదాయ సౌండ్ మాస్టరింగ్', price: 3000, studioPrice: 1900, note: 'Mantra clarity, Purohit de-noise & Sannai Melam' }
];

// ALL PHOTO EDITING SERVICES
const PHOTO_SERVICES = [
  { id: 'retouching', name: 'Telugu Pelli Skin Retouching & Beauty Clean-up', telugu: 'స్కిన్ రీటచింగ్ & బ్యూటీ క్లీనప్', rate: 60, studioRate: 35, note: 'Blemish removal, eye brightening, gold jewelry shine' },
  { id: 'karizma_psd', name: 'Traditional Karizma PSD Creative Designing', telugu: 'కరిజ్మా క్రియేటివ్ డిజైనింగ్', rate: 45, studioRate: 28, note: 'Custom Telugu shlokas, spread layouts & typography' },
  { id: 'cinematic_luts', name: 'Cinematic Color Grading & Wedding LUTs', telugu: 'సినిమాటిక్ కలర్ గ్రేడింగ్', rate: 30, studioRate: 18, note: 'Warm golden Andhra wedding palette & LUTs' },
  { id: 'background', name: 'AI Sky, Mandap & Lighting Background Replacement', telugu: 'బ్యాక్‌గ్రౌండ్ రీప్లేస్‌మెంట్', rate: 90, studioRate: 55, note: 'Replace cluttered venue with royal mandap/gardens' },
  { id: 'restoration', name: 'Old & Vintage Photo Restoration', telugu: 'పాత ఫొటోల రీస్టోరేషన్', rate: 120, studioRate: 75, note: 'Fix scratched, faded, or torn ancestral photos' },
  { id: 'culling', name: 'AI RAW Photo Culling & Best Selection', telugu: 'రా ఫొటోల కల్లింగ్ & సెలక్షన్', rate: 15, studioRate: 10, note: 'Filter blinks, blurs & tag top highlight moments' }
];

// ALL FLEX & BANNER SERVICES
const FLEX_SERVICES = [
  { id: 'mandap', name: 'Grand Mandap Entrance Flex (10×8 ft Star Media)', telugu: 'మండపం ఎంట్రన్స్ ఫ్లెక్స్', price: 2400, studioPrice: 1500, note: 'Heavy Star Flex 340 GSM with brass eyelets' },
  { id: 'hoarding', name: 'Roadside Wedding Hoarding (40×20 ft Heavy Duty)', telugu: 'రోడ్‌సైడ్ వెడ్డింగ్ హోర్డింగ్', price: 12000, studioPrice: 8000, note: 'Ultra-high visibility large format solvent press' },
  { id: 'standee', name: 'Retractable Welcome Roll-Up Standee (6×3 ft)', telugu: 'వెల్‌కమ్ రోల్-అప్ స్టాండీ', price: 1800, studioPrice: 1150, note: 'Anodized aluminum stand with carry bag' },
  { id: 'invite', name: 'Animated Telugu WhatsApp Video Invitation', telugu: 'వాట్సాప్ వీడియో ఆహ్వానం', price: 1999, studioPrice: 1200, note: 'Auspicious Sannai Melam BGM & temple motifs' }
];

// ALL CALENDAR SERVICES
const CALENDAR_SERVICES = [
  { id: 'desk_easel', name: 'Personalized 12-Month Tabletop Desk Calendar', telugu: '12-నెలల టేబుల్‌టాప్ డెస్క్ క్యాలెండర్', price: 1200, studioPrice: 750, note: '12 Couple photos with wooden easel stand' },
  { id: 'wall_poster', name: 'Grand Wall Hanging Poster Calendar (12×18 Metallic)', telugu: 'గ్రాండ్ వాల్ పోస్టర్ క్యాలెండర్', price: 650, studioPrice: 380, note: 'High-gloss metallic print with metal rim hanger' },
  { id: 'pocket_pack', name: 'Pocket Mini Calendars (Pack of 10 Copies)', telugu: 'పాకెట్ మినీ క్యాలెండర్లు (10 కాపీలు)', price: 990, studioPrice: 550, note: 'Waterproof wallet cards with rounded corners' }
];

// 5 PRIMARY SERVICE TILES FOR RESPONSIVE GRID (ZERO SCROLLBARS)
const SERVICE_CATEGORIES = [
  {
    id: 'album',
    key: 'albumPrint',
    name: 'Karizma & Flush Mount Album',
    telugu: 'కరిజ్మా & ఫ్లష్ మౌంట్ ఆల్బమ్ డిజైన్',
    icon: BookOpen,
    priceTag: 'from ₹5,200',
    studioPriceTag: 'from ₹3,800 lab rate'
  },
  {
    id: 'video',
    key: 'videoEdit',
    name: 'Cinematic Films & Reels',
    telugu: '4K సినిమాటిక్ వీడియో & రీల్స్',
    icon: Film,
    priceTag: 'from ₹3,500',
    studioPriceTag: 'from ₹2,200 lab rate'
  },
  {
    id: 'photo',
    key: 'photoEdit',
    name: 'Photo Retouch & Color',
    telugu: 'ఫొటో రీటచింగ్ & కలర్ గ్రేడింగ్',
    icon: Palette,
    priceTag: 'from ₹30/photo',
    studioPriceTag: 'from ₹18/photo lab rate'
  },
  {
    id: 'flex',
    key: 'flexBanner',
    name: 'Flex, Banners & Invites',
    telugu: 'కళ్యాణ మండపం ఫ్లెక్స్ & ఆహ్వానాలు',
    icon: MonitorPlay,
    priceTag: 'from ₹1,800',
    studioPriceTag: 'from ₹1,150 lab rate'
  },
  {
    id: 'calendar',
    key: 'calendars',
    name: 'Calendars & Keepsakes',
    telugu: 'కపుల్ టేబుల్‌టాప్ & వాల్ క్యాలెండర్లు',
    icon: Calendar,
    priceTag: 'from ₹650',
    studioPriceTag: 'from ₹380 lab rate'
  }
];

const BookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState(() => localStorage.getItem('site_lang') || 'EN');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // B2B Wholesale vs B2C Retail Pricing Toggle
  const [isStudioMode, setIsStudioMode] = useState(() => {
    return user?.role === 'studio' || Boolean(user?.studioName);
  });

  // Experience Mode: 'custom' | 'bundles'
  const [experienceMode, setExperienceMode] = useState('bundles'); // Defaults to Bundles for instant fast presets, switchable to custom
  const [appliedBundle, setAppliedBundle] = useState(null);

  // Orientation filter for album sizes: 'all' | 'landscape' | 'portrait'
  const [selectedOrientation, setSelectedOrientation] = useState('all');

  const [dynamicPricing, setDynamicPricing] = useState({
    sizes: DEFAULT_ALBUM_SIZES,
    sheets: DEFAULT_SHEETS,
    services: [],
    packages: []
  });

  // Fetch dynamic pricing set by admin with seamless fallback to rich seed catalog
  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/builder/album-sizes`).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${API}/api/builder/sheets`).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${API}/api/builder/services`).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${API}/api/packages`).then(r => r.ok ? r.json() : []).catch(() => [])
    ]).then(([sizes, sheets, services, packages]) => {
      setDynamicPricing({
        sizes: (sizes && sizes.length > 0) ? sizes : DEFAULT_ALBUM_SIZES,
        sheets: (sheets && sheets.length > 0) ? sheets : DEFAULT_SHEETS,
        services: services || [],
        packages: packages || []
      });
    }).catch(console.error);
  }, []);

  // Sync user role with studio mode
  useEffect(() => {
    if (user?.role === 'studio' || user?.studioName) {
      setIsStudioMode(true);
    }
  }, [user]);

  // Form State with Multi-Select and Itemized Per-Unit Configuration
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Vijayawada',
    eventType: 'Wedding',
    eventDate: '',
    instructions: '',
    deliverySpeed: 'standard', // 'standard' | 'express'
    
    // Category Enablement
    services: {
      albumPrint: true, // Default enabled
      videoEdit: false,
      photoEdit: false,
      flexBanner: false,
      calendars: false,
    },
    
    // Album Specifications
    albumType: 'karizma', // 'karizma' | 'acrylic' | 'velvet' | 'leather' | 'flushmount'
    albumSize: '12x36', // '12x36' | '12x30' | '18x12' etc.
    selectedSheetTypes: ['velvet'], // Supports MULTIPLE sheet types! e.g. ['velvet', 'metallic']
    pages: 30, // 30, 40, 50, 60, 80, 100 sheets
    boxType: 'standard', // 'standard' | 'velvet_case' | 'wooden_box' | 'acrylic_box'
    parentAlbums: 0, // 0, 1, 2
    
    // Video Editing Options - MULTI-SELECT!
    selectedVideoServices: ['teaser'], // e.g. ['teaser', 'reels', 'traditional']
    musicStyle: 'telugu_romantic',
    
    // Photo Editing Options - MULTI-SELECT!
    selectedPhotoServices: ['retouching'], // e.g. ['retouching', 'karizma_psd']
    photoCount: 50, // 30, 50, 100, 200, 300, 500
    
    // Flex & Banners Options - MULTI-SELECT!
    selectedFlexServices: [], // e.g. ['mandap', 'invite']
    
    // Calendars & Keepsakes Options - MULTI-SELECT!
    selectedCalendarServices: [], // e.g. ['desk_easel']
    calendarCopies: 1, // 1, 2, 5, 10, 25, 50
    
    // Step 3: Media upload method
    uploadMethod: 'cloud', // 'cloud' | 'whatsapp' | 'courier'
    cloudLink: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem('site_lang') || 'EN');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  // Service category toggle (for 5 grid tiles)
  const toggleServiceCategory = (key) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: !prev.services[key]
      }
    }));
  };

  // 1-Click Fast Bundle Applier
  const applyBundle = (bundleKey, directToEvent = true) => {
    setAppliedBundle(bundleKey);
    if (bundleKey === 'royal_telugu') {
      setFormData(prev => ({
        ...prev,
        services: {
          albumPrint: true,
          videoEdit: true,
          photoEdit: true,
          flexBanner: false,
          calendars: false,
        },
        albumType: 'karizma',
        albumSize: '12x36',
        selectedSheetTypes: ['velvet'],
        pages: 40,
        boxType: 'standard',
        selectedVideoServices: ['teaser', 'reels'],
        selectedPhotoServices: ['retouching', 'cinematic_luts'],
        photoCount: 50,
      }));
    } else if (bundleKey === 'cinematic_duo') {
      setFormData(prev => ({
        ...prev,
        services: {
          albumPrint: true,
          videoEdit: true,
          photoEdit: true,
          flexBanner: false,
          calendars: false,
        },
        albumType: 'karizma',
        albumSize: '12x30',
        selectedSheetTypes: ['metallic'],
        pages: 30,
        boxType: 'standard',
        selectedVideoServices: ['teaser', 'reels'],
        selectedPhotoServices: ['retouching'],
        photoCount: 30,
      }));
    } else if (bundleKey === 'lab_express') {
      setFormData(prev => ({
        ...prev,
        services: {
          albumPrint: true,
          videoEdit: false,
          photoEdit: false,
          flexBanner: false,
          calendars: false,
        },
        albumType: 'flushmount',
        albumSize: '12x36',
        selectedSheetTypes: ['metallic'],
        pages: 30,
        boxType: 'velvet_case',
        deliverySpeed: 'express',
      }));
    }
    if (directToEvent) {
      setStep(2);
    } else {
      setExperienceMode('custom');
    }
  };

  // Multi-select toggle helpers
  const toggleSheetType = (sheetId) => {
    setFormData(prev => {
      const exists = prev.selectedSheetTypes.includes(sheetId);
      let updated;
      if (exists) {
        // Keep at least one selected
        if (prev.selectedSheetTypes.length > 1) {
          updated = prev.selectedSheetTypes.filter(id => id !== sheetId);
        } else {
          updated = prev.selectedSheetTypes;
        }
      } else {
        updated = [...prev.selectedSheetTypes, sheetId];
      }
      return { ...prev, selectedSheetTypes: updated };
    });
  };

  const toggleVideoService = (vId) => {
    setFormData(prev => {
      const exists = prev.selectedVideoServices.includes(vId);
      const updated = exists
        ? prev.selectedVideoServices.filter(id => id !== vId)
        : [...prev.selectedVideoServices, vId];
      return {
        ...prev,
        selectedVideoServices: updated,
        services: {
          ...prev.services,
          videoEdit: updated.length > 0
        }
      };
    });
  };

  const togglePhotoService = (pId) => {
    setFormData(prev => {
      const exists = prev.selectedPhotoServices.includes(pId);
      const updated = exists
        ? prev.selectedPhotoServices.filter(id => id !== pId)
        : [...prev.selectedPhotoServices, pId];
      return {
        ...prev,
        selectedPhotoServices: updated,
        services: {
          ...prev.services,
          photoEdit: updated.length > 0
        }
      };
    });
  };

  const toggleFlexService = (fId) => {
    setFormData(prev => {
      const exists = prev.selectedFlexServices.includes(fId);
      const updated = exists
        ? prev.selectedFlexServices.filter(id => id !== fId)
        : [...prev.selectedFlexServices, fId];
      return {
        ...prev,
        selectedFlexServices: updated,
        services: {
          ...prev.services,
          flexBanner: updated.length > 0
        }
      };
    });
  };

  const toggleCalendarService = (cId) => {
    setFormData(prev => {
      const exists = prev.selectedCalendarServices.includes(cId);
      const updated = exists
        ? prev.selectedCalendarServices.filter(id => id !== cId)
        : [...prev.selectedCalendarServices, cId];
      return {
        ...prev,
        selectedCalendarServices: updated,
        services: {
          ...prev.services,
          calendars: updated.length > 0
        }
      };
    });
  };

  // Precise, 100% Itemized Pricing Calculation (No Arbitrary Bulk Lump Sums!)
  const calculateTotal = (forceMode = null) => {
    const studio = forceMode !== null ? forceMode : isStudioMode;
    let total = 0;

    // 1. Album Print & Design
    if (formData.services.albumPrint) {
      let basePrice = studio ? 6800 : 9500;
      
      const matchedSize = dynamicPricing.sizes.find(s => s.id === formData.albumSize || s.dimensions?.includes(formData.albumSize) || s.name?.includes(formData.albumSize));
      if (matchedSize) {
        basePrice = studio && matchedSize.studioBasePrice ? matchedSize.studioBasePrice : matchedSize.basePrice;
      }

      // Cover style surcharge
      if (formData.albumType === 'acrylic') basePrice += (studio ? 1000 : 1500);
      else if (formData.albumType === 'velvet') basePrice += (studio ? 700 : 1000);
      else if (formData.albumType === 'leather') basePrice += (studio ? 800 : 1200);

      // Multiple sheet types calculation
      const activeSheets = dynamicPricing.sheets.filter(s => formData.selectedSheetTypes.includes(s.id));
      let avgSheetRate = studio ? 42 : 65;
      if (activeSheets.length > 0) {
        const sumRates = activeSheets.reduce((acc, s) => acc + (studio && s.studioPricePerSheet ? s.studioPricePerSheet : s.pricePerSheet), 0);
        avgSheetRate = Math.round(sumRates / activeSheets.length);
      }

      // Extra sheets above 30
      const extraSheets = Math.max(0, formData.pages - 30);
      total += basePrice + (extraSheets * avgSheetRate);

      // Presentation box
      if (formData.boxType === 'velvet_case') total += (studio ? 800 : 1200);
      else if (formData.boxType === 'wooden_box') total += (studio ? 1200 : 1800);
      else if (formData.boxType === 'acrylic_box') total += (studio ? 1500 : 2200);

      // Duplicate parent albums
      if (formData.parentAlbums === 1) total += (studio ? 1800 : 2500);
      else if (formData.parentAlbums === 2) total += (studio ? 3200 : 4500);
    }

    // 2. Video Editing (Sum of all individually selected video services!)
    if (formData.services.videoEdit && formData.selectedVideoServices.length > 0) {
      formData.selectedVideoServices.forEach(vId => {
        const item = VIDEO_SERVICES.find(v => v.id === vId);
        if (item) {
          total += (studio ? item.studioPrice : item.price);
        }
      });
    }

    // 3. Photo Editing (Sum of individually selected per-photo rates * photo count)
    if (formData.services.photoEdit && formData.selectedPhotoServices.length > 0) {
      let combinedPerPhoto = 0;
      formData.selectedPhotoServices.forEach(pId => {
        const item = PHOTO_SERVICES.find(p => p.id === pId);
        if (item) {
          combinedPerPhoto += (studio ? item.studioRate : item.rate);
        }
      });
      const photoMin = studio ? 800 : 1200;
      total += Math.max(photoMin, combinedPerPhoto * formData.photoCount);
    }

    // 4. Flex, Hoardings & Invitations (Sum of all individually selected items!)
    if (formData.services.flexBanner && formData.selectedFlexServices.length > 0) {
      formData.selectedFlexServices.forEach(fId => {
        const item = FLEX_SERVICES.find(f => f.id === fId);
        if (item) {
          total += (studio ? item.studioPrice : item.price);
        }
      });
    }

    // 5. Calendars & Keepsakes
    if (formData.services.calendars && formData.selectedCalendarServices.length > 0) {
      let calendarUnitSum = 0;
      formData.selectedCalendarServices.forEach(cId => {
        const item = CALENDAR_SERVICES.find(c => c.id === cId);
        if (item) {
          calendarUnitSum += (studio ? item.studioPrice : item.price);
        }
      });
      total += calendarUnitSum * (formData.calendarCopies || 1);
    }

    // Speed surcharge
    if (formData.deliverySpeed === 'express') {
      total += (studio ? 1000 : 1500);
    }

    return total;
  };

  const retailTotal = calculateTotal(false);
  const wholesaleTotal = calculateTotal(true);
  const studioSavings = Math.max(0, retailTotal - wholesaleTotal);

  const proceedToNextStep = () => {
    if (step === 1) {
      const hasAnyService = Object.values(formData.services).some(Boolean);
      if (!hasAnyService) {
        alert(lang === 'TE' ? 'దయచేసి కనీసం ఒక సేవను ఎంచుకోండి.' : 'Please select at least one service to continue.');
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      if (!formData.name.trim()) {
        alert(lang === 'TE' ? 'దయచేసి మీ పేరు నమోదు చేయండి.' : 'Please enter your name.');
        return;
      }
      if (!formData.phone.trim() || formData.phone.length < 10) {
        alert(lang === 'TE' ? 'దయచేసి సరైన వాట్సాప్ ఫోన్ నెంబర్ నమోదు చేయండి.' : 'Please enter a valid 10-digit WhatsApp phone number.');
        return;
      }
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submitOrder = async (currentUser = user) => {
    if (!currentUser && !user) {
      setShowAuthModal(true);
      return;
    }

    setSubmitting(true);
    try {
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const totalAmount = calculateTotal();
      const payload = {
        orderId,
        name: formData.name,
        email: formData.email || (currentUser?.email || ''),
        phone: formData.phone,
        address: formData.address,
        total: totalAmount,
        status: 'Confirmed',
        cloudLink: formData.uploadMethod === 'cloud' ? formData.cloudLink : '',
        uploadPreference: formData.uploadMethod,
        instructions: `[${isStudioMode ? 'B2B STUDIO WHOLESALE' : 'B2C CUSTOMER'} | ${formData.eventType} in ${formData.city}] Album: ${formData.albumType} ${formData.albumSize} (${formData.pages} sheets, Sheets: ${formData.selectedSheetTypes.join('+')}). Videos: [${formData.selectedVideoServices.join(', ')}]. Photos: [${formData.selectedPhotoServices.join(', ')}] (${formData.photoCount}p). Flex: [${formData.selectedFlexServices.join(', ')}]. Calendars: [${formData.selectedCalendarServices.join(', ')}] (${formData.calendarCopies}x). Speed: ${formData.deliverySpeed}. Notes: ${formData.instructions || 'Standard order'}`,
        data: {
          pricingTier: isStudioMode ? 'b2b_studio' : 'b2c_retail',
          services: formData.services,
          albumType: formData.albumType,
          albumSize: formData.albumSize,
          selectedSheetTypes: formData.selectedSheetTypes,
          pages: formData.pages,
          boxType: formData.boxType,
          parentAlbums: formData.parentAlbums,
          selectedVideoServices: formData.selectedVideoServices,
          musicStyle: formData.musicStyle,
          selectedPhotoServices: formData.selectedPhotoServices,
          photoCount: formData.photoCount,
          selectedFlexServices: formData.selectedFlexServices,
          selectedCalendarServices: formData.selectedCalendarServices,
          calendarCopies: formData.calendarCopies,
          city: formData.city,
          eventType: formData.eventType,
          deliverySpeed: formData.deliverySpeed
        }
      };

      await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Save to cart session as well for checkout continuity
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`${API}/api/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            items: [{
              type: 'custom_booking',
              name: `Custom Post-Production Package (${formData.eventType} - ${isStudioMode ? 'Studio Trade' : 'Retail'})`,
              price: totalAmount,
              details: payload.data
            }],
            totalAmount
          })
        }).catch(() => {});
      }

      // Capture WhatsApp lead sync
      fetch(`${API}/api/whatsapp-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          name: formData.name,
          service: `Booking ${orderId} (${formData.eventType} - ${isStudioMode ? 'B2B Studio' : 'B2C'})`,
          note: `Total: ₹${totalAmount.toLocaleString('en-IN')}`
        })
      }).catch(() => {});

      setFormData(prev => ({ ...prev, createdOrderId: orderId }));
      setSubmitted(true);
    } catch (err) {
      console.error('Order submission error:', err);
      alert('Order registered in queue. Our coordinator will contact you shortly.');
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsAppDirect = () => {
    const selectedServiceNames = [
      formData.services.albumPrint && `Album (${formData.albumType} ${formData.albumSize}, ${formData.pages} sheets, Sheets: ${formData.selectedSheetTypes.join('+')})`,
      formData.services.videoEdit && formData.selectedVideoServices.length > 0 && `Videos (${formData.selectedVideoServices.join(', ')})`,
      formData.services.photoEdit && formData.selectedPhotoServices.length > 0 && `Photos (${formData.selectedPhotoServices.join(', ')} - ${formData.photoCount} pics)`,
      formData.services.flexBanner && formData.selectedFlexServices.length > 0 && `Flex (${formData.selectedFlexServices.join(', ')})`,
      formData.services.calendars && formData.selectedCalendarServices.length > 0 && `Calendars (${formData.selectedCalendarServices.join(', ')} - ${formData.calendarCopies} copies)`
    ].filter(Boolean).join('\n• ') || 'Custom Wedding Package';

    const msg = `*WeddingAlbums.in - New Booking Quote* 💍\n` +
      `--------------------------------\n` +
      `*Client:* ${formData.name || 'Valued Client'}\n` +
      `*Phone:* ${formData.phone || 'Not provided'}\n` +
      `*Account Type:* ${isStudioMode ? '🏢 Studio Wholesale Trade (B2B)' : '👥 Customer Retail (B2C)'}\n` +
      `*Event:* ${formData.eventType} in ${formData.city}\n` +
      `*Speed:* ${formData.deliverySpeed === 'express' ? '🚀 Express 24-48h' : '⚡ Standard 3-5 Days'}\n\n` +
      `*Selected Services:*\n• ${selectedServiceNames}\n\n` +
      `*Total Estimate:* ₹${calculateTotal().toLocaleString('en-IN')}${isStudioMode && studioSavings > 0 ? ` (Saved ₹${studioSavings.toLocaleString('en-IN')} with Studio rates)` : ''}\n` +
      `--------------------------------\n` +
      `Please confirm my booking and schedule design proofing!`;

    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Filter sizes based on selectedOrientation
  const filteredSizes = dynamicPricing.sizes.filter(sz => {
    if (selectedOrientation === 'all') return true;
    return sz.orientation === selectedOrientation;
  });

  // SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-[#050505]">
        <div className="max-w-xl w-full p-8 sm:p-10 rounded-3xl bg-[#111] border border-[#D4AF37]/40 text-center shadow-[0_0_50px_rgba(212,175,55,0.2)]">
          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-6 text-[#D4AF37]">
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-3xl font-serif text-white font-bold mb-2">
            {lang === 'TE' ? 'ఆర్డర్ విజయవంతంగా నమోదైంది! 🎉' : 'Booking Confirmed! 🎉'}
          </h2>
          <p className="text-sm text-gray-300 mb-6">
            {lang === 'TE'
              ? 'ధన్యవాదాలు! మీ ఆర్డర్ వివరాలు మా పోస్ట్-ప్రొడక్షన్ మేనేజర్‌కు చేరాయి. మా టీమ్ త్వరలోనే మీ వాట్సాప్‌లో కనెక్ట్ అవుతారు.'
              : 'Thank you! Your project details have reached our lab team. We will connect on your WhatsApp with digital proofs and updates.'}
          </p>

          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Order Reference:</span>
              <span className="text-[#D4AF37] font-mono font-bold">{formData.createdOrderId || 'ORD-VERIFIED'}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Pricing Tier:</span>
              <span className="text-white font-semibold">{isStudioMode ? '🏢 Studio Wholesale' : '👥 Retail Customer'}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Total Estimated:</span>
              <span className="text-emerald-400 font-mono font-bold">₹{calculateTotal().toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Delivery Speed:</span>
              <span className="text-white capitalize">{formData.deliverySpeed === 'express' ? '🚀 Express (24-48 Hours)' : '⚡ Standard (3-5 Days)'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={openWhatsAppDirect}
              className="flex-1 py-3.5 px-4 rounded-xl bg-[#25D366] text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20ba59] transition"
            >
              <MessageCircle size={18} />
              <span>Track on WhatsApp</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3.5 px-4 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-layout pt-28 pb-20">
      {/* LEFT: 3-STEP WIZARD */}
      <div className="builder-main">
        
        {/* Header */}
        <div className="order-header mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            {lang === 'TE' ? 'ఆంధ్రప్రదేశ్ నెం.1 పోస్ట్-ప్రొడక్షన్ హబ్' : "Andhra Pradesh's #1 Post-Production Hub"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white font-bold mb-2">
            {lang === 'TE' ? 'అన్ని ఎడిటింగ్, వీడియో & ప్రింటింగ్ సేవలు ఒకే చోట' : 'All Editing, Video & Printing Services in One Place'}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
            {lang === 'TE'
              ? 'సులువైన 3 దశలు. ఫోటో ఎడిటింగ్, సినిమాటిక్ వీడియోలు, ఫ్లష్ మౌంట్ ఆల్బమ్స్, పెద్ద ఫ్లెక్స్ మరియు క్యాలెండర్లు.'
              : 'Effortless 3 steps. Pick photo retouching, cinematic films, flush mount albums, large flex prints, or calendars.'}
          </p>
        </div>

        {/* 🏢 B2B STUDIO WHOLESALE VS B2C CUSTOMER RETAIL TOGGLE */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/70 border border-[#D4AF37]/30 mb-8 flex-wrap gap-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isStudioMode ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-white/10 text-gray-300'}`}>
              <Building2 size={22} />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{isStudioMode ? '🏢 Studio Wholesale Trade Rates (B2B)' : '👥 Customer Retail Pricing (B2C)'}</span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${isStudioMode ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                  {isStudioMode ? 'Wholesale Active' : 'Retail'}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {isStudioMode
                  ? '⚡ Trade pricing applied: Discounted lab rates on sheets, album sizes, and editing.'
                  : 'Are you a photo studio owner or freelance editor? Switch to Studio Mode for trade wholesale rates.'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsStudioMode(!isStudioMode)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 ${
              isStudioMode
                ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                : 'bg-white/5 text-gray-200 border-white/20 hover:border-[#D4AF37] hover:text-white'
            }`}
          >
            <Zap size={14} />
            {isStudioMode ? '✓ Studio Rates Active' : 'Unlock Studio Rates ⚡'}
          </button>
        </div>

        {/* 4-Step Process Banner */}
        <div className="process-workflow-banner">
          <div className="process-step-item">
            <div className="process-step-num">1</div>
            <div className="process-step-text">
              <h5>Choose & Upload</h5>
              <p>Pick services & share Drive link</p>
            </div>
          </div>
          <div className="process-step-item">
            <div className="process-step-num">2</div>
            <div className="process-step-text">
              <h5>Pro Design & Cut</h5>
              <p>Skin retouch, LUTs & video edit</p>
            </div>
          </div>
          <div className="process-step-item">
            <div className="process-step-num">3</div>
            <div className="process-step-text">
              <h5>Digital Proofing</h5>
              <p>Online approval with 1-click edits</p>
            </div>
          </div>
          <div className="process-step-item">
            <div className="process-step-num">4</div>
            <div className="process-step-text">
              <h5>Doorstep Delivery</h5>
              <p>Safe courier & 4K cloud download</p>
            </div>
          </div>
        </div>

        {/* 3-Step Indicator */}
        <div className="builder-progress mb-8">
          {[
            { num: 1, title: 'Services & Styles', telugu: 'సేవలు & స్టైల్స్', icon: Package },
            { num: 2, title: 'Event Details', telugu: 'ఈవెంట్ వివరాలు', icon: MapPin },
            { num: 3, title: 'Send Photos', telugu: 'ఫోటోలు & కన్ఫర్మ్', icon: UploadCloud },
          ].map((s) => (
            <div
              key={s.num}
              className={`progress-step ${step === s.num ? 'active' : step > s.num ? 'completed' : ''}`}
              style={{ cursor: step > s.num ? 'pointer' : 'default' }}
              onClick={() => step > s.num && setStep(s.num)}
            >
              <div className="step-icon">
                {step > s.num ? <Check size={18} /> : <s.icon size={18} />}
              </div>
              <div className="text-center">
                <span className="block font-bold">{s.title}</span>
                <span className="text-[11px] opacity-75 font-telugu">{s.telugu}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= STEP 1: CATEGORIZED SERVICES & SPECIFIC OPTIONS ================= */}
        {step === 1 && (
          <div className="space-y-6">

            {/* ⚡ EXPERIENCE MODE SWITCHER (BUNDLES VS CUSTOM BUILDER) */}
            <div className="mode-switch-bar">
              <button
                type="button"
                onClick={() => setExperienceMode('bundles')}
                className={`mode-switch-btn ${experienceMode === 'bundles' ? 'active' : ''}`}
              >
                <Sparkles size={18} className="text-[#D4AF37]" />
                <span>{lang === 'TE' ? '⚡ తక్షణ బండిల్స్ (1-క్లిక్ ప్రీసెట్స్)' : '⚡ 1-Click Fast Bundles (Curated Suites)'}</span>
              </button>
              <button
                type="button"
                onClick={() => setExperienceMode('custom')}
                className={`mode-switch-btn ${experienceMode === 'custom' ? 'active' : ''}`}
              >
                <Layers size={18} className="text-[#D4AF37]" />
                <span>{lang === 'TE' ? '🛠️ కస్టమ్ మల్టీ-సర్వీస్ బిల్డర్' : '🛠️ Custom Multi-Service Builder'}</span>
              </button>
            </div>

            {/* ================= MODE A: CURATED FAST BUNDLES ================= */}
            {experienceMode === 'bundles' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles size={20} className="text-[#D4AF37]" />
                      <span>{lang === 'TE' ? 'తక్షణ లగ్జరీ బండిల్స్ (1-క్లిక్)' : 'Curated Luxury Bundles (1-Click Presets)'}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {lang === 'TE' ? 'పూర్తి ప్యాకేజీని తక్షణమే ఎంచుకోండి. క్లిష్టమైన కాన్ఫిగరేషన్ అవసరం లేదు.' : 'Complete ready-to-go suites crafted for Andhra weddings. 1-click apply directly to checkout.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExperienceMode('custom')}
                    className="text-xs text-[#D4AF37] hover:underline font-semibold flex items-center gap-1 bg-[#D4AF37]/10 px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/30"
                  >
                    <span>Switch to Custom Builder</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Bundle 1 */}
                  <div className={`luxury-bundle-card ${appliedBundle === 'royal_telugu' ? 'active' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="bundle-badge">⭐ Best Value Master Suite</span>
                      <span className="bundle-savings">Save ₹8,500 Wholesale!</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Royal Telugu Muhurtham Master Suite</h4>
                    <div className="text-xs text-gray-400 font-telugu mb-3">రాయల్ తెలుగు ముహూర్తం మాస్టర్ సూట్</div>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-[#D4AF37]">₹17,999</span>
                      <span className="text-sm text-gray-500 line-through">₹26,499</span>
                      {isStudioMode && <span className="text-xs text-emerald-400 font-bold ml-auto">⚡ Wholesale Active</span>}
                    </div>

                    <ul className="text-xs text-gray-300 space-y-2 mb-6">
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> 12×36 Royal Panoramic Karizma Layflat (40 sheets, Velvet Silk)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> 4K Cinematic Wedding Teaser (3-5 min) + 5 IG Reels</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> High-End Skin Retouching & Color Grading (50 photos)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> Royal Velvet Briefcase Presentation Box</li>
                    </ul>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => applyBundle('royal_telugu', true)}
                        className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                      >
                        <span>Apply Bundle & Continue</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyBundle('royal_telugu', false)}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs transition"
                      >
                        Customize Options ✏️
                      </button>
                    </div>
                  </div>

                  {/* Bundle 2 */}
                  <div className={`luxury-bundle-card ${appliedBundle === 'cinematic_duo' ? 'active' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="bundle-badge">🎬 Most Popular Duo</span>
                      <span className="bundle-savings">Save ₹6,200 Wholesale!</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Cinematic Story & Karizma Duo</h4>
                    <div className="text-xs text-gray-400 font-telugu mb-3">సినిమాటిక్ స్టోరీ & కరిజ్మా డ్యుయో</div>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-[#D4AF37]">₹13,200</span>
                      <span className="text-sm text-gray-500 line-through">₹19,400</span>
                      {isStudioMode && <span className="text-xs text-emerald-400 font-bold ml-auto">⚡ Wholesale Active</span>}
                    </div>

                    <ul className="text-xs text-gray-300 space-y-2 mb-6">
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> 12×30 Classic Landscape Lay-Flat Album (30 sheets, Metallic Pearl)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> 4K Cinematic Wedding Teaser + 5 Instagram Reels (9:16)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> Pro Retouching & Warm Andhra Color Grading (30 photos)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> Standard Presentation Box Included</li>
                    </ul>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => applyBundle('cinematic_duo', true)}
                        className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                      >
                        <span>Apply Bundle & Continue</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyBundle('cinematic_duo', false)}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs transition"
                      >
                        Customize Options ✏️
                      </button>
                    </div>
                  </div>

                  {/* Bundle 3 */}
                  <div className={`luxury-bundle-card ${appliedBundle === 'lab_express' ? 'active' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="bundle-badge">🚀 Lab Express Printing Pack</span>
                      <span className="bundle-savings">Save ₹4,200 Wholesale!</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Studio Fast-Track Printing Pack</h4>
                    <div className="text-xs text-gray-400 font-telugu mb-3">స్టూడియో ఫాస్ట్-ట్రాక్ ప్రింటింగ్ ప్యాక్</div>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-[#D4AF37]">₹8,200</span>
                      <span className="text-sm text-gray-500 line-through">₹12,400</span>
                      {isStudioMode && <span className="text-xs text-emerald-400 font-bold ml-auto">⚡ Wholesale Active</span>}
                    </div>

                    <ul className="text-xs text-gray-300 space-y-2 mb-6">
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> 12×36 Lay-flat Karizma Flush Mount (30 sheets, Metallic Pearl)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> Royal Velvet Briefcase Presentation Box</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> Doorstep Courier Delivery within 3-4 working days</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[#D4AF37] mt-0.5 shrink-0" /> Waterproof & Tear-Resistant Coating</li>
                    </ul>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => applyBundle('lab_express', true)}
                        className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                      >
                        <span>Apply Bundle & Continue</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyBundle('lab_express', false)}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs transition"
                      >
                        Customize Options ✏️
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs text-gray-400">Prefer selecting individual services a-la-carte?</span>
                  <button
                    type="button"
                    onClick={() => setExperienceMode('custom')}
                    className="text-xs text-[#D4AF37] font-bold hover:underline"
                  >
                    Open Custom Multi-Service Builder →
                  </button>
                </div>
              </div>
            )}

            {/* ================= MODE B: CUSTOM MULTI-SERVICE BUILDER ================= */}
            {experienceMode === 'custom' && (
              <div className="space-y-8">
                {/* 5 SERVICE SELECTION TILES (ZERO SCROLLBARS - RESPONSIVE GRID!) */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <CheckSquare size={18} className="text-[#D4AF37]" />
                      <span>{lang === 'TE' ? 'కావాల్సిన సర్వీసులను ఎంచుకోండి (ఒకటి లేదా అంతకంటే ఎక్కువ)' : 'Choose Your Services (Pick One or Multiple)'}</span>
                    </h3>
                    <span className="text-xs text-gray-400">Click tiles to toggle services ON/OFF</span>
                  </div>

                  <div className="service-tiles-grid">
                    {SERVICE_CATEGORIES.map(cat => {
                      const isChecked = Boolean(formData.services[cat.key]);
                      return (
                        <div
                          key={cat.id}
                          onClick={() => toggleServiceCategory(cat.key)}
                          className={`service-tile-card ${isChecked ? 'checked' : ''}`}
                        >
                          <div className="service-tile-top">
                            <div className="service-tile-icon-box">
                              <cat.icon size={22} />
                            </div>
                            <div className="service-tile-check-circle">
                              {isChecked && <Check size={14} className="text-black stroke-[3]" />}
                            </div>
                          </div>
                          <div>
                            <div className="service-tile-title">{cat.name}</div>
                            <div className="service-tile-telugu font-telugu">{cat.telugu}</div>
                            <div className="service-tile-price">{isStudioMode ? cat.studioPriceTag : cat.priceTag}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ================= CONDITIONAL CONFIGURATORS (ONLY SELECTED ONES APPEAR!) ================= */}

                {/* 1. ALBUM PRINTING CONFIGURATOR */}
                {formData.services.albumPrint && (
                  <div className="dynamic-config-section">
                    <div className="dynamic-config-header">
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#D4AF37] flex items-center gap-2">
                          <BookOpen size={22} />
                          <span>{lang === 'TE' ? 'ఆల్బమ్ ప్రింటింగ్ & షీట్ల ఎంపిక' : 'Album Printing, Sizes & Sheets'}</span>
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Pick your dimensions, cover style, and one or multiple sheet types for hybrid layouts.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleServiceCategory('albumPrint')}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"
                      >
                        Remove Album
                      </button>
                    </div>

                    <div className="space-y-7">
                      {/* 1. Cover & Binding Style */}
                      <div>
                        <label className="block text-sm text-gray-200 font-bold mb-3">
                          1. Cover & Binding Style (కవర్ రకం)
                        </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { id: 'karizma', label: 'Karizma Royal Spread', note: "India's #1 Wedding Choice ⭐", surcharge: 'Standard' },
                          { id: 'acrylic', label: 'Crystal Acrylic Glass 3D', note: 'Ultra-modern high-gloss glass face', surcharge: isStudioMode ? '+₹1,000' : '+₹1,500' },
                          { id: 'velvet', label: 'Royal Velvet Touch', note: 'Soft luxury fabric feel', surcharge: isStudioMode ? '+₹700' : '+₹1,000' },
                          { id: 'leather', label: 'Embossed Leatherette', note: 'Timeless heirloom finish with gold foil', surcharge: isStudioMode ? '+₹800' : '+₹1,200' },
                          { id: 'flushmount', label: 'Seamless Lay-Flat Flush Mount', note: 'Edge-to-edge panoramic view', surcharge: 'Included' },
                        ].map(opt => (
                          <div
                            key={opt.id}
                            onClick={() => setFormData(p => ({ ...p, albumType: opt.id }))}
                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                              formData.albumType === opt.id
                                ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                                : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-sm text-white">{opt.label}</span>
                              <span className="text-xs text-[#D4AF37] font-mono font-bold">{opt.surcharge}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{opt.note}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Album Dimensions — Landscape ↔️ & Portrait ↕️ Orientation Filter */}
                    <div>
                      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                        <label className="text-sm text-gray-200 font-bold">
                          2. Album Dimensions & Orientations (సైజు & దిశ)
                        </label>
                        <span className="text-xs text-[#D4AF37] font-semibold">
                          Showing {filteredSizes.length} Available Sizes
                        </span>
                      </div>

                      {/* Orientation Filter Pills */}
                      <div className="orientation-filter-bar">
                        <button
                          type="button"
                          onClick={() => setSelectedOrientation('all')}
                          className={`orientation-pill ${selectedOrientation === 'all' ? 'active' : ''}`}
                        >
                          All Sizes ({dynamicPricing.sizes.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOrientation('landscape')}
                          className={`orientation-pill ${selectedOrientation === 'landscape' ? 'active' : ''}`}
                        >
                          ↔️ Landscape / Widescreen ({dynamicPricing.sizes.filter(s => s.orientation === 'landscape').length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOrientation('portrait')}
                          className={`orientation-pill ${selectedOrientation === 'portrait' ? 'active' : ''}`}
                        >
                          ↕️ Portrait / Royal Magazine ({dynamicPricing.sizes.filter(s => s.orientation === 'portrait').length})
                        </button>
                      </div>

                      {/* Album Sizes Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredSizes.map(sz => {
                          const szBase = isStudioMode && sz.studioBasePrice ? sz.studioBasePrice : sz.basePrice;
                          const isSelected = formData.albumSize === sz.id || formData.albumSize === sz.dimensions || formData.albumSize.includes(sz.id);

                          return (
                            <div
                              key={sz.id}
                              onClick={() => setFormData(p => ({ ...p, albumSize: sz.id }))}
                              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className={`aspect-indicator-box ${sz.orientation === 'portrait' ? 'portrait' : 'landscape'}`} />
                                  <span className="font-bold text-sm text-white">{sz.name}</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                  sz.orientation === 'portrait'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}>
                                  {sz.orientation === 'portrait' ? '↕️ Portrait' : '↔️ Landscape'}
                                </span>
                              </div>

                              {sz.telugu && <div className="text-xs text-[#D4AF37] font-telugu mt-0.5">{sz.telugu}</div>}
                              <div className="text-xs text-gray-400 mt-1">{sz.description}</div>

                              <div className="flex justify-between items-baseline mt-3 pt-2 border-t border-white/5">
                                <span className="text-sm text-[#D4AF37] font-mono font-bold">
                                  ₹{szBase.toLocaleString('en-IN')} base
                                </span>
                                {isStudioMode && sz.basePrice > szBase && (
                                  <span className="text-[11px] text-gray-400 line-through">
                                    ₹{sz.basePrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Paper Sheet Finish — Multiple Sheet Selection with Per-Sheet Pricing */}
                    <div>
                      <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                        <label className="text-sm text-gray-200 font-bold">
                          3. Paper Sheet Finishes (షీట్ రకాలు - Select 1 or More)
                        </label>
                        <span className="text-xs text-emerald-400 font-semibold">
                          {formData.selectedSheetTypes.length} Sheet Type(s) Selected
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">
                        You can select multiple sheet types (e.g., Velvet Touch for story spreads + Metallic Pearl for stage jewellery). Price per sheet is transparently shown below.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {dynamicPricing.sheets.map(sht => {
                          const shtRate = isStudioMode && sht.studioPricePerSheet ? sht.studioPricePerSheet : sht.pricePerSheet;
                          const isSelected = formData.selectedSheetTypes.includes(sht.id);

                          return (
                            <div
                              key={sht.id}
                              onClick={() => toggleSheetType(sht.id)}
                              className={`service-check-card ${isSelected ? 'checked' : ''}`}
                            >
                              <div className="service-checkbox-circle">
                                {isSelected && <Check size={14} />}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <h5 className="font-bold text-xs sm:text-sm text-white">{sht.name}</h5>
                                </div>
                                <div className="text-xs font-mono font-bold text-[#D4AF37] mt-0.5">₹{shtRate} / sheet</div>
                                {sht.telugu && <div className="text-[11px] text-[#D4AF37] font-telugu mt-0.5">{sht.telugu}</div>}
                                <div className="text-[11px] text-gray-400 mt-1 leading-snug">{sht.note || sht.description}</div>
                                {isStudioMode && sht.pricePerSheet > shtRate && (
                                  <div className="text-[10px] text-emerald-400 mt-2 font-semibold">
                                    Save ₹{sht.pricePerSheet - shtRate}/sheet wholesale
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Sheet Count Bubbles */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm text-gray-200 font-bold">4. Sheets Count (1 Sheet = 2 Pages)</label>
                        <span className="text-[#D4AF37] font-bold text-sm bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                          {formData.pages} Sheets (~{formData.pages * 6} photos)
                        </span>
                      </div>
                      <div className="flex gap-2.5 flex-wrap">
                        {[30, 40, 50, 60, 80, 100].map(cnt => (
                          <button
                            key={cnt}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, pages: cnt }))}
                            className={`bubble-pill ${formData.pages === cnt ? 'active' : ''}`}
                          >
                            {cnt} Sheets
                          </button>
                        ))}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {formData.pages <= 30
                          ? '30 Sheets included in base album price.'
                          : `30 Sheets in base + ${formData.pages - 30} extra sheets calculated itemized per sheet.`}
                      </div>
                    </div>

                    {/* 5. Luxury Box */}
                    <div>
                      <label className="text-sm text-gray-200 font-bold mb-3 block">
                        5. Luxury Box (ప్రెజెంటేషన్ బాక్స్)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: 'standard', label: 'Standard Presentation Box', surcharge: '(Included)' },
                          { id: 'velvet_case', label: 'Royal Velvet Briefcase Matching Box', surcharge: isStudioMode ? '+₹800' : '+₹1,200' },
                          { id: 'wooden_box', label: 'Laser Engraved Wooden Core Box', surcharge: isStudioMode ? '+₹1,200' : '+₹1,800' },
                          { id: 'acrylic_box', label: 'Acrylic Luxury Window Box', surcharge: isStudioMode ? '+₹1,500' : '+₹2,200' },
                        ].map(box => (
                          <div
                            key={box.id}
                            onClick={() => setFormData({ ...formData, boxType: box.id })}
                            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                              formData.boxType === box.id
                                ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                            }`}
                          >
                            <span className="font-semibold text-xs sm:text-sm">{box.label}</span>
                            <span className="text-xs text-[#D4AF37] font-mono font-bold ml-2">{box.surcharge}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Duplicate Parent Albums Addon */}
                    <div className="p-4 rounded-xl bg-black/60 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold text-white">Add Duplicate Pocket / Parent Albums</div>
                        <div className="text-xs text-gray-400 mt-0.5">Gift matching mini replica albums to parents or in-laws</div>
                      </div>
                      <div className="flex gap-2">
                        {[
                          { cnt: 0, label: 'None' },
                          { cnt: 1, label: isStudioMode ? '+1 Mini (+₹1,800)' : '+1 Mini (+₹2,500)' },
                          { cnt: 2, label: isStudioMode ? '+2 Minis (+₹3,200)' : '+2 Minis (+₹4,500)' },
                        ].map(b => (
                          <button
                            key={b.cnt}
                            type="button"
                            onClick={() => setFormData({ ...formData, parentAlbums: b.cnt })}
                            className={`bubble-pill ${formData.parentAlbums === b.cnt ? 'active' : ''}`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CINEMATIC VIDEO EDITING CONFIGURATOR */}
                {formData.services.videoEdit && (
                  <div className="dynamic-config-section">
                    <div className="dynamic-config-header">
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-[#D4AF37] flex items-center gap-2">
                          <Film size={22} />
                          <span>{lang === 'TE' ? '2. సినిమాటిక్ వీడియో ఎడిటింగ్ సేవలు' : '2. Cinematic Video Editing Services'}</span>
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Multi-select one or more video cuts below. Each itemized with transparent prices.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleServiceCategory('videoEdit')}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"
                      >
                        Remove Video
                      </button>
                    </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {VIDEO_SERVICES.map(v => {
                    const isSelected = formData.selectedVideoServices.includes(v.id);
                    const vPrice = isStudioMode ? v.studioPrice : v.price;

                    return (
                      <div
                        key={v.id}
                        onClick={() => toggleVideoService(v.id)}
                        className={`service-check-card ${isSelected ? 'checked' : ''}`}
                      >
                        <div className="service-checkbox-circle">
                          {isSelected && <Check size={14} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-sm text-white">{v.name}</span>
                            <span className="text-sm text-[#D4AF37] font-mono font-bold ml-2">
                              +₹{vPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="text-xs text-[#D4AF37] font-telugu mt-0.5">{v.telugu}</div>
                          <div className="text-xs text-gray-400 mt-1">{v.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                  <div>
                    <label className="text-xs text-gray-200 font-bold mb-1.5 block">Audio / Music Direction</label>
                    <select
                      value={formData.musicStyle}
                      onChange={e => setFormData({ ...formData, musicStyle: e.target.value })}
                      className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white text-xs outline-none focus:border-[#D4AF37]"
                    >
                      <option value="telugu_romantic">Classical & Modern Telugu Romantic Melodies</option>
                      <option value="devotional">Traditional Nadaswaram & Mangala Vaadhyam</option>
                      <option value="energetic">High-Energy Trending Beats & Bass</option>
                      <option value="custom">I will provide our custom Telugu song playlist</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-200 font-bold mb-1.5 block">Voiceover / Audio Cleanup</label>
                    <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} /> ✓ AI Speech Isolation & Background Noise Removal Included
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PHOTO RETOUCHING & COLOR GRADING CONFIGURATOR */}
            {formData.services.photoEdit && (
              <div className="dynamic-config-section">
                <div className="dynamic-config-header">
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-[#D4AF37] flex items-center gap-2">
                      <Palette size={22} />
                      <span>{lang === 'TE' ? '3. ఫొటో రీటచింగ్ & కలర్ గ్రేడింగ్ సేవలు' : '3. Photo Retouching & Color Grading'}</span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Multi-select editing styles below. Calculated transparently per photo.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleServiceCategory('photoEdit')}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"
                  >
                    Remove Photo Retouch
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {PHOTO_SERVICES.map(p => {
                    const isSelected = formData.selectedPhotoServices.includes(p.id);
                    const pRate = isStudioMode ? p.studioRate : p.rate;

                    return (
                      <div
                        key={p.id}
                        onClick={() => togglePhotoService(p.id)}
                        className={`service-check-card ${isSelected ? 'checked' : ''}`}
                      >
                        <div className="service-checkbox-circle">
                          {isSelected && <Check size={14} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-sm text-white">{p.name}</span>
                            <span className="text-sm text-[#D4AF37] font-mono font-bold ml-2">
                              +₹{pRate}/p
                            </span>
                          </div>
                          <div className="text-xs text-[#D4AF37] font-telugu mt-0.5">{p.telugu}</div>
                          <div className="text-xs text-gray-400 mt-1">{p.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="text-sm text-gray-200 font-bold block">Estimated Photos to Edit:</label>
                    <span className="text-xs text-gray-400">Total photos to apply selected retouching</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[30, 50, 100, 200, 300, 500].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setFormData({ ...formData, photoCount: cnt })}
                        className={`bubble-pill ${formData.photoCount === cnt ? 'active' : ''}`}
                      >
                        {cnt} Photos
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. FLEX, BANNERS & WHATSAPP INVITES CONFIGURATOR */}
            {formData.services.flexBanner && (
              <div className="dynamic-config-section">
                <div className="dynamic-config-header">
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-[#D4AF37] flex items-center gap-2">
                      <MonitorPlay size={22} />
                      <span>{lang === 'TE' ? '4. ఫ్లెక్స్, బ్యానర్లు & వాట్సాప్ ఆహ్వానాలు' : '4. Wedding Flex, Banners & Invites'}</span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Multi-select large format outdoor printing & digital video invites.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleServiceCategory('flexBanner')}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"
                  >
                    Remove Flex
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {FLEX_SERVICES.map(f => {
                    const isSelected = formData.selectedFlexServices.includes(f.id);
                    const fPrice = isStudioMode ? f.studioPrice : f.price;

                    return (
                      <div
                        key={f.id}
                        onClick={() => toggleFlexService(f.id)}
                        className={`service-check-card ${isSelected ? 'checked' : ''}`}
                      >
                        <div className="service-checkbox-circle">
                          {isSelected && <Check size={14} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-sm text-white">{f.name}</span>
                            <span className="text-sm text-[#D4AF37] font-mono font-bold ml-2">
                              +₹{fPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="text-xs text-[#D4AF37] font-telugu mt-0.5">{f.telugu}</div>
                          <div className="text-xs text-gray-400 mt-1">{f.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. CALENDARS & KEEPSAKES CONFIGURATOR */}
            {formData.services.calendars && (
              <div className="dynamic-config-section">
                <div className="dynamic-config-header">
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-[#D4AF37] flex items-center gap-2">
                      <Calendar size={22} />
                      <span>{lang === 'TE' ? '5. కపుల్ క్యాలెండర్లు & బహుమతి వస్తువులు' : '5. Personalized Calendars & Keepsakes'}</span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Multi-select desk calendars and wall posters with couple photos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleServiceCategory('calendars')}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"
                  >
                    Remove Calendars
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {CALENDAR_SERVICES.map(c => {
                    const isSelected = formData.selectedCalendarServices.includes(c.id);
                    const cPrice = isStudioMode ? c.studioPrice : c.price;

                    return (
                      <div
                        key={c.id}
                        onClick={() => toggleCalendarService(c.id)}
                        className={`service-check-card ${isSelected ? 'checked' : ''}`}
                      >
                        <div className="service-checkbox-circle">
                          {isSelected && <Check size={14} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-sm text-white">{c.name}</span>
                          </div>
                          <div className="text-xs text-[#D4AF37] font-mono font-bold mt-1">
                            +₹{cPrice.toLocaleString('en-IN')} / ea
                          </div>
                          <div className="text-xs text-[#D4AF37] font-telugu mt-0.5">{c.telugu}</div>
                          <div className="text-xs text-gray-400 mt-1">{c.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="text-sm text-gray-200 font-bold block">Number of Calendar Copies (కాపీల సంఖ్య):</label>
                    <span className="text-xs text-gray-400">Total copies printed</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 5, 10, 25, 50].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setFormData({ ...formData, calendarCopies: cnt })}
                        className={`bubble-pill ${formData.calendarCopies === cnt ? 'active' : ''}`}
                      >
                        {cnt} {cnt === 1 ? 'Copy' : 'Copies'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* EMPTY STATE IF NO SERVICES CHECKED IN CUSTOM BUILDER */}
            {!Object.values(formData.services).some(Boolean) && (
              <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/20 text-center">
                <Sparkles size={36} className="text-[#D4AF37] mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-1">
                  {lang === 'TE' ? 'ఏదైనా సర్వీస్‌ను ఎంచుకోండి' : 'No Services Selected Yet'}
                </h4>
                <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
                  Click on one or more service tiles above to customize your project, or choose a pre-built 1-Click Fast Bundle.
                </p>
                <button
                  type="button"
                  onClick={() => setExperienceMode('bundles')}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-sm hover:bg-[#b8952b] transition shadow-lg"
                >
                  Browse 1-Click Fast Bundles
                </button>
              </div>
            )}

            {/* NEXT STEP BUTTON */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={proceedToNextStep}
                className="btn btn-gold-3d flex items-center gap-2 px-8 py-4 text-base font-bold shadow-[0_0_25px_rgba(212,175,55,0.4)]"
              >
                <span>{lang === 'TE' ? 'తదుపరి దశ: వివరాలు నమోదు చేయండి' : 'Next: Event & Contact Details'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
          </div>
        )}

        {/* ================= STEP 2: EVENT & CONTACT ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                2. {lang === 'TE' ? 'మీ ఈవెంట్ & డెలివరీ వివరాలు' : 'Your Event & Delivery Details'}
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                {lang === 'TE'
                  ? 'మీ వాట్సాప్ నెంబర్‌కు ఆర్డర్ అప్‌డేట్స్ మరియు ప్రూఫ్ లింక్ వస్తుంది.'
                  : 'We will send preview proofs and tracking updates directly to your WhatsApp.'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 font-semibold mb-2">
                    {lang === 'TE' ? 'మీ పూర్తి పేరు *' : 'Your Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[#D4AF37] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 font-semibold mb-2">
                    {lang === 'TE' ? 'వాట్సాప్ మొబైల్ నెంబర్ *' : 'WhatsApp Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[#D4AF37] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 font-semibold mb-2">
                  {lang === 'TE' ? 'ఈవెంట్ రకం' : 'Event Type'}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: 'Wedding', telugu: 'పెళ్ళి' },
                    { id: 'Engagement', telugu: 'నిశ్చితార్థం' },
                    { id: 'Reception', telugu: 'రిసెప్షన్' },
                    { id: 'Half-Saree / Dhoti', telugu: 'లంగా వోణి' },
                    { id: 'Birthday / Other', telugu: 'పుట్టినరోజు' },
                  ].map(evt => (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, eventType: evt.id })}
                      className={`bubble-pill ${formData.eventType === evt.id ? 'active' : ''}`}
                    >
                      {evt.id} <span className="font-telugu text-xs opacity-75">({evt.telugu})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 font-semibold mb-2">
                    {lang === 'TE' ? 'నగరం / పట్టణం' : 'City / District'}
                  </label>
                  <select
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[#D4AF37] outline-none"
                  >
                    <option value="Vijayawada">Vijayawada (విజయవాడ)</option>
                    <option value="Guntur">Guntur (గుంటూరు)</option>
                    <option value="Visakhapatnam">Visakhapatnam (విశాఖపట్నం)</option>
                    <option value="Hyderabad">Hyderabad (హైదరాబాద్)</option>
                    <option value="Tirupati">Tirupati (తిరుపతి)</option>
                    <option value="Rajahmundry">Rajahmundry (రాజమండ్రి)</option>
                    <option value="Kakinada">Kakinada (కాకినాడ)</option>
                    <option value="Nellore">Nellore (నెల్లూరు)</option>
                    <option value="Kurnool">Kurnool (కర్నూలు)</option>
                    <option value="Other">Other City (ఇతర నగరం)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 font-semibold mb-2">
                    {lang === 'TE' ? 'డెలివరీ వేగం' : 'Delivery Speed'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, deliverySpeed: 'standard' })}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left ${
                        formData.deliverySpeed === 'standard'
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : 'border-white/10 bg-white/5 text-gray-400'
                      }`}
                    >
                      <div className="font-bold text-white">⚡ Standard (3-5 Days)</div>
                      <div className="text-emerald-400 mt-0.5">Free Delivery</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, deliverySpeed: 'express' })}
                      className={`p-3 rounded-xl text-xs font-semibold border text-left ${
                        formData.deliverySpeed === 'express'
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : 'border-white/10 bg-white/5 text-gray-400'
                      }`}
                    >
                      <div className="font-bold text-white">🚀 Express (24-48 Hrs)</div>
                      <div className="text-[#D4AF37] mt-0.5 font-bold">
                        {isStudioMode ? '+₹1,000 Rush' : '+₹1,500 Rush'}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 font-semibold mb-2">
                  {lang === 'TE' ? 'కొరియర్ డెలివరీ అడ్రస్' : 'Shipping Address (For physical album delivery)'}
                </label>
                <textarea
                  rows="2"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Door No, Street, Landmark, Town, PIN Code..."
                  className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={goBackStep}
                className="btn btn-outline flex items-center gap-2 px-6 py-3"
              >
                <ArrowLeft size={16} />
                <span>{lang === 'TE' ? 'వెనుకకు' : 'Back'}</span>
              </button>
              <button
                type="button"
                onClick={proceedToNextStep}
                className="btn btn-gold-3d flex items-center gap-2 px-8 py-3.5 font-bold"
              >
                <span>{lang === 'TE' ? 'తదుపరి దశ: ఫోటోలు పంపండి' : 'Next: Media Transfer'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: MEDIA & CONFIRM ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                3. {lang === 'TE' ? 'మీ ఫోటోలు / వీడియోలు ఎలా పంపుతారు?' : 'How will you share your photos/videos?'}
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                {lang === 'TE'
                  ? 'మీకు నచ్చిన సులభమైన పద్ధతిని ఎంచుకోండి:'
                  : 'Choose the most convenient transfer method for you:'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Cloud Link */}
              <div
                onClick={() => setFormData({ ...formData, uploadMethod: 'cloud' })}
                className={`p-5 rounded-2xl border cursor-pointer text-left transition-all ${
                  formData.uploadMethod === 'cloud'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/25'
                }`}
              >
                <UploadCloud size={26} className="text-[#D4AF37] mb-2" />
                <h4 className="font-bold text-white text-sm">Google Drive / Link</h4>
                <p className="text-xs text-gray-400 mt-1">Paste Drive, WeTransfer, or OneDrive link</p>
              </div>

              {/* Option 2: Send on WhatsApp */}
              <div
                onClick={() => setFormData({ ...formData, uploadMethod: 'whatsapp' })}
                className={`p-5 rounded-2xl border cursor-pointer text-left transition-all ${
                  formData.uploadMethod === 'whatsapp'
                    ? 'border-[#25D366] bg-[#25D366]/20 text-white shadow-[0_0_20px_rgba(37,211,102,0.2)]'
                    : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/25'
                }`}
              >
                <MessageCircle size={26} className="text-[#25D366] mb-2" />
                <h4 className="font-bold text-white text-sm">Send via WhatsApp</h4>
                <p className="text-xs text-gray-400 mt-1">Our coordinator will ping you on WhatsApp</p>
              </div>

              {/* Option 3: Courier Pendrive */}
              <div
                onClick={() => setFormData({ ...formData, uploadMethod: 'courier' })}
                className={`p-5 rounded-2xl border cursor-pointer text-left transition-all ${
                  formData.uploadMethod === 'courier'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                    : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/25'
                }`}
              >
                <HardDrive size={26} className="text-[#D4AF37] mb-2" />
                <h4 className="font-bold text-white text-sm">Courier Pen Drive</h4>
                <p className="text-xs text-gray-400 mt-1">Ship USB/Hard disk to our AP hub</p>
              </div>
            </div>

            {/* Cloud link input */}
            {formData.uploadMethod === 'cloud' && (
              <div className="p-6 rounded-2xl bg-black/60 border border-white/20">
                <label className="block text-sm text-gray-200 font-semibold mb-2">
                  Paste your Google Drive or WeTransfer Link
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={formData.cloudLink}
                  onChange={e => setFormData({ ...formData, cloudLink: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-black/70 border border-white/20 text-white focus:border-[#D4AF37] outline-none font-mono text-sm"
                />
                <p className="text-xs text-[#D4AF37] mt-2 flex items-center gap-1.5 font-medium">
                  <ShieldCheck size={14} /> Please set link access to "Anyone with the link can view".
                </p>
              </div>
            )}

            {/* WhatsApp method note */}
            {formData.uploadMethod === 'whatsapp' && (
              <div className="p-6 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-left">
                <h4 className="font-bold text-[#25D366] text-sm mb-1 flex items-center gap-2">
                  <MessageCircle size={18} />
                  {lang === 'TE' ? 'వాట్సాప్ ద్వారా సులభంగా పంపండి' : 'Super Easy: Send directly over WhatsApp'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-300">
                  {lang === 'TE'
                    ? `మీరు ఇక్కడ ఆర్డర్ సబ్మిట్ చేసిన వెంటనే, మా టీమ్ ${formData.phone || 'మీ నంబరు'} కి వాట్సాప్‌లో మెసేజ్ చేసి ఫోటోలు సేకరిస్తుంది.`
                    : `No technical hassle. Once you place the order, our coordinator will message ${formData.phone || 'your WhatsApp'} to collect the high-res photos.`}
                </p>
              </div>
            )}

            {/* Courier method note */}
            {formData.uploadMethod === 'courier' && (
              <div className="p-6 rounded-2xl bg-black/60 border border-white/20 text-left text-xs sm:text-sm text-gray-300 space-y-3">
                <p className="font-bold text-white">Send your Pen Drive / Hard Disk to:</p>
                <div className="p-4 rounded-xl bg-black/80 border border-[#D4AF37]/30 text-gray-200 leading-relaxed">
                  <strong className="text-[#D4AF37] text-base">WeddingAlbums.in Production Center</strong><br />
                  Plot 14, 2nd Floor, MG Road, Vijayawada, Andhra Pradesh 520010<br />
                  Contact: +91 98765 43210 (Attn: Media Inward Team)
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-300 font-semibold mb-2">
                {lang === 'TE' ? 'ప్రత్యేక సూచనలు (ఐచ్ఛికం)' : 'Special Instructions / Notes (Optional)'}
              </label>
              <textarea
                rows="2"
                value={formData.instructions}
                onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="e.g. Include Talambralu ritual focus, use devotional Telugu songs, highlight family..."
                className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={goBackStep}
                className="btn btn-outline flex items-center gap-2 px-6 py-3"
              >
                <ArrowLeft size={16} />
                <span>{lang === 'TE' ? 'వెనుకకు' : 'Back'}</span>
              </button>

              <button
                type="button"
                onClick={() => submitOrder()}
                disabled={submitting}
                className="btn btn-gold-3d flex items-center gap-2 px-10 py-4 text-base font-bold shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50"
              >
                <CheckCircle2 size={20} />
                <span>{submitting ? 'Placing Order...' : (lang === 'TE' ? 'ఆర్డర్ కన్ఫర్మ్ చేయండి' : 'Confirm & Place Order')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: ITEMIZED ORDER SUMMARY SIDEBAR */}
      <div className="builder-sidebar">
        <div className="cart-sticky p-6 sm:p-7 rounded-2xl bg-black/70 border border-[#D4AF37]/30 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
              <ShoppingCart size={20} className="text-[#D4AF37]" />
              <span>{lang === 'TE' ? 'ఆర్డర్ రసీదు' : 'Itemized Quote'}</span>
            </div>
            <span className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full border ${
              isStudioMode ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <Clock size={12} />
              {isStudioMode ? '⚡ Studio Trade' : (formData.deliverySpeed === 'express' ? '24-48h Rush' : '3-5 Days ETA')}
            </span>
          </div>

          {/* Itemized Line-By-Line Receipt Breakdown */}
          <div className="space-y-3 text-xs sm:text-sm">
            
            {/* 1. Album Section */}
            {formData.services.albumPrint && (
              <div className="space-y-1.5 pb-2 border-b border-white/10">
                <div className="flex justify-between text-white font-semibold">
                  <span>Album ({formData.albumSize} • {formData.albumType})</span>
                  <span className="font-mono text-[#D4AF37]">
                    ₹{(isStudioMode ? 6800 : 9500).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400 text-xs">
                  <span>Sheets: {formData.selectedSheetTypes.join(' + ')} ({formData.pages} sheets)</span>
                  {formData.pages > 30 && (
                    <span className="text-gray-300 font-mono">
                      +{formData.pages - 30} extra
                    </span>
                  )}
                </div>
                {formData.boxType !== 'standard' && (
                  <div className="flex justify-between text-yellow-500/80 text-xs">
                    <span>Box: {formData.boxType.replace('_', ' ')}</span>
                    <span className="font-mono">+{isStudioMode ? '₹800' : '₹1,200'}</span>
                  </div>
                )}
                {formData.parentAlbums > 0 && (
                  <div className="flex justify-between text-yellow-500/80 text-xs">
                    <span>{formData.parentAlbums} Mini Parent Album(s)</span>
                    <span className="font-mono">+{isStudioMode ? (formData.parentAlbums === 1 ? '₹1,800' : '₹3,200') : (formData.parentAlbums === 1 ? '₹2,500' : '₹4,500')}</span>
                  </div>
                )}
              </div>
            )}

            {/* 2. Video Services Itemized */}
            {formData.services.videoEdit && formData.selectedVideoServices.length > 0 && (
              <div className="space-y-1.5 pb-2 border-b border-white/10">
                <div className="text-white font-semibold text-xs flex justify-between">
                  <span>Video Services ({formData.selectedVideoServices.length})</span>
                  <span className="text-[#D4AF37]">Itemized</span>
                </div>
                {formData.selectedVideoServices.map(vId => {
                  const item = VIDEO_SERVICES.find(v => v.id === vId);
                  if (!item) return null;
                  const price = isStudioMode ? item.studioPrice : item.price;
                  return (
                    <div key={vId} className="flex justify-between text-gray-400 text-xs">
                      <span className="truncate max-w-[180px]">{item.name}</span>
                      <span className="font-mono text-gray-200">+₹{price.toLocaleString('en-IN')}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. Photo Services Itemized */}
            {formData.services.photoEdit && formData.selectedPhotoServices.length > 0 && (
              <div className="space-y-1.5 pb-2 border-b border-white/10">
                <div className="text-white font-semibold text-xs flex justify-between">
                  <span>Photos ({formData.photoCount} pics • {formData.selectedPhotoServices.length} styles)</span>
                  <span className="text-[#D4AF37]">Itemized</span>
                </div>
                {formData.selectedPhotoServices.map(pId => {
                  const item = PHOTO_SERVICES.find(p => p.id === pId);
                  if (!item) return null;
                  const rate = isStudioMode ? item.studioRate : item.rate;
                  return (
                    <div key={pId} className="flex justify-between text-gray-400 text-xs">
                      <span className="truncate max-w-[180px]">{item.name}</span>
                      <span className="font-mono text-gray-200">₹{rate}/p</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 4. Flex Services Itemized */}
            {formData.services.flexBanner && formData.selectedFlexServices.length > 0 && (
              <div className="space-y-1.5 pb-2 border-b border-white/10">
                <div className="text-white font-semibold text-xs flex justify-between">
                  <span>Flex & Invites ({formData.selectedFlexServices.length})</span>
                  <span className="text-[#D4AF37]">Itemized</span>
                </div>
                {formData.selectedFlexServices.map(fId => {
                  const item = FLEX_SERVICES.find(f => f.id === fId);
                  if (!item) return null;
                  const price = isStudioMode ? item.studioPrice : item.price;
                  return (
                    <div key={fId} className="flex justify-between text-gray-400 text-xs">
                      <span className="truncate max-w-[180px]">{item.name}</span>
                      <span className="font-mono text-gray-200">+₹{price.toLocaleString('en-IN')}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 5. Calendar Services Itemized */}
            {formData.services.calendars && formData.selectedCalendarServices.length > 0 && (
              <div className="space-y-1.5 pb-2 border-b border-white/10">
                <div className="text-white font-semibold text-xs flex justify-between">
                  <span>Calendars ({formData.calendarCopies}x copies)</span>
                  <span className="text-[#D4AF37]">Itemized</span>
                </div>
                {formData.selectedCalendarServices.map(cId => {
                  const item = CALENDAR_SERVICES.find(c => c.id === cId);
                  if (!item) return null;
                  const price = (isStudioMode ? item.studioPrice : item.price) * (formData.calendarCopies || 1);
                  return (
                    <div key={cId} className="flex justify-between text-gray-400 text-xs">
                      <span className="truncate max-w-[180px]">{item.name}</span>
                      <span className="font-mono text-gray-200">+₹{price.toLocaleString('en-IN')}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {formData.deliverySpeed === 'express' && (
              <div className="flex justify-between text-[#D4AF37] text-xs py-1 border-b border-white/10">
                <span>Express 24-48h Rush Delivery</span>
                <span className="font-mono font-bold">+{isStudioMode ? '₹1,000' : '₹1,500'}</span>
              </div>
            )}

            {/* Wholesale Trade Savings Alert */}
            {isStudioMode && studioSavings > 0 && (
              <div className="p-3 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold flex items-center justify-between">
                <span>⚡ Studio Trade Wholesale Savings:</span>
                <span className="font-mono font-bold">-₹{studioSavings.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="border-t border-white/10 pt-4 mt-2 flex justify-between items-baseline">
              <div>
                <span className="text-xs text-gray-400 block font-medium">
                  {isStudioMode ? 'Wholesale Trade Total' : 'Total Itemized Quote'}
                </span>
                <span className="text-3xl font-bold font-mono text-[#D4AF37]">
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[11px] text-gray-400">All Taxes Inc.</span>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                type="button"
                onClick={openWhatsAppDirect}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] text-black font-bold text-sm hover:bg-[#20ba59] transition-all shadow-[0_4px_15px_rgba(37,211,102,0.3)]"
              >
                <MessageCircle size={18} />
                <span>{lang === 'TE' ? 'వాట్సాప్ లో కొటేషన్ పొందండి' : 'Get Quote on WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={() => submitOrder()}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#D4AF37] text-black font-bold text-sm hover:bg-[#b8952b] transition-all shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
              >
                <CheckCircle2 size={18} />
                <span>{submitting ? 'Processing...' : (lang === 'TE' ? 'ఆర్డర్ కన్ఫర్మ్ చేయండి' : 'Save & Book Package')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING MOBILE BOTTOM BAR */}
      <div className="mobile-summary-bar">
        <div>
          <span className="text-[11px] text-gray-400 block">
            {isStudioMode ? 'Wholesale Total' : 'Total Estimate'}
          </span>
          <span className="text-xl font-bold text-[#D4AF37] font-mono">
            ₹{calculateTotal().toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openWhatsAppDirect}
            className="p-3 rounded-xl bg-[#25D366] text-black font-bold text-xs flex items-center gap-1.5"
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => step < 3 ? proceedToNextStep() : submitOrder()}
            className="px-4 py-3 rounded-xl bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1.5"
          >
            <span>{step < 3 ? 'Next Step →' : 'Confirm Book'}</span>
          </button>
        </div>
      </div>

      <LoginModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultRole="b2c"
        onSuccess={(newUser) => {
          setShowAuthModal(false);
          submitOrder(newUser);
        }}
      />
    </div>
  );
};

export default BookingPage;
