import React, { useState, useEffect } from 'react';
import { Check, Info, PhoneCall } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import PackageSection from '../components/PackageSection';
import './Pricing.css';

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('b2c');

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="pricing-ambient-glow"></div>
        <ScrollReveal>
          <div className="pricing-badge">100% TRANSPARENT</div>
          <h1 className="text-gradient font-serif mb-4">Transparent Pricing</h1>
          <p className="text-muted max-w-2xl mx-auto text-lg mb-8">
            <span className="telugu-text text-white">ఎలాంటి దాచిన ఛార్జీలు లేవు</span> (No hidden charges). What you see is exactly what you pay. 
            Choose your profile below to view our comprehensive pricing.
          </p>

          <div className="pricing-tab-switcher">
            <button 
              className={`ptab-btn ${activeTab === 'b2c' ? 'active' : ''}`}
              onClick={() => setActiveTab('b2c')}
            >
              For Couples (B2C)
            </button>
            <button 
              className={`ptab-btn ${activeTab === 'b2b' ? 'active' : ''}`}
              onClick={() => setActiveTab('b2b')}
            >
              For Studios (B2B)
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* Packages Section using dynamic API component */}
      <section className="pricing-content section bg-darker">
        <div className="container">
          <ScrollReveal>
            <h2 className="text-center font-serif text-white mb-10">
              {activeTab === 'b2c' ? 'Wedding Combo Packages' : 'Wholesale Studio Rates'}
            </h2>
          </ScrollReveal>
          
          <PackageSection type={activeTab} />
          
        </div>
      </section>

      {/* FAQ & CTA */}
      <section className="pricing-faq section">
        <div className="container">
          <ScrollReveal className="text-center mb-10">
            <h2 className="text-gradient font-serif">Frequently Asked Questions</h2>
          </ScrollReveal>
          
          <div className="faq-grid">
            <ScrollReveal delay={100} className="faq-card glass-3d">
              <h4 className="text-white flex items-center gap-2"><Info size={18} className="text-[#D4AF37]"/> Do you require an advance payment?</h4>
              <p className="text-gray-400 mt-2">Yes, we require a 50% advance to start the editing or album design process. The remaining 50% is due before shipping.</p>
            </ScrollReveal>
            
            <ScrollReveal delay={200} className="faq-card glass-3d">
              <h4 className="text-white flex items-center gap-2"><Info size={18} className="text-[#D4AF37]"/> How long does printing take?</h4>
              <p className="text-gray-400 mt-2">Once you approve the digital 3D proof, printing and binding take 3-5 working days. Shipping across AP/TS takes another 2-3 days.</p>
            </ScrollReveal>

            <ScrollReveal delay={300} className="faq-card glass-3d">
              <h4 className="text-white flex items-center gap-2"><Info size={18} className="text-[#D4AF37]"/> Can B2B studios get samples?</h4>
              <p className="text-gray-400 mt-2">Yes! We offer a heavily discounted sample album for studios to keep in their office and show clients.</p>
            </ScrollReveal>
            
            <ScrollReveal delay={400} className="faq-card glass-3d">
              <h4 className="text-white flex items-center gap-2"><Info size={18} className="text-[#D4AF37]"/> Are there hidden shipping charges?</h4>
              <p className="text-gray-400 mt-2">No. Shipping is calculated at checkout based on weight and location. We use premium couriers like DTDC and BlueDart.</p>
            </ScrollReveal>
          </div>

          <ScrollReveal className="pricing-cta">
            <h3 className="font-serif text-white mb-4">Have custom requirements?</h3>
            <p className="text-gray-400 mb-6">Talk directly to our founders on WhatsApp to discuss bulk orders or custom album sizes.</p>
            <a href="https://wa.me/919000000000" target="_blank" rel="noreferrer" className="btn btn-gold-3d flex items-center gap-2 mx-auto w-fit">
              <PhoneCall size={18} /> Chat on WhatsApp
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
