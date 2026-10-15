import React from 'react';
import { motion } from 'framer-motion';
import { 
  UploadCloud, Scissors, BookOpen, Truck, CheckCircle2, 
  Layers, ShieldCheck, Star, ExternalLink, Lock, PhoneCall, Sparkles, Building2 
} from 'lucide-react';
import './B2B.css';

const STUDIO_PORTAL_URL = typeof window !== 'undefined' && window.location.hostname.includes('localhost')
  ? 'http://localhost:5174'
  : 'https://weddingalbums-studio.web.app';

const LUXURY_SHEET_SPECS = [
  {
    id: 'luster',
    name: 'Karizma Royal Luster',
    spec: '280 GSM Micro-Texture',
    desc: 'Fine grain, anti-glare finish designed for cinematic Telugu wedding ceremonies and rich golden jewelry.',
    durability: 'Archival 75+ Years'
  },
  {
    id: 'gloss',
    name: 'Crystal Ultra High-Gloss',
    spec: '300 GSM High-Vibrancy',
    desc: 'High-contrast, mirror-sheen surface that makes vivid reception lighting and colorful Mandap florals pop.',
    durability: 'UV-Protected Coating'
  },
  {
    id: 'velvet',
    name: 'Velvet Feather Touch',
    spec: '320 GSM Scuff-Free Matte',
    desc: 'Ultra-luxurious tactile soft-touch surface. Zero fingerprints, zero glare, and museum-grade tactile elegance.',
    durability: 'Scratch & Smudge Resistant'
  },
  {
    id: 'metallic',
    name: 'Metallic Pearl Shimmer',
    spec: '310 GSM Pearl Luminescence',
    desc: 'Iridescent pearl luster creating an ethereal 3D shimmer on bridal Kanjeevaram silks and diamond ornaments.',
    durability: 'High-Luminescence Pigment'
  },
  {
    id: 'nt',
    name: 'Non-Tearable Waterproof NT',
    spec: '350 Micron Synthetic Polymer',
    desc: '100% waterproof, spill-proof, and indestructible synthetic sheets. The gold standard for lifetime heirloom longevity.',
    durability: '100% Waterproof & Tear-Proof'
  }
];

const B2B = () => {
  return (
    <div className="b2b-page">
      {/* Abstract Ambient Glows */}
      <div className="b2b-ambient-1"></div>
      <div className="b2b-ambient-2"></div>

      {/* Hero Section */}
      <section className="b2b-hero">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="b2b-badge flex items-center justify-center gap-1.5 mx-auto">
            <Building2 size={14} />
            <span>EXCLUSIVELY FOR WEDDING STUDIOS & PROFESSIONAL PHOTOGRAPHERS</span>
          </div>
          <h1 className="b2b-title">
            Scale Your Studio. <br /> Maximize Your Margins.
          </h1>
          <p className="b2b-subtitle">
            Andhra Pradesh's dedicated B2B post-production lab. We handle photo retouching, 4K video editing, color-calibrated album printing, and white-label drop-shipping so you can focus on shooting weddings.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <a 
              href={STUDIO_PORTAL_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-gold-3d flex items-center gap-2"
            >
              <span>Access Studio Wholesale Portal</span>
              <ExternalLink size={16} />
            </a>
            <a 
              href="https://wa.me/919876543210?text=Hi!%20I%20am%20a%20wedding%20photographer%20and%20would%20like%20to%20apply%20for%20a%20Studio%20Trade%20Account." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline flex items-center gap-2"
            >
              <PhoneCall size={16} />
              <span>Apply for Trade Account</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* The Process Section (Bento Grid) */}
      <section className="b2b-workflow">
        <div className="b2b-section-header">
          <h2 className="b2b-section-title">The Studio Trade Workflow</h2>
          <p className="b2b-section-subtitle">Seamless, confidential integration designed for wedding production teams.</p>
        </div>

        <div className="b2b-bento-grid">
          {[
            { 
              icon: <UploadCloud size={28} />, 
              title: '1. Ingest Camera RAWs', 
              desc: 'Upload high-resolution camera RAWs and 4K footage at gigabit speeds via the dedicated Studio Portal.' 
            },
            { 
              icon: <Scissors size={28} />, 
              title: '2. Dedicated Style Matching', 
              desc: 'Our team applies your studio LUTs, color profiles, and layout aesthetic for 100% brand consistency.' 
            },
            { 
              icon: <BookOpen size={28} />, 
              title: '3. White-Label Proofing', 
              desc: 'Send interactive 3D digital flipbooks to your couples branded completely with your studio name and logo.' 
            },
            { 
              icon: <Truck size={28} />, 
              title: '4. Precision Print & Blind Ship', 
              desc: 'We print on museum-grade sheets and ship directly to your client’s doorstep in your studio packaging.' 
            }
          ].map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }} 
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="b2b-bento-card"
            >
              <div className="b2b-icon-wrapper">
                {step.icon}
              </div>
              <h3 className="b2b-card-title">{step.title}</h3>
              <p className="b2b-card-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Printing Arsenal & Sheet Types */}
      <section className="b2b-printing-arsenal">
        <div className="b2b-section-header">
          <h2 className="b2b-section-title">Our Printing Arsenal</h2>
          <p className="b2b-section-subtitle">Crafted on authentic Noritsu and HP Indigo presses with genuine Fuji and Kodak papers.</p>
        </div>
        
        <div className="b2b-printing-grid">
          {LUXURY_SHEET_SPECS.map((type, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: idx * 0.1 }} 
              className="b2b-sheet-card"
            >
              <div className="flex justify-between items-start mb-2">
                <Layers className="b2b-sheet-icon" />
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2 py-0.5 rounded-full">
                  {type.spec}
                </span>
              </div>
              <h3>{type.name}</h3>
              <p className="text-xs text-gray-300 mt-1 mb-3">{type.desc}</p>
              <div className="flex justify-between items-center pt-2 border-t border-white/10 text-[11px] text-gray-400">
                <span>{type.durability}</span>
                <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                  <Lock size={11} /> Trade Rate Protected
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* White Label Guarantee */}
      <section className="b2b-whitelabel-section">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="b2b-whitelabel-card">
          <ShieldCheck size={48} className="text-[#D4AF37] mb-4 mx-auto" />
          <h2>100% White-Label & Client Non-Poach Guarantee</h2>
          <p>
            Your Brand. Our Execution. We drop-ship luxury albums and video drives directly to your clients with <strong>ZERO</strong> branding from our lab. The shipping label, luxury box embossing, and invoice reflect your studio identity. We strictly never solicit or market to your couples.
          </p>
        </motion.div>
      </section>

      {/* Studio Trade Rate Access Gate */}
      <section className="b2b-calculator-section">
        <div className="max-w-4xl mx-auto glass-3d p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-b from-black/90 to-zinc-950/90 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Lock size={160} className="text-[#D4AF37]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold mb-4 tracking-wider uppercase">
            <Lock size={14} />
            <span>Protected Studio Trade Pricing</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-4">
            Access Wholesale Sheet Rates & Trade Terms
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            To protect photography studio margins and client relationships, raw per-sheet wholesale pricing, batch volume discounts, and 30-day billing terms are strictly guarded. Trade pricing is accessible exclusively inside the Studio Portal for authenticated studio partners.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 size={20} className="text-emerald-400 mb-2" />
              <div className="font-bold text-white text-sm">Wholesale Sheet Rates</div>
              <div className="text-xs text-gray-400 mt-1">Tiered pricing on Karizma, Velvet & NT sheets.</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 size={20} className="text-emerald-400 mb-2" />
              <div className="font-bold text-white text-sm">Rapid 48-Hour SLA</div>
              <div className="text-xs text-gray-400 mt-1">Guaranteed express dispatch during wedding season.</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 size={20} className="text-emerald-400 mb-2" />
              <div className="font-bold text-white text-sm">Multi-Editor Pods</div>
              <div className="text-xs text-gray-400 mt-1">Assigned colorist matching your studio presets.</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={STUDIO_PORTAL_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-gold-3d px-8 py-4 font-bold text-base flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_25px_rgba(212,175,55,0.4)]"
            >
              <span>Launch Studio Portal</span>
              <ExternalLink size={18} />
            </a>
            <a 
              href="https://wa.me/919876543210?text=Hi!%20I%20am%20a%20wedding%20photographer%20and%20would%20like%20to%20apply%20for%20a%20Studio%20Trade%20Account." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline px-8 py-4 font-semibold text-base flex items-center justify-center gap-2 w-full sm:w-auto text-[#25D366] border-[#25D366]/40 hover:bg-[#25D366]/15"
            >
              <PhoneCall size={18} />
              <span>Apply via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="b2b-testimonials" style={{ padding: '80px 5%', textAlign: 'center' }}>
        <h2>Trusted by Over 180+ Studios Across AP & Telangana</h2>
        <div className="grid grid-3" style={{ gap: '30px', marginTop: '40px' }}>
          {[
            { 
              name: "Srikanth Photography", 
              location: "Vijayawada", 
              text: "అద్భుతమైన క్వాలిటీ! మా కస్టమర్లు NT షీట్స్ చూసి చాలా సంతోషపడ్డారు. డెలివరీ కూడా ఆన్ టైం లో జరిగింది." 
            },
            { 
              name: "Rajesh Weddings", 
              location: "Hyderabad", 
              text: "The white-label drop-shipping is a game changer for my studio. I just send the order via the studio portal and my couples receive a luxury box in my name." 
            },
            { 
              name: "Suresh Clicks", 
              location: "Vizag", 
              text: "కరిజ్మా మరియు వెల్వెట్ ఆల్బమ్స్ క్వాలిటీ టాప్ క్లాస్. 48-గంటల ప్రింటింగ్ టర్నరౌండ్ వల్ల సీజన్ లో ఎలాంటి టెన్షన్ లేదు. Highly recommended for studio owners!" 
            }
          ].map((t, i) => (
            <div key={i} className="glass-3d p-8 rounded-xl text-left">
              <div className="flex text-[#D4AF37] mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#D4AF37" />)}
              </div>
              <p className="italic text-gray-300 mb-6">"{t.text}"</p>
              <h4 className="font-bold text-white m-0">{t.name}</h4>
              <p className="text-sm text-gray-500 m-0">{t.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="b2b-hero" style={{ paddingBottom: '140px' }}>
        <h2 className="b2b-section-title">Ready to Elevate Your Studio?</h2>
        <p className="b2b-section-subtitle">Join Andhra's elite network of professional studios and cinematographers.</p>
        <div className="flex justify-center gap-4 mt-6">
          <a 
            href={STUDIO_PORTAL_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-gold-3d px-8 py-3.5 font-bold"
          >
            Launch Studio Portal →
          </a>
        </div>
      </section>
    </div>
  );
};

export default B2B;
