import React, { useState } from 'react';
import { Upload, Sparkles, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import './PhotoCulling.css';
import { useT } from '../context/LanguageContext';

const PhotoCulling = () => {
  const t = useT();
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
      <section className="section bg-gradient text-center" style={{ paddingTop: 'clamp(2rem, 5vh, 4rem)' }}>
        <div className="container">
          <ScrollReveal>
            <h1 className="hero-title">{t('cull.title_pre')} <span>{t('cull.title_span')}</span></h1>
            <p className="hero-subtitle text-muted">{t('cull.sub')}</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="culling-workspace glass-3d">
            {!results && (
              <>
                <div className="upload-box" style={{ padding: 'clamp(2rem, 6vw, 3.5rem) 1.25rem', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', width: '100%' }} onClick={() => document.getElementById('cull-upload').click()}>
                  <Upload size={44} color="var(--color-secondary)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t('cull.upload_title')}</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>{t('cull.upload_sub')}</p>
                  <input type="file" id="cull-upload" multiple hidden onChange={handleUpload} accept="image/*" />
                </div>
                
                {images.length > 0 && (
                  <div className="cull-actions" style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ marginBottom: '1rem' }}>{t('cull.queued', { n: images.length })}</p>
                    <button className="btn btn-primary glow-border" onClick={handleCull} disabled={isProcessing} style={{ width: '100%', padding: '1rem' }}>
                      {isProcessing ? t('cull.analyzing') : <><Sparkles size={20} /> {t('cull.run')}</>}
                    </button>
                  </div>
                )}
              </>
            )}

            {results && (
              <div className="results-box text-center">
                <CheckCircle2 size={64} color="#34A853" style={{ marginBottom: '1rem' }} />
                <h2>{t('cull.done')}</h2>
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 120px), 1fr))', gap: '1rem', marginTop: '2rem' }}>
                  <div className="stat-card" style={{ background: 'rgba(52, 168, 83, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#34A853' }}>{results.selected}</h3>
                    <p>{t('cull.selected')}</p>
                  </div>
                  <div className="stat-card" style={{ background: 'rgba(234, 67, 53, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#EA4335' }}>{results.blurry}</h3>
                    <p>{t('cull.blurry')}</p>
                  </div>
                  <div className="stat-card" style={{ background: 'rgba(251, 188, 5, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                    <h3 style={{ color: '#FBBC05' }}>{results.duplicates}</h3>
                    <p>{t('cull.duplicates')}</p>
                  </div>
                </div>
                <button className="btn btn-outline" style={{ marginTop: '2rem' }} onClick={() => setResults(null)}>{t('cull.new_batch')}</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PhotoCulling;
