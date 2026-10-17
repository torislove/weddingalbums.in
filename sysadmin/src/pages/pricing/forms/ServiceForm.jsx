/**
 * ServiceForm — extracted from PricingEngine.jsx (UX-3) to keep that file navigable.
 * Add/Edit form fields for an a-la-carte service.
 */
import React from 'react';

export default function ServiceForm({ formData, setFormData }) {
  return (
    <>
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Category</label>
                      <select 
                        className="w-full bg-(--n-900) border border-white/10 rounded-lg p-3 text-white"
                        value={formData.category || 'Premium Album Printing & Design'}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                        <option>Premium Album Printing & Design</option>
                        <option>Cinematic Wedding Films & Reels</option>
                        <option>High-End Photo Retouching & Color</option>
                        <option>Wedding Flex, Banners & Invites</option>
                        <option>Shoots & Drone</option>
                        <option>Editing</option>
                        <option>Photography</option>
                        <option>Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Service Name</label>
                      <input type="text" className="w-full bg-(--n-900) border border-white/10 rounded-lg p-3 text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. 4K Cinematic Wedding Teaser" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Telugu Title (తెలుగు శీర్షిక)</label>
                    <input type="text" className="w-full bg-(--n-900) border border-white/10 rounded-lg p-3 text-white font-telugu" value={formData.telugu || ''} onChange={e => setFormData({...formData, telugu: e.target.value})} placeholder="ఉదా: 4K సినిమాటిక్ టీజర్" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Customer Price (₹)</label>
                      <input type="number" className="w-full bg-(--n-900) border border-white/10 rounded-lg p-3 text-white" value={formData.basePrice || ''} onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})} placeholder="e.g. 6000" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--brand)] mb-1 font-semibold">⚡ Studio Wholesale (₹)</label>
                      <input type="number" className="w-full bg-(--n-900) border border-[var(--brand)]/40 rounded-lg p-3 text-white" value={formData.studioBasePrice || ''} onChange={e => setFormData({...formData, studioBasePrice: Number(e.target.value)})} placeholder="e.g. 4200" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">ETA (Days)</label>
                      <input type="number" className="w-full bg-(--n-900) border border-white/10 rounded-lg p-3 text-white" value={formData.estimatedDaysToDeliver || 1} onChange={e => setFormData({...formData, estimatedDaysToDeliver: Number(e.target.value)})} placeholder="e.g. 3" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Process / Workflow Description (విధానం)</label>
                    <textarea rows="2" className="w-full bg-(--n-900) border border-white/10 rounded-lg p-3 text-white text-sm" value={formData.processDescription || ''} onChange={e => setFormData({...formData, processDescription: e.target.value})} placeholder="e.g. 1. RAW file intake -> 2. Pro color grade -> 3. Client preview -> 4. 4K master delivery" />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={formData.popular || false} onChange={e => setFormData({...formData, popular: e.target.checked})} className="w-5 h-5 rounded accent-[var(--brand)]" />
                      Mark as "Featured / Most Popular (⭐)"
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded accent-[var(--brand)]" />
                      Active on Website
                    </label>
                  </div>
                </>
    </>
  );
}
