import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import KolamDivider from '../KolamDivider';

const CTABanner = (props) => {
  const {
    eyebrow = "✦ Start Your Story ✦",
    titlePart1 = "Book Your Date",
    titlePart2 = "Before It's Gone",
    subtitle = "Our calendar fills up quickly, especially for wedding season. Reach out today to check your date availability.",
    btn1Text = "Request a Quote",
    btn1Link = "/contact",
    btn2Text = "WhatsApp Us",
    whatsappMessage = "Hi, I'd like to check availability"
  } = props;

  const encodedMessage = encodeURIComponent(whatsappMessage);
  
  return (
    <section className="cta-banner mesh-bg clip-diagonal-up">
      <KolamDivider color="#D4AF37" opacity={0.15} />
      <div className="container text-center">
        <ScrollReveal>
          <div className="hero-eyebrow">{eyebrow}</div>
          <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', margin: '1rem 0' }}>
            {titlePart1}<span className="blink-cursor">|</span>
            <br /><span className="text-gradient">{titlePart2}</span>
          </h2>
          <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            {subtitle}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={btn1Link} className="btn btn-gold">{btn1Text} <ArrowRight size={16} /></Link>
            <a href={`https://wa.me/910000000000?text=${encodedMessage}`} target="_blank" rel="noopener noreferrer" className="btn btn-white">
              {btn2Text}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTABanner;
