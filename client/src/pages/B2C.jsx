import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Flipbook from '../components/Flipbook';
import MockWhatsApp from '../components/MockWhatsApp';
import { UploadCloud, Palette, Monitor, Truck, X, Check, Heart } from 'lucide-react';
import PackageSection from '../components/PackageSection';
import { useContent } from '../context/ContentContext';
import './B2C.css';

const B2C = () => {
  const { content } = useContent();
  const [selectedImage, setSelectedImage] = useState(null);

  const b2cHeroImage = content?.global?.siteImages?.b2cHeroImage;
  const galleryImages = content?.global?.siteImages?.b2cGalleryImages || [
    { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', alt: 'Wedding Couple' },
    { src: 'https://images.unsplash.com/photo-1544641979-51478546b3f7?auto=format&fit=crop&q=80&w=800', alt: 'Rings' },
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', alt: 'Venue' },
    { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800', alt: 'Album Spread' },
    { src: 'https://images.unsplash.com/photo-1583089892943-e02e5be26e10?auto=format&fit=crop&q=80&w=800', alt: 'Details' },
    { src: 'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?auto=format&fit=crop&q=80&w=800', alt: 'Decor' },
  ];

  const flipbookImages = content?.global?.siteImages?.b2cFlipbookImages || [
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1583089892943-e02e5be26e10?auto=format&fit=crop&q=80&w=600'
  ];

  return (
    <div className="b2c-page">
      
      {/* Ambient Neon Glows */}
      <div className="b2c-ambient-1"></div>
      <div className="b2c-ambient-2"></div>

      {/* Hero Section */}
      <section className="b2c-hero" style={b2cHeroImage ? { backgroundImage: `url('${b2cHeroImage}')`, backgroundBlendMode: 'overlay' } : {}}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <div className="b2c-badge animate-pulse" style={{ backgroundColor: '#D4AF37', color: 'black', fontWeight: 'bold' }}>
            ALBUMS + EDITING + PRINTING STARTING AT ₹2,000
          </div>
          <h1 className="b2c-title">
            Your Wedding Story, <br /> Cinematically Bound.
          </h1>
          <p className="b2c-subtitle" style={{ fontSize: '1.4rem' }}>
            <span className="telugu-text">మీ జ్ఞాపకాలు మా బాధ్యత</span> (Your memories are our responsibility).
            <br />
            Upload your digital gallery and let our expert designers craft a luxury physical heirloom.
          </p>
          <Link to="/order" className="btn btn-gold-3d">
            Start Your Album Order
          </Link>
        </motion.div>
      </section>

      {/* Dynamic Pricing Section */}
      <section className="b2c-pricing-container" style={{ padding: '80px 0', backgroundColor: '#0a0a0a' }}>
        <PackageSection type="b2c" />
      </section>

      {/* Interactive 3D Proofing */}
      <section className="b2c-interactive-section">
        <div className="b2c-interactive-grid">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="b2c-viewer-container"
          >
             <Flipbook pages={flipbookImages} />
             <div className="b2c-viewer-hint">
               <Monitor size={16} /> Interactive 3D Viewer — Drag to turn pages
             </div>
          </motion.div>

          <div className="b2c-interactive-content">
            <h2>Experience Your Layout in 3D.</h2>
            <p>
              No more guessing what your physical album will look like. Review your custom layout in our fully interactive 3D digital viewer before approving it for print.
            </p>
            <ul className="b2c-feature-list">
              {['Lifelike page turns and physics', 'Leave revision comments directly on spreads', 'One-click print approval'].map((item, i) => (
                <li key={i}>
                  <div className="b2c-check"><Check size={16}/></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </section>

      {/* The Process */}
      <section className="b2c-process-section">
        <div className="b2c-process-header">
          <h2>How It Works</h2>
          <p className="b2c-subtitle">From digital gallery to physical heirloom.</p>
        </div>

        <div className="b2c-process-grid">
          {[
            { icon: <UploadCloud size={32}/>, title: 'Upload', desc: 'Securely upload your favorites via our portal.' },
            { icon: <Palette size={32}/>, title: 'Design', desc: 'Our experts craft a cinematic layout.' },
            { icon: <Monitor size={32}/>, title: 'Review', desc: 'Approve your album in 3D.' },
            { icon: <Truck size={32}/>, title: 'Deliver', desc: 'Receive your luxury layflat album.' }
          ].map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.15 }}
              className="b2c-process-card"
            >
              <div className="b2c-process-icon">
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Album Quality & Sheets Explanation */}
      <section className="b2c-quality-explanation">
        <div className="b2c-quality-header">
          <h2>Feel Your Memories <br/><span className="telugu-text" style={{ fontSize: '1.2rem', marginTop: '10px' }}>మీ ఆల్బమ్ క్వాలిటీ (Sheet Types)</span></h2>
          <p className="b2c-subtitle">What makes our wedding albums the best choice for your Pelli?</p>
        </div>

        <div className="b2c-quality-grid">
          <div className="b2c-quality-text">
            <h3>The Art of Album Designing</h3>
            <p>Your wedding photos are more than just pictures; they are the story of your biggest day. Our expert designers take your raw photos, apply <strong>cinematic color grading</strong> to make the gold jewelry shine and the silk sarees pop, and arrange them into a beautiful narrative layout.</p>
          </div>
          
          <div className="b2c-sheet-types">
            <motion.div className="b2c-sheet-card" whileHover={{ scale: 1.02 }}>
              <Heart className="b2c-sheet-icon" />
              <h4>NT (Non-Tearable) Paper</h4>
              <p>Lifetime guarantee! Waterpadina, pillalu lagina chigadu (Waterproof and tear-proof). The absolute best choice for Indian homes.</p>
            </motion.div>
            <motion.div className="b2c-sheet-card" whileHover={{ scale: 1.02 }}>
              <Heart className="b2c-sheet-icon" />
              <h4>Metallic Finish</h4>
              <p>Perfect for your grand reception and Mehendi shots. It gives the photos a rich, glowing, 3D-like metallic shine.</p>
            </motion.div>
            <motion.div className="b2c-sheet-card" whileHover={{ scale: 1.02 }}>
              <Heart className="b2c-sheet-icon" />
              <h4>Velvet / Feather Touch</h4>
              <p>A royal, soft feel in your hands. When you touch the pages, it feels like smooth velvet. Perfect for luxury portraits.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="b2c-gallery-section">
        <div className="b2c-gallery-header">
          <h2>Quality You Can Feel</h2>
          <p className="b2c-subtitle">Printed on 300GSM archival paper, designed to last a lifetime.</p>
        </div>
        
        <div className="b2c-masonry">
          {galleryImages.map((img, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="b2c-masonry-item"
              onClick={() => setSelectedImage(img.src || img.image)}
            >
               <img src={img.src || img.image} alt={img.alt} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* WhatsApp Invites */}
      <section className="b2c-interactive-section" style={{ paddingBottom: '160px' }}>
        <div className="b2c-interactive-grid">
          <div className="b2c-interactive-content">
            <h2>Go Digital.</h2>
            <p>
              We design stunning cinematic video invitations customized with your photos and event details, perfectly formatted for WhatsApp.
            </p>
            <Link to="/contact" className="btn btn-gold-3d" style={{ marginTop: '20px' }}>
              Order Digital Invite
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
             <MockWhatsApp />
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="b2c-lightbox" onClick={() => setSelectedImage(null)}>
          <button className="b2c-lightbox-close" onClick={() => setSelectedImage(null)}>
             <X size={24} />
          </button>
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            src={selectedImage} 
            alt="Fullscreen" 
            className="b2c-lightbox-img" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
      
    </div>
  );
};

export default B2C;
