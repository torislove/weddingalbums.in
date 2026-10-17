import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Flipbook from '../components/Flipbook';
import LoginModal from '../components/LoginModal';
import Toast from '../components/Toast';
import { API } from '../apiConfig';
import './OrderAlbum.css'; // Reuse form styles
import './PhotographerDashboard.css';
import { useT } from '../context/LanguageContext';

const PhotographerDashboard = () => {
  const t = useT();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const [projects, setProjects] = useState([]);
  const [showNewProject, setShowNewProject] = useState(true); // Default to showing form so they can configure without logging in
  const [newProject, setNewProject] = useState({ 
    clientName: '', 
    eventDate: '', 
    eventType: 'Wedding',
    albumSize: '12x18',
    numPages: 40,
    designStyle: 'Minimal',
    specialInstructions: ''
  });
  const [uploading, setUploading] = useState(false);
  const [rawPhotos, setRawPhotos] = useState([]);
  const [previewAlbum, setPreviewAlbum] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchProjects = async () => {
    if (!user) return; // Don't fetch projects if not logged in
    try {
      const res = await fetch(`${API}/api/projects`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleUploadPhotos = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setUploading(true);
    const uploadedPhotos = [];
    
    for (const file of files) {
      const fd = new FormData();
      fd.append('image', file);
      try {
        const res = await fetch(`${API}/api/upload`, {
          method: 'POST',
          body: fd
        });
        const data = await res.json();
        uploadedPhotos.push(data.url);
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
    
    setRawPhotos(prev => [...prev, ...uploadedPhotos]);
    setUploading(false);
  };

  const handleSubmitJob = async (currentUser = user) => {
    if (!newProject.clientName) {
      setToastMessage(t('pdash.client_name_required'));
      return;
    }

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Create Project
      const projectRes = await fetch(`${API}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          studioName: currentUser.name,
          userId: currentUser.id,
          ...newProject, 
          photos: rawPhotos, 
          status: 'Design Requested' 
        })
      });
      const projectData = await projectRes.json();

      // Create Task for internal team
      await fetch(`${API}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          projectId: projectData.id,
          clientName: projectData.clientName,
          studioName: currentUser.name,
          type: 'B2B Design & Print',
          details: `Size: ${newProject.albumSize}, Pages: ${newProject.numPages}, Style: ${newProject.designStyle}. ${newProject.specialInstructions}`
        })
      });

      setToastMessage(t('pdash.submitted'));
      setProjects([...projects, projectData]);
      setShowNewProject(false);
      setNewProject({ 
        clientName: '', eventDate: '', eventType: 'Wedding', albumSize: '12x18', numPages: 40, designStyle: 'Minimal', specialInstructions: ''
      });
      setRawPhotos([]);

    } catch (err) {
      console.error('Error creating job:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>{t('pdash.title')}</h1>
          {user ? (
            <p style={{ color: 'var(--text-muted)' }}>{t('pdash.welcome', { name: user.name, email: user.email })}</p>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>{t('pdash.intro')}</p>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewProject(!showNewProject)}>
          {showNewProject ? t('pdash.cancel') : t('pdash.new_job')}
        </button>
      </div>

      {showNewProject && (
        <div className="order-form dashboard-new-project">
          <div className="form-explanation">
            <h3>{t('pdash.form_title')}</h3>
            <p>{t('pdash.form_sub')}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label>{t('pdash.client_name')}</label>
              <input type="text" placeholder={t('pdash.client_ph')} value={newProject.clientName} onChange={e => setNewProject({...newProject, clientName: e.target.value})} required />
            </div>
            <div>
              <label>{t('pdash.event_date')}</label>
              <input type="date" value={newProject.eventDate} onChange={e => setNewProject({...newProject, eventDate: e.target.value})} required />
            </div>
            <div>
              <label>{t('pdash.event_type')}</label>
              <select value={newProject.eventType} onChange={e => setNewProject({...newProject, eventType: e.target.value})}>
                <option value="Wedding">{t('pdash.opt_wedding')}</option>
                <option value="Pre-Wedding">{t('pdash.opt_prewedding')}</option>
                <option value="Engagement">{t('pdash.opt_engagement')}</option>
                <option value="Maternity">{t('pdash.opt_maternity')}</option>
                <option value="Birthday">{t('pdash.opt_birthday')}</option>
              </select>
            </div>
            <div>
              <label>{t('pdash.album_size')}</label>
              <select value={newProject.albumSize} onChange={e => setNewProject({...newProject, albumSize: e.target.value})}>
                <option value="12x18">{t('pdash.size_12x18')}</option>
                <option value="12x12">{t('pdash.size_12x12')}</option>
                <option value="17x24">{t('pdash.size_17x24')}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
            <div>
              <label>{t('pdash.pages')}</label>
              <input type="number" min="20" max="100" value={newProject.numPages} onChange={e => setNewProject({...newProject, numPages: parseInt(e.target.value)})} />
            </div>
            <div>
              <label>{t('pdash.style')}</label>
              <select value={newProject.designStyle} onChange={e => setNewProject({...newProject, designStyle: e.target.value})}>
                <option value="Minimal">{t('pdash.style_minimal')}</option>
                <option value="Cinematic">{t('pdash.style_cinematic')}</option>
                <option value="Traditional">{t('pdash.style_traditional')}</option>
              </select>
            </div>
          </div>

          <label style={{ marginTop: '10px' }}>{t('pdash.instructions')}</label>
          <textarea 
            rows="4" 
            className="form-textarea"
            placeholder={t('pdash.instructions_ph')}
            value={newProject.specialInstructions} 
            onChange={e => setNewProject({...newProject, specialInstructions: e.target.value})} 
          />

          <div style={{ marginTop: '20px' }}>
            <label>{t('pdash.upload_label')}</label>
            <label className="upload-btn-large">
              {uploading ? t('pdash.uploading') : t('pdash.upload_click')}
              <input type="file" multiple accept="image/jpeg" onChange={handleUploadPhotos} disabled={uploading} hidden />
            </label>
            {rawPhotos.length > 0 && <p style={{ color: 'var(--primary)', marginTop: '10px' }}>{t('pdash.uploaded_ok', { n: rawPhotos.length })}</p>}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ marginTop: '20px', width: '100%', padding: '15px', fontSize: '1.1rem' }} 
            onClick={handleSubmitJob}
            disabled={uploading}
          >
            {t('pdash.submit')}
          </button>
        </div>
      )}

      <div className="projects-grid">
        {!user && !showNewProject && (
          <p className="empty-state">{t('pdash.login_prompt')}</p>
        )}
        
        {user && projects.filter(p => p.userId === user.id).length === 0 && !showNewProject && (
          <p className="empty-state">{t('pdash.no_jobs')}</p>
        )}
        
        {user && projects.filter(p => p.userId === user.id).reverse().map(proj => (
          <div className="project-card" key={proj.id}>
            <h3>{proj.clientName}</h3>
            <p className="meta">{proj.eventType} • {new Date(proj.eventDate).toLocaleDateString()}</p>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <p>{t('pdash.status')} <strong style={{ color: 'var(--primary)' }}>{proj.status}</strong></p>
              <p>{t('pdash.photos')} {proj.photos?.length || 0} {t('pdash.uploaded')}</p>
            </div>
            <div className="project-actions">
              <button className="btn-secondary link-btn" onClick={() => setToastMessage(t('pdash.client_link', { url: `https://weddingalbums.in/proofing/${proj.id}` }))}>
                {t('pdash.copy_link')}
              </button>
              <button className="btn btn-gold" onClick={() => setPreviewAlbum(true)} style={{ marginLeft: '10px' }}>
                {t('pdash.review')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {previewAlbum && (
        <div className="modal-backdrop" onClick={() => setPreviewAlbum(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--n-900)', padding: '40px', borderRadius: '16px', maxWidth: '800px', width: '100%' }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>{t('pdash.proofing')}</h2>
            <Flipbook pages={[
              '/images/weddingalbums-talambralu.png',
              '/images/weddingalbums-layflat-album.png',
              '/images/bridal.jpg'
            ]} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => setPreviewAlbum(false)}>{t('pdash.approve')}</button>
              <button className="btn-secondary link-btn" onClick={() => setPreviewAlbum(false)}>{t('pdash.request_changes')}</button>
            </div>
          </div>
        </div>
      )}

      <LoginModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultRole="b2b"
        onSuccess={(newUser) => {
          setShowAuthModal(false);
          handleSubmitJob(newUser);
        }}
      />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default PhotographerDashboard;
