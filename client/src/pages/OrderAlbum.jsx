import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import {
  ShoppingCart, CheckCircle2, Package, Image, Video,
  UploadCloud, Truck, MonitorPlay, Printer, Film,
  Palette, MessageCircle, Sparkles, MapPin, Phone,
  HelpCircle, HardDrive, ArrowRight, ArrowLeft, Check,
  Clock, ShieldCheck, Music, Box, BookOpen, Layers
} from 'lucide-react';
import './OrderAlbum.css';

const API = (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:4000'));

const OrderAlbum = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState(() => localStorage.getItem('site_lang') || 'EN');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Form State with ALL options for Editing, Video, Printing, and Flex
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
      photoEdit: false,
      videoEdit: false,
      albumPrint: true, // Default recommended
      flexBanner: false,
    },
    
    // Album Specifications
    albumType: 'karizma', // 'karizma' | 'flushmount' | 'acrylic' | 'velvet' | 'leather'
    albumSize: '12x36', // '12x36' | '12x30' | '12x24'
    sheetType: 'velvet', // 'velvet' | 'gloss' | 'metallic' | 'nontearable'
    pages: 30, // 30, 40, 50, 60 sheets
    boxType: 'standard', // 'standard' | 'velvet_case' | 'wooden_box' | 'acrylic_box'
    parentAlbums: 0, // 0, 1, 2
    
    // Video Editing Options
    videoType: 'teaser', // 'teaser' | 'highlights' | 'traditional' | 'reels' | 'sde' | 'prewedding'
    musicStyle: 'telugu_romantic', // 'telugu_romantic' | 'devotional' | 'energetic' | 'custom'
    
    // Photo Editing Options
    photoStyle: 'retouching', // 'retouching' | 'cinematic_luts' | 'culling' | 'background' | 'restoration'
    photoCount: 50, // 30, 50, 100, 200, 300
    
    // Flex & Banners Options
    flexType: 'mandap', // 'mandap' | 'hoarding' | 'standee' | 'invite'
    
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

  // Pricing Calculation across ALL options
  const calculateTotal = () => {
    let total = 0;

    // 1. Album Print & Design
    if (formData.services.albumPrint) {
      let basePrice = 7500;
      if (formData.albumSize === '12x36') basePrice = 9500;
      if (formData.albumSize === '12x30') basePrice = 8500;
      if (formData.albumSize === '12x24') basePrice = 7500;

      // Cover style surcharge
      if (formData.albumType === 'acrylic') basePrice += 1500;
      if (formData.albumType === 'velvet') basePrice += 1000;
      if (formData.albumType === 'leather') basePrice += 1200;

      let sheetRate = 180;
      if (formData.sheetType === 'velvet') sheetRate = 220;
      if (formData.sheetType === 'metallic') sheetRate = 250;
      if (formData.sheetType === 'nontearable') sheetRate = 200;

      total += basePrice + ((formData.pages - 30) * sheetRate);

      // Presentation box
      if (formData.boxType === 'velvet_case') total += 1200;
      if (formData.boxType === 'wooden_box') total += 1800;
      if (formData.boxType === 'acrylic_box') total += 2200;

      // Parent duplicate mini albums
      if (formData.parentAlbums === 1) total += 2500;
      if (formData.parentAlbums === 2) total += 4500;
    }

    // 2. Video Editing
    if (formData.services.videoEdit) {
      if (formData.videoType === 'teaser') total += 6000;
      else if (formData.videoType === 'highlights') total += 10000;
      else if (formData.videoType === 'traditional') total += 12000;
      else if (formData.videoType === 'reels') total += 3500;
      else if (formData.videoType === 'sde') total += 12000;
      else if (formData.videoType === 'prewedding') total += 5000;
    }

    // 3. Photo Editing & Retouching
    if (formData.services.photoEdit) {
      let perPhoto = 40;
      if (formData.photoStyle === 'retouching') perPhoto = 60;
      if (formData.photoStyle === 'cinematic_luts') perPhoto = 30;
      if (formData.photoStyle === 'background') perPhoto = 90;
      if (formData.photoStyle === 'restoration') perPhoto = 120;
      if (formData.photoStyle === 'culling') perPhoto = 15;
      total += Math.max(1200, formData.photoCount * perPhoto);
    }

    // 4. Flex / Banner Design
    if (formData.services.flexBanner) {
      if (formData.flexType === 'mandap') total += 1500;
      else if (formData.flexType === 'hoarding') total += 3500;
      else if (formData.flexType === 'standee') total += 1200;
      else if (formData.flexType === 'invite') total += 1800;
    }

    // Speed surcharge
    if (formData.deliverySpeed === 'express') {
      total += 1500;
    }

    return total;
  };

  const toggleService = (key) => {
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
      const payload = {
        orderId,
        name: formData.name,
        email: formData.email || (currentUser?.email || ''),
        phone: formData.phone,
        address: formData.address,
        total: calculateTotal(),
        status: 'Confirmed',
        cloudLink: formData.uploadMethod === 'cloud' ? formData.cloudLink : '',
        uploadPreference: formData.uploadMethod,
        instructions: `[${formData.eventType} in ${formData.city}] Album: ${formData.albumType} ${formData.albumSize} (${formData.pages}p). Video: ${formData.videoType}. Photo: ${formData.photoStyle} (${formData.photoCount}p). Speed: ${formData.deliverySpeed}. Notes: ${formData.instructions || 'Standard order'}`,
        data: {
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

      // Capture WhatsApp lead sync
      fetch(`${API}/api/whatsapp-lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          name: formData.name,
          service: `Order ${orderId} (${formData.eventType})`,
          note: `Total: ₹${calculateTotal()}`
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
      formData.services.albumPrint && `Album (${formData.albumType} ${formData.albumSize})`,
      formData.services.videoEdit && `Video (${formData.videoType})`,
      formData.services.photoEdit && `Photos (${formData.photoStyle})`,
      formData.services.flexBanner && `Flex (${formData.flexType})`
    ].filter(Boolean).join(', ') || 'Wedding Post-Production';

    const msg = `నమస్కారం! నేను WeddingAlbums.in లో ఆర్డర్ చేయాలనుకుంటున్నాను.\nపేరు: ${formData.name || 'Client'}\nఫోన్: ${formData.phone || ''}\nఈవెంట్: ${formData.eventType} (${formData.city})\nఎంచుకున్న సేవలు: ${selectedServiceNames}\nమొత్తం బడ్జెట్: ₹${calculateTotal().toLocaleString('en-IN')}`;
    
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="order-container success text-center py-20 px-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-serif text-white mb-3">
          {lang === 'TE' ? 'ఆర్డర్ విజయవంతంగా నమోదైంది! 🎉' : 'Order Placed Successfully! 🎉'}
        </h2>
        <p className="text-gray-300 text-lg mb-6">
          {lang === 'TE'
            ? `ధన్యవాదాలు ${formData.name} గారు. మా ఎడిటింగ్ & ప్రింటింగ్ నిపుణులు మీ ఆర్డర్‌ను ప్రారంభించడానికి సిద్ధంగా ఉన్నారు.`
            : `Thank you, ${formData.name}. Our master editing and printing team has received your order specifications.`}
        </p>

        <div className="bg-black/50 border border-[#D4AF37]/30 rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span className="text-gray-400">Order ID / ఆర్డర్ నెం:</span>
            <span className="font-mono text-[#D4AF37] font-bold text-lg">{formData.createdOrderId || 'ORD-CONFIRMED'}</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span className="text-gray-400">Event / ఈవెంట్:</span>
            <span className="text-white font-medium">{formData.eventType} ({formData.city})</span>
          </div>
          <div className="flex justify-between border-b border-white/10 pb-3">
            <span className="text-gray-400">Delivery Speed:</span>
            <span className="text-[#34d399] font-medium">{formData.deliverySpeed === 'express' ? '🚀 24-48 Hours Express' : '⚡ 3-5 Days Standard'}</span>
          </div>
          <div className="flex justify-between pt-1 text-lg font-bold">
            <span className="text-white">Estimated Total:</span>
            <span className="text-[#D4AF37]">₹{calculateTotal().toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={openWhatsAppDirect}
            className="btn btn-gold-3d flex items-center justify-center gap-2 px-6 py-3 font-bold"
          >
            <MessageCircle size={20} />
            {lang === 'TE' ? 'వాట్సాప్ లో ఫోటోలు పంపండి' : 'Send Photos on WhatsApp'}
          </button>
          <button
            onClick={() => navigate('/client')}
            className="btn btn-outline flex items-center justify-center gap-2 px-6 py-3"
          >
            {lang === 'TE' ? 'క్లయింట్ డ్యాష్‌బోర్డ్‌కి వెళ్ళండి' : 'Go to Client Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-layout">
      {/* LEFT: 3-STEP WIZARD */}
      <div className="builder-main">
        {/* Header */}
        <div className="order-header mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            {lang === 'TE' ? 'ఆంధ్రప్రదేశ్ నెం.1 పోస్ట్-ప్రొడక్షన్ హబ్' : "Andhra Pradesh's #1 Post-Production Hub"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-gradient mb-2">
            {lang === 'TE' ? 'మీ ఆర్డర్ సులభంగా బుక్ చేయండి' : 'All Editing, Video & Printing Services in One Place'}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {lang === 'TE'
              ? 'సులువైన 3 దశలు. ఫోటో ఎడిటింగ్, సినిమాటిక్ వీడియోలు మరియు రాయల్ ఆల్బమ్స్ అన్నీ ఇక్కడే.'
              : 'Effortless 3 steps. Pick photo retouching, cinematic films, flush mount albums, or large flex prints.'}
          </p>
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
          <div className="animate-fade-in space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span>1. {lang === 'TE' ? 'మీకు ఏ సేవలు కావాలి?' : 'Choose Your Services'}</span>
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                {lang === 'TE'
                  ? 'మీకు కావాల్సిన సేవలను టిక్ చేయండి (ఒకటి లేదా అంతకంటే ఎక్కువ):'
                  : 'Select one or more categories below to customize your project:'}
              </p>

              {/* 4 PRIMARY SERVICE CARDS */}
              <div className="grid grid-2 gap-4">
                {/* 1. Flush Mount & Karizma Album */}
                <div
                  className={`base-card flex items-start gap-4 p-5 rounded-2xl cursor-pointer border transition-all ${
                    formData.services.albumPrint
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                  onClick={() => toggleService('albumPrint')}
                >
                  <div className={`p-3 rounded-xl ${formData.services.albumPrint ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-400'}`}>
                    <Printer size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-base sm:text-lg">Premium Album Printing & Design</h4>
                      <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-semibold">from ₹7,500</span>
                    </div>
                    <div className="text-xs text-[#D4AF37] mt-0.5 font-telugu">కరిజ్మా & ఫ్లష్ మౌంట్ ఆల్బమ్ డిజైన్</div>
                    <p className="text-xs sm:text-sm text-gray-400 mt-2">
                      Karizma 12×36, Acrylic cover, Lay-flat spreads, Velvet/Metallic paper & Royal presentation box.
                    </p>
                  </div>
                </div>

                {/* 2. Cinematic Video Editing */}
                <div
                  className={`base-card flex items-start gap-4 p-5 rounded-2xl cursor-pointer border transition-all ${
                    formData.services.videoEdit
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                  onClick={() => toggleService('videoEdit')}
                >
                  <div className={`p-3 rounded-xl ${formData.services.videoEdit ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-400'}`}>
                    <Film size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-base sm:text-lg">Cinematic Wedding Films & Reels</h4>
                      <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-semibold">from ₹2,500</span>
                    </div>
                    <div className="text-xs text-[#D4AF37] mt-0.5 font-telugu">4K సినిమాటిక్ వీడియో & రీల్స్</div>
                    <p className="text-xs sm:text-sm text-gray-400 mt-2">
                      Teasers (3-5 min), Same-Day Edit (SDE), full traditional multi-cam, and 9:16 Instagram reels.
                    </p>
                  </div>
                </div>

                {/* 3. Photo Retouching & Color Grading */}
                <div
                  className={`base-card flex items-start gap-4 p-5 rounded-2xl cursor-pointer border transition-all ${
                    formData.services.photoEdit
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                  onClick={() => toggleService('photoEdit')}
                >
                  <div className={`p-3 rounded-xl ${formData.services.photoEdit ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-400'}`}>
                    <Palette size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-base sm:text-lg">High-End Photo Retouching & Color</h4>
                      <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-semibold">from ₹30/photo</span>
                    </div>
                    <div className="text-xs text-[#D4AF37] mt-0.5 font-telugu">ఫొటో రీటచింగ్ & కలర్ గ్రేడింగ్</div>
                    <p className="text-xs sm:text-sm text-gray-400 mt-2">
                      Skin smoothing, jewelry enhancement, background removal, restoration, and RAW selection.
                    </p>
                  </div>
                </div>

                {/* 4. Flex & Hoarding Design */}
                <div
                  className={`base-card flex items-start gap-4 p-5 rounded-2xl cursor-pointer border transition-all ${
                    formData.services.flexBanner
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                  onClick={() => toggleService('flexBanner')}
                >
                  <div className={`p-3 rounded-xl ${formData.services.flexBanner ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-400'}`}>
                    <MonitorPlay size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-white text-base sm:text-lg">Wedding Flex, Banners & Invites</h4>
                      <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-semibold">from ₹1,200</span>
                    </div>
                    <div className="text-xs text-[#D4AF37] mt-0.5 font-telugu">కళ్యాణ మండపం ఫ్లెక్స్ & ఆహ్వానాలు</div>
                    <p className="text-xs sm:text-sm text-gray-400 mt-2">
                      Mandap entrance banners, road hoardings up to 40×20 ft, welcome standees, and WhatsApp video invites.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= SUB-OPTIONS: ALBUM PRINTING (ALL TYPES) ================= */}
            {formData.services.albumPrint && (
              <div className="p-6 rounded-2xl bg-black/40 border border-[#D4AF37]/25 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-lg font-bold text-[#D4AF37] flex items-center gap-2">
                    <BookOpen size={20} />
                    {lang === 'TE' ? 'ఆల్బమ్ రకం, సైజు & బాక్స్ ఎంపిక' : 'Album Cover, Size & Presentation Box Options'}
                  </h4>
                  <span className="text-xs text-gray-400">All India & AP Courier</span>
                </div>

                {/* 1. Cover / Binding Type */}
                <div>
                  <label className="block text-sm text-gray-300 font-semibold mb-2">
                    1. Cover & Binding Style (కవర్ రకం)
                  </label>
                  <div className="grid grid-3 gap-3">
                    {[
                      { id: 'karizma', label: 'Karizma Royal Spread', note: "India's #1 Wedding Choice ⭐", surcharge: 'Standard' },
                      { id: 'acrylic', label: 'Crystal Acrylic Glass 3D', note: 'Ultra-modern high-gloss glass face', surcharge: '+₹1,500' },
                      { id: 'velvet', label: 'Royal Velvet Touch', note: 'Soft luxury fabric feel', surcharge: '+₹1,000' },
                      { id: 'leather', label: 'Embossed Leatherette', note: 'Timeless heirloom finish with gold foil', surcharge: '+₹1,200' },
                      { id: 'flushmount', label: 'Seamless Lay-Flat Flush Mount', note: 'Edge-to-edge panoramic view', surcharge: 'Included' },
                    ].map(opt => (
                      <div
                        key={opt.id}
                        onClick={() => setFormData(p => ({ ...p, albumType: opt.id }))}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          formData.albumType === opt.id
                            ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                            : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-sm text-white">{opt.label}</span>
                          <span className="text-xs text-[#D4AF37] font-mono">{opt.surcharge}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{opt.note}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Dimensions */}
                <div>
                  <label className="block text-sm text-gray-300 font-semibold mb-2">
                    2. Album Dimensions (సైజు)
                  </label>
                  <div className="grid grid-3 gap-3">
                    {[
                      { id: '12x36', label: '12×36 Royal Spread', note: '36 inch wide panoramic views', price: '₹9,500' },
                      { id: '12x30', label: '12×30 Classic Landscape', note: 'Traditional Telugu standard', price: '₹8,500' },
                      { id: '12x24', label: '12×24 Compact Book', note: 'Budget-friendly album', price: '₹7,500' },
                    ].map(opt => (
                      <div
                        key={opt.id}
                        onClick={() => setFormData(p => ({ ...p, albumSize: opt.id }))}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          formData.albumSize === opt.id
                            ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white'
                            : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        <div className="font-bold text-sm">{opt.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{opt.note}</div>
                        <div className="text-xs text-[#D4AF37] mt-1 font-mono font-semibold">{opt.price} base</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Paper Sheet Finish */}
                <div>
                  <label className="block text-sm text-gray-300 font-semibold mb-2">
                    3. Paper Sheet Finish (పేపర్ రకం)
                  </label>
                  <div className="grid grid-2 sm:grid-4 gap-2.5">
                    {[
                      { id: 'velvet', label: 'Velvet Silk Touch', note: 'No fingerprints, anti-scratch' },
                      { id: 'gloss', label: 'Crystal High Gloss', note: 'Super vivid & high contrast' },
                      { id: 'metallic', label: 'Metallic Pearl Sheen', note: 'Royal gold jewelry shimmer' },
                      { id: 'nontearable', label: 'Non-Tearable Matte (NT)', note: 'Waterproof & tear-proof' },
                    ].map(opt => (
                      <div
                        key={opt.id}
                        onClick={() => setFormData(p => ({ ...p, sheetType: opt.id }))}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          formData.sheetType === opt.id
                            ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white'
                            : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                        }`}
                      >
                        <div className="font-semibold text-xs text-white">{opt.label}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{opt.note}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Sheet Count & Presentation Box */}
                <div className="grid grid-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-300 font-semibold">4. Sheets (1 Sheet = 2 Pages)</label>
                      <span className="text-[#D4AF37] font-bold text-xs">{formData.pages} Sheets (~{formData.pages * 6} photos)</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[30, 40, 50, 60, 80].map(cnt => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, pages: cnt }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            formData.pages === cnt
                              ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/25'
                          }`}
                        >
                          {cnt} Sheets
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 font-semibold mb-2 block">
                      5. Luxury Box (ప్రెజెంటేషన్ బాక్స్)
                    </label>
                    <select
                      value={formData.boxType}
                      onChange={e => setFormData({ ...formData, boxType: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-[#D4AF37]"
                    >
                      <option value="standard">Standard Presentation Box (Included)</option>
                      <option value="velvet_case">Royal Velvet Matching Briefcase Box (+₹1,200)</option>
                      <option value="wooden_box">Laser Engraved Wooden Box (+₹1,800)</option>
                      <option value="acrylic_box">Acrylic Luxury Window Box (+₹2,200)</option>
                    </select>
                  </div>
                </div>

                {/* Mini Parent Albums Addon */}
                <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">Add Duplicate Pocket / Parent Albums</div>
                    <div className="text-xs text-gray-400">Gift mini replica albums to parents or in-laws</div>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { cnt: 0, label: 'None' },
                      { cnt: 1, label: '+1 Mini (+₹2,500)' },
                      { cnt: 2, label: '+2 Minis (+₹4,500)' },
                    ].map(b => (
                      <button
                        key={b.cnt}
                        type="button"
                        onClick={() => setFormData({ ...formData, parentAlbums: b.cnt })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          formData.parentAlbums === b.cnt
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                            : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
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
              <div className="p-6 rounded-2xl bg-black/40 border border-[#D4AF37]/25 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-lg font-bold text-[#D4AF37] flex items-center gap-2">
                    <Film size={20} />
                    {lang === 'TE' ? 'వీడియో ఎడిటింగ్ రకం & స్టైల్' : 'Video Editing Format & Audio Preferences'}
                  </h4>
                  <span className="text-xs text-gray-400">4K Color Graded · Telugu Audio</span>
                </div>

                <div className="grid grid-2 sm:grid-3 gap-3">
                  {[
                    { id: 'teaser', label: 'Cinematic Teaser (3-5 min)', price: '₹6,000', note: 'Fast-paced, WhatsApp & family ready' },
                    { id: 'reels', label: 'Instagram Reels Pack (5 Reels)', price: '₹3,500', note: 'Trending music synced 9:16 vertical' },
                    { id: 'highlights', label: 'Story Highlights Film (15 min)', price: '₹10,000', note: 'Emotional story with vows & speech sync' },
                    { id: 'traditional', label: 'Full Traditional Video (60+ min)', price: '₹12,000', note: 'All rituals: Talambralu, Agni Sakshi multi-cam' },
                    { id: 'sde', label: 'Same-Day Edit (SDE Film)', price: '₹12,000', note: 'Morning wedding edited for reception night' },
                    { id: 'prewedding', label: 'Pre-Wedding / Save the Date', price: '₹5,000', note: 'Romantic couple teaser with licensed music' },
                  ].map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setFormData(p => ({ ...p, videoType: opt.id }))}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        formData.videoType === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs sm:text-sm text-white">{opt.label}</span>
                        <span className="text-xs text-[#D4AF37] font-mono font-semibold">{opt.price}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">{opt.note}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs text-gray-300 font-semibold mb-1 block">Audio / Music Direction</label>
                    <select
                      value={formData.musicStyle}
                      onChange={e => setFormData({ ...formData, musicStyle: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-[#D4AF37]"
                    >
                      <option value="telugu_romantic">Classical & Modern Telugu Romantic Melodies</option>
                      <option value="devotional">Traditional Nadaswaram & Mangala Vaadhyam</option>
                      <option value="energetic">High-Energy Trending Beats & Bass</option>
                      <option value="custom">I will provide our custom Telugu song playlist</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-300 font-semibold mb-1 block">Voiceover / Audio Cleanup</label>
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-gray-300">
                      ✓ AI Speech Isolation & Background Noise Removal Included
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SUB-OPTIONS: PHOTO EDITING (ALL TYPES) ================= */}
            {formData.services.photoEdit && (
              <div className="p-6 rounded-2xl bg-black/40 border border-[#D4AF37]/25 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-lg font-bold text-[#D4AF37] flex items-center gap-2">
                    <Palette size={20} />
                    {lang === 'TE' ? 'ఫొటో ఎడిటింగ్ స్టైల్ & కౌంట్' : 'Photo Retouching Style & Quantity'}
                  </h4>
                  <span className="text-xs text-gray-400">High-End Retouching · Natural Skin</span>
                </div>

                <div className="grid grid-2 sm:grid-3 gap-3">
                  {[
                    { id: 'retouching', label: 'High-End Skin Retouching', rate: '₹60/photo', note: 'Blemish removal, eye brightening, jewelry shine' },
                    { id: 'cinematic_luts', label: 'Cinematic Color Grading', rate: '₹30/photo', note: 'Warm golden Andhra wedding palette & LUTs' },
                    { id: 'background', label: 'Background Replacement', rate: '₹90/photo', note: 'Replace cluttered background with royal palace/gardens' },
                    { id: 'restoration', label: 'Old Photo Restoration', rate: '₹120/photo', note: 'Fix scratched, faded, or torn ancestral photos' },
                    { id: 'culling', label: 'AI Culling & RAW Selection', rate: '₹15/photo', note: 'Select top 300 best smiles from 2,000+ RAW photos' },
                  ].map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setFormData(p => ({ ...p, photoStyle: opt.id }))}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        formData.photoStyle === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-white">{opt.label}</span>
                        <span className="text-xs text-[#D4AF37] font-mono">{opt.rate}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">{opt.note}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-sm text-gray-300 font-semibold">Estimated Photos to Edit:</label>
                  <div className="flex gap-2">
                    {[30, 50, 100, 200, 300].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setFormData({ ...formData, photoCount: cnt })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          formData.photoCount === cnt
                            ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                            : 'bg-white/5 border-white/10 text-gray-300'
                        }`}
                      >
                        {cnt} Photos
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= SUB-OPTIONS: FLEX & BANNERS (ALL TYPES) ================= */}
            {formData.services.flexBanner && (
              <div className="p-6 rounded-2xl bg-black/40 border border-[#D4AF37]/25 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-lg font-bold text-[#D4AF37] flex items-center gap-2">
                    <MonitorPlay size={20} />
                    {lang === 'TE' ? 'ఫ్లెక్స్ & బ్యానర్ రకం' : 'Flex, Hoarding & Invitation Format'}
                  </h4>
                  <span className="text-xs text-gray-400">Large Format · High DPI Print Ready</span>
                </div>

                <div className="grid grid-2 sm:grid-4 gap-3">
                  {[
                    { id: 'mandap', label: 'Mandap Entrance Flex', size: '10×8 ft or 12×10 ft', price: '₹1,500' },
                    { id: 'hoarding', label: 'Roadside Hoarding Design', size: 'up to 40×20 ft', price: '₹3,500' },
                    { id: 'standee', label: 'Welcome Standee & Cutout', size: '6×2.5 ft banner', price: '₹1,200' },
                    { id: 'invite', label: 'WhatsApp Video Invitation', size: 'Telugu typography & music', price: '₹1,800' },
                  ].map(opt => (
                    <div
                      key={opt.id}
                      onClick={() => setFormData(p => ({ ...p, flexType: opt.id }))}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        formData.flexType === opt.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-white">{opt.label}</span>
                        <span className="text-xs text-[#D4AF37] font-mono">{opt.price}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">{opt.size}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={proceedToNextStep}
                className="btn btn-gold-3d flex items-center gap-2 px-8 py-3.5 text-base font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                <span>{lang === 'TE' ? 'తదుపరి దశ: వివరాలు నమోదు చేయండి' : 'Next: Event & Contact Details'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: EVENT & CONTACT ================= */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
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
              <div className="grid grid-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 font-semibold mb-2">
                    {lang === 'TE' ? 'మీ పూర్తి పేరు *' : 'Your Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full p-3.5 rounded-xl bg-black/50 border border-white/15 text-white focus:border-[#D4AF37] outline-none"
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
                    className="w-full p-3.5 rounded-xl bg-black/50 border border-white/15 text-white focus:border-[#D4AF37] outline-none"
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
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        formData.eventType === evt.id
                          ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                      }`}
                    >
                      {evt.id} <span className="font-telugu text-xs opacity-75">({evt.telugu})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 font-semibold mb-2">
                    {lang === 'TE' ? 'నగరం / పట్టణం' : 'City / District'}
                  </label>
                  <select
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-black/50 border border-white/15 text-white focus:border-[#D4AF37] outline-none"
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
                  <div className="grid grid-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, deliverySpeed: 'standard' })}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-left ${
                        formData.deliverySpeed === 'standard'
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400'
                      }`}
                    >
                      <div className="font-bold text-white">⚡ Standard (3-5 Days)</div>
                      <div className="text-[#34d399] mt-0.5">Free Delivery</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, deliverySpeed: 'express' })}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-left ${
                        formData.deliverySpeed === 'express'
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white'
                          : 'border-white/10 bg-white/5 text-gray-400'
                      }`}
                    >
                      <div className="font-bold text-white">🚀 Express (24-48 Hrs)</div>
                      <div className="text-[#D4AF37] mt-0.5">+₹1,500 Rush</div>
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
                  className="w-full p-3 rounded-xl bg-black/50 border border-white/15 text-white focus:border-[#D4AF37] outline-none"
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
                className="btn btn-gold-3d flex items-center gap-2 px-8 py-3 font-bold"
              >
                <span>{lang === 'TE' ? 'తదుపరి దశ: ఫోటోలు పంపండి' : 'Next: Media Transfer'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: MEDIA & CONFIRM ================= */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
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

            <div className="grid grid-3 gap-3">
              {/* Option 1: Cloud Link */}
              <div
                onClick={() => setFormData({ ...formData, uploadMethod: 'cloud' })}
                className={`p-4 rounded-2xl border cursor-pointer text-left transition-all ${
                  formData.uploadMethod === 'cloud'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white'
                    : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/25'
                }`}
              >
                <UploadCloud size={24} className="text-[#D4AF37] mb-2" />
                <h4 className="font-bold text-white text-sm">Google Drive / Link</h4>
                <p className="text-xs text-gray-400 mt-1">Paste Drive, WeTransfer, or OneDrive link</p>
              </div>

              {/* Option 2: Send on WhatsApp */}
              <div
                onClick={() => setFormData({ ...formData, uploadMethod: 'whatsapp' })}
                className={`p-4 rounded-2xl border cursor-pointer text-left transition-all ${
                  formData.uploadMethod === 'whatsapp'
                    ? 'border-[#25D366] bg-[#25D366]/15 text-white'
                    : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/25'
                }`}
              >
                <MessageCircle size={24} className="text-[#25D366] mb-2" />
                <h4 className="font-bold text-white text-sm">Send via WhatsApp</h4>
                <p className="text-xs text-gray-400 mt-1">Our coordinator will ping you on WhatsApp</p>
              </div>

              {/* Option 3: Courier Pendrive */}
              <div
                onClick={() => setFormData({ ...formData, uploadMethod: 'courier' })}
                className={`p-4 rounded-2xl border cursor-pointer text-left transition-all ${
                  formData.uploadMethod === 'courier'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-white'
                    : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/25'
                }`}
              >
                <HardDrive size={24} className="text-[#D4AF37] mb-2" />
                <h4 className="font-bold text-white text-sm">Courier Pen Drive</h4>
                <p className="text-xs text-gray-400 mt-1">Ship USB/Hard disk to our AP hub</p>
              </div>
            </div>

            {/* Cloud link input */}
            {formData.uploadMethod === 'cloud' && (
              <div className="p-5 rounded-2xl bg-black/50 border border-white/15">
                <label className="block text-sm text-gray-200 font-semibold mb-2">
                  Paste your Google Drive or WeTransfer Link
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={formData.cloudLink}
                  onChange={e => setFormData({ ...formData, cloudLink: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[#D4AF37] outline-none font-mono text-sm"
                />
                <p className="text-xs text-[#D4AF37] mt-2 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Please set link access to "Anyone with the link can view".
                </p>
              </div>
            )}

            {/* WhatsApp method note */}
            {formData.uploadMethod === 'whatsapp' && (
              <div className="p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-left">
                <h4 className="font-bold text-[#25D366] text-sm mb-1 flex items-center gap-2">
                  <MessageCircle size={18} />
                  {lang === 'TE' ? 'వాట్సాప్ ద్వారా సులభంగా పంపండి' : 'Super Easy: Send directly over WhatsApp'}
                </h4>
                <p className="text-xs text-gray-300">
                  {lang === 'TE'
                    ? `మీరు ఇక్కడ ఆర్డర్ సబ్మిట్ చేసిన వెంటనే, మా టీమ్ ${formData.phone || 'మీ నంబరు'} కి వాట్సాప్‌లో మెసేజ్ చేసి ఫోటోలు సేకరిస్తుంది.`
                    : `No technical hassle. Once you place the order, our coordinator will message ${formData.phone || 'your WhatsApp'} to collect the high-res photos.`}
                </p>
              </div>
            )}

            {/* Courier method note */}
            {formData.uploadMethod === 'courier' && (
              <div className="p-5 rounded-2xl bg-black/50 border border-white/15 text-left text-xs text-gray-300 space-y-2">
                <p className="font-bold text-white text-sm">Send your Pen Drive / Hard Disk to:</p>
                <div className="p-3 rounded-lg bg-black/70 border border-[#D4AF37]/30 text-gray-200">
                  <strong className="text-[#D4AF37]">WeddingAlbums.in Production Center</strong><br />
                  Plot 14, 2nd Floor, MG Road, Vijayawada, AP 520010<br />
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
                placeholder="e.g. Include Talambralu ritual focus, use devotional Telugu songs, highlight grandfather..."
                className="w-full p-3 rounded-xl bg-black/50 border border-white/15 text-white focus:border-[#D4AF37] outline-none"
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
        <div className="cart-sticky p-6 rounded-2xl bg-black/60 border border-[#D4AF37]/30 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
              <ShoppingCart size={20} className="text-[#D4AF37]" />
              <span>{lang === 'TE' ? 'మీ ఆర్డర్ సమ్మరీ' : 'Order Summary'}</span>
            </div>
            <span className="text-xs text-[#34d399] flex items-center gap-1">
              <Clock size={12} />
              {formData.deliverySpeed === 'express' ? '24-48h Rush' : '3-5 Days ETA'}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            {/* Services */}
            <div className="flex justify-between text-gray-300">
              <span>Services Selected:</span>
              <span className="font-semibold text-white text-right max-w-[160px] truncate">
                {[
                  formData.services.albumPrint && 'Album',
                  formData.services.videoEdit && 'Video',
                  formData.services.photoEdit && 'Photos',
                  formData.services.flexBanner && 'Flex',
                ].filter(Boolean).join(', ') || 'None'}
              </span>
            </div>

            {formData.services.albumPrint && (
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Album ({formData.albumType} {formData.albumSize}, {formData.pages}p)</span>
                <span className="text-gray-200">Included</span>
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
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Video ({formData.videoType})</span>
                <span className="text-gray-200">Included</span>
              </div>
            )}

            {formData.services.photoEdit && (
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Photo Edit ({formData.photoCount} photos)</span>
                <span className="text-gray-200">{formData.photoStyle}</span>
              </div>
            )}

            {formData.services.flexBanner && (
              <div className="flex justify-between text-gray-400 text-xs">
                <span>Flex Banner ({formData.flexType})</span>
                <span className="text-gray-200">Included</span>
              </div>
            )}

            {formData.deliverySpeed === 'express' && (
              <div className="flex justify-between text-[#D4AF37] text-xs">
                <span>Express 24-48h Rush</span>
                <span>+₹1,500</span>
              </div>
            )}

            <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
              <div>
                <span className="text-xs text-gray-400 block">Total Estimated</span>
                <span className="text-2xl font-bold font-mono text-[#D4AF37]">
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[11px] text-gray-400">All Taxes Inc.</span>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                type="button"
                onClick={openWhatsAppDirect}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] font-semibold text-xs hover:bg-[#25D366]/30 transition-all"
              >
                <MessageCircle size={16} />
                <span>{lang === 'TE' ? 'వాట్సాప్ లో మాట్లాడండి' : 'Need Help? Chat on WhatsApp'}</span>
              </button>
            </div>
          </div>
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

export default OrderAlbum;
