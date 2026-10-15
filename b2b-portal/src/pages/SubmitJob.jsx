import React, { useState } from 'react';
import { FileType, CheckCircle, ChevronRight, HardDrive, Video, BookOpen, Layers, UploadCloud, Film } from 'lucide-react';

const API = (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:4000'));

const SubmitJob = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobType: '',
    eventName: '',
    eventType: 'Full Wedding',
    eventDate: '',
    fileCount: '',
    editingStyle: 'Warm Gold Tones',
    referenceLink: '',
    instructions: '',
    deliveryFormat: 'Google Drive',
    uploadMethod: 'gdrive',
    cloudLink: ''
  });

  const nextDisabled = () => {
    if (step === 1) return !formData.jobType;
    if (step === 2) return !formData.eventName || !formData.eventDate || !formData.fileCount;
    if (step === 4 && !formData.cloudLink) return true;
    return false;
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('b2bToken');
      if (!token) {
        alert('Please login first');
        return;
      }
      
      const response = await fetch(`${API}/api/b2b/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          job_type: formData.jobType,
          client_name: formData.eventName,
          event_date: formData.eventDate,
          event_type: formData.eventType,
          design_style: formData.editingStyle,
          instructions: `Delivery Format: ${formData.deliveryFormat} | References: ${formData.referenceLink} | Notes: ${formData.instructions}`,
          raw_files_link: formData.cloudLink,
          region: 'Andhra/TS' 
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Job Submitted Successfully! ID: ${data.id}`);
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Failed to submit job');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while submitting job');
    }
  };

  return (
    <div className="page-content reveal active" style={{ maxWidth: '1000px', margin: '0 auto', padding: 'clamp(1rem, 3vw, 2rem)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Submit New Job</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)' }}>Send your RAW files and let our expert human editors handle the rest.</p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch' }}>
        {[
          { num: 1, label: 'Select Service' },
          { num: 2, label: 'Event Details' },
          { num: 3, label: 'Requirements' },
          { num: 4, label: 'Upload Media' },
          { num: 5, label: 'Confirm Job' }
        ].map((s, i, arr) => (
          <React.Fragment key={s.num}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: step >= s.num ? 'var(--gold-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: step >= s.num ? 'var(--gold-primary)' : 'var(--glass-border)', 
                color: step >= s.num ? '#000' : 'var(--text-muted)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                boxShadow: step >= s.num ? '0 0 15px rgba(212,175,55,0.4)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {step > s.num ? <CheckCircle size={18} /> : s.num}
              </div>
              <span style={{ fontWeight: step >= s.num ? 600 : 400, fontSize: '13px' }}>{s.label}</span>
            </div>
            {i < arr.length - 1 && <ChevronRight size={18} color={step > s.num ? "var(--gold-primary)" : "var(--glass-border)"} style={{ opacity: 0.5, flexShrink: 0 }} />}
          </React.Fragment>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: 'clamp(1.2rem, 3vw, 3rem)', position: 'relative', overflow: 'hidden' }}>
        {/* Glow orb */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ animation: 'uiaFadeIn 0.4s ease forwards' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 600 }}>What do you need edited?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '14px' }}>All services are handled manually by expert editors. No AI automation.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem' }}>
              {[
                { id: 'culling', icon: Layers, title: 'Photo Culling', desc: 'Expert human curation of best shots' },
                { id: 'retouch', icon: FileType, title: 'Photo Retouching', desc: 'Color grading & skin smoothing' },
                { id: 'video', icon: Video, title: 'Cinematic Video', desc: 'Teasers, Reels, or Full Films' },
                { id: 'album', icon: BookOpen, title: 'Album Design', desc: '12x18, 12x36 Flush Mount Layouts' },
                { id: 'bundle', icon: CheckCircle, title: 'Full Bundle', desc: 'Photo + Video + Album' }
              ].map(type => (
                <div 
                  key={type.id}
                  onClick={() => setFormData({...formData, jobType: type.id})}
                  style={{ 
                    border: `2px solid ${formData.jobType === type.id ? 'var(--gold-primary)' : 'var(--glass-border)'}`, 
                    padding: '1.5rem 1rem', 
                    borderRadius: '16px', 
                    cursor: 'pointer', 
                    textAlign: 'center', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                    background: formData.jobType === type.id ? 'linear-gradient(180deg, rgba(212,175,55,0.08) 0%, transparent 100%)' : 'var(--bg-tertiary)',
                    transform: formData.jobType === type.id ? 'translateY(-4px)' : 'none',
                    boxShadow: formData.jobType === type.id ? '0 10px 25px rgba(212,175,55,0.1)' : 'none'
                  }}
                >
                  <type.icon size={36} color={formData.jobType === type.id ? 'var(--gold-primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 1rem', transition: 'all 0.3s ease' }} />
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: formData.jobType === type.id ? '#fff' : 'var(--text-secondary)' }}>{type.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{ animation: 'uiaFadeIn 0.4s ease forwards', display: 'grid', gap: '1.5rem' }}>
            <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', margin: 0, fontWeight: 600 }}>Event Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px' }}>Client / Event Name</label>
                <input type="text" className="form-control" style={{ padding: '0.85rem' }} placeholder="e.g. Suresh & Ramya Wedding" value={formData.eventName} onChange={e => setFormData({...formData, eventName: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px' }}>Event Type</label>
                <select className="form-control" style={{ padding: '0.85rem' }} value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})}>
                  <option>Pellikuturu</option>
                  <option>Haldi / Pellikoduku</option>
                  <option>Sangeet</option>
                  <option>Wedding Reception</option>
                  <option>Full Wedding Package</option>
                  <option>Pre-Wedding Shoot</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px' }}>Event Date</label>
                <input type="date" className="form-control" style={{ padding: '0.85rem' }} value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '13px' }}>Estimated Quantity</label>
                <input type="text" className="form-control" style={{ padding: '0.85rem' }} placeholder="e.g. 2500 RAW photos, 4h footage" value={formData.fileCount} onChange={e => setFormData({...formData, fileCount: e.target.value})} required />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={{ animation: 'uiaFadeIn 0.4s ease forwards', display: 'grid', gap: '2rem' }}>
            <h3 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 600 }}>Technical Requirements</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Editing Style Required</label>
                <select className="form-control" style={{ padding: '1rem' }} value={formData.editingStyle} onChange={e => setFormData({...formData, editingStyle: e.target.value})}>
                  <option>Warm Gold Tones</option>
                  <option>Cinematic Teal & Orange</option>
                  <option>Natural / Sathi-ranga (True Color)</option>
                  <option>Light & Airy</option>
                  <option>Custom (Describe below)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Delivery Format Requested</label>
                <select className="form-control" style={{ padding: '1rem' }} value={formData.deliveryFormat} onChange={e => setFormData({...formData, deliveryFormat: e.target.value})}>
                  <option>Google Drive Folder</option>
                  <option>WeTransfer Link</option>
                  <option>Direct Server Download</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Visual Reference Links (Optional)</label>
              <input type="url" className="form-control" style={{ padding: '1rem' }} placeholder="Paste a YouTube or Instagram link to show us the style you want" value={formData.referenceLink} onChange={e => setFormData({...formData, referenceLink: e.target.value})} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Special Instructions / Director's Notes</label>
              <textarea className="form-control" style={{ padding: '1rem', resize: 'vertical' }} rows="4" placeholder="E.g. Please ensure the reds don't clip, blur the background in the Pellikuturu wide shots, focus heavily on the bride's jewelry." value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})}></textarea>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div style={{ animation: 'uiaFadeIn 0.4s ease forwards', display: 'grid', gap: '2rem' }}>
            <h3 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 600 }}>Provide Media</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '-1.5rem' }}>Select your preferred method to transfer your high-resolution files.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { id: 'gdrive', label: 'Google Drive', icon: UploadCloud },
                { id: 'wetransfer', label: 'WeTransfer', icon: Film },
                { id: 'dropbox', label: 'Dropbox', icon: UploadCloud },
                { id: 'physical', label: 'Send Hard Drive', icon: HardDrive }
              ].map(method => (
                <div 
                  key={method.id}
                  onClick={() => setFormData({...formData, uploadMethod: method.id, cloudLink: ''})}
                  style={{ 
                    padding: '1.5rem 1rem', 
                    textAlign: 'center', 
                    border: `2px solid ${formData.uploadMethod === method.id ? 'var(--gold-primary)' : 'var(--glass-border)'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: formData.uploadMethod === method.id ? 'rgba(212, 175, 55, 0.08)' : 'var(--bg-tertiary)',
                    color: formData.uploadMethod === method.id ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.2s ease',
                    transform: formData.uploadMethod === method.id ? 'translateY(-2px)' : 'none'
                  }}
                >
                  <method.icon size={24} style={{ margin: '0 auto 0.5rem', color: formData.uploadMethod === method.id ? 'var(--gold-primary)' : 'var(--text-muted)' }} />
                  <span style={{ fontWeight: 500 }}>{method.label}</span>
                </div>
              ))}
            </div>

            {formData.uploadMethod === 'physical' ? (
              <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <HardDrive size={40} color="var(--gold-primary)" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Ship Your Drive to Our Office</h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Please pack your Hard Disk or Pendrive securely. Submit this job now to generate an ID, and include the Job ID on your shipping label.
                </p>
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '8px', border: '1px dashed rgba(212,175,55,0.3)', display: 'inline-block', textAlign: 'left', color: '#e2e8f0' }}>
                  <strong>WeddingAlbums.in Processing Center</strong><br/>
                  Plot No 45, Jubilee Hills Checkpost<br/>
                  Hyderabad, Telangana 500033<br/>
                  Ph: +91 98765 43210
                </div>
                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--gold-primary)' }}>
                  * We will confirm receipt and begin culling immediately once the drive arrives.
                </p>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <label style={{ display: 'block', marginBottom: '1rem', color: '#fff', fontWeight: 500, fontSize: '1.1rem' }}>
                  Paste your {formData.uploadMethod === 'gdrive' ? 'Google Drive' : formData.uploadMethod === 'wetransfer' ? 'WeTransfer' : 'Dropbox'} Link
                </label>
                <input 
                  type="url" 
                  className="form-control" 
                  style={{ padding: '1.25rem', fontSize: '1.05rem', border: '2px solid rgba(212,175,55,0.3)', background: 'rgba(0,0,0,0.5)' }} 
                  placeholder={`https://${formData.uploadMethod === 'gdrive' ? 'drive.google.com' : formData.uploadMethod === 'wetransfer' ? 'we.tl' : 'dropbox.com'}/...`} 
                  value={formData.cloudLink}
                  onChange={e => setFormData({...formData, cloudLink: e.target.value})}
                  required
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', color: 'var(--gold-primary)', fontSize: '0.9rem' }}>
                  <CheckCircle size={16} />
                  <span>Please ensure link permissions are set to "Anyone with the link can view/download". We handle culling after the order.</span>
                </div>
              </div>
            )}
            
            <div style={{ padding: '1.25rem', background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '24px', height: '24px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <CheckCircle size={14} color="#000" />
              </div>
              <div>
                <strong style={{ color: '#25D366' }}>Pro Tip:</strong> Having trouble? Submit the job first, then WhatsApp our ingest team with your order ID!
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div style={{ animation: 'uiaFadeIn 0.4s ease forwards' }}>
            <h3 style={{ fontSize: '1.6rem', margin: '0 0 2rem 0', fontWeight: 600 }}>Confirm Job Details</h3>
            
            <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(0,0,0,0.2) 100%)', border: '1px solid var(--gold-primary)', borderRadius: '16px', padding: '2.5rem', marginBottom: '2rem', boxShadow: 'inset 0 0 20px rgba(212,175,55,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', fontSize: '1rem' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.4rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Event Name</p>
                  <p style={{ color: '#fff', margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>{formData.eventName}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.4rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Service Required</p>
                  <p style={{ color: '#fff', margin: 0, fontWeight: 600, fontSize: '1.1rem', textTransform: 'capitalize' }}>{formData.jobType.replace('-', ' ')}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.4rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Quantity</p>
                  <p style={{ color: '#fff', margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>{formData.fileCount}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.4rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Editing Style</p>
                  <p style={{ color: '#fff', margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>{formData.editingStyle}</p>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Estimated Price Range</p>
                <h2 className="liquid-gold-text" style={{ margin: 0, fontSize: '2.2rem', letterSpacing: '-1px' }}>₹1,500 - ₹3,500</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>SLA Deadline Guarantee</p>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #10b981' }}></span>
                  48 Working Hours
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {step > 1 ? (
            <button className="btn-outline" onClick={handlePrev} style={{ padding: '0.8rem 2rem' }}>Back</button>
          ) : <div></div>}
          
          {step < 5 ? (
            <button className="btn-gold" onClick={handleNext} disabled={nextDisabled()} style={{ opacity: nextDisabled() ? 0.4 : 1, padding: '0.8rem 2.5rem', cursor: nextDisabled() ? 'not-allowed' : 'pointer' }}>
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button className="btn-gold" onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2.5rem', fontSize: '1.1rem', boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
              Confirm & Submit Job <CheckCircle size={20} />
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes uiaFadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
};

export default SubmitJob;
