import React from 'react';
import { motion } from 'framer-motion';
import { 
  UploadCloud, Scissors, BookOpen, Truck, CheckCircle2, 
  Layers, ShieldCheck, Star, ExternalLink, Lock, PhoneCall, Sparkles, Building2 
} from 'lucide-react';
import './B2B.css';
import { useT } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

const STUDIO_PORTAL_URL = typeof window !== 'undefined' && window.location.hostname.includes('localhost')
  ? 'http://localhost:5174'
  : 'https://weddingalbums-studio.web.app';

// Brand / product names and technical GSM figures stay authored (not translated);
// the marketing description + durability lines are keyed so the whole page flips EN/TE.
const LUXURY_SHEET_SPECS = [
  { id: 'luster', name: 'Karizma Royal Luster', spec: '280 GSM Micro-Texture' },
  { id: 'gloss', name: 'Crystal Ultra High-Gloss', spec: '300 GSM High-Vibrancy' },
  { id: 'velvet', name: 'Velvet Feather Touch', spec: '320 GSM Scuff-Free Matte' },
  { id: 'metallic', name: 'Metallic Pearl Shimmer', spec: '310 GSM Pearl Luminescence' },
  { id: 'nt', name: 'Non-Tearable Waterproof NT', spec: '350 Micron Synthetic Polymer' }
];

const WORKFLOW_STEPS = [
  { icon: <UploadCloud size={28} />, titleKey: 'b2b.step1_title', descKey: 'b2b.step1_desc' },
  { icon: <Scissors size={28} />, titleKey: 'b2b.step2_title', descKey: 'b2b.step2_desc' },
  { icon: <BookOpen size={28} />, titleKey: 'b2b.step3_title', descKey: 'b2b.step3_desc' },
  { icon: <Truck size={28} />, titleKey: 'b2b.step4_title', descKey: 'b2b.step4_desc' }
];

const GATE_BENEFITS = [
  { titleKey: 'b2b.benefit1_t', descKey: 'b2b.benefit1_d' },
  { titleKey: 'b2b.benefit2_t', descKey: 'b2b.benefit2_d' },
  { titleKey: 'b2b.benefit3_t', descKey: 'b2b.benefit3_d' }
];

const TRADE_TESTIMONIALS = [
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
];

const B2B = () => {
  const t = useT();
  const { content } = useContent();
  const rawWa = content?.siteSettings?.whatsapp || content?.global?.siteSettings?.whatsapp || content?.global?.navbar?.whatsapp || '919494845111';
  const cleanWa = String(rawWa).replace(/[^0-9]/g, '') || '919494845111';

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
            <span>{t('b2b.badge')}</span>
          </div>
          <h1 className="b2b-title">
            {t('b2b.title_1')} <br /> {t('b2b.title_2')}
          </h1>
          <p className="b2b-subtitle">
            {t('b2b.subtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <a 
              href={STUDIO_PORTAL_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-gold-3d flex items-center gap-2"
            >
              <span>{t('b2b.cta_portal')}</span>
              <ExternalLink size={16} />
            </a>
            <a 
              href={`https://wa.me/${cleanWa}?text=${encodeURIComponent("Hi! I am a wedding photographer and would like to apply for a Studio Trade Account.")}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline flex items-center gap-2"
            >
              <PhoneCall size={16} />
              <span>{t('b2b.cta_trade')}</span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* The Process Section (Bento Grid) */}
      <section className="b2b-workflow">
        <div className="b2b-section-header">
          <h2 className="b2b-section-title">{t('b2b.workflow_title')}</h2>
          <p className="b2b-section-subtitle">{t('b2b.workflow_sub')}</p>
        </div>

        <div className="b2b-bento-grid">
          {WORKFLOW_STEPS.map((step, i) => (
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
              <h3 className="b2b-card-title">{t(step.titleKey)}</h3>
              <p className="b2b-card-desc">{t(step.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Printing Arsenal & Sheet Types */}
      <section className="b2b-printing-arsenal">
        <div className="b2b-section-header">
          <h2 className="b2b-section-title">{t('b2b.arsenal_title')}</h2>
          <p className="b2b-section-subtitle">{t('b2b.arsenal_sub')}</p>
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
                <span className="text-[10px] uppercase font-bold text-[var(--brand)] bg-[var(--brand)]/15 border border-[var(--brand)]/30 px-2 py-0.5 rounded-full">
                  {type.spec}
                </span>
              </div>
              <h3>{type.name}</h3>
              <p className="text-xs text-gray-300 mt-1 mb-3">{t(`b2b.sheet_${type.id}_desc`)}</p>
              <div className="flex justify-between items-center pt-2 border-t border-white/10 text-[11px] text-gray-400">
                <span>{t(`b2b.sheet_${type.id}_dur`)}</span>
                <span className="text-[var(--brand)] font-semibold flex items-center gap-1">
                  <Lock size={11} /> {t('b2b.trade_rate')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* White Label Guarantee */}
      <section className="b2b-whitelabel-section">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="b2b-whitelabel-card">
          <ShieldCheck size={48} className="text-[var(--brand)] mb-4 mx-auto" />
          <h2>{t('b2b.whitelabel_title')}</h2>
          <p>
            {t('b2b.wl_pre')}<strong>{t('b2b.wl_zero')}</strong>{t('b2b.wl_post')}
          </p>
        </motion.div>
      </section>

      {/* Studio Trade Rate Access Gate */}
      <section className="b2b-calculator-section">
        <div className="max-w-4xl mx-auto glass-3d p-8 sm:p-12 rounded-3xl border border-[var(--brand)]/40 bg-gradient-to-b from-black/90 to-zinc-950/90 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Lock size={160} className="text-[var(--brand)]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/30 text-[var(--brand)] text-xs font-bold mb-4 tracking-wider uppercase">
            <Lock size={14} />
            <span>{t('b2b.gate_badge')}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-4">
            {t('b2b.gate_title')}
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('b2b.gate_body')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
            {GATE_BENEFITS.map((b, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <CheckCircle2 size={20} className="text-emerald-400 mb-2" />
                <div className="font-bold text-white text-sm">{t(b.titleKey)}</div>
                <div className="text-xs text-gray-400 mt-1">{t(b.descKey)}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={STUDIO_PORTAL_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-gold-3d px-8 py-4 font-bold text-base flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_25px_rgba(212,175,55,0.4)]"
            >
              <span>{t('b2b.launch_portal')}</span>
              <ExternalLink size={18} />
            </a>
            <a 
              href={`https://wa.me/${cleanWa}?text=${encodeURIComponent("Hi! I am a wedding photographer and would like to apply for a Studio Trade Account.")}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline px-8 py-4 font-semibold text-base flex items-center justify-center gap-2 w-full sm:w-auto text-[#25D366] border-[#25D366]/40 hover:bg-[#25D366]/15"
            >
              <PhoneCall size={18} />
              <span>{t('b2b.apply_whatsapp')}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="b2b-testimonials" style={{ padding: '80px 5%', textAlign: 'center' }}>
        <h2>{t('b2b.testimonials_title')}</h2>
        <div className="grid grid-3" style={{ gap: '30px', marginTop: '40px' }}>
          {TRADE_TESTIMONIALS.map((item, i) => (
            <div key={i} className="glass-3d p-8 rounded-xl text-left">
              <div className="flex text-[var(--brand)] mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#D4AF37" />)}
              </div>
              <p className="italic text-gray-300 mb-6">"{item.text}"</p>
              <h4 className="font-bold text-white m-0">{item.name}</h4>
              <p className="text-sm text-gray-500 m-0">{item.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="b2b-hero" style={{ paddingBottom: '140px' }}>
        <h2 className="b2b-section-title">{t('b2b.final_title')}</h2>
        <p className="b2b-section-subtitle">{t('b2b.final_sub')}</p>
        <div className="flex justify-center gap-4 mt-6">
          <a 
            href={STUDIO_PORTAL_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-gold-3d px-8 py-3.5 font-bold"
          >
            {t('b2b.launch_arrow')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default B2B;
