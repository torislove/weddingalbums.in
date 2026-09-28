import React from 'react';
import { Camera, Clock, Heart, Users, Award, Shield } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="overlay"></div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 className="text-4xl md:text-6xl font-serif text-[#D4AF37] mb-6">Our Story</h1>
          <p className="hero-text">
            Rooted in tradition, powered by technology. We are South India's premier post-production studio for Telugu wedding photography.
          </p>
        </div>
      </section>

      <section className="pillars-container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-[#D4AF37] mb-4">The Three Pillars</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Why hundreds of studios and couples trust weddingalbums.in with their most precious memories.</p>
        </div>

        <div className="pillar-card">
          <span className="pillar-number">01</span>
          <div className="pillar-icon-wrapper">
            <div className="icon-glow"></div>
            <Award className="pillar-icon" size={48} />
          </div>
          <div className="pillar-content">
            <h3 className="pillar-title">Uncompromising Quality</h3>
            <p className="pillar-desc">
              Every album is color-graded by experts who understand the warm, golden aesthetics of Telugu weddings. From high-end retouching to Karizma album design, we deliver perfection.
            </p>
          </div>
        </div>

        <div className="pillar-card">
          <span className="pillar-number">02</span>
          <div className="pillar-icon-wrapper">
            <div className="icon-glow"></div>
            <Clock className="pillar-icon" size={48} />
          </div>
          <div className="pillar-content">
            <h3 className="pillar-title">Lightning Fast Speed</h3>
            <p className="pillar-desc">
              We know you want to see your memories immediately. Our 3-5 day turnaround for editing and 3D album proofing is the fastest in the industry.
            </p>
          </div>
        </div>

        <div className="pillar-card">
          <span className="pillar-number">03</span>
          <div className="pillar-icon-wrapper">
            <div className="icon-glow"></div>
            <Heart className="pillar-icon" size={48} />
          </div>
          <div className="pillar-content">
            <h3 className="pillar-title">Crafted With Care</h3>
            <p className="pillar-desc">
              We treat every wedding as if it were our own family's. We ensure 100% white-label confidentiality for our studio partners and joy for our couples.
            </p>
          </div>
        </div>
      </section>

      <section className="about-cta text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
          <div>
            <h4 className="text-4xl font-bold text-[#D4AF37] mb-2">500+</h4>
            <p className="text-gray-400">Albums Delivered</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-[#D4AF37] mb-2">12+</h4>
            <p className="text-gray-400">States Served</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-[#D4AF37] mb-2">4.9★</h4>
            <p className="text-gray-400">Client Rating</p>
          </div>
          <div>
            <h4 className="text-4xl font-bold text-[#D4AF37] mb-2">72h</h4>
            <p className="text-gray-400">Avg. Turnaround</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
