import React from 'react';
import { Link } from 'react-router-dom';
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from 'react-compare-slider';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, SlidersHorizontal } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import './InteractiveBeforeAfter.css';

const DEFAULT_CHECKLIST = [
  {
    title: 'Dual-Frequency Texture Separation',
    description: 'We separate color tone from micro-pores, eliminating blemishes while retaining authentic natural skin texture.'
  },
  {
    title: '22K/24K Gold & Diamond Specular Glow',
    description: 'Dynamic dodge-and-burn brings out crystalline facets on temple necklaces, Vadanam, and Maang Tikka.'
  },
  {
    title: 'Authentic Haldi & Sindoori Color Science',
    description: 'Neutralizing ugly fluorescent/stage yellow tints while preserving the sacred warm radiance of Telugu bridal hues.'
  },
  {
    title: 'Pure Kanjeevaram Silk & Zari Vibrancy',
    description: 'Precision selective masking recovers rich crimson, mustard, and royal emerald zari weave reflections.'
  },
  {
    title: 'Fatigue Correction & Catchlight Polishing',
    description: 'Gentle sclera clearing and natural sparkle enhancements after grueling 12-hour wedding ceremonies.'
  },
  {
    title: 'Mandap Background De-Cluttering',
    description: 'Painstaking clone-stamping to eliminate stray audio cables, plastic bottles, and harsh background shadows.'
  }
];

const InteractiveBeforeAfter = ({
  eyebrow = '✦ 100% IN-HOUSE RETOUCHING EXCELLENCE ✦',
  title = 'The Art of Telugu Wedding Retouching',
  subtitle = 'Drag the gold slider below to see the difference between a raw camera capture and our master color-graded royal finish.',
  rawImage = '/images/bride-raw.jpg',
  polishedImage = '/images/bride-polished.jpg',
  rawLabel = 'RAW Unedited (DSLR Sensor)',
  polishedLabel = 'Master Polished (22K Gold Luster)',
  checklist = DEFAULT_CHECKLIST,
  ctaText = 'Book Retouching Consultation',
  ctaLink = '/order'
}) => {
  const activeChecklist = Array.isArray(checklist) && checklist.length > 0 
    ? checklist.filter(item => !item.isHidden)
    : DEFAULT_CHECKLIST;

  return (
    <section className="iba-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center iba-header">
          <ScrollReveal>
            <div className="iba-eyebrow">
              {eyebrow}
            </div>
            <h2 className="iba-title font-serif text-gradient">
              {title}
            </h2>
            <p className="iba-subtitle">
              {subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* 2-Column Content Grid */}
        <div className="iba-grid">
          {/* Left: Interactive Compare Slider */}
          <ScrollReveal delay={100}>
            <div className="iba-slider-wrap">
              <span className="iba-badge-raw">{rawLabel}</span>
              <span className="iba-badge-polished">{polishedLabel}</span>
              
              <div className="iba-slider-container">
                <ReactCompareSlider
                  itemOne={
                    <ReactCompareSliderImage 
                      src={rawImage} 
                      alt="Raw unretouched bride" 
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage 
                      src={polishedImage} 
                      alt="Master retouched bride" 
                    />
                  }
                  position={50}
                  handle={
                    <ReactCompareSliderHandle
                      buttonStyle={{
                        backdropFilter: 'blur(10px)',
                        background: 'linear-gradient(135deg, var(--brand) 0%, #AA7C11 100%)',
                        border: '2px solid var(--paper)',
                        color: '#000000',
                        boxShadow: '0 0 20px rgba(212, 175, 55, 0.7)'
                      }}
                      linesStyle={{
                        color: 'var(--brand)',
                        width: 2
                      }}
                    />
                  }
                />
              </div>

              <div className="iba-slider-hint">
                <SlidersHorizontal size={13} className="text-[var(--brand)]" />
                <span>Drag slider left / right to compare</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Technical Explanation & Ritual Checklist */}
          <div className="iba-content">
            <ScrollReveal delay={200}>
              <div className="iba-content-eyebrow font-serif">Why Cheap Automated AI Filters Fail</div>
              <h3 className="iba-content-title font-serif">
                Hand-Crafted Mastery vs. Generic One-Click Presets
              </h3>
              <p className="iba-content-desc">
                Telugu wedding lighting combines heavy LED par cans, sacred holy fire smoke, and fluorescent mandap halogens. Our 20-member studio team hand-grades every portrait using calibrated EIZO ColorEdge monitors to deliver lifelike skin warmth and jewel-tone fidelity.
              </p>

              {/* 6-Point Checklist */}
              <div className="iba-checklist">
                {activeChecklist.map((item, idx) => (
                  <div key={idx} className="iba-check-item">
                    <CheckCircle2 size={18} className="iba-check-icon" />
                    <div className="iba-check-body">
                      <div className="iba-check-label">{item.title}</div>
                      <div className="iba-check-text">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="iba-actions">
                <Link to={ctaLink} className="btn btn-gold-3d iba-sample-btn">
                  {ctaText} <ArrowRight size={16} />
                </Link>
                <div className="iba-guarantee-note">
                  <ShieldCheck size={16} className="text-[var(--brand)]" />
                  <span>100% Satisfaction Guarantee or Full Re-Edit</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveBeforeAfter;
