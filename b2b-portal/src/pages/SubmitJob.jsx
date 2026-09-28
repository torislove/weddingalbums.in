import React, { useState } from 'react';
import { Upload, FileType, CheckCircle, ChevronRight, HardDrive } from 'lucide-react';

const SubmitJob = () => {
  const [step, setStep] = useState(1);
  const [jobType, setJobType] = useState('photo'); // photo, video, album

  return (
    <div className="page-content fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Submit New Job</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Send your raw files and let our experts handle the rest.</p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 1 ? 'var(--gold-primary)' : 'var(--text-muted)' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= 1 ? 'var(--gold-primary)' : 'var(--bg-tertiary)', color: step >= 1 ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
          <span>Select Type</span>
        </div>
        <ChevronRight size={16} color="var(--text-muted)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 2 ? 'var(--gold-primary)' : 'var(--text-muted)' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= 2 ? 'var(--gold-primary)' : 'var(--bg-tertiary)', color: step >= 2 ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
          <span>Details & Brief</span>
        </div>
        <ChevronRight size={16} color="var(--text-muted)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 3 ? 'var(--gold-primary)' : 'var(--text-muted)' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= 3 ? 'var(--gold-primary)' : 'var(--bg-tertiary)', color: step >= 3 ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
          <span>Upload Files</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
        {step === 1 && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '1.5rem' }}>What do you need edited?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div 
                onClick={() => setJobType('photo')}
                style={{ border: `2px solid ${jobType === 'photo' ? 'var(--gold-primary)' : 'var(--glass-border)'}`, padding: '2rem', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s ease', background: jobType === 'photo' ? 'rgba(212, 175, 55, 0.05)' : 'transparent' }}
              >
                <FileType size={40} color={jobType === 'photo' ? 'var(--gold-primary)' : 'var(--text-muted)'} style={{ marginBottom: '1rem' }} />
                <h4>Photo Editing</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Culling, Retouching, Global Color</p>
              </div>
              <div 
                onClick={() => setJobType('video')}
                style={{ border: `2px solid ${jobType === 'video' ? 'var(--gold-primary)' : 'var(--glass-border)'}`, padding: '2rem', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s ease', background: jobType === 'video' ? 'rgba(212, 175, 55, 0.05)' : 'transparent' }}
              >
                <FileType size={40} color={jobType === 'video' ? 'var(--gold-primary)' : 'var(--text-muted)'} style={{ marginBottom: '1rem' }} />
                <h4>Video Editing</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Cinematic Teasers, Reels, Full Films</p>
              </div>
              <div 
                onClick={() => setJobType('album')}
                style={{ border: `2px solid ${jobType === 'album' ? 'var(--gold-primary)' : 'var(--glass-border)'}`, padding: '2rem', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s ease', background: jobType === 'album' ? 'rgba(212, 175, 55, 0.05)' : 'transparent' }}
              >
                <FileType size={40} color={jobType === 'album' ? 'var(--gold-primary)' : 'var(--text-muted)'} style={{ marginBottom: '1rem' }} />
                <h4>Album Design</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>12x18, 12x36 layouts, Storybook</p>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-gold" onClick={() => setStep(2)}>Continue <ChevronRight size={18} /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '1.5rem' }}>Job Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Client / Event Name</label>
                <input type="text" className="form-control" placeholder="e.g. Ramesh & Sita Wedding" />
              </div>
              <div className="form-group">
                <label>Event Date</label>
                <input type="date" className="form-control" />
              </div>
            </div>
            
            {jobType === 'photo' && (
              <div className="form-group">
                <label>Editing Style Brief</label>
                <select className="form-control">
                  <option>Warm & Moody (Standard)</option>
                  <option>Light & Airy</option>
                  <option>Cinematic Teal & Orange</option>
                  <option>Natural / True to Color</option>
                </select>
              </div>
            )}
            
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label>Special Instructions</label>
              <textarea className="form-control" rows="4" placeholder="Any specific requirements..."></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-outline" onClick={() => setStep(1)}>Back</button>
              <button className="btn-gold" onClick={() => setStep(3)}>Continue <ChevronRight size={18} /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '1.5rem' }}>Upload Assets</h3>
            
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--accent-primary)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '4px' }}>✨ AI Smart Culling Enabled</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Bandwidth saver: Our AI will cull local files before uploading, saving up to 80% data.</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round" style={{ background: 'var(--accent-primary)' }}></span>
              </label>
            </div>

            <div style={{ border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-tertiary)', marginBottom: '1.5rem' }}>
              <Upload size={48} color="var(--gold-primary)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Drag & Drop RAW files here</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Supports ZIP, RAW, DNG, CR2, NEF (Max 50GB via SmartLink)</p>
              <button className="btn-outline" style={{ margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HardDrive size={18} /> Browse Local Files
              </button>
            </div>
            
            <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)' }}>OR</div>
            
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label>Provide WeTransfer / Google Drive Link</label>
              <input type="url" className="form-control" placeholder="https://..." />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-outline" onClick={() => setStep(2)}>Back</button>
              <button className="btn-gold"><CheckCircle size={18} /> Submit Job</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitJob;
