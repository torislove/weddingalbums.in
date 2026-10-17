/**
 * PackageForm — extracted from PricingEngine.jsx (UX-3) to keep that file navigable.
 * Add/Edit form fields for a pre-bundled package (incl. the estimator builder).
 */
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import EstimatorBuilder from '../EstimatorBuilder';

export default function PackageForm({ formData, setFormData, services, contentCat, coverImageFile, setCoverImageFile }) {
  return (
    <>
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Cover Image</label>
                    <div className="flex items-center gap-4">
                      {formData.coverImage && !coverImageFile && (
                        <img src={formData.coverImage} alt="Cover" className="h-16 w-16 object-cover rounded-lg border border-white/10" />
                      )}
                      <input type="file" accept="image/*" onChange={e => setCoverImageFile(e.target.files[0])} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20"/>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Package Name / Tier</label>
                      <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.tier || ''} onChange={e => setFormData({...formData, tier: e.target.value})} placeholder="e.g. Starter Memories" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Audience</label>
                      <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.b2bOrB2c || 'b2c'} onChange={e => setFormData({...formData, b2bOrB2c: e.target.value})}>
                        <option value="b2c">B2C (Couples)</option>
                        <option value="b2b">B2B (Studios)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Price Strategy</label>
                      <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.priceType || 'fixed'} onChange={e => setFormData({...formData, priceType: e.target.value})}>
                        <option value="fixed">Fixed Price</option>
                        <option value="starting_at">Starting At</option>
                        <option value="range">Price Range</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Base Price / Min</label>
                      <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. ₹50,000" />
                    </div>
                    {formData.priceType === 'range' && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Max Price</label>
                        <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.priceMax || ''} onChange={e => setFormData({...formData, priceMax: e.target.value})} placeholder="e.g. ₹80,000" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Theme Color</label>
                    <input type="color" className="w-full h-[40px] bg-[#1a1a1a] border border-white/10 rounded-lg p-1" value={formData.color || '#9E9E9E'} onChange={e => setFormData({...formData, color: e.target.value})} />
                  </div>

                  <EstimatorBuilder formData={formData} setFormData={setFormData} contentCat={contentCat} />

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Included Services (Click to Add/Remove)</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                      {services.map(s => {
                        const sId = s._id || s.id;
                        const isSelected = (formData.includedServiceIds || []).includes(sId);
                        return (
                          <div 
                            key={sId} 
                            onClick={() => {
                              const arr = formData.includedServiceIds || [];
                              if (isSelected) {
                                setFormData({...formData, includedServiceIds: arr.filter(id => id !== sId)});
                              } else {
                                setFormData({...formData, includedServiceIds: [...arr, sId]});
                              }
                            }}
                            className={`p-2 rounded-lg text-sm cursor-pointer transition flex items-center gap-2 border ${isSelected ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-[#1a1a1a] border-white/10 text-gray-400 hover:bg-white/5'}`}
                          >
                            <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                            <div className="truncate">{s.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 flex justify-between">Extra Text Features (Optional) <button type="button" onClick={() => setFormData({...formData, features: [...(formData.features || []), '']})} className="text-blue-500 hover:text-blue-400 text-xs flex items-center gap-1"><Plus size={12}/> Add</button></label>
                    {(formData.features || []).map((f, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={f} onChange={e => {
                          const arr = [...formData.features];
                          arr[i] = e.target.value;
                          setFormData({...formData, features: arr});
                        }} placeholder="Feature description" />
                        <button type="button" onClick={() => {
                          const arr = [...formData.features];
                          arr.splice(i, 1);
                          setFormData({...formData, features: arr});
                        }} className="p-3 bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" checked={formData.popular || false} onChange={e => setFormData({...formData, popular: e.target.checked})} className="w-5 h-5 rounded accent-blue-500" /> Mark as "Popular"</label>
                    <label className="flex items-center gap-2 text-white cursor-pointer"><input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded accent-blue-500" /> Active on Website</label>
                  </div>
                </>
    </>
  );
}
