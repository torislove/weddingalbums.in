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
  const mouseOffset = useMouseParallax(25);
  const magneticBtn1 = useMagneticButton();
  const magneticBtn2 = useMagneticButton();

  // Ensure default props for safe rendering if content is missing
  const {
    eyebrow = "✦ weddingalbums.in ✦",
    titlePart1 = "Beautiful Wedding",
    titleScramble = "Albums & Edits",
    subtitle = "Whether you're a couple looking to print your dream wedding album, or a photographer needing expert photo and video editing—we are here to help.",
    btn1Text = "I am a Photographer",
    btn1Link = "/login?role=b2b",
    btn2Text = "I am a Couple",
    btn2Link = "/login?role=b2c",
    bgImage = "/kalamkari-bg.jpg"
  } = props;

  return (
    <section className="hero">
      <div className="hero-bg hero-bg-far"
        style={{ 
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          animation: 'slowPan 30s ease-in-out infinite alternate',
          transform: `scale(1.15) translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)` 
        }} />
      <div className="hero-overlay" />

      <GoldenParticles count={40} />

      <FlowerPetal size={60} style={{ top: '10%', left: '10%' }} color="#D4AF37" delay={0} />
      <FlowerPetal size={45} style={{ top: '60%', left: '5%' }} color="#FFD700" delay={1.2} />
      <FlowerPetal size={80} style={{ top: '25%', right: '8%' }} color="#DAA520" delay={0.5} />
      <FlowerPetal size={50} style={{ bottom: '15%', right: '15%' }} color="#D4AF37" delay={2} />
      <FlowerPetal size={40} style={{ top: '40%', left: '30%' }} color="#FFD700" delay={1.8} />
      <FlowerPetal size={55} style={{ top: '70%', right: '35%' }} color="#DAA520" delay={0.9} />

      <div
        className="hero-content"
        style={{ transform: `translate(${-mouseOffset.x * 0.8}px, ${-mouseOffset.y * 0.8}px)`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <ScrollReveal>
          <div className="hero-eyebrow">{eyebrow}</div>
          <div className="hero-rule" style={{ margin: '15px auto' }} />
          <h1 className="hero-title font-serif">
            <span className="liquid-gold-text" style={{ fontSize: '1.2em' }}>{titlePart1}</span>
            <br /><TextScramble text={titleScramble} delay={300} as="span" className="liquid-gold-text" />
          </h1>
          <div className="hero-rule" style={{ margin: '20px auto' }} />
          <p className="hero-subtitle" style={{ maxWidth: '800px', margin: '0 auto 2rem auto', fontSize: '1.2rem', lineHeight: '1.6' }}>
            {subtitle}
          </p>
          <div className="hero-cta" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Link to={btn1Link} className="btn btn-gold-3d" ref={magneticBtn1} style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
              {btn1Text} <ArrowRight size={20} />
            </Link>
            <Link to={btn2Link} className="btn btn-gold-3d" ref={magneticBtn2} style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
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
