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
    { n: '01', title: 'Pelli & Event Edits', telugu: 'పెళ్ళి ఫొటో ఎడిటింగ్', desc: 'Send us the raw photos from your Telugu wedding, and our expert team will deliver beautifully color-corrected and retouched images for your digital galleries and prints.', priceBadge: 'from ₹99/photo' },
    { n: '02', title: 'High-End Retouching', telugu: 'ఫొటో రీటచింగ్', desc: 'Advanced skin smoothing, blemish removal, eye brightening, and overall tonal perfection on your selected photographs. Each image is carefully crafted to look stunning.', priceBadge: 'from ₹199/photo' },
    { n: '03', title: 'Cinematic Color Grading', telugu: 'కలర్ గ్రేడింగ్', desc: 'Professional LUT-based cinematic color grading applied to all your photos. We use industry-standard tools to achieve the rich, warm, golden look synonymous with AP weddings.', priceBadge: 'from ₹99/photo' },
    { n: '04', title: 'Background Replacement', telugu: 'బ్యాక్‌గ్రౌండ్ రీప్లేస్మెంట్', desc: 'Replace any distracting background with a gorgeous palace, garden, or artistic backdrop using high-end compositing. Ideal for studio-quality results from any location.', priceBadge: 'from ₹299/photo' },
    { n: '05', title: 'Kids & Birthday Edits', telugu: 'పుట్టినరోజు ఎడిటింగ్', desc: 'Vibrant and fun color grading for half-sarees, dhoti ceremonies, and 1st birthdays. We highlight the joy and colors of the event perfectly.', priceBadge: 'from ₹99/photo' },
  ],
  'video-editing': [
    { n: '01', title: 'Cinematic Wedding Film', telugu: '4K సినిమాటిక్ ఫిల్మ్ ఎడిటింగ్', desc: 'Our flagship service. Upload your raw footage, and we will edit a fully cinematic, 4K story-driven wedding film with professional voiceover and licensed music score.', priceBadge: 'from ₹15,000' },
    { n: '02', title: 'Traditional Long-Form Video', telugu: 'సాంప్రదాయ వీడియో ఎడిటింగ్', desc: 'A full-length documentation of every ritual and family event cut seamlessly. We sync multi-camera setups covering Agni Sakshi, Saptapadi, and Talambralu.', priceBadge: 'from ₹8,000' },
    { n: '03', title: 'Cinematic Teaser (5 min)', telugu: 'సినిమాటిక్ టీజర్', desc: 'A high-energy, 3–5 minute highlight reel delivered rapidly. Perfect for sharing immediately on Instagram and WhatsApp with your family and guests.', priceBadge: 'from ₹8,000' },
    { n: '04', title: 'Same-Day Edit (SDE) Film', telugu: 'సేమ్ డే ఎడిట్', desc: 'Need a rush edit? Send us footage from the morning, and we will deliver a 5-minute highlights film edited and ready to be screened at your reception the same evening.', priceBadge: 'from ₹12,000' },
    { n: '05', title: 'Instagram Reels & Shorts', telugu: 'ఇన్‌స్టాగ్రామ్ రీల్స్', desc: 'Trendy, music-synced 30–90 second vertical reels optimized for social media. Delivered with trending audio and professional color grading — ready to go viral.', priceBadge: 'from ₹2,500' },
    { n: '06', title: 'Audio Mixing & Score', telugu: 'ఆడియో మిక్సింగ్', desc: 'Professional audio mixing and music score selection for your wedding film. We work with licensed classical, Telugu devotional, and contemporary tracks.', priceBadge: 'from ₹3,000' },
  ],
  'albums-flex': [
    { n: '01', title: 'Flush Mount / Hardcover', telugu: 'ఫ్లష్ మౌంట్ ఆల్బమ్', desc: 'The most premium album format. Photos are mounted flush with the page edge — no borders, no margins — creating a seamless, stunning visual experience. Hardcover bound and built to last.', priceBadge: 'from ₹7,500' },
    { n: '02', title: 'Karizma Album Design', telugu: 'కరిజ్మా ఆల్బమ్ డిజైన్', desc: 'India\'s most popular premium wedding album brand. We design custom 12×36 and 24×36 Karizma albums with artistic layouts, printed on Fine Art paper. Each spread is a work of art.', priceBadge: 'from ₹10,000' },
    { n: '03', title: 'Wedding Flex / Banner Design', telugu: 'వెడ్డింగ్ ఫ్లెక్స్ డిజైన్', desc: 'Stunning large-format Telugu wedding flex banners for the venue entrance, mandap backdrop, and stage. Traditional AP motifs, gold borders, and vibrant design ready for print.', priceBadge: 'from ₹1,500' },
    { n: '04', title: 'Hoarding Design (Large Format)', telugu: 'హోర్డింగ్ డిజైన్', desc: 'Grand roadside hoarding designs up to 40×20 ft. We create majestic, high-resolution AP-style wedding hoardings with the couple\'s portrait, wedding details, and traditional decorative elements.', priceBadge: 'from ₹4,500' },
    { n: '05', title: 'Digital Album Design', telugu: 'డిజిటల్ ఆల్బమ్ డిజైన్', desc: 'A beautifully designed PDF digital album with premium typography and layout — shared via a private link with your family worldwide, ready for printing at any time.', priceBadge: 'from ₹3,000' },
    { n: '06', title: 'Invitation & WhatsApp Video', telugu: 'ఆహ్వాన పత్రిక', desc: 'Custom digital and print wedding invitation card design with Telugu typography. Includes both traditional temple-style and modern minimalist designs for WhatsApp.', priceBadge: 'from ₹2,500' },
  ]
};

const ServiceCard = ({ service, index }) => (
  <ScrollReveal delay={index * 80} className="service-card-v2 glass-3d glow-border">
    <div className="card-accent-line" />
    <span className="card-number">{service.n}</span>
    <div className="flex justify-between items-start gap-2">
      <h3 style={{ margin: 0 }}>{service.title}</h3>
      {service.priceBadge && <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full whitespace-nowrap">{service.priceBadge}</span>}
    </div>
    <span className="telugu-label">{service.telugu}</span>
    <p>{service.desc}</p>
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
          <p className="text-muted mb-5">Upload your raw footage and let our design team craft a masterpiece.</p>
          <a href="/b2c" className="btn btn-primary">Start Your Order <ArrowRight size={16} /></a>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Services;
