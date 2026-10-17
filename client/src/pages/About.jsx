import React from 'react';
import { Camera, Clock, Heart, Users, Award, Shield } from 'lucide-react';
import { useT } from '../context/LanguageContext';
import './About.css';

const About = () => {
  const t = useT();
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="overlay"></div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--brand)] mb-6">{t('about.hero_title')}</h1>
          <p className="hero-text">
            {t('about.hero_sub')}
          </p>
        </div>
      </section>

      <section className="pillars-container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-[var(--brand)] mb-4">{t('about.pillars_title')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('about.pillars_sub')}</p>
        </div>

        <div className="pillar-card">
          <span className="pillar-number">01</span>
          <div className="pillar-icon-wrapper">
            <div className="icon-glow"></div>
            <Award className="pillar-icon" size={48} />
          </div>
          <div className="pillar-content">
            <h3 className="pillar-title">{t('about.p1_title')}</h3>
            <p className="pillar-desc">
              {t('about.p1_desc')}
            </p>
          </div>
        </div>

        <div className="pillar-card">
          <span className="pillar-number">02</span>
          <div className="pillar-icon-wrapper">
            <div className="icon-glow"></div>
            <Clock className="pillar-icon" size={48} />
          </div>
          <div className="pillar-content">
            <h3 className="pillar-title">{t('about.p2_title')}</h3>
            <p className="pillar-desc">
              {t('about.p2_desc')}
            </p>
          </div>
        </div>

        <div className="pillar-card">
          <span className="pillar-number">03</span>
          <div className="pillar-icon-wrapper">
            <div className="icon-glow"></div>
            <Heart className="pillar-icon" size={48} />
          </div>
          <div className="pillar-content">
            <h3 className="pillar-title">{t('about.p3_title')}</h3>
            <p className="pillar-desc">
              {t('about.p3_desc')}
            </p>
          </div>
        </div>
      </section>

      <section className="about-cta text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
          <div>
            <h4 className="text-4xl font-bold text-[var(--brand)] mb-2">500+</h4>
            <p className="text-gray-400">{t('about.stat1_label')}</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-[var(--brand)] mb-2">12+</h4>
            <p className="text-gray-400">{t('about.stat2_label')}</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-[var(--brand)] mb-2">4.9★</h4>
            <p className="text-gray-400">{t('about.stat3_label')}</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-[var(--brand)] mb-2">72h</h4>
            <p className="text-gray-400">{t('about.stat4_label')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
