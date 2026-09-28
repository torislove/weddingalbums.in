import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Tag, Save, X, EyeOff, Layers, Settings, Image as ImageIcon } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const PricingEngine = () => {
  const [activeTab, setActiveTab] = useState('services'); // services, sheets, packages
  const [loading, setLoading] = useState(true);

  // Data Stores
  const [services, setServices] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [packages, setPackages] = useState([]);

  // Modals & Forms
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Forms states
  const initService = { category: 'Photography', name: '', basePrice: '', estimatedDaysToDeliver: 1 };
  const initSheet = { name: '', pricePerSheet: '', premiumCoverSurcharge: 0 };
  const initPackage = { tier: '', category: 'combo', priceType: 'fixed', price: '', priceMax: '', suffix: '', includedServiceIds: [], features: [], popular: false, isActive: true, b2bOrB2c: 'b2c', color: '#9E9E9E' };

  const [formData, setFormData] = useState({});
  const [coverImageFile, setCoverImageFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [srvRes, shtRes, pkgRes] = await Promise.all([
        fetch(`${API}/api/builder/services`),
        fetch(`${API}/api/builder/sheets`),
        fetch(`${API}/api/admin/packages`, { headers })
      ]);
      setServices(await srvRes.json());
      setSheets(await shtRes.json());
      setPackages(await pkgRes.json());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pricing data', err);
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setCoverImageFile(null);
    if (item) {
      setFormData(item);
    } else {
      if (activeTab === 'services') setFormData(initService);
      if (activeTab === 'sheets') setFormData(initSheet);
      if (activeTab === 'packages') setFormData(initPackage);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      if (activeTab === 'services') endpoint = `${API}/api/admin/builder/services`;
      if (activeTab === 'sheets') endpoint = `${API}/api/admin/builder/sheets`;
      if (activeTab === 'packages') endpoint = `${API}/api/admin/packages`;

      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `${endpoint}/${editingItem._id}` : endpoint;

      let body, headers = { 'Authorization': `Bearer ${token}` };

      if (activeTab === 'packages') {
        const payload = { ...formData };
        if (!payload.includedServiceIds) payload.includedServiceIds = [];
        
        const fData = new FormData();
        Object.keys(payload).forEach(key => {
          if (key === 'features' || key === 'includedServiceIds') {
            fData.append(key, JSON.stringify(payload[key]));
          }
          else fData.append(key, payload[key]);
        });
        if (coverImageFile) fData.append('coverImage', coverImageFile);
        body = fData;
        // Don't set Content-Type for FormData, browser sets it with boundary automatically
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(formData);
      }

      await fetch(url, { method, headers, body });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Error saving', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      if (activeTab === 'services') endpoint = `${API}/api/admin/builder/services`;
      if (activeTab === 'sheets') endpoint = `${API}/api/admin/builder/sheets`;
      if (activeTab === 'packages') endpoint = `${API}/api/admin/packages`;

      await fetch(`${endpoint}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      fetchData();
    } catch (err) {
      console.error('Error deleting', err);
    }
  };

  if (loading) return <div className="p-10 text-white">Loading Engine...</div>;

  return (
    <div className="p-10 min-h-screen bg-[#0a0a0a]">
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="text-blue-500" /> Dynamic Pricing Engine
          </h1>
          <p className="text-gray-400 mt-2">Manage your A La Carte services, Print Lab sheets, and pre-built bundles.</p>
        </div>
        <button onClick={() => openModal()} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition">
          <Plus size={18} /> Add {activeTab === 'services' ? 'Service' : activeTab === 'sheets' ? 'Sheet Type' : 'Bundle'}
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        {[
          { id: 'services', label: 'A La Carte Services', icon: Layers },
          { id: 'sheets', label: 'Print Lab Options', icon: Tag },
          { id: 'packages', label: 'Pre-Bundled Packages', icon: Package }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => (
            <div key={s._id} className="bg-[#111] p-6 rounded-xl border border-white/10 relative group">
              <div className="text-xs uppercase tracking-widest text-blue-400 mb-2">{s.category}</div>
              <h3 className="text-xl font-bold text-white mb-2">{s.name}</h3>
              <div className="text-2xl font-bold text-gray-200 mb-4">₹{s.basePrice}</div>
              <div className="text-sm text-gray-400">ETA: {s.estimatedDaysToDeliver} Days</div>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                <button onClick={() => openModal(s)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s._id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {services.length === 0 && <p className="text-gray-500 col-span-full">No a la carte services configured.</p>}
        </div>
      )}

      {activeTab === 'sheets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sheets.map(s => (
            <div key={s._id} className="bg-[#111] p-6 rounded-xl border border-white/10 relative group">
              <h3 className="text-xl font-bold text-white mb-2">{s.name}</h3>
              <div className="text-2xl font-bold text-gray-200 mb-1">₹{s.pricePerSheet} <span className="text-sm font-normal text-gray-500">/ sheet</span></div>
              {s.premiumCoverSurcharge > 0 && <div className="text-sm text-yellow-500 mt-2">+ ₹{s.premiumCoverSurcharge} Cover Surcharge</div>}
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                <button onClick={() => openModal(s)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s._id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {sheets.length === 0 && <p className="text-gray-500 col-span-full">No sheet types configured.</p>}
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg._id} className="bg-[#111] rounded-xl border relative group overflow-hidden" style={{ borderColor: pkg.color }}>
              {pkg.coverImage && (
                <div className="h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${pkg.coverImage})` }} />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 rounded-full text-xs font-bold bg-white/10">{pkg.b2bOrB2c.toUpperCase()} • {pkg.category}</div>
                  {!pkg.isActive && <span className="text-red-500 text-xs font-bold flex items-center gap-1"><EyeOff size={14}/> Hidden</span>}
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{pkg.tier}</h3>
                
                <div className="text-xl text-gray-300 font-medium mb-4">
                  {pkg.priceType === 'starting_at' && <span className="text-sm text-gray-500 block">Starting at</span>}
                  {pkg.price} {pkg.priceType === 'range' ? `- ${pkg.priceMax}` : ''} {pkg.suffix}
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((f, i) => <li key={i} className="text-sm text-gray-400 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"/>{f}</li>)}
                </ul>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                  <button onClick={() => openModal(pkg)} className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(pkg._id)} className="p-2 bg-red-500/50 hover:bg-red-500/80 text-red-500 rounded-lg backdrop-blur-sm"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {packages.length === 0 && <p className="text-gray-500 col-span-full">No bundled packages found.</p>}
        </div>
      )}

      {/* Dynamic Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-2xl p-8 relative my-10 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-bold text-white mb-6">{editingItem ? 'Edit' : 'Add New'} {activeTab === 'services' ? 'Service' : activeTab === 'sheets' ? 'Sheet Type' : 'Bundle'}</h2>

            <div className="space-y-4">
              
              {/* Form Fields for Services */}
              {activeTab === 'services' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Category</label>
                      <select 
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white"
                        value={formData.category || 'Photography'}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                        <option>Photography</option>
                        <option>Video</option>
                        <option>Editing</option>
                        <option>Printing</option>
                        <option>Invitations</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Service Name</label>
                      <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Drone Footage" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Base Price (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.basePrice || ''} onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})} placeholder="e.g. 5000" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Estimated Days to Deliver</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.estimatedDaysToDeliver || 1} onChange={e => setFormData({...formData, estimatedDaysToDeliver: Number(e.target.value)})} placeholder="e.g. 3" />
                    </div>
                  </div>
                </>
              )}

              {/* Form Fields for Sheets */}
              {activeTab === 'sheets' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Sheet Market Name</label>
                    <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Velvet (Feather Touch)" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Price Per Sheet (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.pricePerSheet || ''} onChange={e => setFormData({...formData, pricePerSheet: Number(e.target.value)})} placeholder="e.g. 150" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Premium Surcharge (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.premiumCoverSurcharge || 0} onChange={e => setFormData({...formData, premiumCoverSurcharge: Number(e.target.value)})} placeholder="e.g. 500" />
                    </div>
                  </div>
                </>
              )}

              {/* Form Fields for Packages */}
              {activeTab === 'packages' && (
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
                  
                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-3 gap-4">
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

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Included Services (Click to Add/Remove)</label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                      {services.map(s => {
                        const isSelected = (formData.includedServiceIds || []).includes(s._id);
                        return (
                          <div 
                            key={s._id} 
                            onClick={() => {
                              const arr = formData.includedServiceIds || [];
                              if (isSelected) {
                                setFormData({...formData, includedServiceIds: arr.filter(id => id !== s._id)});
                              } else {
                                setFormData({...formData, includedServiceIds: [...arr, s._id]});
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
              )}

            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-gray-400 hover:text-white transition">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition"><Save size={18} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingEngine;
