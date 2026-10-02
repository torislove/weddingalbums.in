import React, { useState, useEffect, useCallback } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { useContent } from '../context/ContentContext';
import './Portfolio.css';

const DEFAULT_ITEMS = [
  { id: 1,  category: 'wedding',      title: 'Sacred Muhurtham',          city: 'Vijayawada',    cityTel: 'విజయవాడ',    tag: 'tag-wedding',    img: 'https://images.unsplash.com/photo-1583089892943-e02e5be26e10?auto=format&fit=crop&q=80&w=900' },
  { id: 2,  category: 'pre-wedding',  title: 'Araku Valley Romance',       city: 'Vizag',         cityTel: 'విశాఖపట్నం', tag: 'tag-prewedding', img: 'https://images.unsplash.com/photo-1506462945848-ac8ea2f609dc?auto=format&fit=crop&q=80&w=900' },
  { id: 3,  category: 'albums',       title: 'Karizma Album Design',       city: 'Guntur',        cityTel: 'గుంటూరు',    tag: 'tag-album',      img: 'https://images.unsplash.com/photo-1544641979-51478546b3f7?auto=format&fit=crop&q=80&w=900' },
  { id: 4,  category: 'wedding',      title: 'Talambralu Ritual',          city: 'Tirupati',      cityTel: 'తిరుపతి',    tag: 'tag-wedding',    img: 'https://images.unsplash.com/photo-1610173827002-62c0f1f1d16c?auto=format&fit=crop&q=80&w=900' },
  { id: 5,  category: 'half-saree',   title: 'Langa Voni Ceremony',        city: 'Rajahmundry',   cityTel: 'రాజమహేంద్రి', tag: 'tag-halfsaree', img: 'https://images.unsplash.com/photo-1605663737330-9b63a9cf3181?auto=format&fit=crop&q=80&w=900' },
  { id: 6,  category: 'birthday',     title: 'Grand 1st Birthday',         city: 'Hyderabad',     cityTel: 'హైదరాబాద్',  tag: 'tag-birthday',   img: 'https://images.unsplash.com/photo-1530103862676-de8892b125f4?auto=format&fit=crop&q=80&w=900' },
  { id: 7,  category: 'wedding',      title: 'Mangala Snanam',             city: 'Kurnool',       cityTel: 'కర్నూలు',    tag: 'tag-wedding',    img: 'https://images.unsplash.com/photo-1595963953457-3f338d381180?auto=format&fit=crop&q=80&w=900' },
  { id: 8,  category: 'pre-wedding',  title: 'RK Beach Golden Hour',       city: 'Vizag',         cityTel: 'విశాఖపట్నం', tag: 'tag-prewedding', img: 'https://images.unsplash.com/photo-1555529733-0e67056058e1?auto=format&fit=crop&q=80&w=900' },
  { id: 9,  category: 'albums',       title: 'Flush Mount Hardcover',      city: 'Vijayawada',    cityTel: 'విజయవాడ',    tag: 'tag-album',      img: 'https://images.unsplash.com/photo-1522715204671-e4aac94a7b7d?auto=format&fit=crop&q=80&w=900' },
  { id: 10, category: 'wedding',      title: 'Bridal Elegance',            city: 'Vizag',         cityTel: 'విశాఖపట్నం', tag: 'tag-wedding',    img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=900' },
  { id: 11, category: 'half-saree',   title: 'Silk Lehenga Portrait',      city: 'Guntur',        cityTel: 'గుంటూరు',    tag: 'tag-halfsaree', img: 'https://images.unsplash.com/photo-1529024502020-3792eb5a54b1?auto=format&fit=crop&q=80&w=900' },
  { id: 12, category: 'corporate',    title: 'Corporate Gala Dinner',      city: 'Tirupati',      cityTel: 'తిరుపతి',    tag: 'tag-corporate',  img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=900' },
  { id: 13, category: 'pre-wedding',  title: 'Horsely Hills Adventure',    city: 'Chittoor',      cityTel: 'చిత్తూరు',   tag: 'tag-prewedding', img: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=900' },
  { id: 14, category: 'albums',       title: 'Wedding Hoarding Design',    city: 'Kurnool',       cityTel: 'కర్నూలు',    tag: 'tag-album',      img: 'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?auto=format&fit=crop&q=80&w=900' },
  { id: 15, category: 'wedding',      title: 'Nischitartham Joy',          city: 'Rajahmundry',   cityTel: 'రాజమహేంద్రి', tag: 'tag-wedding',   img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=900' },
];

const FILTERS = [
  { key: 'all',         label: 'All Work' },
  { key: 'wedding',     label: 'Weddings' },
  { key: 'pre-wedding', label: 'Pre-Wedding' },
  { key: 'half-saree',  label: 'Half Saree' },
  { key: 'birthday',    label: 'Birthdays' },
  { key: 'albums',      label: 'Albums & Flex' },
];

const Portfolio = () => {
  const { content } = useContent();
  const [filter, setFilter]     = useState('all');
  const [lightbox, setLightbox] = useState(null); // index into filtered items

  const ITEMS = content?.global?.siteImages?.portfolioItems || DEFAULT_ITEMS;
  const portfolioHeroImage = content?.global?.siteImages?.portfolioHeroImage || 'https://images.unsplash.com/photo-1544641979-51478546b3f7?auto=format&fit=crop&q=80&w=2000';

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
          <h1 className="text-gradient">Our Portfolio</h1>
          <p className="text-muted">A curated collection of our finest cinematic wedding stories.</p>
        </ScrollReveal>
      </div>

      <div className="container section pt-0 mt-5">
        {/* Filter Tabs */}
        <ScrollReveal>
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Masonry Grid */}
        <div className="masonry-grid" key={filter}>
          {filtered.map((item, idx) => (
            <ScrollReveal key={item.id || idx} delay={(idx % 3) * 100} className="masonry-item glass-3d" onClick={() => setLightbox(idx)}>
              <img src={item.image || item.img} alt={item.title} />
              <div className="masonry-overlay">
                <span className={`tag-pill ${item.tag}`}>{item.category.replace('-', ' ')}</span>
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
              <span className={`tag-pill ${filtered[lightbox].tag}`}>{filtered[lightbox].category.replace('-', ' ')}</span>
              <h3>{filtered[lightbox].title}</h3>
              <p style={{ color: 'var(--color-secondary)' }}>{filtered[lightbox].city} · {filtered[lightbox].cityTel}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Press ← → to navigate · ESC to close</p>
            </div>
          </div>
          <button className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % filtered.length); }}>›</button>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
