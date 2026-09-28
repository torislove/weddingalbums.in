import React from 'react';
import ScrollReveal from '../ScrollReveal';

const PageHero = (props) => {
  const {
    eyebrow = "✦ 100% IN-HOUSE PRODUCTION ✦",
    title = "The Cinematic Engine",
    subtitle = "We are not just photographers. We are a full-scale cinematic production house.",
    bgImage = "/kalamkari-bg.jpg"
  } = props;

  return (
    <div className="page-hero" style={{ backgroundImage: `url('${bgImage}')` }}>
      <ScrollReveal>
        <div className="hero-eyebrow" style={{ textAlign: 'center' }}>{eyebrow}</div>
        <h1 className="text-gradient font-serif">{title}</h1>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
          {subtitle}
        </p>
      </ScrollReveal>
    </div>
  );
};

export default PageHero;
