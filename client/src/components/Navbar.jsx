import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, X, LogIn, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const { cartItems, toggleCart } = useCart();
  const { content } = useContent();
  const { user } = useAuth();

  const navData = content?.global?.navbar || content?.navbar || {};
  const { lang, toggleLang } = useLanguage();

  const defaultLinks = lang === 'TE' 
    ? [
        { name: 'హోమ్', path: '/' },
        { name: 'స్టోర్ & ధరలు', path: '/shop' },
        { name: 'ఆల్బమ్స్', path: '/albums' },
        { name: 'గ్యాలరీ', path: '/portfolio' },
        { name: 'ట్రాక్', path: '/track' },
        { name: 'ముహూర్తాలు', path: '/muhurtham' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Store & Pricing', path: '/shop' },
        { name: 'Albums', path: '/albums' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Track Order', path: '/track' },
        { name: 'Muhurtham Dates', path: '/muhurtham' },
      ];

  const navLinks = Array.isArray(navData.links) && navData.links.length > 0
    ? navData.links
    : defaultLinks;

  const ctaText = navData.ctaText || (lang === 'TE' ? 'ఆర్డర్ చేయండి' : 'Order Album');
  const ctaLink = navData.ctaLink || '/shop';
  const progressRef = React.useRef(null);
  const isScrolledRef = React.useRef(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const shouldScroll = currentY > 50;
          if (shouldScroll !== isScrolledRef.current) {
            isScrolledRef.current = shouldScroll;
            setIsScrolled(shouldScroll);
          }

          if (progressRef.current) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalHeight > 0 ? (currentY / totalHeight) * 100 : 0;
            progressRef.current.style.width = `${progress}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar (Direct GPU Accelerated Width) */}
      <div ref={progressRef} className="scroll-progress" style={{ width: '0%' }} />

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link 
            to="/" 
            className="nav-logo" 
            style={{ textDecoration: 'none' }}
            onClick={() => {
              setMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Logo size={38} />
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

          {/* Desktop Nav Actions */}
          <div className="nav-actions">
            <button 
              onClick={toggleLang}
              className="lang-toggle-btn"
              title="తెలుగు / English"
            >
              {lang === 'EN' ? 'తెలుగు' : 'English'}
            </button>
            {user ? (
              <Link to="/client" className="btn btn-outline" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} />
                <span>{user.name ? user.name.split(' ')[0] : 'Dashboard'}</span>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <LogIn size={15} />
                <span>Login</span>
              </Link>
            )}
            <button onClick={toggleCart} className="cart-toggle-btn" aria-label="Open cart">
              <ShoppingBag size={22} />
              {cartItems?.length > 0 && (
                <span className="cart-badge">
                  {cartItems.length}
                </span>
              )}
            </button>
            <Link to={ctaLink} className="btn btn-gold-3d nav-cta">{ctaText}</Link>
          </div>

          {/* Mobile Header Controls (Cart, Lang, Hamburger) */}
          <div className="mobile-nav-controls">
            <button 
              onClick={toggleLang}
              className="lang-toggle-btn mobile-lang-btn"
              title="తెలుగు / English"
            >
              {lang === 'EN' ? 'తె' : 'EN'}
            </button>
            <button onClick={toggleCart} className="cart-toggle-btn" aria-label="Open cart">
              <ShoppingBag size={22} />
              {cartItems?.length > 0 && (
                <span className="cart-badge">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile Menu Backdrop */}
        <div className={`mobile-backdrop ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

        {/* Mobile Menu Drawer */}
        <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
          <div className="drawer-header">
            <Link to="/" className="drawer-logo" onClick={() => setMenuOpen(false)}>
              <Logo size={30} />
            </Link>
            <button 
              className="drawer-close-btn" 
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <div className="drawer-content">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="drawer-link" onClick={() => setMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {user ? (
                <Link to="/client" className="btn btn-outline" style={{ justifyContent: 'center', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setMenuOpen(false)}>
                  <User size={16} />
                  <span>Dashboard ({user.name ? user.name.split(' ')[0] : 'My Account'})</span>
                </Link>
              ) : (
                <Link to="/login" className="btn btn-outline" style={{ justifyContent: 'center', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setMenuOpen(false)}>
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              )}
              <Link to={ctaLink} className="btn btn-gold-3d" style={{ justifyContent: 'center', padding: '0.8rem' }} onClick={() => setMenuOpen(false)}>
                {ctaText}
              </Link>
              <a 
                href={`https://wa.me/${String(content?.global?.siteSettings?.whatsapp || content?.siteSettings?.whatsapp || content?.global?.navbar?.whatsapp || content?.navbar?.whatsapp || content?.global?.siteSettings?.phone || content?.siteSettings?.phone || '919494845111').replace(/[^0-9]/g, '')}?text=${encodeURIComponent("నమస్కారం! నేను వెడ్డింగ్ ఆల్బమ్ డిజైన్ & వీడియో ఎడిటింగ్ సర్వీసెస్ గురించి అడగాలనుకుంటున్నాను.")}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline" 
                style={{ justifyContent: 'center', padding: '0.8rem', borderColor: 'rgba(37,211,102,0.4)', color: '#25D366', background: 'rgba(37,211,102,0.06)' }}
                onClick={() => setMenuOpen(false)}
              >
                WhatsApp Concierge 💬
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
