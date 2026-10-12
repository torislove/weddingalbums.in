import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon, Video, BookOpen, Package, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import ScrollReveal from '../components/ScrollReveal';
import KolamDivider from '../components/KolamDivider';
import ServiceTimeline from '../components/ServiceTimeline';
import PackageSection from '../components/PackageSection';
import './Services.css';

const CATEGORIES = [
  { id: 'photo-editing', label: 'Photo Editing', icon: ImageIcon },
  { id: 'video-editing', label: 'Video Editing', icon: Video },
  { id: 'albums-flex', label: 'Albums & Flex', icon: BookOpen },
  { id: 'packages', label: 'Packages', icon: Package },
];

const SERVICES = {
  'photo-editing': [
    { n: '01', title: 'Pelli & Event Edits', telugu: 'పెళ్ళి ఫొటో ఎడిటింగ్', desc: 'Send us the raw photos from your Telugu wedding, and our expert team will deliver beautifully color-corrected and retouched images for your digital galleries and prints.', priceBadge: 'from ₹40/photo' },
    { n: '02', title: 'High-End Retouching', telugu: 'ఫొటో రీటచింగ్', desc: 'Advanced skin smoothing, blemish removal, jewelry shine, eye brightening, and overall tonal perfection on your selected photographs. Natural skin texture preserved.', priceBadge: 'from ₹60/photo' },
    { n: '03', title: 'Cinematic Color Grading', telugu: 'కలర్ గ్రేడింగ్', desc: 'Professional LUT-based cinematic color grading applied to all your photos. We achieve the rich, warm, golden look synonymous with Andhra Pradesh weddings.', priceBadge: 'from ₹30/photo' },
    { n: '04', title: 'Background Replacement', telugu: 'బ్యాక్‌గ్రౌండ్ రీప్లేస్మెంట్', desc: 'Replace distracting venue clutter with gorgeous royal palaces, mandap floral decors, or artistic temple backdrops using high-end compositing.', priceBadge: 'from ₹90/photo' },
    { n: '05', title: 'Kids & Birthday Edits', telugu: 'పుట్టినరోజు ఎడిటింగ్', desc: 'Vibrant, colorful grading for 1st birthdays, cradle ceremonies, and family portraits. We highlight the joy and colors of the event perfectly.', priceBadge: 'from ₹40/photo' },
    { n: '06', title: 'Half-Saree & Dhoti Ceremonies', telugu: 'లంగా వోణి & ధోతీ వేడుక', desc: 'Traditional South Indian ceremony edits. Gold jewelry enhancement, saree silk color enhancement, and flawless portrait retouching.', priceBadge: 'from ₹50/photo' },
    { n: '07', title: 'AI RAW Culling & Selection', telugu: 'రా ఫోటోల సెలెక్షన్ & కల్లింగ్', desc: 'Send 2,000+ raw photos. Our team filters blinks, test shots, and duplicates, selecting the best 300 hero photos for your wedding album.', priceBadge: 'from ₹15/photo' },
    { n: '08', title: 'Ancestral Photo Restoration', telugu: 'పాత ఫొటోల పునరుద్ధరణ', desc: 'Restore damaged, faded, or torn vintage black-and-white photos of grandparents and ancestors into crisp, colorized high-resolution prints.', priceBadge: 'from ₹120/photo' },
  ],
  'video-editing': [
    { n: '01', title: '4K Cinematic Wedding Film', telugu: '4K సినిమాటిక్ ఫిల్మ్ ఎడిటింగ్', desc: 'Our flagship 15-20 min story-driven film with vows, cinematic speech sync, multi-cam cut, professional LUT grading, and licensed Telugu music.', priceBadge: 'from ₹10,000' },
    { n: '02', title: 'Traditional Long-Form Video', telugu: 'సాంప్రదాయ వీడియో ఎడిటింగ్', desc: 'Full-length documentation of every sacred ritual cut seamlessly across multi-camera setups: Agni Sakshi, Saptapadi, and Talambralu.', priceBadge: 'from ₹12,000' },
    { n: '03', title: 'Cinematic Teaser (3-5 min)', telugu: 'సినిమాటిక్ టీజర్', desc: 'High-energy, music-synced highlight reel delivered rapidly. Perfect for sharing immediately on Instagram and WhatsApp with family and guests.', priceBadge: 'from ₹6,000' },
    { n: '04', title: 'Same-Day Edit (SDE) Film', telugu: 'సేమ్ డే ఎడిట్ (రిసెప్షన్ స్క్రీనింగ్)', desc: 'Morning ceremony footage edited in rush mode to screen as a stunning 5-minute highlight film at your reception venue the same evening.', priceBadge: 'from ₹12,000' },
    { n: '05', title: 'Instagram Reels & Shorts Pack', telugu: 'ఇన్‌స్టాగ్రామ్ రీల్స్ (5 రీల్స్)', desc: 'Trendy, music-synced 30–60 second 9:16 vertical reels optimized for Instagram and YouTube Shorts. Delivered color-graded and ready to go viral.', priceBadge: 'from ₹3,500' },
    { n: '06', title: 'Audio Mixing & Devotional Score', telugu: 'ఆడియో మిక్సింగ్ & నాదస్వరం', desc: 'Professional audio cleanup, noise removal, and mixing with licensed classical Telugu, Mangala Vaadhyam, and contemporary melodies.', priceBadge: 'from ₹3,000' },
    { n: '07', title: 'Pre-Wedding & Save-the-Date', telugu: 'సేవ్ ది డేట్ సినిమాటిక్ వీడియో', desc: 'Romantic couple teaser film shot at scenic locations, edited with slow-motion color grading and custom titles for invitations.', priceBadge: 'from ₹5,000' },
  ],
  'albums-flex': [
    { n: '01', title: 'Karizma Album Design & Print', telugu: 'కరిజ్మా 12×36 ఆల్బమ్ డిజైన్', desc: 'India\'s most beloved wedding album. Custom 12×36, 12×30 and 12×24 spreads printed on high-density Fine Art paper with seamless panoramic binding.', priceBadge: 'from ₹9,500' },
    { n: '02', title: 'Flush Mount Lay-Flat Album', telugu: 'ఫ్లష్ మౌంట్ ఆల్బమ్', desc: 'Photos mounted flush with page edges — 100% lay-flat with no middle gutter cut. Built on rigid composite core sheets to last for generations.', priceBadge: 'from ₹7,500' },
    { n: '03', title: 'Crystal Acrylic Glass 3D Album', telugu: 'క్రిస్టల్ అక్రిలిక్ గ్లాస్ ఆల్బమ్', desc: 'Ultra-modern 4mm diamond-polished acrylic glass cover that makes the couple\'s portrait glow with 3D depth. The ultimate luxury statement.', priceBadge: 'from ₹9,000' },
    { n: '04', title: 'Royal Velvet Touch Hardcover', telugu: 'రాయల్ వెల్వెట్ సిల్క్ ఆల్బమ్', desc: 'Opulent velvet fabric hardcover with embossed gold/silver foil typography. Soft feather touch with scuff-free anti-scratch matte lamination.', priceBadge: 'from ₹8,500' },
    { n: '05', title: 'Embossed Leatherette Box Album', telugu: 'లెదరెట్ బాక్స్ ఆల్బమ్', desc: 'Genuine or vegan leather bound album nestled in a matching custom leatherette presentation case with magnetic closure.', priceBadge: 'from ₹8,700' },
    { n: '06', title: 'Wedding Flex & Mandap Banner', telugu: 'వెడ్డింగ్ ఫ్లెక్స్ & మండపం బ్యానర్', desc: 'Large-format Telugu wedding entrance flex banners (10×8 ft, 12×10 ft) with traditional gold motifs, Lord Balaji/floral borders, ready to print.', priceBadge: 'from ₹1,500' },
    { n: '07', title: 'Roadside Hoarding Design', telugu: 'హోర్డింగ్ డిజైన్ (40×20 ft)', desc: 'Grand highway and city hoarding designs up to 40×20 ft with high-DPI vector portraits, wedding date details, and festive decorations.', priceBadge: 'from ₹3,500' },
    { n: '08', title: 'Welcome Standees & Cutouts', telugu: 'వెల్కమ్ స్టాండీలు & కటౌట్లు', desc: '6×2.5 ft roll-up welcome standees for entrance hallways and life-size couple cutouts for photo booth zones.', priceBadge: 'from ₹1,200' },
    { n: '09', title: 'WhatsApp Video Invitation', telugu: 'ఆహ్వాన పత్రిక & వాట్సాప్ వీడియో', desc: 'Animated Telugu wedding invitation cards and 60-second video invites with devotional audio, auspicious Muhurtham times, and venue map links.', priceBadge: 'from ₹1,800' },
    { n: '10', title: 'Duplicate Pocket Parent Albums', telugu: 'పేరెంట్స్ మినీ ఆల్బమ్స్', desc: 'Mini replica photobooks of the main wedding album to gift parents and in-laws. Identical layouts in an easy-to-carry format.', priceBadge: 'from ₹2,500' },
  ]
};

const ServiceCard = ({ service, index }) => (
  <ScrollReveal delay={index * 60} className="service-card-v2 glass-3d glow-border">
    <div className="card-accent-line" />
    <span className="card-number">{service.n}</span>
    <div className="flex justify-between items-start gap-2">
      <h3 style={{ margin: 0 }}>{service.title}</h3>
      {service.priceBadge && <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full whitespace-nowrap font-mono">{service.priceBadge}</span>}
    </div>
    <span className="telugu-label">{service.telugu}</span>
    <p>{service.desc}</p>
    <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
      <a href="/order" className="btn btn-gold-3d text-xs py-2 px-3 font-bold flex-1 text-center">
        Order Service →
      </a>
      <a 
        href={`https://wa.me/919876543210?text=${encodeURIComponent(`నమస్కారం! నేను ${service.title} (${service.telugu}) గురించి తెలుసుకోవాలనుకుంటున్నాను.`)}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="btn btn-outline text-xs py-2 px-3 flex items-center justify-center text-[#25D366] border-[#25D366]/40 hover:bg-[#25D366]/15"
        title="WhatsApp Enquiry"
      >
        WhatsApp
      </a>
    </div>
  </ScrollReveal>
);


const Services = () => {
  const { content } = useContent();
  const [activeTab, setActiveTab] = useState('photo-editing');
  const sectionRefs = useRef({});

  const servicesHeroImage = content?.global?.siteImages?.servicesHeroImage || 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=2000';

  const scrollToSection = (id) => {
    setActiveTab(id);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="services-page">
      {/* Header */}
      <div className="page-hero parallax-bg" style={{ backgroundImage: `url('${servicesHeroImage}')`, backgroundBlendMode: 'overlay' }}>
        <ScrollReveal>
          <h1 className="text-gradient font-serif">Post-Production Services</h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>20+ premium editing, album printing, and design services — tailored for Andhra Pradesh events and studios.</p>
        </ScrollReveal>
      </div>

      {/* Sticky Tab Navigation */}
      <div className="services-nav">
        {CATEGORIES.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`services-nav-btn ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Service Categories */}
      <div className="container section" style={{ minHeight: '50vh' }}>
        {CATEGORIES.map(({ id, label }) => {
          if (activeTab !== id) return null;
          
          if (id === 'packages') {
            return (
              <div key={id} className="service-category">
                <KolamDivider />
                <PackageSection />
              </div>
            );
          }

          const items = SERVICES[id];
          return (
            <div key={id} className="service-category">
              <KolamDivider />
              <ScrollReveal>
                <h2 className="text-gradient font-serif mb-4" style={{ textAlign: 'center' }}>{label}</h2>
              </ScrollReveal>
              <div className="grid grid-2">
                {items.map((s, i) => <ServiceCard key={`${id}-${i}`} service={s} index={i} />)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Journey Timeline */}
      <div className="bg-darker section">
        <div className="container">
          <ServiceTimeline />
        </div>
      </div>

      {/* CTA */}
      <div className="container pb-6 text-center">
        <KolamDivider />
        <ScrollReveal>
          <h2 className="text-gradient font-serif mb-4">Ready to elevate your memories?</h2>
          <a href="/order" className="btn btn-gold-3d px-8 py-3.5 font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] inline-flex items-center gap-2">
            Start Your Custom Order <ArrowRight size={16} />
          </a>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Services;
