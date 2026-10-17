/**
 * client/src/lib/packageData.js — curated estimator-native package presets.
 * (Separated from packages.js so the estimator never imports fetch logic in tests.)
 *
 * Rates TODO(business): the engine prices every card from the SAME per-sheet maths as
 * the wizard — these presets only CONFIGURE (size/pages/finish-sheets/cover/videos);
 * they never hardcode a total.
 */
export const DEFAULT_B2C_PACKAGES = [
  {
    id: 'pkg-silver',
    key: 'silver',
    tier: 'Silver (Economy)',
    tierTe: 'సిల్వర్ (ఎకానమీ)',
    color: '#8FA3BD',
    category: 'value',
    popular: false,
    desc: 'High-volume classic: the sturdy 12×30 layflat in standard trade finishes with the signature cinematic teaser — the honest wedding-economy suite.',
    descTe: 'క్లాసిక్ బడ్జెట్ కాంబో: 12×30 లే-ఫ్లాట్ + స్టాండ‌ర్డ్ ఫినిష్ షీట్లు + సిగ్నేచ‌ర్ టీజ‌ర్ ఫిల్మ్.',
    apply: {
      intent: 'edit_print',
      sizeId: 'size-12x30',
      pages: 60,
      finishMode: 'mix',
      mix: { 'ntr-matte': 24, 'pure-silk': 4, 'ntr-glossy': 2 },
      coverId: 'hardcover-matte',
      videos: { teaser: 1 },
    },
    features: [
      '12×30 Medium Standard layflat album · 30 sheets / 60 pages',
      '~26 standard NTR-Matte style sheets + 6 premium pages',
      'Cinematic Teaser (3–5 min) — long-form film addable in the builder',
      'Album design, culling & colour grading included',
      'Standard Hardcover-Matte presentation · free insured courier',
    ],
    featuresTe: [
      '12×30 మీడియం స్టాండ‌ర్డ్ లే-ఫ్లాట్ · 30 షీట్లు / 60 పేజీలు',
      '~26 స్టాండ‌ర్డ్ NTR-మ్యాట్ + 6 ప్రీమియం పేజీలు',
      'సినిమాటిక్ టీజ‌ర్ (3–5 నిమి) — లాంగ్ ఫిల్మ్ బిల్డ‌ర్‌లో చేర్చుకోవ‌చ్చు',
      'ఆల్బమ్ డిజైన్ · కలర్ గ్రేడింగ్ కూడా కలిపి',
      'హార్డ్‌కవర్ మ్యాట్ ప్రెజెంటేషన్ · ఫ్రీ ఇన్స్యూర్డ్ కొరియర్',
    ],
  },
  {
    id: 'pkg-gold',
    key: 'gold',
    tier: 'Gold (Standard)',
    tierTe: 'గోల్డ్ (స్టాండ‌ర్డ్)',
    color: 'var(--brand)',
    category: 'standard',
    popular: true,
    desc: 'The sweet spot: 12×36 Commercial King with 40 sheets of feather-touch velvet & metallic pearl, wrapped in Italian leatherette — plus reels and the 4K teaser.',
    descTe: 'బెస్ట్ సెల్ల‌ర్: 12×36 కామర్షియల్ కింగ్ + 40 వెల్వెట్/గోల్డ్ షీట్లు + ఇటాలియన్ లెదరెట్ బాక్స్ + రీల్స్ & 4K టీజ‌ర్.',
    apply: {
      intent: 'edit_print',
      sizeId: 'size-12x36',
      pages: 80,
      finishMode: 'mix',
      mix: { 'royal-velvet': 22, 'metallic-gold': 12, 'pure-silk': 6 },
      coverId: 'leatherette-box',
      videos: { teaser: 1, reels: 1 },
    },
    features: [
      '12×36 Commercial King album · 40 sheets / 80 pages',
      'Feather-touch velvet + 24K metallic pearl mix',
      'Reels pack (5× 9:16) + 4K Teaser — feature film addable in the builder',
      'Italian Leatherette album with presentation box',
      '10 extra pages beyond the 30-sheet standard',
    ],
    featuresTe: [
      '12×36 కామ‌ర్షియల్ కింగ్ · 40 షీట్లు / 80 పేజీలు',
      'ఫెద‌ర్-టచ్ వెల్వెట్ + 24K మెటాలిక్ పెర్ల్ మిక్స్',
      'రీల్స్ ప్యాక్ (5× 9:16) + 4K టీజ‌ర్ — ఫీచ‌ర్ ఫిల్మ్ బిల్డ‌ర్‌లో చేర్చుకోవ‌చ్చు',
      'ఇటాలియన్ లెదరెట్ ఆల్బమ్ + ప్రెజెంటేషన్ బాక్స్',
      'స్టాండ‌ర్డ్ 30 షీట్ల త‌రువాత 10 అద‌నపు పేజీలు',
    ],
  },
  {
    id: 'pkg-platinum',
    key: 'platinum',
    tier: 'Platinum (Luxury)',
    tierTe: 'ప్లాటినం (లగ్జరీ)',
    color: '#B08BF2',
    category: 'luxury',
    popular: false,
    desc: 'The heirloom tier: royal vertical portrait book with 50 sheets of velvet, pearl & glitter, acrylic glass cover with engraving, the full film pack, and two parent mini-books.',
    descTe: 'హెయిర్‌లూమ్ టయర్: రాయల్ వర్టికల్ పోర్ట్రెయిట్ 50 షీట్లు + అక్రిలిక్ కవర్ + ఎంగ్రేవింగ్ + పూర్తి ఫిల్మ్ ప్యాక్ + 2 పేరెంట్ బుక్స్.',
    apply: {
      intent: 'edit_print',
      sizeId: 'size-12x18-vert',
      pages: 100,
      finishMode: 'mix',
      mix: { 'glitter-sheet': 12, 'royal-velvet': 22, 'metallic-gold': 16 },
      coverId: 'acrylic-glass',
      engrave: true,
      parentBooks: 2,
      videos: { teaser: 1, reels: 1, feature: 1 },
    },
    features: [
      '12×18 Royal / Jumbo Vertical Portrait · 50 sheets / 100 pages',
      'Glitter, velvet & metallic pearl luxury mix',
      'Reels + Teaser + 4K Feature Film — SDE screening addable in the builder',
      'Diamond Acrylic 3D cover + 24K engraving',
      '2 Parent pocket mini-books (−10% bundle)',
    ],
    featuresTe: [
      '12×18 రాయల్ వర్టికల్ పోర్ట్రెయిట్ · 50 షీట్లు / 100 పేజీలు',
      'గ్లిట‌ర్ · వెల్వెట్ · మెటాలిక్ పెర్ల్ లగ్జ‌రీ మిక్స్',
      'రీల్స్ + టీజ‌ర్ + 4K ఫీచ‌ర్ ఫిల్మ్ — SDE బిల్డ‌ర్‌లో చేర్చుకోవ‌చ్చు',
      'డైమండ్ అక్రిలిక్ కవర్ + 24K ఎంగ్రేవింగ్',
      '2 పేరెంట్ పాకెట్ మినీ-బుక్స్ (−10% బండిల్)',
    ],
  },
];
