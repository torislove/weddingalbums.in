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
    <div className="pt-[120px] pb-[60px] min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Track Your Order</h1>
            <p className="text-gray-400">Enter your Order ID below to check the real-time status of your album.</p>
          </ScrollReveal>
        </div>

        <form onSubmit={handleTrack} className="flex gap-4 mb-16 relative">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="e.g. ORD-123456" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all text-lg"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary px-8" disabled={status === 'loading'}>
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
