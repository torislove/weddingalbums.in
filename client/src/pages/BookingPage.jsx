import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoginModal from '../components/LoginModal';
import Toast from '../components/Toast';
import BundlesPathway from './booking/BundlesPathway';
import CustomPathway from './booking/CustomPathway';
import OrderSummary from './booking/OrderSummary';
import MobileSummaryBar from './booking/MobileSummaryBar';
import BookingSuccess from './booking/BookingSuccess';

import {
  ShoppingCart, CheckCircle2, Package, Image, Video,
  UploadCloud, Truck, MonitorPlay, Film, Palette,
  MessageCircle, Sparkles, MapPin, ArrowRight, ArrowLeft,
  Check, Clock, ShieldCheck, BookOpen, Layers,
  Calendar, CheckSquare, Zap, Building2, Eye, Tag
} from 'lucide-react';
import './OrderAlbum.css';
import { API } from '../apiConfig';

import {
  AUSPICIOUS_MUHURTHAM_DATES, DEFAULT_ALBUM_SIZES, SERVICE_INTENTS, DEFAULT_SHEETS, DEFAULT_BASE_SUBSTRATES,
  VIDEO_SERVICES, PHOTO_SERVICES, FLEX_SERVICES, CALENDAR_SERVICES, SERVICE_CATEGORIES,
} from './booking/bookingData';

const BookingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const { lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { msg, type }
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // SERVICE INTENT: 'edit_and_print' | 'only_editing' | 'only_printing' | 'standalone_services' | 'bundles'
  const [serviceIntent, setServiceIntent] = useState('edit_and_print');

  // SEPARATED EXPERIENCE MODE: 'bundles' (1-Click Fast Suites) vs 'custom' (A-la-carte Multi-Service)
  const [experienceMode, setExperienceMode] = useState('custom'); 
  const [appliedBundle, setAppliedBundle] = useState('royal_telugu');

  // Orientation filter for album sizes: 'all' | 'landscape' | 'portrait'
  const [selectedOrientation, setSelectedOrientation] = useState('all');

  const [dynamicPricing, setDynamicPricing] = useState({
    sizes: DEFAULT_ALBUM_SIZES,
    sheets: DEFAULT_SHEETS,
    substrates: DEFAULT_BASE_SUBSTRATES,
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
        substrates: DEFAULT_BASE_SUBSTRATES,
        services: services || [],
        packages: packages || []
      });
    }).catch(console.error);
  }, []);

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
      albumPrint: true,
      videoEdit: false,
      photoEdit: true,
      flexBanner: false,
      calendars: false,
    },
    
    // Album Specifications
    albumType: 'karizma',
    albumSize: '12x36',
    baseSubstrate: 'ntr_bopp',
    selectedSheetTypes: ['ntr_matte'],
    pages: 30,
    boxType: 'standard',
    parentAlbums: 0,
    
    // Video Editing Options - MULTI-SELECT!
    selectedVideoServices: ['teaser'],
    musicStyle: 'telugu_romantic',
    
    // Photo Editing Options - MULTI-SELECT!
    selectedPhotoServices: ['retouching'],
    photoCount: 50,
    
    // Flex & Banners Options - MULTI-SELECT!
    selectedFlexServices: [],
    
    // Calendars & Keepsakes Options - MULTI-SELECT!
    selectedCalendarServices: [],
    calendarCopies: 1,
    
    // Media upload method
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

  // (global language comes from LanguageContext — no local listener needed)

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
        selectedSheetTypes: ['velvet', 'metallic'],
        pages: 40,
        boxType: 'velvet_case',
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
      // In Bundles mode: step 2 is Event Details
      setExperienceMode('bundles');
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Customizer path: switches to Custom Multi-Service Builder step 2
      setExperienceMode('custom');
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dynamic Package from SysAdmin Engine Applier
  const applyDynamicPackage = (pkg, directToEvent = true) => {
    const pkgKey = pkg.id || pkg._id || pkg.tier;
    setAppliedBundle(pkgKey);
    setFormData(prev => ({
      ...prev,
      dynamicPackage: pkg,
      instructions: `[Curated Suite: ${pkg.tier}] ${Array.isArray(pkg.features) ? pkg.features.join(' | ') : ''}`,
      services: {
        albumPrint: true,
        videoEdit: pkg.category === 'combo' || String(pkg.category).toLowerCase().includes('video'),
        photoEdit: pkg.category === 'combo' || String(pkg.category).toLowerCase().includes('photo'),
        flexBanner: false,
        calendars: false,
      }
    }));
    if (directToEvent) {
      setExperienceMode('bundles');
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setExperienceMode('custom');
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fast Service Intent Switcher for Couples
  const selectServiceIntent = (intentId) => {
    setServiceIntent(intentId);
    if (intentId === 'bundles') {
      setExperienceMode('bundles');
      setStep(1);
    } else if (intentId === 'only_editing') {
      setExperienceMode('custom');
      setFormData(prev => ({
        ...prev,
        services: {
          albumPrint: false,
          photoEdit: true,
          videoEdit: prev.services.videoEdit,
          flexBanner: false,
          calendars: false,
        }
      }));
      setStep(1);
    } else if (intentId === 'only_printing') {
      setExperienceMode('custom');
      setFormData(prev => ({
        ...prev,
        services: {
          albumPrint: true,
          photoEdit: false,
          videoEdit: false,
          flexBanner: false,
          calendars: false,
        }
      }));
      setStep(1);
    } else if (intentId === 'edit_and_print') {
      setExperienceMode('custom');
      setFormData(prev => ({
        ...prev,
        services: {
          albumPrint: true,
          photoEdit: true,
          videoEdit: prev.services.videoEdit,
          flexBanner: false,
          calendars: false,
        }
      }));
      setStep(1);
    } else if (intentId === 'standalone_services') {
      setExperienceMode('custom');
      setFormData(prev => ({
        ...prev,
        services: {
          albumPrint: false,
          photoEdit: false,
          videoEdit: true,
          flexBanner: true,
          calendars: false,
        }
      }));
      setStep(1);
    }
  };

  const [searchParams] = useSearchParams();

  // Prepopulate from URL params.
  // Estimator 2.0 contract: ?service&size&pages&photos&finishmode&finish&cover&engrave&parentbooks&express&name&phone&city&price
  // Legacy paths still honoured: ?date ?bundle ?mode ?intent ?finish ?sheets ?substrate
  useEffect(() => {
    const urlDate = searchParams.get('date');
    const urlBundle = searchParams.get('bundle');
    const urlMode = searchParams.get('mode');
    const urlIntent = searchParams.get('intent') || urlMode;
    const urlService = searchParams.get('service');
    const urlFinish = searchParams.get('finish');
    const urlFinishMode = searchParams.get('finishmode');
    const urlSheets = searchParams.get('sheets');     // legacy: SHEETS count
    const urlPages = searchParams.get('pages');       // NEW: PAGES count (sheets = ceil/2)
    const urlSize = searchParams.get('size');
    const urlCover = searchParams.get('cover');
    const urlPhotos = searchParams.get('photos');
    const urlEngrave = searchParams.get('engrave');
    const urlParentBooks = searchParams.get('parentbooks');
    const urlExpress = searchParams.get('express');
    const urlSubstrate = searchParams.get('substrate');
    const urlName = searchParams.get('name');
    const urlPhone = searchParams.get('phone');
    const urlCity = searchParams.get('city');

    if (urlDate) {
      setFormData(prev => ({ ...prev, eventDate: urlDate }));
    }
    if (urlBundle) {
      applyBundle(urlBundle, false);
    }

    // Intent mapping. NOTE: edit_print MUST be matched before generic 'print'
    // substring checks, otherwise it lands in only_printing.
    if (urlIntent === 'edit_print' || urlService === 'edit_print') {
      selectServiceIntent('edit_and_print');
    } else if (urlIntent === 'only_editing' || urlService?.includes('photo') || urlService?.includes('culling')) {
      selectServiceIntent('only_editing');
    } else if (urlIntent === 'only_printing' || urlService === 'only_printing' || (urlService && !urlService.includes('edit') && urlService?.includes('print'))) {
      selectServiceIntent('only_printing');
    } else if (urlIntent === 'standalone_services' || urlService?.includes('video') || urlService?.includes('flex') || urlService?.includes('invite')) {
      selectServiceIntent('standalone_services');
    } else if (urlIntent === 'bundles' || urlBundle) {
      selectServiceIntent('bundles');
    } else if (urlIntent === 'edit_and_print') {
      selectServiceIntent('edit_and_print');
    }

    // Finish mapping — a single sheet id, or an estimator mix "id:count+id:count".
    if (urlFinish) {
      const ids = (urlFinishMode === 'mix' && urlFinish.includes(':'))
        ? urlFinish.split('+').map(chunk => chunk.split(':')[0])
        : [urlFinish];
      const valid = ids
        .map(id => DEFAULT_SHEETS.find(s => s.id === id || s.id.includes(id) || id.includes(s.id)))
        .filter(Boolean)
        .map(s => s.id);
      if (valid.length) {
        setFormData(prev => ({ ...prev, selectedSheetTypes: valid }));
      }
    }

    if (urlSubstrate) {
      setFormData(prev => ({ ...prev, baseSubstrate: urlSubstrate }));
    }

    // Album size (estimator sends "size-12x36"-style ids)
    if (urlSize) {
      const mapped = urlSize.replace(/^size-/, '');
      if (mapped) setFormData(prev => ({ ...prev, albumSize: mapped }));
    }

    // Estimator cover → builder albumType (legacy estimator ids + CMS descriptive ids)
    const COVER_MAP = {
      acrylic: 'acrylic', 'acrylic-glass': 'acrylic',
      'velvet-foil': 'velvet', 'royal-velvet-foil': 'velvet',
      leatherette: 'leather', 'leatherette-box': 'leather',
      'matte-hardcover': 'karizma', 'hardcover-matte': 'karizma',
    };
    if (urlCover && COVER_MAP[urlCover]) {
      setFormData(prev => ({ ...prev, albumType: COVER_MAP[urlCover] }));
    }

    // Photo count (drives photo editing panels)
    if (urlPhotos) {
      const n = parseInt(urlPhotos, 10);
      if (!isNaN(n) && n > 0) setFormData(prev => ({ ...prev, photoCount: n }));
    }

    // Parent mini-books → parentAlbums (builder pills go up to 3)
    if (urlParentBooks) {
      const n = parseInt(urlParentBooks, 10);
      if (!isNaN(n) && n >= 0) setFormData(prev => ({ ...prev, parentAlbums: Math.min(n, 3) }));
    }

    if (urlExpress === '1' || urlExpress === 'true') {
      setFormData(prev => ({ ...prev, deliverySpeed: 'express' }));
    }

    if (urlName || urlPhone || urlCity) {
      setFormData(prev => ({
        ...prev,
        name: urlName || prev.name,
        phone: urlPhone || prev.phone,
        city: urlCity || prev.city,
      }));
    }

    // Pages-as-sheets reconciliation (BookingPage stores PAGES in SHEETS).
    const sheetsFromPages = urlPages ? Math.ceil(parseInt(urlPages, 10) / 2) : NaN;
    const legacySheets = urlSheets ? parseInt(urlSheets, 10) : NaN;
    const sheets = (!isNaN(sheetsFromPages) && sheetsFromPages >= 10)
      ? sheetsFromPages
      : (!isNaN(legacySheets) && legacySheets >= 10 ? legacySheets : null);

    const noteBits = [];
    if (urlEngrave === '1' || urlEngrave === 'true') {
      noteBits.push('24K Gold cover engraving confirmed in instant quote.');
    }
    if (sheets) {
      noteBits.push(urlPages
        ? `${urlPages} pages (${sheets} sheets) chosen in the instant estimator.`
        : `${sheets} sheets chosen via shared link.`);
    }
    if (sheets || noteBits.length) {
      setFormData(prev => ({
        ...prev,
        pages: sheets || prev.pages,
        instructions: [prev.instructions, ...noteBits].filter(Boolean).join(' ').slice(0, 800),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Multi-select toggle helpers
  const toggleSheetType = (sheetId) => {
    setFormData(prev => {
      const exists = prev.selectedSheetTypes.includes(sheetId);
      let updated;
      if (exists) {
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

  // Precise, 100% Itemized Pricing Calculation (Couple Retail Heirloom Suite)
  const calculateTotal = () => {
    // Special curated bundle fast calculation if in bundles mode
    if (experienceMode === 'bundles' || serviceIntent === 'bundles') {
      if (appliedBundle === 'royal_telugu') return 17999;
      if (appliedBundle === 'cinematic_duo') return 13200;
      if (appliedBundle === 'lab_express') return 8200;
      if (formData.dynamicPackage && appliedBundle === (formData.dynamicPackage.id || formData.dynamicPackage._id || formData.dynamicPackage.tier)) {
        const raw = String(formData.dynamicPackage.price || '').replace(/[^0-9]/g, '');
        const num = parseInt(raw, 10);
        if (!isNaN(num) && num > 0) {
          return num;
        }
      }
    }

    let total = 0;

    // 1. Album Print & Lab Binding (Only if albumPrint is active)
    if (formData.services.albumPrint) {
      let basePrice = 9500;
      
      const matchedSize = dynamicPricing.sizes.find(s =>
        s.id === formData.albumSize ||
        s._id === formData.albumSize ||
        s.dimensions === formData.albumSize ||
        s.dimensions?.includes(formData.albumSize) ||
        s.name?.includes(formData.albumSize)
      );
      if (matchedSize) {
        basePrice = Number(matchedSize.basePrice || matchedSize.clientBasePrice || 9500);
      }

      // Cover style surcharge
      if (formData.albumType === 'acrylic') basePrice += 1500;
      else if (formData.albumType === 'velvet') basePrice += 1000;
      else if (formData.albumType === 'leather') basePrice += 1200;

      // Base Substrate surcharge (Silver Halide +₹40/sheet, Cotton Rag +₹60/sheet)
      let substrateSurcharge = 0;
      if (formData.baseSubstrate === 'silver_halide') substrateSurcharge = 40;
      else if (formData.baseSubstrate === 'cotton_rag') substrateSurcharge = 60;
      basePrice += (formData.pages * substrateSurcharge);

      // Surface Finish surcharge (Matte/Gloss = ₹0, Silky = ₹25, Velvet = ₹35, Metallic = ₹45, Sparkle = ₹50, Luster = ₹30, Leatherette = ₹40)
      let maxFinishSurcharge = 0;
      formData.selectedSheetTypes.forEach(shtId => {
        const s = DEFAULT_SHEETS.find(sh => sh.id === shtId || sh.name?.toLowerCase().includes(String(shtId).toLowerCase()));
        if (s && s.surchargePerSheet) {
          maxFinishSurcharge = Math.max(maxFinishSurcharge, s.surchargePerSheet);
        }
      });
      basePrice += (formData.pages * maxFinishSurcharge);

      // Extra sheets above 30 calculated at base sheet rate (₹70/sheet)
      const sheetDelta = formData.pages - 30;
      basePrice += (sheetDelta * 70);

      // Presentation box
      if (formData.boxType === 'velvet_case') basePrice += 1200;
      else if (formData.boxType === 'wooden_box') basePrice += 1800;
      else if (formData.boxType === 'acrylic_box') basePrice += 2200;

      // Duplicate parent albums
      if (formData.parentAlbums === 1) basePrice += 2500;
      else if (formData.parentAlbums === 2) basePrice += 4500;

      total += basePrice;
    }

    // 2. Video Editing
    if (formData.services.videoEdit && formData.selectedVideoServices.length > 0) {
      formData.selectedVideoServices.forEach(vId => {
        const item = VIDEO_SERVICES.find(v => v.id === vId);
        if (item) {
          total += (item.price || item.clientPrice || 0);
        }
      });
    }

    // 3. Photo Editing
    if (formData.services.photoEdit && formData.selectedPhotoServices.length > 0) {
      let combinedPerPhoto = 0;
      formData.selectedPhotoServices.forEach(pId => {
        const item = PHOTO_SERVICES.find(p => p.id === pId);
        if (item) {
          combinedPerPhoto += (item.rate || item.clientRate || 0);
        }
      });
      const photoMin = 1200;
      total += Math.max(photoMin, combinedPerPhoto * formData.photoCount);
    }

    // 4. Flex & Banners
    if (formData.services.flexBanner && formData.selectedFlexServices.length > 0) {
      formData.selectedFlexServices.forEach(fId => {
        const item = FLEX_SERVICES.find(f => f.id === fId);
        if (item) {
          total += (item.price || item.clientPrice || 0);
        }
      });
    }

    // 5. Calendars
    if (formData.services.calendars && formData.selectedCalendarServices.length > 0) {
      let calendarUnitSum = 0;
      formData.selectedCalendarServices.forEach(cId => {
        const item = CALENDAR_SERVICES.find(c => c.id === cId);
        if (item) {
          calendarUnitSum += (item.price || item.clientPrice || 0);
        }
      });
      total += calendarUnitSum * (formData.calendarCopies || 1);
    }

    // Speed surcharge
    if (formData.deliverySpeed === 'express') {
      total += 1500;
    }

    return total;
  };

  // Dynamic Stepper Definitions
  const wizardSteps = experienceMode === 'bundles'
    ? [
        { num: 1, title: 'Luxury Bundle', telugu: 'బండిల్ ఎంపిక', icon: Sparkles },
        { num: 2, title: 'Event Details', telugu: 'ఈవెంట్ వివరాలు', icon: MapPin },
        { num: 3, title: 'Upload & Confirm', telugu: 'మీడియా & కన్ఫర్మ్', icon: UploadCloud },
      ]
    : [
        { num: 1, title: 'Pick Services', telugu: 'సర్వీసుల ఎంపిక', icon: CheckSquare },
        { num: 2, title: 'Customization', telugu: 'కాన్ఫిగరేషన్', icon: Layers },
        { num: 3, title: 'Event Details', telugu: 'ఈవెంట్ వివరాలు', icon: MapPin },
        { num: 4, title: 'Upload & Confirm', telugu: 'మీడియా & కన్ఫర్మ్', icon: UploadCloud },
      ];

  const totalSteps = wizardSteps.length;

  const renderServiceIntentSelector = () => {
    const activeIntentObj = SERVICE_INTENTS.find(i => i.id === serviceIntent) || SERVICE_INTENTS[0];

    return (
      <div className="service-intent-box p-5 rounded-2xl bg-black/60 border border-[var(--brand)]/30 mb-6 backdrop-blur-md">
        <div className="mb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-mono font-bold text-[var(--brand)] uppercase tracking-wider block">
              Step 1: Choose Your Service Scope
            </span>
            <span className="text-[11px] text-gray-400">
              {lang === 'TE' ? 'మీ అవసరానికి సరిపోయే సర్వీస్‌ను ఎంచుకోండి' : 'Select the exact service combination you need'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
            {lang === 'TE' ? 'మీ వివాహానికి ఏ సేవలు కావాలి?' : 'What Service Do You Need Today?'}
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            {lang === 'TE'
              ? 'ఎడిటింగ్ మాత్రమే, ల్యాబ్ ప్రింటింగ్ మాత్రమే, లేదా పూర్తి సూట్ — పూర్తి పారదర్శకతతో ఎంచుకోండి.'
              : 'Choose pure digital editing, pure lab printing, complete master design+print suite, or a-la-carte media.'}
          </p>
        </div>

        {/* 5 INTENT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {SERVICE_INTENTS.map(intent => {
            const isSelected = serviceIntent === intent.id;
            return (
              <div
                key={intent.id}
                onClick={() => selectServiceIntent(intent.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-[var(--brand)]/25 via-black to-black border-[var(--brand)] shadow-[0_0_15px_rgba(212,175,55,0.25)] scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                    isSelected ? 'bg-[var(--brand)] text-black font-extrabold' : 'bg-white/10 text-gray-300'
                  }`}>
                    {intent.badge}
                  </span>
                  <div className="font-bold text-xs text-white leading-snug">{intent.title}</div>
                  <div className="text-[11px] text-[var(--brand)] font-telugu mt-0.5">{intent.telugu}</div>
                </div>
                <div className="text-[10px] text-gray-400 mt-2 line-clamp-2">
                  {intent.shortDesc}
                </div>
              </div>
            );
          })}
        </div>

        {/* DYNAMIC SERVICE EXPLANATION & INCLUSION ACCORDION/BANNER */}
        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{activeIntentObj.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--brand)]/20 text-[var(--brand)] font-mono">
                  {activeIntentObj.badge}
                </span>
              </div>
              <p className="text-gray-300 text-[11px] mt-0.5">{activeIntentObj.shortDesc}</p>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="text-[10px] text-gray-400 block">Turnaround Time</span>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center sm:justify-end gap-1">
                <Clock size={12} /> {activeIntentObj.turnaround}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1 text-[10px]">What is Included:</span>
              <div className="space-y-1">
                {activeIntentObj.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-gray-300 text-[11px]">
                    <CheckCircle2 size={12} className="text-[var(--brand)] shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1 text-[10px]">What You Provide:</span>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-gray-300 text-[11px] mb-1.5">
                📂 {activeIntentObj.clientProvides}
              </div>
              <div className="text-[10px] text-gray-400">
                💬 After booking, our Vijayawada lab team connects on WhatsApp to confirm files and share digital 3D proofs.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const proceedToNextStep = () => {
    if (experienceMode === 'bundles') {
      if (step === 1) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (step === 2) {
        if (!formData.name.trim()) {
          setToast({ msg: lang === 'TE' ? 'దయచేసి మీ పేరు నమోదు చేయండి.' : 'Please enter your name.', type: 'error' });
          return;
        }
        if (!formData.phone.trim() || formData.phone.length < 10) {
          setToast({ msg: lang === 'TE' ? 'దయచేసి సరైన వాట్సాప్ ఫోన్ నెంబర్ నమోదు చేయండి.' : 'Please enter a valid 10-digit WhatsApp phone number.', type: 'error' });
          return;
        }
        if (!formData.eventDate) {
          setToast({ msg: lang === 'TE' ? 'దయచేసి మీ ఈవెంట్ లేదా వివాహ ముహూర్తం తేదీని ఎంచుకోండి.' : 'Please select your event or wedding muhurtham date.', type: 'error' });
          return;
        }
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Custom Builder Mode
      if (step === 1) {
        const hasAnyService = Object.values(formData.services).some(Boolean);
        if (!hasAnyService) {
          setToast({ msg: lang === 'TE' ? 'దయచేసి కనీసం ఒక సేవను ఎంచుకోండి.' : 'Please select at least one service to continue.', type: 'error' });
          return;
        }
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (step === 2) {
        const hasAnyService = Object.values(formData.services).some(Boolean);
        if (!hasAnyService) {
          setToast({ msg: lang === 'TE' ? 'దయచేసి కనీసం ఒక సేవను ఎంచుకోండి లేదా తక్షణ బండిల్స్ మోడ్‌కి మారండి.' : 'Please select at least one service to continue, or switch to 1-Click Fast Bundles.', type: 'error' });
          return;
        }
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (step === 3) {
        if (!formData.name.trim()) {
          setToast({ msg: lang === 'TE' ? 'దయచేసి మీ పేరు నమోదు చేయండి.' : 'Please enter your name.', type: 'error' });
          return;
        }
        if (!formData.phone.trim() || formData.phone.length < 10) {
          setToast({ msg: lang === 'TE' ? 'దయచేసి సరైన వాట్సాప్ ఫోన్ నెంబర్ నమోదు చేయండి.' : 'Please enter a valid 10-digit WhatsApp phone number.', type: 'error' });
          return;
        }
        if (!formData.eventDate) {
          setToast({ msg: lang === 'TE' ? 'దయచేసి మీ ఈవెంట్ లేదా వివాహ ముహూర్తం తేదీని ఎంచుకోండి.' : 'Please select your event or wedding muhurtham date.', type: 'error' });
          return;
        }
        setStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const goBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Structured Item Generator for Client Panel Full Understanding
  const generateStructuredItems = () => {
    const items = [];
    if (experienceMode === 'bundles') {
      const bundleNames = {
        royal_telugu: 'Royal Telugu Muhurtham Master Suite',
        cinematic_duo: 'Cinematic Story & Karizma Duo',
        lab_express: 'Express Archival Lab Printing Suite'
      };
      const bundleName = formData.dynamicPackage?.tier || bundleNames[appliedBundle] || 'Curated Wedding Luxury Suite';
      const bundleDetails = formData.dynamicPackage
        ? (Array.isArray(formData.dynamicPackage.features) ? formData.dynamicPackage.features.join(' • ') : formData.dynamicPackage.tier)
        : (appliedBundle === 'royal_telugu'
          ? '12×36 Layflat Karizma (40 sheets, Velvet Touch) + 4K Teaser & 5 Reels + 50 Retouched Photos + Briefcase Box'
          : appliedBundle === 'cinematic_duo'
          ? '12×30 Layflat Album (30 sheets, Metallic Pearl) + 4K Teaser & 5 Reels + 30 Retouched Photos'
          : '12×36 Layflat Flushmount (30 sheets, Metallic Pearl) + Velvet Briefcase Box + Express Delivery');

      items.push({
        name: bundleName,
        type: 'bundle',
        details: bundleDetails,
        price: calculateTotal(),
        specs: {
          bundleKey: appliedBundle,
          albumSize: formData.albumSize,
          sheets: formData.pages,
          sheetTypes: formData.selectedSheetTypes,
          videoServices: formData.selectedVideoServices,
          photosCount: formData.photoCount
        }
      });
    } else {
      if (formData.services.albumPrint) {
        let albumItemPrice = 9500;
        const matchedSize = dynamicPricing.sizes.find(s =>
          s.id === formData.albumSize ||
          s._id === formData.albumSize ||
          s.dimensions === formData.albumSize ||
          s.dimensions?.includes(formData.albumSize) ||
          s.name?.includes(formData.albumSize)
        );
        if (matchedSize) {
          albumItemPrice = Number(matchedSize.basePrice || matchedSize.clientBasePrice || 9500);
        }
        if (formData.albumType === 'acrylic') albumItemPrice += 1500;
        else if (formData.albumType === 'velvet') albumItemPrice += 1000;
        else if (formData.albumType === 'leather') albumItemPrice += 1200;

        const activeSheets = dynamicPricing.sheets.filter(s =>
          formData.selectedSheetTypes.includes(s.id) ||
          formData.selectedSheetTypes.includes(s._id) ||
          formData.selectedSheetTypes.some(sel => s.name?.toLowerCase().includes(String(sel).toLowerCase()))
        );
        let avgSheetRate = 65;
        if (activeSheets.length > 0) {
          const sumRates = activeSheets.reduce((acc, s) => acc + Number(s.pricePerSheet || s.clientPricePerSheet || 65), 0);
          avgSheetRate = Math.round(sumRates / activeSheets.length);
        }
        const extraSheets = Math.max(0, formData.pages - 30);
        albumItemPrice += (extraSheets * avgSheetRate);

        if (formData.boxType === 'velvet_case') albumItemPrice += 1200;
        else if (formData.boxType === 'wooden_box') albumItemPrice += 1800;
        else if (formData.boxType === 'acrylic_box') albumItemPrice += 2200;

        if (formData.parentAlbums === 1) albumItemPrice += 2500;
        else if (formData.parentAlbums === 2) albumItemPrice += 4500;

        const sheetNames = activeSheets.map(s => s.name).filter(Boolean);
        const sheetDisplay = sheetNames.length > 0 ? sheetNames.join(' + ') : formData.selectedSheetTypes.join(' + ');

        items.push({
          name: `Handcrafted Album (${matchedSize?.name || formData.albumSize} • ${formData.albumType})`,
          type: 'album',
          details: `${formData.pages} Sheets (${sheetDisplay} @ ₹${avgSheetRate}/sheet) | Box: ${formData.boxType}${formData.parentAlbums > 0 ? ` | ${formData.parentAlbums} Mini Parent Album(s)` : ''}`,
          price: albumItemPrice,
          specs: {
            size: formData.albumSize,
            cover: formData.albumType,
            sheets: formData.pages,
            sheetTypes: formData.selectedSheetTypes,
            box: formData.boxType,
            parentAlbums: formData.parentAlbums
          }
        });
      }
      if (formData.services.videoEdit && formData.selectedVideoServices.length > 0) {
        const vNames = formData.selectedVideoServices.map(id => VIDEO_SERVICES.find(v => v.id === id)?.name).filter(Boolean);
        items.push({
          name: `Cinematic Video Editing (${formData.selectedVideoServices.length} cut${formData.selectedVideoServices.length > 1 ? 's' : ''})`,
          type: 'video',
          details: `${vNames.join(', ')} | Audio: ${formData.musicStyle.replace('_', ' ')}`,
          price: formData.selectedVideoServices.reduce((sum, id) => sum + (VIDEO_SERVICES.find(v => v.id === id)?.price || 0), 0),
          specs: {
            services: formData.selectedVideoServices,
            music: formData.musicStyle
          }
        });
      }
      if (formData.services.photoEdit && formData.selectedPhotoServices.length > 0) {
        const pNames = formData.selectedPhotoServices.map(id => PHOTO_SERVICES.find(p => p.id === id)?.name).filter(Boolean);
        items.push({
          name: `Photo Retouching & Color (${formData.photoCount} photos)`,
          type: 'photo',
          details: `${pNames.join(', ')}`,
          price: formData.photoCount * formData.selectedPhotoServices.reduce((sum, id) => sum + (PHOTO_SERVICES.find(p => p.id === id)?.rate || 0), 0),
          specs: {
            styles: formData.selectedPhotoServices,
            count: formData.photoCount
          }
        });
      }
      if (formData.services.flexBanner && formData.selectedFlexServices.length > 0) {
        const fNames = formData.selectedFlexServices.map(id => FLEX_SERVICES.find(f => f.id === id)?.name).filter(Boolean);
        items.push({
          name: `Wedding Flex & Banners (${formData.selectedFlexServices.length} items)`,
          type: 'flex',
          details: fNames.join(', '),
          price: formData.selectedFlexServices.reduce((sum, id) => sum + (FLEX_SERVICES.find(f => f.id === id)?.price || 0), 0),
          specs: {
            services: formData.selectedFlexServices
          }
        });
      }
      if (formData.services.calendars && formData.selectedCalendarServices.length > 0) {
        const cNames = formData.selectedCalendarServices.map(id => CALENDAR_SERVICES.find(c => c.id === id)?.name).filter(Boolean);
        items.push({
          name: `Personalized Calendars (${formData.calendarCopies} copies)`,
          type: 'calendar',
          details: `${cNames.join(', ')}`,
          price: formData.calendarCopies * formData.selectedCalendarServices.reduce((sum, id) => sum + (CALENDAR_SERVICES.find(c => c.id === id)?.price || 0), 0),
          specs: {
            services: formData.selectedCalendarServices,
            copies: formData.calendarCopies
          }
        });
      }
    }
    return items;
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
      const itemsList = generateStructuredItems();

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
        instructions: `[COUPLE ROYAL ORDER | ${formData.eventType} in ${formData.city}] ${experienceMode === 'bundles' ? `Bundle: ${appliedBundle}` : `Custom: ${Object.keys(formData.services).filter(k => formData.services[k]).join(', ')}`}. Speed: ${formData.deliverySpeed}. Notes: ${formData.instructions || 'Standard order'}`,
        items: itemsList,
        data: {
          packageType: experienceMode,
          appliedBundle: experienceMode === 'bundles' ? appliedBundle : null,
          services: formData.services,
          album: formData.services.albumPrint ? {
            type: formData.albumType,
            size: formData.albumSize,
            sheets: formData.pages,
            sheetTypes: formData.selectedSheetTypes,
            box: formData.boxType,
            parentAlbums: formData.parentAlbums
          } : null,
          video: formData.services.videoEdit ? {
            services: formData.selectedVideoServices,
            music: formData.musicStyle
          } : null,
          photo: formData.services.photoEdit ? {
            styles: formData.selectedPhotoServices,
            count: formData.photoCount
          } : null,
          flex: formData.services.flexBanner ? {
            services: formData.selectedFlexServices
          } : null,
          calendars: formData.services.calendars ? {
            services: formData.selectedCalendarServices,
            copies: formData.calendarCopies
          } : null,
          event: {
            type: formData.eventType,
            city: formData.city,
            speed: formData.deliverySpeed,
            address: formData.address
          },
          pricing: {
            total: totalAmount
          },
          items: itemsList
        }
      };

      await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Save to cart session for checkout continuity
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`${API}/api/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            items: [{
              type: experienceMode === 'bundles' ? 'bundle_booking' : 'custom_booking',
              name: `${experienceMode === 'bundles' ? 'Curated Suite' : 'Custom Package'} (${formData.eventType} - Royal Suite)`,
              price: totalAmount,
              details: payload.data
            }],
            totalAmount
          })
        }).catch(() => {});
      }

      // WhatsApp lead sync
      fetch(`${API}/api/whatsapp-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          name: formData.name,
          service: `Booking ${orderId} (${formData.eventType} - Direct Couple)`,
          note: `Total: ₹${totalAmount.toLocaleString('en-IN')}`
        })
      }).catch(() => {});

      setFormData(prev => ({ ...prev, createdOrderId: orderId }));
      setSubmitted(true);
    } catch (err) {
      console.error('Order submission error:', err);
      setToast({ msg: 'Order registered in queue. Our coordinator will contact you shortly.', type: 'info' });
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
      `*Account Type:* 👥 Couple Direct Order (Retail)\n` +
      `*Event:* ${formData.eventType} in ${formData.city}\n` +
      `*Mode:* ${experienceMode === 'bundles' ? `⚡ Curated Bundle (${appliedBundle})` : '🛠️ Custom Multi-Service Builder'}\n` +
      `*Speed:* ${formData.deliverySpeed === 'express' ? '🚀 Express 24-48h' : '⚡ Standard 3-5 Days'}\n\n` +
      `*Selected Services:*\n• ${selectedServiceNames}\n\n` +
      `*Total Estimate:* ₹${calculateTotal().toLocaleString('en-IN')}\n` +
      `--------------------------------\n` +
      `Please confirm my booking and schedule design proofing!`;

    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Filter sizes based on selectedOrientation
  const filteredSizes = dynamicPricing.sizes.filter(sz => {
    if (selectedOrientation === 'all') return true;
    return sz.orientation === selectedOrientation;
  });

  // ── Shared context for the extracted step components (client/src/pages/booking/*) ──
  const ctx = {
    step, setStep, submitted, setSubmitted, submitting, setSubmitting,
    toast, setToast, showAuthModal, setShowAuthModal,
    serviceIntent, setServiceIntent, experienceMode, setExperienceMode,
    appliedBundle, setAppliedBundle, selectedOrientation, setSelectedOrientation,
    dynamicPricing, formData, setFormData, user, lang, navigate,
    totalSteps, wizardSteps,
    toggleServiceCategory, applyBundle, applyDynamicPackage, selectServiceIntent,
    toggleSheetType, toggleVideoService, togglePhotoService, toggleFlexService, toggleCalendarService,
    calculateTotal, renderServiceIntentSelector, proceedToNextStep, goBackStep,
    generateStructuredItems, submitOrder, openWhatsAppDirect, filteredSizes,
  };

  // SUCCESS SCREEN
  if (submitted) {
    return <BookingSuccess ctx={ctx} />;
  }

  return (
    <div className="builder-layout pt-28 pb-20">
      {/* LEFT: WIZARD */}
      <div className="builder-main">
        
        {/* Header */}
        <div className="order-header mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/30 text-[var(--brand)] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            {lang === 'TE' ? 'ఆంధ్రప్రదేశ్ నెం.1 పోస్ట్-ప్రొడక్షన్ హబ్' : "Andhra Pradesh's #1 Post-Production Hub"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white font-bold mb-2">
            {lang === 'TE' ? 'అన్ని ఎడిటింగ్, వీడియో & ప్రింటింగ్ సేవలు ఒకే చోట' : 'All Editing, Video & Printing Services in One Place'}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
            {lang === 'TE'
              ? 'సులువైన దశలు. తక్షణ బండిల్స్ లేదా మీ అవసరానికి తగినట్లుగా విడివిడిగా సేవలను ఎంచుకోండి.'
              : 'Effortless booking. Choose curated 1-click bundles or handpick services a-la-carte.'}
          </p>
        </div>

        {/* Couple Direct Booking Suite */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/70 border border-[var(--brand)]/30 mb-8 flex-wrap gap-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--brand)]/20 text-[var(--brand)]">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>✨ Couple Direct Booking Suite</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-[var(--brand)]/20 text-[var(--brand)] border border-[var(--brand)]/30">
                  Direct Lab Order
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                Order handcrafted luxury albums directly from Andhra Pradesh's premier post-production facility with 100% color fidelity.
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Stepper Bar */}
        <div className="builder-progress mb-8">
          {wizardSteps.map((s) => (
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

        {/* =========================================================================
            PATHWAY 1: CURATED FAST BUNDLES (3 CLEAN STEPS)
            ========================================================================= */}
        {experienceMode === 'bundles' && (
        <BundlesPathway ctx={ctx} />
        )}

        {/* =========================================================================
            PATHWAY 2: CUSTOM MULTI-SERVICE BUILDER (4 DEDICATED STEPS)
            ========================================================================= */}
        {experienceMode === 'custom' && (
        <CustomPathway ctx={ctx} />
        )}

      </div>

      {/* RIGHT: ITEMIZED STICKY SIDEBAR */}
      <OrderSummary ctx={ctx} />

      {/* FLOATING MOBILE BOTTOM BAR */}
      <MobileSummaryBar ctx={ctx} />

      <LoginModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultRole="b2c"
        onSuccess={(newUser) => {
          setShowAuthModal(false);
          submitOrder(newUser);
        }}
      />

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
};

export default BookingPage;
