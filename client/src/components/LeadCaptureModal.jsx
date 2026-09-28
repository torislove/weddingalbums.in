import React, { useState, useEffect } from 'react';
import { X, Calendar, Phone, User, Info } from 'lucide-react';
import './LeadCaptureModal.css';

const LeadCaptureModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    eventType: 'Wedding'
  });

  useEffect(() => {
    // Show modal after 45 seconds of engagement
    const timer = setTimeout(() => {
      // Check if user hasn't already closed it in a previous session
      if (!sessionStorage.getItem('leadModalClosed')) {
        setIsOpen(true);
      }
    }, 45000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('leadModalClosed', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format message for WhatsApp
    const message = `Hello! I am looking for a quote.%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Date:* ${formData.date}%0A*Event:* ${formData.eventType}`;
    
    // Redirect to WhatsApp
    window.open(`https://wa.me/910000000000?text=${message}`, '_blank');
    handleClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

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
