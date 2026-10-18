import React, { useState, useEffect } from 'react';
import { Target, ShieldCheck, BookOpen, ArrowRight, MapPin, Layers, IndianRupee, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import GoldenParticles from '../components/GoldenParticles';
import Logo from '../components/Logo';
import { API } from '../apiConfig';

const EditorLanding = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [editorContent, setEditorContent] = useState(null);

  const fetchContent = () => {
    fetch(`${API}/api/content`)
      .then(res => res.json())
      .then(data => {
        const portal = data?.global?.editorPortal || data?.editorPortal;
        if (portal) setEditorContent(portal);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchContent();

    let sseSource;
    try {
      sseSource = new EventSource(`${API}/api/events`);
      sseSource.addEventListener('content:updated', () => {
        fetchContent();
      });
    } catch { /* SSE unavailable */ }

    return () => {
      if (sseSource) sseSource.close();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9, rotateX: 15 },
    visible: {
      y: 0, opacity: 1, scale: 1, rotateX: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    },
    hover: {
      y: -15, scale: 1.05,
      boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2), inset 0 0 0 1px rgba(99, 102, 241, 0.4)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.6 }}>
          <GoldenParticles count={40} color="99, 102, 241" />
        </div>
        
        <header style={{ position: 'relative', zIndex: 10, padding: 'clamp(1rem, 3vw, 1.75rem)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1240px', margin: '0 auto', width: '100%', boxSizing: 'border-box', flexWrap: 'wrap', gap: '1rem' }}>
          <Logo size={40} portalTag="Lab Production" />
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>Lab Login</button>
            <button onClick={() => navigate('/signup')} className="liquid-btn" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>Technician Onboarding</button>
          </motion.div>
        </header>

        <main style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
          <motion.div 
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            style={{ marginBottom: '2rem' }}
          >
            <Sparkles size={72} color="var(--accent-primary)" style={{ filter: 'drop-shadow(0 0 30px rgba(212, 175, 55,1))' }} />
          </motion.div>
          
          {editorContent?.announcements?.[0] && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(192, 132, 252, 0.12)', border: '1px solid rgba(192, 132, 252, 0.35)',
                color: '#c084fc', padding: '6px 16px', borderRadius: '999px',
                fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.5rem'
              }}
            >
              <span style={{ background: '#c084fc', color: '#000', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                {editorContent.announcements[0].tag || 'GUIDELINE'}
              </span>
              <span>{editorContent.announcements[0].title}</span>
            </motion.div>
          )}

          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)', marginBottom: '1.5rem', lineHeight: '1.15', fontWeight: 900, background: 'linear-gradient(to right, var(--brand-soft), var(--brand-deep), #F5E6A8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(212, 175, 55,0.3))' }}
          >
            {editorContent?.landingHero?.title || 'Craft Royal Heirloom Albums & 4K Wedding Cinema'}
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '750px', marginBottom: '3rem', lineHeight: 1.6 }}
          >
            {editorContent?.landingHero?.subtitle || "Authorized workbench for WeddingAlbums.in's certified colorists, retouchers, and album layout specialists. Fulfilling storefront customer and studio orders with commercial lab precision."}
          </motion.p>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button onClick={() => navigate('/login')} className="liquid-btn" style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 0 30px rgba(212, 175, 55,0.4)' }}>
              {editorContent?.landingHero?.technicianCtaText || 'Enter Production Workbench'} <ArrowRight size={24} />
            </button>
          </motion.div>
        </main>
        
        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity, position: 'absolute', bottom: '40px', left: '50%', x: '-50%', zIndex: 1 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div style={{ width: '30px', height: '50px', border: '2px solid var(--accent-primary)', borderRadius: '15px', position: 'relative' }}>
            <div style={{ width: '4px', height: '8px', background: 'var(--accent-primary)', borderRadius: '2px', position: 'absolute', left: '11px', top: '10px' }}></div>
          </div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section style={{ padding: '8rem 2rem', background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', fontSize: '4rem', marginBottom: '6rem', background: 'linear-gradient(to right, var(--brand-soft), var(--brand-deep))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Lab Production Flow
          </motion.h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', position: 'relative' }}
          >
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              style={{ position: 'absolute', top: '50px', left: '150px', right: '150px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)', opacity: 0.5, zIndex: 0, transformOrigin: 'left' }} 
              className="hidden md:block"
            />
            
            <motion.div variants={itemVariants} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div 
                whileHover={{ y: -10 }}
                style={{ width: '100px', height: '100px', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-primary)', background: 'var(--ink)', boxShadow: '0 0 20px rgba(212, 175, 55,0.2)' }}
              >
                <MapPin size={40} color="var(--accent-primary)" />
              </motion.div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--paper)' }}>1. Storefront Order Inflow</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>Orders placed by couples or submitted by partner studios flow directly into your designated queue with exact sizes and sheet specs.</p>
            </motion.div>

            <motion.div variants={itemVariants} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 15 }}
                style={{ width: '100px', height: '100px', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-primary)', background: 'var(--ink)', boxShadow: '0 0 20px rgba(212, 175, 55,0.2)' }}
              >
                <Layers size={40} color="var(--accent-primary)" />
              </motion.div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--paper)' }}>2. Calibrated Workspaces</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>Color grading, skin retouching, Karizma PSD layout, and DaVinci cuts matching master ICC profiles and regional traditions.</p>
            </motion.div>

            <motion.div variants={itemVariants} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '100px', height: '100px', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-primary)', background: 'var(--ink)', boxShadow: '0 0 20px rgba(212, 175, 55,0.2)' }}
              >
                <IndianRupee size={40} color="var(--accent-primary)" />
              </motion.div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--paper)' }}>3. Direct Lab Fulfillment</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>Approved spreads route automatically to our commercial lay-flat press, followed by instant credit of your production compensation.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '8rem 2rem', background: 'var(--bg-primary)', perspective: '1000px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}
          >
            
            <motion.div variants={cardVariants} whileHover="hover" className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '20px', borderTop: '4px solid var(--accent-primary)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.5)' }}>
                <Target size={36} color="var(--accent-primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--paper)', fontSize: '1.8rem', fontWeight: 700 }}>Dedicated Lab Queue</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem' }}>No bidding wars or client chasing. Fulfill verified orders directly from the Storefront and Studio portals with clear creative briefs.</p>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover" className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '20px', borderTop: '4px solid var(--accent-primary)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.5)' }}>
                <ShieldCheck size={36} color="var(--accent-primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--paper)', fontSize: '1.8rem', fontWeight: 700 }}>Reliable Compensation</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem' }}>Structured milestone payouts and competitive production rates directly credited upon QC sign-off. Guaranteed on-time bank deposits.</p>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover" className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '20px', borderTop: '4px solid var(--accent-primary)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.5)' }}>
                <BookOpen size={36} color="var(--accent-primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--paper)', fontSize: '1.8rem', fontWeight: 700 }}>Commercial Lab Tools</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem' }}>Full access to our high-end LUT library, South Indian ritual PSD presets, calibrated color profiles, and AI-assisted local culling.</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '10rem 2rem', background: 'var(--ink)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ y: y1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3, background: 'radial-gradient(circle at center, rgba(212, 175, 55,0.2) 0%, transparent 70%)' }} />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <h2 style={{ fontSize: '4rem', marginBottom: '2rem', fontWeight: 800, background: 'linear-gradient(to right, var(--brand-soft), var(--brand-deep))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Access the Production Workbench</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')} 
              className="liquid-btn" 
              style={{ padding: '1.5rem 4rem', fontSize: '1.3rem', borderRadius: '50px', boxShadow: '0 0 30px rgba(212, 175, 55,0.3)' }}
            >
              Sign In to Lab Workbench
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default EditorLanding;
