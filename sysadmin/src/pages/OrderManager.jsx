import React, { useState } from 'react';
import { Image as ImageIcon, UploadCloud, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import Toast from '../components/Toast';

const AlbumsManager = () => {
  const [projects, setProjects] = useState([
    { id: 'PRJ-102', client: 'Sneha & Arjun', status: 'Printed', link: 'https://weddingalbums.in/proofing/PRJ-102', date: 'Oct 1, 2026' },
    { id: 'PRJ-103', client: 'Varun & Shalini', status: 'Awaiting Proofing', link: null, date: 'Oct 3, 2026' }
  ]);
  const [toast, setToast] = useState(null);

  const handleUpload = (id) => {
    setToast(`Generating 3D Flipbook for ${id}...`);
    setTimeout(() => {
      setProjects(projects.map(p => p.id === id ? { ...p, status: 'Proofing Ready', link: `https://weddingalbums.in/proofing/${id}` } : p));
      setToast('Flipbook generated and client notified!');
    }, 2000);
  };

  return (
    <div className="p-10 animate-slide-up max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white mb-2">Albums & Proofing Manager</h1>
        <p className="text-gray-400">Upload final PDF spreads to generate 3D flipbooks for client approval.</p>
      </div>

      <div className="grid gap-6">
        {projects.map(project => (
          <div key={project.id} className="glass-panel p-6 border border-white/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-black/40 rounded-lg flex items-center justify-center border border-white/5">
                <ImageIcon size={24} className="text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-xl text-white font-medium mb-1">{project.client}</h3>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-400">Project ID: {project.id}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">Date: {project.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <span className={`text-sm font-medium ${project.status === 'Printed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {project.status}
                </span>
              </div>
              
              <div className="w-px h-10 bg-white/10"></div>

              {project.link ? (
                <div className="flex gap-2">
                  <button onClick={() => setToast('Link copied to clipboard!')} className="btn btn-outline flex items-center gap-2 py-2 text-sm">
                    <LinkIcon size={16} /> Copy Link
                  </button>
                  <button className="btn btn-primary flex items-center gap-2 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 border-none">
                    <CheckCircle2 size={16} /> Approved
                  </button>
                </div>
              ) : (
                <button onClick={() => handleUpload(project.id)} className="btn btn-gold flex items-center gap-2 py-2 text-sm">
                  <UploadCloud size={16} /> Upload PDF Spread
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default AlbumsManager;
