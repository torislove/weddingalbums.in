import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Flipbook from '../components/Flipbook';
import Toast from '../components/Toast';
import './OrderAlbum.css';
import { API } from '../apiConfig';
import { useT } from '../context/LanguageContext';

const ClientProofing = () => {
  const t = useT();
  const { id } = useParams();
  const [toastMessage, setToastMessage] = useState(null);
  const [notes, setNotes] = useState('');

  const handleApprove = async () => {
    setToastMessage(t('cproof.toast_approved'));
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
    setToastMessage(t('cproof.toast_revision'));
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
        <p className="text-gray-400">{t('cproof.prepared', { studio: 'Dream Studios' })}</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Flipbook pages={mockPages} />
      </div>

      <div className="mt-12 max-w-2xl mx-auto bg-black/40 p-6 rounded-xl border border-white/10">
        <h3 className="text-xl text-white mb-4">{t('cproof.approval')}</h3>
        <p className="text-sm text-gray-400 mb-4">{t('cproof.approval_sub')}</p>
        
        <textarea 
          className="form-textarea w-full mb-4" 
          rows="4" 
          placeholder={t('cproof.notes_ph')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
        
        <div className="flex flex-wrap gap-3">
          <button 
            type="button"
            className="btn btn-primary flex-1 min-w-[140px] py-3 cursor-pointer" 
            onClick={handleApprove}
          >
            {t('cproof.approve')}
          </button>
          <button 
            type="button"
            className="btn btn-outline flex-1 min-w-[140px] py-3 cursor-pointer" 
            onClick={handleRequestChanges}
          >
            {t('cproof.request')}
          </button>
        </div>
      </div>
      
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
};

export default ClientProofing;
