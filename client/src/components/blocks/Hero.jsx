import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';
import GoldenParticles from '../GoldenParticles';
import FlowerPetal from '../FlowerPetal';
import TextScramble from '../TextScramble';
import useMouseParallax from '../../hooks/useMouseParallax';
import useMagneticButton from '../../hooks/useMagneticButton';

const Hero = (props) => {
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || window.matchMedia('(hover: none)').matches);
  const rawMouseOffset = useMouseParallax(25);
  const mouseOffset = isMobile ? { x: 0, y: 0 } : rawMouseOffset;
  const magneticBtn1 = useMagneticButton();
  const magneticBtn2 = useMagneticButton();

  // Ensure default props tailored strictly for couples
  const {
    eyebrow = "✦ weddingalbums.in ✦",
    titlePart1 = "Cinematic Storytelling",
    titleScramble = "& Wedding Albums",
    subtitle = "Crafting timeless Telugu wedding albums, flush mount keepsakes, and cinematic wedding highlights for couples across Andhra Pradesh.",
    btn1Text = "Explore Wedding Packages",
    btn1Link = "/pricing",
    btn2Text = "Instant Cost Estimator",
    btn2Link = "#estimator",
    bgImage = "/images/weddingalbums-home-hero.png"
  } = props;

  return (
    <section className="hero">
      <div className="hero-bg hero-bg-far"
        style={{ 
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          animation: 'slowPan 30s ease-in-out infinite alternate',
          transform: isMobile ? 'none' : `scale(1.15) translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)` 
        }} />
      <div className="hero-overlay" />

      <GoldenParticles count={isMobile ? 15 : 40} />

      {!isMobile && (
        <>
          <FlowerPetal size={60} style={{ top: '10%', left: '10%' }} color="#D4AF37" delay={0} />
          <FlowerPetal size={45} style={{ top: '60%', left: '5%' }} color="#FFD700" delay={1.2} />
          <FlowerPetal size={80} style={{ top: '25%', right: '8%' }} color="#DAA520" delay={0.5} />
          <FlowerPetal size={50} style={{ bottom: '15%', right: '15%' }} color="#D4AF37" delay={2} />
          <FlowerPetal size={40} style={{ top: '40%', left: '30%' }} color="#FFD700" delay={1.8} />
          <FlowerPetal size={55} style={{ top: '70%', right: '35%' }} color="#DAA520" delay={0.9} />
        </>
      )}

      {isMobile && (
        <>
          <FlowerPetal size={35} style={{ top: '12%', left: '6%' }} color="#D4AF37" delay={0} />
          <FlowerPetal size={30} style={{ bottom: '12%', right: '6%' }} color="#DAA520" delay={1} />
        </>
      )}

      <div
        className="hero-content"
        style={{ 
          transform: isMobile ? 'none' : `translate(${-mouseOffset.x * 0.8}px, ${-mouseOffset.y * 0.8}px)`, 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <ScrollReveal>
          <div className="hero-eyebrow">{eyebrow}</div>
          <div className="hero-rule" style={{ margin: '12px auto' }} />
          <h1 className="hero-title font-serif">
            <span className="liquid-gold-text hero-title-highlight">{titlePart1}</span>
            <br /><TextScramble text={titleScramble} delay={300} as="span" className="liquid-gold-text hero-title-highlight" />
          </h1>
          <div className="hero-rule" style={{ margin: '16px auto' }} />
          <p className="hero-subtitle">
            {subtitle}
          </p>
          <div className="hero-cta">
            <Link to={btn1Link} className="btn btn-gold-3d hero-btn" ref={magneticBtn1}>
              {btn1Text} <ArrowRight size={18} />
            </Link>
            <Link to={btn2Link} className="btn btn-gold-3d hero-btn" ref={magneticBtn2}>
              {btn2Text}
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
};

export default Hero;
