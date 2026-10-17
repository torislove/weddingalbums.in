import React from 'react';
import { Info, PhoneCall, Sparkles, ShieldCheck } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import PackageSection from '../components/PackageSection';
import { useT } from '../context/LanguageContext';
import './Pricing.css';

const Pricing = () => {
  const t = useT();
  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="pricing-ambient-glow"></div>
        <ScrollReveal>
          <div className="pricing-badge">
            <Sparkles size={14} className="inline mr-1 text-[var(--brand)]" />
            {t('pricing.badge')}
          </div>
          <h1 className="text-gradient font-serif mb-4">{t('pricing.title')}</h1>
          <p className="text-muted max-w-2xl mx-auto text-lg mb-8">
            <span className="telugu-text text-white font-semibold">{t('pricing.sub_pre')}</span> {t('pricing.sub')}
          </p>
        </ScrollReveal>
      </section>

      {/* Packages Section for Couples (B2C) */}
      <section className="pricing-content section bg-darker">
        <div className="container">
          <ScrollReveal>
            <h2 className="text-center font-serif text-white mb-2">
              {t('pricing.packages_title')}
            </h2>
            <p className="text-center text-gray-400 text-sm max-w-xl mx-auto mb-10">
              {t('pricing.packages_sub')}
            </p>
          </ScrollReveal>
          
          <PackageSection type="b2c" />
          
        </div>
      </section>

      {/* FAQ & CTA */}
      <section className="pricing-faq section">
        <div className="container">
          <ScrollReveal className="text-center mb-10">
            <h2 className="text-gradient font-serif">{t('pricing.faq_title')}</h2>
          </ScrollReveal>
          
          <div className="faq-grid">
            <ScrollReveal delay={100} className="faq-card glass-3d">
              <h4 className="text-white flex items-center gap-2">
                <Info size={18} className="text-[var(--brand)]"/> {t('pricing.q1')}
              </h4>
              <p className="text-gray-400 mt-2">
                {t('pricing.a1')}
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={200} className="faq-card glass-3d">
              <h4 className="text-white flex items-center gap-2">
                <Info size={18} className="text-[var(--brand)]"/> {t('pricing.q2')}
              </h4>
              <p className="text-gray-400 mt-2">
                {t('pricing.a2')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300} className="faq-card glass-3d">
              <h4 className="text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-[var(--brand)]"/> {t('pricing.q3')}
              </h4>
              <p className="text-gray-400 mt-2">
                {t('pricing.a3')}
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={400} className="faq-card glass-3d">
              <h4 className="text-white flex items-center gap-2">
                <Info size={18} className="text-[var(--brand)]"/> {t('pricing.q4')}
              </h4>
              <p className="text-gray-400 mt-2">
                {t('pricing.a4')}
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal className="pricing-cta">
            <h3 className="font-serif text-white mb-4">{t('pricing.cta_title')}</h3>
            <p className="text-gray-400 mb-6">{t('pricing.cta_desc')}</p>
            <a 
              href="https://wa.me/919876543210?text=Hello!%20I%20would%20like%20to%20discuss%20a%20custom%20wedding%20album%20package." 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-gold-3d flex items-center gap-2 mx-auto w-fit"
            >
              <PhoneCall size={18} /> {t('pricing.cta_btn')}
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
