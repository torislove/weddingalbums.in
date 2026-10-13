import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { Search, Package, Truck, CheckCircle2, Clock, Printer } from 'lucide-react';

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'found' | 'error'

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId) return;
    
    setStatus('loading');
    
    // Mock API call
    setTimeout(() => {
      if (orderId.startsWith('ORD-')) {
        setStatus('found');
      } else {
        setStatus('error');
      }
    }, 1500);
  };

  const steps = [
    { title: 'Order Placed', desc: 'We received your specifications and media.', icon: Package, completed: true },
    { title: 'Design & Proofing', desc: 'Our editors are working on the 3D layout.', icon: Clock, completed: true },
    { title: 'Printing & Binding', desc: 'Your album is currently in the printing press.', icon: Printer, completed: true, active: true },
    { title: 'Quality Check', desc: 'Final inspection of colors and binding.', icon: CheckCircle2, completed: false },
    { title: 'Shipped', desc: 'Handed over to courier partner.', icon: Truck, completed: false },
  ];

  return (
    <div className="order-tracking-page" style={{ padding: '0 1.25rem 4rem', minHeight: '80vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div className="text-center mb-10">
          <ScrollReveal>
            <h1 className="font-serif text-[#D4AF37] mb-3" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.25rem)' }}>Track Your Order</h1>
            <p className="text-gray-400" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', lineHeight: 1.6 }}>
              Enter your Order ID below to check the real-time status of your album.
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
          <button type="submit" className="btn btn-primary" style={{ height: '52px', padding: '0 2rem', flexShrink: 0 }} disabled={status === 'loading'}>
            {status === 'loading' ? 'Searching...' : 'Track'}
          </button>
        </form>

        {status === 'error' && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 animate-slide-up">
            We couldn't find an order with that ID. Please check and try again.
          </div>
        )}

        {status === 'found' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 animate-slide-up">
            <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-8">
              <div>
                <p className="text-gray-400 mb-1">Order Details for</p>
                <h2 className="text-2xl text-white font-bold">{orderId.toUpperCase()}</h2>
              </div>
              <div className="text-right">
                <span className="px-4 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-sm font-medium border border-[#D4AF37]/30">
                  In Progress
                </span>
                <p className="text-sm text-gray-500 mt-2">Est. Delivery: Oct 15, 2026</p>
              </div>
            </div>

            <div className="relative border-l border-white/10 ml-6 space-y-10 py-4">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative pl-10">
                    <div className={`absolute -left-[20px] top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#050505] 
                      ${step.completed ? 'bg-[#10b981] text-black' : step.active ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.5)] animate-pulse' : 'bg-white/10 text-gray-500'}`}
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
