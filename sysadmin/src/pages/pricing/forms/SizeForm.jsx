/**
 * SizeForm — extracted from PricingEngine.jsx (UX-3) to keep that file navigable.
 * Add/Edit form fields for an album size.
 */
import React from 'react';

export default function SizeForm({ formData, setFormData }) {
  return (
    <>
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Size Display Name</label>
                      <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. 12×36 Royal Spread" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Dimensions (e.g. 12×36)</label>
                      <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.dimensions || ''} onChange={e => setFormData({...formData, dimensions: e.target.value})} placeholder="12×36 inches" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Orientation (దిశ)</label>
                      <select
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white text-xs"
                        value={formData.orientation || 'landscape'}
                        onChange={e => setFormData({...formData, orientation: e.target.value})}
                      >
                        <option value="landscape">↔️ Landscape</option>
                        <option value="portrait">↕️ Portrait</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Customer Base (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.basePrice || ''} onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})} placeholder="e.g. 9500" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--brand)] mb-1 font-semibold">⚡ Studio Wholesale (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-[var(--brand)]/40 rounded-lg p-3 text-white" value={formData.studioBasePrice || ''} onChange={e => setFormData({...formData, studioBasePrice: Number(e.target.value)})} placeholder="e.g. 6800" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Telugu Title</label>
                      <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white font-telugu text-xs" value={formData.telugu || ''} onChange={e => setFormData({...formData, telugu: e.target.value})} placeholder="12×36 రాయల్ స్ప్రెడ్" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description / Benefit</label>
                    <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. 36 inch wide panoramic views" />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={formData.popular || false} onChange={e => setFormData({...formData, popular: e.target.checked})} className="w-5 h-5 rounded accent-[var(--brand)]" />
                      Mark as "Most Popular (⭐)"
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={formData.isBundle || false} onChange={e => setFormData({...formData, isBundle: e.target.checked})} className="w-5 h-5 rounded accent-[var(--brand)]" />
                      Is Bundle (Includes Parent Copies)
                    </label>
                  </div>
                </>
    </>
  );
}
