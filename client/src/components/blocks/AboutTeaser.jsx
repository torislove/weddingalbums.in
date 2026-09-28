import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

const AboutTeaser = (props) => {
  const {
    eyebrow = "✦ Our Story",
    title = "More Than Just Photography",
    subtitle = "Founded in Vijayawada over 12 years ago, we set out with one mission: to document Telugu weddings with the cinematic grandeur and cultural reverence they truly deserve.",
    features = [],
    btnText = "Read Our Story",
    btnLink = "/about",
    image = ""
  } = props;

  return (
    <section className="section bg-darker clip-diagonal-down">
      <div className="container">
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '4rem' }}>
          <ScrollReveal className="about-img-wrap">
            <div className="about-img-border" />
            {image && (
              <img
                src={image}
                alt="About Us"
                className="about-img"
              />
            )}
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="hero-eyebrow" style={{ textAlign: 'left', marginBottom: '1rem' }}>{eyebrow}</div>
            <h2 className="text-gradient font-serif mb-4">{title}</h2>
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: 1.9 }}>
              {subtitle}
            </p>
            <ul className="feature-list">
              {features.map((f, i) => (
                <li key={i}><CheckCircle2 color="var(--color-secondary)" size={18} /><span>{f}</span></li>
              ))}
            </ul>
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
              <Link to={btnLink} className="btn btn-outline">{btnText}</Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
