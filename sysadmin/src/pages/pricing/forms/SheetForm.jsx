/**
 * SheetForm — extracted from PricingEngine.jsx (UX-3) to keep that file navigable.
 * Add/Edit form fields for a print-lab sheet type.
 */
import React from 'react';

export default function SheetForm({ formData, setFormData }) {
  return (
    <>
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Sheet Market Name</label>
                      <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Velvet Silk Touch" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Telugu Title (తెలుగు)</label>
                      <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white font-telugu" value={formData.telugu || ''} onChange={e => setFormData({...formData, telugu: e.target.value})} placeholder="సిల్కీ వెల్వెట్ మ్యాట్" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Customer / Sheet (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.pricePerSheet || ''} onChange={e => setFormData({...formData, pricePerSheet: Number(e.target.value)})} placeholder="e.g. 65" />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--brand)] mb-1 font-semibold">⚡ Studio Wholesale / Sheet (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-[var(--brand)]/40 rounded-lg p-3 text-white" value={formData.studioPricePerSheet || ''} onChange={e => setFormData({...formData, studioPricePerSheet: Number(e.target.value)})} placeholder="e.g. 42" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Customer Cover (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.premiumCoverSurcharge || 0} onChange={e => setFormData({...formData, premiumCoverSurcharge: Number(e.target.value)})} placeholder="e.g. 1200" />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--brand)] mb-1 font-semibold">⚡ Studio Cover (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-[var(--brand)]/40 rounded-lg p-3 text-white" value={formData.studioCoverSurcharge || 0} onChange={e => setFormData({...formData, studioCoverSurcharge: Number(e.target.value)})} placeholder="e.g. 750" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description / Finish Feature</label>
                    <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. No fingerprints, anti-scratch" />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={formData.popular || false} onChange={e => setFormData({...formData, popular: e.target.checked})} className="w-5 h-5 rounded accent-[var(--brand)]" />
                      Mark as "Most Popular / Best Seller (⭐)"
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded accent-[var(--brand)]" />
                      Active in Catalog
                    </label>
                  </div>
                </>
    </>
  );
}
