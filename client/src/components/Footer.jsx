import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import GoldenMandala from './GoldenMandala';
import { useContent } from '../context/ContentContext';
import './Footer.css';

const Footer = () => {
  const { content } = useContent();
  const footerData = content?.global?.footer || {};
  const settings = content?.global?.siteSettings || {};

  const brandName = footerData.companyName || settings.brandName || 'weddingalbums.in';
  const description = footerData.description || 'Capturing the vibrant traditions and cinematic moments of Andhra Pradesh. Specializing in Pelli, Nischitartham, and premium album designs.';
  const address = footerData.address || settings.address || 'MG Road, Vijayawada, AP 520010';
  const phone = footerData.phone || settings.phone || '+91 98765 43210';
  const email = footerData.email || settings.email || 'hello@cinematicweddings.in';
  const marqueeText = footerData.marqueeText || 'Vijayawada • Visakhapatnam • Guntur • Tirupati • Rajahmundry • Kurnool • Hyderabad • ';
  
  const instagram = footerData.social?.instagram || settings.instagram || '#';
  const youtube = footerData.social?.youtube || settings.youtube || '#';
  const facebook = footerData.social?.facebook || settings.facebook || '#';

  const quickLinks = Array.isArray(footerData.quickLinks) && footerData.quickLinks.length > 0
    ? footerData.quickLinks
    : [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Testimonials', path: '/testimonials' },
        { name: 'Contact', path: '/contact' }
      ];

  return (
    <footer className="footer">
      <GoldenMandala 
        size={800} 
        opacity={0.03} 
        style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          animation: 'spin 120s linear infinite',
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="footer-grid">
          {/* Brand & Description */}
          <div className="footer-col">
            <h3 className="text-gradient">{brandName}</h3>
            <p className="footer-desc">
              {description}
            </p>
            <div className="social-links">
              {instagram && instagram !== '#' && (
                <a href={instagram} className="social-icon" target="_blank" rel="noreferrer" title="Instagram">
                  <Instagram size={20} />
                </a>
              )}
              {youtube && youtube !== '#' && (
                <a href={youtube} className="social-icon" target="_blank" rel="noreferrer" title="YouTube">
                  <Youtube size={20} />
                </a>
              )}
              {facebook && facebook !== '#' && (
                <a href={facebook} className="social-icon" target="_blank" rel="noreferrer" title="Facebook">
                  <Facebook size={20} />
                </a>
              )}
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path || '/'}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="contact-info">
              {address && (
                <div className="contact-item">
                  <MapPin size={18} color="var(--color-secondary)" />
                  <span>{address}</span>
                </div>
              )}
              {phone && (
                <div className="contact-item">
                  <Phone size={18} color="var(--color-secondary)" />
                  <a href={`tel:${phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{phone}</a>
                </div>
              )}
              {email && (
                <div className="contact-item">
                  <Mail size={18} color="var(--color-secondary)" />
                  <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{email}</a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Dynamic Footer Marquee */}
        {marqueeText && (
          <div className="footer-marquee-container">
            <div className="footer-marquee">
              {Array(4).fill(marqueeText).map((text, i) => (
                <span key={i}>{text}</span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {brandName}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
