/**
 * PackageGrid — extracted from PricingEngine.jsx (UX-3) to keep that file navigable.
 * Pre-bundled packages grid.
 */
import React from 'react';
import { Edit2, Trash2, EyeOff } from 'lucide-react';

export default function PackageGrid({ packages, openModal, handleDelete }) {
  return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {packages.map(pkg => (
            <div key={pkg._id || pkg.id} className="bg-[#111] rounded-xl border relative group overflow-hidden" style={{ borderColor: pkg.color }}>
              {pkg.coverImage && (
                <div className="h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${pkg.coverImage})` }} />
              )}
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 rounded-full text-xs font-bold bg-white/10">{pkg.b2bOrB2c.toUpperCase()} • {pkg.category}</div>
                  {!pkg.isActive && <span className="text-red-500 text-xs font-bold flex items-center gap-1"><EyeOff size={14}/> Hidden</span>}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{pkg.tier}</h3>
                
                <div className="text-lg sm:text-xl text-gray-300 font-medium mb-4">
                  {pkg.priceType === 'starting_at' && <span className="text-sm text-gray-500 block">Starting at</span>}
                  {pkg.price} {pkg.priceType === 'range' ? `- ${pkg.priceMax}` : ''} {pkg.suffix}
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((f, i) => <li key={i} className="text-sm text-gray-400 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"/>{f}</li>)}
                </ul>
                
                <div className="absolute top-4 right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition flex gap-2">
                  <button onClick={() => openModal(pkg)} aria-label={`Edit ${pkg.name || 'package'}`} title="Edit" className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(pkg._id || pkg.id)} aria-label={`Delete ${pkg.name || 'package'}`} title="Delete" className="p-2 bg-red-500/50 hover:bg-red-500/80 text-red-500 rounded-lg backdrop-blur-sm"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {packages.length === 0 && <p className="text-gray-500 col-span-full">No bundled packages found.</p>}
        </div>
  );
}
