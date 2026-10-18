import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, X, LogIn, User, Search, ChevronDown, 
  Camera, BookOpen, Video, Gift, Sparkles, MessageCircle, Phone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, toggleCart } = useCart();
  const { content } = useContent();
  const { user } = useAuth();
  const { lang, toggleLang } = useLanguage();

  const navData = content?.global?.navbar || content?.navbar || {};
  const progressRef = useRef(null);
  const isScrolledRef = useRef(false);
  const searchInputRef = useRef(null);
  const dropdownTimerRef = useRef(null);

  const labSettings = content?.global?.siteSettings || content?.global?.footer || content?.global?.navbar || {};
  const labPhone = labSettings.phone || '+91 9346793364';
  const labWhatsapp = labSettings.whatsapp || '919346793364';

  const STORE_DEPARTMENTS = [
    {
      id: 'editing',
      title: lang === 'TE' ? 'ఫొటో ఎడిటింగ్ & డిజైన్' : 'Photo Editing & Designing',
      desc: lang === 'TE' ? 'RAW రీటచింగ్, స్కిన్ పాలిష్ & ఆల్బమ్ డిజైనింగ్' : 'RAW retouching, skin smoothing & PSD layouts',
      icon: <Camera size={18} className="dept-icon-photo" />,
      path: '/shop?tab=editing',
      badge: '24h SLA'
    },
    {
      id: 'albums',
      title: lang === 'TE' ? 'రాయల్ వెడ్డింగ్ ఆల్బమ్స్' : 'Heirloom Lay-Flat Albums',
      desc: lang === 'TE' ? '12×36, 14×40, 3D అక్రిలిక్ & రాయల్ వెల్వెట్' : '12×36, 14×40, 3D Acrylic & Velvet spreads',
      icon: <BookOpen size={18} className="dept-icon-album" />,
      path: '/shop?tab=albums',
      badge: 'Best Seller'
    },
    {
      id: 'video',
      title: lang === 'TE' ? '4K సినిమాటిక్ వీడియో' : '4K Cinematic Video Editing',
      desc: lang === 'TE' ? 'టీజర్లు, హైలైట్స్, డ్రోన్ & మల్టీ-క్యామ్ సింక్' : 'Teasers, highlights, multicam sync & reels',
      icon: <Video size={18} className="dept-icon-video" />,
      path: '/shop?tab=video',
      badge: '4K UHD'
    },
    {
      id: 'flex',
      title: lang === 'TE' ? 'ఫ్లెక్స్ బ్యానర్లు (అన్ని సైజులు)' : 'Flex of All Sizes & Invites',
      desc: lang === 'TE' ? 'కస్టమ్ సైజులు, 440 GSM బ్లాక్అవుట్ & స్టాండీస్' : 'Any custom size (W×H ft), Star Gloss & Stands',
      icon: <Gift size={18} className="dept-icon-flex" />,
      path: '/shop?tab=flex',
      badge: 'Custom Sizing'
    }
  ];

  const defaultLinks = lang === 'TE' 
    ? [
        { name: 'హోమ్', path: '/' },
        { name: 'స్టోర్ & కేటలాగ్', path: '/shop', hasDropdown: true },
        { name: 'ఆల్బమ్స్', path: '/albums' },
        { name: 'గ్యాలరీ', path: '/portfolio' },
        { name: 'ట్రాక్', path: '/track' },
        { name: 'ముహూర్తాలు', path: '/muhurtham' },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Store & Catalog', path: '/shop', hasDropdown: true },
        { name: 'Albums', path: '/albums' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Track Order', path: '/track' },
        { name: 'Muhurtham Dates', path: '/muhurtham' },
      ];

  const navLinks = Array.isArray(navData.links) && navData.links.length > 0
    ? navData.links.map(l => l.path === '/shop' ? { ...l, hasDropdown: true } : l)
    : defaultLinks;

  const ctaText = lang === 'TE' ? 'స్టోర్ చూడండి 🛒' : 'Explore Store 🛒';
  const ctaLink = '/shop';

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
    setStoreDropdownOpen(false);
    setSearchOpen(false);
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

  const handleDropdownEnter = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setStoreDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setStoreDropdownOpen(false);
    }, 250);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    const nextState = !searchOpen;
    setSearchOpen(nextState);
    if (nextState) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
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
            {navLinks.map((link) => {
              if (link.path === '/shop' || link.hasDropdown) {
                return (
                  <li 
                    key={link.name} 
                    className="nav-item-dropdown"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      to="/shop"
                      className={`nav-link store-nav-pill ${location.pathname === '/shop' ? 'active' : ''}`}
                      onClick={() => setStoreDropdownOpen(false)}
                    >
                      <Sparkles size={14} className="store-sparkle-icon" />
                      <span>{link.name}</span>
                      <ChevronDown size={14} className={`dropdown-arrow ${storeDropdownOpen ? 'rotated' : ''}`} />
                    </Link>

                    {/* Store Mega-Dropdown Menu */}
                    <div className={`store-mega-dropdown ${storeDropdownOpen ? 'open' : ''}`}>
                      <div className="dropdown-header">
                        <span className="dropdown-title">
                          {lang === 'TE' ? 'లగ్జరీ స్టోర్ విభాగాలు' : 'Official Services & Catalog'}
                        </span>
                        <Link 
                          to="/shop" 
                          className="dropdown-all-link"
                          onClick={() => setStoreDropdownOpen(false)}
                        >
                          {lang === 'TE' ? 'అన్నీ చూడండి →' : 'View Full Catalog →'}
                        </Link>
                      </div>

                      <div className="departments-grid">
                        {STORE_DEPARTMENTS.map((dept) => (
                          <Link
                            key={dept.id}
                            to={dept.path}
                            className="department-card"
                            onClick={() => setStoreDropdownOpen(false)}
                          >
                            <div className="dept-icon-wrapper">
                              {dept.icon}
                            </div>
                            <div className="dept-info">
                              <div className="dept-header-row">
                                <span className="dept-title">{dept.title}</span>
                                {dept.badge && <span className="dept-badge">{dept.badge}</span>}
                              </div>
                              <p className="dept-desc">{dept.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="dropdown-footer">
                        <div className="dropdown-support-pill">
                          <span className="pill-dot" />
                          <span>Lab Assistance: <strong>{labPhone}</strong></span>
                        </div>
                        <a 
                          href={`https://wa.me/${labWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hi WeddingAlbums.in, I'd like help choosing services from your store.")}`}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="dropdown-wa-link"
                        >
                          <MessageCircle size={14} /> WhatsApp Support
                        </a>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Nav Actions */}
          <div className="nav-actions">
            {/* Quick Live Search Trigger */}
            <div className={`nav-search-wrapper ${searchOpen ? 'expanded' : ''}`}>
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="nav-search-form">
                  <Search size={16} className="search-input-icon" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'TE' ? 'సర్వీస్ లేదా ఆల్బమ్ వెతకండి...' : 'Search editing, albums, 4K video, flex...'}
                    className="nav-search-input"
                  />
                  <button 
                    type="button" 
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="search-close-btn"
                    aria-label="Close search"
                  >
                    <X size={14} />
                  </button>
                </form>
              ) : (
                <button 
                  type="button" 
                  onClick={toggleSearch} 
                  className="nav-search-btn"
                  title="Search Store"
                  aria-label="Search Store"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            <button 
              onClick={toggleLang}
              className="lang-toggle-btn"
              title="తెలుగు / English"
            >
              {lang === 'EN' ? 'తెలుగు' : 'English'}
            </button>

            {user ? (
              <Link to="/client" className="btn btn-outline" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} />
                <span>{user.name ? user.name.split(' ')[0] : 'Dashboard'}</span>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <LogIn size={15} />
                <span>Login</span>
              </Link>
            )}

            <button onClick={toggleCart} className="cart-toggle-btn" aria-label="Open cart">
              <ShoppingBag size={21} />
              {cartItems?.length > 0 && (
                <span className="cart-badge">
                  {cartItems.length}
                </span>
              )}
            </button>

            <Link to={ctaLink} className="btn btn-gold-3d nav-cta">
              {ctaText}
            </Link>
          </div>

          {/* Mobile Header Controls (Search, Cart, Lang, Hamburger) */}
          <div className="mobile-nav-controls">
            <button 
              type="button" 
              onClick={() => {
                navigate('/shop');
              }} 
              className="nav-search-btn mobile-search-btn"
              title="Search Catalog"
              aria-label="Search Catalog"
            >
              <Search size={18} />
            </button>
            <button 
              onClick={toggleLang}
              className="lang-toggle-btn mobile-lang-btn"
              title="తెలుగు / English"
            >
              {lang === 'EN' ? 'తె' : 'EN'}
            </button>
            <button onClick={toggleCart} className="cart-toggle-btn" aria-label="Open cart">
              <ShoppingBag size={21} />
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
            {/* Mobile Store Department Accordion / Quick Links */}
            <div className="drawer-store-section">
              <div className="drawer-section-title">
                <Sparkles size={14} />
                <span>{lang === 'TE' ? 'స్టోర్ విభాగాలు' : 'Store Departments'}</span>
              </div>
              <div className="drawer-departments-list">
                {STORE_DEPARTMENTS.map((dept) => (
                  <Link
                    key={dept.id}
                    to={dept.path}
                    className="drawer-dept-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="dept-mini-icon">{dept.icon}</span>
                    <span className="dept-mini-title">{dept.title}</span>
                    {dept.badge && <span className="dept-mini-badge">{dept.badge}</span>}
                  </Link>
                ))}
              </div>
            </div>

            <div className="drawer-divider" />

            {/* Standard Nav Links */}
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="drawer-link" onClick={() => setMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                href={`https://wa.me/${labWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("నమస్కారం! నేను వెడ్డింగ్ ఆల్బమ్ డిజైన్ & వీడియో ఎడిటింగ్ సర్వీసెస్ గురించి అడగాలనుకుంటున్నాను.")}`}
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

