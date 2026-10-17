/**
 * ServiceGrid — extracted from PricingEngine.jsx (UX-3) to keep that file navigable.
 * A-la-carte services grid.
 */
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { statusOf } from './statusOf';
import { classifyService } from '../../lib/catalogMatch';

export default function ServiceGrid({ services, contentCat, openModal, handleDelete }) {
  return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map(s => (
            <div key={s._id || s.id} className="bg-(--n-900) p-6 rounded-xl border border-white/10 relative group hover:border-[var(--brand)]/50 transition">
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs uppercase tracking-widest text-blue-400 font-semibold">{s.category}</div>
                {s.popular && <span className="text-xs bg-[var(--brand)]/20 text-[var(--brand)] px-2.5 py-0.5 rounded-full font-semibold border border-[var(--brand)]/30 shrink-0">⭐ Featured</span>}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{s.name}</h3>
              {s.telugu && <div className="text-xs text-[var(--brand)] mb-2 font-telugu">{s.telugu}</div>}
              <div className="flex justify-between items-baseline mb-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <div>
                  <span className="text-[11px] text-gray-400 block uppercase tracking-wider font-semibold">Customer (B2C)</span>
                  <span className="text-lg font-bold text-gray-200">₹{s.basePrice}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[var(--brand)] block uppercase tracking-wider font-semibold">⚡ Studio Wholesale</span>
                  <span className="text-lg font-bold text-[var(--brand)]">₹{s.studioBasePrice || Math.round(s.basePrice * 0.7)}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">ETA: {s.estimatedDaysToDeliver} Days</div>
              <div className={`text-[11px] mt-2 font-semibold ${statusOf(classifyService(s, contentCat, services)).cls}`}>
                {statusOf(classifyService(s, contentCat, services)).text}
              </div>
                      <div className="absolute top-4 right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition flex gap-2">
                <button onClick={() => openModal(s)} aria-label={`Edit ${s.name || 'item'}`} title="Edit" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s._id || s.id)} aria-label={`Delete ${s.name || 'item'}`} title="Delete" className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {services.length === 0 && <p className="text-gray-500 col-span-full">No a la carte services configured.</p>}
        </div>
  );
}
