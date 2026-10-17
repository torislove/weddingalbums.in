/**
 * SizeGrid — extracted from PricingEngine.jsx (UX-3) to keep that file navigable.
 * Album sizes & bubbles grid.
 */
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { statusOf } from './statusOf';
import { classifySize } from '../../lib/catalogMatch';

export default function SizeGrid({ albumSizes, contentCat, openModal, handleDelete }) {
  return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {albumSizes.map(sz => (
            <div key={sz._id || sz.id} className="bg-(--n-900) p-6 rounded-xl border border-white/10 relative group hover:border-[var(--brand)]/50 transition">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-[var(--brand)] font-bold">{sz.dimensions}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${sz.orientation === 'portrait' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                    {sz.orientation === 'portrait' ? '↕️ Portrait' : '↔️ Landscape'}
                  </span>
                </div>
                {sz.popular && <span className="text-xs bg-[var(--brand)]/20 text-[var(--brand)] px-2.5 py-0.5 rounded-full font-semibold">⭐ Most Popular</span>}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{sz.name}</h3>
              {sz.telugu && <div className="text-xs text-gray-400 mb-3 font-telugu">{sz.telugu}</div>}
              
              <div className="flex justify-between items-baseline mb-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <div>
                  <span className="text-[11px] text-gray-400 block uppercase tracking-wider font-semibold">Customer Base</span>
                  <span className="text-lg font-bold text-gray-200">₹{sz.basePrice}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[var(--brand)] block uppercase tracking-wider font-semibold">⚡ Studio Wholesale</span>
                  <span className="text-lg font-bold text-[var(--brand)]">₹{sz.studioBasePrice || Math.round(sz.basePrice * 0.7)}</span>
                </div>
              </div>
              <div className="text-[11px] mb-3">
                <span className={`font-semibold ${statusOf(classifySize(sz, contentCat)).cls}`}>{statusOf(classifySize(sz, contentCat)).text}</span>
                <span className="text-gray-400"> · 🧻 ≈₹{Math.round((Number(sz.basePrice) || 0) / 30)}/sheet · base covers 30 sheets (60 pages)</span>
              </div>

              <p className="text-xs text-gray-400 mb-3">{sz.description}</p>
              {sz.isBundle && <div className="text-xs text-green-400 mb-2">🎁 Bundle discount: -₹{sz.bundleDiscount}</div>}
              
              <div className="absolute top-4 right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition flex gap-2">
                <button onClick={() => openModal(sz)} aria-label={`Edit ${sz.name || 'size'}`} title="Edit" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(sz._id || sz.id)} aria-label={`Delete ${sz.name || 'size'}`} title="Delete" className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {albumSizes.length === 0 && <p className="text-gray-500 col-span-full">No album sizes configured.</p>}
        </div>
  );
}
