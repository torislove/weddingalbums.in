import React from 'react';
import { Image as ImageIcon, BookOpen, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AlbumProofGallery = () => {
  return (
    <div className="dashboard-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', margin: '0 0 6px 0' }}>Album Proofing Studio</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Review high-resolution spreads, leave margin notes, and approve your photobook design.</p>
      </div>

      {/* Active Proof Card */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(212,175,55,0.25)', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.8rem', background: 'rgba(212,175,55,0.15)', color: '#D4AF37', padding: '3px 10px', borderRadius: '999px', fontWeight: 600, border: '1px solid rgba(212,175,55,0.3)' }}>
                3D Interactive Proof
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Updated 2 hours ago</span>
            </div>
            <h3 style={{ margin: '4px 0 6px 0', fontSize: '1.3rem', color: '#fff' }}>Royal Wedding Photobook — First Draft Spreads</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>40 Pages • Flush Mount 12x18 • Matte Velvet Finish</p>
          </div>
          <Link 
            to="/proofing/sample" 
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            <BookOpen size={16} /> Open 3D Viewer <ExternalLink size={14} />
          </Link>
        </div>

        {/* Spread Previews */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '16px' }}>
          {[
            { title: 'Cover & Title Spread', img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=400' },
            { title: 'Ceremony & Vows', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400' },
            { title: 'Reception Highlights', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400' }
          ].map((spread, i) => (
            <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)' }}>
              <img src={spread.img} alt={spread.title} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
              <div style={{ padding: '8px 10px', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 500 }}>
                {spread.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Guidelines */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#fff' }}>Proofing Instructions</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <li>Flip through the virtual pages using arrow keys or clicking corner edges.</li>
          <li>Check that all names, dates, and religious inscriptions are spelled correctly.</li>
          <li>Once approved, your file is immediately sent to our laser printing lab in Hyderabad.</li>
        </ul>
      </div>
    </div>
  );
};

export default AlbumProofGallery;
