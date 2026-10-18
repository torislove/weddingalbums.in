import React, { useState } from 'react';
import { 
  Eye, Save, Monitor, Smartphone, Sparkles, Check, AlertCircle, 
  Plus, Trash2, Image as ImageIcon, Layers, BookOpen, 
  Video, Gift, ExternalLink, RefreshCw, Sliders, CheckCircle2, 
  Flame, Clock, ShieldCheck, IndianRupee, Tag, Info, ChevronDown,
  Building2, Scissors, Palette, Film, Award, Megaphone, DollarSign,
  Home, Phone, Globe, MessageSquare, Briefcase, Mail, MapPin, 
  Heart, Camera, ArrowRight, Shield, Zap, UploadCloud, SlidersHorizontal,
  Star, CheckSquare, ShoppingBag, PenTool
} from 'lucide-react';
import { CLIENT_URL, OPS_URL } from '../config/urls';
import PointOfUseImageUploader from '../components/PointOfUseImageUploader';

const B2B_URL = 'http://localhost:5174';
const EDITOR_URL = 'http://localhost:5176';

export default function VisualLiveEditor({ adminState }) {
  const { content, updateGlobal, updatePage, setContent, saveContent, isDirty, saving } = adminState;
  
  // ── Master Display Mode: 'editor' (Visual in-place editable canvas) | 'live' (Embedded 1:1 running website) ──
  const [viewMode, setViewMode] = useState('editor');

  // ── Master Domain / Portal Selection ───────────────────────────────────────
  // 'b2c' (Client Portal & Storefront) | 'b2b' (Studio Trade Portal) | 'editor' (Lab Production Workbench)
  const [activePortal, setActivePortal] = useState('b2c');

  // ── Sub-page Selections per Portal ─────────────────────────────────────────
  // B2C pages: 'home' | 'shop' | 'about' | 'services' | 'contact' | 'global'
  const [b2cPage, setB2cPage] = useState('home');
  const [b2cCategory, setB2cCategory] = useState('all'); // for shop
  const [servicesTab, setServicesTab] = useState('photo-editing'); // for services
  const [orientationFilter, setOrientationFilter] = useState('all'); // for shop album sizes

  // B2B pages: 'landing' | 'wholesale'
  const [b2bPage, setB2bPage] = useState('landing');

  // Editor pages: 'onboarding' | 'payouts'
  const [editorPage, setEditorPage] = useState('onboarding');

  // ── Global Canvas Settings ─────────────────────────────────────────────────
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'mobile'
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [iframeKey, setIframeKey] = useState(0);

  // ── SAFELY EXTRACT ALL CONTENT SECTIONS WITH DEEP FALLBACKS ────────────────
  const catalog = content?.global?.servicesCatalog || content?.servicesCatalog || {
    hubBanner: {
      eyebrow: "✦ ANDHRA PRADESH & TELANGANA #1 POST-PRODUCTION & PRINT LAB ✦",
      eyebrowTel: "ఆంధ్రప్రదేశ్ & తెలంగాణ నెం.1 పోస్ట్ ప్రొడక్షన్ & ప్రింట్ ల్యాబ్",
      title: "Complete Wedding Media Storefront for Couples & Elite Studios",
      titleTel: "కపుల్స్ & స్టూడియోల కోసం పూర్తి వెడ్డింగ్ మీడియా స్టోర్‌ఫ్రంట్",
      subtitle: "Transparent Per-Sheet pricing on all album sizes, Netflix-grade cinematic video editing, animated WhatsApp invitations, and heavy-duty event flex."
    },
    photoEditing: [],
    videoEditing: [],
    albumPrinting: { sheetStyles: [], albumSizes: [] },
    invitationsAndFlex: [],
    bundles: []
  };

  const b2bData = content?.global?.b2bPortal || content?.b2bPortal || {
    landingHero: {
      eyebrow: "✦ FOR COMMERCIAL WEDDING STUDIOS & LAB PARTNERS ✦",
      title: "The Invisible Engine For Elite Studios",
      subtitle: "Offload your post-production to a 20-member dedicated team. We edit, we design, we print. You shoot and scale.",
      stats: [
        { value: "120+", label: "Partner Studios" },
        { value: "24-48h", label: "Express Lab Dispatch" },
        { value: "40%", label: "Higher Studio Margins" }
      ],
      partnerCtaText: "Partner With Us"
    },
    announcements: [
      {
        id: "b2b-ann-1",
        tag: "⚡ EXPRESS DISPATCH",
        title: "Muhurtham Season Priority Turnaround Active",
        desc: "All 12×36 and 18×12 album orders submitted before 2 PM dispatched within 48 hours with complimentary white-label packing."
      }
    ]
  };

  const editorData = content?.global?.editorPortal || content?.editorPortal || {
    landingHero: {
      eyebrow: "✦ AUTHORIZED LAB PRODUCTION WORKBENCH ✦",
      title: "Craft Royal Heirloom Albums & 4K Wedding Cinema",
      subtitle: "Authorized workbench for WeddingAlbums.in's certified colorists, retouchers, and album layout specialists.",
      technicianCtaText: "Technician Onboarding"
    },
    announcements: [
      {
        id: "ed-ann-1",
        tag: "🎨 COLOR PIPELINE",
        title: "DaVinci Resolve ACES Color Science Mandatory",
        desc: "Ensure all video color grading adheres to Rec.709 / ACEScct pipeline for calibrated HP Indigo and OLED print-to-video harmony."
      }
    ],
    productionPayouts: [
      {
        id: "pay-karizma",
        role: "Album Layout Designer",
        task: "12×36 / 18×12 Karizma Spread Layout",
        rate: 60,
        unit: "per spread / sheet",
        turnaround: "24h SLA",
        badge: "Core Volume"
      },
      {
        id: "pay-retouch",
        role: "Master Retoucher",
        task: "RAW Skin Texture Retouching & Lighting Clean-up",
        rate: 15,
        unit: "per approved photo",
        turnaround: "12h SLA",
        badge: "High Demand"
      },
      {
        id: "pay-video-teaser",
        role: "Cinematographer / Editor",
        task: "3-5 Min 4K Cinematic Teaser / Reel Pack",
        rate: 1500,
        unit: "per completed film",
        turnaround: "48h SLA",
        badge: "Premium"
      },
      {
        id: "pay-video-doc",
        role: "Senior Video Editor",
        task: "45 Min / 1 Hr Traditional Ceremony Documentary",
        rate: 4500,
        unit: "per completed master",
        turnaround: "72h SLA",
        badge: "Major Project"
      },
      {
        id: "pay-flex-invite",
        role: "Motion Graphic Designer",
        task: "60s Animated WhatsApp Video Invitation",
        rate: 500,
        unit: "per invitation",
        turnaround: "24h SLA",
        badge: "Quick Turn"
      }
    ]
  };

  const homeBlocks = content?.pages?.home || [];
  const aboutBlocks = content?.pages?.about || [];
  
  // Harmonized Contact & Global Site Information
  const siteSettings = content?.global?.siteSettings || {};
  const globalNavbar = content?.global?.navbar || {};
  const globalFooter = content?.global?.footer || {};

  const currentPhone = siteSettings.phone || globalNavbar.phone || globalFooter.phone || '+91 94948 45111';
  const currentEmail = siteSettings.email || globalNavbar.email || globalFooter.email || 'orders@weddingalbums.in';
  const currentAddress = siteSettings.address || globalFooter.address || 'Door No. 4-12-88, Ring Road, Near Collectorate, Guntur - 522006, AP';
  const currentWhatsapp = siteSettings.whatsapp || '919494845111';

  const albumSizes = catalog.albumPrinting?.albumSizes || [];
  const sheetStyles = catalog.albumPrinting?.sheetStyles || [];
  const photoServices = catalog.photoEditing || [];
  const videoServices = catalog.videoEditing || [];
  const flexServices = catalog.invitationsAndFlex || [];
  const bundleServices = catalog.bundles || [];

  // ── UNIFIED ATOMIC CONTACT UPDATER (SYNCHRONIZES SITESETTINGS, NAVBAR, FOOTER & CONTACT) ──
  const updateContactInfo = (key, value) => {
    const cleanVal = key === 'whatsapp' ? String(value).replace(/[^0-9]/g, '') : value;
    const currentG = content?.global || {};
    const updatedSettings = { ...(currentG.siteSettings || {}), [key]: value };
    const updatedFooter = { ...(currentG.footer || {}) };
    const updatedNavbar = { ...(currentG.navbar || {}) };
    const updatedContact = { ...(currentG.contact || {}) };

    if (key === 'phone') {
      updatedSettings.phone = value;
      updatedFooter.phone = value;
      updatedNavbar.phone = value;
      updatedContact.phone = value;
    } else if (key === 'email') {
      updatedSettings.email = value;
      updatedFooter.email = value;
      updatedNavbar.email = value;
      updatedContact.email = value;
    } else if (key === 'address') {
      updatedSettings.address = value;
      updatedFooter.address = value;
      updatedContact.address = value;
    } else if (key === 'whatsapp') {
      updatedSettings.whatsapp = cleanVal;
      updatedFooter.whatsapp = cleanVal;
      updatedNavbar.whatsapp = cleanVal;
      updatedContact.whatsapp = cleanVal;
    }

    const newContent = {
      ...(content || { pages: {}, global: {} }),
      global: {
        ...currentG,
        siteSettings: updatedSettings,
        footer: updatedFooter,
        navbar: updatedNavbar,
        contact: updatedContact
      }
    };

    if (setContent) {
      setContent(newContent);
    }
  };

  // ── UNIFIED STATE UPDATERS ─────────────────────────────────────────────────
  const handleCatalogUpdate = (newCatalog) => {
    updateGlobal('servicesCatalog', newCatalog);
    if (setContent && content) {
      setContent({
        ...content,
        servicesCatalog: newCatalog,
        global: { ...(content.global || {}), servicesCatalog: newCatalog }
      });
    }
  };

  const handleB2bUpdate = (newB2b) => {
    updateGlobal('b2bPortal', newB2b);
    if (setContent && content) {
      setContent({
        ...content,
        b2bPortal: newB2b,
        global: { ...(content.global || {}), b2bPortal: newB2b }
      });
    }
  };

  const handleEditorUpdate = (newEditor) => {
    updateGlobal('editorPortal', newEditor);
    if (setContent && content) {
      setContent({
        ...content,
        editorPortal: newEditor,
        global: { ...(content.global || {}), editorPortal: newEditor }
      });
    }
  };

  const handlePageUpdate = (pageId, newBlocks) => {
    updatePage(pageId, newBlocks);
    if (setContent && content) {
      setContent({
        ...content,
        pages: { ...(content.pages || {}), [pageId]: newBlocks }
      });
    }
  };

  const BLOCK_ALIASES = {
    'Craftsmanship': ['Craftsmanship', 'CraftsmanshipDetails'],
    'CraftsmanshipDetails': ['CraftsmanshipDetails', 'Craftsmanship'],
    'TeluguRituals': ['TeluguRituals', 'RitualsScroll'],
    'RitualsScroll': ['RitualsScroll', 'TeluguRituals'],
    'Testimonials': ['Testimonials', 'TestimonialsCarousel'],
    'TestimonialsCarousel': ['TestimonialsCarousel', 'Testimonials'],
    'StudioCtaBanner': ['StudioCtaBanner', 'CTABanner'],
    'CTABanner': ['CTABanner', 'StudioCtaBanner'],
  };

  const findHomeBlock = (blocks, blockType) => {
    const list = Array.isArray(blocks) ? blocks : [];
    const checkTypes = BLOCK_ALIASES[blockType] || [blockType];
    return list.find(b => checkTypes.includes(b.type));
  };

  const updateHomeBlockProp = (blockType, propKey, value) => {
    const updated = JSON.parse(JSON.stringify(homeBlocks));
    let target = findHomeBlock(updated, blockType);
    if (!target) {
      target = { id: `block-${blockType.toLowerCase()}-${Date.now()}`, type: blockType, props: {} };
      updated.push(target);
    }
    if (!target.props) target.props = {};
    target.props[propKey] = value;
    if (propKey === 'title' && (target.type === 'CTABanner' || target.type === 'StudioCtaBanner')) {
      target.props.titlePart1 = value;
    }
    handlePageUpdate('home', updated);
  };

  const updateAboutBlockProp = (blockType, propKey, value) => {
    const updated = JSON.parse(JSON.stringify(aboutBlocks));
    let target = updated.find(b => b.type === blockType);
    if (!target) {
      target = { id: `block-about-${blockType.toLowerCase()}-${Date.now()}`, type: blockType, props: {} };
      updated.push(target);
    }
    if (!target.props) target.props = {};
    target.props[propKey] = value;
    handlePageUpdate('about', updated);
  };

  // ── 1-CLICK INSTANT PUBLISH ────────────────────────────────────────────────
  const handlePublish = async () => {
    if (saveContent) {
      setPublishError('');
      const ok = await saveContent();
      if (ok) {
        setPublishSuccess(true);
        setTimeout(() => setPublishSuccess(false), 4000);
      } else {
        setPublishError('Failed to save to server. Check server console.');
        setTimeout(() => setPublishError(''), 5000);
      }
    }
  };

  // Filter album sizes by orientation
  const filteredAlbumSizes = albumSizes.filter(s => {
    if (orientationFilter === 'all') return true;
    return s.orientation === orientationFilter;
  });

  const getLivePreviewUrl = () => {
    if (activePortal === 'b2b') {
      return b2bPage === 'wholesale' ? `${B2B_URL}/catalog` : B2B_URL;
    }
    if (activePortal === 'editor') {
      return editorPage === 'payouts' ? `${EDITOR_URL}/payouts` : EDITOR_URL;
    }
    if (b2cPage === 'shop') return `${CLIENT_URL}/shop`;
    if (b2cPage === 'about') return `${CLIENT_URL}/about`;
    if (b2cPage === 'services') return `${CLIENT_URL}/services`;
    if (b2cPage === 'contact') return `${CLIENT_URL}/contact`;
    return `${CLIENT_URL}/`;
  };

  // ── HELPER DATA LOOKUPS FOR LIVING HOME PAGE ───────────────────────────────
  const heroBlock = homeBlocks.find(b => b.type === 'Hero')?.props || {
    eyebrow: '✦ weddingalbums.in ✦',
    titlePart1: 'Wedding Albums & Video',
    titleScramble: 'Per-Sheet Pricing · Storefront & Studio',
    subtitle: 'Andhra Pradesh & Telangana #1 hub for couples & photo studios. Transparent Per-Sheet pricing across all Landscape & Portrait album sizes, 4K video editing, animated invites & flex.',
    btn1Text: 'Browse All Products & Prices',
    btn1Link: '/shop',
    btn2Text: 'Per-Sheet Price Calculator',
    btn2Link: '/shop',
    bgImage: '/images/opt/weddingalbums-home-herow1600.webp'
  };

  const marqueeItems = homeBlocks.find(b => b.type === 'MarqueeTicker')?.props?.items || [
    '👑 Album Editing + Printing Combined',
    '↔️ 12×36 Royal Panoramic (from ₹260/sh · Studio ₹180/sh)',
    '↕️ 18×12 Grand Vertical Magazine (from ₹240/sh · Studio ₹165/sh)',
    '💎 4mm Crystal Acrylic 3D Glass & Royal Velvet Covers',
    '🧻 100% Waterproof Non-Tear Core (₹0 Standard)',
    '🎬 4K Cinematic Teasers & Instagram Reels 5-Pack',
    '⚡ Up to 40% Studio Wholesale Trade Discount'
  ];

  const statsList = homeBlocks.find(b => b.type === 'StatsBar')?.props?.stats || [
    { target: 40000, suffix: '+', label: 'Albums Printed' },
    { target: 25, suffix: '+', label: 'In-House Staff' },
    { target: 12, suffix: '+', label: 'Years of Excellence' },
    { target: 28, suffix: '', label: 'Cities Across AP & TG' }
  ];

  const vp = homeBlocks.find(b => b.type === 'VisualPillarsShowcase')?.props || {};
  const pillarsList = vp.pillars || [
    {
      number: '01',
      badge: '100% Lay-Flat Binding · Non-Tearable Archival Core',
      title: 'Heirloom Karizma & Lay-Flat Albums',
      telugu: 'కరిజ్మా & లే-ఫ్లాట్ వెడ్డింగ్ ఆల్బమ్స్',
      subtitle: 'Printed on state-of-the-art European digital presses with archival inks guaranteed to retain rich color fidelity for 100+ years.',
      image: '/images/opt/luxury-album-craftsmanshipw800.webp',
      features: [
        '12×36 Royal Panoramic spreads with seamless zero-gutter binding',
        '4mm diamond-polished Crystal Acrylic 3D glass covers',
        'Plush Royal Velvet Touch fabric covers with gold foil typography',
        'Non-Tearable (NT) waterproof synthetic composite core sheets'
      ]
    },
    {
      number: '02',
      badge: 'Netflix-Grade Color Grading · Licensed Telugu Audio',
      title: '4K Cinematic Wedding Films & Reels',
      telugu: '4K సినిమాటిక్ వీడియో ఎడిటింగ్ & రీల్స్',
      subtitle: 'Story-driven post-production crafted specifically for Telugu rituals, highlighting vows, emotional moments, and family traditions.',
      image: '/images/opt/cinematic-video-suitew800.webp',
      features: [
        'Multi-camera ceremony synchronization (Talambralu, Mangala Snanam, Jeelakarra)',
        'Cinematic LUT-based warm golden color grading & noise reduction',
        'Audio mixing with licensed Mangala Vaadhyam, classical & trending Telugu scores',
        '5-Pack viral 9:16 vertical Instagram Reels & YouTube Shorts included'
      ]
    },
    {
      number: '03',
      badge: 'Micro-Pore Preservation · 24K Gold Jewelry Specular Shine',
      title: 'High-End Photo Retouching & Color Correction',
      telugu: 'హై-ఎండ్ ఫొటో రీటచింగ్ & కలర్ గ్రేడింగ్',
      subtitle: 'No cheap blur filters. Our 20-member unit performs high-end frequency separation to preserve authentic skin micro-texture while perfecting tones.',
      image: '/images/opt/weddingalbums-talambraluw800.webp',
      features: [
        'Natural skin retouching eliminating blemishes while preserving authentic texture',
        'Specular highlight boost on 22K/24K temple gold and diamond jewelry',
        'Vibrant color restoration for Kanjeevaram and Dharmavaram silk sarees',
        'Mandap venue cleanup: removal of distracting cables, clutter & harsh shadows'
      ]
    }
  ];

  const beforeAfterProps = homeBlocks.find(b => b.type === 'InteractiveBeforeAfter')?.props || {
    eyebrow: '✦ 100% IN-HOUSE RETOUCHING EXCELLENCE ✦',
    title: 'The Art of Telugu Wedding Retouching',
    subtitle: 'See the difference between a raw camera capture and our master color-graded heirloom finish.',
    rawImage: '/images/opt/bride-raww800.webp',
    polishedImage: '/images/opt/bride-polishedw800.webp',
    rawLabel: 'RAW Unedited (DSLR Sensor)',
    polishedLabel: 'Master Polished (22K Gold Luster)',
    ctaText: 'Book Retouching Consultation'
  };

  const craftBlockObj = findHomeBlock(homeBlocks, 'Craftsmanship');
  const craftsmanshipProps = craftBlockObj?.props || {
    eyebrow: '✦ OBSESSIVE ATTENTION TO DETAIL ✦',
    title: 'Anatomy of an Heirloom Wedding Album',
    subtitle: 'Every volume is precision-assembled by master bookbinders using archival-grade materials built to outlast generations.',
    cards: [
      { title: '180° Zero-Gutter Layflat', desc: 'Continuous photographic panoramic spread across two full pages.' },
      { title: '4mm Crystal Acrylic 3D', desc: 'Diamond-cut beveled glass cover offering 3D depth and scratch resistance.' },
      { title: 'Waterproof NT Core', desc: 'Synthetic non-tearable substrate impervious to moisture and humidity.' },
      { title: 'Royal Velvet Spine', desc: 'Plush velvet casing handcrafted with foil hot-stamped Telugu calligraphy.' }
    ]
  };
  const livingCraftCards = (craftsmanshipProps.cards || (craftsmanshipProps.covers || []).map(c => ({ title: c.title, desc: c.description || c.desc, image: c.image || '/images/luxury-album-craftsmanship.jpg' }))) || [];

  const ritualsBlockObj = findHomeBlock(homeBlocks, 'TeluguRituals');
  const ritualsProps = ritualsBlockObj?.props || {
    eyebrow: '✦ TRADITIONS WE CELEBRATE ✦',
    title: 'Honoring Sacred Telugu Rituals',
    rituals: [
      { telugu: 'పెళ్లి', name: 'Pelli / Weddings', image: '/images/opt/weddingalbums-talambraluw800.webp' },
      { telugu: 'ప్రీ-వెడ్డింగ్', name: 'Pre-Wedding', image: '/images/prewedding.jpg' },
      { telugu: 'నిశ్చితార్థం', name: 'Engagement', image: '/images/bridal.jpg' },
      { telugu: 'సీమంతం', name: 'Seemantham', image: '/images/family-blessings.png' },
      { telugu: 'ఓణీ వేడుక', name: 'Half Saree', image: '/images/bride-polished.jpg' },
      { telugu: 'పుట్టినరోజు', name: 'Milestone Events', image: '/images/mangalya-dharana.png' }
    ]
  };
  const livingRituals = (ritualsProps.rituals || []).map(r => ({
    telugu: r.telugu || '',
    name: r.name || r.title || '',
    desc: r.desc || '',
    image: r.image || '/images/opt/weddingalbums-talambraluw800.webp'
  }));

  const testBlockObj = findHomeBlock(homeBlocks, 'Testimonials');
  const testimonialsProps = testBlockObj?.props || {
    eyebrow: '✦ VERIFIED CLIENT EXPERIENCES ✦',
    title: 'Words From Our Couples',
    reviews: [
      {
        quote: "The way they edited our Talambralu video was pure magic. Every ritual frame felt like a painting. The event flex designs for our Vijayawada venue were absolutely breathtaking!",
        couple: "Anjali & Karthik Reddy",
        details: "Pelli (Telugu Wedding) · Vijayawada",
        stars: 5,
        avatar: '/images/bride-polished.jpg'
      },
      {
        quote: "Our premium flush mount album is our most prized possession. Their deep respect for AP cultural rituals and the meticulous photo retouching quality was outstanding.",
        couple: "Swathi & Ravi Varma",
        details: "Mangala Snanam & Reception · Vizag",
        stars: 5,
        avatar: '/images/bride-polished.jpg'
      }
    ]
  };
  const rawReviews = testimonialsProps.reviews || testimonialsProps.testimonials || [];
  const livingReviews = rawReviews.map(r => ({
    quote: r.quote || '',
    couple: r.couple || r.name || '',
    details: r.details || r.event || '',
    stars: r.stars || 5,
    avatar: r.avatar || '/images/bride-polished.jpg'
  }));

  const studioCtaBlockObj = findHomeBlock(homeBlocks, 'StudioCtaBanner');
  const studioCtaProps = studioCtaBlockObj?.props || {
    title: 'Ready To Create Your Royal Heirloom?',
    subtitle: 'Explore transparent Per-Sheet pricing on all album sizes, order custom RAW skin retouching, or request studio wholesale partnership.',
    btn1Text: 'Browse All Products & Prices →',
    btn2Text: 'Studio Trade Partner Portal (B2B)'
  };

  const aboutHero = aboutBlocks.find(b => b.type === 'PageHero')?.props || {
    eyebrow: "✦ 100% IN-HOUSE POST-PRODUCTION ✦",
    title: "The Cinematic Engine",
    subtitle: "We are your ultimate post-production partners. We handle high-end photo retouching, video editing, and premium album designing.",
    bgImage: "/images/opt/weddingalbums-home-herow1600.webp"
  };

  const aboutPillars = aboutBlocks.find(b => b.type === 'PillarsList')?.props?.pillars || [
    {
      icon: "Award",
      title: "12 Years of Legacy & Trust",
      desc: "With over a decade of experience, we have deep-rooted ties to studios and clients across every region. We know the Telugu wedding industry inside and out, bringing unparalleled editing expertise to your big day."
    },
    {
      icon: "Users",
      title: "20-Member In-House Editing Unit",
      desc: "We never outsource your precious moments to freelancers. Our dedicated 20-member team of full-time editors and designers handles everything from cinematic color grading to premium flex design with perfect coordination."
    },
    {
      icon: "Camera",
      title: "Zero-Delay Photo Editing",
      desc: "No more waiting months for your albums! We use industry-leading software in-house for flawless skin retouching, color correction, and premium album design, ensuring secure and on-time delivery."
    },
    {
      icon: "Film",
      title: "Cinematic Video Editing & Intros",
      desc: "Our dedicated video editors craft breathtaking cinematic wedding projects and jaw-dropping intros. We handle our own color grading and audio mixing for Netflix-grade storytelling."
    },
    {
      icon: "Smartphone",
      title: "End-to-End Solutions",
      desc: "From custom WhatsApp Video Invitations to large-scale Flexies and venue branding, our in-house team covers every single media requirement for your wedding."
    }
  ];

  const isMob = viewport === 'mobile';

  // ── LIVING WEBSITE HEADER NAVBAR (COMMON ACROSS WHOLE SITE) ──────────────
  const renderLivingWebsiteNavbar = () => (
    <nav style={{
      background: 'rgba(10, 10, 16, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
      padding: isMob ? '10px 14px' : '14px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: isMob ? 0 : '16px 16px 0 0',
      marginBottom: isMob ? '1rem' : '2rem',
      flexWrap: 'wrap',
      gap: 10
    }}>
      {/* Brand Logo & Brand Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4af37, #996515)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#000', fontWeight: 900, fontSize: 16
        }}>
          W
        </div>
        <div>
          <input
            type="text"
            value={siteSettings.brandName || 'weddingalbums.in'}
            onChange={e => updateContactInfo('brandName', e.target.value)}
            style={{
              background: 'transparent', border: '1px dashed rgba(212,175,55,0.4)',
              color: '#fff', fontSize: '1rem', fontWeight: 900, padding: '1px 6px',
              borderRadius: 4, width: isMob ? '120px' : '160px'
            }}
            title="Edit Brand Name"
          />
          <span style={{ fontSize: '9px', display: 'block', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Central Print & Post Lab
          </span>
        </div>
      </div>

      {/* Nav Page Links */}
      {!isMob && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'shop', label: 'Store & Pricing' },
            { id: 'about', label: 'About Us' },
            { id: 'services', label: 'Services' },
            { id: 'contact', label: 'Contact Lab' }
          ].map(lnk => (
            <button
              key={lnk.id}
              onClick={() => setB2cPage(lnk.id)}
              style={{
                background: b2cPage === lnk.id ? 'rgba(212,175,55,0.15)' : 'transparent',
                border: b2cPage === lnk.id ? '1px solid var(--gold-primary)' : '1px solid transparent',
                color: b2cPage === lnk.id ? 'var(--gold-primary)' : '#d4d4d8',
                padding: '5px 10px', borderRadius: 6, fontSize: '12px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              {lnk.label}
            </button>
          ))}
        </div>
      )}

      {/* Right Actions: Editable Phone Hotline, WhatsApp & Order Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* Editable Phone Hotline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(212,175,55,0.1)', border: '1px dashed var(--gold-primary)', padding: '4px 8px', borderRadius: 6 }}>
          <Phone size={12} color="var(--gold-primary)" />
          <input
            type="text"
            value={currentPhone}
            onChange={e => updateContactInfo('phone', e.target.value)}
            style={{
              background: 'transparent', border: 'none', color: 'var(--gold-primary)',
              fontWeight: 800, fontSize: '11px', width: '115px', outline: 'none'
            }}
            title="Edit Phone Hotline (Direct Call)"
          />
        </div>

        {/* Editable WhatsApp Quick Concierge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(37,211,102,0.1)', border: '1px dashed #25D366', padding: '4px 8px', borderRadius: 6 }}>
          <MessageSquare size={12} color="#25D366" />
          <input
            type="text"
            value={currentWhatsapp}
            onChange={e => updateContactInfo('whatsapp', e.target.value)}
            style={{
              background: 'transparent', border: 'none', color: '#25D366',
              fontWeight: 800, fontSize: '11px', width: '105px', outline: 'none'
            }}
            title="Edit WhatsApp Mobile Hotline"
          />
        </div>

        <button
          onClick={() => setB2cPage('shop')}
          style={{
            background: 'linear-gradient(135deg, #d4af37, #b8860b)',
            border: 'none', color: '#000', fontWeight: 900, fontSize: '11px',
            padding: '7px 14px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          Order Album
        </button>
      </div>
    </nav>
  );

  // ── LIVING WEBSITE FOOTER (COMMON ACROSS WHOLE SITE) ──────────────────────
  const renderLivingWebsiteFooter = () => (
    <footer style={{
      background: 'rgba(14, 14, 20, 0.95)',
      borderTop: '1px solid rgba(212, 175, 55, 0.25)',
      padding: isMob ? '20px 14px' : '36px 28px',
      borderRadius: isMob ? 0 : '0 0 16px 16px',
      marginTop: isMob ? '2rem' : '4rem',
      display: 'flex', flexDirection: 'column', gap: '1.5rem'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : '1.5fr 1fr 1fr', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>
              weddingalbums<span style={{ color: 'var(--gold-primary)' }}>.in</span>
            </span>
          </div>
          <textarea
            rows={2}
            value={globalFooter.description || 'Andhra Pradesh & Telangana #1 post-production lab for elite wedding photographers, studios, and couples. 100% Lay-flat albums with non-tearable waterproof cores.'}
            onChange={e => updateContactInfo('description', e.target.value)}
            style={{
              width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)',
              color: '#a1a1aa', fontSize: '0.82rem', lineHeight: 1.5, borderRadius: 6,
              padding: '4px 6px', resize: 'none', marginBottom: 8, boxSizing: 'border-box'
            }}
            title="Edit Footer Description"
          />
          <div style={{ fontSize: '11px', color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📍 Dispatch:</span>
            <input
              type="text"
              value={currentAddress}
              onChange={e => updateContactInfo('address', e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: '1px dashed rgba(212,175,55,0.3)',
                color: 'var(--gold-primary)', fontSize: '11px', borderRadius: 4, padding: '2px 4px'
              }}
              title="Edit Central Dispatch Courier Address"
            />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#fff', textTransform: 'uppercase' }}>AP & TG Hubs</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Vijayawada', 'Vizag', 'Guntur', 'Tirupati', 'Rajahmundry', 'Hyderabad', 'Kurnool'].map(c => (
              <span key={c} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 4, color: '#d4d4d8' }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#fff', textTransform: 'uppercase' }}>Direct Lab Support</h4>
          <div style={{ fontSize: '12px', color: '#d4d4d8', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📞 Phone:</span>
              <input
                type="text"
                value={currentPhone}
                onChange={e => updateContactInfo('phone', e.target.value)}
                style={{ background: 'transparent', border: '1px dashed var(--gold-primary)', color: 'var(--gold-primary)', fontWeight: 700, padding: '2px 6px', borderRadius: 4, width: '135px' }}
                title="Edit Phone Hotline"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>✉️ Email:</span>
              <input
                type="text"
                value={currentEmail}
                onChange={e => updateContactInfo('email', e.target.value)}
                style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', color: '#fff', padding: '2px 6px', borderRadius: 4, width: '160px' }}
                title="Edit Support Email"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>💬 WhatsApp:</span>
              <input
                type="text"
                value={currentWhatsapp}
                onChange={e => updateContactInfo('whatsapp', e.target.value)}
                style={{ background: 'transparent', border: '1px dashed #10b981', color: '#10b981', fontWeight: 700, padding: '2px 6px', borderRadius: 4, width: '120px' }}
                title="Edit WhatsApp Number"
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, fontSize: '11px', color: '#71717a' }}>
        <span>© {new Date().getFullYear()} weddingalbums.in. All Rights Reserved.</span>
        <span>HP Indigo 12000 HD · DaVinci Resolve ACES Pipeline · Archival Lay-Flat Binding</span>
      </div>
    </footer>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#09090e', color: '#f4f4f5', fontFamily: 'Inter, sans-serif' }}>
      
      {/* ── STICKY MASTER COMMAND BAR ─────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10, 10, 16, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        padding: '0.75rem 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
      }}>
        {/* Left: 3 Master Portals */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginRight: '4px' }}>
            Website:
          </span>
          {[
            { id: 'b2c', label: '🛍️ Client Portal & Storefront', color: '#d4af37' },
            { id: 'b2b', label: '🏢 Studio Trade Portal (B2B)', color: '#38bdf8' },
            { id: 'editor', label: '🎬 Lab Production & Editor', color: '#c084fc' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setActivePortal(p.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                border: activePortal === p.id ? `2px solid ${p.color}` : '1px solid rgba(255,255,255,0.1)',
                background: activePortal === p.id ? `${p.color}22` : 'rgba(255,255,255,0.03)',
                color: activePortal === p.id ? p.color : '#a1a1aa',
                fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                boxShadow: activePortal === p.id ? `0 0 16px ${p.color}33` : 'none',
                transition: 'all 0.2s'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Center: Dual Mode Switcher (Visual In-Place Editor vs Interactive Full Site) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '3px', border: '1px solid rgba(212,175,55,0.3)' }}>
            <button
              onClick={() => setViewMode('editor')}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: 'none',
                background: viewMode === 'editor' ? 'linear-gradient(135deg, #d4af37, #b8860b)' : 'transparent',
                color: viewMode === 'editor' ? '#000' : '#d4d4d8',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800
              }}
            >
              <PenTool size={14} /> ✏️ Visual In-Place Editor
            </button>
            <button
              onClick={() => setViewMode('live')}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: 'none',
                background: viewMode === 'live' ? 'linear-gradient(135deg, #38bdf8, #0284c7)' : 'transparent',
                color: viewMode === 'live' ? '#000' : '#d4d4d8',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800
              }}
            >
              <Globe size={14} /> 🌐 Interactive Live Website
            </button>
          </div>

          {/* Viewport Switcher */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setViewport('desktop')}
              style={{
                padding: '6px 12px', borderRadius: '6px', border: 'none',
                background: viewport === 'desktop' ? 'var(--gold-primary, #d4af37)' : 'transparent',
                color: viewport === 'desktop' ? '#000' : '#a1a1aa',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700
              }}
            >
              <Monitor size={14} /> Desktop (1400px)
            </button>
            <button
              onClick={() => setViewport('mobile')}
              style={{
                padding: '6px 12px', borderRadius: '6px', border: 'none',
                background: viewport === 'mobile' ? 'var(--gold-primary, #d4af37)' : 'transparent',
                color: viewport === 'mobile' ? '#000' : '#a1a1aa',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700
              }}
            >
              <Smartphone size={14} /> Mobile (390px)
            </button>
          </div>
        </div>

        {/* Right: Live Preview link & 1-Click Publish */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {viewMode === 'live' && (
            <button
              onClick={() => setIframeKey(k => k + 1)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              <RefreshCw size={12} /> Reload
            </button>
          )}

          <a
            href={getLivePreviewUrl()}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#d4d4d8', textDecoration: 'none', fontSize: '12px', fontWeight: 600
            }}
          >
            <ExternalLink size={13} /> Open Tab
          </a>

          <button
            onClick={handlePublish}
            disabled={saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 22px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
              color: '#000', fontWeight: 900, fontSize: '0.92rem',
              cursor: saving ? 'wait' : 'pointer',
              boxShadow: '0 0 24px rgba(212, 175, 55, 0.45)',
              transform: isDirty ? 'scale(1.02)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Save size={16} />
            {saving ? 'Publishing...' : '🚀 PUBLISH LIVE CHANGES'}
          </button>
        </div>
      </header>

      {/* ── STICKY LAB HOTLINES & QUICK CONTACT CONTROL BAR ────────────────── */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(212,175,55,0.12) 0%, rgba(16,185,129,0.12) 50%, rgba(56,189,248,0.12) 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
        padding: '8px 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <span>⚡ Live Lab Hotlines (Syncs Across Entire Website & Portals):</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
          {/* Phone Hotline Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(212,175,55,0.4)' }}>
            <span style={{ color: 'var(--gold-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Phone size={13} /> Phone:
            </span>
            <input
              type="text"
              value={currentPhone}
              onChange={e => updateContactInfo('phone', e.target.value)}
              placeholder="+91 94948 45111"
              style={{
                background: 'transparent', border: 'none', color: '#fff',
                fontWeight: 800, fontSize: '12px', width: '135px', outline: 'none'
              }}
              title="Edit Lab Support Phone Hotline"
            />
          </div>

          {/* WhatsApp Mobile Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.5)' }}>
            <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MessageSquare size={13} /> WhatsApp:
            </span>
            <input
              type="text"
              value={currentWhatsapp}
              onChange={e => updateContactInfo('whatsapp', e.target.value)}
              placeholder="919494845111"
              style={{
                background: 'transparent', border: 'none', color: '#10b981',
                fontWeight: 800, fontSize: '12px', width: '125px', outline: 'none'
              }}
              title="Edit WhatsApp Mobile Number"
            />
          </div>

          {/* Email Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ color: '#a1a1aa', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Mail size={13} /> Email:
            </span>
            <input
              type="text"
              value={currentEmail}
              onChange={e => updateContactInfo('email', e.target.value)}
              placeholder="orders@weddingalbums.in"
              style={{
                background: 'transparent', border: 'none', color: '#fff',
                fontWeight: 600, fontSize: '12px', width: '170px', outline: 'none'
              }}
              title="Edit Orders Email"
            />
          </div>

          {/* Lab Dispatch Address Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', flex: 1, minWidth: '220px' }}>
            <span style={{ color: '#a1a1aa', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
              <MapPin size={13} /> Address:
            </span>
            <input
              type="text"
              value={currentAddress}
              onChange={e => updateContactInfo('address', e.target.value)}
              placeholder="Lab courier receiving address"
              style={{
                background: 'transparent', border: 'none', color: '#d4d4d8',
                fontWeight: 500, fontSize: '11px', width: '100%', outline: 'none'
              }}
              title="Edit Lab Physical Address"
            />
          </div>
        </div>
      </div>

      {/* Sub-Navigation Strip (Pages per portal) */}
      <div style={{
        background: 'rgba(18, 18, 26, 0.8)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.6rem 1.5rem',
        display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', fontWeight: 800, marginRight: '4px' }}>
          Page:
        </span>

        {activePortal === 'b2c' && [
          { id: 'home', label: '🏠 Whole Home Page (/)' },
          { id: 'shop', label: '🛍️ Storefront & Products (/shop)' },
          { id: 'about', label: '📖 About Us (/about)' },
          { id: 'services', label: '🛠️ Services Hub (/services)' },
          { id: 'contact', label: '📞 Contact Lab (/contact)' },
          { id: 'global', label: '🌐 Global Header & Footer' }
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setB2cPage(p.id)}
            style={{
              padding: '6px 14px', borderRadius: '8px',
              background: b2cPage === p.id ? 'rgba(212,175,55,0.2)' : 'transparent',
              border: b2cPage === p.id ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.06)',
              color: b2cPage === p.id ? 'var(--gold-primary)' : '#a1a1aa',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            {p.label}
          </button>
        ))}

        {activePortal === 'b2b' && [
          { id: 'landing', label: '🌐 Studio Partner Landing' },
          { id: 'wholesale', label: '🏢 Wholesale Rate Card Matrix' }
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setB2bPage(p.id)}
            style={{
              padding: '6px 14px', borderRadius: '8px',
              background: b2bPage === p.id ? 'rgba(56,189,248,0.2)' : 'transparent',
              border: b2bPage === p.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
              color: b2bPage === p.id ? '#38bdf8' : '#a1a1aa',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            {p.label}
          </button>
        ))}

        {activePortal === 'editor' && [
          { id: 'onboarding', label: '🌐 Technician Onboarding & Guidelines' },
          { id: 'payouts', label: '💰 Production Compensation Rates' }
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setEditorPage(p.id)}
            style={{
              padding: '6px 14px', borderRadius: '8px',
              background: editorPage === p.id ? 'rgba(192,132,252,0.2)' : 'transparent',
              border: editorPage === p.id ? '1px solid #c084fc' : '1px solid rgba(255,255,255,0.06)',
              color: editorPage === p.id ? '#c084fc' : '#a1a1aa',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Publish Toast */}
      {publishSuccess && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff',
          padding: '12px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 12px 32px rgba(16,185,129,0.4)', fontWeight: 700, fontSize: '14px'
        }}>
          <CheckCircle2 size={18} />
          <span>✓ Published live! Content updated across DB, disk, and live SSE clients.</span>
        </div>
      )}
      {publishError && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff',
          padding: '12px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 12px 32px rgba(239,68,68,0.4)', fontWeight: 700, fontSize: '14px'
        }}>
          <AlertCircle size={18} />
          <span>{publishError}</span>
        </div>
      )}

      {/* ── CANVAS VIEWPORT WRAPPER (MOBILE IPHONE FRAME OR DESKTOP BROWSER FRAME) ── */}
      <main style={{ padding: isMob ? '1.5rem 1rem' : '2rem', display: 'flex', justifyContent: 'center' }}>
        
        {viewport === 'mobile' ? (
          /* 📱 AUTHENTIC IPHONE 16 PRO FRAME */
          <div style={{
            width: '410px',
            maxWidth: '100%',
            background: '#09090e',
            borderRadius: '44px',
            border: '10px solid #1f1f28',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Status Bar & Dynamic Island */}
            <div style={{
              background: '#12121a',
              padding: '10px 18px 6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>9:41</span>
              <div style={{
                width: '85px', height: '18px', background: '#000',
                borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#fff' }}>
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Simulated Mobile URL bar */}
            <div style={{
              background: 'rgba(0,0,0,0.5)',
              padding: '6px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: '10px',
              color: '#a1a1aa'
            }}>
              <span style={{ color: '#10b981' }}>🔒</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                {getLivePreviewUrl()}
              </span>
            </div>

            {/* Mobile Viewport Content */}
            <div style={{
              height: 'calc(100vh - 220px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: viewMode === 'live' ? 0 : '14px 12px'
            }}>
              {viewMode === 'live' ? (
                <iframe
                  key={iframeKey}
                  src={getLivePreviewUrl()}
                  title="Live Mobile Website"
                  style={{ width: '100%', height: '100%', border: 'none', background: '#09090e' }}
                />
              ) : (
                renderLivingPageContent()
              )}
            </div>

            {/* Mobile Home Gesture Bar */}
            <div style={{ background: '#12121a', padding: '8px 0', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '120px', height: '4px', background: 'rgba(255,255,255,0.4)', borderRadius: '999px' }} />
            </div>
          </div>

        ) : (

          /* 🖥️ AUTHENTIC DESKTOP BROWSER FRAME */
          <div style={{
            width: '100%',
            maxWidth: '1400px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            background: '#09090e'
          }}>
            {/* Desktop Browser Window Chrome */}
            <div style={{
              background: 'rgba(22, 22, 32, 0.95)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{
                flex: 1,
                maxWidth: '600px',
                margin: '0 auto',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '11px',
                color: '#a1a1aa',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ color: '#10b981' }}>🔒</span>
                <span>{getLivePreviewUrl()}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#71717a', fontWeight: 600 }}>1400px Desktop Canvas</span>
            </div>

            {/* Desktop Canvas Container */}
            <div style={{ padding: viewMode === 'live' ? 0 : '2.5rem 2rem', minHeight: '800px' }}>
              {viewMode === 'live' ? (
                <iframe
                  key={iframeKey}
                  src={getLivePreviewUrl()}
                  title="Live Desktop Website"
                  style={{ width: '100%', height: '85vh', border: 'none', background: '#09090e' }}
                />
              ) : (
                renderLivingPageContent()
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );

  // ── CORE LIVING PAGE COMPONENT DISPATCHER ──────────────────────────────────
  function renderLivingPageContent() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Real Living Website Navbar across all pages */}
        {renderLivingWebsiteNavbar()}

        {/* ── B2C PAGES ──────────────────────────────────────────────────────── */}
        {activePortal === 'b2c' && b2cPage === 'home' && renderWholeLivingHomePage()}
        {activePortal === 'b2c' && b2cPage === 'shop' && renderLivingShopPage()}
        {activePortal === 'b2c' && b2cPage === 'about' && renderLivingAboutPage()}
        {activePortal === 'b2c' && b2cPage === 'services' && renderLivingServicesPage()}
        {activePortal === 'b2c' && b2cPage === 'contact' && renderLivingContactPage()}
        {activePortal === 'b2c' && b2cPage === 'global' && renderLivingGlobalPage()}

        {/* ── B2B PAGES ──────────────────────────────────────────────────────── */}
        {activePortal === 'b2b' && b2bPage === 'landing' && renderLivingB2bLandingPage()}
        {activePortal === 'b2b' && b2bPage === 'wholesale' && renderLivingB2bWholesalePage()}

        {/* ── EDITOR PAGES ───────────────────────────────────────────────────── */}
        {activePortal === 'editor' && editorPage === 'onboarding' && renderLivingEditorOnboardingPage()}
        {activePortal === 'editor' && editorPage === 'payouts' && renderLivingEditorPayoutsPage()}

        {/* Real Living Website Footer across all pages */}
        {renderLivingWebsiteFooter()}
      </div>
    );
  }

  // ── SECTION: WHOLE LIVING HOME PAGE (ALL 12 LIVING SECTIONS) ──────────────
  function renderWholeLivingHomePage() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMob ? '2rem' : '3.5rem' }}>
        {/* 1. Living Hero Banner */}
        <section style={{
          position: 'relative',
          borderRadius: isMob ? 16 : 24,
          overflow: 'hidden',
          minHeight: isMob ? '420px' : '520px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: isMob ? '1.5rem 1rem' : '3rem 2rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          border: '1px solid rgba(212,175,55,0.25)'
        }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <PointOfUseImageUploader
              imageUrl={heroBlock.bgImage || '/images/opt/weddingalbums-home-herow1600.webp'}
              onImageChange={(newUrl) => updateHomeBlockProp('Hero', 'bgImage', newUrl)}
              alt="Living Home Hero Banner"
              height="100%"
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(9,9,14,0.72) 0%, rgba(9,9,14,0.94) 85%)',
              pointerEvents: 'none'
            }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '850px', width: '100%' }}>
            <input
              type="text"
              value={heroBlock.eyebrow || ''}
              onChange={e => updateHomeBlockProp('Hero', 'eyebrow', e.target.value)}
              style={{
                background: 'rgba(212,175,55,0.12)', border: '1px dashed var(--gold-primary, #d4af37)',
                color: 'var(--gold-primary, #d4af37)', padding: '4px 14px', borderRadius: 999,
                fontSize: isMob ? '0.72rem' : '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase',
                textAlign: 'center', margin: '0 auto 1rem', display: 'inline-block', maxWidth: '100%'
              }}
            />

            <input
              type="text"
              value={heroBlock.titlePart1 || ''}
              onChange={e => updateHomeBlockProp('Hero', 'titlePart1', e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.25)',
                color: '#fff', fontSize: isMob ? '1.5rem' : '2.8rem', fontWeight: 900,
                fontFamily: 'Cinzel, serif', textAlign: 'center', padding: '4px 8px', borderRadius: 8,
                marginBottom: '0.4rem', boxSizing: 'border-box'
              }}
            />

            <input
              type="text"
              value={heroBlock.titleScramble || ''}
              onChange={e => updateHomeBlockProp('Hero', 'titleScramble', e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: '1px dashed rgba(212,175,55,0.4)',
                color: 'var(--gold-primary, #d4af37)', fontSize: isMob ? '1.25rem' : '2.2rem', fontWeight: 900,
                fontFamily: 'Cinzel, serif', textAlign: 'center', padding: '4px 8px', borderRadius: 8,
                marginBottom: '1rem', boxSizing: 'border-box'
              }}
            />

            <textarea
              rows={isMob ? 3 : 2}
              value={heroBlock.subtitle || ''}
              onChange={e => updateHomeBlockProp('Hero', 'subtitle', e.target.value)}
              style={{
                width: '100%', maxWidth: '720px', margin: '0 auto 1.5rem', display: 'block',
                background: 'transparent', border: '1px dashed rgba(255,255,255,0.18)',
                color: '#d4d4d8', fontSize: isMob ? '0.85rem' : '1.05rem', lineHeight: '1.6',
                textAlign: 'center', padding: '6px 12px', borderRadius: 8, resize: 'none', boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <input
                type="text"
                value={heroBlock.btn1Text || 'Browse All Products & Prices'}
                onChange={e => updateHomeBlockProp('Hero', 'btn1Text', e.target.value)}
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
                  border: 'none', color: '#000', fontWeight: 800, fontSize: isMob ? '0.8rem' : '0.9rem',
                  padding: '10px 18px', borderRadius: 8, textAlign: 'center', cursor: 'text'
                }}
              />
              <input
                type="text"
                value={heroBlock.btn2Text || 'Per-Sheet Price Calculator'}
                onChange={e => updateHomeBlockProp('Hero', 'btn2Text', e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.5)',
                  color: 'var(--gold-primary, #d4af37)', fontWeight: 700, fontSize: isMob ? '0.8rem' : '0.9rem',
                  padding: '10px 18px', borderRadius: 8, textAlign: 'center', cursor: 'text'
                }}
              />
            </div>
          </div>
        </section>

        {/* 2. Living Marquee Ticker Strip */}
        <section style={{
          background: 'rgba(212, 175, 55, 0.05)',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '12px 16px', borderRadius: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              ⚡ Live Rotating Announcements Strip (Click to edit inline)
            </span>
            <button
              onClick={() => {
                const updated = JSON.parse(JSON.stringify(homeBlocks));
                let target = updated.find(b => b.type === 'MarqueeTicker');
                if (!target) {
                  target = { id: `block-marquee-${Date.now()}`, type: 'MarqueeTicker', props: { items: [] } };
                  updated.push(target);
                }
                if (!target.props.items) target.props.items = [];
                target.props.items.push('✨ New Live Announcement (Click to edit)');
                handlePageUpdate('home', updated);
              }}
              style={{
                background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                color: 'var(--gold-primary)', borderRadius: 6, padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              + Add Announcement Pill
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
            {marqueeItems.map((item, mIdx) => (
              <div key={mIdx} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
                background: 'rgba(18, 18, 26, 0.9)', border: '1px dashed rgba(212,175,55,0.35)',
                padding: '4px 10px', borderRadius: 999
              }}>
                <input
                  type="text"
                  value={item}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    const target = updated.find(b => b.type === 'MarqueeTicker');
                    if (target && target.props?.items) {
                      target.props.items[mIdx] = e.target.value;
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{
                    background: 'transparent', border: 'none', color: '#e4e4e7',
                    fontSize: '12px', fontWeight: 600, width: `${Math.max(160, item.length * 8)}px`
                  }}
                />
                <button
                  onClick={() => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    const target = updated.find(b => b.type === 'MarqueeTicker');
                    if (target && target.props?.items) {
                      target.props.items.splice(mIdx, 1);
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '11px', padding: 0 }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Living Stats Bar */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: isMob ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMob ? '10px' : '1.25rem'
        }}>
          {statsList.map((st, stIdx) => (
            <div key={stIdx} style={{
              background: 'rgba(18, 18, 26, 0.8)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: isMob ? '12px 10px' : '20px 16px', textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
                <input
                  type="number"
                  value={st.target || 0}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    const target = updated.find(b => b.type === 'StatsBar');
                    if (target && target.props?.stats) {
                      target.props.stats[stIdx].target = Number(e.target.value);
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{
                    width: '90px', textAlign: 'right', background: 'transparent',
                    border: '1px dashed rgba(212,175,55,0.4)', borderRadius: 4,
                    color: 'var(--gold-primary, #d4af37)', fontSize: isMob ? '1.4rem' : '2rem', fontWeight: 900
                  }}
                />
                <input
                  type="text"
                  value={st.suffix || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    const target = updated.find(b => b.type === 'StatsBar');
                    if (target && target.props?.stats) {
                      target.props.stats[stIdx].suffix = e.target.value;
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{
                    width: '24px', background: 'transparent', border: 'none',
                    color: 'var(--gold-primary, #d4af37)', fontSize: isMob ? '1.4rem' : '2rem', fontWeight: 900
                  }}
                />
              </div>
              <input
                type="text"
                value={st.label || ''}
                onChange={e => {
                  const updated = JSON.parse(JSON.stringify(homeBlocks));
                  const target = updated.find(b => b.type === 'StatsBar');
                  if (target && target.props?.stats) {
                    target.props.stats[stIdx].label = e.target.value;
                    handlePageUpdate('home', updated);
                  }
                }}
                style={{
                  width: '100%', textAlign: 'center', background: 'transparent',
                  border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 4,
                  color: '#a1a1aa', fontSize: isMob ? '11px' : '13px', fontWeight: 600, boxSizing: 'border-box'
                }}
              />
            </div>
          ))}
        </section>

        {/* 4. Living Visual Pillars Showcase */}
        <section>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2rem' }}>
            <input
              type="text"
              value={vp.eyebrow || '✦ COMPLETE IN-HOUSE POST-PRODUCTION SUITE ✦'}
              onChange={e => updateHomeBlockProp('VisualPillarsShowcase', 'eyebrow', e.target.value)}
              style={{
                background: 'transparent', border: '1px dashed rgba(212,175,55,0.4)',
                color: 'var(--gold-primary)', fontSize: '0.78rem', fontWeight: 800,
                letterSpacing: '2px', textAlign: 'center', borderRadius: 4, padding: '2px 8px', marginBottom: '8px'
              }}
            />
            <input
              type="text"
              value={vp.title || 'Crafted with Precision. Delivered with Reverence.'}
              onChange={e => updateHomeBlockProp('VisualPillarsShowcase', 'title', e.target.value)}
              style={{
                background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
                color: '#fff', fontSize: isMob ? '1.35rem' : '1.8rem', fontWeight: 800, textAlign: 'center',
                width: '100%', borderRadius: 6, padding: '4px 8px', marginBottom: '8px', boxSizing: 'border-box'
              }}
            />
            <textarea
              rows={2}
              value={vp.subtitle || 'From raw memory cards to museum-grade physical heirlooms and cinematic films. Here is what we create for you:'}
              onChange={e => updateHomeBlockProp('VisualPillarsShowcase', 'subtitle', e.target.value)}
              style={{
                background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)',
                color: '#a1a1aa', fontSize: '0.92rem', textAlign: 'center', width: '100%',
                borderRadius: 6, padding: '4px 8px', resize: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {pillarsList.map((pillar, pilIdx) => (
              <div key={pilIdx} style={{
                background: 'rgba(18, 18, 26, 0.9)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}>
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <PointOfUseImageUploader
                    imageUrl={pillar.image || '/images/opt/luxury-album-craftsmanshipw800.webp'}
                    onImageChange={url => {
                      const updated = JSON.parse(JSON.stringify(homeBlocks));
                      const target = updated.find(b => b.type === 'VisualPillarsShowcase');
                      if (target && target.props?.pillars) {
                        target.props.pillars[pilIdx].image = url;
                        handlePageUpdate('home', updated);
                      }
                    }}
                    alt={pillar.title}
                    height={180}
                  />
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.75)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', padding: '2px 8px', borderRadius: 4, fontSize: '10px', fontWeight: 800 }}>
                    PILLAR {pillar.number || `0${pilIdx + 1}`}
                  </div>
                </div>

                <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <input
                    type="text"
                    value={pillar.badge || 'AP & Telangana #1 Choice'}
                    onChange={e => {
                      const updated = JSON.parse(JSON.stringify(homeBlocks));
                      const target = updated.find(b => b.type === 'VisualPillarsShowcase');
                      if (target && target.props?.pillars) {
                        target.props.pillars[pilIdx].badge = e.target.value;
                        handlePageUpdate('home', updated);
                      }
                    }}
                    style={{ background: 'transparent', border: '1px dashed rgba(212,175,55,0.3)', color: 'var(--gold-primary)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', borderRadius: 4, padding: '2px 6px', marginBottom: 8, width: 'fit-content' }}
                  />

                  <input
                    type="text"
                    value={pillar.title || ''}
                    onChange={e => {
                      const updated = JSON.parse(JSON.stringify(homeBlocks));
                      const target = updated.find(b => b.type === 'VisualPillarsShowcase');
                      if (target && target.props?.pillars) {
                        target.props.pillars[pilIdx].title = e.target.value;
                        handlePageUpdate('home', updated);
                      }
                    }}
                    style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', color: '#fff', fontSize: '1.15rem', fontWeight: 800, borderRadius: 4, padding: '2px 6px', marginBottom: 4, boxSizing: 'border-box', width: '100%' }}
                  />

                  <input
                    type="text"
                    value={pillar.telugu || ''}
                    onChange={e => {
                      const updated = JSON.parse(JSON.stringify(homeBlocks));
                      const target = updated.find(b => b.type === 'VisualPillarsShowcase');
                      if (target && target.props?.pillars) {
                        target.props.pillars[pilIdx].telugu = e.target.value;
                        handlePageUpdate('home', updated);
                      }
                    }}
                    style={{ background: 'transparent', border: '1px dashed rgba(212,175,55,0.3)', color: 'var(--gold-primary)', fontSize: '0.9rem', fontWeight: 700, borderRadius: 4, padding: '2px 6px', marginBottom: 10, boxSizing: 'border-box', width: '100%' }}
                  />

                  <textarea
                    rows={2}
                    value={pillar.subtitle || ''}
                    onChange={e => {
                      const updated = JSON.parse(JSON.stringify(homeBlocks));
                      const target = updated.find(b => b.type === 'VisualPillarsShowcase');
                      if (target && target.props?.pillars) {
                        target.props.pillars[pilIdx].subtitle = e.target.value;
                        handlePageUpdate('home', updated);
                      }
                    }}
                    style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)', color: '#a1a1aa', fontSize: '0.85rem', lineHeight: '1.5', borderRadius: 4, padding: '4px 6px', marginBottom: 12, resize: 'none', boxSizing: 'border-box', width: '100%' }}
                  />

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10, marginTop: 'auto' }}>
                    <span style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: 6 }}>Included Highlights ✏️:</span>
                    {(pillar.features || []).map((feat, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ color: 'var(--gold-primary)', fontSize: 10 }}>✓</span>
                        <input
                          type="text"
                          value={feat}
                          onChange={e => {
                            const updated = JSON.parse(JSON.stringify(homeBlocks));
                            const target = updated.find(b => b.type === 'VisualPillarsShowcase');
                            if (target && target.props?.pillars?.[pilIdx]?.features) {
                              target.props.pillars[pilIdx].features[fIdx] = e.target.value;
                              handlePageUpdate('home', updated);
                            }
                          }}
                          style={{ flex: 1, background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', color: '#d4d4d8', fontSize: '11px', borderRadius: 4, padding: '2px 4px', boxSizing: 'border-box' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Living Before / After Retouching Slider Showcase */}
        <section style={{
          background: 'rgba(18, 18, 26, 0.85)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: 20, padding: isMob ? '16px' : '28px',
          display: 'flex', flexDirection: 'column', gap: '1.5rem'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
            <span style={{ fontSize: '10px', color: 'var(--gold-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 4 }}>
              ✦ MASTER FREQUENCY SEPARATION RETOUCHING ✦
            </span>
            <input
              type="text"
              value={beforeAfterProps.title || 'The Art of Telugu Wedding Retouching'}
              onChange={e => updateHomeBlockProp('InteractiveBeforeAfter', 'title', e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
                color: '#fff', fontSize: isMob ? '1.3rem' : '1.75rem', fontWeight: 800, textAlign: 'center', padding: '4px', borderRadius: 6, marginBottom: 6
              }}
            />
            <p style={{ color: '#a1a1aa', fontSize: '0.88rem', margin: 0 }}>
              Compare authentic RAW DSLR capture vs 24K specular shine temple jewelry polish:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
            {/* RAW Image */}
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 14, overflow: 'hidden', padding: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Left: RAW Unedited Photo
              </span>
              <PointOfUseImageUploader
                imageUrl={beforeAfterProps.rawImage || '/images/opt/bride-raww800.webp'}
                onImageChange={url => updateHomeBlockProp('InteractiveBeforeAfter', 'rawImage', url)}
                alt="RAW Unedited Capture"
                height={220}
              />
            </div>

            {/* Polished Image */}
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 14, overflow: 'hidden', padding: 12, border: '1px solid rgba(212,175,55,0.3)' }}>
              <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Right: Master Polished (22K Gold Luster)
              </span>
              <PointOfUseImageUploader
                imageUrl={beforeAfterProps.polishedImage || '/images/opt/bride-polishedw800.webp'}
                onImageChange={url => updateHomeBlockProp('InteractiveBeforeAfter', 'polishedImage', url)}
                alt="Master Polished Wedding Photo"
                height={220}
              />
            </div>
          </div>
        </section>

        {/* 6. Living Craftsmanship & Anatomy of Heirloom Album */}
        <section style={{
          background: 'rgba(212,175,55,0.04)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: 20, padding: isMob ? '18px 14px' : '28px 24px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 1.5rem' }}>
            <input
              type="text"
              value={craftsmanshipProps.eyebrow || '✦ OBSESSIVE ATTENTION TO DETAIL ✦'}
              onChange={e => updateHomeBlockProp('Craftsmanship', 'eyebrow', e.target.value)}
              style={{
                background: 'transparent', border: '1px dashed rgba(212,175,55,0.4)',
                color: 'var(--gold-primary)', fontSize: '11px', fontWeight: 800,
                letterSpacing: '1px', textAlign: 'center', borderRadius: 4, padding: '2px 8px', marginBottom: '6px'
              }}
            />
            <input
              type="text"
              value={craftsmanshipProps.title || 'Anatomy of an Heirloom Wedding Album'}
              onChange={e => updateHomeBlockProp('Craftsmanship', 'title', e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
                color: '#fff', fontSize: isMob ? '1.3rem' : '1.8rem', fontWeight: 800, textAlign: 'center',
                borderRadius: 6, padding: '4px', marginBottom: '6px', boxSizing: 'border-box'
              }}
            />
            <textarea
              rows={2}
              value={craftsmanshipProps.subtitle || 'Every volume is precision-assembled by master bookbinders using archival-grade materials built to outlast generations.'}
              onChange={e => updateHomeBlockProp('Craftsmanship', 'subtitle', e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)',
                color: '#a1a1aa', fontSize: '0.88rem', textAlign: 'center', borderRadius: 6, padding: '4px', resize: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <button
              onClick={() => {
                const updated = JSON.parse(JSON.stringify(homeBlocks));
                let target = findHomeBlock(updated, 'Craftsmanship');
                if (!target) {
                  target = { id: `block-craft-${Date.now()}`, type: 'Craftsmanship', props: { cards: [] } };
                  updated.push(target);
                }
                if (!target.props.cards) target.props.cards = JSON.parse(JSON.stringify(livingCraftCards));
                target.props.cards.push({ title: 'New Craftsmanship Feature', desc: 'Description of the craftsmanship quality and archival technology.' });
                handlePageUpdate('home', updated);
              }}
              style={{
                background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)',
                color: 'var(--gold-primary)', borderRadius: 6, padding: '4px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              + Add Feature Card
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {livingCraftCards.map((c, cIdx) => (
              <div key={cIdx} style={{ background: 'rgba(18,18,26,0.85)', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 900, fontSize: 12 }}>
                    0{cIdx + 1}.
                  </span>
                  <button
                    onClick={() => {
                      const updated = JSON.parse(JSON.stringify(homeBlocks));
                      let target = findHomeBlock(updated, 'Craftsmanship');
                      if (target) {
                        if (!target.props.cards) target.props.cards = JSON.parse(JSON.stringify(livingCraftCards));
                        target.props.cards.splice(cIdx, 1);
                        handlePageUpdate('home', updated);
                      }
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 11 }}
                    title="Delete card"
                  >
                    ✕
                  </button>
                </div>

                <div style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}>
                  <PointOfUseImageUploader
                    imageUrl={c.image || '/images/luxury-album-craftsmanship.jpg'}
                    onImageChange={url => {
                      const updated = JSON.parse(JSON.stringify(homeBlocks));
                      let target = findHomeBlock(updated, 'Craftsmanship');
                      if (!target) {
                        target = { id: `block-craft-${Date.now()}`, type: 'Craftsmanship', props: { cards: [] } };
                        updated.push(target);
                      }
                      if (!target.props.cards) target.props.cards = JSON.parse(JSON.stringify(livingCraftCards));
                      if (target.props.cards[cIdx]) {
                        target.props.cards[cIdx].image = url;
                        handlePageUpdate('home', updated);
                      }
                    }}
                    alt={c.title || 'Craftsmanship Card'}
                    height={110}
                  />
                </div>
                <input
                  type="text"
                  value={c.title || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    let target = findHomeBlock(updated, 'Craftsmanship');
                    if (!target) {
                      target = { id: `block-craft-${Date.now()}`, type: 'Craftsmanship', props: { cards: [] } };
                      updated.push(target);
                    }
                    if (!target.props.cards) target.props.cards = JSON.parse(JSON.stringify(livingCraftCards));
                    if (target.props.cards[cIdx]) {
                      target.props.cards[cIdx].title = e.target.value;
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{ width: '100%', background: 'transparent', border: '1px dashed rgba(212,175,55,0.3)', color: 'var(--gold-primary)', fontWeight: 800, fontSize: 13, borderRadius: 4, padding: '2px 4px', marginBottom: 6, boxSizing: 'border-box' }}
                />
                <textarea
                  rows={2}
                  value={c.desc || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    let target = findHomeBlock(updated, 'Craftsmanship');
                    if (!target) {
                      target = { id: `block-craft-${Date.now()}`, type: 'Craftsmanship', props: { cards: [] } };
                      updated.push(target);
                    }
                    if (!target.props.cards) target.props.cards = JSON.parse(JSON.stringify(livingCraftCards));
                    if (target.props.cards[cIdx]) {
                      target.props.cards[cIdx].desc = e.target.value;
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{ width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', color: '#a1a1aa', fontSize: '0.8rem', lineHeight: 1.4, borderRadius: 4, padding: '2px 4px', resize: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 7. Living Telugu Rituals & Celebrations Showcase */}
        <section>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
            <input
              type="text"
              value={ritualsProps.eyebrow || '✦ TRADITIONS WE CELEBRATE ✦'}
              onChange={e => updateHomeBlockProp('TeluguRituals', 'eyebrow', e.target.value)}
              style={{
                background: 'transparent', border: '1px dashed rgba(212,175,55,0.4)',
                color: 'var(--gold-primary)', fontSize: '11px', fontWeight: 800,
                letterSpacing: '1px', textAlign: 'center', borderRadius: 4, padding: '2px 8px', marginBottom: '6px'
              }}
            />
            <input
              type="text"
              value={ritualsProps.title || 'Honoring Sacred Telugu Rituals'}
              onChange={e => updateHomeBlockProp('TeluguRituals', 'title', e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
                color: '#fff', fontSize: isMob ? '1.3rem' : '1.75rem', fontWeight: 800, textAlign: 'center',
                borderRadius: 6, padding: '4px', margin: '4px 0 0 0', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <button
              onClick={() => {
                const updated = JSON.parse(JSON.stringify(homeBlocks));
                let target = findHomeBlock(updated, 'TeluguRituals');
                if (!target) {
                  target = { id: `block-rituals-${Date.now()}`, type: 'TeluguRituals', props: { rituals: [] } };
                  updated.push(target);
                }
                if (!target.props.rituals) target.props.rituals = JSON.parse(JSON.stringify(livingRituals));
                target.props.rituals.push({ telugu: 'నూతన వేడుక', name: 'Special Celebration', title: 'Special Celebration' });
                handlePageUpdate('home', updated);
              }}
              style={{
                background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                color: 'var(--gold-primary)', borderRadius: 6, padding: '4px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              + Add Ritual
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMob ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            {livingRituals.map((r, rIdx) => (
              <div key={rIdx} style={{
                background: 'rgba(18, 18, 26, 0.85)', border: '1px solid rgba(212,175,55,0.18)',
                borderRadius: 12, padding: '12px 8px', textAlign: 'center', position: 'relative'
              }}>
                <button
                  onClick={() => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    let target = findHomeBlock(updated, 'TeluguRituals');
                    if (target) {
                      if (!target.props.rituals) target.props.rituals = JSON.parse(JSON.stringify(livingRituals));
                      target.props.rituals.splice(rIdx, 1);
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{ position: 'absolute', top: 4, right: 4, background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: 10, zIndex: 12 }}
                  title="Remove ritual"
                >
                  ✕
                </button>

                <div style={{ marginBottom: 6, borderRadius: 8, overflow: 'hidden' }}>
                  <PointOfUseImageUploader
                    imageUrl={r.image || '/images/opt/weddingalbums-talambraluw800.webp'}
                    onImageChange={url => {
                      const updated = JSON.parse(JSON.stringify(homeBlocks));
                      let target = findHomeBlock(updated, 'TeluguRituals');
                      if (!target) {
                        target = { id: `block-rituals-${Date.now()}`, type: 'TeluguRituals', props: { rituals: [] } };
                        updated.push(target);
                      }
                      if (!target.props.rituals) target.props.rituals = JSON.parse(JSON.stringify(livingRituals));
                      if (target.props.rituals[rIdx]) {
                        target.props.rituals[rIdx].image = url;
                        handlePageUpdate('home', updated);
                      }
                    }}
                    alt={r.name || r.telugu || 'Ritual Image'}
                    height={85}
                  />
                </div>
                <input
                  type="text"
                  value={r.telugu || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    let target = findHomeBlock(updated, 'TeluguRituals');
                    if (!target) {
                      target = { id: `block-rituals-${Date.now()}`, type: 'TeluguRituals', props: { rituals: [] } };
                      updated.push(target);
                    }
                    if (!target.props.rituals) target.props.rituals = JSON.parse(JSON.stringify(livingRituals));
                    if (target.props.rituals[rIdx]) {
                      target.props.rituals[rIdx].telugu = e.target.value;
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{ width: '90%', textAlign: 'center', background: 'transparent', border: '1px dashed rgba(212,175,55,0.3)', color: 'var(--gold-primary)', fontSize: '1.1rem', fontWeight: 900, borderRadius: 4, padding: '2px 4px', marginBottom: 4 }}
                />
                <input
                  type="text"
                  value={r.name || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    let target = findHomeBlock(updated, 'TeluguRituals');
                    if (!target) {
                      target = { id: `block-rituals-${Date.now()}`, type: 'TeluguRituals', props: { rituals: [] } };
                      updated.push(target);
                    }
                    if (!target.props.rituals) target.props.rituals = JSON.parse(JSON.stringify(livingRituals));
                    if (target.props.rituals[rIdx]) {
                      target.props.rituals[rIdx].name = e.target.value;
                      target.props.rituals[rIdx].title = e.target.value;
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{ width: '90%', textAlign: 'center', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', color: '#d4d4d8', fontSize: '11px', fontWeight: 600, borderRadius: 4, padding: '2px 4px' }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 8. Living Real Couple Testimonials & Reviews */}
        <section style={{
          background: 'rgba(18, 18, 26, 0.85)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: isMob ? '18px 14px' : '28px 24px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <input
              type="text"
              value={testimonialsProps.eyebrow || '✦ VERIFIED CLIENT EXPERIENCES ✦'}
              onChange={e => updateHomeBlockProp('Testimonials', 'eyebrow', e.target.value)}
              style={{
                background: 'transparent', border: '1px dashed rgba(212,175,55,0.4)',
                color: 'var(--gold-primary)', fontSize: '11px', fontWeight: 800,
                letterSpacing: '1px', textAlign: 'center', borderRadius: 4, padding: '2px 8px', marginBottom: '6px'
              }}
            />
            <input
              type="text"
              value={testimonialsProps.title || 'Words From Our Couples'}
              onChange={e => updateHomeBlockProp('Testimonials', 'title', e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
                color: '#fff', fontSize: isMob ? '1.3rem' : '1.75rem', fontWeight: 800, textAlign: 'center',
                borderRadius: 6, padding: '4px', margin: '4px 0 0 0', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <button
              onClick={() => {
                const updated = JSON.parse(JSON.stringify(homeBlocks));
                let target = findHomeBlock(updated, 'Testimonials');
                if (!target) {
                  target = { id: `block-test-${Date.now()}`, type: 'Testimonials', props: { reviews: [] } };
                  updated.push(target);
                }
                if (!target.props.reviews) target.props.reviews = JSON.parse(JSON.stringify(livingReviews));
                target.props.reviews.push({
                  quote: "Outstanding album quality and super fast delivery. The colors are so vibrant and lifelike!",
                  couple: "Pooja & Srinivas Rao",
                  details: "Pelli (Wedding) · Guntur",
                  stars: 5
                });
                target.props.testimonials = target.props.reviews.map(r => ({ quote: r.quote, name: r.couple, event: r.details }));
                handlePageUpdate('home', updated);
              }}
              style={{
                background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                color: 'var(--gold-primary)', borderRadius: 6, padding: '4px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              + Add Review
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {livingReviews.map((rev, revIdx) => (
              <div key={revIdx} style={{ background: 'rgba(0,0,0,0.3)', padding: 18, borderRadius: 14, border: '1px solid rgba(212,175,55,0.2)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ color: 'var(--gold-primary)', fontSize: 13 }}>★★★★★</div>
                  <button
                    onClick={() => {
                      const updated = JSON.parse(JSON.stringify(homeBlocks));
                      let target = findHomeBlock(updated, 'Testimonials');
                      if (target) {
                        if (!target.props.reviews) target.props.reviews = JSON.parse(JSON.stringify(livingReviews));
                        target.props.reviews.splice(revIdx, 1);
                        target.props.testimonials = target.props.reviews.map(r => ({ quote: r.quote, name: r.couple, event: r.details }));
                        handlePageUpdate('home', updated);
                      }
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 11 }}
                    title="Delete review"
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--gold-primary)' }}>
                    <PointOfUseImageUploader
                      imageUrl={rev.avatar || '/images/bride-polished.jpg'}
                      onImageChange={url => {
                        const updated = JSON.parse(JSON.stringify(homeBlocks));
                        let target = findHomeBlock(updated, 'Testimonials');
                        if (!target) {
                          target = { id: `block-test-${Date.now()}`, type: 'Testimonials', props: { reviews: [] } };
                          updated.push(target);
                        }
                        if (!target.props.reviews) target.props.reviews = JSON.parse(JSON.stringify(livingReviews));
                        if (target.props.reviews[revIdx]) {
                          target.props.reviews[revIdx].avatar = url;
                          target.props.testimonials = target.props.reviews.map(r => ({ quote: r.quote, name: r.couple, event: r.details, avatar: r.avatar }));
                          handlePageUpdate('home', updated);
                        }
                      }}
                      alt={rev.couple || 'Client Avatar'}
                      height={44}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--gold-primary)', fontWeight: 700 }}>Client Photo 📸</span>
                </div>
                <textarea
                  rows={3}
                  value={rev.quote || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    let target = findHomeBlock(updated, 'Testimonials');
                    if (!target) {
                      target = { id: `block-test-${Date.now()}`, type: 'Testimonials', props: { reviews: [] } };
                      updated.push(target);
                    }
                    if (!target.props.reviews) target.props.reviews = JSON.parse(JSON.stringify(livingReviews));
                    if (target.props.reviews[revIdx]) {
                      target.props.reviews[revIdx].quote = e.target.value;
                      target.props.testimonials = target.props.reviews.map(r => ({ quote: r.quote, name: r.couple, event: r.details }));
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{ width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)', color: '#d4d4d8', fontSize: '0.88rem', lineHeight: 1.5, borderRadius: 4, padding: '4px', resize: 'none', marginBottom: 8, fontStyle: 'italic', boxSizing: 'border-box' }}
                />
                <input
                  type="text"
                  value={rev.couple || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    let target = findHomeBlock(updated, 'Testimonials');
                    if (!target) {
                      target = { id: `block-test-${Date.now()}`, type: 'Testimonials', props: { reviews: [] } };
                      updated.push(target);
                    }
                    if (!target.props.reviews) target.props.reviews = JSON.parse(JSON.stringify(livingReviews));
                    if (target.props.reviews[revIdx]) {
                      target.props.reviews[revIdx].couple = e.target.value;
                      target.props.testimonials = target.props.reviews.map(r => ({ quote: r.quote, name: r.couple, event: r.details }));
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{ width: '100%', background: 'transparent', border: '1px dashed rgba(212,175,55,0.3)', color: 'var(--gold-primary)', fontWeight: 800, fontSize: '12px', borderRadius: 4, padding: '2px 4px', marginBottom: 2, boxSizing: 'border-box' }}
                />
                <input
                  type="text"
                  value={rev.details || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(homeBlocks));
                    let target = findHomeBlock(updated, 'Testimonials');
                    if (!target) {
                      target = { id: `block-test-${Date.now()}`, type: 'Testimonials', props: { reviews: [] } };
                      updated.push(target);
                    }
                    if (!target.props.reviews) target.props.reviews = JSON.parse(JSON.stringify(livingReviews));
                    if (target.props.reviews[revIdx]) {
                      target.props.reviews[revIdx].details = e.target.value;
                      target.props.testimonials = target.props.reviews.map(r => ({ quote: r.quote, name: r.couple, event: r.details }));
                      handlePageUpdate('home', updated);
                    }
                  }}
                  style={{ width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.08)', color: '#71717a', fontSize: '11px', borderRadius: 4, padding: '2px 4px', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 9. Living VIP Studio Partner CTA Banner */}
        <section style={{
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.18) 0%, rgba(18,18,26,0.95) 80%)',
          border: '1px solid rgba(212,175,55,0.4)', borderRadius: 20,
          padding: isMob ? '2rem 1rem' : '3.5rem 2rem', textAlign: 'center'
        }}>
          <input
            type="text"
            value={studioCtaProps.title || 'Ready To Create Your Royal Heirloom?'}
            onChange={e => updateHomeBlockProp('StudioCtaBanner', 'title', e.target.value)}
            style={{
              width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.25)',
              color: '#fff', fontSize: isMob ? '1.5rem' : '2.2rem', fontWeight: 900, fontFamily: 'Cinzel, serif',
              textAlign: 'center', borderRadius: 6, padding: '4px', marginBottom: 10, boxSizing: 'border-box'
            }}
          />
          <textarea
            rows={2}
            value={studioCtaProps.subtitle || 'Explore transparent Per-Sheet pricing on all album sizes, order custom RAW skin retouching, or request studio wholesale partnership.'}
            onChange={e => updateHomeBlockProp('StudioCtaBanner', 'subtitle', e.target.value)}
            style={{
              width: '100%', maxWidth: '650px', margin: '0 auto 1.5rem', display: 'block',
              background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)',
              color: '#d4d4d8', fontSize: '0.92rem', lineHeight: 1.5, textAlign: 'center',
              borderRadius: 6, padding: '6px', resize: 'none', boxSizing: 'border-box'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={studioCtaProps.btn1Text || 'Browse All Products & Prices →'}
              onChange={e => updateHomeBlockProp('StudioCtaBanner', 'btn1Text', e.target.value)}
              style={{
                background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                border: 'none', color: '#000', fontWeight: 900, fontSize: '0.92rem',
                padding: '12px 24px', borderRadius: 10, cursor: 'text', textAlign: 'center'
              }}
            />
            <input
              type="text"
              value={studioCtaProps.btn2Text || 'Studio Trade Partner Portal (B2B)'}
              onChange={e => updateHomeBlockProp('StudioCtaBanner', 'btn2Text', e.target.value)}
              style={{
                background: 'rgba(56,189,248,0.15)',
                border: '1px solid #38bdf8', color: '#38bdf8', fontWeight: 800, fontSize: '0.92rem',
                padding: '12px 24px', borderRadius: 10, cursor: 'text', textAlign: 'center'
              }}
            />
          </div>
        </section>

        {/* 10. Living AP & TG Regional Delivery & Service Network */}
        <section style={{
          background: 'rgba(212, 175, 55, 0.04)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: 20,
          padding: isMob ? '1.5rem 1rem' : '2.5rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '750px', margin: '0 auto 1.5rem' }}>
            <div style={{ color: 'var(--gold-primary)', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 6 }}>
              ✦ DIRECT REGIONAL LAB COURIER DESK ✦
            </div>
            <h3 style={{ color: '#fff', fontSize: isMob ? '1.25rem' : '1.75rem', fontWeight: 800, fontFamily: 'Cinzel, serif', margin: '0 0 8px 0' }}>
              Serving Couples & Studios Across Andhra Pradesh & Telangana
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.88rem', margin: 0 }}>
              Express 24-48h safe insured courier dispatch to every major district hub with protective wooden crate packaging.
            </p>
          </div>

          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', maxWidth: '900px', margin: '0 auto 1.5rem'
          }}>
            {[
              { city: 'Vijayawada', tel: 'విజయవాడ', dist: 'Krishna' },
              { city: 'Visakhapatnam', tel: 'విశాఖపట్నం', dist: 'Vizag' },
              { city: 'Guntur', tel: 'గుంటూరు', dist: 'Central Lab' },
              { city: 'Hyderabad', tel: 'హైదరాబాద్', dist: 'TG Metro' },
              { city: 'Tirupati', tel: 'తిరుపతి', dist: 'Chittoor' },
              { city: 'Rajahmundry', tel: 'రాజమహేంద్రి', dist: 'East Godavari' },
              { city: 'Kurnool', tel: 'కర్నూలు', dist: 'Rayalaseema' },
              { city: 'Nellore', tel: 'నెల్లూరు', dist: 'South Coast' },
              { city: 'Warangal', tel: 'వరంగల్', dist: 'Telangana' },
              { city: 'Kakinada', tel: 'కాకినాడ', dist: 'Coastal Hub' }
            ].map((h, i) => (
              <div key={i} style={{
                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: 8, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px'
              }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>{h.city}</span>
                <span style={{ color: 'var(--gold-primary)', fontSize: '11px' }}>({h.tel})</span>
                <span style={{ color: '#71717a', fontSize: '10px' }}>• {h.dist}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', fontSize: '12px', fontWeight: 700 }}>
            <span>💬 WhatsApp Dispatch Hotline:</span>
            <span style={{ color: '#fff' }}>+{currentWhatsapp}</span>
          </div>
        </section>
      </div>
    );
  }

  // ── SECTION: STOREFRONT CATALOG (/shop) ───────────────────────────────────
  function renderLivingShopPage() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMob ? '1.5rem' : '3rem' }}>
        {/* Storefront Hero Banner */}
        <section style={{
          textAlign: 'center', maxWidth: '960px', margin: '0 auto', width: '100%',
          background: 'rgba(212,175,55,0.03)', border: '1px dashed rgba(212,175,55,0.3)',
          borderRadius: 20, padding: isMob ? '16px 12px' : '24px 20px', boxSizing: 'border-box'
        }}>
          <span style={{ fontSize: 10, color: 'var(--gold-primary)', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: 6 }}>
            Storefront Eyebrow ✏️
          </span>
          <input
            type="text"
            value={catalog.hubBanner?.eyebrow || ''}
            onChange={e => {
              const updated = JSON.parse(JSON.stringify(catalog));
              if (!updated.hubBanner) updated.hubBanner = {};
              updated.hubBanner.eyebrow = e.target.value;
              handleCatalogUpdate(updated);
            }}
            style={{
              width: '100%', maxWidth: '750px', margin: '0 auto 12px', display: 'block', textAlign: 'center',
              background: 'rgba(212,175,55,0.08)', border: '1px dashed rgba(212,175,55,0.3)',
              color: 'var(--gold-primary, #d4af37)', padding: '6px 14px', borderRadius: 999,
              fontSize: isMob ? '0.72rem' : '0.8rem', fontWeight: 700, letterSpacing: '1px', boxSizing: 'border-box'
            }}
          />

          <input
            type="text"
            value={catalog.hubBanner?.title || ''}
            onChange={e => {
              const updated = JSON.parse(JSON.stringify(catalog));
              if (!updated.hubBanner) updated.hubBanner = {};
              updated.hubBanner.title = e.target.value;
              handleCatalogUpdate(updated);
            }}
            style={{
              width: '100%', textAlign: 'center',
              background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
              color: '#fff', fontSize: isMob ? '1.4rem' : '2.2rem', fontWeight: 800,
              padding: '6px 12px', borderRadius: 8, marginBottom: 10, boxSizing: 'border-box'
            }}
          />

          <input
            type="text"
            value={catalog.hubBanner?.titleTel || ''}
            onChange={e => {
              const updated = JSON.parse(JSON.stringify(catalog));
              if (!updated.hubBanner) updated.hubBanner = {};
              updated.hubBanner.titleTel = e.target.value;
              handleCatalogUpdate(updated);
            }}
            style={{
              width: '100%', textAlign: 'center',
              background: 'transparent', border: '1px dashed rgba(212,175,55,0.2)',
              color: 'var(--gold-primary, #d4af37)', fontSize: isMob ? '0.95rem' : '1.05rem', fontWeight: 600,
              padding: '4px 12px', borderRadius: 8, marginBottom: 12, boxSizing: 'border-box'
            }}
          />

          <textarea
            rows={2}
            value={catalog.hubBanner?.subtitle || ''}
            onChange={e => {
              const updated = JSON.parse(JSON.stringify(catalog));
              if (!updated.hubBanner) updated.hubBanner = {};
              updated.hubBanner.subtitle = e.target.value;
              handleCatalogUpdate(updated);
            }}
            style={{
              width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'center',
              background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)',
              color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5',
              padding: '6px 12px', borderRadius: 8, resize: 'none', boxSizing: 'border-box'
            }}
          />
        </section>

        {/* Category Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `✨ All Products (${albumSizes.length + sheetStyles.length + videoServices.length + flexServices.length})` },
            { id: 'albums', label: `📖 Heirloom Albums (${albumSizes.length})` },
            { id: 'sheets', label: `🧻 Paper Finishes (${sheetStyles.length})` },
            { id: 'video', label: `🎬 4K Video Editing (${videoServices.length})` },
            { id: 'flex', label: `💌 Flex & Invites (${flexServices.length})` },
            { id: 'photo', label: `🎨 Photo Retouching (${photoServices.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setB2cCategory(tab.id)}
              style={{
                padding: '8px 14px', borderRadius: 10,
                background: b2cCategory === tab.id ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)',
                border: b2cCategory === tab.id ? '1px solid var(--gold-primary, #d4af37)' : '1px solid rgba(255,255,255,0.08)',
                color: b2cCategory === tab.id ? 'var(--gold-primary, #d4af37)' : '#a1a1aa',
                fontSize: isMob ? '0.78rem' : '0.88rem', fontWeight: 700, cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Album Sizes Grid */}
        {(b2cCategory === 'albums' || b2cCategory === 'all') && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: isMob ? '1.25rem' : '1.5rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                  📖 Heirloom Layflat Wedding Albums
                </h2>
                <span style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>
                  HP Indigo 12000 HD · 180° Layflat Binding · Selectable Up to 150 Sheets
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', padding: 3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  {['all', 'landscape', 'portrait'].map(o => (
                    <button
                      key={o}
                      onClick={() => setOrientationFilter(o)}
                      style={{
                        padding: '4px 8px', borderRadius: 6, border: 'none',
                        background: orientationFilter === o ? 'var(--gold-primary, #d4af37)' : 'transparent',
                        color: orientationFilter === o ? '#000' : '#a1a1aa',
                        fontSize: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize'
                      }}
                    >
                      {o === 'all' ? 'All' : o === 'landscape' ? '↔️ Landscape' : '↕️ Portrait'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const updated = JSON.parse(JSON.stringify(catalog));
                    if (!updated.albumPrinting) updated.albumPrinting = {};
                    if (!updated.albumPrinting.albumSizes) updated.albumPrinting.albumSizes = [];
                    updated.albumPrinting.albumSizes.push({
                      id: `size-${Date.now()}`,
                      name: '12×36 Royal Panoramic Album',
                      telugu: '12×36 రాయల్ పానోరమిక్ వెడ్డింగ్ ఆల్బమ్',
                      dimensions: '12×36 inches',
                      orientation: 'landscape',
                      clientPricePerSheet: 260,
                      wholesalePerSheet: 180,
                      studioPricePerSheet: 180,
                      clientBasePrice: 9500,
                      coverChargeStudio: 1100,
                      coverChargeRetail: 1700,
                      turnaround: '2-3 Working Days',
                      defaultSheets: 30,
                      minSheets: 20,
                      maxSheets: 150,
                      popular: true,
                      badge: 'Bestseller',
                      image: '/images/weddingalbums-layflat-album.png',
                      description: '12×36 open spread with layflat archival binding.'
                    });
                    handleCatalogUpdate(updated);
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 8,
                    background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)',
                    color: 'var(--gold-primary, #d4af37)', fontSize: 11, fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  <Plus size={13} /> + Add Size
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {filteredAlbumSizes.map((size, idx) => {
                const retailPerSheet = Number(size.clientPricePerSheet || 260);

                return (
                  <article key={size.id || idx} style={{
                    background: 'rgba(18, 18, 26, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 16, overflow: 'hidden', position: 'relative',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column'
                  }}>
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <PointOfUseImageUploader
                        imageUrl={size.image || '/images/weddingalbums-layflat-album.png'}
                        onImageChange={(newUrl) => {
                          const updated = JSON.parse(JSON.stringify(catalog));
                          updated.albumPrinting.albumSizes[idx].image = newUrl;
                          handleCatalogUpdate(updated);
                        }}
                        alt={size.name || size.title}
                        height={150}
                      />

                      <div style={{ position: 'absolute', top: 8, left: 8, right: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none', zIndex: 12 }}>
                        <span style={{ 
                          fontSize: 9, fontWeight: 800, textTransform: 'uppercase', padding: '3px 7px', borderRadius: 6,
                          background: size.orientation === 'portrait' ? 'rgba(168,85,247,0.85)' : 'rgba(56,189,248,0.85)',
                          color: '#fff', border: '1px solid currentColor', pointerEvents: 'auto'
                        }}>
                          {size.orientation === 'portrait' ? '↕️ Portrait' : '↔️ Landscape'}
                        </span>

                        <button
                          onClick={() => {
                            const updated = JSON.parse(JSON.stringify(catalog));
                            updated.albumPrinting.albumSizes.splice(idx, 1);
                            handleCatalogUpdate(updated);
                          }}
                          style={{ background: 'rgba(239,68,68,0.85)', border: 'none', color: '#fff', borderRadius: 6, padding: '3px 6px', cursor: 'pointer', pointerEvents: 'auto' }}
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <input
                        type="text"
                        value={size.name || size.title || ''}
                        onChange={e => {
                          const updated = JSON.parse(JSON.stringify(catalog));
                          updated.albumPrinting.albumSizes[idx].name = e.target.value;
                          handleCatalogUpdate(updated);
                        }}
                        style={{
                          width: '100%', background: 'rgba(255,255,255,0.03)',
                          border: '1px dashed rgba(212,175,55,0.3)', borderRadius: 6,
                          color: '#fff', fontSize: '0.98rem', fontWeight: 800, padding: '4px 8px', boxSizing: 'border-box', marginBottom: 6
                        }}
                      />

                      <input
                        type="text"
                        value={size.telugu || ''}
                        onChange={e => {
                          const updated = JSON.parse(JSON.stringify(catalog));
                          updated.albumPrinting.albumSizes[idx].telugu = e.target.value;
                          handleCatalogUpdate(updated);
                        }}
                        style={{
                          width: '100%', background: 'rgba(255,255,255,0.03)',
                          border: '1px dashed rgba(212,175,55,0.2)', borderRadius: 6,
                          color: 'var(--gold-primary, #d4af37)', fontSize: '0.82rem', fontWeight: 600, padding: '3px 8px', boxSizing: 'border-box', marginBottom: 8
                        }}
                      />

                      <div style={{
                        background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.25)',
                        borderRadius: 8, padding: '8px 10px', marginBottom: 10,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                        <span style={{ fontSize: 10, color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 700 }}>Per-Sheet Rate:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <span style={{ color: 'var(--gold-primary)', fontWeight: 800 }}>₹</span>
                          <input
                            type="number"
                            value={retailPerSheet}
                            onChange={e => {
                              const updated = JSON.parse(JSON.stringify(catalog));
                              updated.albumPrinting.albumSizes[idx].clientPricePerSheet = Number(e.target.value);
                              handleCatalogUpdate(updated);
                            }}
                            style={{
                              width: '65px', background: 'transparent',
                              border: '1px dashed var(--gold-primary)', borderRadius: 4,
                              color: 'var(--gold-primary)', fontSize: '1.15rem', fontWeight: 900, padding: '2px 4px'
                            }}
                          />
                          <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>/ sheet</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#a1a1aa', marginTop: 'auto' }}>
                        <span>Turnaround:</span>
                        <input
                          type="text"
                          value={size.turnaround || '2-3 Working Days'}
                          onChange={e => {
                            const updated = JSON.parse(JSON.stringify(catalog));
                            updated.albumPrinting.albumSizes[idx].turnaround = e.target.value;
                            handleCatalogUpdate(updated);
                          }}
                          style={{ width: '130px', background: 'transparent', border: '1px dashed #555', color: '#10b981', fontWeight: 600, borderRadius: 3, padding: '1px 3px', textAlign: 'right' }}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Paper Finishes & Surfaces Grid */}
        {(b2cCategory === 'sheets' || b2cCategory === 'all') && (
          <section style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: isMob ? '1.25rem' : '1.5rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                  🧻 Archival Paper Finishes & Surfaces
                </h2>
                <span style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>
                  200-Year UV Archival · Waterproof Lay-Flat Synthetic Core · Fingerprint Resistant
                </span>
              </div>
              <button
                onClick={() => {
                  const updated = JSON.parse(JSON.stringify(catalog));
                  if (!updated.albumPrinting) updated.albumPrinting = {};
                  if (!updated.albumPrinting.sheetStyles) updated.albumPrinting.sheetStyles = [];
                  updated.albumPrinting.sheetStyles.push({
                    id: `sheet-${Date.now()}`,
                    name: 'New Archival Paper Surface',
                    telugu: 'కొత్త పేపర్ రకం',
                    tier: 'luxury',
                    clientPricePerSheet: 30,
                    clientPriceBadge: '+₹30 / sheet',
                    gsm: '350 GSM Lay-Flat',
                    image: '/images/weddingalbums-layflat-album.png',
                    description: 'Archival paper description.'
                  });
                  handleCatalogUpdate(updated);
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8,
                  background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)',
                  color: 'var(--gold-primary, #d4af37)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                + Add Paper Style
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {sheetStyles.map((sheet, sIdx) => (
                <article key={sheet.id || sIdx} style={{
                  background: 'rgba(18, 18, 26, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 16, overflow: 'hidden', position: 'relative',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <PointOfUseImageUploader
                      imageUrl={sheet.image || '/images/weddingalbums-layflat-album.png'}
                      onImageChange={(newUrl) => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.albumPrinting.sheetStyles[sIdx].image = newUrl;
                        handleCatalogUpdate(updated);
                      }}
                      alt={sheet.name}
                      height={140}
                    />
                    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 12 }}>
                      <button
                        onClick={() => {
                          const updated = JSON.parse(JSON.stringify(catalog));
                          updated.albumPrinting.sheetStyles.splice(sIdx, 1);
                          handleCatalogUpdate(updated);
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.8)', border: 'none', borderRadius: 6,
                          width: 26, height: 26, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        title="Delete paper style"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <input
                      type="text"
                      value={sheet.name || ''}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.albumPrinting.sheetStyles[sIdx].name = e.target.value;
                        handleCatalogUpdate(updated);
                      }}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.03)',
                        border: '1px dashed rgba(212,175,55,0.3)', borderRadius: 6,
                        color: '#fff', fontSize: '0.95rem', fontWeight: 800, padding: '4px 8px', boxSizing: 'border-box', marginBottom: 6
                      }}
                    />

                    <input
                      type="text"
                      value={sheet.telugu || ''}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.albumPrinting.sheetStyles[sIdx].telugu = e.target.value;
                        handleCatalogUpdate(updated);
                      }}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.03)',
                        border: '1px dashed rgba(212,175,55,0.2)', borderRadius: 6,
                        color: 'var(--gold-primary, #d4af37)', fontSize: '0.82rem', fontWeight: 600, padding: '3px 8px', boxSizing: 'border-box', marginBottom: 8
                      }}
                    />

                    <div style={{
                      background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.25)',
                      borderRadius: 8, padding: '8px 10px', marginBottom: 10,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span style={{ fontSize: 10, color: '#a1a1aa', textTransform: 'uppercase', fontWeight: 700 }}>Sheet Surcharge:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ color: 'var(--gold-primary)', fontWeight: 800 }}>+₹</span>
                        <input
                          type="number"
                          value={Number(sheet.clientPricePerSheet || 0)}
                          onChange={e => {
                            const updated = JSON.parse(JSON.stringify(catalog));
                            const val = Number(e.target.value);
                            updated.albumPrinting.sheetStyles[sIdx].clientPricePerSheet = val;
                            updated.albumPrinting.sheetStyles[sIdx].clientPriceBadge = val === 0 ? 'Included (₹0)' : `+₹${val} / sheet`;
                            handleCatalogUpdate(updated);
                          }}
                          style={{
                            width: '55px', background: 'transparent',
                            border: '1px dashed var(--gold-primary)', borderRadius: 4,
                            color: 'var(--gold-primary)', fontSize: '1.1rem', fontWeight: 900, padding: '2px 4px'
                          }}
                        />
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>/ spread</span>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={sheet.description || ''}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.albumPrinting.sheetStyles[sIdx].description = e.target.value;
                        handleCatalogUpdate(updated);
                      }}
                      style={{
                        width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)',
                        color: '#a1a1aa', fontSize: '0.8rem', lineHeight: '1.4', borderRadius: 4, padding: '4px', resize: 'none', boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 4K Cinematic Video Editing Packages */}
        {(b2cCategory === 'video' || b2cCategory === 'all') && (
          <section style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: isMob ? '1.25rem' : '1.5rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                  🎬 4K Cinematic Wedding Video Editing
                </h2>
                <span style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>
                  Multi-Camera Sync · Licensed Telugu Mangala Vaadhyam · 48h Express SLA
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {videoServices.map((vid, vIdx) => (
                <article key={vid.id || vIdx} style={{
                  background: 'rgba(18, 18, 26, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 16, overflow: 'hidden', position: 'relative',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <PointOfUseImageUploader
                      imageUrl={vid.image || '/images/cinematic-video-suite.jpg'}
                      onImageChange={(newUrl) => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.videoEditing[vIdx].image = newUrl;
                        handleCatalogUpdate(updated);
                      }}
                      alt={vid.title || vid.name}
                      height={150}
                    />
                  </div>

                  <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <input
                      type="text"
                      value={vid.title || vid.name || ''}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.videoEditing[vIdx].title = e.target.value;
                        handleCatalogUpdate(updated);
                      }}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.03)',
                        border: '1px dashed rgba(212,175,55,0.3)', borderRadius: 6,
                        color: '#fff', fontSize: '0.98rem', fontWeight: 800, padding: '4px 8px', boxSizing: 'border-box', marginBottom: 6
                      }}
                    />

                    <input
                      type="text"
                      value={vid.telugu || ''}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.videoEditing[vIdx].telugu = e.target.value;
                        handleCatalogUpdate(updated);
                      }}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.03)',
                        border: '1px dashed rgba(212,175,55,0.2)', borderRadius: 6,
                        color: 'var(--gold-primary, #d4af37)', fontSize: '0.82rem', fontWeight: 600, padding: '3px 8px', boxSizing: 'border-box', marginBottom: 8
                      }}
                    />

                    <div style={{
                      background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)',
                      borderRadius: 8, padding: '6px 10px', marginBottom: 10,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span style={{ fontSize: 10, color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>Rate / SLA:</span>
                      <input
                        type="text"
                        value={vid.clientPriceBadge || 'Included / Custom'}
                        onChange={e => {
                          const updated = JSON.parse(JSON.stringify(catalog));
                          updated.videoEditing[vIdx].clientPriceBadge = e.target.value;
                          handleCatalogUpdate(updated);
                        }}
                        style={{
                          width: '130px', background: 'transparent',
                          border: '1px dashed #38bdf8', borderRadius: 4,
                          color: '#38bdf8', fontSize: '0.9rem', fontWeight: 800, padding: '2px 4px', textAlign: 'right'
                        }}
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={vid.desc || ''}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.videoEditing[vIdx].desc = e.target.value;
                        handleCatalogUpdate(updated);
                      }}
                      style={{
                        width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)',
                        color: '#a1a1aa', fontSize: '0.8rem', lineHeight: '1.4', borderRadius: 4, padding: '4px', resize: 'none', boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Event Flex Banners & WhatsApp Invites */}
        {(b2cCategory === 'flex' || b2cCategory === 'all') && (
          <section style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: isMob ? '1.25rem' : '1.5rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                  💌 WhatsApp Invites & Mandap Flex
                </h2>
                <span style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>
                  Animated Video Invitations · Weatherproof Mandap Flex Banners & Roll-Up Standees
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {flexServices.map((flx, fIdx) => (
                <article key={flx.id || fIdx} style={{
                  background: 'rgba(18, 18, 26, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 16, overflow: 'hidden', position: 'relative',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <PointOfUseImageUploader
                      imageUrl={flx.image || '/images/opt/weddingalbums-home-herow1600.webp'}
                      onImageChange={(newUrl) => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.invitationsAndFlex[fIdx].image = newUrl;
                        handleCatalogUpdate(updated);
                      }}
                      alt={flx.title || flx.name}
                      height={150}
                    />
                  </div>

                  <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <input
                      type="text"
                      value={flx.title || flx.name || ''}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.invitationsAndFlex[fIdx].title = e.target.value;
                        handleCatalogUpdate(updated);
                      }}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.03)',
                        border: '1px dashed rgba(212,175,55,0.3)', borderRadius: 6,
                        color: '#fff', fontSize: '0.98rem', fontWeight: 800, padding: '4px 8px', boxSizing: 'border-box', marginBottom: 6
                      }}
                    />

                    <input
                      type="text"
                      value={flx.telugu || ''}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.invitationsAndFlex[fIdx].telugu = e.target.value;
                        handleCatalogUpdate(updated);
                      }}
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.03)',
                        border: '1px dashed rgba(212,175,55,0.2)', borderRadius: 6,
                        color: 'var(--gold-primary, #d4af37)', fontSize: '0.82rem', fontWeight: 600, padding: '3px 8px', boxSizing: 'border-box', marginBottom: 8
                      }}
                    />

                    <div style={{
                      background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)',
                      borderRadius: 8, padding: '6px 10px', marginBottom: 10,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <span style={{ fontSize: 10, color: '#eab308', textTransform: 'uppercase', fontWeight: 700 }}>Starting Price:</span>
                      <input
                        type="text"
                        value={flx.clientPriceBadge || '₹30 / sq.ft'}
                        onChange={e => {
                          const updated = JSON.parse(JSON.stringify(catalog));
                          updated.invitationsAndFlex[fIdx].clientPriceBadge = e.target.value;
                          handleCatalogUpdate(updated);
                        }}
                        style={{
                          width: '130px', background: 'transparent',
                          border: '1px dashed #eab308', borderRadius: 4,
                          color: '#eab308', fontSize: '0.9rem', fontWeight: 800, padding: '2px 4px', textAlign: 'right'
                        }}
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={flx.desc || ''}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.invitationsAndFlex[fIdx].desc = e.target.value;
                        handleCatalogUpdate(updated);
                      }}
                      style={{
                        width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)',
                        color: '#a1a1aa', fontSize: '0.8rem', lineHeight: '1.4', borderRadius: 4, padding: '4px', resize: 'none', boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ── SECTION: ABOUT US (/about) ─────────────────────────────────────────────
  function renderLivingAboutPage() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMob ? '1.5rem' : '3.5rem' }}>
        <section style={{
          position: 'relative',
          borderRadius: isMob ? 16 : 24,
          overflow: 'hidden',
          minHeight: isMob ? '320px' : '420px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: isMob ? '2rem 1rem' : '3rem 2rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          border: '1px solid rgba(212,175,55,0.25)'
        }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <PointOfUseImageUploader
              imageUrl={aboutHero.bgImage || '/images/opt/weddingalbums-home-herow1600.webp'}
              onImageChange={(newUrl) => updateAboutBlockProp('PageHero', 'bgImage', newUrl)}
              alt="About Us Hero Banner"
              height="100%"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(9,9,14,0.75) 0%, rgba(9,9,14,0.95) 85%)', pointerEvents: 'none' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', width: '100%' }}>
            <input
              type="text"
              value={aboutHero.eyebrow || ''}
              onChange={e => updateAboutBlockProp('PageHero', 'eyebrow', e.target.value)}
              style={{
                background: 'rgba(212,175,55,0.12)', border: '1px dashed var(--gold-primary, #d4af37)',
                color: 'var(--gold-primary, #d4af37)', padding: '4px 14px', borderRadius: 999,
                fontSize: isMob ? '0.72rem' : '0.85rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase',
                textAlign: 'center', margin: '0 auto 1rem', display: 'inline-block'
              }}
            />

            <input
              type="text"
              value={aboutHero.title || 'The Cinematic Engine'}
              onChange={e => updateAboutBlockProp('PageHero', 'title', e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.25)',
                color: '#fff', fontSize: isMob ? '1.6rem' : '2.8rem', fontWeight: 900,
                fontFamily: 'Cinzel, serif', textAlign: 'center', padding: '4px 8px', borderRadius: 8,
                marginBottom: '0.6rem', boxSizing: 'border-box'
              }}
            />

            <textarea
              rows={2}
              value={aboutHero.subtitle || ''}
              onChange={e => updateAboutBlockProp('PageHero', 'subtitle', e.target.value)}
              style={{
                width: '100%', maxWidth: '700px', margin: '0 auto', display: 'block',
                background: 'transparent', border: '1px dashed rgba(255,255,255,0.18)',
                color: '#d4d4d8', fontSize: isMob ? '0.85rem' : '1.02rem', lineHeight: '1.6',
                textAlign: 'center', padding: '6px 12px', borderRadius: 8, resize: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
        </section>

        {/* 5 Living About Value Pillars */}
        <section>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
            <h2 style={{ fontSize: isMob ? '1.35rem' : '1.8rem', color: '#fff', margin: '0 0 8px 0', fontWeight: 800 }}>
              ✦ The Pillars Behind Every Heirloom ✦
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: 0 }}>
              Crafting wedding memories with precision, dedication, and cutting-edge post-production technology.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {aboutPillars.map((pil, pIdx) => (
              <div key={pIdx} style={{
                background: 'rgba(18, 18, 26, 0.85)', border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: 16, padding: '20px', position: 'relative',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 900 }}>
                    PILLAR 0{pIdx + 1}
                  </span>
                  <Award size={20} color="var(--gold-primary)" />
                </div>

                <input
                  type="text"
                  value={pil.title || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(aboutBlocks));
                    const target = updated.find(b => b.type === 'PillarsList');
                    if (target && target.props?.pillars) {
                      target.props.pillars[pIdx].title = e.target.value;
                      handlePageUpdate('about', updated);
                    }
                  }}
                  style={{
                    width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
                    color: '#fff', fontSize: '1.1rem', fontWeight: 800, padding: '4px 6px', borderRadius: 4, marginBottom: 8, boxSizing: 'border-box'
                  }}
                />

                <textarea
                  rows={3}
                  value={pil.desc || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(aboutBlocks));
                    const target = updated.find(b => b.type === 'PillarsList');
                    if (target && target.props?.pillars) {
                      target.props.pillars[pIdx].desc = e.target.value;
                      handlePageUpdate('about', updated);
                    }
                  }}
                  style={{
                    width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)',
                    color: '#a1a1aa', fontSize: '0.88rem', lineHeight: '1.5', padding: '4px 6px', borderRadius: 4, resize: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Living 4-Metric Proof Bar */}
        <section style={{
          display: 'grid', gridTemplateColumns: isMob ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: 12, background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: 16, padding: isMob ? '16px 12px' : '24px 20px', textAlign: 'center'
        }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: isMob ? '1.5rem' : '2rem', color: 'var(--gold-primary)', fontWeight: 900 }}>500+</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a1a1aa' }}>Albums Handcrafted</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: isMob ? '1.5rem' : '2rem', color: 'var(--gold-primary)', fontWeight: 900 }}>12+</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a1a1aa' }}>Years Experience</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: isMob ? '1.5rem' : '2rem', color: 'var(--gold-primary)', fontWeight: 900 }}>4.9★</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a1a1aa' }}>Average Rating</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: isMob ? '1.5rem' : '2rem', color: 'var(--gold-primary)', fontWeight: 900 }}>72h</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a1a1aa' }}>Express Turnaround</p>
          </div>
        </section>
      </div>
    );
  }

  // ── SECTION: SERVICES HUB (/services) ────────────────────────────────────
  function renderLivingServicesPage() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMob ? '1.5rem' : '3.5rem' }}>
        <section style={{
          position: 'relative',
          borderRadius: isMob ? 16 : 24,
          overflow: 'hidden',
          minHeight: isMob ? '300px' : '380px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: isMob ? '2rem 1rem' : '3rem 2rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          border: '1px solid rgba(212,175,55,0.25)'
        }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <PointOfUseImageUploader
              imageUrl={content?.global?.siteImages?.servicesHeroImage || '/images/weddingalbums-home-hero.png'}
              onImageChange={(newUrl) => updateGlobal('siteImages', { ...(content?.global?.siteImages || {}), servicesHeroImage: newUrl })}
              alt="Services Hub Hero"
              height="100%"
            />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(9,9,14,0.78) 0%, rgba(9,9,14,0.96) 85%)', pointerEvents: 'none' }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', width: '100%' }}>
            <span style={{
              background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
              color: 'var(--gold-primary)', padding: '4px 12px', borderRadius: 999,
              fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, display: 'inline-block'
            }}>
              ✦ 100% IN-HOUSE POST-PRODUCTION SUITE ✦
            </span>
            <h1 style={{ margin: '0 0 10px 0', fontSize: isMob ? '1.6rem' : '2.6rem', color: '#fff', fontWeight: 900, fontFamily: 'Cinzel, serif' }}>
              Complete Wedding Media Services
            </h1>
            <p style={{ margin: '0 auto', maxWidth: '640px', color: '#d4d4d8', fontSize: '0.92rem', lineHeight: '1.5' }}>
              Professional skin retouching, 4K cinematic video editing, archival lay-flat printing, and event flex design — all handled under one roof.
            </p>
          </div>
        </section>

        {/* Service Category Tabs */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {[
              { id: 'photo-editing', label: `🎨 Photo Editing (${photoServices.length})` },
              { id: 'video-editing', label: `🎬 Video Editing (${videoServices.length})` },
              { id: 'album-printing', label: `📖 Album Printing (${albumSizes.length})` },
              { id: 'invitations-flex', label: `💌 Invitations & Flex (${flexServices.length})` },
              { id: 'bundles', label: `📦 Bundles (${bundleServices.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setServicesTab(tab.id)}
                style={{
                  padding: '8px 16px', borderRadius: 10,
                  background: servicesTab === tab.id ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)',
                  border: servicesTab === tab.id ? '1px solid var(--gold-primary, #d4af37)' : '1px solid rgba(255,255,255,0.08)',
                  color: servicesTab === tab.id ? 'var(--gold-primary, #d4af37)' : '#a1a1aa',
                  fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Service Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {(servicesTab === 'photo-editing' ? photoServices :
              servicesTab === 'video-editing' ? videoServices :
              servicesTab === 'invitations-flex' ? flexServices :
              servicesTab === 'bundles' ? bundleServices : []
            ).map((srv, sIdx) => (
              <div key={srv.id || sIdx} style={{
                background: 'rgba(18, 18, 26, 0.85)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <input
                    type="text"
                    value={srv.title || ''}
                    onChange={e => {
                      const updated = JSON.parse(JSON.stringify(catalog));
                      const listKey = servicesTab === 'photo-editing' ? 'photoEditing' :
                                      servicesTab === 'video-editing' ? 'videoEditing' :
                                      servicesTab === 'invitations-flex' ? 'invitationsAndFlex' : 'bundles';
                      if (updated[listKey] && updated[listKey][sIdx]) {
                        updated[listKey][sIdx].title = e.target.value;
                        handleCatalogUpdate(updated);
                      }
                    }}
                    style={{
                      width: '75%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
                      color: '#fff', fontSize: '1rem', fontWeight: 800, borderRadius: 4, padding: '2px 4px'
                    }}
                  />
                  <input
                    type="text"
                    value={srv.clientPriceBadge || '₹15 / photo'}
                    onChange={e => {
                      const updated = JSON.parse(JSON.stringify(catalog));
                      const listKey = servicesTab === 'photo-editing' ? 'photoEditing' :
                                      servicesTab === 'video-editing' ? 'videoEditing' :
                                      servicesTab === 'invitations-flex' ? 'invitationsAndFlex' : 'bundles';
                      if (updated[listKey] && updated[listKey][sIdx]) {
                        updated[listKey][sIdx].clientPriceBadge = e.target.value;
                        handleCatalogUpdate(updated);
                      }
                    }}
                    style={{
                      width: '90px', background: 'rgba(212,175,55,0.15)', border: '1px dashed var(--gold-primary)',
                      color: 'var(--gold-primary)', fontSize: '10px', fontWeight: 800, borderRadius: 4, padding: '2px 4px', textAlign: 'right'
                    }}
                  />
                </div>

                <input
                  type="text"
                  value={srv.telugu || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(catalog));
                    const listKey = servicesTab === 'photo-editing' ? 'photoEditing' :
                                    servicesTab === 'video-editing' ? 'videoEditing' :
                                    servicesTab === 'invitations-flex' ? 'invitationsAndFlex' : 'bundles';
                    if (updated[listKey] && updated[listKey][sIdx]) {
                      updated[listKey][sIdx].telugu = e.target.value;
                      handleCatalogUpdate(updated);
                    }
                  }}
                  style={{
                    width: '100%', background: 'transparent', border: '1px dashed rgba(212,175,55,0.2)',
                    color: 'var(--gold-primary)', fontSize: '0.85rem', fontWeight: 600, borderRadius: 4, padding: '2px 4px', marginBottom: 8
                  }}
                />

                <textarea
                  rows={2}
                  value={srv.desc || ''}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(catalog));
                    const listKey = servicesTab === 'photo-editing' ? 'photoEditing' :
                                    servicesTab === 'video-editing' ? 'videoEditing' :
                                    servicesTab === 'invitations-flex' ? 'invitationsAndFlex' : 'bundles';
                    if (updated[listKey] && updated[listKey][sIdx]) {
                      updated[listKey][sIdx].desc = e.target.value;
                      handleCatalogUpdate(updated);
                    }
                  }}
                  style={{
                    width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)',
                    color: '#a1a1aa', fontSize: '0.82rem', lineHeight: '1.4', borderRadius: 4, padding: '4px', resize: 'none', marginBottom: 10
                  }}
                />

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8, marginTop: 'auto' }}>
                  {(srv.features || []).map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: 'var(--gold-primary)', fontSize: 10 }}>✓</span>
                      <input
                        type="text"
                        value={feat}
                        onChange={e => {
                          const updated = JSON.parse(JSON.stringify(catalog));
                          const listKey = servicesTab === 'photo-editing' ? 'photoEditing' :
                                          servicesTab === 'video-editing' ? 'videoEditing' :
                                          servicesTab === 'invitations-flex' ? 'invitationsAndFlex' : 'bundles';
                          if (updated[listKey]?.[sIdx]?.features) {
                            updated[listKey][sIdx].features[fIdx] = e.target.value;
                            handleCatalogUpdate(updated);
                          }
                        }}
                        style={{ flex: 1, background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', color: '#d4d4d8', fontSize: '11px', borderRadius: 4, padding: '1px 4px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ── SECTION: CONTACT LAB (/contact) ───────────────────────────────────────
  function renderLivingContactPage() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMob ? '1.5rem' : '3rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
          <span style={{ fontSize: '11px', color: 'var(--gold-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            ✦ DIRECT LAB DISPATCH & SUPPORT ✦
          </span>
          <h1 style={{ margin: '6px 0 10px 0', fontSize: isMob ? '1.6rem' : '2.5rem', color: '#fff', fontWeight: 900 }}>
            Contact Central Production Lab
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '0.92rem', margin: 0 }}>
            Edits made here update live on the Client Contact page, Header, and Footer automatically.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : '1.2fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(18, 18, 26, 0.85)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 16, padding: '20px' }}>
              <h3 style={{ margin: '0 0 14px 0', color: 'var(--gold-primary)', fontSize: '1.1rem' }}>
                Central Production Lab Details
              </h3>
              
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 10, color: '#a1a1aa', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    Lab Support Hotline ✏️
                  </label>
                  <input
                    type="text"
                    value={currentPhone}
                    onChange={e => updateContactInfo('phone', e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--gold-primary)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: '1rem', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 10, color: '#a1a1aa', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    Official Orders Email ✏️
                  </label>
                  <input
                    type="text"
                    value={currentEmail}
                    onChange={e => updateContactInfo('email', e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 10, color: '#a1a1aa', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    Lab Physical Address (For Courier / Hard Disk Drop-Off) ✏️
                  </label>
                  <textarea
                    rows={2}
                    value={currentAddress}
                    onChange={e => updateContactInfo('address', e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: '0.9rem', lineHeight: 1.4, resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 10, color: '#a1a1aa', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    WhatsApp Hotline Number ✏️
                  </label>
                  <input
                    type="text"
                    value={currentWhatsapp}
                    onChange={e => updateContactInfo('whatsapp', e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px dashed #10b981', color: '#10b981', padding: '6px 10px', borderRadius: 6, fontSize: '0.95rem', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(18, 18, 26, 0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '20px' }}>
            <span style={{ fontSize: 10, color: '#71717a', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: 6 }}>
              Live Client Contact Form Preview
            </span>
            <h3 style={{ margin: '0 0 14px 0', color: '#fff', fontSize: '1.15rem' }}>Send Us An Instant Enquiry</h3>

            <div style={{ display: 'grid', gap: 10 }}>
              <input type="text" placeholder="Full Name" disabled style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 10px', borderRadius: 6, color: '#71717a', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Phone Number (for WhatsApp quote)" disabled style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 10px', borderRadius: 6, color: '#71717a', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Wedding Date / Muhurtham" disabled style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 10px', borderRadius: 6, color: '#71717a', boxSizing: 'border-box' }} />
              <textarea rows={3} placeholder="Tell us what you need (e.g. 12x36 Album + Video editing)..." disabled style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 10px', borderRadius: 6, color: '#71717a', resize: 'none', boxSizing: 'border-box' }} />
              <button disabled style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', border: 'none', color: '#000', fontWeight: 800, padding: '10px', borderRadius: 8, cursor: 'not-allowed', opacity: 0.85 }}>
                Submit Quote Request →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── SECTION: GLOBAL ELEMENTS ──────────────────────────────────────────────
  function renderLivingGlobalPage() {
    return (
      <div style={{ display: 'grid', gap: '2rem' }}>
        <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 14, padding: '16px 20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#fff', fontWeight: 800 }}>🌐 Global Brand Elements, Lab Phone & Address</h2>
          <span style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Changes here sync automatically across the whole website.</span>
        </div>

        <div style={{ background: 'rgba(18, 18, 26, 0.9)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 16, padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: 'var(--gold-primary)' }}>Header Contact Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 10, color: '#a1a1aa', fontWeight: 700, display: 'block', marginBottom: 4 }}>Lab Support Phone ✏️</label>
              <input
                type="text"
                value={currentPhone}
                onChange={e => updateContactInfo('phone', e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: '0.95rem', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, color: '#a1a1aa', fontWeight: 700, display: 'block', marginBottom: 4 }}>Support Email ✏️</label>
              <input
                type="text"
                value={currentEmail}
                onChange={e => updateContactInfo('email', e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)', color: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: '0.95rem', fontWeight: 700, boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(18, 18, 26, 0.9)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 16, padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: 'var(--gold-primary)' }}>Footer & Physical Lab Dispatch Address</h3>
          <div>
            <label style={{ fontSize: 10, color: '#a1a1aa', fontWeight: 700, display: 'block', marginBottom: 4 }}>Central Lab Address ✏️</label>
            <textarea
              rows={3}
              value={currentAddress}
              onChange={e => updateContactInfo('address', e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)', color: '#fff', padding: '8px 12px', borderRadius: 6, fontSize: '0.95rem', lineHeight: 1.5, resize: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── SECTION: B2B LANDING PAGE ─────────────────────────────────────────────
  function renderLivingB2bLandingPage() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMob ? '1.5rem' : '3.5rem' }}>
        <section style={{
          textAlign: 'center', maxWidth: '960px', margin: '0 auto', width: '100%',
          background: 'radial-gradient(circle at center, rgba(56,189,248,0.12) 0%, rgba(18,18,26,0.95) 75%)',
          border: '1px solid rgba(56,189,248,0.3)', borderRadius: 20, padding: isMob ? '20px 14px' : '32px 24px', boxSizing: 'border-box'
        }}>
          <input
            type="text"
            value={b2bData.landingHero?.eyebrow || ''}
            onChange={e => {
              const updated = JSON.parse(JSON.stringify(b2bData));
              if (!updated.landingHero) updated.landingHero = {};
              updated.landingHero.eyebrow = e.target.value;
              handleB2bUpdate(updated);
            }}
            style={{
              width: '100%', maxWidth: '650px', margin: '0 auto 12px', display: 'block', textAlign: 'center',
              background: 'rgba(56,189,248,0.1)', border: '1px dashed rgba(56,189,248,0.4)',
              color: '#38bdf8', padding: '6px 14px', borderRadius: 999,
              fontSize: isMob ? '0.72rem' : '0.82rem', fontWeight: 800, letterSpacing: '1px', boxSizing: 'border-box'
            }}
          />

          <input
            type="text"
            value={b2bData.landingHero?.title || ''}
            onChange={e => {
              const updated = JSON.parse(JSON.stringify(b2bData));
              if (!updated.landingHero) updated.landingHero = {};
              updated.landingHero.title = e.target.value;
              handleB2bUpdate(updated);
            }}
            style={{
              width: '100%', textAlign: 'center',
              background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
              color: '#fff', fontSize: isMob ? '1.5rem' : '2.5rem', fontWeight: 900,
              padding: '6px 12px', borderRadius: 8, marginBottom: 10, boxSizing: 'border-box'
            }}
          />

          <textarea
            rows={2}
            value={b2bData.landingHero?.subtitle || ''}
            onChange={e => {
              const updated = JSON.parse(JSON.stringify(b2bData));
              if (!updated.landingHero) updated.landingHero = {};
              updated.landingHero.subtitle = e.target.value;
              handleB2bUpdate(updated);
            }}
            style={{
              width: '100%', maxWidth: '780px', margin: '0 auto 16px', textAlign: 'center',
              background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)',
              color: '#a1a1aa', fontSize: '0.92rem', lineHeight: '1.5',
              padding: '6px 12px', borderRadius: 8, resize: 'none', boxSizing: 'border-box'
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(3, 1fr)', gap: 12, maxWidth: '650px', margin: '0 auto' }}>
            {(b2bData.landingHero?.stats || []).map((st, sIdx) => (
              <div key={sIdx} style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 10px', borderRadius: 10, border: '1px solid rgba(56,189,248,0.25)' }}>
                <input
                  type="text"
                  value={st.value}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(b2bData));
                    updated.landingHero.stats[sIdx].value = e.target.value;
                    handleB2bUpdate(updated);
                  }}
                  style={{ width: '100%', textAlign: 'center', background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '1.4rem', fontWeight: 900 }}
                />
                <input
                  type="text"
                  value={st.label}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(b2bData));
                    updated.landingHero.stats[sIdx].label = e.target.value;
                    handleB2bUpdate(updated);
                  }}
                  style={{ width: '100%', textAlign: 'center', background: 'transparent', border: 'none', color: '#a1a1aa', fontSize: '0.78rem', fontWeight: 600 }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Studio Broadcast Announcements */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: isMob ? '1.2rem' : '1.35rem', color: '#fff', margin: 0, fontWeight: 800 }}>
              📢 Studio Broadcast Announcements
            </h2>
            <button
              onClick={() => {
                const updated = JSON.parse(JSON.stringify(b2bData));
                if (!updated.announcements) updated.announcements = [];
                updated.announcements.push({
                  id: `b2b-ann-${Date.now()}`,
                  tag: '📢 STUDIO UPDATE',
                  title: 'HP Indigo 12000 HD Calibration Complete',
                  desc: '100% color fidelity guarantee on all metallic pearl and non-tearable spreads submitted this week.'
                });
                handleB2bUpdate(updated);
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8,
                background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.4)',
                color: '#38bdf8', fontSize: 11, fontWeight: 700, cursor: 'pointer'
              }}
            >
              <Plus size={13} /> + Add Announcement
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {(b2bData.announcements || []).map((ann, aIdx) => (
              <div key={ann.id || aIdx} style={{
                background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.25)',
                borderRadius: 12, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={ann.tag}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(b2bData));
                        updated.announcements[aIdx].tag = e.target.value;
                        handleB2bUpdate(updated);
                      }}
                      style={{ background: 'rgba(56,189,248,0.15)', border: '1px dashed #38bdf8', color: '#38bdf8', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}
                    />
                    <input
                      type="text"
                      value={ann.title}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(b2bData));
                        updated.announcements[aIdx].title = e.target.value;
                        handleB2bUpdate(updated);
                      }}
                      style={{ flex: 1, minWidth: '200px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', color: '#fff', fontSize: '1rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, boxSizing: 'border-box' }}
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={ann.desc}
                    onChange={e => {
                      const updated = JSON.parse(JSON.stringify(b2bData));
                      updated.announcements[aIdx].desc = e.target.value;
                      handleB2bUpdate(updated);
                    }}
                    style={{ width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', color: '#a1a1aa', fontSize: '0.85rem', padding: '4px 6px', borderRadius: 4, resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  onClick={() => {
                    const updated = JSON.parse(JSON.stringify(b2bData));
                    updated.announcements.splice(aIdx, 1);
                    handleB2bUpdate(updated);
                  }}
                  style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', borderRadius: 6, padding: '6px', cursor: 'pointer' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ── SECTION: B2B WHOLESALE RATE CARD MATRIX ───────────────────────────────
  function renderLivingB2bWholesalePage() {
    return (
      <section>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: isMob ? '1.25rem' : '1.4rem', color: '#fff', margin: 0, fontWeight: 800 }}>
            🏢 Studio Wholesale Rate Card Matrix
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>
            Directly edit wholesale per-sheet prices, cover charges, and turnaround guarantees for studios.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {albumSizes.map((size, idx) => {
            const retailPerSheet = Number(size.clientPricePerSheet || 260);
            const wholesalePerSheet = Number(size.wholesalePerSheet || size.studioPricePerSheet || 180);
            const studioCover = Number(size.coverChargeStudio || 1100);
            const retailCover = Number(size.coverChargeRetail || 1700);
            const savingPerSheet = retailPerSheet - wholesalePerSheet;
            const studioBaseTotal = (30 * wholesalePerSheet) + studioCover;
            const retailBaseTotal = (30 * retailPerSheet) + retailCover;
            const totalSavings = retailBaseTotal - studioBaseTotal;
            const marginPercent = Math.round((totalSavings / retailBaseTotal) * 100);

            return (
              <article key={size.id || idx} style={{
                background: 'rgba(18, 18, 26, 0.85)', border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 16, padding: '16px', position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 2 }}>
                      {size.orientation === 'landscape' ? '↔️ Landscape' : '↕️ Portrait'}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#fff', fontWeight: 800 }}>{size.name || size.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>{size.dimensions}</span>
                  </div>
                  <span style={{ fontSize: 10, background: 'rgba(56,189,248,0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                    Studio Rate
                  </span>
                </div>

                <div style={{
                  background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.3)',
                  borderRadius: 10, padding: '10px 12px', marginBottom: 12
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>Studio Wholesale Rate:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#38bdf8', fontWeight: 800 }}>₹</span>
                      <input
                        type="number"
                        value={wholesalePerSheet}
                        onChange={e => {
                          const updated = JSON.parse(JSON.stringify(catalog));
                          updated.albumPrinting.albumSizes[idx].wholesalePerSheet = Number(e.target.value);
                          updated.albumPrinting.albumSizes[idx].studioPricePerSheet = Number(e.target.value);
                          handleCatalogUpdate(updated);
                        }}
                        style={{
                          width: '75px', background: 'transparent',
                          border: '1px dashed #38bdf8', borderRadius: 4,
                          color: '#38bdf8', fontSize: '1.2rem', fontWeight: 900, padding: '2px 4px'
                        }}
                      />
                      <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>/ sheet</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#a1a1aa', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: 6 }}>
                    <span>Customer Retail: <del>₹{retailPerSheet}/sh</del></span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>Save ₹{savingPerSheet}/sh</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: 8, fontSize: 11, marginBottom: 10 }}>
                  <div>
                    <span style={{ color: '#a1a1aa', display: 'block' }}>Studio Cover:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <span style={{ color: '#fff' }}>₹</span>
                      <input
                        type="number"
                        value={studioCover}
                        onChange={e => {
                          const updated = JSON.parse(JSON.stringify(catalog));
                          updated.albumPrinting.albumSizes[idx].coverChargeStudio = Number(e.target.value);
                          handleCatalogUpdate(updated);
                        }}
                        style={{ width: '60px', background: 'transparent', border: '1px dashed #666', color: '#fff', borderRadius: 3, padding: '1px 3px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <span style={{ color: '#a1a1aa', display: 'block' }}>SLA Turnaround:</span>
                    <input
                      type="text"
                      value={size.turnaround || '2-3 Working Days'}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(catalog));
                        updated.albumPrinting.albumSizes[idx].turnaround = e.target.value;
                        handleCatalogUpdate(updated);
                      }}
                      style={{ width: '100%', background: 'transparent', border: '1px dashed #666', color: '#10b981', fontWeight: 600, borderRadius: 3, padding: '1px 3px' }}
                    />
                  </div>
                </div>

                <div style={{ fontSize: 11, color: '#34d399', textAlign: 'right', fontWeight: 700 }}>
                  Studio 30-Sheet Margin: ₹{totalSavings.toLocaleString('en-IN')} ({marginPercent}%)
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  // ── SECTION: EDITOR ONBOARDING ────────────────────────────────────────────
  function renderLivingEditorOnboardingPage() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMob ? '1.5rem' : '3.5rem' }}>
        <section style={{
          textAlign: 'center', maxWidth: '960px', margin: '0 auto', width: '100%',
          background: 'radial-gradient(circle at center, rgba(192,132,252,0.12) 0%, rgba(18,18,26,0.95) 75%)',
          border: '1px solid rgba(192,132,252,0.3)', borderRadius: 20, padding: isMob ? '20px 14px' : '32px 24px', boxSizing: 'border-box'
        }}>
          <input
            type="text"
            value={editorData.landingHero?.eyebrow || ''}
            onChange={e => {
              const updated = JSON.parse(JSON.stringify(editorData));
              if (!updated.landingHero) updated.landingHero = {};
              updated.landingHero.eyebrow = e.target.value;
              handleEditorUpdate(updated);
            }}
            style={{
              width: '100%', maxWidth: '650px', margin: '0 auto 12px', display: 'block', textAlign: 'center',
              background: 'rgba(192,132,252,0.1)', border: '1px dashed rgba(192,132,252,0.4)',
              color: '#c084fc', padding: '6px 14px', borderRadius: 999,
              fontSize: isMob ? '0.72rem' : '0.82rem', fontWeight: 800, letterSpacing: '1px', boxSizing: 'border-box'
            }}
          />

          <input
            type="text"
            value={editorData.landingHero?.title || ''}
            onChange={e => {
              const updated = JSON.parse(JSON.stringify(editorData));
              if (!updated.landingHero) updated.landingHero = {};
              updated.landingHero.title = e.target.value;
              handleEditorUpdate(updated);
            }}
            style={{
              width: '100%', textAlign: 'center',
              background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
              color: '#fff', fontSize: isMob ? '1.5rem' : '2.5rem', fontWeight: 900,
              padding: '6px 12px', borderRadius: 8, marginBottom: 10, boxSizing: 'border-box'
            }}
          />

          <textarea
            rows={2}
            value={editorData.landingHero?.subtitle || ''}
            onChange={e => {
              const updated = JSON.parse(JSON.stringify(editorData));
              if (!updated.landingHero) updated.landingHero = {};
              updated.landingHero.subtitle = e.target.value;
              handleEditorUpdate(updated);
            }}
            style={{
              width: '100%', maxWidth: '780px', margin: '0 auto 16px', textAlign: 'center',
              background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)',
              color: '#a1a1aa', fontSize: '0.92rem', lineHeight: '1.5',
              padding: '6px 12px', borderRadius: 8, resize: 'none', boxSizing: 'border-box'
            }}
          />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#a1a1aa' }}>Onboarding Button Text:</span>
            <input
              type="text"
              value={editorData.landingHero?.technicianCtaText || 'Technician Onboarding'}
              onChange={e => {
                const updated = JSON.parse(JSON.stringify(editorData));
                if (!updated.landingHero) updated.landingHero = {};
                updated.landingHero.technicianCtaText = e.target.value;
                handleEditorUpdate(updated);
              }}
              style={{
                background: 'rgba(192,132,252,0.15)', border: '1px dashed #c084fc',
                color: '#c084fc', fontWeight: 700, fontSize: '0.85rem', padding: '4px 10px', borderRadius: 6
              }}
            />
          </div>
        </section>

        {/* Lab Guidelines */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: isMob ? '1.2rem' : '1.35rem', color: '#fff', margin: 0, fontWeight: 800 }}>
              🎨 Lab Quality Standards & ACES Color Guidelines
            </h2>
            <button
              onClick={() => {
                const updated = JSON.parse(JSON.stringify(editorData));
                if (!updated.announcements) updated.announcements = [];
                updated.announcements.push({
                  id: `ed-ann-${Date.now()}`,
                  tag: '⏱️ RUSH PRODUCTION',
                  title: 'Muhurtham Weekend Rush Queue Active',
                  desc: 'Editors eligible for 20% bonus compensation on all Karizma layouts completed within 12 hours.'
                });
                handleEditorUpdate(updated);
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8,
                background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.4)',
                color: '#c084fc', fontSize: 11, fontWeight: 700, cursor: 'pointer'
              }}
            >
              <Plus size={13} /> + Add Guideline
            </button>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {(editorData.announcements || []).map((ann, aIdx) => (
              <div key={ann.id || aIdx} style={{
                background: 'rgba(192,132,252,0.05)', border: '1px solid rgba(192,132,252,0.25)',
                borderRadius: 12, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={ann.tag}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(editorData));
                        updated.announcements[aIdx].tag = e.target.value;
                        handleEditorUpdate(updated);
                      }}
                      style={{ background: 'rgba(192,132,252,0.15)', border: '1px dashed #c084fc', color: '#c084fc', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}
                    />
                    <input
                      type="text"
                      value={ann.title}
                      onChange={e => {
                        const updated = JSON.parse(JSON.stringify(editorData));
                        updated.announcements[aIdx].title = e.target.value;
                        handleEditorUpdate(updated);
                      }}
                      style={{ flex: 1, minWidth: '200px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', color: '#fff', fontSize: '1rem', fontWeight: 800, padding: '2px 6px', borderRadius: 4, boxSizing: 'border-box' }}
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={ann.desc}
                    onChange={e => {
                      const updated = JSON.parse(JSON.stringify(editorData));
                      updated.announcements[aIdx].desc = e.target.value;
                      handleEditorUpdate(updated);
                    }}
                    style={{ width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', color: '#a1a1aa', fontSize: '0.85rem', padding: '4px 6px', borderRadius: 4, resize: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  onClick={() => {
                    const updated = JSON.parse(JSON.stringify(editorData));
                    updated.announcements.splice(aIdx, 1);
                    handleEditorUpdate(updated);
                  }}
                  style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', borderRadius: 6, padding: '6px', cursor: 'pointer' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ── SECTION: EDITOR PAYOUTS RATE CARDS ─────────────────────────────────────
  function renderLivingEditorPayoutsPage() {
    return (
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: isMob ? '1.25rem' : '1.4rem', color: '#fff', margin: 0, fontWeight: 800 }}>
              💰 Production Compensation & Technician Payout Matrix
            </h2>
            <span style={{ fontSize: '0.82rem', color: '#a1a1aa' }}>
              Payouts automatically credited to editor wallets upon QC approval by lab management.
            </span>
          </div>
          <button
            onClick={() => {
              const updated = JSON.parse(JSON.stringify(editorData));
              if (!updated.productionPayouts) updated.productionPayouts = [];
              updated.productionPayouts.push({
                id: `pay-${Date.now()}`,
                role: 'Production Specialist',
                task: 'Custom Wedding Media Deliverable',
                rate: 100,
                unit: 'per completed unit',
                turnaround: '24h SLA',
                badge: 'Production'
              });
              handleEditorUpdate(updated);
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
              color: '#10b981', fontSize: 11, fontWeight: 700, cursor: 'pointer'
            }}
          >
            <Plus size={13} /> + Add Task
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMob ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {(editorData.productionPayouts || []).map((pay, pIdx) => (
            <article key={pay.id || pIdx} style={{
              background: 'rgba(18, 18, 26, 0.85)', border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 14, padding: '16px', position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <input
                  type="text"
                  value={pay.badge || 'Core Task'}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(editorData));
                    updated.productionPayouts[pIdx].badge = e.target.value;
                    handleEditorUpdate(updated);
                  }}
                  style={{
                    background: 'rgba(16,185,129,0.15)', border: '1px dashed #10b981',
                    color: '#10b981', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: 4
                  }}
                />
                <button
                  onClick={() => {
                    const updated = JSON.parse(JSON.stringify(editorData));
                    updated.productionPayouts.splice(pIdx, 1);
                    handleEditorUpdate(updated);
                  }}
                  style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', borderRadius: 6, padding: '4px 6px', cursor: 'pointer' }}
                >
                  <Trash2 size={12} />
                </button>
              </div>

              <input
                type="text"
                value={pay.task || ''}
                onChange={e => {
                  const updated = JSON.parse(JSON.stringify(editorData));
                  updated.productionPayouts[pIdx].task = e.target.value;
                  handleEditorUpdate(updated);
                }}
                placeholder="Task description"
                style={{
                  width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)',
                  color: '#fff', fontSize: '1.02rem', fontWeight: 800, borderRadius: 4, padding: '2px 6px', marginBottom: 6, boxSizing: 'border-box'
                }}
              />

              <input
                type="text"
                value={pay.role || ''}
                onChange={e => {
                  const updated = JSON.parse(JSON.stringify(editorData));
                  updated.productionPayouts[pIdx].role = e.target.value;
                  handleEditorUpdate(updated);
                }}
                placeholder="Specialist role"
                style={{
                  width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.15)',
                  color: '#a1a1aa', fontSize: '0.82rem', borderRadius: 4, padding: '2px 6px', marginBottom: 12, boxSizing: 'border-box'
                }}
              />

              <div style={{
                background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 10, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10
              }}>
                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Payout Rate:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>₹</span>
                  <input
                    type="number"
                    value={pay.rate || 0}
                    onChange={e => {
                      const updated = JSON.parse(JSON.stringify(editorData));
                      updated.productionPayouts[pIdx].rate = Number(e.target.value);
                      handleEditorUpdate(updated);
                    }}
                    style={{
                      width: '75px', background: 'transparent', border: '1px dashed #10b981',
                      color: '#10b981', fontSize: '1.25rem', fontWeight: 900, textAlign: 'right', borderRadius: 4, padding: '2px 4px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#a1a1aa' }}>
                <input
                  type="text"
                  value={pay.unit || 'per unit'}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(editorData));
                    updated.productionPayouts[pIdx].unit = e.target.value;
                    handleEditorUpdate(updated);
                  }}
                  style={{ width: '45%', background: 'transparent', border: '1px dashed #666', color: '#a1a1aa', borderRadius: 3, padding: '1px 3px' }}
                />
                <input
                  type="text"
                  value={pay.turnaround || '24h SLA'}
                  onChange={e => {
                    const updated = JSON.parse(JSON.stringify(editorData));
                    updated.productionPayouts[pIdx].turnaround = e.target.value;
                    handleEditorUpdate(updated);
                  }}
                  style={{ width: '45%', background: 'transparent', border: '1px dashed #666', color: '#38bdf8', fontWeight: 600, borderRadius: 3, padding: '1px 3px', textAlign: 'right' }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }
}
