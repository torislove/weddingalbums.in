import React, { useState } from 'react';
import { Upload, Sparkles, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import './PhotoCulling.css';

const PhotoCulling = () => {
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const handleUpload = (e) => {
    // Mock upload
    const files = Array.from(e.target.files);
    setImages(files.map(f => URL.createObjectURL(f)));
  };

  const handleCull = () => {
    setIsProcessing(true);
    // Mock AI processing delay
    setTimeout(() => {
      setResults({
        total: images.length,
        selected: Math.max(1, Math.floor(images.length * 0.4)), // 40% keep rate
        duplicates: Math.floor(images.length * 0.3),
        blurry: Math.floor(images.length * 0.3),
        score: 95
      });
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="page-container culling-page">
      <section className="section bg-gradient text-center" style={{ paddingTop: '150px' }}>
        <div className="container">
          <ScrollReveal>
            <h1 className="hero-title">AI Photo <span>Culling</span></h1>
            <p className="hero-subtitle text-muted">Upload 1000s of RAWs. Let AI pick the best shots, remove duplicates, and discard blurry images in minutes.</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="culling-workspace glass-3d">
            {!results && (
              <>
                <div className="upload-box" style={{ padding: '4rem', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('cull-upload').click()}>
                  <Upload size={48} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
                  <h3>Upload Wedding Folder</h3>
                  <p className="text-muted">Supports JPG, RAW, CR3, NEF (Max 5000 images)</p>
                  <input type="file" id="cull-upload" multiple hidden onChange={handleUpload} accept="image/*" />
                </div>
                
                {images.length > 0 && (
                  <div className="cull-actions" style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ marginBottom: '1rem' }}>{images.length} images queued for analysis.</p>
                    <button className="btn btn-primary glow-border" onClick={handleCull} disabled={isProcessing} style={{ width: '100%', padding: '1rem' }}>
                      {isProcessing ? 'AI is Analyzing...' : <><Sparkles size={20} /> Run AI Culling</>}
                    </button>
                  </div>
                )}
              </>
            )}

            {results && (
              <div className="results-box text-center">
                <CheckCircle2 size={64} color="#34A853" style={{ marginBottom: '1rem' }} />
                <h2>Culling Complete!</h2>
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem' }}>
                  <div className="stat-card" style={{ background: 'rgba(52, 168, 83, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#34A853' }}>{results.selected}</h3>
                    <p>Selected (Best)</p>
                  </div>
                  <div className="stat-card" style={{ background: 'rgba(234, 67, 53, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#EA4335' }}>{results.blurry}</h3>
                    <p>Blurry / Blink</p>
                  </div>
                  <div className="stat-card" style={{ background: 'rgba(251, 188, 5, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#FBBC05' }}>{results.duplicates}</h3>
                    <p>Duplicates</p>
                  </div>
                </div>
                <button className="btn btn-outline" style={{ marginTop: '2rem' }} onClick={() => setResults(null)}>Start New Batch</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PhotoCulling;
