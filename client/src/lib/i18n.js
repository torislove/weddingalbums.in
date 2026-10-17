/**
 * client/src/lib/i18n.js — bilingual copy for the B2C estimator / builder.
 * t(key, lang) with lang 'EN' | 'TE'. Telugu reviewed for Andhra phrasing.
 * Keep NEW client-facing strings here (not inline JSX) so one review pass covers all.
 */

export const STRINGS = {
  // Service type
  'service.title': { EN: 'What do you need?', TE: 'మీకు ఏమి కావాలి?' },
  'service.sub': { EN: 'Pick one — you can change it any time before payment.', TE: 'ఒకదాన్ని ఎంచుకోండి — చెల్లింపు ముందు ఎప్పుడైనా మార్చుకోవచ్చు.' },
  'service.edit_print': { EN: 'Editing + Printing', TE: 'ఎడిటింగ్ + ప్రింటింగ్' },
  'service.edit_print.sub': { EN: 'One roof, zero coordination. 9 in 10 AP couples choose this.', TE: 'ఒకే చోట, జట్టు పడక్కత్వం లేదు. AP జంటల్లో 10 పేర్ ఇదే ఎంచుకుంటారు.' },
  'service.only_editing': { EN: 'Photo Editing only', TE: 'ఫోటో ఎడిటింగ్ మాత్రమే' },
  'service.only_editing.sub': { EN: 'You already print locally / have design ready.', TE: 'మీరు సొంతంగా ప్రింట్ చేస్తారు / డిజైన్ తయారుంది.' },
  'service.only_printing': { EN: 'Album Printing only', TE: 'ఆల్బమ్ ప్రింటింగ్ మాత్రమే' },
  'service.only_printing.sub': { EN: 'Your design, our Royal press & luxury finishes.', TE: 'మీ డిజైన్, మా రాయల్ ప్రెస్ & లగ్జరీ ఫినిష్.' },
  'service.standalone': { EN: 'Video / Invitation / Flex only', TE: 'వీడియో / ఇన్విటేషన్ / ఫ్లెక్స్ మాత్రమే' },
  'service.standalone.sub': { EN: 'Album nahi — just the extras.', TE: 'ఆల్బమ్ కాదు — అదనపు పనులే.' },
  'service.best_value': { EN: 'BEST VALUE', TE: 'బెస్ట్ వ్యాల్యూ' },

  // Pages step
  'pages.title': { EN: 'How many pages?', TE: 'ఎన్ని పేజీలు కావాలి?' },
  'pages.sub': { EN: 'A 60-page album holds about 360-480 photos comfortably.', TE: '60 పేజీల ఆల్బమ్ సుమారు 360-480 ఫోటోలు ఆరామదాయకంగా నిల్వ చేస్తుంది.' },
  'pages.photos_q': { EN: 'How many photos will you share?', TE: 'మొత్తం ఎన్ని ఫోటోలు అందిస్తారు?' },
  'pages.photos_hint': { EN: 'Share RAW & JPEG — we never compress originals.', TE: 'RAW & JPEG అందించండి — ఓరిజినల్ నాణ్యత మేం ఇంగ్లార్డు చేయం.' },
  'pages.recommend': { EN: 'Use recommended', TE: 'సిఫార్సు చేసినవి తీసుకోండి' },
  'pages.pages': { EN: 'pages', TE: 'పేజీలు' },
  'pages.photos': { EN: 'photos', TE: 'ఫోటోలు' },

  // Finish step
  'finish.title': { EN: 'Choose page finish', TE: 'పేజీ ఫినిష్ ఎంచుకోండి' },
  'finish.single': { EN: 'Single finish', TE: 'ఒకే ఫినిష్' },
  'finish.mix': { EN: 'Ritual mix', TE: 'రీతి తీరుగా కలుపు (మిక్స్)' },
  'finish.mix.sub': { EN: 'Gold for Muhurtham, Velvet for Reception, Silk for Saptapadi…', TE: 'ముహూర్తానికి గోల్డ్, రిసెప్షన్‌కి వెల్వెట్, సప్తపదికి సిల్క్…' },
  'finish.sheets_per_page': { EN: '{n} sheets', TE: '{n} షీట్లు' },

  // Cover
  'cover.title': { EN: 'Pick your cover', TE: 'కవర్ ఎంచుకోండి' },
  'cover.included': { EN: 'Included', TE: 'ఇన్‌క్లూడెడ్' },
  'cover.engrave': { EN: '24K gold name engraving', TE: '24K గోల్డ్ పేరు ఎన్‌గ్రేవింగ్' },
  'cover.engrave.sub': { EN: 'Couple names in gold foil on the cover', TE: 'కవర్ పై జంట పేర్లు గోల్డ్ ఫాయిల్‌లో' },

  // Parent books
  'parent.title': { EN: 'Mini copies for parents & in-laws?', TE: 'తల్లిదండ్రుల & అత్తవారి కోసం చిన్న కాపీలు?' },
  'parent.disc': { EN: '10% off on 2 or more', TE: '2 లేదా అంతకంటే ఎక్కువ అయితే 10% తగ్గింపు' },

  // Delivery
  'delivery.title': { EN: 'Delivery', TE: 'డెలివరీ' },
  'delivery.standard': { EN: 'Standard · 5-7 days', TE: 'ప్రామాణిక · 5-7 రోజులు' },
  'delivery.express': { EN: 'Express · 48 hours', TE: 'ఎక్స్‌ప్రెస్ · 48 గంటలు' },
  'delivery.ready': { EN: 'Ready by', TE: 'సిద్ధంగా ఉంటుంది' },
  'delivery.free_courier': { EN: 'Free insured doorstep courier (AP & TS)', TE: 'AP & TS అంతా ఇన్స్యూర్డ్ కొరియర్ ఫ్రీ' },

  // Receipt
  'receipt.title': { EN: 'Your quote', TE: 'మీ కొటేషన్' },
  'receipt.breakdown': { EN: 'See breakdown', TE: 'కొటేషన్ చూడండి' },
  'receipt.editing_incl': { EN: 'Editing included', TE: 'ఎడిటింగ్ ఇన్‌క్లూడ్ చేయబడింది' },
  'receipt.saved': { EN: 'You saved', TE: 'మీరు ఆదా చేసారు' },
  'receipt.gst': { EN: 'All prices include GST', TE: 'అన్ని ధరలలో GST ఒక్కటే' },
  'receipt.cta_order': { EN: 'Start my order', TE: 'ఆర్డర్ మొదలుపెట్టండి' },
  'receipt.cta_wa': { EN: 'Send to WhatsApp', TE: 'వాట్సాప్‌కి పంపండి' },
  'receipt.pages_note': { EN: '{pages} pages = {sheets} sheets of printing', TE: '{pages} పేజీలు = {sheets} షీట్లు ప్రింటింగ్' },

  // ── Global nav (shared) ────────────────────────────────────────────────
  'nav.home': { EN: 'Home', TE: 'హోమ్' },
  'nav.about': { EN: 'About Us', TE: 'మా గురించి' },
  'nav.services': { EN: 'Services', TE: 'సేవలు' },
  'nav.portfolio': { EN: 'Portfolio', TE: 'పోర్ట్‌ఫోలియో' },
  'nav.testimonials': { EN: 'Testimonials', TE: 'సమీక్షలు' },
  'nav.contact': { EN: 'Contact', TE: 'సంప్రదించండి' },
  'nav.pricing': { EN: 'Pricing', TE: 'ధరలు' },
  'nav.blog': { EN: 'Blog', TE: 'బ్లాగ్' },
  'nav.careers': { EN: 'Careers', TE: 'ఉద్యోగాలు' },
  'common.scroll': { EN: 'Scroll', TE: 'స్క్రోల్ చేయండి' },

  // ── Hero (home) ────────────────────────────────────────────────────────
  'hero.eyebrow': { EN: '✦ weddingalbums.in ✦', TE: '✦ weddingalbums.in ✦' },
  'hero.title1': { EN: 'Cinematic Storytelling', TE: 'సినిమాటిక్ కథనం' },
  'hero.title2': { EN: '& Wedding Albums', TE: '& వెడ్డింగ్ ఆల్బమ్‌లు' },
  'hero.sub': {
    EN: 'Crafting timeless Telugu wedding albums, flush mount keepsakes, and cinematic wedding highlights for couples across Andhra Pradesh.',
    TE: 'ఆంధ్రప్రదేశ్ అంతటా జంటల కోసం శాశ్వతమైన తెలుగు వెడ్డింగ్ ఆల్బమ్‌లు, ఫ్లష్ మౌంట్ జ్ఞాపకాలు, సినిమాటిక్ వివాహ హైలైట్స్ తయారు చేస్తున్నాం.',
  },
  'hero.btn1': { EN: 'Explore Wedding Packages', TE: 'వెడ్డింగ్ ప్యాకేజీలు చూడండి' },
  'hero.btn2': { EN: 'Instant Cost Estimator', TE: 'తక్షణ ధర అంచనా' },

  // ── Services ───────────────────────────────────────────────────────────
  'services.hero_badge': { EN: "Andhra Pradesh's #1 Post-Production Facility", TE: 'ఆంధ్రప్రదేశ్‌లోనే నంబర్ 1 పోస్ట్-ప్రొడక్షన్ ఫెసిలిటీ' },
  'services.hero_title': { EN: 'All Editing, Video & Printing Services in One Place', TE: 'ఎడిటింగ్, వీడియో, ప్రింటింగ్ సేవలన్నీ ఒకే చోట' },
  'services.hero_sub': {
    EN: 'A state-of-the-art 20-member in-house production engine delivering color-calibrated wedding albums, 4K films, and grand event signage across Vijayawada, Vizag, Guntur, and all AP & TS.',
    TE: 'విజయవాడ, విశాఖ, గుంటూరు సహా AP & TS అంతటా కలర్-కాలిబ్రేటెడ్ వెడ్డింగ్ ఆల్బమ్‌లు, 4K సినిమాలు, గ్రాండ్ ఈవెంట్ సైనేజ్ అందించే అత్యాధునిక 20 మంది ఇన్-హౌస్ ప్రొడక్షన్ టీమ్.',
  },
  'services.pathways_eyebrow': { EN: '✦ Flexible Service Architecture for Couples & Families ✦', TE: '✦ జంటలకు & కుటుంబాలకు సౌకర్యవంతమైన సర్వీస్ నిర్మాణం ✦' },
  'services.pathways_title': { EN: 'Choose Only Editing, Only Printing, Complete Suite, or Any A-la-Carte Media', TE: 'ఎడిటింగ్ మాత్రమే, ప్రింటింగ్ మాత్రమే, కంప్లీట్ సూట్, లేదా ఏదైనా ఒక్క సేవ — మీ ఇష్టం' },
  'services.pathways_tagline': { EN: 'Direct Couple Wholesale-Equivalent Pricing • Zero Hidden Lab Markups', TE: 'నేరుగా జంటలకు హోల్‌సేల్-సమాన ధరలు • ల్యాబ్‌లో దాచిన మార్కప్‌లు శూన్యం' },
  'services.starts_from': { EN: 'Starts From', TE: 'ప్రారంభ ధర' },
  'services.lbl_includes': { EN: 'Includes:', TE: 'కలిపి ఉంటుంది:' },
  'services.lbl_provide': { EN: 'Provide:', TE: 'మీరు అందించాల్సినవి:' },
  'services.lbl_turnaround': { EN: 'Turnaround:', TE: 'సమయం:' },
  'services.c1_badge': { EN: '⭐ Complete Master Suite', TE: '⭐ కంప్లీట్ మాస్టర్ సూట్' },
  'services.c1_title': { EN: 'Editing + Physical Album', TE: 'ఎడిటింగ్ + ఫిజికల్ ఆల్బమ్' },
  'services.c1_sub': { EN: 'End-to-End Master Delivery', TE: 'ఎండ్-టు-ఎండ్ మాస్టర్ డెలివరీ' },
  'services.c1_desc': { EN: 'From raw camera memory cards to finished 12×36 lay-flat albums, 4K cinematic film, and presentation briefcase.', TE: 'కెమెరా రా మెమొరీ కార్డుల నుంచి పూర్తయిన 12×36 లే-ఫ్లాట్ ఆల్బమ్‌లు, 4K సినిమాటిక్ ఫిల్మ్, ప్రజెంటేషన్ బ్రీఫ్‌కేస్ వరకు.' },
  'services.c1_p1': { EN: 'RAW culling, skin retouch, Karizma PSDs, HP Indigo press & binding', TE: 'RAW కల్లింగ్, స్కిన్ రీటచ్, కరిజ్మా PSDలు, HP ఇండిగో ప్రెస్ & బైండింగ్' },
  'services.c1_p2': { EN: 'Unedited RAW photo cards / video files', TE: 'ఎడిట్ చేయని RAW ఫోటో కార్డులు / వీడియో ఫైళ్లు' },
  'services.c1_p3': { EN: '7–10 Business Days', TE: '7–10 పని రోజులు' },
  'services.c1_cta': { EN: 'Order Complete Suite →', TE: 'కంప్లీట్ సూట్ ఆర్డర్ చేయండి →' },
  'services.c2_badge': { EN: '🎨 Digital Master • Only Editing', TE: '🎨 డిజిటల్ మాస్టర్ • ఎడిటింగ్ మాత్రమే' },
  'services.c2_title': { EN: 'Photo & Video Editing Only', TE: 'ఫోటో & వీడియో ఎడిటింగ్ మాత్రమే' },
  'services.c2_sub': { EN: '100% Digital • Zero Print Fee', TE: '100% డిజిటల్ • ప్రింట్ ఛార్జ్ లేదు' },
  'services.c2_desc': { EN: 'Have your own printing lab? Get pristine RAW photo retouching, 300 DPI Karizma PSD spreads & 4K cinematic edits.', TE: 'మీ సొంత ప్రింటింగ్ ల్యాబ్ ఉందా? శుభ్రమైన RAW ఫోటో రీటచింగ్, 300 DPI కరిజ్మా PSD స్ప్రెడ్‌లు & 4K సినిమాటిక్ ఎడిట్లు పొందండి.' },
  'services.c2_p1': { EN: 'Frequency-separation retouch, color grading, 300 DPI print PSDs, 4K cuts', TE: 'ఫ్రీక్వెన్సీ-సెపరేషన్ రీటచ్, కలర్ గ్రేడింగ్, 300 DPI ప్రింట్ PSDలు, 4K కట్స్' },
  'services.c2_p2': { EN: 'RAW camera captures (CR2/NEF/ARW)', TE: 'RAW కెమెరా క్యాప్చర్లు (CR2/NEF/ARW)' },
  'services.c2_p3': { EN: '3–5 Business Days (Cloud Download)', TE: '3–5 పని రోజులు (క్లౌడ్ డౌన్‌లోడ్)' },
  'services.c2_cta': { EN: 'Order Editing Only →', TE: 'ఎడిటింగ్ మాత్రమే ఆర్డర్ చేయండి →' },
  'services.c3_badge': { EN: '🖨️ Lab Press • Only Printing', TE: '🖨️ ల్యాబ్ ప్రెస్ • ప్రింటింగ్ మాత్రమే' },
  'services.c3_title': { EN: 'Archival Printing & Binding', TE: 'ఆర్కైవల్ ప్రింటింగ్ & బైండింగ్' },
  'services.c3_sub': { EN: 'Spreads Ready • Zero Design Fee', TE: 'స్ప్రెడ్‌లు సిద్ధం • డిజైన్ ఫీజు లేదు' },
  'services.c3_desc': { EN: 'Already have finished album layouts? Print directly on HP Indigo 12000 or Silver Halide minilabs with 8 surface finishes.', TE: 'ఆల్బమ్ లేఅవుట్‌లు సిద్ధంగా ఉన్నాయా? 8 సర్ఫేస్ ఫినిష్‌లతో HP ఇండిగో 12000 లేదా సిల్వర్ హాలైడ్ మినీల్యాబ్‌లపై నేరుగా ప్రింట్ చేయండి.' },
  'services.c3_p1': { EN: 'HP Indigo press, 8 surface laminations, seamless lay-flat core, luxury cover', TE: 'HP ఇండిగో ప్రెస్, 8 సర్ఫేస్ లామినేషన్‌లు, సీమ్‌లెస్ లే-ఫ్లాట్ కోర్, లగ్జరీ కవర్' },
  'services.c3_p2': { EN: 'Pre-designed 300 DPI PSD/TIFF/JPEG spreads', TE: 'ముందే డిజైన్ చేసిన 300 DPI PSD/TIFF/JPEG స్ప్రెడ్‌లు' },
  'services.c3_p3': { EN: '48–72 Hours Express Dispatch', TE: '48–72 గంటల ఎక్స్‌ప్రెస్ డిస్పాచ్' },
  'services.c3_cta': { EN: 'Order Printing Only →', TE: 'ప్రింటింగ్ మాత్రమే ఆర్డర్ చేయండి →' },
  'services.c4_badge': { EN: '🎬 A-la-Carte Media & Flex', TE: '🎬 ఎ-లా-కార్ట్ మీడియా & ఫ్లెక్స్' },
  'services.c4_title': { EN: 'Reels, Teasers & Invites', TE: 'రీల్స్, టీజర్లు & ఆహ్వానాలు' },
  'services.c4_sub': { EN: 'Pick Any Individual Service', TE: 'ఏదైనా ఒక్క సేవను ఎంచుకోండి' },
  'services.c4_desc': { EN: 'Select standalone digital or physical event media without ordering a full wedding package.', TE: 'పూర్తి వెడ్డింగ్ ప్యాకేజీ ఆర్డర్ చేయకుండా ఒక్క డిజిటల్ లేదా ఫిజికల్ ఈవెంట్ మీడియాను ఎంచుకోండి.' },
  'services.c4_p1': { EN: 'WhatsApp video invites, 9:16 Reels 5-pack, 4K Teaser trailer, Welcome standees', TE: 'వాట్సాప్ వీడియో ఆహ్వానాలు, 9:16 రీల్స్ 5-ప్యాక్, 4K టీజర్ ట్రైలర్, వెల్కమ్ స్టాండీలు' },
  'services.c4_p2': { EN: 'Event details, names, or wedding video clips', TE: 'ఈవెంట్ వివరాలు, పేర్లు, లేదా వెడ్డింగ్ వీడియో క్లిప్‌లు' },
  'services.c4_p3': { EN: '24–48 Hours Express Delivery', TE: '24–48 గంటల ఎక్స్‌ప్రెస్ డెలివరీ' },
  'services.c4_cta': { EN: 'Explore A-la-Carte →', TE: 'ఎ-లా-కార్ట్ చూడండి →' },
  'services.order_service': { EN: 'Order Service →', TE: 'సేవ ఆర్డర్ చేయండి →' },
  'services.photo_title': { EN: 'Photo Retouching, Culling & Color Grading', TE: 'ఫోటో రీటచింగ్, కల్లింగ్ & కలర్ గ్రేడింగ్' },
  'services.photo_sub': { EN: 'From high-volume camera RAW culling to high-fashion skin retouching and golden Telugu wedding color grading.', TE: 'అధిక సంఖ్యలో కెమెరా RAW కల్లింగ్ నుంచి హై-ఫ్యాషన్ స్కిన్ రీటచింగ్, సువర్ణ తెలుగు వెడ్డింగ్ కలర్ గ్రేడింగ్ వరకు.' },
  'services.video_title': { EN: 'Cinematic 4K Video Post-Production', TE: 'సినిమాటిక్ 4K వీడియో పోస్ట్-ప్రొడక్షన్' },
  'services.video_sub': { EN: 'Story-driven cinematic wedding films, traditional Muhurtham documentaries, same-day reception edits, and viral 9:16 vertical reels.', TE: 'కథా-కేంద్రిత సినిమాటిక్ వెడ్డింగ్ ఫిల్మ్‌లు, సాంప్రదాయ ముహూర్తం డాక్యుమెంటరీలు, అదే రోజు రిసెప్షన్ ఎడిట్లు, వైరల్ 9:16 వర్టికల్ రీల్స్.' },
  'services.est_eyebrow': { EN: '✦ ANDHRA PRADESH #1 POST-PRODUCTION HUB ✦', TE: '✦ ఆంధ్రప్రదేశ్ నంబర్ 1 పోస్ట్-ప్రొడక్షన్ హబ్ ✦' },
  'services.est_title': { EN: 'Wedding Album & Video — Instant Quote', TE: 'వెడ్డింగ్ ఆల్బమ్ & వీడియో — తక్షణ కొటేషన్' },
  'services.est_subtitle': { EN: 'Answer 3 simple questions — what you need, how many pages, which cover — and get an honest, itemised price. Editing only, printing only, or both — your choice.', TE: '3 సులభ ప్రశ్నలకు సమాధానం ఇవ్వండి — ఏమి కావాలి, ఎన్ని పేజీలు, ఏ కవర్ — నిజాయితీగా, అంశాల వారీగా ధర పొందండి. ఎడిటింగ్ మాత్రమే, ప్రింటింగ్ మాత్రమే, లేదా రెండూ — మీ ఇష్టం.' },
  'services.est_cta': { EN: 'Start My Order', TE: 'నా ఆర్డర్ ప్రారంభించండి' },
  'services.cta_title': { EN: 'Ready to elevate your memories?', TE: 'మీ జ్ఞాపకాలను ఉన్నతంగా మార్చేందుకు సిద్ధమా?' },
  'services.cta_desc': { EN: 'Get your albums designed, printed, and delivered with 100% color accuracy guarantee and lifetime archival durability.', TE: '100% రంగు ఖచ్చితత్వ హామీ, జీవితకాల ఆర్కైవల్ మన్నికతో మీ ఆల్బమ్‌లను డిజైన్, ప్రింట్ చేసి అందిస్తాం.' },
  'services.cta_btn1': { EN: 'Start Custom Order', TE: 'కస్టమ్ ఆర్డర్ ప్రారంభించండి' },
  'services.cta_btn2': { EN: 'Instant Cost Estimator', TE: 'తక్షణ ధర అంచనా' },

  // ── Blog ───────────────────────────────────────────────────────────────
  'blog.title1': { EN: 'Wedding', TE: 'వెడ్డింగ్' },
  'blog.title2': { EN: 'Stories & Tips', TE: 'కథలు & చిట్కాలు' },
  'blog.sub': { EN: 'Insights, trends, and guides for couples and studios.', TE: 'జంటలకు, స్టూడియోలకు అంతర్దృష్టులు, ట్రెండ్‌లు, మార్గదర్శినులు.' },
  'blog.read': { EN: 'Read Article', TE: 'వ్యాసం చదవండి' },
  'blog.read_short': { EN: 'Read', TE: 'చదవండి' },
  'blog.all_stories': { EN: 'All stories', TE: 'అన్ని కథలు' },
  'blog.min_read': { EN: '{n} min read', TE: '{n} నిమి చదవండి' },
  'blog.notfound_title1': { EN: 'Article', TE: 'వ్యాసం' },
  'blog.notfound_title2': { EN: 'Not Found', TE: 'దొరకలేదు' },
  'blog.notfound_sub': { EN: 'That story may have moved. Browse all our articles instead.', TE: 'ఆ కథ తరలి ఉండవచ్చు. బదులుగా మా అన్ని వ్యాసాలను చూడండి.' },
  'blog.back': { EN: 'Back to articles', TE: 'వ్యాసాలకు తిరిగి వెళ్లండి' },
  'blog.more': { EN: 'More stories', TE: 'ఇంకా కథలు' },
  'blog.cta_title_pre': { EN: 'Ready to design', TE: 'డిజైన్ చేయడానికి సిద్ధమా' },
  'blog.cta_title_post': { EN: 'your album', TE: 'మీ ఆల్బమ్' },
  'blog.cta_desc': { EN: 'Get an instant estimate built from your event dates, sheet style and cover finish.', TE: 'మీ ఈవెంట్ తేదీలు, షీట్ స్టైల్, కవర్ ఫినిష్ ఆధారంగా తక్షణ అంచనా పొందండి.' },
  'blog.cta_btn': { EN: 'Start Your Album', TE: 'మీ ఆల్బమ్ ప్రారంభించండి' },

  // ── B2C (couples) ──────────────────────────────────────────────────────
  'b2c.badge': { EN: 'ALBUMS + EDITING + PRINTING STARTING AT ₹2,000', TE: 'ఆల్బమ్‌లు + ఎడిటింగ్ + ప్రింటింగ్ ₹2,000 నుంచి' },
  'b2c.title1': { EN: 'Your Wedding Story,', TE: 'మీ వివాహ కథ,' },
  'b2c.title2': { EN: 'Cinematically Bound.', TE: 'సినిమాటిక్‌గా బైండ్ చేయబడింది.' },
  'b2c.memline': { EN: 'మీ జ్ఞాపకాలు మా బాధ్యత', TE: 'మీ జ్ఞాపకాలు మా బాధ్యత' },
  'b2c.sub': {
    EN: '(Your memories are our responsibility). Upload your digital gallery and let our expert designers craft a luxury physical royal album.',
    TE: '(మీ జ్ఞాపకాలు మా బాధ్యత). మీ డిజిటల్ గ్యాలరీని అప్‌లోడ్ చేయండి — మా నిపుణుల డిజైనర్లు లగ్జరీ ఫిజికల్ రాయల్ ఆల్బమ్‌ను తయారు చేస్తారు.',
  },
  'b2c.cta': { EN: 'Start Your Album Order', TE: 'మీ ఆల్బమ్ ఆర్డర్ ప్రారంభించండి' },
  'b2c.viewer_hint': { EN: 'Interactive 3D Viewer — Drag to turn pages', TE: 'ఇంటరాక్టివ్ 3D వ్యూయర్ — పేజీలు తిప్పడానికి లాగండి' },
  'b2c.3d_title': { EN: 'Experience Your Layout in 3D.', TE: 'మీ లేఅవుట్‌ను 3Dలో అనుభవించండి.' },
  'b2c.3d_desc': {
    EN: 'No more guessing what your physical album will look like. Review your custom layout in our fully interactive 3D digital viewer before approving it for print.',
    TE: 'మీ ఫిజికల్ ఆల్బమ్ ఎలా ఉంటుందో ఇక ఊహించాల్సిన అవసరం లేదు. ప్రింట్‌కు ఆమోదించే ముందు మా పూర్తి ఇంటరాక్టివ్ 3D డిజిటల్ వ్యూయర్‌లో మీ కస్టమ్ లేఅవుట్‌ను చూడండి.',
  },
  'b2c.3d_f1': { EN: 'Lifelike page turns and physics', TE: 'నిజమైనట్లుండే పేజీ టర్నింగ్, ఫిజిక్స్' },
  'b2c.3d_f2': { EN: 'Leave revision comments directly on spreads', TE: 'స్ప్రెడ్‌లపై నేరుగా రివిజన్ కామెంట్లు పెట్టండి' },
  'b2c.3d_f3': { EN: 'One-click print approval', TE: 'ఒక్క క్లిక్‌తో ప్రింట్ ఆమోదం' },
  'b2c.how_title': { EN: 'How It Works', TE: 'ఇది ఎలా పనిచేస్తుంది' },
  'b2c.how_sub': { EN: 'From digital gallery to physical royal masterpiece.', TE: 'డిజిటల్ గ్యాలరీ నుంచి ఫిజికల్ రాయల్ మాస్టర్‌పీస్ వరకు.' },
  'b2c.step1_t': { EN: 'Upload', TE: 'అప్‌లోడ్' },
  'b2c.step1_d': { EN: 'Securely upload your favorites via our portal.', TE: 'మా పోర్టల్ ద్వారా మీకు ఇష్టమైనవి సురక్షితంగా అప్‌లోడ్ చేయండి.' },
  'b2c.step2_t': { EN: 'Design', TE: 'డిజైన్' },
  'b2c.step2_d': { EN: 'Our experts craft a cinematic layout.', TE: 'మా నిపుణులు సినిమాటిక్ లేఅవుట్ తయారు చేస్తారు.' },
  'b2c.step3_t': { EN: 'Review', TE: 'సమీక్ష' },
  'b2c.step3_d': { EN: 'Approve your album in 3D.', TE: 'మీ ఆల్బమ్‌ను 3Dలో ఆమోదించండి.' },
  'b2c.step4_t': { EN: 'Deliver', TE: 'డెలివరీ' },
  'b2c.step4_d': { EN: 'Receive your luxury layflat album.', TE: 'మీ లగ్జరీ లేఫ్లాట్ ఆల్బమ్‌ను పొందండి.' },
  'b2c.quality_title': { EN: 'Feel Your Memories', TE: 'మీ జ్ఞాపకాలను తాకండి' },
  'b2c.quality_sheets': { EN: 'మీ ఆల్బమ్ క్వాలిటీ (Sheet Types)', TE: 'మీ ఆల్బమ్ క్వాలిటీ (షీట్ రకాలు)' },
  'b2c.quality_sub': { EN: 'What makes our wedding albums the best choice for your Pelli?', TE: 'మీ పెళ్లికి మా వెడ్డింగ్ ఆల్బమ్‌లే ఉత్తమ ఎంపిక ఎందుకు?' },
  'b2c.design_title': { EN: 'The Art of Album Designing', TE: 'ఆల్బమ్ డిజైనింగ్ కళ' },
  'b2c.design_pre': { EN: 'Your wedding photos are more than just pictures; they are the story of your biggest day. Our expert designers take your raw photos, apply ', TE: 'మీ వివాహ ఫోటోలు కేవలం చిత్రాలు కావు; అవి మీ జీవితంలోని గొప్ప రోజు కథ. మా నిపుణుల డిజైనర్లు మీ రా ఫోటోలకు ' },
  'b2c.design_strong': { EN: 'cinematic color grading', TE: 'సినిమాటిక్ కలర్ గ్రేడింగ్' },
  'b2c.design_post': { EN: ' to make the gold jewelry shine and the silk sarees pop, and arrange them into a beautiful narrative layout.', TE: ' అందించి, బంగారు నగలు మెరిసేలా, పట్టు చీరలు ఎదురుకునేలా చేసి, అందమైన కథన లేఅవుట్‌గా అమరుస్తారు.' },
  'b2c.sheet1_t': { EN: 'NT (Non-Tearable) Paper', TE: 'NT (చిరగని) పేపర్' },
  'b2c.sheet1_d': { EN: 'Lifetime guarantee! Waterproof and tear-proof. The absolute best choice for Indian homes.', TE: 'జీవితకాల హామీ! నీటి నిరోధకం, చిరగనిది. భారతీయ ఇళ్లకు ఉత్తమ ఎంపిక.' },
  'b2c.sheet2_t': { EN: 'Metallic Finish', TE: 'మెటాలిక్ ఫినిష్' },
  'b2c.sheet2_d': { EN: 'Perfect for your grand reception and Mehendi shots. It gives the photos a rich, glowing, 3D-like metallic shine.', TE: 'గ్రాండ్ రిసెప్షన్, మెహందీ షాట్‌లకు పరిపూర్ణం. ఫోటోలకు సుసంపన్నమైన, మెరిసే, 3D లాంటి మెటాలిక్ షైన్ ఇస్తుంది.' },
  'b2c.sheet3_t': { EN: 'Velvet / Feather Touch', TE: 'వెల్వెట్ / ఫెదర్ టచ్' },
  'b2c.sheet3_d': { EN: 'A royal, soft feel in your hands. When you touch the pages, it feels like smooth velvet. Perfect for luxury portraits.', TE: 'మీ చేతుల్లో రాజసమైన, మృదువైన అనుభూతి. పేజీలు తాకగానే నునుపైన వెల్వెట్‌లా అనిపిస్తుంది. లగ్జరీ పోర్ట్రెయిట్‌లకు పరిపూర్ణం.' },
  'b2c.gallery_title': { EN: 'Quality You Can Feel', TE: 'అనుభవించగల నాణ్యత' },
  'b2c.gallery_sub': { EN: 'Printed on 300GSM archival paper, designed to last a lifetime.', TE: '300GSM ఆర్కైవల్ పేపర్‌పై ముద్రించబడింది, జీవితకాలం నిలిచేలా రూపొందించబడింది.' },
  'b2c.digital_title': { EN: 'Go Digital.', TE: 'డిజిటల్‌గా మారండి.' },
  'b2c.digital_desc': { EN: 'We design stunning cinematic video invitations customized with your photos and event details, perfectly formatted for WhatsApp.', TE: 'మీ ఫోటోలు, ఈవెంట్ వివరాలతో అనుకూలీకరించిన అద్భుత సినిమాటిక్ వీడియో ఆహ్వానాలను రూపొందిస్తాం — వాట్సాప్‌కు సరిగ్గా ఫార్మాట్ చేసి.' },
  'b2c.digital_cta': { EN: 'Order Digital Invite', TE: 'డిజిటల్ ఆహ్వానం ఆర్డర్ చేయండి' },

  // ── Muhurtham calendar ─────────────────────────────────────────────────
  'muhurtham.title': { EN: 'Subha Muhurtham Calendar', TE: 'శుభ ముహూర్తం క్యాలెండర్' },
  'muhurtham.sub': { EN: 'Book your wedding photography on highly auspicious dates (Andhra/Telangana standard).', TE: 'అత్యంత శుభ తేదీలలో మీ వివాహ ఫోటోగ్రఫీని బుక్ చేసుకోండి (ఆంధ్ర/తెలంగాణ ప్రమాణం).' },
  'muhurtham.loading': { EN: 'Loading auspicious dates...', TE: 'శుభ తేదీలు లోడ్ అవుతున్నాయి...' },
  'muhurtham.high_demand': { EN: 'High Demand', TE: 'అధిక డిమాండ్' },
  'muhurtham.book': { EN: 'Check Availability & Book', TE: 'అందుబాటు చూసి బుక్ చేయండి' },

  // ── Albums showcase ────────────────────────────────────────────────────
  'albums.title': { EN: 'Our Master Album Craftsmanship', TE: 'మా మాస్టర్ ఆల్బమ్ క్రాఫ్ట్‌మాన్‌షిప్' },
  'albums.sub': { EN: 'Printed on high-precision European digital presses with archival inks guaranteed to retain color fidelity for 100+ years.', TE: '100+ సంవత్సరాల పాటు రంగు నిబద్ధతను నిలిపే ఆర్కైవల్ ఇంక్‌లతో, అత్యున్నత ఐరోపా డిజిటల్ ప్రెస్‌లపై ముద్రించబడింది.' },
  'albums.tab_covers': { EN: 'Album Types & Covers', TE: 'ఆల్బమ్ రకాలు & కవర్లు' },
  'albums.tab_paper': { EN: 'Paper Finishes', TE: 'పేపర్ ఫినిష్‌లు' },
  'albums.customize': { EN: 'Customize & Order →', TE: 'అనుకూలీకరించి ఆర్డర్ చేయండి →' },
  'albums.cta_title': { EN: 'Ready to print your masterpiece?', TE: 'మీ మాస్టర్‌పీస్‌ను ప్రింట్ చేయడానికి సిద్ధమా?' },
  'albums.cta_desc': { EN: 'Upload your designs or let our expert editing team create the perfect layout for you.', TE: 'మీ డిజైన్‌లను అప్‌లోడ్ చేయండి, లేదా మా నిపుణుల ఎడిటింగ్ టీమ్ మీ కోసం పరిపూర్ణ లేఅవుట్ తయారు చేయనివ్వండి.' },
  'albums.cta_btn': { EN: 'Start Ordering', TE: 'ఆర్డర్ ప్రారంభించండి' },

  // ── Footer ─────────────────────────────────────────────────────────────
  'footer.desc': {
    EN: 'Capturing the vibrant traditions and cinematic moments of Andhra Pradesh. Specializing in Pelli, Nischitartham, and premium album designs.',
    TE: 'ఆంధ్రప్రదేశ్ సజీవ సంప్రదాయాలను, సినిమాటిక్ క్షణాలను చిత్రీకరిస్తున్నాం. పెళ్లి, నిశ్చితార్థం, ప్రీమియం ఆల్బమ్ డిజైన్లలో నిపుణులు.',
  },
  'footer.quick_links': { EN: 'Quick Links', TE: 'త్వరిత లింకులు' },
  'footer.contact_us': { EN: 'Contact Us', TE: 'మమ్మల్ని సంప్రదించండి' },
  'footer.rights': { EN: 'All Rights Reserved.', TE: 'సర్వ హక్కులు కలవు.' },

  // ── About ──────────────────────────────────────────────────────────────
  'about.hero_title': { EN: 'Our Story', TE: 'మా కథ' },
  'about.hero_sub': {
    EN: "Rooted in tradition, powered by technology. We are South India's premier post-production studio for Telugu wedding photography.",
    TE: 'సంప్రదాయంలో వేరు పాతుకుని, టెక్నాలజీతో నడుస్తున్నాం. తెలుగు వివాహ ఫోటోగ్రఫీకి దక్షిణ భారతదేశపు అగ్రశ్రేణి పోస్ట్-ప్రొడక్షన్ స్టూడియో మేము.',
  },
  'about.pillars_title': { EN: 'The Three Pillars', TE: 'మూడు స్తంభాలు' },
  'about.pillars_sub': {
    EN: 'Why hundreds of studios and couples trust weddingalbums.in with their most precious memories.',
    TE: 'వందలాది స్టూడియోలు, జంటలు తమ అమూల్య జ్ఞాపకాలను weddingalbums.in కి ఎందుకు అప్పగిస్తారు.',
  },
  'about.p1_title': { EN: 'Uncompromising Quality', TE: 'రాజీలేని నాణ్యత' },
  'about.p1_desc': {
    EN: 'Every album is color-graded by experts who understand the warm, golden aesthetics of Telugu weddings. From high-end retouching to Karizma album design, we deliver perfection.',
    TE: 'తెలుగు వివాహాల సువర్ణ సౌందర్యాన్ని అర్థం చేసుకునే నిపుణులే ప్రతి ఆల్బమ్‌కు కలర్ గ్రేడింగ్ చేస్తారు. హై-ఎండ్ రీటచింగ్ నుంచి కరిజ్మా ఆల్బమ్ డిజైన్ వరకు — పరిపూర్ణతే మా చేతి.',
  },
  'about.p2_title': { EN: 'Lightning Fast Speed', TE: 'మెరుపు వేగం' },
  'about.p2_desc': {
    EN: 'We know you want to see your memories immediately. Our 3-5 day turnaround for editing and 3D album proofing is the fastest in the industry.',
    TE: 'మీ జ్ఞాపకాలను వెంటనే చూడాలనుకుంటారని మాకు తెలుసు. ఎడిటింగ్, 3D ఆల్బమ్ ప్రూఫింగ్‌కు మా 3-5 రోజుల టర్న్‌అరౌండ్ పరిశ్రమలోనే వేగవంతం.',
  },
  'about.p3_title': { EN: 'Crafted With Care', TE: 'శ్రద్ధతో తయారు' },
  'about.p3_desc': {
    EN: "We treat every wedding as if it were our own family's. We ensure 100% white-label confidentiality for our studio partners and joy for our couples.",
    TE: 'ప్రతి పెళ్లిని మా కుటుంబ పెళ్లిలా చూసుకుంటాం. స్టూడియో భాగస్వాములకు 100% వైట్-లేబుల్ గోప్యత, జంటలకు ఆనందం ఖాయం.',
  },
  'about.stat1_label': { EN: 'Albums Delivered', TE: 'అందించిన ఆల్బమ్‌లు' },
  'about.stat2_label': { EN: 'States Served', TE: 'సేవలందించిన రాష్ట్రాలు' },
  'about.stat3_label': { EN: 'Client Rating', TE: 'క్లయింట్ రేటింగ్' },
  'about.stat4_label': { EN: 'Avg. Turnaround', TE: 'సగటు టర్న్‌అరౌండ్' },

  // ── Careers ────────────────────────────────────────────────────────────
  'careers.hero_title': { EN: 'Join Our Freelance Network', TE: 'మా ఫ్రీలాన్స్ నెట్‌వర్క్‌లో చేరండి' },
  'careers.hero_sub': {
    EN: 'We are looking for talented photo retouch artists, video editors, and album designers to join our remote workforce.',
    TE: 'నైపుణ్యం గల ఫోటో రీటచ్ ఆర్టిస్టులు, వీడియో ఎడిటర్లు, ఆల్బమ్ డిజైనర్లను మా రిమోట్ టీమ్‌లోకి ఆహ్వానిస్తున్నాం.',
  },
  'careers.title': { EN: 'Edit From Anywhere, Get Paid on Time', TE: 'ఎక్కడి నుంచైనా ఎడిట్ చేయండి, సమయానికి డబ్బు పొందండి' },
  'careers.desc': {
    EN: 'weddingalbums.in connects professional wedding studios with elite freelance editors. If you have an eye for cinematic color grading, mastery over Premiere Pro / Lightroom, or love designing premium album spreads, we want you.',
    TE: 'weddingalbums.in ప్రొఫెషనల్ వెడ్డింగ్ స్టూడియోలను అత్యుత్తమ ఫ్రీలాన్స్ ఎడిటర్లతో కలుపుతుంది. సినిమాటిక్ కలర్ గ్రేడింగ్‌పై అభిరుచి, Premiere Pro / Lightroom‌పై పట్టు, లేదా ప్రీమియం ఆల్బమ్ స్ప్రెడ్‌ల డిజైన్ ఇష్టమైతే — మీరే మాకు కావాలి.',
  },
  'careers.earn_title': { EN: '💰 Earnings Potential', TE: '💰 ఆదాయ అవకాశం' },
  'careers.earn_label': { EN: 'Jobs per month (Avg ₹3,000 / job)', TE: 'నెలకు జాబ్‌లు (సగటు ₹3,000 / జాబ్)' },
  'careers.earn_permo': { EN: '/mo', TE: '/నెల' },
  'careers.payout_title': { EN: '⚡ Instant Payouts', TE: '⚡ తక్షణ పేఅవుట్‌లు' },
  'careers.payout_desc': {
    EN: 'Complete a job, get the funds in your wallet immediately. Request a payout to your UPI or Bank Account anytime.',
    TE: 'ఒక జాబ్ పూర్తయ్యాగానే డబ్బు మీ వాలెట్‌లోకి వస్తుంది. ఎప్పుడైనా మీ UPI లేదా బ్యాంక్ ఖాతాకు పేఅవుట్ అడగవచ్చు.',
  },
  'careers.apply': { EN: 'Apply & Take Skills Test', TE: 'దరఖాస్తు చేయండి & స్కిల్స్ టెస్ట్ రాయండి' },

  // ── Pricing ────────────────────────────────────────────────────────────
  'pricing.badge': { EN: '100% TRANSPARENT HEIRLOOM PRICING', TE: '100% పారదర్శక హీర్లూమ్ ధరలు' },
  'pricing.title': { EN: 'Transparent Pricing for Couples', TE: 'జంటల కోసం పారదర్శక ధరలు' },
  'pricing.sub_pre': { EN: '', TE: 'ఎలాంటి దాచిన ఛార్జీలు లేవు' },
  'pricing.sub': {
    EN: '(No hidden charges). What you see is exactly what you pay for your heirloom wedding albums, 4K video edits, and event prints.',
    TE: '(దాచిన ఛార్జీలు లేవు). మీ హీర్లూమ్ వెడ్డింగ్ ఆల్బమ్‌లు, 4K వీడియో ఎడిట్లు, ఈవెంట్ ప్రింట్లకు మీరు చూసేదే చెల్లించేది.',
  },
  'pricing.packages_title': { EN: 'Wedding Collections & Services', TE: 'వెడ్డింగ్ కలెక్షన్స్ & సేవలు' },
  'pricing.packages_sub': {
    EN: 'Select any package below to configure custom sheet finishes, 4K video styles, and album dimensions.',
    TE: 'కస్టమ్ షీట్ ఫినిష్‌లు, 4K వీడియో స్టైల్స్, ఆల్బమ్ సైజులను సెట్ చేయడానికి కింద ఏదైనా ప్యాకేజీని ఎంచుకోండి.',
  },
  'pricing.faq_title': { EN: 'Frequently Asked Questions', TE: 'తరచుగా అడిగే ప్రశ్నలు' },
  'pricing.q1': { EN: 'Do you require an advance payment?', TE: 'ముందస్తు చెల్లింపు అవసరమా?' },
  'pricing.a1': {
    EN: 'Yes, we require a 50% advance to initiate the dedicated design, color grading, and proofing process. The remaining balance is payable upon your digital 3D proof approval before physical print binding.',
    TE: 'అవును. ప్రత్యేక డిజైన్, కలర్ గ్రేడింగ్, ప్రూఫింగ్ ప్రారంభించడానికి 50% ముందస్తు అవసరం. మిగిలిన మొత్తం, ప్రింట్ బైండింగ్‌కు ముందు మీ డిజిటల్ 3D ప్రూఫ్ ఆమోదం తర్వాత చెల్లించాలి.',
  },
  'pricing.q2': { EN: 'How long does printing take?', TE: 'ప్రింటింగ్‌కు ఎంత సమయం పడుతుంది?' },
  'pricing.a2': {
    EN: 'Once you approve the digital 3D flipbook proof, precision printing and hand-crafted binding take 3-5 working days. Priority courier delivery across AP and Telangana takes another 24-48 hours.',
    TE: 'మీరు డిజిటల్ 3D ఫ్లిప్‌బుక్ ప్రూఫ్ ఆమోదించాక, ఖచ్చితమైన ప్రింటింగ్, చేతితో చేసిన బైండింగ్‌కు 3-5 పని రోజులు పడుతుంది. AP, తెలంగాణ అంతటా ప్రయారిటీ కొరియర్ డెలివరీకి మరో 24-48 గంటలు.',
  },
  'pricing.q3': { EN: 'Can we request changes before printing?', TE: 'ప్రింటింగ్‌కు ముందు మార్పులు అడగవచ్చా?' },
  'pricing.a3': {
    EN: 'Yes! We share an interactive 3D digital flipbook proof directly to your Couples Portal and WhatsApp. You can review every spread, leave notes, and approve the design before it goes to the lab.',
    TE: 'తప్పకుండా! ఇంటరాక్టివ్ 3D డిజిటల్ ఫ్లిప్‌బుక్ ప్రూఫ్‌ను నేరుగా మీ కపుల్స్ పోర్టల్, వాట్సాప్‌కు పంపుతాం. ల్యాబ్‌కు వెళ్లే ముందు ప్రతి స్ప్రెడ్ చూసి, నోట్స్ పెట్టి, డిజైన్ ఆమోదించవచ్చు.',
  },
  'pricing.q4': { EN: 'Are there hidden shipping charges?', TE: 'దాచిన షిప్పింగ్ ఛార్జీలు ఉన్నాయా?' },
  'pricing.a4': {
    EN: 'No. Standard insured door delivery across Andhra Pradesh & Telangana is included in all premium heirloom packages. Express 24-hour rush dispatch is available during checkout.',
    TE: 'లేవు. ఆంధ్రప్రదేశ్ & తెలంగాణ అంతటా ప్రామాణిక ఇన్స్యూర్డ్ డోర్ డెలివరీ అన్ని ప్రీమియం హీర్లూమ్ ప్యాకేజీల్లో చేరి ఉంది. చెకౌట్‌లో ఎక్స్‌ప్రెస్ 24-గంటల రష్ డిస్పాచ్ అందుబాటులో ఉంటుంది.',
  },
  'pricing.cta_title': { EN: 'Have custom requirements?', TE: 'ప్రత్యేక అవసరాలు ఉన్నాయా?' },
  'pricing.cta_desc': {
    EN: 'Talk directly to our Vijayawada production team on WhatsApp to discuss custom dimensions, specialty sheets, or multi-album family suites.',
    TE: 'కస్టమ్ సైజులు, స్పెషాలిటీ షీట్లు, లేదా అనేక ఆల్బమ్‌ల ఫ్యామిలీ సూట్ల గురించి మాట్లాడటానికి వాట్సాప్‌లో నేరుగా మా విజయవాడ ప్రొడక్షన్ టీమ్‌ను సంప్రదించండి.',
  },
  'pricing.cta_btn': { EN: 'Chat with Album Specialist', TE: 'ఆల్బమ్ స్పెషలిస్ట్‌తో చాట్ చేయండి' },

  // ── Portfolio ──────────────────────────────────────────────────────────
  'portfolio.title': { EN: 'Our Portfolio', TE: 'మా పోర్ట్‌ఫోలియో' },
  'portfolio.sub': { EN: 'A curated collection of our finest cinematic wedding stories.', TE: 'మా అత్యుత్తమ సినిమాటిక్ వివాహ కథల ఎంపిక.' },
  'portfolio.filter.all': { EN: 'All Work', TE: 'అన్నీ' },
  'portfolio.filter.wedding': { EN: 'Weddings', TE: 'పెళ్లిళ్లు' },
  'portfolio.filter.prewedding': { EN: 'Pre-Wedding', TE: 'ప్రీ-వెడ్డింగ్' },
  'portfolio.filter.halfsaree': { EN: 'Half Saree', TE: 'హాఫ్ సారీ' },
  'portfolio.filter.birthday': { EN: 'Birthdays', TE: 'పుట్టినరోజులు' },
  'portfolio.filter.albums': { EN: 'Albums & Flex', TE: 'ఆల్బమ్‌లు & ఫ్లెక్స్' },
  'portfolio.filter.corporate': { EN: 'Corporate', TE: 'కార్పొరేట్' },
  'portfolio.filter.events': { EN: 'Events', TE: 'ఈవెంట్లు' },
  'portfolio.lightbox_hint': { EN: 'Press ← → to navigate · ESC to close', TE: 'తిరగడానికి ← → నొక్కండి · మూసేందుకు ESC' },

  // ── Testimonials ───────────────────────────────────────────────────────
  'testimonials.eyebrow': { EN: '✦ True Stories ✦', TE: '✦ నిజమైన కథలు ✦' },
  'testimonials.title': { EN: 'Wall of Love', TE: 'ప్రేమ గోడ' },
  'testimonials.sub': {
    EN: "Don't just take our word for it. Read the real experiences of couples whose timeless memories we've had the honor to capture.",
    TE: 'మా మాటే నమ్మకండి. శాశ్వత జ్ఞాపకాలను చిత్రీకరించే గౌరవం పొందిన జంటల నిజ అనుభవాలను చదవండి.',
  },
  'testimonials.stat1': { EN: 'Happy Couples', TE: 'సంతోషకర జంటలు' },
  'testimonials.stat2': { EN: 'Years Experience', TE: 'సంవత్సరాల అనుభవం' },
  'testimonials.stat3': { EN: 'Cities Across AP', TE: 'AP అంతటా నగరాలు' },
  'testimonials.filter.all': { EN: 'All Reviews', TE: 'అన్ని సమీక్షలు' },
  'testimonials.filter.wedding': { EN: 'Weddings', TE: 'పెళ్లిళ్లు' },
  'testimonials.filter.prewedding': { EN: 'Pre-Weddings', TE: 'ప్రీ-వెడ్డింగ్‌లు' },
  'testimonials.filter.halfsaree': { EN: 'Half Saree', TE: 'హాఫ్ సారీ' },
  'testimonials.filter.events': { EN: 'Events', TE: 'ఈవెంట్లు' },
  'testimonials.cta_title': { EN: 'Ready to Start Your Story?', TE: 'మీ కథ ప్రారంభించేందుకు సిద్ధమా?' },
  'testimonials.cta_sub': { EN: "Let's create timeless memories together.", TE: 'కలిసి శాశ్వత జ్ఞాపకాలు సృష్టిద్దాం.' },
  'testimonials.cta_btn': { EN: 'Check Availability', TE: 'అందుబాటు తనిఖీ చేయండి' },

  // ── Contact ────────────────────────────────────────────────────────────
  'contact.title': { EN: "Let's Talk", TE: 'మాట్లాడదాం' },
  'contact.sub': { EN: 'Book your session or request a custom quote.', TE: 'మీ సెషన్ బుక్ చేయండి లేదా కస్టమ్ కొటేషన్ అడగండి.' },
  'contact.get_in_touch': { EN: 'Get in Touch', TE: 'సంప్రదించండి' },
  'contact.intro': {
    EN: "Whether you're planning a grand Telugu wedding in Vijayawada or a scenic pre-wedding shoot, we're here to capture your beautiful story.",
    TE: 'విజయవాడలో గ్రాండ్ తెలుగు పెళ్లి, లేదా సుందర ప్రీ-వెడ్డింగ్ షూట్ — మీ అందమైన కథను చిత్రీకరించడానికి మేమున్నాం.',
  },
  'contact.phone': { EN: 'Phone / WhatsApp', TE: 'ఫోన్ / వాట్సాప్' },
  'contact.email': { EN: 'Email', TE: 'ఇమెయిల్' },
  'contact.location': { EN: 'Studio Location', TE: 'స్టూడియో చిరునామా' },
  'contact.cities': { EN: 'Operating Cities', TE: 'సేవలందించే నగరాలు' },
  'contact.who': { EN: 'Who Are You?', TE: 'మీరు ఎవరు?' },
  'contact.full_name': { EN: 'Full Name', TE: 'పూర్తి పేరు' },
  'contact.name_ph': { EN: 'Your Name', TE: 'మీ పేరు' },
  'contact.phone_label': { EN: 'Phone / WhatsApp', TE: 'ఫోన్ / వాట్సాప్' },
  'contact.phone_ph': { EN: 'Your Number', TE: 'మీ నంబర్' },
  'contact.city': { EN: 'City', TE: 'నగరం' },
  'contact.city_ph': { EN: 'Your City', TE: 'మీ నగరం' },
  'contact.next': { EN: 'Next', TE: 'తదుపరి' },
  'contact.back': { EN: 'Back', TE: 'వెనుకకు' },
  'contact.event_title': { EN: 'About Your Event', TE: 'మీ ఈవెంట్ గురించి' },
  'contact.event_type': { EN: 'Event Type', TE: 'ఈవెంట్ రకం' },
  'contact.opt.wedding': { EN: 'Wedding (Pelli)', TE: 'పెళ్లి' },
  'contact.opt.prewedding': { EN: 'Pre-Wedding Shoot', TE: 'ప్రీ-వెడ్డింగ్ షూట్' },
  'contact.opt.engagement': { EN: 'Engagement / Nischitartham', TE: 'నిశ్చితార్థం' },
  'contact.opt.album': { EN: 'Album Design Only', TE: 'ఆల్బమ్ డిజైన్ మాత్రమే' },
  'contact.opt.other': { EN: 'Other Events', TE: 'ఇతర ఈవెంట్లు' },
  'contact.event_date': { EN: 'Event Date', TE: 'ఈవెంట్ తేదీ' },
  'contact.venue': { EN: 'Venue Location', TE: 'వేదిక స్థలం' },
  'contact.venue_ph': { EN: 'Venue Name / City', TE: 'వేదిక పేరు / నగరం' },
  'contact.final': { EN: 'Final Details', TE: 'తుది వివరాలు' },
  'contact.budget': { EN: 'Expected Budget (₹)', TE: 'అనుకున్న బడ్జెట్ (₹)' },
  'contact.budget_select': { EN: 'Select a range...', TE: 'ఒక పరిధిని ఎంచుకోండి...' },
  'contact.message': { EN: 'Additional Message', TE: 'అదనపు సందేశం' },
  'contact.message_ph': { EN: 'Tell us more about your requirements...', TE: 'మీ అవసరాల గురించి మరింత చెప్పండి...' },
  'contact.send': { EN: 'Send on WhatsApp', TE: 'వాట్సాప్‌లో పంపండి' },
  'contact.toast_ok': { EN: 'Details submitted successfully! Redirecting to WhatsApp...', TE: 'వివరాలు విజయవంతంగా సమర్పించారు! వాట్సాప్‌కు వెళ్తోంది...' },
  'contact.toast_err': { EN: 'Failed to submit details. Opening WhatsApp...', TE: 'వివరాలు సమర్పించడం విఫలమైంది. వాట్సాప్ తెరుస్తోంది...' },
};

const TE_FALLBACK_CACHE = new Map();

export function t(key, lang = 'EN', vars = {}) {
  const entry = STRINGS[key];
  let out;
  if (!entry) out = key;
  else if (lang === 'TE') out = entry.TE || entry.EN;
  else out = entry.EN;
  if (vars && typeof out === 'string') {
    Object.entries(vars).forEach(([k, v]) => {
      out = out.replace(`{${k}}`, String(v));
    });
  }
  return out;
}

// Which keys are considered translated (for QA listing)
export const teluguReady = () => Object.keys(STRINGS).reduce((acc, k) => { acc[k] = Boolean(STRINGS[k].TE); return acc; }, {});

export default { t, STRINGS, teluguReady, TE_FALLBACK_CACHE };
