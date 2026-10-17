import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { Search, Package, Truck, CheckCircle2, Clock, Printer } from 'lucide-react';
import { API } from '../apiConfig';
import { useT } from '../context/LanguageContext';

const OrderTracking = () => {
  const t = useT();
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'found' | 'error'
  const [orderData, setOrderData] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    const cleanId = orderId.trim();
    if (!cleanId) return;
    
    setStatus('loading');
    
    try {
      const res = await fetch(`${API}/api/orders/${cleanId}`);
      if (res.ok) {
        const data = await res.json();
        setOrderData(data);
        setStatus('found');
      } else if (cleanId.toUpperCase().startsWith('ORD-') || cleanId.toUpperCase().startsWith('WA-')) {
        setOrderData(null);
        setStatus('found');
      } else {
        setStatus('error');
      }
    } catch {
      if (cleanId.toUpperCase().startsWith('ORD-') || cleanId.toUpperCase().startsWith('WA-')) {
        setOrderData(null);
        setStatus('found');
      } else {
        setStatus('error');
      }
    }
  };

  const getStepProgress = () => {
    const rawStatus = (orderData?.status || 'In Progress').toLowerCase();
    let currentIdx = 2; // Default to Printing
    if (rawStatus.includes('deliver')) currentIdx = 4;
    else if (rawStatus.includes('ship')) currentIdx = 3;
    else if (rawStatus.includes('print')) currentIdx = 2;
    else if (rawStatus.includes('proof') || rawStatus.includes('edit')) currentIdx = 1;
    else if (rawStatus.includes('placed') || rawStatus.includes('confirm') || rawStatus.includes('pending')) currentIdx = 0;

    return [
      { title: t('track.step1_t'), desc: t('track.step1_d'), icon: Package, completed: currentIdx >= 0, active: currentIdx === 0 },
      { title: t('track.step2_t'), desc: t('track.step2_d'), icon: Clock, completed: currentIdx > 1, active: currentIdx === 1 },
      { title: t('track.step3_t'), desc: t('track.step3_d'), icon: Printer, completed: currentIdx > 2, active: currentIdx === 2 },
      { title: t('track.step4_t'), desc: t('track.step4_d'), icon: CheckCircle2, completed: currentIdx > 3, active: currentIdx === 3 },
      { title: t('track.step5_t'), desc: t('track.step5_d'), icon: Truck, completed: currentIdx === 4, active: currentIdx === 4 },
    ];
  };

  const steps = getStepProgress();

  return (
    <div className="order-tracking-page" style={{ padding: '0 1.25rem 4rem', minHeight: '80vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div className="text-center mb-10">
          <ScrollReveal>
            <h1 className="font-serif text-[var(--brand)] mb-3" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.25rem)' }}>{t('track.title')}</h1>
            <p className="text-gray-400" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', lineHeight: 1.6 }}>
              {t('track.sub')}
            </p>
          </ScrollReveal>
        </div>

        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '10px', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} size={20} />
            <input 
              type="text" 
              placeholder="e.g. ORD-123456" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '48px', height: '52px', fontSize: '1rem', width: '100%' }}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '52px', padding: '0 2rem', flex: '1 1 120px' }} disabled={status === 'loading'}>
            {status === 'loading' ? t('track.searching') : t('track.btn')}
          </button>
        </form>

        {status === 'error' && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 animate-slide-up">
            {t('track.error')}
          </div>
        )}

        {status === 'found' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 animate-slide-up">
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <p className="text-gray-400 mb-1">{t('track.details_for')}</p>
                <h2 className="text-2xl text-white font-bold">{orderId.toUpperCase()}</h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="px-4 py-1 bg-[var(--brand)]/20 text-[var(--brand)] rounded-full text-sm font-medium border border-[var(--brand)]/30">
                  {t('track.in_progress')}
                </span>
                <p className="text-sm text-gray-500 mt-2">{t('track.est')}: Oct 15, 2026</p>
              </div>
            </div>

            <div className="relative border-l border-white/10 ml-6 space-y-10 py-4">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative pl-10">
                    <div className={`absolute -left-[20px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[var(--ink)] 
                      ${step.completed ? 'bg-[var(--ok)] text-black' : step.active ? 'bg-[var(--brand)] text-black shadow-[0_0_15px_rgba(212,175,55,0.5)] animate-pulse' : 'bg-white/10 text-gray-500'}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-medium mb-1 ${step.completed || step.active ? 'text-white' : 'text-gray-500'}`}>{step.title}</h3>
                      <p className={`text-sm ${step.completed || step.active ? 'text-gray-400' : 'text-gray-600'}`}>{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
