import React from 'react';
import { Shield, Zap, Clock, ArrowRight, UploadCloud, Settings, Sparkles, ImageIcon, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import GoldenParticles from '../components/GoldenParticles';
import Logo from '../components/Logo';

const B2BLanding = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9, rotateX: 15 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    },
    hover: {
      y: -15,
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(212, 175, 55, 0.2), inset 0 0 0 1px rgba(212, 175, 55, 0.4)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.8 }}>
          <GoldenParticles count={50} color="212, 175, 55" />
        </div>
        
        <header style={{ position: 'relative', zIndex: 1, padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Logo size={45} />
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Login</button>
            <button onClick={() => navigate('/signup')} className="liquid-btn" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Partner With Us</button>
          </motion.div>
        </header>

        <main style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            style={{ marginBottom: '2rem' }}
          >
            <Sparkles size={72} color="var(--gold-primary)" style={{ filter: 'drop-shadow(0 0 30px rgba(212,175,55,1))' }} />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="liquid-gold-text" 
            style={{ fontSize: '5.5rem', marginBottom: '1.5rem', lineHeight: '1.1', fontWeight: 900, perspective: '1000px' }}
          >
            The Invisible Engine<br />For Elite Studios
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '750px', marginBottom: '3.5rem' }}
          >
            Offload your post-production to a 20-member dedicated team. We edit, we design, we print. You shoot and scale.
          </motion.p>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button onClick={() => navigate('/signup')} className="liquid-btn" style={{ padding: '1.2rem 3rem', fontSize: '1.3rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}>
              Create Studio Account <ArrowRight size={24} />
            </button>
          </motion.div>
        </main>
        
        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity, position: 'absolute', bottom: '40px', left: '50%', x: '-50%', zIndex: 1 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div style={{ width: '30px', height: '50px', border: '2px solid var(--gold-primary)', borderRadius: '15px', position: 'relative' }}>
            <div style={{ width: '4px', height: '8px', background: 'var(--gold-primary)', borderRadius: '2px', position: 'absolute', left: '11px', top: '10px' }}></div>
          </div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section style={{ padding: '8rem 2rem', background: '#050505', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="liquid-gold-text" 
            style={{ textAlign: 'center', fontSize: '4rem', marginBottom: '6rem' }}
          >
            How It Works
          </motion.h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', position: 'relative' }}
          >
            {/* Connecting Line */}
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              style={{ position: 'absolute', top: '50px', left: '150px', right: '150px', height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)', opacity: 0.5, zIndex: 0, transformOrigin: 'left' }} 
              className="hidden md:block"
            />
            
            <motion.div variants={itemVariants} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                style={{ width: '100px', height: '100px', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--gold-primary)', background: '#050505', boxShadow: '0 0 20px rgba(212,175,55,0.2)' }}
              >
                <UploadCloud size={40} color="var(--gold-primary)" />
              </motion.div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>1. Upload via AI</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>Drop your RAW files into our portal. Our smart AI pre-culls the bad shots locally, saving you 80% bandwidth.</p>
            </motion.div>

            <motion.div variants={itemVariants} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ width: '100px', height: '100px', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--gold-primary)', background: '#050505', boxShadow: '0 0 20px rgba(212,175,55,0.2)' }}
              >
                <Settings size={40} color="var(--gold-primary)" />
              </motion.div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>2. We Process</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>Our 20-member dedicated team takes over. Cinematic color grading, skin retouching, and premium 12x18 album designs.</p>
            </motion.div>

            <motion.div variants={itemVariants} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div 
                whileHover={{ y: -10, scale: 1.1 }}
                style={{ width: '100px', height: '100px', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--gold-primary)', background: '#050505', boxShadow: '0 0 20px rgba(212,175,55,0.2)' }}
              >
                <ImageIcon size={40} color="var(--gold-primary)" />
              </motion.div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>3. You Deliver</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>Receive a white-labeled proofing link to share with clients, followed by the final exports ready for direct download.</p>
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
            
            <motion.div variants={cardVariants} whileHover="hover" className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '20px', borderTop: '4px solid var(--gold-primary)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid rgba(212, 175, 55, 0.5)' }}>
                <CheckCircle2 size={36} color="var(--gold-primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>Free Client Leads</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem' }}>We send high-quality wedding leads to our partner studios for FREE. Grow your booking calendar without spending a single rupee on ads.</p>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover" className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '20px', borderTop: '4px solid var(--gold-primary)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid rgba(212, 175, 55, 0.5)' }}>
                <Shield size={36} color="var(--gold-primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>Bespoke Editing & Delivery</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem' }}>We edit photos, videos, and design albums exactly to your custom requirements. We can even print and <strong style={{color: 'var(--gold-primary)'}}>deliver albums directly to your clients</strong> completely anonymously under your brand name.</p>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover" className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '20px', borderTop: '4px solid var(--gold-primary)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid rgba(212, 175, 55, 0.5)' }}>
                <Clock size={36} color="var(--gold-primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>SLA Guaranteed Delivery</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem' }}>Photos culled in 48 hours. Cinematic videos in 7 days. Our workflow is flawlessly optimized. If we miss a deadline, you get a 20% refund.</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '10rem 2rem', background: '#050505', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ y: y1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3, background: 'radial-gradient(circle at center, rgba(212,175,55,0.2) 0%, transparent 70%)' }} />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <h2 className="liquid-gold-text" style={{ fontSize: '4rem', marginBottom: '2rem', fontWeight: 800 }}>Ready to Scale Your Studio?</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')} 
              className="liquid-btn" 
              style={{ padding: '1.5rem 4rem', fontSize: '1.3rem', borderRadius: '50px', boxShadow: '0 0 30px rgba(212,175,55,0.3)' }}
            >
              Partner With Us Today
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default B2BLanding;
