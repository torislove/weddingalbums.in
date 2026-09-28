import React from 'react';
import ScrollReveal from '../ScrollReveal';

const RitualsScroll = (props) => {
  const {
    eyebrow = "✦ Cultural Mastery",
    title = "Mastering AP Traditions",
    rituals = []
  } = props;

  return (
    <section className="section bg-darker">
      <div className="container">
        <ScrollReveal animation="wipe" className="text-center mb-5">
          <div className="hero-eyebrow">{eyebrow}</div>
          <h2 className="text-gradient font-serif">{title}</h2>
        </ScrollReveal>
        <div className="rituals-scroll">
          {rituals.map((r, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="ritual-card glass">
                <span className="ritual-number">{String(i + 1).padStart(2, '0')}</span>
                <h4>{r.title}</h4>
                <span className="telugu-text">{r.telugu}</span>
                <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>{r.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RitualsScroll;
