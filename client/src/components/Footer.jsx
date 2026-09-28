import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import GoldenMandala from './GoldenMandala';
import { useContent } from '../context/ContentContext';
import './Footer.css';

const Footer = () => {
  const { content } = useContent();
  const settings = content?.global?.siteSettings || {
    brandName: 'Cinematic Weddings',
    phone: '+91 98765 43210',
    email: 'hello@cinematicweddings.in',
    address: 'MG Road, Vijayawada, AP 520010',
    instagram: '#',
    youtube: '#'
  };

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
          <div className="footer-col">
            <h3 className="text-gradient">{settings.brandName}</h3>
            <p className="footer-desc">
              Capturing the vibrant traditions and cinematic moments of Andhra Pradesh. 
              Specializing in Pelli, Nischitartham, and premium album designs.
            </p>
            <div className="social-links">
              {settings.instagram && settings.instagram !== '#' && <a href={settings.instagram} className="social-icon" target="_blank" rel="noreferrer"><Instagram size={20} /></a>}
              {settings.youtube && settings.youtube !== '#' && <a href={settings.youtube} className="social-icon" target="_blank" rel="noreferrer"><Youtube size={20} /></a>}
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/testimonials">Testimonials</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={18} color="var(--color-secondary)" />
                <span>{settings.address}</span>
              </div>
              <div className="contact-item">
                <Phone size={18} color="var(--color-secondary)" />
                <span>{settings.phone}</span>
              </div>
              <div className="contact-item">
                <Mail size={18} color="var(--color-secondary)" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-marquee-container">
          <div className="footer-marquee">
            {Array(5).fill('Vijayawada • Visakhapatnam • Guntur • Tirupati • Rajahmundry • Kurnool • Hyderabad • ').map((text, i) => (
              <span key={i}>{text}</span>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {settings.brandName}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
