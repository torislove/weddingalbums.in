import React from 'react';
import { Info, PhoneCall, Sparkles, ShieldCheck } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import PackageSection from '../components/PackageSection';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="pricing-ambient-glow"></div>
        <ScrollReveal>
          <div className="pricing-badge">
            <Sparkles size={14} className="inline mr-1 text-[#D4AF37]" />
            100% TRANSPARENT HEIRLOOM PRICING
          </div>
          <h1 className="text-gradient font-serif mb-4">Transparent Pricing for Couples</h1>
          <p className="text-muted max-w-2xl mx-auto text-lg mb-8">
            <span className="telugu-text text-white font-semibold">ఎలాంటి దాచిన ఛార్జీలు లేవు</span> (No hidden charges). What you see is exactly what you pay for your heirloom wedding albums, 4K video edits, and event prints.
          </p>
        </ScrollReveal>
      </section>

      {/* Packages Section for Couples (B2C) */}
      <section className="pricing-content section bg-darker">
        <div className="container">
          <ScrollReveal>
            <h2 className="text-center font-serif text-white mb-2">
              Wedding Collections & Services
            </h2>
            <p className="text-center text-gray-400 text-sm max-w-xl mx-auto mb-10">
              Select any package below to configure custom sheet finishes, 4K video styles, and album dimensions.
            </p>
          </ScrollReveal>
          
          <PackageSection type="b2c" />
          
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
              <h4 className="text-white flex items-center gap-2">
                <Info size={18} className="text-[#D4AF37]"/> Do you require an advance payment?
              </h4>
              <p className="text-gray-400 mt-2">
                Yes, we require a 50% advance to initiate the dedicated design, color grading, and proofing process. The remaining balance is payable upon your digital 3D proof approval before physical print binding.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={200} className="faq-card glass-3d">
              <h4 className="text-white flex items-center gap-2">
                <Info size={18} className="text-[#D4AF37]"/> How long does printing take?
              </h4>
              <p className="text-gray-400 mt-2">
                Once you approve the digital 3D flipbook proof, precision printing and hand-crafted binding take 3-5 working days. Priority courier delivery across AP and Telangana takes another 24-48 hours.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300} className="faq-card glass-3d">
              <h4 className="text-white flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#D4AF37]"/> Can we request changes before printing?
              </h4>
              <p className="text-gray-400 mt-2">
                Yes! We share an interactive 3D digital flipbook proof directly to your Couples Portal and WhatsApp. You can review every spread, leave notes, and approve the design before it goes to the lab.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={400} className="faq-card glass-3d">
              <h4 className="text-white flex items-center gap-2">
                <Info size={18} className="text-[#D4AF37]"/> Are there hidden shipping charges?
              </h4>
              <p className="text-gray-400 mt-2">
                No. Standard insured door delivery across Andhra Pradesh & Telangana is included in all premium heirloom packages. Express 24-hour rush dispatch is available during checkout.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal className="pricing-cta">
            <h3 className="font-serif text-white mb-4">Have custom requirements?</h3>
            <p className="text-gray-400 mb-6">Talk directly to our Vijayawada production team on WhatsApp to discuss custom dimensions, specialty sheets, or multi-album family suites.</p>
            <a 
              href="https://wa.me/919876543210?text=Hello!%20I%20would%20like%20to%20discuss%20a%20custom%20wedding%20album%20package." 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-gold-3d flex items-center gap-2 mx-auto w-fit"
            >
              <PhoneCall size={18} /> Chat with Album Specialist
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
