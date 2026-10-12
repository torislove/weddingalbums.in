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
  // LANDSCAPE SIZES (హారిజాంటల్ / ల్యాండ్‌స్కేప్)
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

  // PORTRAIT SIZES (వర్టికల్ / పోర్ట్రెయిట్)
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

// FAST-TRACK CURATED LUXURY BUNDLES
const LUXURY_BUNDLES = [
  {
    id: 'muhurtham',
    badge: 'Best Value ⭐',
    title: 'Royal Telugu Muhurtham Master Suite',
    telugu: 'రాయల్ తెలుగు ముహూర్తం మాస్టర్ సూట్',
    customerPrice: 24999,
    studioPrice: 17999,
    customerSavings: 'Save ₹6,000!',
    studioSavings: 'Save ₹8,500 Wholesale!',
    desc: 'The complete all-in-one post-production pack for the entire Andhra wedding ceremony.',
    features: [
      '12×36 Royal Panoramic Karizma Layflat (40 sheets, Velvet Silk)',
      '4K Cinematic Wedding Teaser (3-5 min) + 5 IG Reels',
      'High-End Skin Retouching & Color Grading (50 photos)',
      'Royal Matching Velvet Briefcase Box + 2 Parent Duplicate Albums',
      'Free Express Delivery across Andhra Pradesh & Telangana'
    ],
    config: {
      services: { albumPrint: true, videoEdit: true, photoEdit: true, flexBanner: false, calendars: false },
      albumType: 'karizma',
      albumSize: '12x36',
      sheetType: 'velvet',
      pages: 40,
      boxType: 'velvet_case',
      parentAlbums: 2,
      videoType: 'teaser',
      photoStyle: 'retouching',
      photoCount: 50,
      deliverySpeed: 'express'
    }
  },
  {
    id: 'cinematic',
    badge: 'Most Popular 🎬',
    title: 'Cinematic Story & Karizma Duo',
    telugu: 'సినిమాటిక్ స్టోరీ & కరిజ్మా డ్యుయో',
    customerPrice: 18500,
    studioPrice: 13200,
    customerSavings: 'Save ₹4,500!',
    studioSavings: 'Save ₹6,200 Wholesale!',
    desc: 'Perfect synergy between 4K film editing and traditional flush-mount album printing.',
    features: [
      '12×30 Classic Landscape Lay-Flat Album (30 sheets)',
      '4K Cinematic Wedding Teaser + 5 Instagram Reels (9:16)',
      'Pro Retouching & Warm Andhra Color Grading (30 photos)',
      'Standard Presentation Box included'
    ],
    config: {
      services: { albumPrint: true, videoEdit: true, photoEdit: true, flexBanner: false, calendars: false },
      albumType: 'flushmount',
      albumSize: '12x30',
      sheetType: 'velvet',
      pages: 30,
      boxType: 'standard',
      parentAlbums: 0,
      videoType: 'teaser',
      photoStyle: 'retouching',
      photoCount: 30,
      deliverySpeed: 'standard'
    }
  },
  {
    id: 'studio_pack',
    badge: 'Lab Express 🚀',
    title: 'Studio Fast-Track Printing Pack',
    telugu: 'స్టూడియో ఫాస్ట్-ట్రాక్ ప్రింటింగ్ ప్యాక్',
    customerPrice: 11500,
    studioPrice: 8200,
    customerSavings: 'Save ₹2,500!',
    studioSavings: 'Save ₹4,200 Wholesale!',
    desc: 'High-speed lab printing for photographers and couples who already have photos selected.',
    features: [
      '12×36 Lay-flat Karizma Flush Mount (30 sheets, Metallic Pearl)',
      'Royal Velvet Briefcase Presentation Box',
      'Doorstep Courier Delivery within 3-4 working days'
    ],
    config: {
      services: { albumPrint: true, videoEdit: false, photoEdit: false, flexBanner: false, calendars: false },
      albumType: 'karizma',
      albumSize: '12x36',
      sheetType: 'metallic',
      pages: 30,
      boxType: 'velvet_case',
      parentAlbums: 0,
      deliverySpeed: 'standard'
    }
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

  // Orientation filter for album sizes: 'all' | 'landscape' | 'portrait'
  const [selectedOrientation, setSelectedOrientation] = useState('all');

  // Currently applied bundle: 'none' | 'muhurtham' | 'cinematic' | 'studio_pack' | 'custom'
  const [selectedBundle, setSelectedBundle] = useState('none');

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

  // Form State
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
    
    // Step 1: Selected Services
    services: {
      albumPrint: true, // Default recommended
      videoEdit: false,
      photoEdit: false,
      flexBanner: false,
      calendars: false,
    },
    
    // Album Specifications
    albumType: 'karizma', // 'karizma' | 'acrylic' | 'velvet' | 'leather' | 'flushmount'
    albumSize: '12x36', // '12x36' | '12x30' | '18x12' etc.
    sheetType: 'velvet', // 'velvet' | 'gloss' | 'metallic' | 'leatherette' | 'thermal' | 'silk_matte' | 'silver_halide' | 'canvas'
    pages: 30, // 30, 40, 50, 60, 80, 100 sheets
    boxType: 'standard', // 'standard' | 'velvet_case' | 'wooden_box' | 'acrylic_box'
    parentAlbums: 0, // 0, 1, 2
    
    // Video Editing Options
    videoType: 'teaser', // 'teaser' | 'reels' | 'highlights' | 'traditional' | 'sde' | 'prewedding' | 'sound'
    musicStyle: 'telugu_romantic',
    
    // Photo Editing Options
    photoStyle: 'retouching', // 'retouching' | 'karizma_psd' | 'cinematic_luts' | 'background' | 'restoration' | 'culling'
    photoCount: 50, // 30, 50, 100, 200, 300, 500
    
    // Flex & Banners Options
    flexType: 'mandap', // 'mandap' | 'hoarding' | 'standee' | 'invite'
    
    // Calendars & Keepsakes Options
    calendarType: 'desk_easel', // 'desk_easel' | 'wall_poster' | 'pocket_pack'
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

  // Apply Curated Luxury Bundle Preset
  const applyBundle = (bundleId) => {
    const bundle = LUXURY_BUNDLES.find(b => b.id === bundleId);
    if (!bundle) return;

    setSelectedBundle(bundleId);
    setFormData(prev => ({
      ...prev,
      ...bundle.config,
      services: { ...bundle.config.services }
    }));
  };

  // Precise, 100% Accurate Pricing Calculation supporting B2C Retail & B2B Studio Wholesale
  const calculateTotal = (forceMode = null) => {
    const studio = forceMode !== null ? forceMode : isStudioMode;
    let total = 0;

    // 1. Album Print & Design
    if (formData.services.albumPrint) {
      let basePrice = studio ? 6800 : 9500;
      
      // Match from dynamic sizes
      const matchedSize = dynamicPricing.sizes.find(s => s.id === formData.albumSize || s.dimensions?.includes(formData.albumSize) || s.name?.includes(formData.albumSize));
      if (matchedSize) {
        basePrice = studio && matchedSize.studioBasePrice ? matchedSize.studioBasePrice : matchedSize.basePrice;
      } else {
        if (formData.albumSize === '12x36') basePrice = studio ? 6800 : 9500;
        else if (formData.albumSize === '12x30') basePrice = studio ? 6000 : 8500;
        else if (formData.albumSize === '12x24') basePrice = studio ? 5200 : 7500;
        else if (formData.albumSize === '18x12') basePrice = studio ? 6400 : 9000;
        else if (formData.albumSize === '15x12') basePrice = studio ? 5600 : 8000;
        else if (formData.albumSize === '14x11') basePrice = studio ? 5000 : 7200;
        else if (formData.albumSize === '12x9') basePrice = studio ? 3800 : 5500;
        else if (formData.albumSize === '10x8') basePrice = studio ? 3100 : 4500;
      }

      // Cover style surcharge
      if (formData.albumType === 'acrylic') basePrice += (studio ? 1000 : 1500);
      else if (formData.albumType === 'velvet') basePrice += (studio ? 700 : 1000);
      else if (formData.albumType === 'leather') basePrice += (studio ? 800 : 1200);

      // Sheet finish calculation
      let sheetRate = studio ? 42 : 65;
      const matchedSheet = dynamicPricing.sheets.find(s => s.id === formData.sheetType || s.name?.toLowerCase().includes(formData.sheetType));
      if (matchedSheet) {
        sheetRate = studio && matchedSheet.studioPricePerSheet ? matchedSheet.studioPricePerSheet : matchedSheet.pricePerSheet;
      } else {
        if (formData.sheetType === 'velvet') sheetRate = studio ? 42 : 65;
        else if (formData.sheetType === 'gloss') sheetRate = studio ? 48 : 75;
        else if (formData.sheetType === 'metallic') sheetRate = studio ? 55 : 85;
        else if (formData.sheetType === 'leatherette') sheetRate = studio ? 72 : 110;
        else if (formData.sheetType === 'thermal') sheetRate = studio ? 32 : 50;
        else if (formData.sheetType === 'silk_matte') sheetRate = studio ? 62 : 95;
        else if (formData.sheetType === 'silver_halide') sheetRate = studio ? 82 : 125;
        else if (formData.sheetType === 'canvas') sheetRate = studio ? 68 : 105;
      }

      // 30 sheets included in base, extra sheets added
      const extraSheets = Math.max(0, formData.pages - 30);
      total += basePrice + (extraSheets * sheetRate);

      // Presentation box
      if (formData.boxType === 'velvet_case') total += (studio ? 800 : 1200);
      else if (formData.boxType === 'wooden_box') total += (studio ? 1200 : 1800);
      else if (formData.boxType === 'acrylic_box') total += (studio ? 1500 : 2200);

      // Duplicate parent albums
      if (formData.parentAlbums === 1) total += (studio ? 1800 : 2500);
      else if (formData.parentAlbums === 2) total += (studio ? 3200 : 4500);
    }

    // 2. Video Editing
    if (formData.services.videoEdit) {
      if (formData.videoType === 'teaser') total += (studio ? 4200 : 6000);
      else if (formData.videoType === 'reels') total += (studio ? 2200 : 3500);
      else if (formData.videoType === 'highlights') total += (studio ? 7000 : 10000);
      else if (formData.videoType === 'traditional') total += (studio ? 8500 : 12000);
      else if (formData.videoType === 'sde') total += (studio ? 8500 : 12000);
      else if (formData.videoType === 'prewedding') total += (studio ? 3500 : 5000);
      else if (formData.videoType === 'sound') total += (studio ? 1900 : 3000);
    }

    // 3. Photo Editing & Retouching
    if (formData.services.photoEdit) {
      let perPhoto = studio ? 35 : 60;
      if (formData.photoStyle === 'retouching') perPhoto = studio ? 35 : 60;
      else if (formData.photoStyle === 'karizma_psd') perPhoto = studio ? 28 : 45;
      else if (formData.photoStyle === 'cinematic_luts') perPhoto = studio ? 18 : 30;
      else if (formData.photoStyle === 'background') perPhoto = studio ? 55 : 90;
      else if (formData.photoStyle === 'restoration') perPhoto = studio ? 75 : 120;
      else if (formData.photoStyle === 'culling') perPhoto = studio ? 10 : 15;
      
      const photoMin = studio ? 800 : 1200;
      total += Math.max(photoMin, formData.photoCount * perPhoto);
    }

    // 4. Flex, Hoardings & Invitations
    if (formData.services.flexBanner) {
      if (formData.flexType === 'mandap') total += (studio ? 1500 : 2400);
      else if (formData.flexType === 'hoarding') total += (studio ? 8000 : 12000);
      else if (formData.flexType === 'standee') total += (studio ? 1150 : 1800);
      else if (formData.flexType === 'invite') total += (studio ? 1200 : 1999);
    }

    // 5. Calendars & Keepsakes
    if (formData.services.calendars) {
      let unitPrice = studio ? 750 : 1200;
      if (formData.calendarType === 'desk_easel') unitPrice = studio ? 750 : 1200;
      else if (formData.calendarType === 'wall_poster') unitPrice = studio ? 380 : 650;
      else if (formData.calendarType === 'pocket_pack') unitPrice = studio ? 550 : 990;

      total += unitPrice * (formData.calendarCopies || 1);
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

  const toggleService = (key) => {
    setSelectedBundle('custom');
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: !prev.services[key]
      }
    }));
  };

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
        instructions: `[${isStudioMode ? 'B2B STUDIO WHOLESALE' : 'B2C CUSTOMER'} | ${formData.eventType} in ${formData.city}] Album: ${formData.albumType} ${formData.albumSize} (${formData.pages} sheets, ${formData.sheetType}). Video: ${formData.videoType}. Photo: ${formData.photoStyle} (${formData.photoCount}p). Flex: ${formData.flexType}. Calendars: ${formData.calendarType} (${formData.calendarCopies}x). Speed: ${formData.deliverySpeed}. Notes: ${formData.instructions || 'Standard order'}`,
        data: {
          pricingTier: isStudioMode ? 'b2b_studio' : 'b2c_retail',
          services: formData.services,
          albumType: formData.albumType,
          albumSize: formData.albumSize,
          sheetType: formData.sheetType,
          pages: formData.pages,
          boxType: formData.boxType,
          parentAlbums: formData.parentAlbums,
          videoType: formData.videoType,
          musicStyle: formData.musicStyle,
          photoStyle: formData.photoStyle,
          photoCount: formData.photoCount,
          flexType: formData.flexType,
          calendarType: formData.calendarType,
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
      formData.services.albumPrint && `Album (${formData.albumType} ${formData.albumSize}, ${formData.pages} sheets, ${formData.sheetType})`,
      formData.services.videoEdit && `Video (${formData.videoType})`,
      formData.services.photoEdit && `Photos (${formData.photoStyle}, ${formData.photoCount} pics)`,
      formData.services.flexBanner && `Flex (${formData.flexType})`,
      formData.services.calendars && `Calendar (${formData.calendarType}, ${formData.calendarCopies} copies)`
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
            onClick={() => {
              setIsStudioMode(!isStudioMode);
              setSelectedBundle('custom');
            }}
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
        <div className="builder-progress mb-10">
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

        {/* ================= STEP 1: SERVICES & SPECIFIC OPTIONS ================= */}
        {step === 1 && (
          <div className="space-y-8">

            {/* ⭐ FAST-TRACK CURATED LUXURY BUNDLES */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Award size={16} className="text-[#D4AF37]" />
                  <span>Curated Luxury Bundles (తక్షణ బండిల్స్)</span>
                </h4>
                <span className="text-xs text-[#D4AF37] font-semibold">1-Click Fast Presets</span>
              </div>

              <div className="bundles-container">
                {LUXURY_BUNDLES.map(b => {
                  const bPrice = isStudioMode ? b.studioPrice : b.customerPrice;
                  const bSavings = isStudioMode ? b.studioSavings : b.customerSavings;
                  const isActive = selectedBundle === b.id;

                  return (
                    <div
                      key={b.id}
                      onClick={() => applyBundle(b.id)}
                      className={`luxury-bundle-card ${isActive ? 'active' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="bundle-badge">{b.badge}</span>
                        <span className="bundle-savings">{bSavings}</span>
                      </div>
                      <h4 className="text-base font-bold text-white">{b.title}</h4>
                      <div className="text-xs text-[#D4AF37] font-telugu mb-2 font-medium">{b.telugu}</div>
                      
                      <div className="text-2xl font-bold text-white font-mono my-2">
                        ₹{bPrice.toLocaleString('en-IN')}
                        <span className="text-xs text-gray-400 font-normal ml-2 line-through">
                          ₹{Math.round(bPrice * 1.25).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <ul className="space-y-1.5 text-xs text-gray-400 my-3">
                        {b.features.slice(0, 3).map((f, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#D4AF37] mt-0.5">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-[#D4AF37] text-black font-extrabold shadow-md'
                            : 'bg-white/10 text-gray-200 hover:bg-white/20'
                        }`}
                      >
                        {isActive ? '✓ Bundle Applied' : 'Apply Bundle'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5 PRIMARY SERVICE TILES */}
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span>1. {lang === 'TE' ? 'మీ సేవలను ఎంచుకోండి' : 'Choose Your Services'}</span>
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                {lang === 'TE'
                  ? 'మీ ప్రాజెక్ట్‌ను అనుకూలీకరించడానికి క్రింద ఒకటి లేదా అంతకంటే ఎక్కువ కేటగిరీలను ఎంచుకోండి:'
                  : 'Select one or more categories below to customize your project:'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* 1. Album Printing & Design */}
                <div
                  className={`base-card flex items-start gap-4 p-5 rounded-2xl cursor-pointer border transition-all ${
                    formData.services.albumPrint
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_25px_rgba(212,175,55,0.2)]'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                  onClick={() => toggleService('albumPrint')}
                >
                  <div className={`p-3.5 rounded-xl shrink-0 ${formData.services.albumPrint ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-white/5 text-gray-400'}`}>
                    <Printer size={26} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-base">Album Print & Design</h4>
                      <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                        from ₹{isStudioMode ? '5,200' : '7,500'}
                      </span>
                    </div>
                    <div className="text-xs text-[#D4AF37] mt-0.5 font-telugu font-semibold">కరిజ్మా & ఫ్లష్ మౌంట్ ఆల్బమ్ డిజైన్</div>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      Karizma, Acrylic 3D glass, Lay-flat spreads, Velvet/Metallic sheets & Royal box.
                    </p>
                  </div>
                </div>

                {/* 2. Cinematic Video Editing */}
                <div
                  className={`base-card flex items-start gap-4 p-5 rounded-2xl cursor-pointer border transition-all ${
                    formData.services.videoEdit
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_25px_rgba(212,175,55,0.2)]'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                  onClick={() => toggleService('videoEdit')}
                >
                  <div className={`p-3.5 rounded-xl shrink-0 ${formData.services.videoEdit ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-white/5 text-gray-400'}`}>
                    <Film size={26} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-base">Cinematic Films & Reels</h4>
                      <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                        from ₹{isStudioMode ? '2,200' : '3,500'}
                      </span>
                    </div>
                    <div className="text-xs text-[#D4AF37] mt-0.5 font-telugu font-semibold">4K సినిమాటిక్ వీడియో & రీల్స్</div>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      Teasers (3-5 min), Same-Day Edit (SDE), full traditional multi-cam, and 9:16 IG reels.
                    </p>
                  </div>
                </div>

                {/* 3. Photo Retouching & Color Grading */}
                <div
                  className={`base-card flex items-start gap-4 p-5 rounded-2xl cursor-pointer border transition-all ${
                    formData.services.photoEdit
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_25px_rgba(212,175,55,0.2)]'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                  onClick={() => toggleService('photoEdit')}
                >
                  <div className={`p-3.5 rounded-xl shrink-0 ${formData.services.photoEdit ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-white/5 text-gray-400'}`}>
                    <Palette size={26} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-base">Photo Retouch & Color</h4>
                      <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                        from ₹{isStudioMode ? '18/p' : '30/p'}
                      </span>
                    </div>
                    <div className="text-xs text-[#D4AF37] mt-0.5 font-telugu font-semibold">ఫొటో రీటచింగ్ & కలర్ గ్రేడింగ్</div>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      Skin smoothing, jewelry pop, Karizma PSD layout, background removal, and restoration.
                    </p>
                  </div>
                </div>

                {/* 4. Wedding Flex, Hoardings & Invitations */}
                <div
                  className={`base-card flex items-start gap-4 p-5 rounded-2xl cursor-pointer border transition-all ${
                    formData.services.flexBanner
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_25px_rgba(212,175,55,0.2)]'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                  onClick={() => toggleService('flexBanner')}
                >
                  <div className={`p-3.5 rounded-xl shrink-0 ${formData.services.flexBanner ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-white/5 text-gray-400'}`}>
                    <MonitorPlay size={26} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-base">Flex, Banners & Invites</h4>
                      <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                        from ₹{isStudioMode ? '1,150' : '1,800'}
                      </span>
                    </div>
                    <div className="text-xs text-[#D4AF37] mt-0.5 font-telugu font-semibold">కళ్యాణ మండపం ఫ్లెక్స్ & ఆహ్వానాలు</div>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      Mandap entrance banners, roadside hoardings up to 40×20 ft, welcome standees & video invites.
                    </p>
                  </div>
                </div>

                {/* 5. Custom Calendars & Keepsakes */}
                <div
                  className={`base-card flex items-start gap-4 p-5 rounded-2xl cursor-pointer border transition-all ${
                    formData.services.calendars
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_25px_rgba(212,175,55,0.2)]'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                  onClick={() => toggleService('calendars')}
                >
                  <div className={`p-3.5 rounded-xl shrink-0 ${formData.services.calendars ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-white/5 text-gray-400'}`}>
                    <Calendar size={26} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-base">Calendars & Keepsakes</h4>
                      <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                        from ₹{isStudioMode ? '380' : '650'}
                      </span>
                    </div>
                    <div className="text-xs text-[#D4AF37] mt-0.5 font-telugu font-semibold">కపుల్ టేబుల్‌టాప్ & వాల్ క్యాలెండర్లు</div>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                      12-Month wooden easel desk calendars, 12×18 metallic wall poster calendars & mini pocketbooks.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* ================= SUB-OPTIONS: ALBUM PRINTING (ALL SIZES & FINISHES) ================= */}
            {formData.services.albumPrint && (
              <div className="p-6 sm:p-8 rounded-2xl bg-black/50 border border-[#D4AF37]/30 space-y-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h4 className="text-lg sm:text-xl font-bold text-[#D4AF37] flex items-center gap-2">
                    <BookOpen size={22} />
                    {lang === 'TE' ? 'ఆల్బమ్ కవర్, సైజు & షీట్ రకాలు' : 'Album Cover, Size & Sheet Options'}
                  </h4>
                  <span className="text-xs text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    {isStudioMode ? '⚡ Studio Trade Lab Rate' : 'All India Courier'}
                  </span>
                </div>

                {/* 1. Cover / Binding Type */}
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

                {/* 3. Paper Sheet Finish — All 8 Industry Lab Types */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-gray-200 font-bold">
                      3. Paper Sheet Finish (అన్ని పేపర్ రకాలు - 8 Finishes)
                    </label>
                    <span className="text-xs text-[#D4AF37] font-semibold">
                      {isStudioMode ? 'Wholesale Price / Sheet' : 'Retail Price / Sheet'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {dynamicPricing.sheets.map(sht => {
                      const shtRate = isStudioMode && sht.studioPricePerSheet ? sht.studioPricePerSheet : sht.pricePerSheet;
                      const isSelected = formData.sheetType === sht.id || formData.sheetType.toLowerCase().includes(sht.id.toLowerCase());

                      return (
                        <div
                          key={sht.id}
                          onClick={() => setFormData(p => ({ ...p, sheetType: sht.id }))}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                              : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="font-bold text-xs sm:text-sm text-white">{sht.name}</h5>
                            <span className="text-xs font-mono font-bold text-[#D4AF37]">₹{shtRate}/s</span>
                          </div>
                          {sht.telugu && <div className="text-[11px] text-[#D4AF37] font-telugu mt-0.5">{sht.telugu}</div>}
                          <div className="text-[11px] text-gray-400 mt-1 leading-snug">{sht.note || sht.description}</div>
                          {isStudioMode && sht.pricePerSheet > shtRate && (
                            <div className="text-[10px] text-emerald-400 mt-2 font-semibold">
                              Save ₹{sht.pricePerSheet - shtRate}/sheet wholesale
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Sheet Count Bubbles & Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-gray-200 font-bold">4. Sheets (1 Sheet = 2 Pages)</label>
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
            )}

            {/* ================= SUB-OPTIONS: VIDEO EDITING (ALL FORMATS) ================= */}
            {formData.services.videoEdit && (
              <div className="p-6 sm:p-8 rounded-2xl bg-black/50 border border-[#D4AF37]/30 space-y-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h4 className="text-lg sm:text-xl font-bold text-[#D4AF37] flex items-center gap-2">
                    <Film size={22} />
                    {lang === 'TE' ? 'వీడియో ఎడిటింగ్ ఫార్మాట్ & ఆడియో వివరాలు' : 'Video Editing Format & Audio Preferences'}
                  </h4>
                  <span className="text-xs text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">4K Color Graded · Telugu Audio</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: 'teaser', label: 'Cinematic Teaser (3-5 min)', price: isStudioMode ? '₹4,200' : '₹6,000', note: 'Fast-paced, WhatsApp & family ready' },
                    { id: 'reels', label: 'Instagram Reels Pack (5 Reels)', price: isStudioMode ? '₹2,200' : '₹3,500', note: 'Trending music synced 9:16 vertical' },
                    { id: 'highlights', label: 'Story Highlights Film (15 min)', price: isStudioMode ? '₹7,000' : '₹10,000', note: 'Emotional story with vows & speech sync' },
                    { id: 'traditional', label: 'Full Traditional Video (60+ min)', price: isStudioMode ? '₹8,500' : '₹12,000', note: 'All rituals: Talambralu, Agni Sakshi multi-cam' },
                    { id: 'sde', label: 'Same-Day Edit (SDE Film)', price: isStudioMode ? '₹8,500' : '₹12,000', note: 'Morning wedding edited for reception night' },
                    { id: 'prewedding', label: 'Pre-Wedding / Save the Date', price: isStudioMode ? '₹3,500' : '₹5,000', note: 'Romantic couple teaser with licensed music' },
                    { id: 'sound', label: 'Mangalasnanam Sound Mastering', price: isStudioMode ? '₹1,900' : '₹3,000', note: 'Mantra clarity, Purohit de-noise & Sannai Melam' },
                  ].map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setFormData(p => ({ ...p, videoType: opt.id }))}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        formData.videoType === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs sm:text-sm text-white">{opt.label}</span>
                        <span className="text-xs text-[#D4AF37] font-mono font-bold">{opt.price}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{opt.note}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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

            {/* ================= SUB-OPTIONS: PHOTO EDITING (ALL TYPES) ================= */}
            {formData.services.photoEdit && (
              <div className="p-6 sm:p-8 rounded-2xl bg-black/50 border border-[#D4AF37]/30 space-y-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h4 className="text-lg sm:text-xl font-bold text-[#D4AF37] flex items-center gap-2">
                    <Palette size={22} />
                    {lang === 'TE' ? 'ఫొటో ఎడిటింగ్ స్టైల్ & కౌంట్' : 'Photo Retouching Style & Quantity'}
                  </h4>
                  <span className="text-xs text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    {isStudioMode ? '⚡ Studio Trade Lab Rate' : 'Natural Texture Retouching'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { id: 'retouching', label: 'High-End Skin Retouching', rate: isStudioMode ? '₹35/p' : '₹60/p', note: 'Blemish removal, eye brightening, jewelry shine' },
                    { id: 'karizma_psd', label: 'Karizma PSD Creative Design', rate: isStudioMode ? '₹28/p' : '₹45/p', note: 'Custom Telugu shlokas, spread layouts & typography' },
                    { id: 'cinematic_luts', label: 'Cinematic Color Grading', rate: isStudioMode ? '₹18/p' : '₹30/p', note: 'Warm golden Andhra wedding palette & LUTs' },
                    { id: 'background', label: 'Background Replacement', rate: isStudioMode ? '₹55/p' : '₹90/p', note: 'Replace cluttered venue with royal mandap/gardens' },
                    { id: 'restoration', label: 'Old Photo Restoration', rate: isStudioMode ? '₹75/p' : '₹120/p', note: 'Fix scratched, faded, or torn ancestral photos' },
                    { id: 'culling', label: 'AI Culling & RAW Selection', rate: isStudioMode ? '₹10/p' : '₹15/p', note: 'Filter blinks, blurs & tag top highlight moments' },
                  ].map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setFormData(p => ({ ...p, photoStyle: opt.id }))}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        formData.photoStyle === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs sm:text-sm text-white">{opt.label}</span>
                        <span className="text-xs text-[#D4AF37] font-mono font-bold">{opt.rate}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{opt.note}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <label className="text-sm text-gray-200 font-bold">Estimated Photos to Edit:</label>
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

            {/* ================= SUB-OPTIONS: FLEX, BANNERS & WHATSAPP INVITES ================= */}
            {formData.services.flexBanner && (
              <div className="p-6 sm:p-8 rounded-2xl bg-black/50 border border-[#D4AF37]/30 space-y-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h4 className="text-lg sm:text-xl font-bold text-[#D4AF37] flex items-center gap-2">
                    <MonitorPlay size={22} />
                    {lang === 'TE' ? 'ఫ్లెక్స్ & ఆహ్వానాల రకం' : 'Flex, Hoardings & WhatsApp Invitations'}
                  </h4>
                  <span className="text-xs text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">Large Format · High DPI Inks</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: 'mandap', label: 'Grand Mandap Entrance Flex', size: '10×8 ft Star Media', price: isStudioMode ? '₹1,500' : '₹2,400' },
                    { id: 'hoarding', label: 'Roadside Wedding Hoarding', size: 'up to 40×20 ft heavy-duty', price: isStudioMode ? '₹8,000' : '₹12,000' },
                    { id: 'standee', label: 'Roll-Up Welcome Standee', size: '6×3 ft aluminum stand', price: isStudioMode ? '₹1,150' : '₹1,800' },
                    { id: 'invite', label: 'Animated Telugu Video Invite', size: 'WhatsApp MP4 with BGM', price: isStudioMode ? '₹1,200' : '₹1,999' },
                  ].map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setFormData(p => ({ ...p, flexType: opt.id }))}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        formData.flexType === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs sm:text-sm text-white">{opt.label}</span>
                        <span className="text-xs text-[#D4AF37] font-mono font-bold">{opt.price}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{opt.size}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= SUB-OPTIONS: CALENDARS & KEEPSAKES ================= */}
            {formData.services.calendars && (
              <div className="p-6 sm:p-8 rounded-2xl bg-black/50 border border-[#D4AF37]/30 space-y-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h4 className="text-lg sm:text-xl font-bold text-[#D4AF37] flex items-center gap-2">
                    <Calendar size={22} />
                    {lang === 'TE' ? 'క్యాలెండర్లు & బహుమతి వస్తువులు' : 'Personalized Calendars & Keepsakes'}
                  </h4>
                  <span className="text-xs text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">300 GSM Silk · Wooden Easel</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'desk_easel', label: '12-Month Desk Easel Calendar', note: '12 Couple photos with wooden tabletop easel stand', price: isStudioMode ? '₹750' : '₹1,200' },
                    { id: 'wall_poster', label: 'Grand Wall Poster Calendar (12×18)', note: 'High-gloss metallic print with metal rim hanger', price: isStudioMode ? '₹380' : '₹650' },
                    { id: 'pocket_pack', label: 'Pocket Mini Calendars (Pack of 10)', note: 'Waterproof wallet cards with rounded corners', price: isStudioMode ? '₹550' : '₹990' },
                  ].map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setFormData(p => ({ ...p, calendarType: opt.id }))}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        formData.calendarType === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs sm:text-sm text-white">{opt.label}</span>
                        <span className="text-xs text-[#D4AF37] font-mono font-bold">{opt.price}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{opt.note}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <label className="text-sm text-gray-200 font-bold">Number of Calendar Copies (కాపీల సంఖ్య):</label>
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

      {/* RIGHT: ORDER SUMMARY SIDEBAR */}
      <div className="builder-sidebar">
        <div className="cart-sticky p-6 sm:p-7 rounded-2xl bg-black/70 border border-[#D4AF37]/30 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
              <ShoppingCart size={20} className="text-[#D4AF37]" />
              <span>{lang === 'TE' ? 'మీ ఆర్డర్ సమ్మరీ' : 'Order Summary'}</span>
            </div>
            <span className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full border ${
              isStudioMode ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              <Clock size={12} />
              {isStudioMode ? '⚡ Studio Trade' : (formData.deliverySpeed === 'express' ? '24-48h Rush' : '3-5 Days ETA')}
            </span>
          </div>

          <div className="space-y-3.5 text-sm">
            {/* Services */}
            <div className="flex justify-between text-gray-300">
              <span className="text-gray-400">Services:</span>
              <span className="font-semibold text-white text-right max-w-[170px] truncate">
                {[
                  formData.services.albumPrint && 'Album',
                  formData.services.videoEdit && 'Video',
                  formData.services.photoEdit && 'Photos',
                  formData.services.flexBanner && 'Flex',
                  formData.services.calendars && 'Calendars',
                ].filter(Boolean).join(', ') || 'None'}
              </span>
            </div>

            {formData.services.albumPrint && (
              <div className="flex justify-between text-gray-300 text-xs py-1 border-t border-white/5">
                <span>Album ({formData.albumType} {formData.albumSize}, {formData.pages} sheets)</span>
                <span className="text-white font-mono font-semibold">Included</span>
              </div>
            )}

            {formData.services.albumPrint && (
              <div className="flex justify-between text-gray-400 text-xs py-0.5">
                <span>Sheet Finish:</span>
                <span className="text-[#D4AF37] font-semibold">{formData.sheetType}</span>
              </div>
            )}

            {formData.services.albumPrint && formData.boxType !== 'standard' && (
              <div className="flex justify-between text-[#D4AF37] text-xs">
                <span>Box: {formData.boxType.replace('_', ' ')}</span>
                <span>Addon</span>
              </div>
            )}

            {formData.services.albumPrint && formData.parentAlbums > 0 && (
              <div className="flex justify-between text-[#D4AF37] text-xs">
                <span>{formData.parentAlbums} Mini Parent Album(s)</span>
                <span>Addon</span>
              </div>
            )}

            {formData.services.videoEdit && (
              <div className="flex justify-between text-gray-300 text-xs py-1 border-t border-white/5">
                <span>Video ({formData.videoType})</span>
                <span className="text-white font-mono font-semibold">Included</span>
              </div>
            )}

            {formData.services.photoEdit && (
              <div className="flex justify-between text-gray-300 text-xs py-1 border-t border-white/5">
                <span>Photo Edit ({formData.photoCount} photos)</span>
                <span className="text-white font-mono font-semibold">{formData.photoStyle}</span>
              </div>
            )}

            {formData.services.flexBanner && (
              <div className="flex justify-between text-gray-300 text-xs py-1 border-t border-white/5">
                <span>Flex Banner ({formData.flexType})</span>
                <span className="text-white font-mono font-semibold">Included</span>
              </div>
            )}

            {formData.services.calendars && (
              <div className="flex justify-between text-gray-300 text-xs py-1 border-t border-white/5">
                <span>Calendar ({formData.calendarType}, {formData.calendarCopies}x)</span>
                <span className="text-white font-mono font-semibold">Included</span>
              </div>
            )}

            {formData.deliverySpeed === 'express' && (
              <div className="flex justify-between text-[#D4AF37] text-xs py-1 border-t border-white/5">
                <span>Express 24-48h Rush</span>
                <span className="font-mono font-bold">+{isStudioMode ? '₹1,000' : '₹1,500'}</span>
              </div>
            )}

            {/* Wholesale Trade Savings Alert */}
            {isStudioMode && studioSavings > 0 && (
              <div className="p-3 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold flex items-center justify-between">
                <span>⚡ Studio Trade Savings:</span>
                <span className="font-mono font-bold">-₹{studioSavings.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-baseline">
              <div>
                <span className="text-xs text-gray-400 block font-medium">
                  {isStudioMode ? 'Wholesale Trade Total' : 'Total Estimated Quote'}
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
