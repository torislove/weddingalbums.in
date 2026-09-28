import React from 'react';
import './MobileBookingBar.css';
import { Phone, MessageCircle } from 'lucide-react';

const MobileBookingBar = () => {
  const phoneNumber = "910000000000";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hello! I am looking for a quote.`;

  return (
    <div className="mobile-booking-bar">
      <a href={`tel:+${phoneNumber}`} className="mobile-bar-btn btn-call">
        <Phone size={18} />
        <span>Call Now</span>
      </a>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mobile-bar-btn btn-wa">
        <MessageCircle size={18} />
        <span>WhatsApp</span>
      </a>
    </div>
  );
};

export default MobileBookingBar;
