/**
 * SheetGrid — extracted from PricingEngine.jsx (UX-3) to keep that file navigable.
 * Print-lab sheet types grid.
 */
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { statusOf } from './statusOf';
import { classifySheet } from '../../lib/catalogMatch';

export default function SheetGrid({ sheets, contentCat, openModal, handleDelete }) {
  return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sheets.map(s => (
            <div key={s._id || s.id} className="bg-(--n-900) p-6 rounded-xl border border-white/10 relative group hover:border-(--brand)/50 transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{s.name}</h3>
                  {s.telugu && <div className="text-xs text-[var(--brand)] mb-2 font-telugu">{s.telugu}</div>}
                </div>
                {s.popular && <span className="text-xs bg-[var(--brand)]/20 text-[var(--brand)] px-2.5 py-0.5 rounded-full font-semibold border border-[var(--brand)]/30 shrink-0">⭐ Most Popular</span>}
              </div>
              
              <div className="flex justify-between items-baseline mb-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <div>
                  <span className="text-[11px] text-gray-400 block uppercase tracking-wider font-semibold">Customer (B2C)</span>
                  <div className="text-lg font-bold text-gray-200">₹{s.pricePerSheet} <span className="text-xs font-normal text-gray-500">/ sheet</span></div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[var(--brand)] block uppercase tracking-wider font-semibold">⚡ Studio Wholesale</span>
                  <div className="text-lg font-bold text-[var(--brand)]">₹{s.studioPricePerSheet || Math.round(s.pricePerSheet * 0.65)} <span className="text-xs font-normal text-[var(--brand)]/70">/ sheet</span></div>
                </div>
              </div>

              <div className={`text-[11px] mb-2 font-semibold ${statusOf(classifySheet(s, contentCat)).cls}`}>
                {statusOf(classifySheet(s, contentCat)).text}
              </div>

              <div className="text-xs text-gray-400 flex justify-between border-t border-white/5 pt-2 mb-2">
                <span>Cover: +₹{s.premiumCoverSurcharge || 0}</span>
                <span className="text-[var(--brand)]">Studio Cover: +₹{s.studioCoverSurcharge || Math.round((s.premiumCoverSurcharge || 0) * 0.65)}</span>
              </div>

              {s.description && <div className="text-xs text-gray-400 mt-2">{s.description}</div>}
              
              <div className="absolute top-4 right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition flex gap-2">
                <button onClick={() => openModal(s)} aria-label={`Edit ${s.name || 'item'}`} title="Edit" className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s._id || s.id)} aria-label={`Delete ${s.name || 'item'}`} title="Delete" className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {sheets.length === 0 && <p className="text-gray-500 col-span-full">No sheet types configured.</p>}
        </div>
  );
}
