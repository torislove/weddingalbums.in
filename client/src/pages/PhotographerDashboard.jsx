import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Flipbook from '../components/Flipbook';
import LoginModal from '../components/LoginModal';
import Toast from '../components/Toast';
import './OrderAlbum.css'; // Reuse form styles
import './PhotographerDashboard.css';

const PhotographerDashboard = () => {
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
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API}/api/projects`);
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
        const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
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
      setToastMessage("Please enter the client's name");
      return;
    }

    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Create Project
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const projectRes = await fetch(`${API}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectData.id,
          clientName: projectData.clientName,
          studioName: currentUser.name,
          type: 'B2B Design & Print',
          details: `Size: ${newProject.albumSize}, Pages: ${newProject.numPages}, Style: ${newProject.designStyle}. ${newProject.specialInstructions}`
        })
      });

      setToastMessage('Job successfully submitted to the editing team!');
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
          <h1>Studio Dashboard</h1>
          {user ? (
            <p style={{ color: 'var(--text-muted)' }}>Welcome, {user.name} | {user.email}</p>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Create your job request below. You will be asked to log in upon submission.</p>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewProject(!showNewProject)}>
          {showNewProject ? 'Cancel Request' : '+ Submit New Job'}
        </button>
      </div>

      {showNewProject && (
        <div className="order-form dashboard-new-project">
          <div className="form-explanation">
            <h3>Submit a New Editing & Printing Job</h3>
            <p>Fill out the details below so our design team knows exactly how to craft this album. Once submitted, it will enter our internal queue immediately.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label>Client / Couple Name</label>
              <input type="text" placeholder="e.g. Priya & Rahul" value={newProject.clientName} onChange={e => setNewProject({...newProject, clientName: e.target.value})} required />
            </div>
            <div>
              <label>Event Date</label>
              <input type="date" value={newProject.eventDate} onChange={e => setNewProject({...newProject, eventDate: e.target.value})} required />
            </div>
            <div>
              <label>Event Type</label>
              <select value={newProject.eventType} onChange={e => setNewProject({...newProject, eventType: e.target.value})}>
                <option value="Wedding">Wedding</option>
                <option value="Pre-Wedding">Pre-Wedding Shoot</option>
                <option value="Engagement">Engagement</option>
                <option value="Maternity">Maternity</option>
                <option value="Birthday">Birthday</option>
              </select>
            </div>
            <div>
              <label>Album Size Requirement</label>
              <select value={newProject.albumSize} onChange={e => setNewProject({...newProject, albumSize: e.target.value})}>
                <option value="12x18">12x18 Landscape (Standard Wedding)</option>
                <option value="12x12">12x12 Square</option>
                <option value="17x24">17x24 Mega Landscape</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
            <div>
              <label>Number of Pages (Spreads)</label>
              <input type="number" min="20" max="100" value={newProject.numPages} onChange={e => setNewProject({...newProject, numPages: parseInt(e.target.value)})} />
            </div>
            <div>
              <label>Design Style Preference</label>
              <select value={newProject.designStyle} onChange={e => setNewProject({...newProject, designStyle: e.target.value})}>
                <option value="Minimal">Minimal & Clean (White space)</option>
                <option value="Cinematic">Cinematic & Dramatic (Dark backgrounds)</option>
                <option value="Traditional">Traditional Indian (Collages & Borders)</option>
              </select>
            </div>
          </div>

          <label style={{ marginTop: '10px' }}>Specific Instructions for the Editor</label>
          <textarea 
            rows="4" 
            className="form-textarea"
            placeholder="e.g. Please ensure the Haldi photos are on a bright yellow background. Do not use the photos in folder 3."
            value={newProject.specialInstructions} 
            onChange={e => setNewProject({...newProject, specialInstructions: e.target.value})} 
          />

          <div style={{ marginTop: '20px' }}>
            <label>Upload Raw Photos (Selected by Client)</label>
            <label className="upload-btn-large">
              {uploading ? 'Uploading to Server...' : 'Click to Upload High-Res JPEGs'}
              <input type="file" multiple accept="image/jpeg" onChange={handleUploadPhotos} disabled={uploading} hidden />
            </label>
            {rawPhotos.length > 0 && <p style={{ color: 'var(--primary)', marginTop: '10px' }}>{rawPhotos.length} photos uploaded successfully.</p>}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ marginTop: '20px', width: '100%', padding: '15px', fontSize: '1.1rem' }} 
            onClick={handleSubmitJob}
            disabled={uploading}
          >
            Submit Job to Design Team
          </button>
        </div>
      )}

      <div className="projects-grid">
        {!user && !showNewProject && (
          <p className="empty-state">Please log in to see your submitted jobs.</p>
        )}
        
        {user && projects.filter(p => p.userId === user.id).length === 0 && !showNewProject && (
          <p className="empty-state">No jobs submitted yet. Click above to submit your first job.</p>
        )}
        
        {user && projects.filter(p => p.userId === user.id).reverse().map(proj => (
          <div className="project-card" key={proj.id}>
            <h3>{proj.clientName}</h3>
            <p className="meta">{proj.eventType} • {new Date(proj.eventDate).toLocaleDateString()}</p>
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <p>Status: <strong style={{ color: 'var(--primary)' }}>{proj.status}</strong></p>
              <p>Photos: {proj.photos?.length || 0} uploaded</p>
            </div>
            <div className="project-actions">
              <button className="btn-secondary link-btn" onClick={() => setToastMessage(`Client Link: https://weddingalbums.in/proofing/${proj.id}`)}>
                Copy Client Proofing Link
              </button>
              <button className="btn btn-gold" onClick={() => setPreviewAlbum(true)} style={{ marginLeft: '10px' }}>
                Review Edits (3D Album)
              </button>
            </div>
          </div>
        ))}
      </div>

      {previewAlbum && (
        <div className="modal-backdrop" onClick={() => setPreviewAlbum(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '16px', maxWidth: '800px', width: '100%' }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Album Proofing</h2>
            <Flipbook pages={[
              'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
            ]} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => setPreviewAlbum(false)}>Approve for Print</button>
              <button className="btn-secondary link-btn" onClick={() => setPreviewAlbum(false)}>Request Changes</button>
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
