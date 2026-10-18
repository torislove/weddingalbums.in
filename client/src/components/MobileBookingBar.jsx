import React from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import './MobileBookingBar.css';

const MobileBookingBar = () => {
  const location = useLocation();
  const { content } = useContent();

  // Hide on order/booking/checkout pages where the wizard has its own primary action bar
  const isBookingFlow = location.pathname.startsWith('/order') || 
                        location.pathname.startsWith('/booking') || 
                        location.pathname.startsWith('/checkout') ||
                        location.pathname.startsWith('/client');

  if (isBookingFlow) return null;

  const settings = content?.global?.siteSettings || content?.siteSettings || {};
  const footerData = content?.global?.footer || content?.footer || {};
  const navbarData = content?.global?.navbar || content?.navbar || {};
  const rawPhone = settings.phone || navbarData.phone || footerData.phone || '+91 9346793364';
  const cleanPhone = String(rawPhone).replace(/[^0-9]/g, '') || '919346793364';
  const rawWa = settings.whatsapp || navbarData.whatsapp || footerData.whatsapp || cleanPhone;
  const cleanWa = String(rawWa).replace(/[^0-9]/g, '') || '919346793364';

  const defaultMsg = "నమస్కారం! నేను వెడ్డింగ్ ఆల్బమ్ డిజైన్ & వీడియో ఎడిటింగ్ సర్వీసెస్ గురించి తెలుసుకోవాలనుకుంటున్నాను.";
  const whatsappUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <div className="mobile-booking-bar" role="navigation" aria-label="Quick Contact Actions">
      <a href={`tel:+${cleanPhone}`} className="mobile-bar-btn btn-call" aria-label="Call studio direct">
        <Phone size={17} />
        <span>Direct Call</span>
      </a>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mobile-bar-btn btn-wa" aria-label="Chat on WhatsApp">
        <MessageCircle size={18} />
        <span>WhatsApp Chat</span>
      </a>
    </div>
  );
};

export default MobileBookingBar;
