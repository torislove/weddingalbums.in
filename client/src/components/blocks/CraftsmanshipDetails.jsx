import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Award, Sparkles, ShieldCheck, Check, ArrowRight, Eye } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import './CraftsmanshipDetails.css';

const DEFAULT_COVERS = [
  {
    id: 'acrylic',
    tag: 'Bestseller',
    title: 'Diamond Beveled Acrylic 3D',
    description: '4mm optical-grade German acrylic glass with laser-polished beveled edges. Unmatched depth and luminescence.',
    image: '/images/luxury-album-craftsmanship.jpg',
    specs: ['Scratch-resistant UV coat', 'Laser precision engraving', 'Seamless wrap-around spine']
  },
  {
    id: 'velvet',
    tag: 'Royal Heritage',
    title: 'Royal Plush Velvet Touch',
    description: 'Ultra-luxurious tactile fabric available in Crimson Maroon, Emerald Green, and Midnight Navy with 24K gold foil stamping.',
    image: '/images/weddingalbums-layflat-album.png',
    specs: ['Heat-embossed monogramming', 'Cushioned hardbound core', 'Non-staining textile shield']
  },
  {
    id: 'leatherette',
    tag: 'Executive',
    title: 'Italian Leatherette & Briefcase',
    description: 'Handcrafted vegan leather album bundled with an identical monogrammed protective hard-shell briefcase box.',
    image: '/images/weddingalbums-home-hero.png',
    specs: ['Magnetic stealth closure', 'Velvet-lined interior cradle', 'Custom brass corner protectors']
  },
  {
    id: 'linen',
    tag: 'Minimalist',
    title: 'Textured Natural Linen',
    description: 'Unbleached natural woven organic linen fabric with blind debossed typography. Understated European luxury aesthetic.',
    image: '/images/family-blessings.png',
    specs: ['100% organic cotton weave', 'Blind deboss stamping', 'Eco-friendly archival binding']
  }
];

const DEFAULT_PAPERS = [
  {
    id: 'metallic',
    tag: 'Ultra Vibrant',
    title: 'Fujifilm Crystal Archive Pearl',
    description: 'Embedded pearlescent crystals deliver a luminous metallic sheen with punchy contrast, perfect for night receptions and jewelry.',
    image: '/images/mangalya-dharana.png',
    specs: ['High-gloss reflective sheen', 'Deep black D-max density', '100+ year fade resistance']
  },
  {
    id: 'silk-matte',
    tag: 'Timeless Elegance',
    title: 'Velvet Silk Museum Matte',
    description: 'Micro-textured satin finish completely eliminating stage-light reflections and finger smudges during family viewing.',
    image: '/images/saptapadi.png',
    specs: ['Zero-glare viewing angle', 'Silky fingerprint-proof coat', 'Soft pastel skin rendition']
  },
  {
    id: 'nt-core',
    tag: 'Indestructible',
    title: 'Non-Tearable (NT) Waterproof Core',
    description: 'Synthetic high-density polymer core sheet impervious to accidental beverage spills, humidity, and enthusiastic kids.',
    image: '/images/weddingalbums-talambralu.png',
    specs: ['100% waterproof composite', 'Resists warping & creasing', 'Rigid 450 GSM sheet thickness']
  },
  {
    id: 'layflat',
    tag: 'Zero-Gutter',
    title: '100% Panoramic Lay-Flat Binding',
    description: 'Patented European hinge mechanism opening completely flat at 180°. Spread big mandap group shots across both pages without seam cutoffs.',
    image: '/images/appagintalu-farewell.png',
    specs: ['Zero center gap gutter loss', 'Continuous 12×36 landscape', 'Reinforced stitch spine']
  }
];

const CraftsmanshipDetails = ({
  eyebrow = '✦ OBSESSIVE ATTENTION TO DETAIL ✦',
  title = 'Anatomy of an Archival Wedding Album',
  subtitle = 'Every volume is precision-assembled by our master bookbinders using archival-grade materials built to outlast generations.',
  covers = DEFAULT_COVERS,
  papers = DEFAULT_PAPERS,
  ctaText = 'View Complete Swatch Kit',
  ctaLink = '/albums'
}) => {
  const [activeTab, setActiveTab] = useState('covers'); // 'covers' | 'papers'

  const activeCovers = Array.isArray(covers) && covers.length > 0 
    ? covers.filter(c => !c.isHidden) 
    : DEFAULT_COVERS;

  const activePapers = Array.isArray(papers) && papers.length > 0 
    ? papers.filter(p => !p.isHidden) 
    : DEFAULT_PAPERS;

  const itemsToDisplay = activeTab === 'covers' ? activeCovers : activePapers;

  return (
    <section className="craft-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center craft-header">
          <ScrollReveal>
            <div className="craft-eyebrow">{eyebrow}</div>
            <h2 className="craft-title font-serif text-gradient">{title}</h2>
            <p className="craft-subtitle">{subtitle}</p>
          </ScrollReveal>
        </div>

        {/* Tab Switcher */}
        <div className="craft-tabs">
          <button 
            type="button"
            className={`craft-tab-btn ${activeTab === 'covers' ? 'active' : ''}`}
            onClick={() => setActiveTab('covers')}
          >
            <Layers size={16} />
            <span>Master Cover Materials ({activeCovers.length})</span>
          </button>
          <button 
            type="button"
            className={`craft-tab-btn ${activeTab === 'papers' ? 'active' : ''}`}
            onClick={() => setActiveTab('papers')}
          >
            <Sparkles size={16} />
            <span>Archival Papers & Binding ({activePapers.length})</span>
          </button>
        </div>

        {/* 4-Item Grid */}
        <div className="craft-grid">
          {itemsToDisplay.map((item, idx) => (
            <ScrollReveal key={item.id || idx} delay={idx * 80}>
              <div className="craft-card">
                <div className="craft-card-media">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="craft-card-img" 
                    loading="lazy" 
                  />
                  {item.tag && <span className="craft-badge-tag">{item.tag}</span>}
                </div>

                <div className="craft-card-body">
                  <h3 className="craft-item-title">{item.title}</h3>
                  <p className="craft-item-desc">{item.description}</p>

                  {Array.isArray(item.specs) && item.specs.length > 0 && (
                    <ul className="craft-spec-list">
                      {item.specs.map((spec, sIdx) => (
                        <li key={sIdx} className="craft-spec-item">
                          <span className="craft-spec-dot"></span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Guarantee Banner Strip */}
        <ScrollReveal delay={250}>
          <div className="craft-guarantee-strip">
            <div className="craft-guarantee-info">
              <div className="craft-guarantee-icon-wrap">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="craft-guarantee-heading">100-Year Color Permanence & Craftsmanship Guarantee</h4>
                <p className="craft-guarantee-text">
                  If your album experiences page delamination, binding failure, or ink fading under normal care, we will reprint and rebind it free of charge.
                </p>
              </div>
            </div>

            <Link to={ctaLink} className="btn btn-gold-3d craft-order-sample-btn">
              {ctaText} <ArrowRight size={15} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CraftsmanshipDetails;
