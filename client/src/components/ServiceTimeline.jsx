import React from 'react';
import ScrollReveal from './ScrollReveal';

const steps = [
  { number: '01', title: 'Consultation', desc: 'We discuss your vision, venue, rituals, and preferences.' },
  { number: '02', title: 'Pre-Event Shoot', desc: 'Engagement or pre-wedding shoot to build comfort and rapport.' },
  { number: '03', title: 'Event Day', desc: 'Full cinematic coverage — every ritual, every emotion, every frame.' },
  { number: '04', title: 'Post-Production', desc: 'Expert editing, color grading, retouching, and album design.' },
  { number: '05', title: 'Delivery', desc: 'Premium digital gallery, USB, album, and flex prints delivered.' },
];

const ServiceTimeline = () => (
  <div style={{ padding: '4rem 0' }}>
    <ScrollReveal>
      <h2 className="text-gradient font-serif text-center mb-5">Our Journey Together</h2>
    </ScrollReveal>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '3rem' }}>
      {/* Vertical Line */}
      <div style={{
        position: 'absolute',
        left: '1.2rem',
        top: '1.5rem',
        bottom: '1.5rem',
        width: '2px',
        background: 'linear-gradient(to bottom, var(--color-secondary), var(--color-primary))',
        borderRadius: '2px',
      }} />

      {steps.map((step, idx) => (
        <ScrollReveal key={idx} delay={idx * 120} style={{ display: 'flex', gap: '2rem', padding: '1.5rem 0', alignItems: 'flex-start' }}>
          {/* Step circle */}
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'white',
            boxShadow: '0 0 0 4px rgba(212,175,55,0.15)',
            position: 'relative',
            zIndex: 2,
          }}>
            {idx + 1}
          </div>
          {/* Content */}
          <div className="glass-3d" style={{ padding: '1.5rem 2rem', flex: 1 }}>
            <span style={{ color: 'var(--color-secondary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Step {step.number}</span>
            <h3 style={{ color: 'white', margin: '0.3rem 0 0.6rem' }}>{step.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{step.desc}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </div>
);

export default ServiceTimeline;
