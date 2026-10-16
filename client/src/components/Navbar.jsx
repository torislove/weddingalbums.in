import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useContent } from '../context/ContentContext';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const { cartItems, toggleCart } = useCart();
  const { content } = useContent();

  const navData = content?.global?.navbar || {};
  const [lang, setLang] = useState(() => localStorage.getItem('site_lang') || 'EN');

  const defaultLinks = lang === 'TE' 
    ? [
        { name: 'హోమ్', path: '/' },
        { name: 'సేవలు', path: '/services' },
        { name: 'గ్యాలరీ', path: '/portfolio' },
        { name: 'ధరలు', path: '/pricing' },
        { name: 'ముహూర్తాలు', path: '/muhurtham' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Muhurtham Dates', path: '/muhurtham' },
      ];

  const navLinks = Array.isArray(navData.links) && navData.links.length > 0
    ? navData.links
    : defaultLinks;

  const ctaText = navData.ctaText || (lang === 'TE' ? 'ఆర్డర్ చేయండి' : 'Order Album');
  const ctaLink = navData.ctaLink || '/order';
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

  return (
    <>
      {/* Scroll Progress Bar (Direct GPU Accelerated Width) */}
      <div ref={progressRef} className="scroll-progress" style={{ width: '0%' }} />

      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <Logo size={38} portalTag="Heirloom Studio" />
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
              onClick={() => {
                const next = lang === 'EN' ? 'TE' : 'EN';
                setLang(next);
                localStorage.setItem('site_lang', next);
                window.dispatchEvent(new Event('languageChange'));
              }}
              className="lang-toggle-btn"
              title="తెలుగు / English"
            >
              {lang === 'EN' ? 'తెలుగు' : 'English'}
            </button>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
              Couples Portal
            </Link>
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
              onClick={() => {
                const next = lang === 'EN' ? 'TE' : 'EN';
                setLang(next);
                localStorage.setItem('site_lang', next);
                window.dispatchEvent(new Event('languageChange'));
              }}
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
          <div className="drawer-content">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="drawer-link" onClick={() => setMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ justifyContent: 'center', padding: '0.8rem' }} onClick={() => setMenuOpen(false)}>
                Couples Portal
              </Link>
              <Link to={ctaLink} className="btn btn-gold-3d" style={{ justifyContent: 'center', padding: '0.8rem' }} onClick={() => setMenuOpen(false)}>
                {ctaText}
              </Link>
              <a 
                href={`https://wa.me/${String(content?.global?.siteSettings?.whatsapp || content?.global?.siteSettings?.phone || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent("నమస్కారం! నేను వెడ్డింగ్ ఆల్బమ్ డిజైన్ & వీడియో ఎడిటింగ్ సర్వీసెస్ గురించి అడగాలనుకుంటున్నాను.")}`}
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
