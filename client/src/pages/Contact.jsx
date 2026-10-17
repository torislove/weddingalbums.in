import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight, ArrowLeft } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { useContent } from '../context/ContentContext';
import { useT } from '../context/LanguageContext';
import Toast from '../components/Toast';
import './Contact.css';
import { API } from '../apiConfig';

const Contact = () => {
  const t = useT();
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
      await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setToastType('success');
      setToastMessage(t('contact.toast_ok'));
    } catch (err) {
      setToastType('error');
      setToastMessage(t('contact.toast_err'));
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
          <h1 className="text-gradient">{t('contact.title')}</h1>
          <p className="text-muted">{t('contact.sub')}</p>
        </ScrollReveal>
      </div>

      <div className="container section pt-0 mt-5">
        <div className="grid grid-2">
          
          {/* Contact Info */}
          <div className="contact-info-panel">
            <ScrollReveal delay={100}>
              <h2 className="text-gradient mb-4 font-serif">{t('contact.get_in_touch')}</h2>
              <p className="text-muted mb-5">
                {t('contact.intro')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={200} className="contact-details">
              <div className="contact-item flex" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div className="icon-box" style={{ background: 'rgba(212,175,55,0.1)', padding: '1rem', borderRadius: '50%' }}>
                  <Phone size={24} color="var(--color-secondary)" />
                </div>
                <div>
                  <h4 style={{ color: 'white' }}>{t('contact.phone')}</h4>
                  <p className="text-muted">{settings.phone}</p>
                </div>
              </div>

              <div className="contact-item flex" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div className="icon-box" style={{ background: 'rgba(212,175,55,0.1)', padding: '1rem', borderRadius: '50%' }}>
                  <Mail size={24} color="var(--color-secondary)" />
                </div>
                <div>
                  <h4 style={{ color: 'white' }}>{t('contact.email')}</h4>
                  <p className="text-muted">{settings.email}</p>
                </div>
              </div>

              <div className="contact-item flex" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div className="icon-box" style={{ background: 'rgba(212,175,55,0.1)', padding: '1rem', borderRadius: '50%' }}>
                  <MapPin size={24} color="var(--color-secondary)" />
                </div>
                <div>
                  <h4 style={{ color: 'white' }}>{t('contact.location')}</h4>
                  <p className="text-muted">{settings.address}</p>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={300} style={{ marginTop: '3rem' }}>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>{t('contact.cities')}</h4>
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
                  <h3 className="mb-4" style={{ color: 'white' }}>{t('contact.who')}</h3>
                  <div className="form-group">
                    <label className="form-label">{t('contact.full_name')}</label>
                    <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required placeholder={t('contact.name_ph')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact.phone_label')}</label>
                    <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} required placeholder={t('contact.phone_ph')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact.city')}</label>
                    <input type="text" name="city" className="form-input" value={formData.city} onChange={handleChange} required placeholder={t('contact.city_ph')} />
                  </div>
                  <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-gold" onClick={nextStep}>{t('contact.next')} <ArrowRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="wizard-content">
                  <h3 className="mb-4" style={{ color: 'white' }}>{t('contact.event_title')}</h3>
                  <div className="form-group">
                    <label className="form-label">{t('contact.event_type')}</label>
                    <select name="eventType" className="form-select" value={formData.eventType} onChange={handleChange}>
                      <option value="wedding">{t('contact.opt.wedding')}</option>
                      <option value="prewedding">{t('contact.opt.prewedding')}</option>
                      <option value="engagement">{t('contact.opt.engagement')}</option>
                      <option value="album">{t('contact.opt.album')}</option>
                      <option value="other">{t('contact.opt.other')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact.event_date')}</label>
                    <input type="date" name="date" className="form-input" value={formData.date} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact.venue')}</label>
                    <input type="text" name="venue" className="form-input" value={formData.venue} onChange={handleChange} placeholder={t('contact.venue_ph')} />
                  </div>
                  <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-outline" onClick={prevStep}><ArrowLeft size={18} /> {t('contact.back')}</button>
                    <button type="button" className="btn btn-gold" onClick={nextStep}>{t('contact.next')} <ArrowRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="wizard-content">
                  <h3 className="mb-4" style={{ color: 'white' }}>{t('contact.final')}</h3>
                  <div className="form-group">
                    <label className="form-label">{t('contact.budget')}</label>
                    <select name="budget" className="form-select" value={formData.budget} onChange={handleChange}>
                      <option value="">{t('contact.budget_select')}</option>
                      <option value="50k-1L">₹50,000 - ₹1,00,000</option>
                      <option value="1L-2L">₹1,00,000 - ₹2,00,000</option>
                      <option value="2L+">₹2,00,000+</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact.message')}</label>
                    <textarea name="message" className="form-input" rows="4" value={formData.message} onChange={handleChange} placeholder={t('contact.message_ph')}></textarea>
                  </div>
                  <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-outline" onClick={prevStep}><ArrowLeft size={18} /> {t('contact.back')}</button>
                    <button type="submit" className="btn btn-primary">{t('contact.send')} <Send size={18} /></button>
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
