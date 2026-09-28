import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import './Testimonials.css';

const REVIEWS = [
  {
    id: 1,
    category: 'wedding',
    name: "Anjali & Karthik Reddy",
    event: "Telugu Wedding",
    eventTel: "పెళ్ళి",
    location: "Vijayawada",
    text: "The way they edited our Talambralu video was pure magic. Every frame was color graded to look like a painting. The premium flush mount album we received is our family's most prized possession."
  },
  {
    id: 2,
    category: 'prewedding',
    name: "Swathi & Ravi Varma",
    event: "Pre-Wedding Shoot",
    eventTel: "ప్రీ-వెడ్డింగ్",
    location: "Vizag",
    text: "The cinematic teaser they edited from our raw footage was breathtaking. We showed the save-the-date video to our families and everyone was in tears. Highly professional post-production team."
  },
  {
    id: 3,
    category: 'wedding',
    name: "Priya & Venkat",
    event: "Mangala Snanam",
    eventTel: "మంగళ స్నానం",
    location: "Rajahmundry",
    text: "I was very particular about how I wanted my Mangala Snanam pictures retouched. They removed all blemishes while keeping the skin textures completely natural. The color grading on the final video looks like a high-budget Tollywood movie!"
  },
  {
    id: 4,
    category: 'halfsaree',
    name: "Lakshmi Srinivasan",
    event: "Half Saree Ceremony",
    eventTel: "ఓణీ వేడుక",
    location: "Guntur",
    text: "We used them to design the flex banners and hoardings for our daughter's half saree function. The attention to detail and traditional borders were amazing. The photos in the final Karizma album were printed flawlessly."
  },
  {
    id: 5,
    category: 'wedding',
    name: "Neha & Srinivas",
    event: "Nischitartham & Pelli",
    eventTel: "నిశ్చితార్థం",
    location: "Tirupati",
    text: "100% in-house editing makes a huge difference. We sent our raw data and got our album layout within a week. The design quality was top-notch. Their understanding of Tirupati local customs in the highlight video was commendable."
  },
  {
    id: 6,
    category: 'events',
    name: "Ramesh Babu Family",
    event: "Grand 1st Birthday",
    eventTel: "మొదటి పుట్టినరోజు",
    location: "Hyderabad",
    text: "The album design is so cute and the highlight video perfectly captured the chaotic joy of the evening. The fast delivery of the Instagram reels was a huge bonus!"
  },
  {
    id: 7,
    category: 'wedding',
    name: "Divya & Harsha",
    event: "Pellikuturu Ceremony",
    eventTel: "పెళ్లికూతురు",
    location: "Kurnool",
    text: "The background replacement and color correction on our outdoor mandap shots saved the entire event. The editors removed all the distracting elements and delivered perfectly clean portraits."
  },
  {
    id: 8,
    category: 'prewedding',
    name: "Sowmya & Arjun",
    event: "Outdoor Shoot",
    eventTel: "ప్రీ-వెడ్డింగ్",
    location: "Araku Valley",
    text: "We wanted a misty, romantic vibe for our pre-wedding and they delivered exactly that through their advanced color grading and compositing. They gave us epic, larger-than-life portraits."
  }
];

const FILTERS = [
  { id: 'all', label: 'All Reviews' },
  { id: 'wedding', label: 'Weddings' },
  { id: 'prewedding', label: 'Pre-Weddings' },
  { id: 'halfsaree', label: 'Half Saree' },
  { id: 'events', label: 'Events' }
];

const Testimonials = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredReviews = activeFilter === 'all' 
    ? REVIEWS 
    : REVIEWS.filter(r => r.category === activeFilter);

  return (
    <div className="testimonials-page">
      <div className="page-hero" style={{ backgroundImage: "url('/kalamkari-bg.jpg')" }}>
        <ScrollReveal>
          <div className="hero-eyebrow" style={{ textAlign: 'center' }}>✦ True Stories ✦</div>
          <h1 className="text-gradient font-serif">Wall of Love</h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Don't just take our word for it. Read the real experiences of couples whose timeless memories we've had the honor to capture.
          </p>
        </ScrollReveal>
      </div>

      {/* Stats Strip */}
      <section className="stats-bar" style={{ padding: '2.5rem 0', background: 'var(--bg-darker)' }}>
        <div className="container">
          <div className="grid grid-3 text-center" style={{ gap: '1rem' }}>
            <ScrollReveal>
              <h3 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>
                <AnimatedCounter target={500} suffix="+" />
              </h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Happy Couples</p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h3 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>
                <AnimatedCounter target={12} suffix="+" />
              </h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Years Experience</p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <h3 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>
                <AnimatedCounter target={28} suffix="" />
              </h3>
              <p className="text-muted" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Cities Across AP</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Google Reviews Banner */}
      <section className="section pb-0 text-center">
        <ScrollReveal className="google-review-banner glass-3d glow-border" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', borderRadius: '50px' }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" style={{ width: '30px' }} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '4px', color: '#fbbc05' }}>
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>4.9/5 Rating on Google</span>
          </div>
          <span style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', marginLeft: '1rem' }}><CheckCircle2 size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> 150+ Verified Reviews</span>
        </ScrollReveal>
      </section>

      {/* Filters and Grid */}
      <div className="container section">
        <ScrollReveal className="text-center mb-5">
          <div className="portfolio-filters">
            {FILTERS.map(filter => (
              <button 
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div key={activeFilter} className="masonry-grid">
          {filteredReviews.map((review, idx) => (
            <ScrollReveal key={review.id} delay={(idx % 3) * 100} className="testimonial-card glass-3d glow-border masonry-item">
              <div className="quote-icon-bg">"</div>
              <div className="stars">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="testimonial-text">"{review.text}"</p>
              
              <div className="testimonial-footer">
                <div className="author-info">
                  <h4>{review.name}</h4>
                  <div className="event-meta">
                    <span className="event-type">{review.event}</span>
                    <span className="telugu-text" style={{ fontSize: '0.75rem', margin: '0 8px' }}>• {review.eventTel} •</span>
                    <span className="location"><MapPin size={12} style={{ display: 'inline', marginRight: '2px' }} /> {review.location}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
      
      <div className="container pb-6 text-center mt-4">
        <ScrollReveal>
          <h2 className="text-gradient font-serif mb-4">Ready to Start Your Story?</h2>
          <p className="text-muted mb-4">Let's create timeless memories together.</p>
          <Link to="/contact" className="btn btn-primary">Check Availability <MessageCircle size={18} style={{ marginLeft: '8px' }} /></Link>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Testimonials;
