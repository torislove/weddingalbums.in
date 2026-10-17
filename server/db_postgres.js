import pg from 'pg';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const generateId = () => crypto.randomBytes(12).toString('hex');
const nowIso = () => new Date().toISOString();

// ==========================================
// SEED & FALLBACK IN-MEMORY STORE
// ==========================================
// Seed/demo password. Precomputed hash below matches the default demo credentials (admin123).
// For real deployments set ADMIN_SEED_PASSWORD (hashed at boot with bcryptjs).
const adminPasswordHash = (process.env.ADMIN_SEED_PASSWORD && process.env.ADMIN_SEED_PASSWORD !== 'admin123')
  ? bcrypt.hashSync(process.env.ADMIN_SEED_PASSWORD, 10)
  : '$2a$10$aRvBEr02kbV.9jbkGLmkH.gCsgQMUdQ3iGghafWf2nLQZj4rKPlcW';

const memStore = {
  users: [
    {
      id: 'admin-001',
      _id: 'admin-001',
      name: 'Super Admin',
      email: 'admin@weddingalbums.in',
      password: adminPasswordHash,
      role: 'admin',
      wallet_balance: 10000,
      createdAt: nowIso()
    },
    {
      id: 'sysadmin-001',
      _id: 'sysadmin-001',
      name: 'System Admin',
      email: 'sysadmin@weddingalbums.in',
      password: adminPasswordHash,
      role: 'sysadmin',
      wallet_balance: 10000,
      createdAt: nowIso()
    },
    {
      id: 'uiadmin-001',
      _id: 'uiadmin-001',
      name: 'Content Admin',
      email: 'contentadmin@weddingalbums.in',
      password: adminPasswordHash,
      role: 'content_admin',
      wallet_balance: 10000,
      createdAt: nowIso()
    },
    {
      id: 'studio-001',
      _id: 'studio-001',
      name: 'Studio Partner',
      email: 'studio@weddingalbums.in',
      studioName: 'Royal Wedding Studio',
      password: adminPasswordHash,
      role: 'b2b',
      wallet_balance: 5000,
      createdAt: nowIso()
    },
    {
      id: 'editor-001',
      _id: 'editor-001',
      name: 'Editor Pro',
      email: 'editor@weddingalbums.in',
      password: adminPasswordHash,
      role: 'editor',
      wallet_balance: 2500,
      createdAt: nowIso()
    },
    {
      id: 'client-001',
      _id: 'client-001',
      name: 'Customer',
      email: 'client@weddingalbums.in',
      phone: '9876543210',
      password: adminPasswordHash,
      role: 'b2c',
      wallet_balance: 500,
      createdAt: nowIso()
    }
  ],
  packages: [
    { 
      id: 'pkg-1', _id: 'pkg-1', tier: 'The Haldi & Mehendi Mini-Shoot', category: 'combo', price: '₹30,000', priceMax: '₹45,000', priceType: 'range', 
      features: ['Candid Photography', '1 Videographer', '50-page small album', 'Edited Reels'], 
      popular: false, b2bOrB2c: 'b2c', color: '#f59e0b', coverImage: '', isActive: true, sortOrder: 1, createdAt: nowIso()
    },
    { 
      id: 'pkg-2', _id: 'pkg-2', tier: 'Traditional Telugu Muhurtham', category: 'combo', price: '₹85,000', priceType: 'starting_at', 
      features: ['2 Traditional Photographers', '1 Traditional Videographer', 'LED Screens Setup', 'Basic Album (12x15)'], 
      popular: true, b2bOrB2c: 'b2c', color: '#D4AF37', coverImage: '', isActive: true, sortOrder: 2, createdAt: nowIso()
    },
    { 
      id: 'pkg-3', _id: 'pkg-3', tier: 'The Premium Cinematic Story', category: 'combo', price: '₹1,50,000', priceType: 'starting_at', 
      features: ['Candid + Traditional Photo', 'Cinematic Drone Coverage', '5-min Cinematic Teaser', 'Full Story Film', 'Premium Acrylic Album'], 
      popular: true, b2bOrB2c: 'b2c', color: '#10b981', coverImage: '', isActive: true, sortOrder: 3, createdAt: nowIso()
    },
    {
      id: 'pkg-4', _id: 'pkg-4', tier: 'Studio Bulk Karizma Editing', category: 'photo', price: '₹12 / page', priceType: 'fixed',
      features: ['Color Correction', 'Skin Softening', 'Background Cleanup', '24hr Turnaround'],
      popular: true, b2bOrB2c: 'b2b', color: '#6366f1', coverImage: '', isActive: true, sortOrder: 1, createdAt: nowIso()
    }
  ],
  services: [
    { id: 'srv-pe-1', _id: 'srv-pe-1', category: 'Photo Editing', name: 'Telugu Pelli Skin Retouching & Beauty Clean-up', telugu: 'తెలుగు పెళ్లి స్కిన్ రీటచింగ్ & బ్యూటీ క్లీనప్', basePrice: 2500, estimatedDaysToDeliver: 2, processDescription: '1. RAW photo intake -> 2. Natural blemish removal & skin smoothing -> 3. Gold & silk jewellery pop -> 4. High-res delivery', features: ['Natural Skin Texture Retention', 'Bridal Jewellery Shine Boost', 'Pelli Bottu & Tilak Sharpening'], isActive: true },
    { id: 'srv-pe-2', _id: 'srv-pe-2', category: 'Photo Editing', name: 'Traditional Karizma PSD Creative Designing', telugu: 'కరిజ్మా క్రియేటివ్ డిజైనింగ్ (PSD)', basePrice: 1200, estimatedDaysToDeliver: 3, processDescription: '1. Photo sequence review -> 2. Custom typography & Telugu shlokas -> 3. Storytelling multi-photo spread layout -> 4. Digital proofing', features: ['Custom Telugu Shlokas & Typography', 'Seamless 12x36 Spreads', 'Mandap & Jeelakarra Bellam Theme Frames'], isActive: true },
    { id: 'srv-pe-3', _id: 'srv-pe-3', category: 'Photo Editing', name: 'AI Sky, Mandap & Lighting Background Enhancement', telugu: 'AI స్కై & మండపం బ్యాక్‌గ్రౌండ్ ఫిక్స్', basePrice: 1500, estimatedDaysToDeliver: 1, processDescription: '1. Unwanted background element removal -> 2. Mandap floral garland enhancement -> 3. Golden hour sky replacement -> 4. Color calibration', features: ['Floral Color Vibrancy Boost', 'Crowd / Wire Removal', 'Atmospheric Lighting Fix'], isActive: true },
    { id: 'srv-pe-4', _id: 'srv-pe-4', category: 'Photo Editing', name: 'Vintage & Damaged Wedding Photo Restoration', telugu: 'పాత ఫొటోల రీస్టోరేషన్', basePrice: 800, estimatedDaysToDeliver: 2, processDescription: '1. High-resolution scan -> 2. Scratch, fold & water-stain repair -> 3. AI facial reconstruction -> 4. Vibrant colorization', features: ['Fold & Tear Repair', 'AI Face Feature Recovery', 'Full Natural Colorization'], isActive: true },
    { id: 'srv-pe-5', _id: 'srv-pe-5', category: 'Photo Editing', name: 'RAW Photo Culling & Selection (1,000 photos)', telugu: 'రా ఫొటోల కల్లింగ్ & బెస్ట్ సెలక్షన్', basePrice: 1200, estimatedDaysToDeliver: 1, processDescription: '1. Ingest camera RAWs -> 2. Filter blinks, blur & repeats -> 3. Tag highlight moments -> 4. Export shortlisted XML/XMP', features: ['Blink & Blur Elimination', 'Best Expression Selection', 'Lightroom / Capture One Ready'], isActive: true },
    { id: 'srv-pe-6', _id: 'srv-pe-6', category: 'Photo Editing', name: 'Pro Color Grading & Tone Matching (300 photos)', telugu: 'సినిమాటిక్ కలర్ గ్రేడింగ్', basePrice: 3000, estimatedDaysToDeliver: 2, processDescription: '1. Tone curve normalization -> 2. Warm Telugu wedding color LUTs -> 3. Consistent skin tonality across cameras -> 4. Batch export', features: ['Rich Haldi Warm Tones', 'Silk Saree Color Fidelity', 'Multi-Camera Uniformity'], isActive: true },

    { id: 'srv-ve-1', _id: 'srv-ve-1', category: 'Video Editing', name: '4K Cinematic Wedding Teaser (1-3 min)', telugu: '4K సినిమాటిక్ టీజర్ (1-3 నిమిషాలు)', basePrice: 7500, estimatedDaysToDeliver: 4, processDescription: '1. Best cinematic moments cut -> 2. Emotion-driven background music score -> 3. 4K film color grading -> 4. Sound effects & dialogue master', features: ['4K Dolby Vision Color', 'Custom Telugu Film Score Mix', 'Vertical Reel Cut Included'], isActive: true },
    { id: 'srv-ve-2', _id: 'srv-ve-2', category: 'Video Editing', name: 'Traditional Long-Form Video Edit (1 to 4 Hours)', telugu: 'ట్రెడిషనల్ ఫుల్ వీడియో ఎడిటింగ్ (1-4 గంటలు)', basePrice: 18000, estimatedDaysToDeliver: 7, processDescription: '1. Multi-camera timeline sync -> 2. Complete ritual chapters (Snanam, Talambralu, Kanyadanam) -> 3. Traditional songs & titles -> 4. Pendrive & Cloud delivery', features: ['Multi-Cam Ritual Sync', 'Ceremony Chapter Menus', 'Crystal Clear Audio Cleanup'], isActive: true },
    { id: 'srv-ve-3', _id: 'srv-ve-3', category: 'Video Editing', name: 'Wedding Highlights Cinematic Reel (5-10 min)', telugu: 'వెడ్డింగ్ హైలైట్స్ రీల్ (5-10 నిమిషాలు)', basePrice: 12000, estimatedDaysToDeliver: 5, processDescription: '1. Narrative story arc crafting -> 2. Couple vow / audio voiceover sync -> 3. Slow motion & drone highlights -> 4. Full HD / 4K master export', features: ['Dynamic Story Pacing', 'Drone & Slow-Mo Integration', 'Audio Dialogue Sweetening'], isActive: true },
    { id: 'srv-ve-4', _id: 'srv-ve-4', category: 'Video Editing', name: 'Same-Day Edit (SDE) Express for Reception Screen', telugu: 'సేమ్-డే ఎడిట్ (రిసెప్షన్ కోసం ఫాస్ట్ ట్రాక్)', basePrice: 10000, estimatedDaysToDeliver: 1, processDescription: '1. Rapid live ingest during muhurtham -> 2. 4-hour high-speed turnaround cut -> 3. Color grade & score -> 4. Playback file delivery for reception LED screen', features: ['4-6 Hour Guaranteed Delivery', 'Reception LED Ready Format', 'High Impact Emotional Cut'], isActive: true },
    { id: 'srv-ve-5', _id: 'srv-ve-5', category: 'Video Editing', name: 'Instagram Reels / Shorts 5-Pack (9:16)', telugu: 'ఇన్‌స్టాగ్రామ్ రీల్స్ 5-ప్యాక్', basePrice: 4500, estimatedDaysToDeliver: 2, processDescription: '1. Viral trending music selection -> 2. 9:16 vertical crop & tracking -> 3. Beat-matched snappy cuts -> 4. Ready-to-post WhatsApp/IG export', features: ['5 High-Impact 9:16 Videos', 'Trending Audio Synchronized', 'Hook-Optimized Edits'], isActive: true },
    { id: 'srv-ve-6', _id: 'srv-ve-6', category: 'Video Editing', name: 'Mangalasnanam & Traditional Music Sound Mastering', telugu: 'మంగళస్నానం & సంప్రదాయ ఆడియో మాస్టరింగ్', basePrice: 3000, estimatedDaysToDeliver: 2, processDescription: '1. Mic noise & mic feedback cleaning -> 2. Traditional Nadaswaram / Sannai Melam equalization -> 3. Mantra clarity enhancement -> 4. Master audio mixdown', features: ['Mantra Vocal Clarity', 'Purohit Audio De-Noise', 'Nadaswaram Harmonic Balance'], isActive: true },
    { id: 'srv-ve-7', _id: 'srv-ve-7', category: 'Video Editing', name: 'Pre-Wedding Love Story Cinematic Film', telugu: 'ప్రీ-వెడ్డింగ్ లవ్ స్టోరీ ఫిలిం', basePrice: 15000, estimatedDaysToDeliver: 5, processDescription: '1. Romantic storyline editing -> 2. Dialogue interview overlays -> 3. Cinematic drone & outdoor color grade -> 4. 4K delivery', features: ['Romantic Color LUTs', 'Voiceover & Story Script Sync', 'YouTube 4K & Mobile Formats'], isActive: true },

    { id: 'srv-pr-1', _id: 'srv-pr-1', category: 'Album Printing', name: 'Karizma 12×36 Lay-Flat Flush Mount Lab Printing', telugu: 'కరిజ్మా 12×36 లే-ఫ్లాట్ ప్రింటింగ్', basePrice: 4500, estimatedDaysToDeliver: 4, processDescription: '1. Color profile calibration -> 2. High-DPI thermal continuous tone print -> 3. Flush mount lay-flat creasing -> 4. Precision corner binding', features: ['100% Flat 180° Opening', 'Non-Fading 100-Year Lab Inks', 'Sturdy Thick Rigid Spine'], isActive: true },
    { id: 'srv-pr-2', _id: 'srv-pr-2', category: 'Album Printing', name: '12×30 Grand Landscape Luxury Printing', telugu: '12×30 గ్రాండ్ ల్యాండ్‌స్కేప్ ప్రింటింగ్', basePrice: 4000, estimatedDaysToDeliver: 4, processDescription: '1. Pre-flight check -> 2. Silver halide print press -> 3. Matte thermal lamination -> 4. Padded hardcover binding', features: ['Wide Panoramic Format', 'Fingerprint Resistant', 'Padded Luxury Cover'], isActive: true },
    { id: 'srv-pr-3', _id: 'srv-pr-3', category: 'Album Printing', name: '3D Acrylic Glass Crystal Cover Upgrade', telugu: '3D క్రిస్టల్ యాక్రిలిక్ గ్లాస్ కవర్', basePrice: 1500, estimatedDaysToDeliver: 2, processDescription: '1. High-gloss photo mounting -> 2. 5mm diamond-beveled acrylic bonding -> 3. Scratch-proof optical seal -> 4. Gold foil side trim', features: ['5mm Diamond-Polished Glass', 'Ultra-Deep 3D Pop Effect', 'Scratch Resistant Coating'], isActive: true },
    { id: 'srv-pr-4', _id: 'srv-pr-4', category: 'Album Printing', name: 'Royal Leatherette Briefcase Box & Bag', telugu: 'రాయల్ లెథరెట్ బ్రీఫ్‌కేస్ బాక్స్', basePrice: 1800, estimatedDaysToDeliver: 2, processDescription: '1. Handcrafted wooden core box -> 2. Premium faux leatherette wrapping -> 3. Personalized couple name gold foil emboss -> 4. Velvet interior lining', features: ['Embossed Gold Foil Names', 'Heavy-Duty Brass Locks', 'Dust & Moisture Safe Protection'], isActive: true },
    { id: 'srv-pr-5', _id: 'srv-pr-5', category: 'Album Printing', name: 'Parent Duplicate Album 6×18 (Pair of 2 Albums)', telugu: 'పేరెంట్ డూప్లికేట్ ఆల్బమ్స్ (2 కాపీలు 6×18)', basePrice: 3200, estimatedDaysToDeliver: 3, processDescription: '1. Auto-proportion scaled copy -> 2. Dual thermal press -> 3. Hardcover binding -> 4. Gift packaging for bride & groom parents', features: ['Exact Duplicate of Main Album', 'Perfect Compact Gift for Parents', 'Includes 2 Complete Albums'], isActive: true },

    { id: 'srv-fl-1', _id: 'srv-fl-1', category: 'Flex & Banners', name: 'Grand Mandap Entrance Flex (10×8 ft Star Media)', telugu: 'మండపం ఎంట్రన్స్ ఫ్లెక్స్ (10×8 అడుగులు)', basePrice: 2400, estimatedDaysToDeliver: 1, processDescription: '1. Traditional welcome design with couple photo & Telugu text -> 2. High-res Star Flex printing -> 3. Hemming & brass eyelets punching -> 4. Courier roll dispatch', features: ['Heavy Star Flex 340 GSM', 'Tear-Proof Brass Eyelets', 'Waterproof Outdoor Inks'], isActive: true },
    { id: 'srv-fl-2', _id: 'srv-fl-2', category: 'Flex & Banners', name: 'Roadside Wedding Hoarding (40×20 ft Heavy Duty)', telugu: 'రోడ్‌సైడ్ వెడ్డింగ్ హోర్డింగ్ (40×20 అడుగులు)', basePrice: 12000, estimatedDaysToDeliver: 2, processDescription: '1. Ultra-high visibility large font layout -> 2. Solvent wide-format press -> 3. Wind-resistant reinforced seams -> 4. Junction delivery / dispatch', features: ['40x20 ft Grand Scale', 'Vivid Visibility Day & Night', 'Reinforced Wind Slits'], isActive: true },
    { id: 'srv-fl-3', _id: 'srv-fl-3', category: 'Flex & Banners', name: 'Retractable Welcome Roll-Up Standee (6×3 ft)', telugu: 'వెల్‌కమ్ రోల్-అప్ స్టాండీ (6×3 అడుగులు)', basePrice: 1800, estimatedDaysToDeliver: 1, processDescription: '1. Modern aesthetic welcome design -> 2. Non-tearable grey-back vinyl print -> 3. Anodized aluminum stand fitting -> 4. Padded carry bag packing', features: ['Sturdy Aluminum Retractor', 'Smooth Non-Curling Vinyl', 'Includes Free Carry Bag'], isActive: true },
    { id: 'srv-fl-4', _id: 'srv-fl-4', category: 'Flex & Banners', name: 'Animated Telugu WhatsApp Video Invitation', telugu: 'యానిమేటెడ్ వాట్సాప్ వీడియో ఆహ్వానం', basePrice: 1999, studioBasePrice: 1200, estimatedDaysToDeliver: 1, processDescription: '1. Muhurtham details & family names collection -> 2. 2D/3D traditional animated temple & mandap motif -> 3. Auspicious nadaswaram BGM sync -> 4. Ultra-light WhatsApp MP4 delivery', features: ['Traditional Telugu Typography', 'Auspicious Sannai Melam BGM', 'Under 15MB WhatsApp Ready'], isActive: true },

    { id: 'srv-cal-1', _id: 'srv-cal-1', category: 'Calendars & Keepsakes', name: 'Personalized 12-Month Tabletop Desk Calendar', telugu: '12-నెలల కపుల్ టేబుల్‌టాప్ డెస్క్ క్యాలెండర్', basePrice: 1200, studioBasePrice: 750, estimatedDaysToDeliver: 2, processDescription: '1. 12 month couple photo selection -> 2. Premium 300 GSM silk sheets print -> 3. Wooden easel / spiral stand mounting -> 4. Gift packaging', features: ['12 High-Res Selected Photos', 'Wooden Easel Stand Included', 'Telugu Tithi & Auspicious Muhurthams Marked'], isActive: true },
    { id: 'srv-cal-2', _id: 'srv-cal-2', category: 'Calendars & Keepsakes', name: 'Grand Wall Hanging Poster Calendar (12×18 Metallic)', telugu: 'గ్రాండ్ వాల్ పోస్టర్ క్యాలెండర్ (12×18 మెటాలిక్)', basePrice: 650, studioBasePrice: 380, estimatedDaysToDeliver: 1, processDescription: '1. Couple portrait layout with annual calendar grid -> 2. High-gloss metallic film press -> 3. Metal rim hanger rimming -> 4. Protective tube pack', features: ['12x18 Inch Grand Poster Format', 'Metallic Pearl Lamination', 'Metal Rim Hanger Ready'], isActive: true },
    { id: 'srv-cal-3', _id: 'srv-cal-3', category: 'Calendars & Keepsakes', name: 'Pocket Mini Calendars (Pack of 10 Copies)', telugu: 'పాకెట్ మినీ క్యాలెండర్లు (10 కాపీల సెట్)', basePrice: 990, studioBasePrice: 550, estimatedDaysToDeliver: 1, processDescription: '1. Wallet size couple photo + calendar card -> 2. Rounded corner die-cut -> 3. Waterproof thermal lamination -> 4. 10-pack delivery', features: ['Waterproof Wallet Card Format', 'Rounded Smooth Corners', '10 Identical Gift Keepsake Copies'], isActive: true },

    { id: 'srv-sh-1', _id: 'srv-sh-1', category: 'Shoots & Drone', name: 'Traditional Photography (Per Day Coverage)', telugu: 'ట్రెడిషనల్ ఫోటోగ్రఫీ (రోజుకి)', basePrice: 15000, estimatedDaysToDeliver: 1, processDescription: '1. Full ceremony coverage with pro flash setup -> 2. Stage group photos & rituals -> 3. Same-night RAW backup -> 4. Full RAW catalog export', features: ['Senior Wedding Photographer', 'Full Day Coverage', 'All Family Stage Groups'], isActive: true },
    { id: 'srv-sh-2', _id: 'srv-sh-2', category: 'Shoots & Drone', name: 'Candid Wedding Photography (Per Day Coverage)', telugu: 'క్యాండిడ్ వెడ్డింగ్ ఫోటోగ్రఫీ (రోజుకి)', basePrice: 25000, estimatedDaysToDeliver: 3, processDescription: '1. Natural unposed emotion & smile capture -> 2. Prime lens low-light mastery -> 3. Bride & groom aesthetic portraits -> 4. Curated highlight set', features: ['Artistic Natural Expressions', 'High-End Sony/Canon Prime Lenses', 'Magazine Style Portraits'], isActive: true },
    { id: 'srv-sh-3', _id: 'srv-sh-3', category: 'Shoots & Drone', name: '4K Cinematic Videography (Per Day Coverage)', telugu: '4K సినిమాటిక్ వీడియోగ్రఫీ (రోజుకి)', basePrice: 20000, estimatedDaysToDeliver: 2, processDescription: '1. Gimbal stabilized 4K 10-bit shooting -> 2. Cinematic slow-motion rituals -> 3. Dedicated audio recorder at mandap -> 4. Multi-angle footage ingest', features: ['Ronin Gimbal Stabilization', 'Wireless Lapel Microphones', '120fps Slow-Motion B-Roll'], isActive: true },
    { id: 'srv-sh-4', _id: 'srv-sh-4', category: 'Shoots & Drone', name: 'Dual Drone Aerial 4K Coverage (Per Day)', telugu: 'డ్రోన్ ఏరియల్ 4K కవరేజ్ (రోజుకి)', basePrice: 12000, estimatedDaysToDeliver: 1, processDescription: '1. DGCA licensed drone pilot -> 2. Baaraat & grand venue entrance bird-eye views -> 3. Talambralu overhead cinematic angle -> 4. Ultra-smooth 4K footage', features: ['DGCA Certified Pilot', 'Ultra 4K Overhead Angles', 'Mandap & Baaraat Flyovers'], isActive: true },
    { id: 'srv-sh-5', _id: 'srv-sh-5', category: 'Shoots & Drone', name: 'Multi-Camera YouTube Live Streaming Setup', telugu: 'యూట్యూబ్ లైవ్ స్ట్రీమింగ్ సెటప్', basePrice: 15000, estimatedDaysToDeliver: 0, processDescription: '1. Multi-cam switcher with wireless video transmitters -> 2. High-speed bonded 4G/5G internet setup -> 3. Dedicated YouTube 1080p 60fps stream -> 4. Instant replay recording', features: ['Multi-Cam Live Mixing', 'Bonded Internet Reliability', 'Custom Telugu Wedding Frame Overlay'], isActive: true }
  ],
  sheetTypes: [
    { id: 'sheet-1', _id: 'sheet-1', name: 'Non-Tearable Velvet Touch', telugu: 'సిల్కీ వెల్వెట్ మ్యాట్ (వాటర్ ప్రూఫ్)', pricePerSheet: 65, studioPricePerSheet: 42, premiumCoverSurcharge: 1200, studioCoverSurcharge: 750, multiplier: 1.0, popular: true, description: 'Ultra-smooth matte finish, 100% waterproof and tear-resistant. Soft luxury feather touch.', isActive: true },
    { id: 'sheet-2', _id: 'sheet-2', name: 'High-Gloss Metallic', telugu: 'రాయల్ హై-గ్లాస్ మెటాలిక్', pricePerSheet: 85, studioPricePerSheet: 55, premiumCoverSurcharge: 1400, studioCoverSurcharge: 900, multiplier: 1.25, popular: true, description: 'Lustrous high-contrast sheen that brings gold jewellery and wedding silks alive with breathtaking vibrancy.', isActive: true },
    { id: 'sheet-3', _id: 'sheet-3', name: 'Royal Feather Touch Leatherette', telugu: 'రాయల్ ఫెదర్ టచ్ లెథరెట్', pricePerSheet: 110, studioPricePerSheet: 72, premiumCoverSurcharge: 1800, studioCoverSurcharge: 1150, multiplier: 1.4, popular: false, description: 'Ultra-luxury textured sheets with genuine tactile grain and rich gold hot-stamping on edges.', isActive: true },
    { id: 'sheet-4', _id: 'sheet-4', name: 'HD Thermal Lamination Matte', telugu: 'హై-డెఫినిషన్ థర్మల్ లామినేషన్', pricePerSheet: 50, studioPricePerSheet: 32, premiumCoverSurcharge: 800, studioCoverSurcharge: 500, multiplier: 1.15, popular: false, description: 'Durable, crystal scratch-resistant thermal coating. Ideal for everyday studio handling and longevity.', isActive: true },
    { id: 'sheet-5', _id: 'sheet-5', name: 'Silk Matte Pearl Lustre', telugu: 'సిల్క్ మ్యాట్ పెర్ల్ లస్టర్', pricePerSheet: 95, studioPricePerSheet: 62, premiumCoverSurcharge: 1500, studioCoverSurcharge: 950, multiplier: 1.3, popular: false, description: 'Micro-pearlescent sheen with true-to-life skin tones and natural highlights without glare.', isActive: true },
    { id: 'sheet-6', _id: 'sheet-6', name: 'Crystal High Gloss (Ultra Mirror)', telugu: 'క్రిస్టల్ అల్ట్రా మిర్రర్ గ్లోస్', pricePerSheet: 75, studioPricePerSheet: 48, premiumCoverSurcharge: 1000, studioCoverSurcharge: 650, multiplier: 1.2, popular: false, description: 'Super-reflective mirror gloss. Vivid colors, high contrast deep blacks and saturated wedding reds.', isActive: true },
    { id: 'sheet-7', _id: 'sheet-7', name: 'Silver Halide True Photographic (Fuji DP2)', telugu: 'సిల్వర్ హాలైడ్ ట్రూ ఫోటో పేపర్', pricePerSheet: 125, studioPricePerSheet: 82, premiumCoverSurcharge: 2000, studioCoverSurcharge: 1300, multiplier: 1.5, popular: false, description: 'Continuous tone optical RGB exposure. 100-year archival rating without inkjet dot patterns.', isActive: true },
    { id: 'sheet-8', _id: 'sheet-8', name: 'Embossed Canvas Texture Fine Art', telugu: 'కాన్వాస్ ఎంబోస్డ్ ఫైన్ ఆర్ట్ టెక్స్చర్', pricePerSheet: 105, studioPricePerSheet: 68, premiumCoverSurcharge: 1600, studioCoverSurcharge: 1050, multiplier: 1.35, popular: false, description: 'Tactile painterly woven fabric texture with artistic micro-embossing for timeless heirloom portraiture.', isActive: true }
  ],
  albumSizes: [
    // LANDSCAPE SIZES (హారిజాంటల్ / ల్యాండ్‌స్కేప్)
    { id: 'size-1', _id: 'size-1', name: '12×36 Royal Spread (Panoramic)', dimensions: '12×36 inches', orientation: 'landscape', telugu: '12×36 రాయల్ పానోరమిక్ (ఆంధ్ర నెం.1 ఎంపిక ⭐)', basePrice: 9500, studioBasePrice: 6800, popular: true, description: '36 inch wide panoramic views. India\'s #1 wedding album choice.', isBundle: false, bundleDiscount: 0, isActive: true },
    { id: 'size-2', _id: 'size-2', name: '12×30 Classic Landscape', dimensions: '12×30 inches', orientation: 'landscape', telugu: '12×30 క్లాసిక్ ల్యాండ్‌స్కేప్', basePrice: 8500, studioBasePrice: 6000, popular: false, description: 'Traditional Telugu standard widescreen layout for mandap & stage spreads.', isBundle: false, bundleDiscount: 0, isActive: true },
    { id: 'size-3', _id: 'size-3', name: '12×24 Compact Landscape', dimensions: '12×24 inches', orientation: 'landscape', telugu: '12×24 కాంపాక్ట్ ల్యాండ్‌స్కేప్', basePrice: 7500, studioBasePrice: 5200, popular: false, description: 'Budget-friendly album with modern sleek aspect ratio.', isBundle: false, bundleDiscount: 0, isActive: true },
    { id: 'size-4', _id: 'size-4', name: '12×18 Traditional Landscape', dimensions: '12×18 inches', orientation: 'landscape', telugu: '12×18 ట్రెడిషనల్ ల్యాండ్‌స్కేప్', basePrice: 6500, studioBasePrice: 4500, popular: false, description: 'Traditional portrait-landscape balance, timeless design.', isBundle: false, bundleDiscount: 0, isActive: true },
    { id: 'size-5', _id: 'size-5', name: '10×24 Compact Feast Landscape', dimensions: '10×24 inches', orientation: 'landscape', telugu: '10×24 కాంపాక్ట్ ఫీస్ట్ ల్యాండ్‌స్కేప్', basePrice: 5800, studioBasePrice: 4000, popular: false, description: 'Lightweight easy-to-carry format for family functions.', isBundle: false, bundleDiscount: 0, isActive: true },
    
    // PORTRAIT SIZES (వర్టికల్ / పోర్ట్రెయిట్)
    { id: 'size-6', _id: 'size-6', name: '18×12 Grand Vertical Portrait', dimensions: '18×12 inches', orientation: 'portrait', telugu: '18×12 గ్రాండ్ వర్టికల్ పోర్ట్రెయిట్ (రాయల్ మ్యాగజైన్)', basePrice: 9000, studioBasePrice: 6400, popular: true, description: 'Tall royal magazine format. Stunning full-length bridal silk & jewellery spreads.', isBundle: false, bundleDiscount: 0, isActive: true },
    { id: 'size-7', _id: 'size-7', name: '15×12 Classic Vertical Portrait', dimensions: '15×12 inches', orientation: 'portrait', telugu: '15×12 క్లాసిక్ వర్టికల్ పోర్ట్రెయిట్', basePrice: 8000, studioBasePrice: 5600, popular: false, description: 'Traditional vertical bridal album for stage portraits and couple framing.', isBundle: false, bundleDiscount: 0, isActive: true },
    { id: 'size-8', _id: 'size-8', name: '14×11 Fine Art Vertical Portrait', dimensions: '14×11 inches', orientation: 'portrait', telugu: '14×11 ఫైన్ ఆర్ట్ పోర్ట్రెయిట్', basePrice: 7200, studioBasePrice: 5000, popular: false, description: 'Editorial fashion photography format for candid contemporary stories.', isBundle: false, bundleDiscount: 0, isActive: true },
    { id: 'size-9', _id: 'size-9', name: '12×9 Compact Vertical Portrait', dimensions: '12×9 inches', orientation: 'portrait', telugu: '12×9 కాంపాక్ట్ వర్టికల్ పోర్ట్రెయిట్', basePrice: 5500, studioBasePrice: 3800, popular: false, description: 'Handy vertical book for intimate Haldi, Mehendi & Sangeet moments.', isBundle: false, bundleDiscount: 0, isActive: true },
    { id: 'size-10', _id: 'size-10', name: '10×8 Family Gift Portrait', dimensions: '10×8 inches', orientation: 'portrait', telugu: '10×8 ఫ్యామిలీ గిఫ్ట్ పోర్ట్రెయిట్', basePrice: 4500, studioBasePrice: 3100, popular: false, description: 'Compact vertical keepsake gift album for parents and close relatives.', isBundle: false, bundleDiscount: 0, isActive: true },

    // BUNDLES (బండిల్స్)
    { id: 'size-11', _id: 'size-11', name: 'Royal Family Bundle (12×36 + 2x Parent 6×18)', dimensions: '12×36 + 2x 6×18', orientation: 'landscape', telugu: 'రాయల్ ఫ్యామిలీ బండిల్ (కపుల్ + 2 పేరెంట్ ఆల్బమ్స్)', basePrice: 11500, studioBasePrice: 8200, popular: true, description: 'Master 12×36 album for couple + 2 matching 6×18 parent duplicate albums!', isBundle: true, bundleDiscount: 2500, isActive: true }
  ],
  orders: [],
  tasks: [],
  projects: [],
  payoutRequests: [],
  configs: new Map(),
  carts: new Map(),
  refreshTokens: [],
  auditLogs: [],
  contactLeads: [],
  contents: new Map(),
  media: []
};

// State flag for PostgreSQL live connection
let pool = null;
let isPostgresLive = false;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PG_URI;
    
    // Only attempt real pool if it's NOT localhost or explicitly set
    if (connectionString && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1')) {
      try {
        pool = new Pool({
          connectionString,
          ssl: { rejectUnauthorized: false },
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        });
        console.log('🐘 Remote PostgreSQL Pool initialized');
      } catch (e) {
        console.warn('⚠️ Could not create pool:', e.message);
      }
    }
  }
  return pool;
}

// Resilient query executor: queries Postgres if connected, otherwise returns null to trigger fallback
export async function query(text, params = []) {
  const p = getPool();
  if (p && isPostgresLive) {
    try {
      return await p.query(text, params);
    } catch (err) {
      console.warn('⚠️ Live PostgreSQL query failed; falling back to memory store:', err.message);
      return null;
    }
  }
  return null;
}

// Initialize tables if live PostgreSQL is connected
export async function initDatabase() {
  const p = getPool();
  if (!p) {
    console.log('ℹ️ Running in resilient fallback mode with pre-seeded wedding catalog data.');
    return;
  }

  try {
    const client = await Promise.race([
      p.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
    ]);
    client.release();
    isPostgresLive = true;
    console.log('⚡ Connected to remote PostgreSQL database successfully!');

    // Initialize Schema on remote database
    await p.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(64) NOT NULL,
        wallet_balance NUMERIC DEFAULT 0,
        phone VARCHAR(64),
        city VARCHAR(128),
        "studioName" VARCHAR(255),
        "gstNumber" VARCHAR(128),
        "coupleNames" VARCHAR(255),
        "weddingDate" VARCHAR(64),
        "portfolioLink" TEXT,
        specialization VARCHAR(255),
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS packages (
        id VARCHAR(64) PRIMARY KEY,
        tier VARCHAR(255) NOT NULL,
        category VARCHAR(128) NOT NULL,
        price VARCHAR(64) NOT NULL,
        suffix VARCHAR(64),
        features JSONB DEFAULT '[]',
        popular BOOLEAN DEFAULT false,
        "isActive" BOOLEAN DEFAULT true,
        "sortOrder" INTEGER DEFAULT 0,
        "b2bOrB2c" VARCHAR(32) NOT NULL,
        color VARCHAR(64) DEFAULT '#9E9E9E',
        "coverImage" TEXT DEFAULT '',
        "priceType" VARCHAR(64) DEFAULT 'fixed',
        "priceMax" VARCHAR(64),
        "includedServiceIds" JSONB DEFAULT '[]',
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE packages ADD COLUMN IF NOT EXISTS "apply" JSONB DEFAULT NULL;
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(64) PRIMARY KEY,
        category VARCHAR(128) NOT NULL,
        name VARCHAR(255) NOT NULL,
        "basePrice" NUMERIC NOT NULL,
        "estimatedDaysToDeliver" INTEGER DEFAULT 2,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS sheet_types (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        telugu VARCHAR(255),
        "pricePerSheet" NUMERIC DEFAULT 65,
        "studioPricePerSheet" NUMERIC DEFAULT 42,
        "premiumCoverSurcharge" NUMERIC DEFAULT 0,
        "studioCoverSurcharge" NUMERIC DEFAULT 0,
        multiplier NUMERIC DEFAULT 1.0,
        description TEXT,
        popular BOOLEAN DEFAULT false,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS album_sizes (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        dimensions VARCHAR(128),
        orientation VARCHAR(64) DEFAULT 'landscape',
        telugu VARCHAR(255),
        "basePrice" NUMERIC,
        "studioBasePrice" NUMERIC,
        popular BOOLEAN DEFAULT false,
        "isBundle" BOOLEAN DEFAULT false,
        "bundleDiscount" NUMERIC DEFAULT 0,
        description TEXT,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        status VARCHAR(64) DEFAULT 'Pending',
        client_id VARCHAR(64),
        studio_id VARCHAR(64),
        data JSONB DEFAULT '{}',
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(64) PRIMARY KEY,
        editor_id VARCHAR(64),
        status VARCHAR(64) DEFAULT 'Pending',
        data JSONB DEFAULT '{}',
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(64) PRIMARY KEY,
        status VARCHAR(64) DEFAULT 'Active',
        data JSONB DEFAULT '{}',
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS configs (
        key VARCHAR(128) PRIMARY KEY,
        options JSONB DEFAULT '[]',
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS carts (
        id VARCHAR(64) PRIMARY KEY,
        "userId" VARCHAR(64) UNIQUE NOT NULL,
        items JSONB DEFAULT '[]',
        "totalAmount" NUMERIC DEFAULT 0,
        "estimatedDeliveryEta" INTEGER DEFAULT 3,
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        revoked BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        action VARCHAR(128) NOT NULL,
        details TEXT,
        ip VARCHAR(64),
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS contents (
        key VARCHAR(128) PRIMARY KEY,
        data JSONB NOT NULL,
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS media (
        id VARCHAR(64) PRIMARY KEY,
        url TEXT NOT NULL,
        type VARCHAR(64) DEFAULT 'image',
        "createdAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS content_history (
        id VARCHAR(64) PRIMARY KEY,
        key VARCHAR(128),
        data JSONB,
        "createdAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS payout_requests (
        id VARCHAR(64) PRIMARY KEY,
        "user_id" VARCHAR(64) DEFAULT '',
        "user_role" VARCHAR(64) DEFAULT '',
        amount NUMERIC DEFAULT 0,
        "upi_id" VARCHAR(255) DEFAULT '',
        status VARCHAR(64) DEFAULT 'pending',
        "txn_ref" VARCHAR(128) DEFAULT '',
        note TEXT DEFAULT '',
        data JSONB DEFAULT '{}',
        "createdAt" TIMESTAMPTZ DEFAULT NOW(),
        "updatedAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS contact_leads (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(64) DEFAULT '',
        "event_type" VARCHAR(128) DEFAULT '',
        "event_date" VARCHAR(64) DEFAULT '',
        message TEXT DEFAULT '',
        source VARCHAR(64) DEFAULT 'contact_form',
        status VARCHAR(64) DEFAULT 'new',
        data JSONB DEFAULT '{}',
        "createdAt" TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
      CREATE INDEX IF NOT EXISTS idx_orders_client ON orders ("client_id");
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
      CREATE INDEX IF NOT EXISTS idx_payouts_user ON payout_requests ("user_id");
      CREATE INDEX IF NOT EXISTS idx_refresh_hash ON refresh_tokens ("token_hash");
      CREATE INDEX IF NOT EXISTS idx_audit_ts ON audit_logs ("timestamp" DESC);
    `);
    console.log('✅ Remote PostgreSQL Tables Ready!');
  } catch (err) {
    isPostgresLive = false;
    console.log('ℹ️ Remote PostgreSQL not reached; serving pre-seeded catalog safely without 500 crashes.');
  }
}

// ==========================================
// MODELS (Resilient Dual Engine: Live Postgres / Memory Fallback)
// ==========================================

export const User = {
  async findOne(q) {
    if (isPostgresLive) {
      if (q.email) {
        const res = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [q.email]);
        if (res?.rows[0]) return { ...res.rows[0], _id: res.rows[0].id };
      }
      if (q.phone) {
        const res = await query('SELECT * FROM users WHERE phone = $1 LIMIT 1', [q.phone]);
        if (res?.rows[0]) return { ...res.rows[0], _id: res.rows[0].id };
      }
    }
    // Fallback store
    if (q.email) {
      const u = memStore.users.find(u => u.email.toLowerCase() === q.email.toLowerCase());
      return u ? { ...u, _id: u.id } : null;
    }
    if (q.phone) {
      const u = memStore.users.find(u => u.phone === q.phone);
      return u ? { ...u, _id: u.id } : null;
    }
    if (q.id || q._id) {
      return this.findById(q.id || q._id);
    }
    return null;
  },

  async findById(id) {
    if (isPostgresLive) {
      const res = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
      if (res?.rows[0]) return { ...res.rows[0], _id: res.rows[0].id };
    }
    const u = memStore.users.find(u => u.id === id);
    return u ? { ...u, _id: u.id } : null;
  },

  async find(filter = {}) {
    if (isPostgresLive) {
      const sql = filter.role ? 'SELECT * FROM users WHERE role = $1' : 'SELECT * FROM users';
      const params = filter.role ? [filter.role] : [];
      const res = await query(sql, params);
      if (res) return res.rows.map(r => ({ ...r, _id: r.id }));
    }
    let list = [...memStore.users];
    if (filter.role) list = list.filter(u => u.role === filter.role);
    return list.map(u => ({ ...u, _id: u.id }));
  },

  async countDocuments(filter = {}) {
    const list = await this.find(filter);
    return list.length;
  },

  async create(data) {
    const id = generateId();
    const newUser = {
      id,
      _id: id,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'b2c',
      wallet_balance: Number(data.wallet_balance || 0),
      phone: data.phone || null,
      city: data.city || null,
      studioName: data.studioName || null,
      gstNumber: data.gstNumber || null,
      coupleNames: data.coupleNames || null,
      weddingDate: data.weddingDate || null,
      portfolioLink: data.portfolioLink || null,
      specialization: data.specialization || null,
      createdAt: nowIso()
    };

    if (isPostgresLive) {
      await query(`
        INSERT INTO users (id, name, email, password, role, wallet_balance, phone, city, "studioName", "gstNumber", "coupleNames", "weddingDate", "portfolioLink", specialization)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        id, newUser.name, newUser.email, newUser.password, newUser.role, newUser.wallet_balance,
        newUser.phone, newUser.city, newUser.studioName, newUser.gstNumber, newUser.coupleNames,
        newUser.weddingDate, newUser.portfolioLink, newUser.specialization
      ]);
    }
    memStore.users.push(newUser);
    return newUser;
  },

  async updatePassword(id, hashedPassword) {
    if (isPostgresLive) {
      await query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
    }
    const u = memStore.users.find(u => u.id === id);
    if (u) u.password = hashedPassword;
  },

  async updateWalletBalance(id, amount) {
    if (isPostgresLive) {
      await query('UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2', [amount, id]);
    }
    const u = memStore.users.find(u => u.id === id);
    if (u) u.wallet_balance = (u.wallet_balance || 0) + amount;
  },

  async updateById(id, data) {
    return this.findByIdAndUpdate(id, data);
  },

  async findByIdAndUpdate(id, updateData) {
    const u = await this.findById(id);
    if (!u) return null;
    const merged = { ...u, ...updateData };
    if (isPostgresLive) {
      await query('UPDATE users SET name = $1, phone = $2, city = $3 WHERE id = $4', [merged.name, merged.phone, merged.city, id]);
    }
    const idx = memStore.users.findIndex(u => u.id === id);
    if (idx !== -1) memStore.users[idx] = merged;
    return merged;
  },

  async count(filter = {}) {
    if (isPostgresLive) {
      const res = await query('SELECT count(*)::int as count FROM users');
      if (res?.rows[0]) return res.rows[0].count;
    }
    let list = [...memStore.users];
    if (filter.role) list = list.filter(u => u.role === filter.role);
    return list.length;
  },

  async findAll({ role, search, page = 1, limit = 20 } = {}) {
    if (isPostgresLive) {
      let sql = 'SELECT * FROM users WHERE 1=1';
      const params = [];
      if (role) { params.push(role); sql += ` AND role = $${params.length}`; }
      if (search) { params.push(`%${search}%`); sql += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`; }
      sql += ` ORDER BY "createdAt" DESC LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
      const res = await query(sql, params);
      if (res) return res.rows.map(r => ({ ...r, _id: r.id }));
    }
    let list = [...memStore.users];
    if (role) list = list.filter(u => u.role === role);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(u => (u.name && u.name.toLowerCase().includes(s)) || (u.email && u.email.toLowerCase().includes(s)));
    }
    const offset = (page - 1) * limit;
    return list.slice(offset, offset + limit).map(u => ({ ...u, _id: u.id }));
  },

  async update(id, data) {
    return this.findByIdAndUpdate(id, data);
  },

  async delete(id) {
    if (isPostgresLive) {
      await query('DELETE FROM users WHERE id = $1', [id]);
    }
    memStore.users = memStore.users.filter(u => u.id !== id && u._id !== id);
    return { success: true };
  }
};

export const Package = {
  async find(filter = {}) {
    if (isPostgresLive) {
      let sql = 'SELECT * FROM packages';
      const params = [];
      if (filter.b2bOrB2c) { sql += ' WHERE "b2bOrB2c" = $1'; params.push(filter.b2bOrB2c); }
      else if (filter.isActive !== undefined) { sql += ' WHERE "isActive" = $1'; params.push(Boolean(filter.isActive)); }
      sql += ' ORDER BY "sortOrder" ASC';
      const res = await query(sql, params);
      if (res) return res.rows.map(r => ({ ...r, _id: r.id }));
    }
    let list = [...memStore.packages];
    if (filter.b2bOrB2c) list = list.filter(p => p.b2bOrB2c === filter.b2bOrB2c);
    if (filter.isActive !== undefined) list = list.filter(p => p.isActive === Boolean(filter.isActive));
    return list.map(p => ({ ...p, _id: p.id }));
  },
  async findById(id) {
    const list = await this.find();
    return list.find(p => p.id === id || p._id === id) || null;
  },
  async create(data) {
    const id = generateId();
    const pkg = { id, _id: id, ...data, createdAt: nowIso() };
    if (isPostgresLive) {
      await query(`
        INSERT INTO packages (id, tier, category, price, suffix, features, popular, "isActive", "sortOrder", "b2bOrB2c", color, "coverImage", "priceType", "priceMax", "apply")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [id, pkg.tier, pkg.category, pkg.price, pkg.suffix || null, JSON.stringify(pkg.features || []), Boolean(pkg.popular), pkg.isActive !== false, Number(pkg.sortOrder || 0), pkg.b2bOrB2c, pkg.color || '#9E9E9E', pkg.coverImage || '', pkg.priceType || 'fixed', pkg.priceMax || null, pkg.apply ? JSON.stringify(pkg.apply) : null]);
    }
    memStore.packages.push(pkg);
    return pkg;
  },
  async findByIdAndUpdate(id, data) {
    const pkg = await this.findById(id);
    if (!pkg) return null;
    const merged = { ...pkg, ...data };
    if (isPostgresLive) {
      try {
        await query(`
          UPDATE packages SET tier=$1, category=$2, price=$3, suffix=$4, features=$5, popular=$6, "isActive"=$7, "sortOrder"=$8, "b2bOrB2c"=$9, color=$10, "coverImage"=$11, "priceType"=$12, "priceMax"=$13, "apply"=$14, "updatedAt"=NOW()
          WHERE id=$15
        `, [merged.tier, merged.category, merged.price, merged.suffix || null, JSON.stringify(merged.features || []), Boolean(merged.popular), merged.isActive !== false, Number(merged.sortOrder || 0), merged.b2bOrB2c, merged.color || '#9E9E9E', merged.coverImage || '', merged.priceType || 'fixed', merged.priceMax || null, merged.apply ? JSON.stringify(merged.apply) : null, id]);
      } catch (e) {
        console.warn('Package update warning:', e.message);
      }
    }
    const idx = memStore.packages.findIndex(p => p.id === id);
    if (idx !== -1) memStore.packages[idx] = merged;
    return merged;
  },
  async findByIdAndDelete(id) {
    if (isPostgresLive) {
      try {
        await query('DELETE FROM packages WHERE id=$1', [id]);
      } catch (e) {
        console.warn('Package delete warning:', e.message);
      }
    }
    memStore.packages = memStore.packages.filter(p => p.id !== id);
    return { success: true };
  }
};

export const Service = {
  async find(filter = {}) {
    if (isPostgresLive) {
      try {
        const res = await query('SELECT * FROM services ORDER BY category ASC, name ASC');
        if (res?.rows?.length) return res.rows.map(r => ({ ...r, _id: r.id }));
      } catch (e) {
        console.warn('Service find warning:', e.message);
      }
    }
    let list = [...memStore.services];
    if (filter.isActive !== undefined) list = list.filter(s => s.isActive === Boolean(filter.isActive));
    return list.map(s => ({ ...s, _id: s.id }));
  },
  async findById(id) {
    const list = await this.find();
    return list.find(s => s.id === id || s._id === id) || null;
  },
  async create(data) {
    const id = generateId();
    const srv = { id, _id: id, ...data };
    if (isPostgresLive) {
      try {
        await query(
          'INSERT INTO services (id, category, name, "basePrice", "estimatedDaysToDeliver", "isActive") VALUES ($1, $2, $3, $4, $5, $6)',
          [id, srv.category, srv.name, Number(srv.basePrice || 0), Number(srv.estimatedDaysToDeliver || 1), srv.isActive !== false]
        );
      } catch (e) {
        console.warn('Service insert warning:', e.message);
      }
    }
    memStore.services.push(srv);
    return srv;
  },
  async findByIdAndUpdate(id, data) {
    const srv = await this.findById(id);
    if (!srv) return null;
    const merged = { ...srv, ...data };
    if (isPostgresLive) {
      try {
        await query(
          'UPDATE services SET category=$1, name=$2, "basePrice"=$3, "estimatedDaysToDeliver"=$4, "isActive"=$5, "updatedAt"=NOW() WHERE id=$6',
          [merged.category, merged.name, Number(merged.basePrice || 0), Number(merged.estimatedDaysToDeliver || 1), merged.isActive !== false, id]
        );
      } catch (e) {
        console.warn('Service update warning:', e.message);
      }
    }
    const idx = memStore.services.findIndex(s => s.id === id);
    if (idx !== -1) memStore.services[idx] = merged;
    return merged;
  },
  async findByIdAndDelete(id) {
    if (isPostgresLive) {
      try {
        await query('DELETE FROM services WHERE id=$1', [id]);
      } catch (e) {
        console.warn('Service delete warning:', e.message);
      }
    }
    memStore.services = memStore.services.filter(s => s.id !== id);
    return { success: true };
  }
};

export const SheetType = {
  async find(filter = {}) {
    if (isPostgresLive) {
      try {
        const res = await query('SELECT * FROM sheet_types ORDER BY "pricePerSheet" ASC');
        if (res?.rows?.length) return res.rows.map(r => ({ ...r, _id: r.id }));
      } catch (e) {
        console.warn('SheetType find warning:', e.message);
      }
    }
    let list = [...memStore.sheetTypes];
    if (filter.isActive !== undefined) list = list.filter(s => s.isActive === Boolean(filter.isActive));
    return list.map(s => ({ ...s, _id: s.id }));
  },
  async findById(id) {
    const list = await this.find();
    return list.find(s => s.id === id || s._id === id) || null;
  },
  async create(data) {
    const id = generateId();
    const sheet = { id, _id: id, ...data };
    if (isPostgresLive) {
      try {
        await query(
          'INSERT INTO sheet_types (id, name, telugu, "pricePerSheet", "studioPricePerSheet", "premiumCoverSurcharge", "studioCoverSurcharge", multiplier, description, popular, "isActive") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
          [id, sheet.name, sheet.telugu, Number(sheet.pricePerSheet || 0), Number(sheet.studioPricePerSheet || 0), Number(sheet.premiumCoverSurcharge || 0), Number(sheet.studioCoverSurcharge || 0), Number(sheet.multiplier || 1), sheet.description, Boolean(sheet.popular), sheet.isActive !== false]
        );
      } catch (e) {
        console.warn('SheetType insert warning:', e.message);
      }
    }
    memStore.sheetTypes.push(sheet);
    return sheet;
  },
  async findByIdAndUpdate(id, data) {
    const sheet = await this.findById(id);
    if (!sheet) return null;
    const merged = { ...sheet, ...data };
    if (isPostgresLive) {
      try {
        await query(
          'UPDATE sheet_types SET name=$1, telugu=$2, "pricePerSheet"=$3, "studioPricePerSheet"=$4, "premiumCoverSurcharge"=$5, "studioCoverSurcharge"=$6, multiplier=$7, description=$8, popular=$9, "isActive"=$10, "updatedAt"=NOW() WHERE id=$11',
          [merged.name, merged.telugu, Number(merged.pricePerSheet || 0), Number(merged.studioPricePerSheet || 0), Number(merged.premiumCoverSurcharge || 0), Number(merged.studioCoverSurcharge || 0), Number(merged.multiplier || 1), merged.description, Boolean(merged.popular), merged.isActive !== false, id]
        );
      } catch (e) {
        console.warn('SheetType update warning:', e.message);
      }
    }
    const idx = memStore.sheetTypes.findIndex(s => s.id === id);
    if (idx !== -1) memStore.sheetTypes[idx] = merged;
    return merged;
  },
  async findByIdAndDelete(id) {
    if (isPostgresLive) {
      try {
        await query('DELETE FROM sheet_types WHERE id=$1', [id]);
      } catch (e) {
        console.warn('SheetType delete warning:', e.message);
      }
    }
    memStore.sheetTypes = memStore.sheetTypes.filter(s => s.id !== id);
    return { success: true };
  }
};

export const AlbumSize = {
  async find(filter = {}) {
    if (isPostgresLive) {
      try {
        const res = await query('SELECT * FROM album_sizes ORDER BY "basePrice" ASC');
        if (res?.rows?.length) return res.rows.map(r => ({ ...r, _id: r.id }));
      } catch (e) {
        console.warn('AlbumSize find warning:', e.message);
      }
    }
    let list = [...(memStore.albumSizes || [])];
    if (filter.isActive !== undefined) list = list.filter(s => s.isActive === Boolean(filter.isActive));
    return list.map(s => ({ ...s, _id: s.id }));
  },
  async findById(id) {
    const list = await this.find();
    return list.find(s => s.id === id || s._id === id) || null;
  },
  async create(data) {
    const id = generateId();
    const size = { id, _id: id, ...data };
    if (isPostgresLive) {
      try {
        await query(
          'INSERT INTO album_sizes (id, name, dimensions, orientation, telugu, "basePrice", "studioBasePrice", popular, "isBundle", "bundleDiscount", description, "isActive") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
          [id, size.name, size.dimensions, size.orientation || 'landscape', size.telugu, Number(size.basePrice || 0), Number(size.studioBasePrice || 0), Boolean(size.popular), Boolean(size.isBundle), Number(size.bundleDiscount || 0), size.description, size.isActive !== false]
        );
      } catch (e) {
        console.warn('AlbumSize insert warning:', e.message);
      }
    }
    if (!memStore.albumSizes) memStore.albumSizes = [];
    memStore.albumSizes.push(size);
    return size;
  },
  async findByIdAndUpdate(id, data) {
    const size = await this.findById(id);
    if (!size) return null;
    const merged = { ...size, ...data };
    if (isPostgresLive) {
      try {
        await query(
          'UPDATE album_sizes SET name=$1, dimensions=$2, orientation=$3, telugu=$4, "basePrice"=$5, "studioBasePrice"=$6, popular=$7, "isBundle"=$8, "bundleDiscount"=$9, description=$10, "isActive"=$11, "updatedAt"=NOW() WHERE id=$12',
          [merged.name, merged.dimensions, merged.orientation || 'landscape', merged.telugu, Number(merged.basePrice || 0), Number(merged.studioBasePrice || 0), Boolean(merged.popular), Boolean(merged.isBundle), Number(merged.bundleDiscount || 0), merged.description, merged.isActive !== false, id]
        );
      } catch (e) {
        console.warn('AlbumSize update warning:', e.message);
      }
    }
    if (!memStore.albumSizes) memStore.albumSizes = [];
    const idx = memStore.albumSizes.findIndex(s => s.id === id);
    if (idx !== -1) memStore.albumSizes[idx] = merged;
    return merged;
  },
  async findByIdAndDelete(id) {
    if (isPostgresLive) {
      try {
        await query('DELETE FROM album_sizes WHERE id=$1', [id]);
      } catch (e) {
        console.warn('AlbumSize delete warning:', e.message);
      }
    }
    if (!memStore.albumSizes) memStore.albumSizes = [];
    memStore.albumSizes = memStore.albumSizes.filter(s => s.id !== id);
    return { success: true };
  }
};

/* ── JSONB-backed models: dual-engine (Postgres write-through + memory fallback) ── */
const parseJsonb = (val) => {
  if (val == null) return {};
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return {}; }
  }
  return val;
};

const safeQuery = async (sql, params = []) => {
  try {
    const res = await query(sql, params);
    return res?.rows || null;
  } catch (e) {
    console.warn('PG query notice:', e.message);
    return null;
  }
};

const ownerParam = (filter) => filter.client_id || filter.userId || filter.user_id || null;
const studioParam = (filter) => filter.studio_id || filter.studioId || null;

const orderWhere = (filter, params) => {
  let sql = '';
  const owner = ownerParam(filter);
  if (owner) {
    params.push(String(owner));
    sql += ` AND ("client_id" = $${params.length} OR data->>'userId' = $${params.length} OR data->>'user_id' = $${params.length} OR data->>'client_id' = $${params.length})`;
  }
  const studio = studioParam(filter);
  if (studio) {
    params.push(String(studio));
    sql += ` AND ("studio_id" = $${params.length} OR data->>'studioId' = $${params.length} OR data->>'studio_id' = $${params.length})`;
  }
  if (filter.status) {
    params.push(String(filter.status));
    sql += ` AND (status = $${params.length} OR data->>'status' = $${params.length})`;
  }
  if (filter.id) {
    params.push(String(filter.id));
    sql += ` AND (id = $${params.length} OR data->>'orderId' = $${params.length} OR data->>'id' = $${params.length})`;
  }
  if (filter.email) {
    params.push(String(filter.email).toLowerCase());
    sql += ` AND LOWER(data->>'email') = $${params.length}`;
  }
  return sql;
};

const orderRowToDoc = (row) => {
  const data = parseJsonb(row.data);
  return {
    ...data,
    id: data.id || row.id,
    _id: row.id,
    status: data.status || row.status || 'Pending',
    createdAt: data.createdAt || row.createdAt || nowIso(),
    updatedAt: data.updatedAt || row.updatedAt || nowIso()
  };
};

export const Order = {
  async create(data) {
    const id = data.id || generateId();
    const doc = { ...data, id, _id: id, status: data.status || 'Pending', createdAt: data.createdAt || nowIso(), updatedAt: nowIso() };
    if (isPostgresLive) {
      await safeQuery(`
        INSERT INTO orders (id, status, "client_id", "studio_id", data)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET status = $2, data = $5, "updatedAt" = NOW()
      `, [
        String(id),
        String(doc.status),
        data.client_id || data.userId || data.user_id || null,
        data.studio_id || data.studioId || null,
        JSON.stringify(doc)
      ]);
    }
    const idx = memStore.orders.findIndex(o => o.id === id);
    if (idx !== -1) memStore.orders[idx] = doc; else memStore.orders.push(doc);
    return doc;
  },
  async find(filter = {}) {
    if (isPostgresLive) {
      const params = [];
      const sql = 'SELECT * FROM orders WHERE 1=1' + orderWhere(filter, params) + ' ORDER BY "createdAt" DESC';
      const rows = await safeQuery(sql, params);
      if (rows) return rows.map(orderRowToDoc);
    }
    let list = [...memStore.orders];
    const owner = ownerParam(filter);
    if (owner) list = list.filter(o => o.client_id === owner || o.userId === owner || o.user_id === owner);
    const studio = studioParam(filter);
    if (studio) list = list.filter(o => o.studio_id === studio || o.studioId === studio);
    if (filter.status) list = list.filter(o => o.status === filter.status);
    if (filter.id) list = list.filter(o => o.id === filter.id || o.orderId === filter.id);
    if (filter.email) list = list.filter(o => (o.email || '').toLowerCase() === String(filter.email).toLowerCase());
    return list.map(o => ({ ...o, _id: o.id }));
  },
  async findById(id) {
    if (!id) return null;
    if (isPostgresLive) {
      const rows = await safeQuery(`SELECT * FROM orders WHERE id = $1 OR data->>'orderId' = $1 OR data->>'id' = $1 LIMIT 1`, [String(id)]);
      if (rows?.length) return orderRowToDoc(rows[0]);
    }
    const o = memStore.orders.find(o => o.id === id || o._id === id || o.orderId === id);
    return o ? { ...o, _id: o.id } : null;
  },
  async findByIdAndUpdate(id, updateData) {
    const existing = await this.findById(id);
    if (!existing) return null;
    const merged = { ...existing, ...updateData, id: existing.id, updatedAt: nowIso() };
    if (isPostgresLive) {
      await safeQuery(
        'UPDATE orders SET status=$2, "client_id"=COALESCE($3,"client_id"), "studio_id"=COALESCE($4,"studio_id"), data=$5, "updatedAt"=NOW() WHERE id=$1',
        [
          existing._id,
          String(merged.status || 'Pending'),
          merged.client_id || merged.userId || merged.user_id || null,
          merged.studio_id || merged.studioId || null,
          JSON.stringify(merged)
        ]
      );
    }
    const idx = memStore.orders.findIndex(ord => ord.id === existing.id);
    if (idx !== -1) memStore.orders[idx] = merged;
    return merged;
  },
  async countDocuments(filter = {}) {
    return this.count(filter);
  },
  async count(filter = {}) {
    if (isPostgresLive) {
      const params = [];
      const sql = 'SELECT COUNT(*)::int AS count FROM orders WHERE 1=1' + orderWhere(filter, params);
      const rows = await safeQuery(sql, params);
      if (rows?.length) return rows[0].count;
    }
    let list = [...memStore.orders];
    if (filter.status) list = list.filter(o => o.status === filter.status);
    return list.length;
  },
  async findAll({ page = 1, limit = 20, ...filter } = {}) {
    const numericLimit = Number(limit) || 20;
    const offset = ((Number(page) || 1) - 1) * numericLimit;
    if (isPostgresLive) {
      const params = [];
      let sql = 'SELECT * FROM orders WHERE 1=1' + orderWhere(filter, params) + ' ORDER BY "createdAt" DESC';
      params.push(numericLimit, offset);
      sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;
      const rows = await safeQuery(sql, params);
      if (rows) return rows.map(orderRowToDoc);
    }
    let list = [...memStore.orders];
    const owner = ownerParam(filter);
    if (owner) list = list.filter(o => o.client_id === owner || o.userId === owner || o.user_id === owner);
    if (filter.status) list = list.filter(o => o.status === filter.status);
    if (filter.email) list = list.filter(o => (o.email || '').toLowerCase() === String(filter.email).toLowerCase());
    return list.slice(offset, offset + numericLimit).map(o => ({ ...o, _id: o.id }));
  },
  async update(id, data) {
    return this.findByIdAndUpdate(id, data);
  }
};

const taskWhere = (filter, params) => {
  let sql = '';
  const editor = filter.editor_id || filter.assigned_editor_id;
  if (editor) {
    params.push(String(editor));
    sql += ` AND (editor_id = $${params.length} OR data->>'assigned_editor_id' = $${params.length} OR data->>'editor_id' = $${params.length})`;
  }
  const studio = studioParam(filter);
  if (studio) {
    params.push(String(studio));
    sql += ` AND (data->>'studio_id' = $${params.length} OR data->>'studioId' = $${params.length})`;
  }
  if (filter.status) {
    params.push(String(filter.status));
    sql += ` AND (status = $${params.length} OR data->>'status' = $${params.length})`;
  }
  if (filter.type || filter.job_type) {
    params.push(String(filter.type || filter.job_type));
    sql += ` AND (data->>'type' = $${params.length} OR data->>'job_type' = $${params.length})`;
  }
  return sql;
};

const taskRowToDoc = (row) => {
  const data = parseJsonb(row.data);
  return {
    ...data,
    id: data.id || row.id,
    _id: row.id,
    status: data.status || row.status || 'Pending',
    createdAt: data.createdAt || row.createdAt || nowIso(),
    updatedAt: data.updatedAt || row.updatedAt || nowIso()
  };
};

export const Task = {
  async create(data) {
    const id = data.id || generateId();
    const doc = { ...data, id, _id: id, status: data.status || 'Pending', createdAt: data.createdAt || nowIso(), updatedAt: nowIso() };
    if (isPostgresLive) {
      await safeQuery(`
        INSERT INTO tasks (id, editor_id, status, data)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE SET status = $3, data = $4, "updatedAt" = NOW()
      `, [String(id), data.assigned_editor_id || data.editor_id || null, String(doc.status), JSON.stringify(doc)]);
    }
    const idx = memStore.tasks.findIndex(t => t.id === id);
    if (idx !== -1) memStore.tasks[idx] = doc; else memStore.tasks.push(doc);
    return doc;
  },
  async find(filter = {}) {
    if (isPostgresLive) {
      const params = [];
      const sql = 'SELECT * FROM tasks WHERE 1=1' + taskWhere(filter, params) + ' ORDER BY "createdAt" DESC';
      const rows = await safeQuery(sql, params);
      if (rows) return rows.map(taskRowToDoc);
    }
    let list = [...memStore.tasks];
    const editor = filter.editor_id || filter.assigned_editor_id;
    if (editor) list = list.filter(t => t.editor_id === editor || t.assigned_editor_id === editor);
    const studio = studioParam(filter);
    if (studio) list = list.filter(t => t.studio_id === studio || t.studioId === studio);
    if (filter.status) list = list.filter(t => t.status === filter.status);
    if (filter.type || filter.job_type) list = list.filter(t => t.type === (filter.type || filter.job_type) || t.job_type === (filter.type || filter.job_type));
    return list.map(t => ({ ...t, _id: t.id }));
  },
  async findById(id) {
    if (!id) return null;
    if (isPostgresLive) {
      const rows = await safeQuery(`SELECT * FROM tasks WHERE id = $1 OR data->>'id' = $1 LIMIT 1`, [String(id)]);
      if (rows?.length) return taskRowToDoc(rows[0]);
    }
    const t = memStore.tasks.find(t => t.id === id || t._id === id);
    return t ? { ...t, _id: t.id } : null;
  },
  async findByIdAndUpdate(id, updateData) {
    const existing = await this.findById(id);
    if (!existing) return null;
    const merged = { ...existing, ...updateData, id: existing.id, updatedAt: nowIso() };
    if (isPostgresLive) {
      await safeQuery(
        'UPDATE tasks SET status=$2, editor_id=COALESCE($3,editor_id), data=$4, "updatedAt"=NOW() WHERE id=$1',
        [existing._id, String(merged.status || 'Pending'), merged.assigned_editor_id || merged.editor_id || existing.editor_id || null, JSON.stringify(merged)]
      );
    }
    const idx = memStore.tasks.findIndex(tsk => tsk.id === existing.id);
    if (idx !== -1) memStore.tasks[idx] = merged;
    return merged;
  },
  async count(filter = {}) {
    if (isPostgresLive) {
      const params = [];
      const sql = 'SELECT COUNT(*)::int AS count FROM tasks WHERE 1=1' + taskWhere(filter, params);
      const rows = await safeQuery(sql, params);
      if (rows?.length) return rows[0].count;
    }
    let list = [...memStore.tasks];
    if (filter.status) list = list.filter(t => t.status === filter.status);
    return list.length;
  },
  async findAll(filter = {}) {
    return this.find(filter);
  },
  async update(id, data) {
    return this.findByIdAndUpdate(id, data);
  }
};

export const Project = {
  async create(data) {
    const id = data.id || generateId();
    const doc = { ...data, id, _id: id, status: data.status || 'Active', createdAt: data.createdAt || nowIso(), updatedAt: nowIso() };
    if (isPostgresLive) {
      await safeQuery(`
        INSERT INTO projects (id, status, data)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET status = $2, data = $3, "updatedAt" = NOW()
      `, [String(id), String(doc.status), JSON.stringify(doc)]);
    }
    const idx = memStore.projects.findIndex(p => p.id === id);
    if (idx !== -1) memStore.projects[idx] = doc; else memStore.projects.push(doc);
    return doc;
  },
  async find(filter = {}) {
    if (isPostgresLive) {
      const params = [];
      let sql = 'SELECT * FROM projects WHERE 1=1';
      const owner = ownerParam(filter);
      if (owner) {
        params.push(String(owner));
        sql += ` AND (data->>'userId' = $${params.length} OR data->>'user_id' = $${params.length})`;
      }
      if (filter.status) {
        params.push(String(filter.status));
        sql += ` AND (status = $${params.length} OR data->>'status' = $${params.length})`;
      }
      sql += ' ORDER BY "createdAt" DESC';
      const rows = await safeQuery(sql, params);
      if (rows) {
        return rows.map(r => {
          const data = parseJsonb(r.data);
          return { ...data, id: r.id, _id: r.id, status: data.status || r.status || 'Active' };
        });
      }
    }
    let list = [...memStore.projects];
    const owner = ownerParam(filter);
    if (owner) list = list.filter(p => p.userId === owner || p.user_id === owner);
    if (filter.status) list = list.filter(p => p.status === filter.status);
    return list.map(p => ({ ...p, _id: p.id }));
  },
  async findById(id) {
    if (!id) return null;
    if (isPostgresLive) {
      const rows = await safeQuery('SELECT * FROM projects WHERE id = $1 LIMIT 1', [String(id)]);
      if (rows?.length) {
        const r = rows[0];
        const data = parseJsonb(r.data);
        return { ...data, id: r.id, _id: r.id, status: data.status || r.status || 'Active', createdAt: data.createdAt || r.createdAt };
      }
    }
    const p = memStore.projects.find(p => p.id === id || p._id === id);
    return p ? { ...p, _id: p.id } : null;
  },
  async findByIdAndUpdate(id, updateData) {
    const existing = await this.findById(id);
    if (!existing) return null;
    const merged = { ...existing, ...updateData, id: existing.id, updatedAt: nowIso() };
    if (isPostgresLive) {
      await safeQuery(
        'UPDATE projects SET status=$2, data=$3, "updatedAt"=NOW() WHERE id=$1',
        [existing._id, String(merged.status || 'Active'), JSON.stringify(merged)]
      );
    }
    const idx = memStore.projects.findIndex(pr => pr.id === existing.id);
    if (idx !== -1) memStore.projects[idx] = merged;
    return merged;
  }
};

const payoutRowToDoc = (row) => {
  const data = parseJsonb(row.data);
  return {
    ...data,
    id: row.id,
    _id: row.id,
    user_id: data.user_id || row.user_id || '',
    user_role: data.user_role || row.user_role || '',
    amount: data.amount != null ? data.amount : Number(row.amount || 0),
    upi_id: data.upi_id || row.upi_id || '',
    status: data.status || row.status || 'pending',
    txn_ref: data.txn_ref || row.txn_ref || '',
    note: data.note || row.note || '',
    createdAt: data.createdAt || row.createdAt || nowIso(),
    updatedAt: data.updatedAt || row.updatedAt || nowIso()
  };
};

export const PayoutRequest = {
  async create(data) {
    const id = data.id || generateId();
    const doc = { ...data, id, _id: id, status: data.status || 'pending', createdAt: data.createdAt || nowIso(), updatedAt: nowIso() };
    if (isPostgresLive) {
      await safeQuery(`
        INSERT INTO payout_requests (id, "user_id", "user_role", amount, "upi_id", status, "txn_ref", note, data)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET status = $6, data = $9, "updatedAt" = NOW()
      `, [
        String(id),
        data.user_id || data.userId || '',
        data.user_role || data.role || '',
        Number(data.amount || 0),
        data.upi_id || data.upiId || '',
        String(doc.status),
        data.txn_ref || '',
        typeof data.note === 'string' ? data.note : JSON.stringify(data.note || ''),
        JSON.stringify(doc)
      ]);
    }
    if (!Array.isArray(memStore.payoutRequests)) memStore.payoutRequests = [];
    const idx = memStore.payoutRequests.findIndex(p => p.id === id);
    if (idx !== -1) memStore.payoutRequests[idx] = doc; else memStore.payoutRequests.push(doc);
    return doc;
  },
  async find(filter = {}) {
    if (isPostgresLive) {
      const params = [];
      let sql = 'SELECT * FROM payout_requests WHERE 1=1';
      if (filter.user_id || filter.userId) {
        params.push(String(filter.user_id || filter.userId));
        sql += ` AND ("user_id" = $${params.length} OR data->>'user_id' = $${params.length} OR data->>'userId' = $${params.length})`;
      }
      if (filter.status) {
        params.push(String(filter.status));
        sql += ` AND (status = $${params.length} OR data->>'status' = $${params.length})`;
      }
      sql += ' ORDER BY "createdAt" DESC';
      const rows = await safeQuery(sql, params);
      if (rows) return rows.map(payoutRowToDoc);
    }
    let list = [...(memStore.payoutRequests || [])];
    if (filter.user_id || filter.userId) {
      const v = filter.user_id || filter.userId;
      list = list.filter(p => p.user_id === v || p.userId === v);
    }
    if (filter.status) list = list.filter(p => p.status === filter.status);
    return list.map(p => ({ ...p, _id: p.id }));
  },
  async findAll(filter = {}) {
    return this.find(filter);
  },
  async findById(id) {
    if (!id) return null;
    if (isPostgresLive) {
      const rows = await safeQuery('SELECT * FROM payout_requests WHERE id = $1 LIMIT 1', [String(id)]);
      if (rows?.length) return payoutRowToDoc(rows[0]);
    }
    const p = (memStore.payoutRequests || []).find(pr => pr.id === id || pr._id === id);
    return p ? { ...p, _id: p.id } : null;
  },
  async findByIdAndUpdate(id, updateData) {
    const existing = await this.findById(id);
    if (!existing) return null;
    const merged = { ...existing, ...updateData, id: existing.id, updatedAt: nowIso() };
    if (isPostgresLive) {
      await safeQuery(
        'UPDATE payout_requests SET status=$2, "txn_ref"=$3, amount=$4, note=$5, data=$6, "updatedAt"=NOW() WHERE id=$1',
        [
          existing._id,
          String(merged.status || 'pending'),
          merged.txn_ref || '',
          Number(merged.amount || 0),
          typeof merged.note === 'string' ? merged.note : JSON.stringify(merged.note || ''),
          JSON.stringify(merged)
        ]
      );
    }
    if (!Array.isArray(memStore.payoutRequests)) memStore.payoutRequests = [];
    const idx = memStore.payoutRequests.findIndex(pr => pr.id === existing.id);
    if (idx !== -1) memStore.payoutRequests[idx] = merged;
    return merged;
  },
  async count(filter = {}) {
    if (isPostgresLive && filter.status) {
      const rows = await safeQuery('SELECT COUNT(*)::int AS count FROM payout_requests WHERE status = $1', [String(filter.status)]);
      if (rows?.length) return rows[0].count;
    }
    let list = [...(memStore.payoutRequests || [])];
    if (filter.status) list = list.filter(p => p.status === filter.status);
    return list.length;
  },
  async update(id, data) {
    return this.findByIdAndUpdate(id, data);
  }
};

export const Config = {
  async findOne({ key }) {
    if (isPostgresLive) {
      const rows = await safeQuery('SELECT * FROM configs WHERE key = $1 LIMIT 1', [key]);
      if (rows?.[0]) {
        let opts = rows[0].options;
        if (typeof opts === 'string') {
          try { opts = JSON.parse(opts); } catch { opts = []; }
        }
        return { _id: rows[0].key, key: rows[0].key, options: Array.isArray(opts) ? opts : [] };
      }
    }
    const val = memStore.configs.get(key);
    return { _id: key, key, options: val && Array.isArray(val) ? val : [] };
  },
  async create({ key, options }) {
    const value = Array.isArray(options) ? options : [];
    if (isPostgresLive) {
      await safeQuery(`
        INSERT INTO configs (key, options)
        VALUES ($1, $2)
        ON CONFLICT (key) DO UPDATE SET options = $2, "updatedAt" = NOW()
      `, [key, JSON.stringify(value)]);
    }
    memStore.configs.set(key, value);
    return { _id: key, key, options: value };
  },
  async findOneAndUpdate({ key }, updateData, opts = {}) {
    return this.create({ key, options: updateData?.options || [] });
  }
};

export const Cart = {
  async findOne({ userId }) {
    if (isPostgresLive && userId) {
      const rows = await safeQuery('SELECT * FROM carts WHERE "userId" = $1 LIMIT 1', [String(userId)]);
      if (rows?.length) {
        const r = rows[0];
        let items = parseJsonb(r.items);
        if (!Array.isArray(items)) items = [];
        return {
          id: r.id,
          _id: r.id,
          userId: r.userId,
          items,
          totalAmount: Number(r.totalAmount || 0),
          estimatedDeliveryEta: r.estimatedDeliveryEta,
          updatedAt: r.updatedAt || nowIso()
        };
      }
    }
    const c = memStore.carts.get(userId);
    return c ? { ...c, _id: c.id } : null;
  },
  async findOneAndUpdate({ userId }, updateData, opts = {}) {
    if (!userId) return null;
    const existing = await this.findOne({ userId });
    const id = existing?.id || generateId();
    const items = Array.isArray(updateData?.items) ? updateData.items : (existing?.items || []);
    const totalAmount = Number(updateData?.totalAmount ?? existing?.totalAmount ?? 0);
    const eta = Number(updateData?.estimatedDeliveryEta ?? existing?.estimatedDeliveryEta ?? 3) || 3;
    const cart = { id, _id: id, userId, items, totalAmount, estimatedDeliveryEta: eta, updatedAt: nowIso() };
    if (isPostgresLive) {
      await safeQuery(`
        INSERT INTO carts (id, "userId", items, "totalAmount", "estimatedDeliveryEta")
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT ("userId") DO UPDATE SET items = $3, "totalAmount" = $4, "estimatedDeliveryEta" = $5, "updatedAt" = NOW()
      `, [String(id), String(userId), JSON.stringify(items), totalAmount, eta]);
    }
    memStore.carts.set(userId, cart);
    return cart;
  }
};

export const RefreshToken = {
  async create(data) {
    const id = generateId();
    const expiresAt = data.expires_at instanceof Date
      ? data.expires_at.toISOString()
      : (data.expires_at || new Date(Date.now() + 7 * 864e5).toISOString());
    const token = {
      id,
      _id: id,
      user_id: data.user_id || data.userId || '',
      token_hash: data.token_hash,
      expires_at: expiresAt,
      revoked: false,
      createdAt: nowIso()
    };
    if (isPostgresLive) {
      await safeQuery('INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)', [id, token.user_id, token.token_hash, expiresAt]);
      await safeQuery("DELETE FROM refresh_tokens WHERE expires_at < NOW() - INTERVAL '30 days'");
    }
    if (!Array.isArray(memStore.refreshTokens)) memStore.refreshTokens = [];
    memStore.refreshTokens.push(token);
    return token;
  },
  async findOne(filter = {}) {
    if (filter.token_hash) {
      if (isPostgresLive) {
        const rows = await safeQuery('SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked = false AND expires_at > NOW() LIMIT 1', [filter.token_hash]);
        if (rows?.length) {
          const r = rows[0];
          return { id: r.id, _id: r.id, user_id: r.user_id, token_hash: r.token_hash, expires_at: r.expires_at, revoked: r.revoked, createdAt: r.created_at };
        }
      }
      return (memStore.refreshTokens || []).find(t => t.token_hash === filter.token_hash && !t.revoked) || null;
    }
    return null;
  },
  async revoke(token_hash) {
    if (isPostgresLive) {
      await safeQuery('UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1', [token_hash]);
    }
    const t = (memStore.refreshTokens || []).find(x => x.token_hash === token_hash);
    if (t) t.revoked = true;
  }
};

export const AuditLog = {
  async create(data) {
    const id = generateId();
    const details = typeof data.details === 'string' ? data.details : JSON.stringify(data.details ?? '');
    const log = {
      id,
      _id: id,
      user_id: data.user_id || data.userId || null,
      action: data.action || 'EVENT',
      details,
      ip: data.ip || null,
      timestamp: data.timestamp || nowIso()
    };
    if (isPostgresLive) {
      await safeQuery('INSERT INTO audit_logs (id, user_id, action, details, ip) VALUES ($1, $2, $3, $4, $5)', [id, log.user_id, log.action, log.details, log.ip]);
    }
    if (!Array.isArray(memStore.auditLogs)) memStore.auditLogs = [];
    memStore.auditLogs.unshift(log);
    return log;
  },
  async find() {
    if (isPostgresLive) {
      const rows = await safeQuery('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
      if (rows) return rows.map(r => ({ ...r, _id: r.id }));
    }
    return (memStore.auditLogs || []).slice(0, 100);
  }
};

export const ContactLead = {
  async create(data) {
    const id = generateId();
    const lead = { id, _id: id, ...data, createdAt: data.createdAt || nowIso() };
    if (isPostgresLive) {
      await safeQuery(`
        INSERT INTO contact_leads (id, name, email, phone, "event_type", "event_date", message, source, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET status = $9
      `, [
        id,
        lead.name || '',
        lead.email || '',
        lead.phone || '',
        lead.event_type || lead.eventType || '',
        lead.event_date || lead.eventDate || '',
        lead.message || '',
        lead.source || 'contact_form',
        lead.status || 'new'
      ]);
    }
    if (!Array.isArray(memStore.contactLeads)) memStore.contactLeads = [];
    memStore.contactLeads.unshift(lead);
    return lead;
  },
  async find(filter = {}) {
    if (isPostgresLive) {
      const rows = await safeQuery('SELECT * FROM contact_leads ORDER BY "createdAt" DESC LIMIT 200');
      if (rows) return rows.map(r => ({ ...parseJsonb(r.data), ...r, id: r.id, _id: r.id }));
    }
    return (memStore.contactLeads || []).slice(0, 200);
  }
};

export async function autoSeedDatabase() {
  console.log('✅ PostgreSQL Catalog Seeded and Ready');
}

export const Content = {
  async findOne({ key }) {
    if (isPostgresLive) {
      try {
        const res = await query('SELECT * FROM contents WHERE key = $1 LIMIT 1', [key]);
        if (res?.rows[0]) {
          const raw = res.rows[0].data;
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          return { _id: res.rows[0].key, key: res.rows[0].key, data: parsed };
        }
      } catch (e) {
        console.warn('Content findOne query notice:', e.message);
      }
    }
    const val = memStore.contents.get(key);
    return val ? { _id: key, key, data: val } : null;
  },
  async findOneAndUpdate({ key }, update, opts = {}) {
    const data = (update && update.data !== undefined) ? update.data : update;
    if (isPostgresLive) {
      try {
        await query(`
          INSERT INTO contents (key, data, "updatedAt")
          VALUES ($1, $2, NOW())
          ON CONFLICT (key) DO UPDATE SET data = $2, "updatedAt" = NOW()
        `, [key, JSON.stringify(data)]);
      } catch (e) {
        console.warn('Content upsert query notice:', e.message);
      }
    }
    memStore.contents.set(key, data);
    return { _id: key, key, data };
  }
};

export const Media = {
  async create(doc) {
    const id = generateId();
    const item = { id, _id: id, url: doc.url, type: doc.type || 'image', createdAt: nowIso() };
    if (isPostgresLive) {
      try {
        await query('INSERT INTO media (id, url, type, "createdAt") VALUES ($1, $2, $3, $4)', [id, item.url, item.type, item.createdAt]);
      } catch (e) {
        console.warn('Media insert notice:', e.message);
      }
    }
    memStore.media.unshift(item);
    return item;
  },
  async find(filter = {}) {
    if (isPostgresLive) {
      try {
        const sql = filter.type ? 'SELECT * FROM media WHERE type = $1 ORDER BY "createdAt" DESC' : 'SELECT * FROM media ORDER BY "createdAt" DESC';
        const params = filter.type ? [filter.type] : [];
        const res = await query(sql, params);
        if (res?.rows) return res.rows.map(r => ({ ...r, _id: r.id }));
      } catch (e) {
        console.warn('Media find notice:', e.message);
      }
    }
    let list = [...memStore.media];
    if (filter.type) list = list.filter(m => m.type === filter.type);
    return list.map(m => ({ ...m, _id: m.id }));
  }
};

export default {
  User, Package, Service, SheetType, AlbumSize, Order, Task, Project,
  PayoutRequest, Config, Cart, RefreshToken, AuditLog, ContactLead,
  Content, Media,
  initDatabase, getPool, query, autoSeedDatabase
};
