import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import KolamDivider from '../KolamDivider';
import { useContent } from '../../context/ContentContext';

const CTABanner = (props) => {
  const { content } = useContent();
  const {
    eyebrow = "✦ Start Your Heirloom Story ✦",
    titlePart1 = "Preserve Sacred Memories",
    titlePart2 = "With Pure Artisanal Luxury",
    subtitle = "Handcrafted flush-mount albums, 4K cinematic video editing, and custom event media tailored for Andhra Pradesh & Telangana weddings.",
    btn1Text = "Explore Store & Pricing",
    btn1Link = "/shop",
    btn2Text = "WhatsApp Us",
    whatsappNumber,
    whatsappMessage = "Hi, I'd like to check availability"
  } = props;

  const rawWa = whatsappNumber || content?.siteSettings?.whatsapp || content?.global?.siteSettings?.whatsapp || content?.global?.navbar?.whatsapp || '919346793364';
  const cleanWa = String(rawWa).replace(/[^0-9]/g, '') || '919346793364';
  const rawPhone = content?.siteSettings?.phone || content?.global?.siteSettings?.phone || content?.global?.navbar?.phone || '+91 9346793364';
  const cleanPhone = String(rawPhone).replace(/\s+/g, '');
  const encodedMessage = encodeURIComponent(whatsappMessage);
  
  return (
    <section className="cta-banner mesh-bg clip-diagonal-up">
      <KolamDivider color="#D4AF37" opacity={0.15} />
      <div className="container text-center">
        <ScrollReveal>
          <div className="hero-eyebrow">{eyebrow}</div>
          {props.title ? (
            <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', margin: '1rem 0' }}>
              <span className="text-gradient">{props.title}</span>
            </h2>
          ) : (
            <h2 className="font-serif" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', margin: '1rem 0' }}>
              {titlePart1}<span className="blink-cursor">|</span>
              <br /><span className="text-gradient">{titlePart2}</span>
            </h2>
          )}
          <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto 2.5rem' }}>
            {subtitle}
          </p>
          <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={btn1Link} className="btn btn-gold">{btn1Text} <ArrowRight size={16} /></Link>
            <a href={`https://wa.me/${cleanWa}?text=${encodedMessage}`} target="_blank" rel="noopener noreferrer" className="btn btn-white" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              💬 {btn2Text}
            </a>
            <a href={`tel:${cleanPhone}`} className="btn" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              📞 Call: {rawPhone}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTABanner;
