import React from 'react';
import ScrollReveal from '../ScrollReveal';

const InHouseAdvantage = (props) => {
  const {
    eyebrow = "✦ Andhra's Premium Choice ✦",
    title = "100% In-House Production",
    subtitle = "Unlike other studios that outsource your precious memories to third-party freelancers, we handle your Telugu Inti Pelli completely under one roof. From the first click to the final album delivery, your privacy is protected and your deliverables arrive faster.",
    features = []
  } = props;

  return (
    <section className="section bg-dark">
      <div className="container">
        <ScrollReveal animation="wipe" className="text-center mb-5">
          <div className="hero-eyebrow">{eyebrow}</div>
          <h2 className="text-gradient font-serif">{title}</h2>
          <p className="text-muted mt-3" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem' }}>
            {subtitle}
          </p>
        </ScrollReveal>

        <div className="grid grid-3 mt-5" style={{ gap: '2rem' }}>
          {features.map((feature, i) => (
            <ScrollReveal 
              key={i} 
              delay={i * 100} 
              className="glass-3d p-4 text-center" 
              style={{ 
                borderRadius: '15px', 
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(212,175,55,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>{feature.icon}</div>
              <h4 style={{ color: 'white', marginBottom: '0.8rem', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>{feature.title}</h4>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{feature.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InHouseAdvantage;
