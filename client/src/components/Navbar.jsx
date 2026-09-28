import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
  ];
  
  const [lang, setLang] = useState('EN');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg" style={{ animation: 'spin 20s linear infinite' }}>
              <circle cx="16" cy="16" r="14" stroke="url(#goldGradient)" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="8" stroke="url(#goldGradient)" strokeWidth="1" strokeDasharray="4 2" />
              <circle cx="16" cy="16" r="4" fill="url(#goldGradient)" />
              {/* aperture blades */}
              {[0,60,120,180,240,300].map((a,i)=>{
                const r = (a * Math.PI) / 180;
                const x1 = 16 + 8 * Math.cos(r);
                const y1 = 16 + 8 * Math.sin(r);
                const x2 = 16 + 13 * Math.cos(r + Math.PI/6);
                const y2 = 16 + 13 * Math.sin(r + Math.PI/6);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#goldGradient)" strokeWidth="1" opacity="0.8" />;
              })}
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#bf953f" />
                  <stop offset="50%" stopColor="#fcf6ba" />
                  <stop offset="100%" stopColor="#aa771c" />
                </linearGradient>
              </defs>
            </svg>
            <div className="logo-text">
              <span className="logo-name liquid-gold-text">weddingalbums.in</span>
              <span className="logo-tagline liquid-gold-text">India</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '20px' }}>
            <button 
              onClick={() => setLang(lang === 'EN' ? 'TE' : 'EN')}
              className="lang-toggle-btn"
              style={{ background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
            >
              {lang === 'EN' ? 'తెలుగు' : 'English'}
            </button>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
              Client Portal
            </Link>
            <Link to="/contact" className="btn btn-gold-3d nav-cta">Book Now</Link>
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        <div className={`mobile-backdrop ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

        {/* Mobile Menu Drawer */}
        <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
          <div className="drawer-content">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="drawer-link" onClick={() => setMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ justifyContent: 'center', padding: '0.8rem' }} onClick={() => setMenuOpen(false)}>
                Client Portal
              </Link>
              <Link to="/contact" className="btn btn-gold-3d" style={{ justifyContent: 'center', padding: '0.8rem' }} onClick={() => setMenuOpen(false)}>
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
