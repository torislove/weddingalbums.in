/**
 * client/src/pages/booking/bookingData.js
 * Static catalogue tables for the booking wizard: album sizes, print sheets,
 * substrates, service intents, add-on services and the primary service tiles.
 * Extracted from BookingPage.jsx (UX-3 refactor) — data only, no JSX.
 */
import { BookOpen, Calendar, Film, MonitorPlay, Palette } from 'lucide-react';

// TOP AUSPICIOUS TELUGU SUBHA MUHURTHAM DATES (HIGH DEMAND - SLOTS FILLING UP FAST)
export const AUSPICIOUS_MUHURTHAM_DATES = [
  { date: '2026-10-18', label: 'Oct 18, 2026', telugu: 'ఆశ్వయుజ శుద్ధ విదియ (విజయవాడ/గుంటూరు)', tag: '🔥 85% Booked' },
  { date: '2026-10-26', label: 'Oct 26, 2026', telugu: 'ఆశ్వయుజ బహుళ పాడ్యమి (అత్యంత శుభం)', tag: '🔥 90% Booked' },
  { date: '2026-11-04', label: 'Nov 04, 2026', telugu: 'కార్తీక శుద్ధ ఏకాదశి (బోధన ముహూర్తం)', tag: '🔥 95% Booked' },
  { date: '2026-11-18', label: 'Nov 18, 2026', telugu: 'కార్తీక పూర్ణిమ మహా ముహూర్తం', tag: '🔥 Peak Rush' },
  { date: '2026-12-06', label: 'Dec 06, 2026', telugu: 'మార్గశిర శుద్ధ త్రయోదశి', tag: '🔥 80% Booked' },
  { date: '2027-01-22', label: 'Jan 22, 2027', telugu: 'పుష్య బహుళ పూర్ణిమ సంక్రాంతి ముహూర్తం', tag: '⭐ Best Seller' },
];

// COMPREHENSIVE ALBUM SIZES (LANDSCAPE ↔️ & PORTRAIT ↕️)
export const DEFAULT_ALBUM_SIZES = [
  // LANDSCAPE SIZES
  {
    id: '12x36',
    name: '12×36 Royal Spread (Panoramic)',
    dimensions: '12×36 inches',
    orientation: 'landscape',
    telugu: '12×36 రాయల్ పానోరమిక్ (ఆంధ్ర నెం.1 ఎంపిక ⭐)',
    basePrice: 9500,
    popular: true,
    description: "36 inch wide panoramic lay-flat views. India's #1 wedding choice."
  },
  {
    id: '12x30',
    name: '12×30 Classic Landscape',
    dimensions: '12×30 inches',
    orientation: 'landscape',
    telugu: '12×30 క్లాసిక్ ల్యాండ్‌స్కేప్',
    basePrice: 8500,
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
    popular: false,
    description: 'Lightweight easy-to-carry format for family functions.'
  },
  {
    id: '15x30',
    name: '15×30 Royal Square Jumbo',
    dimensions: '15×30 inches',
    orientation: 'landscape',
    telugu: '15×30 రాయల్ స్క్వేర్ జంబో',
    basePrice: 13200,
    popular: false,
    description: 'Premium grand wedding square spread — maximum height and width for panoramic ceremony displays.'
  },
  {
    id: 'bundle_12x36_parent',
    name: 'Royal Family Bundle (12×36 + 2x 6×18 Parent)',
    dimensions: '12×36 + 2x 6×18',
    orientation: 'landscape',
    telugu: 'రాయల్ ఫ్యామిలీ బండిల్ (కపుల్ + 2 పేరెంట్ ఆల్బమ్స్)',
    basePrice: 11500,
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
    popular: false,
    description: 'Compact vertical keepsake gift album for parents and close relatives.'
  }
];

// ============================================================================
// SERVICE INTENT MODES (FOR COUPLES & CLIENTS)
// ============================================================================
export const SERVICE_INTENTS = [
  {
    id: 'edit_and_print',
    title: '✨ Complete Suite (Editing + Printing)',
    telugu: 'ఎడిటింగ్ + డిజైనింగ్ + ఆల్బమ్ ప్రింటింగ్',
    badge: 'Couples #1 Choice ⭐',
    shortDesc: 'End-to-end Telugu wedding album creation. Raw photo culling, skin retouching, Karizma PSD layout design, WhatsApp 3D flipbook proof review, and commercial lab printing on archival sheets.',
    inclusions: ['Photo Culling & Skin Retouching', 'Custom Karizma Telugu PSD Design', 'Interactive 3D Digital Flipbook Proof', 'Lab Lay-Flat Printing (NTR/Silver Halide)', 'Handcrafted Presentation Box'],
    clientProvides: 'Raw or original wedding photos via Google Drive / WhatsApp',
    turnaround: '3-5 Working Days after Digital Proof Approval'
  },
  {
    id: 'only_editing',
    title: '🎨 Only Editing (Digital Master Delivery)',
    telugu: 'ఫొటో & వీడియో ఎడిటింగ్ మాత్రమే (నో ప్రింట్)',
    badge: '100% Digital Delivery',
    shortDesc: 'Professional photo culling, Telugu Pelli skin retouching, Karizma PSD creative layout design, cinematic color grading, or video editing without physical album printing.',
    inclusions: ['Telugu Pelli Skin Retouching & Beauty Clean-up', 'Custom Karizma PSD Spread Layouts (300 DPI)', 'Cinematic Color Grading & Telugu LUTs', 'High-Res Digital Files via Cloud Link', 'Zero Physical Printing Charges'],
    clientProvides: 'Original RAW or high-resolution JPEG photos / Camera video files',
    turnaround: '48-72 Hours Express Cloud Delivery'
  },
  {
    id: 'only_printing',
    title: '🖨️ Only Printing & Binding (Existing Spreads)',
    telugu: 'ఆల్బమ్ ల్యాబ్ ప్రింటింగ్ & బైండింగ్ మాత్రమే',
    badge: 'Direct Lab Press',
    shortDesc: 'Direct commercial lab printing and binding. Ideal if you already have pre-designed 12×36 / 12×30 album PSD or high-resolution JPEG spreads ready. Choice of 8 surface finishes and luxury covers.',
    inclusions: ['100% Waterproof NTR Synthetic or Fine Art Substrate', 'Choice of 8 Surface Finishes (Matte, Gloss, Velvet, Metallic...)', 'Seamless 180° Lay-Flat Thermal Core Binding', 'Luxury Acrylic, Velvet, or Leatherette Cover', 'Secure Door Delivery across AP & TS'],
    clientProvides: 'Pre-designed 12×36, 12×30, or 18×12 spreads in 300 DPI (PSD, PDF, or JPG)',
    turnaround: '3-4 Working Days to Dispatch'
  },
  {
    id: 'standalone_services',
    title: '🎬 Any Video or Event Print A-la-Carte',
    telugu: 'వీడియో రీల్స్, టీజర్లు, వాట్సాప్ ఆహ్వానాలు & ఫ్లెక్స్',
    badge: 'A-la-Carte Direct',
    shortDesc: 'Order individual creative media items directly: 9:16 Instagram Wedding Reels 5-Pack, 4K Cinematic Teaser Trailer, Animated WhatsApp Video Invitation with Sannai Melam, Welcome Roll-Up Standees, or Tabletop Desk Calendars.',
    inclusions: ['4K Cinematic Wedding Teaser Trailers (1-3 min)', 'Instagram Reels & Shorts 5-Pack (9:16 Vertical)', 'Animated WhatsApp Video Invitation with Devotional BGM', 'Mandap Welcome Roll-Up Standees & Entrance Flex', 'Personalized Tabletop Desk Calendars'],
    clientProvides: 'Event footage, couple photos, wedding date & venue details',
    turnaround: '24-48 Hours for Digital Media / 2 Days for Flex'
  },
  {
    id: 'bundles',
    title: '⚡ 1-Click Curated Luxury Bundles',
    telugu: 'తక్షణ లగ్జరీ ప్యాకేజీలు (బెస్ట్ సెల్లర్స్)',
    badge: 'Max Bundle Value',
    shortDesc: 'Pre-configured all-in-one Telugu wedding packages combining master album, cinematic video, parent duplicate books, and entrance standees with massive package savings.',
    inclusions: ['Pre-Configured Master Royal Album', 'Cinematic 4K Teaser + Instagram Reels', 'Matching Mini Duplicate Parent Albums', 'Velvet Presentation Briefcase', 'Free Express Insured Dispatch'],
    clientProvides: 'Event date & photos / video link',
    turnaround: '5-7 Working Days Total'
  }
];

// 2-DIMENSIONAL LAB SHEET FINISHES (STANDARD INCLUDED VS LUXURY UPGRADES)
export const DEFAULT_SHEETS = [
  // STANDARD FINISHES (INCLUDED IN BASE PRICE - ₹0 EXTRA)
  {
    id: 'ntr_matte',
    name: 'NTR Anti-Glare Matte',
    telugu: 'నాన్-టియరబుల్ మ్యాట్ (స్టాండర్డ్)',
    tier: 'standard',
    pricePerSheet: 0,
    surchargePerSheet: 0,
    priceLabel: 'Included in Base Price (₹0 Extra)',
    note: 'Smooth non-reflective matte lamination over non-tearable core. Zero glare, 100% waterproof.'
  },
  {
    id: 'ntr_gloss',
    name: 'NTR Crystal High Gloss',
    telugu: 'క్రిస్టల్ అల్ట్రా మిర్రర్ గ్లోస్',
    tier: 'standard',
    pricePerSheet: 0,
    surchargePerSheet: 0,
    priceLabel: 'Included in Base Price (₹0 Extra)',
    note: 'Ultra-glossy clear thermal finish. Deep saturated reds and high contrast mirror clarity.'
  },
  // LUXURY FINISHES (PER-SHEET SURCHARGES)
  {
    id: 'silky_matte',
    name: 'Silky / Silk Matte Pearl',
    telugu: 'సిల్కీ / సిల్క్ మ్యాట్ పెర్ల్ లస్టర్',
    tier: 'luxury',
    pricePerSheet: 25,
    surchargePerSheet: 25,
    priceLabel: '+₹25 / sheet upgrade',
    note: 'Micro-pearlescent satin texture. True-to-life skin tones with silky tactile glide.'
  },
  {
    id: 'velvet',
    name: 'Velvet / Feather Touch Soft',
    telugu: 'రాయల్ వెల్వెట్ ఫెదర్ టచ్',
    tier: 'luxury',
    pricePerSheet: 35,
    surchargePerSheet: 35,
    priceLabel: '+₹35 / sheet upgrade',
    note: 'Peach-fuzz tactile velvet, 100% anti-scratch & zero fingerprint smudge.'
  },
  {
    id: 'metallic',
    name: '24K Metallic Pearl Sheen',
    telugu: '24K మెటాలిక్ పెర్ల్ గోల్డ్ గ్లోస్',
    tier: 'luxury',
    pricePerSheet: 45,
    surchargePerSheet: 45,
    priceLabel: '+₹45 / sheet upgrade',
    note: 'Archival pearlized metallic film with specular shimmer that elevates 22K gold jewelry.'
  },
  {
    id: 'sparkle',
    name: 'Sparkle / Glitter Film',
    telugu: 'స్పార్కిల్ / గ్లిట్టర్ లామినేషన్',
    tier: 'luxury',
    pricePerSheet: 50,
    surchargePerSheet: 50,
    priceLabel: '+₹50 / sheet upgrade',
    note: 'Micro-crystalline diamond glitter sparkle for high-energy Sangeet and fireworks.'
  },
  {
    id: 'luster',
    name: 'Luster / Satin Archival',
    telugu: 'లస్టర్ / శాటిన్ ఆర్కైవల్ ఫినిష్',
    tier: 'luxury',
    pricePerSheet: 30,
    surchargePerSheet: 30,
    priceLabel: '+₹30 / sheet upgrade',
    note: 'Classic lab orange-peel fine-grain luster. Balanced contrast and anti-glare viewing.'
  },
  {
    id: 'leatherette',
    name: 'Canvas / Leatherette Embossed',
    telugu: 'లెథరెట్ / కాన్వాస్ ఎంబోస్డ్ టెక్స్చర్',
    tier: 'luxury',
    pricePerSheet: 40,
    surchargePerSheet: 40,
    priceLabel: '+₹40 / sheet upgrade',
    note: 'Deep tactile woven canvas weave and soft leatherette relief for timeless heirlooms.'
  }
];

// 4 BASE SUBSTRATES & CORE MEDIA
export const DEFAULT_BASE_SUBSTRATES = [
  {
    id: 'ntr_bopp',
    name: 'NTR (Non-Tearable BOPP Synthetic)',
    telugu: 'నాన్-టియరబుల్ సింథటిక్ షీట్ (100% వాటర్‌ప్రూఫ్)',
    surchargePerSheet: 0,
    priceLabel: 'Included Standard (100% Waterproof)',
    note: '100% unbreakable, tear-proof, moisture-proof polymer. 80%+ of Indian weddings.'
  },
  {
    id: 'art_paper',
    name: 'Regular Wood-Pulp Art Paper (170-300 GSM)',
    telugu: 'రెగ్యులర్ ఆర్ట్ పేపర్ (వుడ్-పల్ప్)',
    surchargePerSheet: 0,
    priceLabel: 'Budget Friendly',
    note: 'Standard coated paper stock for lightweight pocket books and budget albums.'
  },
  {
    id: 'silver_halide',
    name: 'Silver Halide True Chemical Photographic (Fuji DP2)',
    telugu: 'ట్రూ సిల్వర్ హాలైడ్ కెమికల్ పేపర్',
    surchargePerSheet: 40,
    priceLabel: '+₹40 / sheet upgrade',
    note: 'Continuous-tone optical RGB exposure with wet chemistry. Zero digital dots, 100-year archival.'
  },
  {
    id: 'cotton_rag',
    name: '100% Cotton Rag Fine Art (Hahnemühle / Giclée)',
    telugu: '100% కాటన్ రాగ్ ఫైన్ ఆర్ట్ (మ్యూజియం గ్రేడ్)',
    surchargePerSheet: 60,
    priceLabel: '+₹60 / sheet upgrade',
    note: 'Museum conservation grade, 100% natural cotton fibers, acid-free watercolor texture.'
  }
];

// ALL VIDEO EDITING SERVICES
export const VIDEO_SERVICES = [
  { id: 'teaser', name: '4K Cinematic Wedding Teaser (1-3 min)', telugu: '4K సినిమాటిక్ టీజర్', price: 6000, note: 'Fast-paced emotional cut, WhatsApp & family ready' },
  { id: 'reels', name: 'Instagram Reels & Shorts 5-Pack (9:16)', telugu: 'ఇన్‌స్టాగ్రామ్ రీల్స్ 5-ప్యాక్', price: 3500, note: 'Trending music synced 9:16 vertical hooks' },
  { id: 'highlights', name: 'Story Highlights Film (10-15 min)', telugu: 'స్టోరీ హైలైట్స్ ఫిలిం', price: 10000, note: 'Emotional story with couple vows & speech sync' },
  { id: 'traditional', name: 'Full Traditional Long-Form Video (60+ min)', telugu: 'ఫుల్ ట్రెడిషనల్ వీడియో', price: 12000, note: 'All rituals: Talambralu, Agni Sakshi multi-cam' },
  { id: 'sde', name: 'Same-Day Edit (SDE Express for Reception)', telugu: 'సేమ్-డే ఎడిట్ (రిసెప్షన్)', price: 12000, note: 'Morning wedding edited for reception night LED screen' },
  { id: 'prewedding', name: 'Pre-Wedding Love Story Film', telugu: 'ప్రీ-వెడ్డింగ్ లవ్ స్టోరీ', price: 5000, note: 'Romantic couple teaser with licensed music' },
  { id: 'sound', name: 'Mangalasnanam Sound & Mantra Mastering', telugu: 'సంప్రదాయ సౌండ్ మాస్టరింగ్', price: 3000, note: 'Mantra clarity, Purohit de-noise & Sannai Melam' }
];

// ALL PHOTO EDITING SERVICES
export const PHOTO_SERVICES = [
  { id: 'retouching', name: 'Telugu Pelli Skin Retouching & Beauty Clean-up', telugu: 'స్కిన్ రీటచింగ్ & బ్యూటీ క్లీనప్', rate: 60, note: 'Blemish removal, eye brightening, gold jewelry shine' },
  { id: 'karizma_psd', name: 'Traditional Karizma PSD Creative Designing', telugu: 'కరిజ్మా క్రియేటివ్ డిజైనింగ్', rate: 45, note: 'Custom Telugu shlokas, spread layouts & typography' },
  { id: 'cinematic_luts', name: 'Cinematic Color Grading & Wedding LUTs', telugu: 'సినిమాటిక్ కలర్ గ్రేడింగ్', rate: 30, note: 'Warm golden Andhra wedding palette & LUTs' },
  { id: 'background', name: 'AI Sky, Mandap & Lighting Background Replacement', telugu: 'బ్యాక్‌గ్రౌండ్ రీప్లేస్‌మెంట్', rate: 90, note: 'Replace cluttered venue with royal mandap/gardens' },
  { id: 'restoration', name: 'Old & Vintage Photo Restoration', telugu: 'పాత ఫొటోల రీస్టోరేషన్', rate: 120, note: 'Fix scratched, faded, or torn ancestral photos' },
  { id: 'culling', name: 'AI RAW Photo Culling & Best Selection', telugu: 'రా ఫొటోల కల్లింగ్ & సెలక్షన్', rate: 15, note: 'Filter blinks, blurs & tag top highlight moments' }
];

// ALL FLEX & BANNER SERVICES
export const FLEX_SERVICES = [
  { id: 'mandap', name: 'Grand Mandap Entrance Flex (10×8 ft Star Media)', telugu: 'మండపం ఎంట్రన్స్ ఫ్లెక్స్', price: 2400, note: 'Heavy Star Flex 340 GSM with brass eyelets' },
  { id: 'hoarding', name: 'Roadside Wedding Hoarding (40×20 ft Heavy Duty)', telugu: 'రోడ్‌సైడ్ వెడ్డింగ్ హోర్డింగ్', price: 12000, note: 'Ultra-high visibility large format solvent press' },
  { id: 'standee', name: 'Retractable Welcome Roll-Up Standee (6×3 ft)', telugu: 'వెల్‌కమ్ రోల్-అప్ స్టాండీ', price: 1800, note: 'Anodized aluminum stand with carry bag' },
  { id: 'invite', name: 'Animated Telugu WhatsApp Video Invitation', telugu: 'వాట్సాప్ వీడియో ఆహ్వానం', price: 1999, note: 'Auspicious Sannai Melam BGM & temple motifs' }
];

// ALL CALENDAR SERVICES
export const CALENDAR_SERVICES = [
  { id: 'desk_easel', name: 'Personalized 12-Month Tabletop Desk Calendar', telugu: '12-నెలల టేబుల్‌టాప్ డెస్క్ క్యాలెండర్', price: 1200, note: '12 Couple photos with wooden easel stand' },
  { id: 'wall_poster', name: 'Grand Wall Hanging Poster Calendar (12×18 Metallic)', telugu: 'గ్రాండ్ వాల్ పోస్టర్ క్యాలెండర్', price: 650, note: 'High-gloss metallic print with metal rim hanger' },
  { id: 'pocket_pack', name: 'Pocket Mini Calendars (Pack of 10 Copies)', telugu: 'పాకెట్ మినీ క్యాలెండర్లు (10 కాపీలు)', price: 990, note: 'Waterproof wallet cards with rounded corners' }
];

// 5 PRIMARY SERVICE TILES FOR RESPONSIVE GRID (ZERO SCROLLBARS)
export const SERVICE_CATEGORIES = [
  {
    id: 'album',
    key: 'albumPrint',
    name: 'Karizma & Flush Mount Album',
    telugu: 'కరిజ్మా & ఫ్లష్ మౌంట్ ఆల్బమ్ డిజైన్',
    icon: BookOpen,
    priceTag: 'from ₹5,200'
  },
  {
    id: 'video',
    key: 'videoEdit',
    name: 'Cinematic Films & Reels',
    telugu: '4K సినిమాటిక్ వీడియో & రీల్స్',
    icon: Film,
    priceTag: 'from ₹3,500'
  },
  {
    id: 'photo',
    key: 'photoEdit',
    name: 'Photo Retouch & Color',
    telugu: 'ఫొటో రీటచింగ్ & కలర్ గ్రేడింగ్',
    icon: Palette,
    priceTag: 'from ₹30/photo'
  },
  {
    id: 'flex',
    key: 'flexBanner',
    name: 'Flex, Banners & Invites',
    telugu: 'కళ్యాణ మండపం ఫ్లెక్స్ & ఆహ్వానాలు',
    icon: MonitorPlay,
    priceTag: 'from ₹1,800'
  },
  {
    id: 'calendar',
    key: 'calendars',
    name: 'Calendars & Keepsakes',
    telugu: 'కపుల్ టేబుల్‌టాప్ & వాల్ క్యాలెండర్లు',
    icon: Calendar,
    priceTag: 'from ₹650'
  }
];
