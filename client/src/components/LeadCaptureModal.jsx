import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Calendar, Phone, User, Info, Sparkles, Send, MessageCircle } from 'lucide-react';
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

  // Suppress on booking, checkout or client portal where primary actions take precedence
  const isExcluded = location.pathname.startsWith('/order') || 
                     location.pathname.startsWith('/booking') || 
                     location.pathname.startsWith('/checkout') ||
                     location.pathname.startsWith('/client');

  if (isExcluded) return null;

  const settings = content?.global?.siteSettings || {};
  const footerData = content?.global?.footer || {};
  const rawPhone = settings.whatsapp || settings.phone || footerData.phone || '919876543210';
  const cleanPhone = String(rawPhone).replace(/[^0-9]/g, '') || '919876543210';

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `నమస్కారం! నేను వెడ్డింగ్ ఆల్బమ్ కొటేషన్ కోసం వివరాలు పంపిస్తున్నాను:%0A%0A*పేరు:* ${formData.name}%0A*ఫోన్:* ${formData.phone}%0A*ఈవెంట్ తేదీ:* ${formData.date}%0A*ఈవెంట్ రకం:* ${formData.eventType}`;
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    handleClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Discreet Sticky Right-Side Trigger Tab (Never automatically interrupts the user) */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleToggle}
          className="quote-sticky-trigger"
          aria-label="Open Free Quote Drawer"
          title="Get a Free Quote"
        >
          <span className="quote-trigger-icon">
            <Sparkles size={15} />
          </span>
          <span className="quote-trigger-label">Free Quote</span>
          <span className="quote-trigger-telugu">కొటేషన్</span>
        </button>
      )}

      {/* Dim Backdrop (Click to Dismiss) */}
      <div 
        className={`quote-drawer-backdrop ${isOpen ? 'active' : ''}`} 
        onClick={handleClose}
        aria-hidden={!isOpen}
      />

      {/* Slide-In Right Drawer */}
      <aside 
        className={`quote-right-drawer ${isOpen ? 'open' : ''}`}
        aria-label="Instant Free Quote Drawer"
      >
        <div className="quote-drawer-header">
          <div className="quote-header-badge">
            <Sparkles size={13} />
            <span>INSTANT HEIRLOOM ESTIMATE</span>
          </div>
          <button 
            type="button" 
            className="quote-drawer-close" 
            onClick={handleClose} 
            aria-label="Close quote drawer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="quote-drawer-intro">
          <h2 className="font-serif">Get a Free Quote</h2>
          <p className="text-muted">
            Share your wedding date and requirements. Our senior production director will reply with custom album specs and exact pricing within 15 minutes.
          </p>
          <div className="quote-telugu-hint">
            ఖచ్చితమైన కొటేషన్ కోసం వివరాలు నమోదు చేయండి
          </div>
        </div>

        <form onSubmit={handleSubmit} className="quote-drawer-form">
          <div className="quote-input-group">
            <label htmlFor="lead-name">Your Full Name</label>
            <div className="input-field-wrapper">
              <User size={17} className="field-icon" />
              <input 
                id="lead-name"
                type="text" 
                name="name" 
                placeholder="e.g. Sai Teja / Anusha" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="quote-input-group">
            <label htmlFor="lead-phone">WhatsApp Number</label>
            <div className="input-field-wrapper">
              <Phone size={17} className="field-icon" />
              <input 
                id="lead-phone"
                type="tel" 
                name="phone" 
                placeholder="+91 98765 43210" 
                required 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="quote-input-group">
            <label htmlFor="lead-date">Auspicious Wedding / Event Date</label>
            <div className="input-field-wrapper">
              <Calendar size={17} className="field-icon" />
              <input 
                id="lead-date"
                type="date" 
                name="date" 
                required 
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="quote-input-group">
            <label htmlFor="lead-event">Event Category</label>
            <div className="input-field-wrapper">
              <Info size={17} className="field-icon" />
              <select 
                id="lead-event"
                name="eventType" 
                value={formData.eventType} 
                onChange={handleChange}
              >
                <option value="Wedding">Full Wedding (పెళ్లి & రిసెప్షన్)</option>
                <option value="Pre-Wedding">Pre-Wedding Shoot (ప్రీ-వెడ్డింగ్)</option>
                <option value="Half Saree">Half Saree / Dhoti Ceremony (హాఫ్ శారీ)</option>
                <option value="Reception Only">Reception Only</option>
                <option value="Birthday">Grand Birthday / Anniversary</option>
                <option value="Other">Other Event</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-gold-3d quote-submit-btn">
            <MessageCircle size={18} />
            <span>Send via WhatsApp</span>
          </button>
        </form>

        <div className="quote-drawer-footer">
          <div className="quote-security-note">
            🔒 100% Privacy Guarantee • No Spam Calls • Direct WhatsApp Chat
          </div>
        </div>
      </aside>
    </>
  );
};

export default LeadCaptureModal;
