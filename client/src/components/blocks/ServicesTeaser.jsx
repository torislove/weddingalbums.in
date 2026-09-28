import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, Video, BookOpen, Gift } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import TextScramble from '../TextScramble';

const iconMap = {
  Camera,
  Video,
  BookOpen,
  Gift
};

const ServicesTeaser = (props) => {
  const {
    eyebrow = "✦ What We Do",
    title = "Comprehensive Expertise",
    subtitle = "From the first frame to the last page — we cover every moment.",
    btnText = "View All Services",
    btnLink = "/services",
    services = []
  } = props;

  return (
    <section className="section" style={{ background: 'var(--bg-dark)' }}>
      <div className="container">
        <ScrollReveal animation="wipe" className="text-center mb-5">
          <div className="hero-eyebrow">{eyebrow}</div>
          <h2 className="text-gradient font-serif">
            <TextScramble text={title} delay={100} />
          </h2>
          <p className="text-muted mt-2" style={{ maxWidth: '600px', margin: '1rem auto 0' }}>
            {subtitle}
          </p>
        </ScrollReveal>
        <div className="grid grid-4 mt-5">
          {services.map((s, i) => {
            const IconComponent = iconMap[s.icon] || Camera;
            return (
              <ScrollReveal key={i} delay={i * 100}>
                <Link to={s.path || '#'} className="service-tile glass-3d glow-border">
                  <div className="service-tile-icon" style={{ background: `${s.color || '#D4AF37'}20` }}>
                    <IconComponent size={30} color={s.color || '#D4AF37'} />
                  </div>
                  <h3>{s.title}</h3>
                  <p className="text-muted">{s.sub}</p>
                  <span className="tile-arrow">→</span>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
        <div className="text-center mt-5" style={{ display: 'flex', justifyContent: 'center' }}>
          <ScrollReveal delay={400}>
            <Link to={btnLink} className="btn btn-primary">{btnText} <ArrowRight size={16}/></Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ServicesTeaser;
