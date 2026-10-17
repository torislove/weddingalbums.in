import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import PageHero from '../components/blocks/PageHero';
import ScrollReveal from '../components/ScrollReveal';
import { useT } from '../context/LanguageContext';

const Careers = () => {
  const t = useT();
  return (
    <div className="careers-page">
      <PageHero 
        title={t('careers.hero_title')}
        subtitle={t('careers.hero_sub')}
        bgImage="/kalamkari-bg.jpg"
      />
      
      <section className="py-24 px-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-4xl font-serif text-[var(--brand)] mb-6">{t('careers.title')}</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {t('careers.desc')}
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                  <h3 className="text-xl text-white font-medium mb-2">{t('careers.earn_title')}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 200px' }}>
                      <p className="text-sm text-gray-400 mb-2">{t('careers.earn_label')}</p>
                      <input type="range" min="1" max="20" defaultValue="5" className="w-full" style={{ accentColor: 'var(--brand)' }} onChange={(e) => document.getElementById('calc-result').innerText = `₹${(e.target.value * 3000).toLocaleString()}`} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--brand)' }}>
                      <span id="calc-result">₹15,000</span><span style={{ fontSize: '0.8rem', color: 'var(--n-400)', fontWeight: 'normal' }}> {t('careers.earn_permo')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                  <h3 className="text-xl text-white font-medium mb-2">{t('careers.payout_title')}</h3>
                  <p className="text-sm text-gray-400">{t('careers.payout_desc')}</p>
                </div>
              </div>

              <Link to="/login?role=editor" className="btn btn-gold inline-block">{t('careers.apply')}</Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand)]/20 to-transparent rounded-2xl transform rotate-3 scale-105"></div>
              <img src="/images/cinematic-video-suite.jpg" alt="Editors working remotely" className="relative rounded-2xl shadow-2xl border border-white/10" />
            </div>
            
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default Careers;
