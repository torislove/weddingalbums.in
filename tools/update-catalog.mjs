import fs from 'fs';
import path from 'path';

const contentPath = path.resolve('client/public/content.json');
const fallbackPath = path.resolve('server/content_fallback.json');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// 1. Structured Catalog with Landscape & Portrait sizes, Sheets, Photo Editing, Video, Flex
const servicesCatalog = {
  hubBanner: {
    eyebrow: '✦ ANDHRA PRADESH & TELANGANA #1 POST-PRODUCTION & PRINT LAB ✦',
    eyebrowTel: 'ఆంధ్రప్రదేశ్ & తెలంగాణ నెం.1 పోస్ట్ ప్రొడక్షన్ & ప్రింట్ ల్యాబ్',
    title: 'Complete Wedding Media Storefront for Couples & Elite Studios',
    titleTel: 'కపుల్స్ & స్టూడియోల కోసం పూర్తి వెడ్డింగ్ మీడియా స్టోర్‌ఫ్రంట్',
    subtitle: 'Transparent Per-Sheet pricing on all album sizes, Netflix-grade cinematic video editing, animated WhatsApp invitations, and heavy-duty event flex.',
    stats: [
      { label: 'Per-Sheet Pricing', value: 'from ₹105/sh' },
      { label: 'Studio Trade Discount', value: 'Up to 40% Off' },
      { label: 'Standard Delivery', value: '3-5 Days' },
      { label: 'Archival Guarantee', value: '100+ Years' }
    ]
  },
  albumPrinting: {
    albumSizes: [
      // LANDSCAPE SIZES (↔️)
      {
        id: 'size-14x40',
        name: '14×40 Magnum Royal Maharaja (Super Jumbo)',
        telugu: '14×40 మహారాజా సూపర్ జంబో (స్టేజ్ మెగా స్ప్రెడ్స్)',
        dimensions: '14×40 inches',
        openSpread: '14" × 40"',
        closedSize: '20" × 14"',
        orientation: 'landscape',
        category: 'Grand Landscape',
        clientPricePerSheet: 550,
        studioPricePerSheet: 350,
        clientBasePrice: 16500,
        studioBasePrice: 10500,
        baseSheets: 30,
        popular: false,
        badge: 'Grand Mega Mandap',
        description: 'The largest commercial format in India. Massive stage mandap shots and 100-member family groups unfold edge to edge.'
      },
      {
        id: 'size-12x36',
        name: '12×36 Grand Imperial Royal Panoramic',
        telugu: '12×36 రాయల్ పానోరమిక్ (ఆంధ్ర & తెలంగాణ నెం.1 ఎంపిక ⭐)',
        dimensions: '12×36 inches',
        openSpread: '12" × 36"',
        closedSize: '18" × 12"',
        orientation: 'landscape',
        category: 'Most Popular in AP',
        clientPricePerSheet: 260,
        studioPricePerSheet: 180,
        clientBasePrice: 9500,
        studioBasePrice: 7800,
        baseSheets: 30,
        popular: true,
        badge: '⭐ India #1 Best Seller',
        description: '80%+ of all Indian wedding albums print at this size. Seamless 36-inch wide panoramic lay-flat views.'
      },
      {
        id: 'size-12x30',
        name: '12×30 Classic Panoramic Cinema',
        telugu: '12×30 క్లాసిక్ పానోరమిక్ సినిమా',
        dimensions: '12×30 inches',
        openSpread: '12" × 30"',
        closedSize: '15" × 12"',
        orientation: 'landscape',
        category: 'Cinema Landscape',
        clientPricePerSheet: 230,
        studioPricePerSheet: 155,
        clientBasePrice: 8500,
        studioBasePrice: 6800,
        baseSheets: 30,
        popular: false,
        badge: 'Widescreen Spreads',
        description: 'Traditional Telugu standard widescreen layout for mandap & stage spreads.'
      },
      {
        id: 'size-10x30',
        name: '10×30 Slim Cinema Panoramic',
        telugu: '10×30 స్లిమ్ సినిమా పానోరమిక్',
        dimensions: '10×30 inches',
        openSpread: '10" × 30"',
        closedSize: '15" × 10"',
        orientation: 'landscape',
        category: 'Slim Landscape',
        clientPricePerSheet: 210,
        studioPricePerSheet: 145,
        clientBasePrice: 7800,
        studioBasePrice: 5900,
        baseSheets: 30,
        popular: false,
        badge: 'Pre-Wedding Favorite',
        description: 'Slim panoramic storytelling — ideal for outdoor pre-wedding couple shoots.'
      },
      {
        id: 'size-15x30',
        name: '15×30 Royal Square Jumbo',
        telugu: '15×30 రాయల్ స్క్వేర్ జంబో ఫీస్ట్',
        dimensions: '15×30 inches',
        openSpread: '30" × 15"',
        closedSize: '15" × 15"',
        orientation: 'landscape',
        category: 'Royal Square',
        clientPricePerSheet: 320,
        studioPricePerSheet: 210,
        clientBasePrice: 13200,
        studioBasePrice: 8500,
        baseSheets: 30,
        popular: false,
        badge: 'Contemporary Square',
        description: 'Premium grand weddings. Maximum height and width for panoramic ceremony displays.'
      },
      {
        id: 'size-12x24',
        name: '12×24 Classic Celebration Square',
        telugu: '12×24 క్లాసిక్ సెలబ్రేషన్ స్క్వేర్',
        dimensions: '12×24 inches',
        openSpread: '12" × 24"',
        closedSize: '12" × 12"',
        orientation: 'landscape',
        category: 'Square Classic',
        clientPricePerSheet: 200,
        studioPricePerSheet: 140,
        clientBasePrice: 7500,
        studioBasePrice: 5400,
        baseSheets: 30,
        popular: false,
        badge: 'Modern Square',
        description: 'Modern cinematic square book — curated layouts and boutique wedding stories.'
      },
      {
        id: 'size-10x24',
        name: '10×24 Compact Feast Landscape',
        telugu: '10×24 కాంపాక్ట్ ఫీస్ట్ ల్యాండ్‌స్కేప్',
        dimensions: '10×24 inches',
        openSpread: '10" × 24"',
        closedSize: '12" × 10"',
        orientation: 'landscape',
        category: 'Compact Feast',
        clientPricePerSheet: 180,
        studioPricePerSheet: 125,
        clientBasePrice: 5800,
        studioBasePrice: 4200,
        baseSheets: 30,
        popular: false,
        badge: 'Family Friendly',
        description: 'Lightweight easy-to-carry format for family functions, Haldi and Gruhapravesam.'
      },
      {
        id: 'size-12x18-horiz',
        name: '12×18 Traditional South Horizontal',
        telugu: '12×18 ట్రెడిషనల్ హారిజాంటల్',
        dimensions: '12×18 inches',
        openSpread: '12" × 18"',
        closedSize: '12" × 9"',
        orientation: 'landscape',
        category: 'Traditional Horizontal',
        clientPricePerSheet: 160,
        studioPricePerSheet: 115,
        clientBasePrice: 5200,
        studioBasePrice: 3800,
        baseSheets: 30,
        popular: false,
        badge: 'Classic Heritage',
        description: 'Traditional portrait-landscape balance, timeless horizontal format.'
      },
      {
        id: 'size-6x9-pocket',
        name: '6×9 Companion Pocket Parent Book',
        telugu: '6×9 కంపానియన్ పాకెట్ పేరెంట్ బుక్',
        dimensions: '6×9 inches',
        openSpread: '6" × 18"',
        closedSize: '9" × 6"',
        orientation: 'landscape',
        category: 'Parent Mini Book',
        clientPricePerSheet: 105,
        studioPricePerSheet: 70,
        clientBasePrice: 3200,
        studioBasePrice: 2100,
        baseSheets: 30,
        popular: false,
        badge: 'Matching Parent Gift',
        description: 'Exact 50% scale-down of a 12×36 master — lightweight gift copies for parents and in-laws.'
      },

      // PORTRAIT SIZES (↕️)
      {
        id: 'size-18x12-vert',
        name: '18×12 Grand Vertical Royal Magazine',
        telugu: '18×12 రాయల్ వర్టికల్ మ్యాగజైన్ (1.5 అడుగుల ఎత్తు ⭐)',
        dimensions: '18×12 inches',
        openSpread: '18"H × 24"W',
        closedSize: '12" × 18"',
        orientation: 'portrait',
        category: 'Vertical Portrait',
        clientPricePerSheet: 240,
        studioPricePerSheet: 165,
        clientBasePrice: 9000,
        studioBasePrice: 6200,
        baseSheets: 30,
        popular: true,
        badge: '⭐ Royal Vertical Magazine',
        description: 'Vertical luxury book — full-bleed bridal portraits and Kanjeevaram sarees stand 1.5 ft tall closed.'
      },
      {
        id: 'size-15x12-vert',
        name: '15×12 Classic Vertical Portrait',
        telugu: '15×12 క్లాసిక్ వర్టికల్ పోర్ట్రెయిట్',
        dimensions: '15×12 inches',
        openSpread: '15"H × 24"W',
        closedSize: '12" × 15"',
        orientation: 'portrait',
        category: 'Vertical Portrait',
        clientPricePerSheet: 210,
        studioPricePerSheet: 145,
        clientBasePrice: 7800,
        studioBasePrice: 5400,
        baseSheets: 30,
        popular: false,
        badge: 'Bridal Portrait Standard',
        description: 'Traditional vertical bridal album for stage portraits and couple framing.'
      },
      {
        id: 'size-14x11-vert',
        name: '14×11 Fine Art Editorial Vertical',
        telugu: '14×11 ఫైన్ ఆర్ట్ ఎడిటోరియల్ పోర్ట్రెయిట్',
        dimensions: '14×11 inches',
        openSpread: '14"H × 22"W',
        closedSize: '11" × 14"',
        orientation: 'portrait',
        category: 'Vertical Editorial',
        clientPricePerSheet: 190,
        studioPricePerSheet: 135,
        clientBasePrice: 7200,
        studioBasePrice: 4900,
        baseSheets: 30,
        popular: false,
        badge: 'Editorial Fashion',
        description: 'Editorial fashion photography format for candid contemporary love stories.'
      },
      {
        id: 'size-12x9-vert',
        name: '12×9 Compact Vertical Storybook',
        telugu: '12×9 కాంపాక్ట్ వర్టికల్ స్టోరీబుక్',
        dimensions: '12×9 inches',
        openSpread: '12"H × 18"W',
        closedSize: '9" × 12"',
        orientation: 'portrait',
        category: 'Vertical Compact',
        clientPricePerSheet: 160,
        studioPricePerSheet: 115,
        clientBasePrice: 5500,
        studioBasePrice: 3900,
        baseSheets: 30,
        popular: false,
        badge: 'Intimate Ceremony',
        description: 'Handy vertical book for intimate Haldi, Mehendi & Sangeet moments.'
      },
      {
        id: 'size-10x8-vert',
        name: '10×8 Family Keepsake Portrait',
        telugu: '10×8 ఫ్యామిలీ కీప్‌సేక్ పోర్ట్రెయిట్',
        dimensions: '10×8 inches',
        openSpread: '10"H × 16"W',
        closedSize: '8" × 10"',
        orientation: 'portrait',
        category: 'Family Gift',
        clientPricePerSheet: 130,
        studioPricePerSheet: 95,
        clientBasePrice: 4500,
        studioBasePrice: 3200,
        baseSheets: 30,
        popular: false,
        badge: 'Relative Keepsake',
        description: 'Compact vertical keepsake gift album for parents and close relatives.'
      },
      {
        id: 'size-8x12-vert',
        name: '8×12 Traditional Vertical Magazine (A4)',
        telugu: '8×12 ట్రెడిషనల్ వర్టికల్ మ్యాగజైన్',
        dimensions: '8×12 inches',
        openSpread: '12"H × 16"W',
        closedSize: '8" × 12"',
        orientation: 'portrait',
        category: 'Vertical Compact',
        clientPricePerSheet: 120,
        studioPricePerSheet: 85,
        clientBasePrice: 3800,
        studioBasePrice: 2600,
        baseSheets: 30,
        popular: false,
        badge: 'Guest Signing Book',
        description: 'Flexible-page magazine storybook — guest signing books and family return gifts.'
      }
    ],

    sheetStyles: [
      // 1. STANDARD CORES
      {
        id: 'sheet-ntr-matte',
        name: 'NTR Anti-Glare Matte (100% Waterproof)',
        telugu: 'నాన్-టియరబుల్ మ్యాట్ (100% వాటర్‌ప్రూఫ్)',
        tier: 'standard',
        clientPricePerSheet: 0,
        studioPricePerSheet: 0,
        clientPriceBadge: 'Included (₹0)',
        studioPriceBadge: 'Standard (₹0)',
        color: '#7B8794',
        gsm: '350 GSM Lay-Flat',
        bestFor: 'Stage Groups & Extended Family',
        description: 'Flat anti-glare smooth finish — 100% unbreakable, tear-proof, moisture-proof synthetic polymer core.'
      },
      {
        id: 'sheet-ntr-gloss',
        name: 'NTR Crystal Mirror High Gloss',
        telugu: 'క్రిస్టల్ అల్ట్రా మిర్రర్ గ్లోస్',
        tier: 'standard',
        clientPricePerSheet: 0,
        studioPricePerSheet: 0,
        clientPriceBadge: 'Included (₹0)',
        studioPriceBadge: 'Standard (₹0)',
        color: '#2F86D6',
        gsm: '350 GSM Lay-Flat',
        bestFor: 'Outdoor Daylight & Bright Stage',
        description: 'Mirror shine with high contrast and punchy saturation — pops red & gold silk attire in daylight.'
      },
      // 2. LUXURY SURFACE UPGRADES
      {
        id: 'sheet-metallic-gold',
        name: '24K Metallic Pearl Gold Gloss',
        telugu: '24K మెటాలిక్ పెర్ల్ గోల్డ్ గ్లోస్',
        tier: 'luxury',
        clientPricePerSheet: 25,
        studioPricePerSheet: 18,
        clientPriceBadge: '+₹25 / sheet',
        studioPriceBadge: '+₹18 / sheet (Trade)',
        color: '#D4AF37',
        gsm: '350 GSM Archival',
        bestFor: 'Muhurtham & 22K Gold Jewelry',
        description: 'Mica-infused pearlised gloss that lifts bridal jewelry, diamonds and zardozi work into shimmering 3D pop.'
      },
      {
        id: 'sheet-royal-velvet',
        name: 'Royal Velvet Feather Touch',
        telugu: 'రాయల్ వెల్వెట్ ఫెదర్ టచ్ (స్కఫ్-ఫ్రీ)',
        tier: 'luxury',
        clientPricePerSheet: 35,
        studioPricePerSheet: 22,
        clientPriceBadge: '+₹35 / sheet',
        studioPriceBadge: '+₹22 / sheet (Trade)',
        color: '#722F37',
        gsm: '400 GSM Rigid Core',
        bestFor: 'Zero-Glare Candid Couple Portraits',
        description: 'Peach-skin velvet coat with zero glare — scuff-free even when pages rub together. Zero fingerprint smudges.'
      },
      {
        id: 'sheet-pure-silk',
        name: 'Pure Silk Texture (Pattu Weave)',
        telugu: 'ప్యూర్ సిల్క్ టెక్స్చర్ (పట్టు నేత)',
        tier: 'luxury',
        clientPricePerSheet: 45,
        studioPricePerSheet: 25,
        clientPriceBadge: '+₹45 / sheet',
        studioPriceBadge: '+₹25 / sheet (Trade)',
        color: '#C5A059',
        gsm: '380 GSM Textured',
        bestFor: 'Kanyadaanam & Saptapadi Rituals',
        description: 'Fine weave texture like raw pattu silk — scatters harsh light for gentle, natural skin tones.'
      },
      {
        id: 'sheet-sparkle-glitter',
        name: 'Sparkle / Diamond Glitter Film',
        telugu: 'స్పార్కల్ / డైమండ్ గ్లిటర్ షీట్',
        tier: 'luxury',
        clientPricePerSheet: 50,
        studioPricePerSheet: 32,
        clientPriceBadge: '+₹50 / sheet',
        studioPriceBadge: '+₹32 / sheet (Trade)',
        color: '#D9C98A',
        gsm: '320 GSM Sparkle Coat',
        bestFor: 'Reception & Sangeet Fireworks',
        description: 'Micro diamond-dust glitter coat that shimmers under warm stage and sangeet lighting.'
      },
      {
        id: 'sheet-luster-satin',
        name: 'Luster / Satin Micro-Pebble Grain',
        telugu: 'లస్టర్ / శాటిన్ మైక్రో-గ్రెయిన్',
        tier: 'luxury',
        clientPricePerSheet: 30,
        studioPricePerSheet: 18,
        clientPriceBadge: '+₹30 / sheet',
        studioPriceBadge: '+₹18 / sheet (Trade)',
        color: '#A0AEC0',
        gsm: '320 GSM Photographic',
        bestFor: 'Balanced Contrast Fine Portraits',
        description: 'Classic darkroom lab orange-peel fine-grain luster. Balanced contrast without harsh reflections.'
      },
      // 3. ARCHIVAL FINE ART & PHOTOGRAPHIC
      {
        id: 'sheet-silver-halide',
        name: 'HD Silver Halide Continuous Tone (Fuji Crystal)',
        telugu: 'ట్రూ సిల్వర్ హాలైడ్ కెమికల్ పేపర్',
        tier: 'archival',
        clientPricePerSheet: 40,
        studioPricePerSheet: 25,
        clientPriceBadge: '+₹40 / sheet',
        studioPriceBadge: '+₹25 / sheet (Trade)',
        color: '#4A5568',
        gsm: '320 GSM Optical Chemistry',
        bestFor: 'Darkroom Master Photographers',
        description: 'Continuous-tone optical RGB exposure with wet chemistry. Zero digital halftone dots, 100-year archival.'
      },
      {
        id: 'sheet-cotton-rag',
        name: '100% Cotton Rag Fine Art (Hahnemühle)',
        telugu: '100% కాటన్ రాగ్ మ్యూజియం ఫైన్ ఆర్ట్',
        tier: 'archival',
        clientPricePerSheet: 60,
        studioPricePerSheet: 40,
        clientPriceBadge: '+₹60 / sheet',
        studioPriceBadge: '+₹40 / sheet (Trade)',
        color: '#E2E8F0',
        gsm: '310 GSM Museum Grade',
        bestFor: 'Museum Conservation & Heirlooms',
        description: 'Museum conservation grade, 100% natural cotton fibers, acid-free watercolor textured feel.'
      }
    ],

    coverFinishes: [
      {
        id: 'cover-acrylic',
        name: 'Diamond Crystal Acrylic 3D Glass Face',
        telugu: 'డైమండ్ క్రిస్టల్ యాక్రిలిక్ 3D గ్లాస్ కవర్',
        clientExtra: 1500,
        studioExtra: 1000,
        clientBadge: '+₹1,500',
        studioBadge: '+₹1,000 (Trade)',
        mockup: '/images/mockup-acrylic-cover.svg',
        desc: '4mm diamond-beveled optical crystal glass face giving couple portraits deep 3D perspective and brilliant specular shine.'
      },
      {
        id: 'cover-velvet',
        name: 'Royal Velvet Touch + 24K Gold Foil Typography',
        telugu: 'రాయల్ వెల్వెట్ టచ్ + 24K గోల్డ్ ఫాయిల్',
        clientExtra: 1200,
        studioExtra: 800,
        clientBadge: '+₹1,200',
        studioBadge: '+₹800 (Trade)',
        mockup: '/images/mockup-velvet-gold-foil.svg',
        desc: 'Plush velvet fabric hardcover with couple names and auspicious Telugu shlokas debossed in 24K gold foil.'
      },
      {
        id: 'cover-leatherette',
        name: 'Italian Hand-Stitched Leatherette + Briefcase Box',
        telugu: 'ఇటాలియన్ లెదరెట్ + బ్రీఫ్‌కేస్ బాక్స్',
        clientExtra: 1800,
        studioExtra: 1200,
        clientBadge: '+₹1,800',
        studioBadge: '+₹1,200 (Trade)',
        mockup: '/images/mockup-leatherette-embossed.svg',
        desc: 'Classic vegan leather binding with brass corner protectors and a matching velvet-lined presentation briefcase.'
      },
      {
        id: 'cover-matte',
        name: 'Scuff-Free Fine Art Layflat Hardcover Matte',
        telugu: 'స్కాఫ్-ఫ్రీ హార్డ్‌కవర్ మ్యాట్',
        clientExtra: 0,
        studioExtra: 0,
        clientBadge: 'Included (₹0)',
        studioBadge: 'Included (₹0)',
        mockup: '/images/mockup-layflat-spread.svg',
        desc: 'Clean, modern seamless photographic wrap with anti-scratch matte laminate finish.'
      }
    ]
  },

  photoEditing: [
    {
      id: 'photo-culling',
      title: 'AI RAW Photo Culling & Highlight Tagging',
      telugu: 'రా ఫొటోల కల్లింగ్ & సెలెక్షన్',
      clientPrice: 15,
      studioPrice: 8,
      clientPriceBadge: '₹15 / photo',
      studioPriceBadge: '₹8 / photo (Trade)',
      turnaround: '24-48 Hrs',
      desc: 'Send 2,000+ camera files. We filter blinks, blur, misfires, and flag the top hero photos for album spreads.'
    },
    {
      id: 'photo-retouching',
      title: 'Telugu Pelli Skin Retouching & Beauty Clean-up',
      telugu: 'స్కిన్ రీటచింగ్ & బ్యూటీ క్లీనప్',
      clientPrice: 60,
      studioPrice: 35,
      clientPriceBadge: '₹60 / photo',
      studioPriceBadge: '₹35 / photo (Trade)',
      turnaround: '48 Hrs',
      desc: 'Frequency separation skin smoothing, micro-pore retention, eye brightening, and 24K jewelry specular shine.'
    },
    {
      id: 'photo-karizma-psd',
      title: 'Traditional Karizma PSD Creative Designing',
      telugu: 'కరిజ్మా క్రియేటివ్ డిజైనింగ్ (300 DPI)',
      clientPrice: 45,
      studioPrice: 25,
      clientPriceBadge: '₹45 / spread',
      studioPriceBadge: '₹25 / spread (Trade)',
      turnaround: '48-72 Hrs',
      desc: 'Custom Karizma PSD spreads with Telugu ritual borders, mandap typography, and 300 DPI lab-ready files.'
    },
    {
      id: 'photo-cinematic-luts',
      title: 'Cinematic Color Grading & Wedding LUTs',
      telugu: 'సినిమాటిక్ కలర్ గ్రేడింగ్ & LUTs',
      clientPrice: 30,
      studioPrice: 18,
      clientPriceBadge: '₹30 / photo',
      studioPriceBadge: '₹18 / photo (Trade)',
      turnaround: '24-48 Hrs',
      desc: 'Warm golden Andhra wedding palette, Kanjeevaram silk vibrancy restoration, and ambient hall cleanup.'
    }
  ],

  videoEditing: [
    {
      id: 'video-reels',
      title: 'Viral Instagram Reels & Shorts 5-Pack (9:16)',
      telugu: 'వైరల్ ఇన్‌స్టాగ్రామ్ రీల్స్ 5-ప్యాక్',
      clientPrice: 3500,
      studioPrice: 2100,
      clientPriceBadge: '₹3,500 / pack',
      studioPriceBadge: '₹2,100 / pack (Trade)',
      turnaround: '48 Hours',
      desc: 'Five 9:16 vertical reels (1080×1920) beat-synced to trending Telugu audio — WhatsApp status & Instagram ready.'
    },
    {
      id: 'video-teaser',
      title: '4K Cinematic Wedding Teaser Trailer (1-3 min)',
      telugu: '4K సినిమాటిక్ టీజర్ ట్రైలర్ (1-3 నిమి)',
      clientPrice: 6000,
      studioPrice: 3600,
      clientPriceBadge: '₹6,000',
      studioPriceBadge: '₹3,600 (Trade)',
      turnaround: '48-72 Hours',
      desc: 'Fast-paced emotional story cut across all wedding rituals with licensed cinematic score and colour grading.'
    },
    {
      id: 'video-highlights',
      title: 'Story Highlights Film (10-15 min)',
      telugu: 'స్టోరీ హైలైట్స్ ఫిలిం (10-15 నిమి)',
      clientPrice: 10000,
      studioPrice: 6200,
      clientPriceBadge: '₹10,000',
      studioPriceBadge: '₹6,200 (Trade)',
      turnaround: '5-7 Days',
      desc: 'Emotional story-driven film synchronizing couple vows, Purohit mantras, and family speeches.'
    },
    {
      id: 'video-traditional',
      title: 'Full Traditional Multi-Cam Video (60-120 min)',
      telugu: 'ఫుల్ ట్రెడిషనల్ మల్టీ-క్యామ్ వీడియో',
      clientPrice: 12000,
      studioPrice: 7500,
      clientPriceBadge: '₹12,000',
      studioPriceBadge: '₹7,500 (Trade)',
      turnaround: '7-10 Days',
      desc: 'Complete sacred ritual documentary: Mangalasnanam, Talambralu, Agni Sakshi, and Kanyadaanam multi-cam.'
    },
    {
      id: 'video-sde',
      title: 'Same-Day Edit (SDE) Reception Screening',
      telugu: 'సేమ్-డే ఎడిట్ (రిసెప్షన్ LED స్క్రీన్)',
      clientPrice: 12000,
      studioPrice: 8000,
      clientPriceBadge: '₹12,000',
      studioPriceBadge: '₹8,000 (Trade)',
      turnaround: 'Same Evening',
      desc: 'Morning wedding ceremony edited on-site and screened on the LED wall the same reception evening.'
    },
    {
      id: 'video-prewedding',
      title: 'Pre-Wedding Romantic Love Story Film',
      telugu: 'ప్రీ-వెడ్డింగ్ లవ్ స్టోరీ ఫిలిం',
      clientPrice: 5000,
      studioPrice: 3200,
      clientPriceBadge: '₹5,000',
      studioPriceBadge: '₹3,200 (Trade)',
      turnaround: '3-5 Days',
      desc: 'Romantic outdoor couple film with drone overlays, slow motion poetry, and licensed background score.'
    }
  ],

  invitationsAndFlex: [
    {
      id: 'flex-whatsapp-invite',
      title: '60s Animated 4K WhatsApp Video Invitation',
      telugu: 'వాట్సాప్ 4K వీడియో ఆహ్వానం (సన్నాయి మేళం)',
      clientPrice: 1999,
      studioPrice: 950,
      clientPriceBadge: '₹1,999',
      studioPriceBadge: '₹950 (Trade)',
      turnaround: '24-48 Hours',
      desc: 'Animated Telugu wedding invitation with auspicious Sannai Melam BGM, temple motifs, and venue Google Map QR.'
    },
    {
      id: 'flex-standee',
      title: 'Retractable Welcome Roll-Up Standee (6×3 ft)',
      telugu: 'వెల్‌కమ్ రోల్-అప్ స్టాండీ (6×3 అడుగులు)',
      clientPrice: 1800,
      studioPrice: 850,
      clientPriceBadge: '₹1,800',
      studioPriceBadge: '₹850 (Trade)',
      turnaround: '2 Days',
      desc: 'Entrance standee with anodized aluminum retractable stand, high-density non-tearable media, and carry bag.'
    },
    {
      id: 'flex-mandap-banner',
      title: 'Grand Mandap Entrance Flex Banner (10×8 ft)',
      telugu: 'మండపం ఎంట్రన్స్ ఫ్లెక్స్ (10×8 అడుగులు)',
      clientPrice: 2400,
      studioPrice: 1100,
      clientPriceBadge: '₹2,400',
      studioPriceBadge: '₹1,100 (Trade)',
      turnaround: '2 Days',
      desc: 'Heavy Star Flex 340 GSM with brass eyelets and reinforced hemmed edges for grand hall entrances.'
    },
    {
      id: 'flex-hoarding',
      title: 'Roadside & Highway Wedding Hoarding (40×20 ft)',
      telugu: 'రోడ్‌సైడ్ వెడ్డింగ్ హోర్డింగ్ (40×20 అడుగులు)',
      clientPrice: 12000,
      studioPrice: 6500,
      clientPriceBadge: '₹12,000',
      studioPriceBadge: '₹6,500 (Trade)',
      turnaround: '3 Days',
      desc: 'Ultra-high visibility large format solvent press on heavy-duty outdoor vinyl flex.'
    },
    {
      id: 'flex-desk-calendar',
      title: 'Personalized 12-Month Tabletop Desk Calendar',
      telugu: '12-నెలల టేబుల్‌టాప్ డెస్క్ క్యాలెండర్',
      clientPrice: 1200,
      studioPrice: 650,
      clientPriceBadge: '₹1,200',
      studioPriceBadge: '₹650 (Trade)',
      turnaround: '2-3 Days',
      desc: '12 Couple photos with wooden easel stand and metallic pearl paper print.'
    }
  ]
};

// Update global servicesCatalog in content
content.global.servicesCatalog = servicesCatalog;

// Also update home page hero and marquee
const hero = content.pages.home.find(b => b.id === 'block-hero');
if (hero) {
  hero.props.titlePart1 = 'Wedding Albums & Video';
  hero.props.titleScramble = 'Per-Sheet Pricing · Storefront & Studio';
  hero.props.subtitle = 'Andhra Pradesh & Telangana #1 hub for couples & photo studios. Transparent Per-Sheet pricing across all Landscape & Portrait album sizes, 4K video editing, animated invites & flex.';
  hero.props.btn1Text = 'Browse All Products & Prices';
  hero.props.btn1Link = '/shop';
  hero.props.btn2Text = 'Per-Sheet Price Calculator';
  hero.props.btn2Link = '#estimator';
}

const marquee = content.pages.home.find(b => b.id === 'block-marquee');
if (marquee) {
  marquee.props.items = [
    '👑 Album Editing + Printing Combined',
    '↔️ 12×36 Royal Panoramic (from ₹260/sh · Studio ₹180/sh)',
    '↕️ 18×12 Grand Vertical Magazine (from ₹240/sh · Studio ₹165/sh)',
    '💎 4mm Crystal Acrylic 3D Glass & Royal Velvet Covers',
    '🧻 100% Waterproof Non-Tear Core (₹0 Standard)',
    '🎬 4K Cinematic Teasers & Instagram Reels 5-Pack',
    '💌 60s Animated WhatsApp Video Invitations',
    '🚩 Mandap Entrance Flex & Roll-Up Standees',
    '⚡ Up to 40% Studio Wholesale Trade Discount'
  ];
}

const teaser = content.pages.home.find(b => b.id === 'block-servicesteaser');
if (teaser) {
  teaser.props.eyebrow = '✦ STOREFRONT & STUDIO CATALOG ✦';
  teaser.props.title = 'Complete Wedding Media Offerings';
  teaser.props.subtitle = 'All album sizes, paper finishes, cinematic video editing, and event flex with transparent upfront pricing.';
  teaser.props.btnText = 'View Complete Catalog & Prices';
  teaser.props.btnLink = '/shop';
  teaser.props.services = [
    { icon: 'BookOpen', title: 'Landscape Albums (↔️)', sub: '12×36, 14×40, 12×30, 15×30 • from ₹160/sh', path: '/shop?cat=albums&orientation=landscape', color: '#D4AF37' },
    { icon: 'BookOpen', title: 'Portrait Albums (↕️)', sub: '18×12, 15×12, 14×11 • from ₹120/sh', path: '/shop?cat=albums&orientation=portrait', color: '#C5A059' },
    { icon: 'Video', title: 'Cinematic Video Editing', sub: 'Reels, Teasers & Full Multi-Cam • from ₹3,500', path: '/shop?cat=video', color: '#9C27B0' },
    { icon: 'Gift', title: 'WhatsApp Invites & Flex', sub: 'Animated Invites & Mandap Standees • from ₹1,800', path: '/shop?cat=flex', color: '#2E7D32' }
  ];
}

// Write back
fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
if (fs.existsSync(fallbackPath)) {
  fs.writeFileSync(fallbackPath, JSON.stringify(content, null, 2));
}

console.log('SUCCESS: content.json and content_fallback.json updated with master dual-portal catalog!');
