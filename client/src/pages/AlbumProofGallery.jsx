import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const AlbumProofGallery = () => {
  return (
    <div className="dashboard-page">
      <h2>Album Proofs</h2>
      
      <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '40px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <ImageIcon size={64} style={{ color: 'var(--text-muted)', marginBottom: '20px', opacity: 0.5 }} />
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>No Active Proofs</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          When your album design is ready for review, the spreads will appear here. You'll be able to add comments and approve the design before printing.
        </p>
      </div>
    </div>
  );
};

export default AlbumProofGallery;
