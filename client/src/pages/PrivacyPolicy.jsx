import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="home">
      <Navbar />
      <div style={{ padding: '8rem 2rem 4rem', maxWidth: '900px', margin: '0 auto', minHeight: '100vh', color: '#fff' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#D4AF37', fontFamily: 'var(--font-heading)' }}>Privacy Policy</h1>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>1. Data Security & Storage</h2>
          <p style={{ color: '#aaa', marginBottom: '2rem', lineHeight: '1.6' }}>
            We employ enterprise-grade AWS S3 buckets with AES-256 encryption for all raw file uploads and finalized exports. Your data is stored temporarily for the duration of the editing process plus 30 days post-delivery. After 30 days, all raw files and project files are permanently purged from our active servers.
          </p>

          <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>2. Zero-Marketing Use</h2>
          <p style={{ color: '#aaa', marginBottom: '2rem', lineHeight: '1.6' }}>
            For our B2B Studio Partners: We will absolutely never use your client's wedding photos or videos for our own marketing, portfolio, or social media without explicit written consent from your studio. We respect the privacy of the couples and the proprietary ownership of the photographer.
          </p>

          <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>3. Location Data Collection</h2>
          <p style={{ color: '#aaa', marginBottom: '2rem', lineHeight: '1.6' }}>
            During the B2B Studio and Creator network registration, we utilize standard HTML5 Geolocation alongside OpenStreetMap's Nominatim API to autofill your Region, City, and Pincode. This geographic data is strictly used to pair local studios with local editors who understand regional traditions (e.g., Telugu Wedding customs). We do not track continuous location.
          </p>

          <h2 style={{ color: '#D4AF37', marginBottom: '1rem' }}>4. Payment Processing</h2>
          <p style={{ color: '#aaa', lineHeight: '1.6' }}>
            All payments are processed securely via Razorpay. WeddingAlbums.in does not store, nor do we have access to, your credit card numbers, CVV codes, or UPI PINs.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
