import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import PageHero from '../components/blocks/PageHero';
import ScrollReveal from '../components/ScrollReveal';

const Careers = () => {
  return (
    <div className="careers-page">
      <PageHero 
        title="Join Our Freelance Network"
        subtitle="We are looking for talented photo retouch artists, video editors, and album designers to join our remote workforce."
        bgImage="/kalamkari-bg.jpg"
      />
      
      <section className="py-24 px-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-4xl font-serif text-[#D4AF37] mb-6">Edit From Anywhere, Get Paid on Time</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                weddingalbums.in connects professional wedding studios with elite freelance editors. If you have an eye for cinematic color grading, mastery over Premiere Pro / Lightroom, or love designing premium album spreads, we want you.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                  <h3 className="text-xl text-white font-medium mb-2">💰 Earnings Potential</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <p className="text-sm text-gray-400 mb-2">Jobs per month (Avg ₹3,000 / job)</p>
                      <input type="range" min="1" max="20" defaultValue="5" className="w-full" style={{ accentColor: '#D4AF37' }} onChange={(e) => document.getElementById('calc-result').innerText = `₹${(e.target.value * 3000).toLocaleString()}`} />
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#D4AF37' }}>
                      <span id="calc-result">₹15,000</span><span style={{ fontSize: '0.8rem', color: '#999', fontWeight: 'normal' }}> /mo</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                  <h3 className="text-xl text-white font-medium mb-2">⚡ Instant Payouts</h3>
                  <p className="text-sm text-gray-400">Complete a job, get the funds in your wallet immediately. Request a payout to your UPI or Bank Account anytime.</p>
                </div>
              </div>

              <Link to="/login?role=editor" className="btn btn-gold inline-block">Apply & Take Skills Test</Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/20 to-transparent rounded-2xl transform rotate-3 scale-105"></div>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" alt="Editors working remotely" className="relative rounded-2xl shadow-2xl border border-white/10" />
            </div>
            
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default Careers;
