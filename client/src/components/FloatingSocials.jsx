import React from 'react';
import { useContent } from '../context/ContentContext';
import { Youtube, Instagram, MessageCircle } from 'lucide-react';
import './FloatingSocials.css';

const FloatingSocials = () => {
  const { content } = useContent();
  const settings = content?.global?.siteSettings || {
    whatsapp: '910000000000',
    instagram: '#',
    youtube: '#'
  };

  const whatsappMessage = "నమస్కారం! మీ album/editing services గురించి అడగాలనుకుంటున్నాను";
  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="floating-socials-container">
      {settings.youtube && settings.youtube !== '#' && (
        <a href={settings.youtube} className="floating-btn youtube-btn" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <Youtube size={24} />
        </a>
      )}
      
      {settings.instagram && settings.instagram !== '#' && (
        <a href={settings.instagram} className="floating-btn instagram-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <Instagram size={24} />
        </a>
      )}

      <a href={whatsappUrl} className="whatsapp-float-btn" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <div className="pulse-ring"></div>
        <div className="pulse-ring delay"></div>
        <div className="wa-icon-container">
          <MessageCircle size={28} fill="currentColor" />
        </div>
        <span className="wa-text">వాట్సాప్ లో చాట్ చేయండి</span>
      </a>
    </div>
  );
};

export default FloatingSocials;
