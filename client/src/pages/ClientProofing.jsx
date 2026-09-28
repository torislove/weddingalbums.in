import React, { useState } from 'react';
import Flipbook from '../components/Flipbook';
import Toast from '../components/Toast';
import './OrderAlbum.css';

const ClientProofing = () => {
  const [toastMessage, setToastMessage] = useState(null);
  const [notes, setNotes] = useState('');

  const mockPages = [
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
  ];

  return (
    <div className="order-container">
      <div className="order-header text-center mb-10">
        <h1 className="text-4xl font-serif text-[#D4AF37] mb-4">Priya & Rahul's Wedding Album</h1>
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
        
        <div className="flex gap-4">
          <button 
            className="btn btn-primary flex-1 py-3" 
            onClick={() => setToastMessage('Album approved! Sending to print...')}
          >
            ✅ Approve for Print
          </button>
          <button 
            className="btn btn-outline flex-1 py-3" 
            onClick={() => setToastMessage('Revision requested. We will notify the editor.')}
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
