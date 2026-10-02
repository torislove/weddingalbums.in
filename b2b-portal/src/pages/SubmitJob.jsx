import React, { useState } from 'react';
import { FileType, CheckCircle, ChevronRight, HardDrive, Video, BookOpen, Layers, UploadCloud } from 'lucide-react';

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
    uploadMethod: 'direct'
  });

  const nextDisabled = () => {
    if (step === 1) return !formData.jobType;
    if (step === 2) return !formData.eventName || !formData.eventDate || !formData.fileCount;
    return false;
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }
      
      const response = await fetch('http://localhost:4000/api/b2b/jobs', {
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
          instructions: formData.instructions,
          raw_files_link: formData.referenceLink || 'Direct Upload (Coming Soon)',
          region: 'Andhra/TS' // Hardcoded for this context
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Job Submitted Successfully! ID: ${data.id}`);
        // Optionally redirect to dashboard or reset form
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
    <div className="page-content fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Submit New Job</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Send your RAW files and let our expert human editors handle the rest.</p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {[
          { num: 1, label: 'Select Service' },
          { num: 2, label: 'Event Details' },
          { num: 3, label: 'Requirements' },
          { num: 4, label: 'Upload' },
          { num: 5, label: 'Confirm' }
        ].map((s, i, arr) => (
          <React.Fragment key={s.num}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= s.num ? 'var(--gold-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= s.num ? 'var(--gold-primary)' : 'var(--bg-tertiary)', color: step >= s.num ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{s.num}</div>
              <span>{s.label}</span>
            </div>
            {i < arr.length - 1 && <ChevronRight size={16} color="var(--text-muted)" />}
          </React.Fragment>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '3rem' }}>
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>What do you need edited?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>All services are handled manually by expert editors. No AI automation.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
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
                    padding: '1.5rem', 
                    borderRadius: '12px', 
                    cursor: 'pointer', 
                    textAlign: 'center', 
                    transition: 'all 0.3s ease', 
                    background: formData.jobType === type.id ? 'rgba(212, 175, 55, 0.05)' : 'transparent' 
                  }}
                >
                  <type.icon size={36} color={formData.jobType === type.id ? 'var(--gold-primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 1rem' }} />
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{type.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Event Details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Event Name</label>
                <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="e.g. Suresh Babu & Ramya Devi" value={formData.eventName} onChange={e => setFormData({...formData, eventName: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Event Type</label>
                <select className="form-control" style={{ paddingLeft: '1rem' }} value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})}>
                  <option>Pellikuturu</option>
                  <option>Haldi / Pellikoduku</option>
                  <option>Sangeet</option>
                  <option>Wedding Reception</option>
                  <option>Full Wedding Package</option>
                  <option>Pre-Wedding Shoot</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Event Date</label>
                <input type="date" className="form-control" style={{ paddingLeft: '1rem' }} value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Quantity (Files or Hours)</label>
                <input type="text" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="e.g. 2500 photos, or 4 hours footage" value={formData.fileCount} onChange={e => setFormData({...formData, fileCount: e.target.value})} required />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Your Requirements (Plain English)</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Editing Style Required</label>
                <select className="form-control" style={{ paddingLeft: '1rem' }} value={formData.editingStyle} onChange={e => setFormData({...formData, editingStyle: e.target.value})}>
                  <option>Warm Gold Tones</option>
                  <option>Cinematic Teal & Orange</option>
                  <option>Natural / Sathi-ranga (True Color)</option>
                  <option>Light & Airy</option>
                  <option>Custom (Describe below)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Delivery Format Required</label>
                <select className="form-control" style={{ paddingLeft: '1rem' }} value={formData.deliveryFormat} onChange={e => setFormData({...formData, deliveryFormat: e.target.value})}>
                  <option>Google Drive</option>
                  <option>WeTransfer</option>
                  <option>Direct Download</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Reference Links (Optional)</label>
              <input type="url" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="Paste a YouTube or Instagram link to show us the style you want" value={formData.referenceLink} onChange={e => setFormData({...formData, referenceLink: e.target.value})} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Special Instructions</label>
              <textarea className="form-control" style={{ paddingLeft: '1rem' }} rows="5" placeholder="Type any specific requests here... (E.g. Please make sure the red sarees pop, and blur the background in the Pellikuturu wide shots.)" value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})}></textarea>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Upload RAW Assets</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              {[
                { id: 'direct', label: 'Direct Upload' },
                { id: 'gdrive', label: 'Google Drive Link' },
                { id: 'wetransfer', label: 'WeTransfer Link' }
              ].map(method => (
                <div 
                  key={method.id}
                  onClick={() => setFormData({...formData, uploadMethod: method.id})}
                  style={{ 
                    padding: '1rem', 
                    textAlign: 'center', 
                    border: `2px solid ${formData.uploadMethod === method.id ? 'var(--gold-primary)' : 'var(--bg-tertiary)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: formData.uploadMethod === method.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    color: formData.uploadMethod === method.id ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  {method.label}
                </div>
              ))}
            </div>

            {formData.uploadMethod === 'direct' && (
              <div style={{ border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-tertiary)' }}>
                <UploadCloud size={48} color="var(--gold-primary)" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ marginBottom: '0.5rem' }}>Drag & Drop RAW files here</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Supports ZIP, RAW, DNG, CR2, MP4</p>
                <button className="btn-outline" style={{ margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HardDrive size={18} /> Browse Local Files
                </button>
              </div>
            )}

            {formData.uploadMethod !== 'direct' && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Paste your {formData.uploadMethod === 'gdrive' ? 'Google Drive' : 'WeTransfer'} link below:</label>
                <input type="url" className="form-control" style={{ paddingLeft: '1rem' }} placeholder="https://..." />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Make sure the link permissions are set to "Anyone with the link can view/download".</p>
              </div>
            )}
            
            <div style={{ padding: '1rem', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem' }}>
              <strong>Tip:</strong> Prefer sending via WhatsApp? Just submit the job here, and ping our support number with your Job ID!
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.4rem', margin: '0 0 1.5rem 0' }}>Confirm Job Details</h3>
            
            <div style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid var(--gold-primary)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', fontSize: '0.95rem' }}>
                <div>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Event Name</p>
                  <p style={{ color: '#fff', margin: 0, fontWeight: 500 }}>{formData.eventName}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Service Required</p>
                  <p style={{ color: '#fff', margin: 0, fontWeight: 500, textTransform: 'capitalize' }}>{formData.jobType.replace('-', ' ')}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Quantity</p>
                  <p style={{ color: '#fff', margin: 0, fontWeight: 500 }}>{formData.fileCount}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', margin: '0 0 0.2rem' }}>Editing Style</p>
                  <p style={{ color: '#fff', margin: 0, fontWeight: 500 }}>{formData.editingStyle}</p>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0' }}>Estimated Price</p>
                <h2 className="liquid-gold-text" style={{ margin: 0 }}>₹1,500 - ₹2,500</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.25rem 0' }}>SLA Deadline Guarantee</p>
                <h3 style={{ margin: 0, color: '#fff' }}>48 Working Hours</h3>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          {step > 1 ? (
            <button className="btn-outline" onClick={handlePrev}>Back</button>
          ) : <div></div>}
          
          {step < 5 ? (
            <button className="btn-gold" onClick={handleNext} disabled={nextDisabled()} style={{ opacity: nextDisabled() ? 0.5 : 1 }}>Continue <ChevronRight size={18} /></button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', fontSize: '1.1rem' }}>Submit Manual Job <CheckCircle size={20} /></button>
          )}
        </div>

      </div>
    </div>
  );
};

export default SubmitJob;
