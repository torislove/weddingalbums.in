import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Flipbook from '../components/Flipbook';
import MockWhatsApp from '../components/MockWhatsApp';
import { UploadCloud, Palette, Monitor, Truck, X, Check, Heart } from 'lucide-react';
import PackageSection from '../components/PackageSection';
import LazyImage from '../components/LazyImage';
import { useContent } from '../context/ContentContext';
import { useT } from '../context/LanguageContext';
import './B2C.css';

const B2C = () => {
  const t = useT();
  const { content } = useContent();
  const [selectedImage, setSelectedImage] = useState(null);

  const b2cHeroImage = content?.global?.siteImages?.b2cHeroImage;
  const galleryImages = content?.global?.siteImages?.b2cGalleryImages || [
    { src: '/images/prewedding.jpg', alt: 'Wedding Couple' },
    { src: '/images/mangalya-dharana.png', alt: 'Rings' },
    { src: '/images/cinematic.jpg', alt: 'Venue' },
    { src: '/images/weddingalbums-layflat-album.png', alt: '180° Lay-Flat Album Spread' },
    { src: '/images/bride-polished.jpg', alt: 'Details' },
    { src: '/images/saptapadi.png', alt: 'Decor' },
  ];

  const flipbookImages = content?.global?.siteImages?.b2cFlipbookImages || [
    '/images/weddingalbums-talambralu.png',
    '/images/saptapadi.png',
    '/images/bride-polished.jpg',
    '/images/bridal.jpg'
  ];

  return (
    <div className="b2c-page">
      
      {/* Ambient Neon Glows */}
      <div className="b2c-ambient-1"></div>
      <div className="b2c-ambient-2"></div>

      {/* Hero Section */}
      <section className="b2c-hero" style={b2cHeroImage ? { backgroundImage: `url('${b2cHeroImage}')`, backgroundBlendMode: 'overlay' } : {}}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <div className="b2c-badge animate-pulse" style={{ backgroundColor: 'var(--brand)', color: 'black', fontWeight: 'bold' }}>
            {t('b2c.badge')}
          </div>
          <h1 className="b2c-title">
            {t('b2c.title1')} <br /> {t('b2c.title2')}
          </h1>
          <p className="b2c-subtitle" style={{ fontSize: '1.4rem' }}>
            <span className="telugu-text">{t('b2c.memline')}</span> — {t('b2c.sub')}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
            <Link to="/shop" className="btn btn-gold-3d">
              Explore Storefront & Pricing
            </Link>
            <Link to="/shop" className="btn" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,175,55,0.4)', color: 'var(--brand)' }}>
              Instant Album Builder
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Dynamic Pricing Section */}
      <section className="b2c-pricing-container" style={{ padding: '80px 0', backgroundColor: 'var(--n-950)' }}>
        <PackageSection type="b2c" />
      </section>

      {/* Interactive 3D Proofing */}
      <section className="b2c-interactive-section">
        <div className="b2c-interactive-grid">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="b2c-viewer-container"
          >
             <Flipbook pages={flipbookImages} />
             <div className="b2c-viewer-hint">
               <Monitor size={16} /> {t('b2c.viewer_hint')}
             </div>
          </motion.div>

          <div className="b2c-interactive-content">
            <h2>{t('b2c.3d_title')}</h2>
            <p>
              {t('b2c.3d_desc')}
            </p>
            <ul className="b2c-feature-list">
              {[t('b2c.3d_f1'), t('b2c.3d_f2'), t('b2c.3d_f3')].map((item, i) => (
                <li key={i}>
                  <div className="b2c-check"><Check size={16}/></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </section>

      {/* The Process */}
      <section className="b2c-process-section">
        <div className="b2c-process-header">
          <h2>{t('b2c.how_title')}</h2>
          <p className="b2c-subtitle">{t('b2c.how_sub')}</p>
        </div>

        <div className="b2c-process-grid">
          {[
            { icon: <UploadCloud size={32}/>, title: t('b2c.step1_t'), desc: t('b2c.step1_d') },
            { icon: <Palette size={32}/>, title: t('b2c.step2_t'), desc: t('b2c.step2_d') },
            { icon: <Monitor size={32}/>, title: t('b2c.step3_t'), desc: t('b2c.step3_d') },
            { icon: <Truck size={32}/>, title: t('b2c.step4_t'), desc: t('b2c.step4_d') }
          ].map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.15 }}
              className="b2c-process-card"
            >
              <div className="b2c-process-icon">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Album Quality & Sheets Explanation */}
      <section className="b2c-quality-explanation">
        <div className="b2c-quality-header">
          <h2>{t('b2c.quality_title')} <br/><span className="telugu-text" style={{ fontSize: '1.2rem', marginTop: '10px' }}>{t('b2c.quality_sheets')}</span></h2>
          <p className="b2c-subtitle">{t('b2c.quality_sub')}</p>
        </div>

        <div className="b2c-quality-grid">
          <div className="b2c-quality-text">
            <h3>{t('b2c.design_title')}</h3>
            <p>{t('b2c.design_pre')}<strong>{t('b2c.design_strong')}</strong>{t('b2c.design_post')}</p>
          </div>
          
          <div className="b2c-sheet-types">
            <motion.div className="b2c-sheet-card" whileHover={{ scale: 1.02 }}>
              <Heart className="b2c-sheet-icon" />
              <h4>{t('b2c.sheet1_t')}</h4>
              <p>{t('b2c.sheet1_d')}</p>
            </motion.div>
            <motion.div className="b2c-sheet-card" whileHover={{ scale: 1.02 }}>
              <Heart className="b2c-sheet-icon" />
              <h4>{t('b2c.sheet2_t')}</h4>
              <p>{t('b2c.sheet2_d')}</p>
            </motion.div>
            <motion.div className="b2c-sheet-card" whileHover={{ scale: 1.02 }}>
              <Heart className="b2c-sheet-icon" />
              <h4>{t('b2c.sheet3_t')}</h4>
              <p>{t('b2c.sheet3_d')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="b2c-gallery-section">
        <div className="b2c-gallery-header">
          <h2>{t('b2c.gallery_title')}</h2>
          <p className="b2c-subtitle">{t('b2c.gallery_sub')}</p>
        </div>
        
        <div className="b2c-masonry">
          {galleryImages.map((img, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="b2c-masonry-item"
              onClick={() => setSelectedImage(img.src || img.image)}
            >
                <LazyImage noWrap src={img.src || img.image} alt={img.alt || img.title || img.caption || 'Portfolio image'} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* WhatsApp Invites */}
      <section className="b2c-interactive-section" style={{ paddingBottom: '160px' }}>
        <div className="b2c-interactive-grid">
          <div className="b2c-interactive-content">
            <h2>{t('b2c.digital_title')}</h2>
            <p>
              {t('b2c.digital_desc')}
            </p>
            <Link to="/contact" className="btn btn-gold-3d" style={{ marginTop: '20px' }}>
              {t('b2c.digital_cta')}
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
             <MockWhatsApp />
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="b2c-lightbox" onClick={() => setSelectedImage(null)}>
          <button className="b2c-lightbox-close" onClick={() => setSelectedImage(null)} aria-label="Close">
             <X size={24} />
          </button>
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            src={selectedImage} 
            alt="Fullscreen" 
            className="b2c-lightbox-img" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
      
    </div>
  );
};

export default B2C;
