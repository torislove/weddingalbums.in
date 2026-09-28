import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const { cartItems, toggleCart } = useCart();

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
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <Logo size={40} />
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
            <button onClick={toggleCart} className="cart-toggle-btn" style={{ background: 'transparent', border: 'none', color: '#D4AF37', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingBag size={24} />
              {cartItems?.length > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-8px', background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartItems.length}
                </span>
              )}
            </button>
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
