import React from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Youtube, Instagram, MessageCircle } from 'lucide-react';
import './FloatingSocials.css';

const FloatingSocials = () => {
  const location = useLocation();
  const { content } = useContent();

  // Hide on order/booking/checkout/portal pages so it never blocks action buttons
  const isExcluded = location.pathname.startsWith('/order') || 
                     location.pathname.startsWith('/booking') || 
                     location.pathname.startsWith('/checkout') ||
                     location.pathname.startsWith('/client');

  if (isExcluded) return null;

  const settings = content?.global?.siteSettings || content?.siteSettings || {};
  const footerData = content?.global?.footer || content?.footer || {};
  const navbarData = content?.global?.navbar || content?.navbar || {};
  const rawPhone = settings.whatsapp || navbarData.whatsapp || settings.phone || footerData.phone || '919494845111';
  const cleanPhone = String(rawPhone).replace(/[^0-9]/g, '') || '919494845111';

  const whatsappMessage = "నమస్కారం! మీ wedding album & video editing services గురించి ఆర్డర్ / కొటేషన్ వివరాలు తెలుసుకోవాలనుకుంటున్నాను.";
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="floating-socials-container" aria-label="Social and WhatsApp contact">
      {settings.youtube && settings.youtube !== '#' && (
        <a href={settings.youtube} className="floating-btn youtube-btn" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <Youtube size={22} />
        </a>
      )}
      
      {settings.instagram && settings.instagram !== '#' && (
        <a href={settings.instagram} className="floating-btn instagram-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <Instagram size={22} />
        </a>
      )}

      <a href={whatsappUrl} className="whatsapp-float-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <div className="pulse-ring"></div>
        <div className="pulse-ring delay"></div>
        <div className="wa-icon-container">
          <MessageCircle size={26} fill="currentColor" />
        </div>
        <span className="wa-text">వాట్సాప్ లో చాట్ చేయండి</span>
      </a>
    </div>
  );
};

export default FloatingSocials;
