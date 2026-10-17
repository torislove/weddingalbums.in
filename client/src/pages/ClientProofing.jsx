import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Flipbook from '../components/Flipbook';
import Toast from '../components/Toast';
import './OrderAlbum.css';
import { API } from '../apiConfig';

const ClientProofing = () => {
  const { id } = useParams();
  const [toastMessage, setToastMessage] = useState(null);
  const [notes, setNotes] = useState('');

  const handleApprove = async () => {
    setToastMessage('Album approved! Sending to print...');
    if (id && id !== 'sample') {
      try {
        await fetch(`${API}/api/orders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Approved & Printing', notes })
        });
      } catch (e) {
        console.warn('Proof approval sync notice:', e);
      }
    }
  };

  const handleRequestChanges = async () => {
    setToastMessage('Revision requested. We will notify the editor.');
    if (id && id !== 'sample') {
      try {
        await fetch(`${API}/api/orders/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Revision Requested', notes })
        });
      } catch (e) {
        console.warn('Proof revision sync notice:', e);
      }
    }
  };

  const mockPages = [
    '/images/weddingalbums-talambralu.png',
    '/images/weddingalbums-layflat-album.png',
    '/images/bridal.jpg'
  ];

  return (
    <div className="order-container">
      <div className="order-header text-center mb-10">
        <h1 className="text-4xl font-serif text-[var(--brand)] mb-4">Priya & Rahul's Wedding Album</h1>
        <p className="text-gray-400">Prepared by Dream Studios. Please review your 3D album design.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Flipbook pages={mockPages} />
      </div>

      <div className="mt-12 max-w-2xl mx-auto bg-black/40 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl text-white mb-4">Approval & Revisions</h3>
        <p className="text-sm text-gray-400 mb-4">If everything looks perfect, approve it for print! Otherwise, let us know what changes you'd like.</p>
        
        <textarea 
          className="form-textarea w-full mb-4" 
          rows="4" 
          placeholder="e.g. Please swap the photo on page 2 with the Haldi group photo..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
        
        <div className="flex flex-wrap gap-3">
          <button 
            type="button"
            className="btn btn-primary flex-1 min-w-[140px] py-3 cursor-pointer" 
            onClick={handleApprove}
          >
            ✅ Approve for Print
          </button>
          <button 
            type="button"
            className="btn btn-outline flex-1 min-w-[140px] py-3 cursor-pointer" 
            onClick={handleRequestChanges}
          >
            📝 Request Changes
          </button>
        </div>
      </div>
      
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default ClientProofing;
