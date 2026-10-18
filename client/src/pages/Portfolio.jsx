import React, { useState, useEffect, useCallback } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { useContent } from '../context/ContentContext';
import LazyImage from '../components/LazyImage';
import { useT } from '../context/LanguageContext';
import './Portfolio.css';

const DEFAULT_ITEMS = [
  { id: 1,  category: 'wedding',      title: 'Sacred Muhurtham',          city: 'Vijayawada',    cityTel: 'విజయవాడ',    tag: 'tag-wedding',    img: '/images/saptapadi.png' },
  { id: 2,  category: 'pre-wedding',  title: 'Araku Valley Romance',       city: 'Vizag',         cityTel: 'విశాఖపట్నం', tag: 'tag-prewedding', img: '/images/prewedding.jpg' },
  { id: 3,  category: 'albums',       title: 'Karizma Album Design',       city: 'Guntur',        cityTel: 'గుంటూరు',    tag: 'tag-album',      img: '/images/weddingalbums-layflat-album.png' },
  { id: 4,  category: 'wedding',      title: 'Talambralu Ritual',          city: 'Tirupati',      cityTel: 'తిరుపతి',    tag: 'tag-wedding',    img: '/images/weddingalbums-talambralu.png' },
  { id: 5,  category: 'half-saree',   title: 'Langa Voni Ceremony',        city: 'Rajahmundry',   cityTel: 'రాజమహేంద్రి', tag: 'tag-halfsaree', img: '/images/mangalya-dharana.png' },
  { id: 6,  category: 'birthday',     title: 'Grand 1st Birthday',         city: 'Hyderabad',     cityTel: 'హైదరాబాద్',  tag: 'tag-birthday',   img: '/images/family-blessings.png' },
  { id: 7,  category: 'wedding',      title: 'Mangala Snanam',             city: 'Kurnool',       cityTel: 'కర్నూలు',    tag: 'tag-wedding',    img: '/images/bride-polished.jpg' },
  { id: 8,  category: 'pre-wedding',  title: 'RK Beach Golden Hour',       city: 'Vizag',         cityTel: 'విశాఖపట్నం', tag: 'tag-prewedding', img: '/images/bride-raw.jpg' },
  { id: 9,  category: 'albums',       title: 'Flush Mount Hardcover',      city: 'Vijayawada',    cityTel: 'విజయవాడ',    tag: 'tag-album',      img: '/images/cover-leatherette-box.jpg' },
  { id: 10, category: 'wedding',      title: 'Bridal Elegance',            city: 'Vizag',         cityTel: 'విశాఖపట్నం', tag: 'tag-wedding',    img: '/images/bridal.jpg' },
  { id: 11, category: 'half-saree',   title: 'Silk Lehenga Portrait',      city: 'Guntur',        cityTel: 'గుంటూరు',    tag: 'tag-halfsaree', img: '/images/weddingalbums-talambralu.png' },
  { id: 12, category: 'corporate',    title: 'Corporate Gala Dinner',      city: 'Tirupati',      cityTel: 'తిరుపతి',    tag: 'tag-corporate',  img: '/images/cinematic-video-suite.jpg' },
  { id: 13, category: 'pre-wedding',  title: 'Horsely Hills Adventure',    city: 'Chittoor',      cityTel: 'చిత్తూరు',   tag: 'tag-prewedding', img: '/images/prewedding.jpg' },
  { id: 14, category: 'albums',       title: 'Wedding Hoarding Design',    city: 'Kurnool',       cityTel: 'కర్నూలు',    tag: 'tag-album',      img: '/images/luxury-album-craftsmanship.jpg' },
  { id: 15, category: 'wedding',      title: 'Nischitartham Joy',          city: 'Rajahmundry',   cityTel: 'రాజమహేంద్రి', tag: 'tag-wedding',   img: '/images/mangalya-dharana.png' },
];

const FILTERS = [
  { key: 'all',         tKey: 'portfolio.filter.all' },
  { key: 'wedding',     tKey: 'portfolio.filter.wedding' },
  { key: 'pre-wedding', tKey: 'portfolio.filter.prewedding' },
  { key: 'half-saree',  tKey: 'portfolio.filter.halfsaree' },
  { key: 'birthday',    tKey: 'portfolio.filter.birthday' },
  { key: 'albums',      tKey: 'portfolio.filter.albums' },
];

const Portfolio = () => {
  const t = useT();
  const catLabel = (cat) => t('portfolio.filter.' + String(cat || '').replace(/-/g, '').split(' ')[0]);
  const { content } = useContent();
  const [filter, setFilter]     = useState('all');
  const [lightbox, setLightbox] = useState(null); // index into filtered items

  const ITEMS = content?.global?.siteImages?.portfolioItems || DEFAULT_ITEMS;
  const portfolioHeroImage = content?.global?.siteImages?.portfolioHeroImage || '/images/weddingalbums-layflat-album.png';

  const filtered = filter === 'all' ? ITEMS : ITEMS.filter(i => i.category === filter);

  // Keyboard navigation
  const handleKey = useCallback((e) => {
    if (lightbox === null) return;
    if (e.key === 'Escape') setLightbox(null);
    if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % filtered.length);
    if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + filtered.length) % filtered.length);
  }, [lightbox, filtered.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  return (
    <div className="portfolio-page">
      {/* Header */}
      <div className="page-hero parallax-bg" style={{ backgroundImage: `url('${portfolioHeroImage}')`, backgroundBlendMode: 'overlay' }}>
        <ScrollReveal>
          <h1 className="text-gradient">{t('portfolio.title')}</h1>
          <p className="text-muted">{t('portfolio.sub')}</p>
        </ScrollReveal>
      </div>

      <div className="container section pt-0 mt-5">
        {/* Filter Tabs */}
        <ScrollReveal>
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                {t(f.tKey)}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Masonry Grid */}
        <div className="masonry-grid" key={filter}>
          {filtered.map((item, idx) => (
            <ScrollReveal key={item.id || idx} delay={(idx % 3) * 100} className="masonry-item glass-3d" onClick={() => setLightbox(idx)}>
              <LazyImage noWrap src={item.image || item.img} alt={item.title} />
              <div className="masonry-overlay">
                <span className={`tag-pill ${item.tag}`}>{catLabel(item.category)}</span>
                <h3>{item.title}</h3>
                <p>{item.city} <span className="telugu-text" style={{ display: 'inline', marginLeft: '8px', fontSize: '0.75rem' }}>{item.cityTel}</span></p>
                <span className="zoom-icon">⊕</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <button className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + filtered.length) % filtered.length); }}>‹</button>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <img src={filtered[lightbox].image || filtered[lightbox].img} alt={filtered[lightbox].title} className="lightbox-img" />
            <div className="lightbox-caption">
              <span className={`tag-pill ${filtered[lightbox].tag}`}>{catLabel(filtered[lightbox].category)}</span>
              <h3>{filtered[lightbox].title}</h3>
              <p style={{ color: 'var(--color-secondary)' }}>{filtered[lightbox].city} · {filtered[lightbox].cityTel}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{t('portfolio.lightbox_hint')}</p>
            </div>
          </div>
          <button className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % filtered.length); }}>›</button>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
