import React from 'react';
import { Target, ShieldCheck, BookOpen, ArrowRight, MapPin, Layers, IndianRupee, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import GoldenParticles from '../components/GoldenParticles';
import Logo from '../components/Logo';

const EditorLanding = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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
        
        <header style={{ position: 'relative', zIndex: 1, padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Logo size={45} />
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Login</button>
            <button onClick={() => navigate('/signup')} className="liquid-btn" style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Join Network</button>
          </motion.div>
        </header>

        <main style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
          <motion.div 
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            style={{ marginBottom: '2rem' }}
          >
            <Sparkles size={72} color="var(--accent-primary)" style={{ filter: 'drop-shadow(0 0 30px rgba(99,102,241,1))' }} />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            style={{ fontSize: '6rem', marginBottom: '1.5rem', lineHeight: '1.1', fontWeight: 900, background: 'linear-gradient(to right, #818cf8, #c084fc, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.3))' }}
          >
            Edit. Deliver.<br />Get Paid.
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '750px', marginBottom: '3.5rem' }}
          >
            Join WeddingAlbums.in's elite network of freelance video editors, photo retouchers, and album designers. Consistent work, guaranteed payouts.
          </motion.p>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button onClick={() => navigate('/signup')} className="liquid-btn" style={{ padding: '1.2rem 3rem', fontSize: '1.3rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
              Take the Assessment <ArrowRight size={24} />
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
      <section style={{ padding: '8rem 2rem', background: '#050505', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', fontSize: '4rem', marginBottom: '6rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            The Creator Journey
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
                style={{ width: '100px', height: '100px', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-primary)', background: '#050505', boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}
              >
                <MapPin size={40} color="var(--accent-primary)" />
              </motion.div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>1. Claim Local Jobs</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>Browse the queue for jobs in your region. Understand local traditions to grade and edit with cultural context.</p>
            </motion.div>

            <motion.div variants={itemVariants} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 15 }}
                style={{ width: '100px', height: '100px', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-primary)', background: '#050505', boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}
              >
                <Layers size={40} color="var(--accent-primary)" />
              </motion.div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>2. Smart Workspaces</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>Use our tailored Kanban boards designed specifically for DaVinci Resolve, Premiere Pro, and Lightroom workflows.</p>
            </motion.div>

            <motion.div variants={itemVariants} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '100px', height: '100px', margin: '0 auto 2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent-primary)', background: '#050505', boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}
              >
                <IndianRupee size={40} color="var(--accent-primary)" />
              </motion.div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>3. 1-Click Payouts</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>No chasing studios for invoices. Complete a job, get it approved by QC, and withdraw instantly to your bank via UPI.</p>
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
              <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>Jobs for Free</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem' }}>No subscription fees. No bidding wars. We assign high-quality jobs directly to you for <strong style={{color: 'var(--accent-primary)'}}>FREE</strong> based on your skills and regional expertise.</p>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover" className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '20px', borderTop: '4px solid var(--accent-primary)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.5)' }}>
                <ShieldCheck size={36} color="var(--accent-primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>Guaranteed Payment</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem' }}>The money is held in escrow by WeddingAlbums.in. Once the job is completed and approved by QC, payment is released to you instantly. No chasing clients!</p>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover" className="glass-panel" style={{ padding: '3rem 2rem', borderRadius: '20px', borderTop: '4px solid var(--accent-primary)' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.5)' }}>
                <BookOpen size={36} color="var(--accent-primary)" />
              </div>
              <h3 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1.8rem', fontWeight: 700 }}>Gamified Growth</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem' }}>Maintain a &gt;4.8 star rating to unlock 'Premium Pay' assignments. Plus, get free access to our massive library of premium LUTS and presets.</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '10rem 2rem', background: '#050505', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ y: y1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3, background: 'radial-gradient(circle at center, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <h2 style={{ fontSize: '4rem', marginBottom: '2rem', fontWeight: 800, background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ready to Monetize Your Skills?</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')} 
              className="liquid-btn" 
              style={{ padding: '1.5rem 4rem', fontSize: '1.3rem', borderRadius: '50px', boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}
            >
              Start Application
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default EditorLanding;
