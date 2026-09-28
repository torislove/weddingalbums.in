import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { useContent } from '../context/ContentContext';
import Toast from '../components/Toast';
import './Contact.css';

const Contact = () => {
  const { content } = useContent();
  const settings = content?.global?.siteSettings || {
    phone: '+91 98765 43210',
    email: 'hello@cinematicweddings.in',
    address: 'MG Road, Vijayawada, Andhra Pradesh 520010',
    whatsapp: '910000000000'
  };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    eventType: 'wedding',
    date: '',
    venue: '',
    budget: '',
    message: ''
  });
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch('http://localhost:4000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setToastType('success');
      setToastMessage('Details submitted successfully! Redirecting to WhatsApp...');
    } catch (err) {
      setToastType('error');
      setToastMessage('Failed to submit details. Opening WhatsApp...');
    }

    const text = `Hello! I am looking for a quote.
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*City:* ${formData.city}

*Event:* ${formData.eventType}
*Date:* ${formData.date}
*Venue:* ${formData.venue}

*Budget Range:* ${formData.budget}
*Message:* ${formData.message}`;

    setTimeout(() => {
      window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
    }, 1500);
  };

  return (
    <div className="contact-page">
      <div className="page-hero text-center parallax-bg" style={{ backgroundImage: "url('/kalamkari-bg.jpg')", backgroundBlendMode: "overlay" }}>
        <ScrollReveal>
          <h1 className="text-gradient">Let's Talk</h1>
          <p className="text-muted">Book your session or request a custom quote.</p>
        </ScrollReveal>
      </div>

      <div className="container section pt-0 mt-5">
        <div className="grid grid-2">
          
          {/* Contact Info */}
          <div className="contact-info-panel">
            <ScrollReveal delay={100}>
              <h2 className="text-gradient mb-4 font-serif">Get in Touch</h2>
              <p className="text-muted mb-5">
                Whether you're planning a grand Telugu wedding in Vijayawada or a scenic pre-wedding shoot, we're here to capture your beautiful story.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200} className="contact-details">
              <div className="contact-item flex" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div className="icon-box" style={{ background: 'rgba(212,175,55,0.1)', padding: '1rem', borderRadius: '50%' }}>
                  <Phone size={24} color="var(--color-secondary)" />
                </div>
                <div>
                  <h4 style={{ color: 'white' }}>Phone / WhatsApp</h4>
                  <p className="text-muted">{settings.phone}</p>
                </div>
              </div>

              <div className="contact-item flex" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div className="icon-box" style={{ background: 'rgba(212,175,55,0.1)', padding: '1rem', borderRadius: '50%' }}>
                  <Mail size={24} color="var(--color-secondary)" />
                </div>
                <div>
                  <h4 style={{ color: 'white' }}>Email</h4>
                  <p className="text-muted">{settings.email}</p>
                </div>
              </div>

              <div className="contact-item flex" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div className="icon-box" style={{ background: 'rgba(212,175,55,0.1)', padding: '1rem', borderRadius: '50%' }}>
                  <MapPin size={24} color="var(--color-secondary)" />
                </div>
                <div>
                  <h4 style={{ color: 'white' }}>Studio Location</h4>
                  <p className="text-muted">{settings.address}</p>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={300} style={{ marginTop: '3rem' }}>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Operating Cities</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['Vijayawada', 'Vizag', 'Guntur', 'Tirupati', 'Rajahmundry', 'Hyderabad'].map(city => (
                  <span key={city} style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.85rem' }}>{city}</span>
                ))}
              </div>
            </ScrollReveal>
            
            <AvailabilityCalendar />
          </div>

          {/* Contact Wizard */}
          <ScrollReveal delay={400} className="contact-form-panel glass-3d">
            <div className="wizard-header">
              <div className={`wizard-step ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className="wizard-line"></div>
              <div className={`wizard-step ${step >= 2 ? 'active' : ''}`}>2</div>
              <div className="wizard-line"></div>
              <div className={`wizard-step ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>

            <form onSubmit={handleSubmit} className="wizard-form">
              {step === 1 && (
                <div className="wizard-content">
                  <h3 className="mb-4" style={{ color: 'white' }}>Who Are You?</h3>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required placeholder="Your Name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp</label>
                    <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} required placeholder="Your Number" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" name="city" className="form-input" value={formData.city} onChange={handleChange} required placeholder="Your City" />
                  </div>
                  <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-gold" onClick={nextStep}>Next <ArrowRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="wizard-content">
                  <h3 className="mb-4" style={{ color: 'white' }}>About Your Event</h3>
                  <div className="form-group">
                    <label className="form-label">Event Type</label>
                    <select name="eventType" className="form-select" value={formData.eventType} onChange={handleChange}>
                      <option value="wedding">Wedding (Pelli)</option>
                      <option value="prewedding">Pre-Wedding Shoot</option>
                      <option value="engagement">Engagement / Nischitartham</option>
                      <option value="album">Album Design Only</option>
                      <option value="other">Other Events</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Date</label>
                    <input type="date" name="date" className="form-input" value={formData.date} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Venue Location</label>
                    <input type="text" name="venue" className="form-input" value={formData.venue} onChange={handleChange} placeholder="Venue Name / City" />
                  </div>
                  <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-outline" onClick={prevStep}><ArrowLeft size={18} /> Back</button>
                    <button type="button" className="btn btn-gold" onClick={nextStep}>Next <ArrowRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="wizard-content">
                  <h3 className="mb-4" style={{ color: 'white' }}>Final Details</h3>
                  <div className="form-group">
                    <label className="form-label">Expected Budget (₹)</label>
                    <select name="budget" className="form-select" value={formData.budget} onChange={handleChange}>
                      <option value="">Select a range...</option>
                      <option value="50k-1L">₹50,000 - ₹1,00,000</option>
                      <option value="1L-2L">₹1,00,000 - ₹2,00,000</option>
                      <option value="2L+">₹2,00,000+</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Additional Message</label>
                    <textarea name="message" className="form-input" rows="4" value={formData.message} onChange={handleChange} placeholder="Tell us more about your requirements..."></textarea>
                  </div>
                  <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-outline" onClick={prevStep}><ArrowLeft size={18} /> Back</button>
                    <button type="submit" className="btn btn-primary">Send on WhatsApp <Send size={18} /></button>
                  </div>
                </div>
              )}
            </form>
          </ScrollReveal>
        </div>
      </div>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default Contact;
