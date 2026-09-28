import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';

const TestimonialsCarousel = (props) => {
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const {
    eyebrow = "✦ Client Love",
    title = "Words from Our Couples",
    btnText = "Read All Reviews",
    btnLink = "/testimonials",
    testimonials = []
  } = props;

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="section bg-darker">
      <div className="container">
        <ScrollReveal animation="wipe" className="text-center mb-5">
          <div className="hero-eyebrow">{eyebrow}</div>
          <h2 className="text-gradient font-serif">{title}</h2>
        </ScrollReveal>
        
        {testimonials.length > 0 ? (
          <>
            <ScrollReveal delay={200}>
              <div className="testimonial-carousel">
                {testimonials.map((t, i) => (
                  <div key={i} className={`testimonial-card glass-3d ${i === testimonialIdx ? 'active' : ''}`}>
                    <svg width="40" height="30" viewBox="0 0 40 30" fill="none" style={{ marginBottom: '1.5rem', opacity: 0.4 }}>
                      <path d="M0 30V18C0 8.059 7.163 1.319 21.49 0L22.5 2.7C13.827 4.243 9.49 8.205 9.49 14.58H15V30H0ZM25 30V18C25 8.059 32.163 1.319 46.49 0L47.5 2.7C38.827 4.243 34.49 8.205 34.49 14.58H40V30H25Z" fill="#D4AF37"/>
                    </svg>
                    <p className="font-serif" style={{ fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--text-soft)', lineHeight: 1.8, marginBottom: '2rem' }}>
                      "{t.quote}"
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h4 style={{ color: 'white' }}>{t.name}</h4>
                        <span style={{ color: 'var(--color-secondary)', fontSize: '0.85rem' }}>{t.event}</span>
                      </div>
                      <div style={{ color: 'var(--color-secondary)', fontSize: '1.2rem', letterSpacing: '3px' }}>★★★★★</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="testimonial-dots">
                {testimonials.map((_, i) => (
                  <button key={i} className={`dot ${i === testimonialIdx ? 'active' : ''}`} onClick={() => setTestimonialIdx(i)} />
                ))}
              </div>
            </ScrollReveal>
          </>
        ) : (
          <div className="text-center text-muted">No testimonials available.</div>
        )}

        <div className="text-center mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
          <ScrollReveal delay={400}><Link to={btnLink} className="btn btn-outline">{btnText}</Link></ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
