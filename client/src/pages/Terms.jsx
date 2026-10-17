import React from 'react';

const Terms = () => {
  return (
    <div className="terms-page">
      <div style={{ padding: 'clamp(6rem, 12vh, 8rem) 1.25rem 4rem', maxWidth: '900px', margin: '0 auto', minHeight: '80vh', color: 'var(--paper)' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1.5rem', color: 'var(--brand)', fontFamily: 'var(--font-heading)' }}>Terms & Conditions</h1>
        
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: 'clamp(1.25rem, 3vw, 2rem)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ color: 'var(--brand)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>1. B2B White-Labeling Agreement</h2>
          <p style={{ color: '#aaa', marginBottom: '1.75rem', lineHeight: '1.7', fontSize: '0.95rem' }}>
            WeddingAlbums.in operates as an invisible backend post-production engine for partner studios. We strictly adhere to a white-label policy. We will never contact your clients directly, and all deliverables (including the Client Proofing galleries) are completely unbranded or branded with your Studio's logo. Your raw assets remain your intellectual property.
          </p>

          <h2 style={{ color: 'var(--brand)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>2. Turnaround Time (SLA) & Refunds</h2>
          <p style={{ color: '#aaa', marginBottom: '1.75rem', lineHeight: '1.7', fontSize: '0.95rem' }}>
            Standard photo culling and retouching will be delivered within 48-72 hours. Cinematic video edits require 7-10 business days depending on the selected package. In the rare event we breach our agreed SLA by more than 48 hours without prior communication, you are entitled to a 20% refund on the processing fee for that specific job.
          </p>

          <h2 style={{ color: 'var(--brand)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>3. Quality Revisions</h2>
          <p style={{ color: '#aaa', marginBottom: '1.75rem', lineHeight: '1.7', fontSize: '0.95rem' }}>
            All B2B and B2C packages include two (2) free rounds of revisions for Video Edits and Album Designs. Any subsequent revisions that involve changing the core style (e.g., requesting a dark moody grade after approving a bright & airy grade) will be billed at an hourly rate of ₹499/hr.
          </p>

          <h2 style={{ color: 'var(--brand)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>4. Content Guidelines</h2>
          <p style={{ color: '#aaa', lineHeight: '1.7', fontSize: '0.95rem' }}>
            We do not accept or process any explicit, illegal, or non-consensual imagery. All assets uploaded to our servers must be legally obtained by the photographer or client. WeddingAlbums.in reserves the right to terminate any B2B account that violates these terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
