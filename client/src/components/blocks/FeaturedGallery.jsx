import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';

const FeaturedGallery = (props) => {
  const {
    eyebrow = "✦ Our Work",
    title = "Recent Stories",
    btnText = "View All Gallery",
    btnLink = "/portfolio",
    images = []
  } = props;

  return (
    <section className="section" style={{ background: 'var(--bg-dark)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <ScrollReveal animation="wipe">
            <div className="hero-eyebrow" style={{ textAlign: 'left' }}>{eyebrow}</div>
            <h2 className="text-gradient font-serif">{title}</h2>
          </ScrollReveal>
        </div>
        <div className="featured-grid">
          {images.map((imgData, i) => (
            <ScrollReveal key={i} delay={(i + 1) * 100} className={`featured-item glass-3d ${i === 0 ? 'featured-large' : ''}`}>
              <img src={imgData.img} alt={imgData.title} />
              <div className="featured-overlay">
                <span className={`tag-pill tag-${imgData.tag || 'wedding'}`}>{imgData.tag}</span>
                <h4>{imgData.title}</h4>
                <p>{imgData.location}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <div className="text-center mt-5" style={{ display: 'flex', justifyContent: 'center' }}>
          <ScrollReveal delay={400}>
            <Link to={btnLink} className="btn btn-outline">{btnText}</Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGallery;
