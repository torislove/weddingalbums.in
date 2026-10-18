import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, Sparkles, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import './VisualPillarsShowcase.css';

const DEFAULT_PILLARS = [
  {
    id: 'editing',
    number: '01',
    badge: 'Micro-Pore Preservation · 24K Gold Jewelry Specular Shine',
    title: 'Photo Editing & Album Designing',
    telugu: 'హై-ఎండ్ ఫొటో రీటచింగ్ & ఆల్బమ్ డిజైనింగ్',
    subtitle: 'Pure digital post-production. Our 20-member unit performs high-end frequency separation to preserve authentic skin micro-texture, flawless color grading, and Telugu magazine spread layouts.',
    image: '/images/weddingalbums-talambralu.png',
    features: [
      'Natural skin retouching eliminating blemishes while preserving authentic micro-pores',
      'Specular highlight boost on 22K/24K temple gold and diamond bridal jewelry',
      'Vibrant color restoration for Kanjeevaram and Dharmavaram silk pattu sarees',
      'Mandap venue cleanup: removal of distracting cables, clutter & harsh shadows'
    ],
    ctaText: 'Browse Photo Editing in Store',
    ctaLink: '/shop?tab=editing',
    tag: 'Batch RAW Discounts for Studios'
  },
  {
    id: 'albums',
    number: '02',
    badge: '100% Lay-Flat Binding · Non-Tearable Archival Core',
    title: 'Royal Karizma & Lay-Flat Albums (Print & Bind)',
    telugu: 'కరిజ్మా & లే-ఫ్లాట్ వెడ్డింగ్ ఆల్బమ్స్ ప్రింటింగ్',
    subtitle: 'End-to-end luxury heirloom volumes printed on European digital presses with archival inks guaranteed to retain rich color fidelity for 100+ years.',
    image: '/images/luxury-album-craftsmanship.jpg',
    features: [
      '12×36 & 14×40 Royal Panoramic spreads with seamless zero-gutter binding',
      '4mm diamond-polished Crystal Acrylic 3D glass and Italian Leatherette covers',
      'Plush Royal Velvet Touch fabric covers with gold foil typography',
      'Non-Tearable (NT) waterproof synthetic composite core sheets (₹0 standard)'
    ],
    ctaText: 'Configure & Price Albums',
    ctaLink: '/shop?tab=albums',
    tag: 'AP & Telangana #1 Choice'
  },
  {
    id: 'video',
    number: '03',
    badge: 'Netflix-Grade Color Grading · Licensed Telugu Audio',
    title: '4K Cinematic Wedding Films & Video Services',
    telugu: '4K సినిమాటిక్ వీడియో ఎడిటింగ్ & రీల్స్',
    subtitle: 'Story-driven post-production crafted specifically for Telugu rituals, highlighting vows, emotional moments, and family traditions.',
    image: '/images/cinematic-video-suite.jpg',
    features: [
      'Multi-camera ceremony synchronization (Talambralu, Mangala Snanam, Jeelakarra)',
      'Cinematic LUT-based warm golden color grading & background noise reduction',
      'Audio mixing with licensed Mangala Vaadhyam, classical & trending Telugu scores',
      '5-Pack viral 9:16 vertical Instagram Reels & YouTube Shorts included'
    ],
    ctaText: 'Explore Video Packages',
    ctaLink: '/shop?tab=video',
    tag: 'Rapid 48-Hour Rush Available'
  },
  {
    id: 'flex',
    number: '04',
    badge: 'High-Res Event Media · Custom Dimensions Per Sq.Ft',
    title: 'Venue Flex & Large Format Printing of All Sizes',
    telugu: 'వెడ్డింగ్ ఫ్లెక్స్ & రోల్-అప్ స్టాండీస్',
    subtitle: 'From grand mandap entrance banners to stage backdrops and welcome roll-up standees. Order standard sizes or custom dimensions calculated instantly per square foot.',
    image: '/images/opt/weddingalbums-home-herow1600.webp',
    features: [
      'Standard sizes: 6×3 ft Roll-up Standee, 10×8 ft Mandap, 20×10 ft Stage Backdrop',
      'Interactive Custom Dimensions Calculator (any Width ft × Height ft)',
      'Heavy-duty 440 GSM blackout matte flex and eco-solvent cloth canvas',
      'Brass eyelets, reinforced hems, and aluminum retractable stand options'
    ],
    ctaText: 'Order Flex & Custom Sizes',
    ctaLink: '/shop?tab=flex',
    tag: 'Same-Day Dispatch in AP/TG'
  }
];

const VisualPillarsShowcase = ({ 
  eyebrow = '✦ COMPLETE IN-HOUSE POST-PRODUCTION SUITE ✦',
  title = 'Crafted with Precision. Delivered with Reverence.',
  subtitle = 'From raw memory cards to museum-grade physical royal albums and cinematic films. Here is what we create for you:',
  pillars = DEFAULT_PILLARS
}) => {
  const activePillars = Array.isArray(pillars) && pillars.length > 0 
    ? pillars.filter(p => !p.isHidden)
    : DEFAULT_PILLARS;

  return (
    <section className="v-pillars-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center v-pillars-header">
          <ScrollReveal>
            <div className="v-pillars-eyebrow">
              {eyebrow}
            </div>
            <h2 className="v-pillars-title font-serif text-gradient">
              {title}
            </h2>
            <p className="v-pillars-subtitle">
              {subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* Pillars Cards */}
        <div className="v-pillars-list">
          {activePillars.map((pillar, idx) => {
            const isReversed = idx % 2 === 1;
            const features = Array.isArray(pillar.features) ? pillar.features : [];

            return (
              <ScrollReveal key={pillar.id || idx} delay={idx * 100}>
                <div className={`v-pillar-card ${isReversed ? 'reversed' : ''}`}>
                  {/* Visual Image Side */}
                  <div className="v-pillar-media">
                    <div className="v-pillar-img-wrap">
                      <img 
                        src={pillar.image} 
                        alt={pillar.title} 
                        className="v-pillar-img" 
                        loading="lazy"
                      />
                      {pillar.tag && (
                        <div className="v-pillar-badge-float">
                          <Zap size={14} className="text-[var(--brand)]" />
                          <span>{pillar.tag}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explanatory Content Side */}
                  <div className="v-pillar-content">
                    <div className="v-pillar-top-meta">
                      <span className="v-pillar-number font-serif">{pillar.number || `0${idx + 1}`}</span>
                      {pillar.badge && <span className="v-pillar-subtag">{pillar.badge}</span>}
                    </div>

                    <h3 className="v-pillar-name font-serif">{pillar.title}</h3>
                    {pillar.telugu && <div className="v-pillar-telugu font-serif">{pillar.telugu}</div>}
                    
                    <p className="v-pillar-desc">{pillar.subtitle}</p>

                    {features.length > 0 && (
                      <ul className="v-pillar-features">
                        {features.map((feat, fIdx) => (
                          <li key={fIdx}>
                            <CheckCircle2 size={16} className="v-feat-check" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {pillar.ctaText && (
                      <div className="v-pillar-action">
                        <Link to={pillar.ctaLink || '/services'} className="btn btn-gold-3d v-pillar-btn">
                          {pillar.ctaText} <ArrowRight size={16} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VisualPillarsShowcase;
