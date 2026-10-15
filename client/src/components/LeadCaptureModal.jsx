import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Calendar, Phone, User, Info, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import './LeadCaptureModal.css';

const LeadCaptureModal = () => {
  const location = useLocation();
  const { content } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    eventType: 'Wedding'
  });

  // Suppress completely on booking, checkout or client portal
  const isExcluded = location.pathname.startsWith('/order') || 
                     location.pathname.startsWith('/booking') || 
                     location.pathname.startsWith('/checkout') ||
                     location.pathname.startsWith('/client');

  useEffect(() => {
    if (isExcluded) return;

    // Show modal after 60 seconds of passive browsing
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('leadModalClosed') && !isExcluded) {
        setIsOpen(true);
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [isExcluded]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('leadModalClosed', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const settings = content?.global?.siteSettings || {};
    const footerData = content?.global?.footer || {};
    const rawPhone = settings.whatsapp || settings.phone || footerData.phone || '919876543210';
    const cleanPhone = String(rawPhone).replace(/[^0-9]/g, '') || '919876543210';

    const message = `నమస్కారం! నేను వెడ్డింగ్ ఆల్బమ్ కొటేషన్ కోసం వివరాలు పంపిస్తున్నాను:%0A%0A*పేరు:* ${formData.name}%0A*ఫోన్:* ${formData.phone}%0A*ఈవెంట్ తేదీ:* ${formData.date}%0A*ఈవెంట్ రకం:* ${formData.eventType}`;
    
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    handleClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen || isExcluded) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content glass-3d" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={handleClose}><X size={24} /></button>
        
        <div className="modal-header">
          <div className="hero-eyebrow">✦ Limited Time ✦</div>
          <h2 className="font-serif">Get a Free Quote</h2>
          <p className="text-muted">Fill out this quick form and we'll reply on WhatsApp within 15 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="lead-form">
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input 
              type="text" 
              name="name" 
              placeholder="Your Name" 
              required 
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <Phone size={18} className="input-icon" />
            <input 
              type="tel" 
              name="phone" 
              placeholder="WhatsApp Number" 
              required 
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <Calendar size={18} className="input-icon" />
            <input 
              type="date" 
              name="date" 
              required 
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <Info size={18} className="input-icon" />
            <select name="eventType" value={formData.eventType} onChange={handleChange}>
              <option value="Wedding">Wedding (Pelli)</option>
              <option value="Pre-Wedding">Pre-Wedding Shoot</option>
              <option value="Half Saree">Half Saree / Dhoti</option>
              <option value="Birthday">Birthday</option>
              <option value="Other">Other Event</option>
            </select>
          </div>

          <button type="submit" className="btn btn-gold modal-submit">
            Get Quote via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
