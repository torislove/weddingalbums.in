import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Tag, Save, X, EyeOff, Layers, Settings, Box, Sparkles, Image as ImageIcon } from 'lucide-react';

const API = (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:4000'));

const PricingEngine = () => {
  const [activeTab, setActiveTab] = useState('services'); // services, sizes, sheets, packages
  const [loading, setLoading] = useState(true);

  // Data Stores
  const [services, setServices] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [packages, setPackages] = useState([]);
  const [albumSizes, setAlbumSizes] = useState([]);

  // Modals & Forms
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Forms states
  const initService = { category: 'Premium Album Printing & Design', name: '', telugu: '', basePrice: '', studioBasePrice: '', estimatedDaysToDeliver: 2, processDescription: '', popular: false, isActive: true };
  const initSize = { name: '', dimensions: '', orientation: 'landscape', basePrice: 7500, studioBasePrice: 5200, telugu: '', description: '', popular: false, isBundle: false, bundleDiscount: 0, isActive: true };
  const initSheet = { name: '', telugu: '', pricePerSheet: '', studioPricePerSheet: '', premiumCoverSurcharge: 0, studioCoverSurcharge: 0, multiplier: 1.0, description: '', popular: false, isActive: true };
  const initPackage = { tier: '', category: 'combo', priceType: 'fixed', price: '', priceMax: '', suffix: '', includedServiceIds: [], features: [], popular: false, isActive: true, b2bOrB2c: 'b2c', color: '#D4AF37' };

  const [formData, setFormData] = useState({});
  const [coverImageFile, setCoverImageFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken') || localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [srvRes, shtRes, pkgRes, szRes] = await Promise.all([
        fetch(`${API}/api/builder/services`),
        fetch(`${API}/api/builder/sheets`),
        fetch(`${API}/api/admin/packages`, { headers }),
        fetch(`${API}/api/builder/album-sizes`)
      ]);
      setServices(await srvRes.json());
      setSheets(await shtRes.json());
      setPackages(await pkgRes.json());
      setAlbumSizes(await szRes.json());
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
      if (activeTab === 'sizes') setFormData(initSize);
      if (activeTab === 'sheets') setFormData(initSheet);
      if (activeTab === 'packages') setFormData(initPackage);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken') || localStorage.getItem('token');
      let endpoint = '';
      if (activeTab === 'services') endpoint = `${API}/api/admin/builder/services`;
      if (activeTab === 'sizes') endpoint = `${API}/api/admin/builder/album-sizes`;
      if (activeTab === 'sheets') endpoint = `${API}/api/admin/builder/sheets`;
      if (activeTab === 'packages') endpoint = `${API}/api/admin/packages`;

      const method = editingItem ? 'PUT' : 'POST';
      const itemId = editingItem ? (editingItem._id || editingItem.id) : null;
      const url = editingItem ? `${endpoint}/${itemId}` : endpoint;

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
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken') || localStorage.getItem('token');
      let endpoint = '';
      if (activeTab === 'services') endpoint = `${API}/api/admin/builder/services`;
      if (activeTab === 'sizes') endpoint = `${API}/api/admin/builder/album-sizes`;
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
    <div className="p-4 sm:p-6 md:p-10 min-h-screen bg-[#0a0a0a]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="text-[#D4AF37]" /> Dynamic Pricing Engine
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">Manage your A La Carte services, Album sizes & bubbles, Print Lab sheets, and pre-built bundles.</p>
        </div>
        <button onClick={() => openModal()} className="w-full sm:w-auto px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-lg text-sm shrink-0">
          <Plus size={18} /> Add {activeTab === 'services' ? 'Service' : activeTab === 'sizes' ? 'Album Size' : activeTab === 'sheets' ? 'Sheet Type' : 'Bundle'}
        </button>
      </div>

      <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'services', label: 'A La Carte Services', icon: Layers },
          { id: 'sizes', label: 'Album Sizes & Bubbles', icon: Box },
          { id: 'sheets', label: 'Print Lab Sheet Types', icon: Tag },
          { id: 'packages', label: 'Pre-Bundled Packages', icon: Package }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 font-medium transition text-xs sm:text-sm whitespace-nowrap ${
              activeTab === tab.id ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map(s => (
            <div key={s._id || s.id} className="bg-[#111] p-6 rounded-xl border border-white/10 relative group hover:border-[#D4AF37]/50 transition">
              <div className="flex justify-between items-start mb-2">
                <div className="text-xs uppercase tracking-widest text-blue-400 font-semibold">{s.category}</div>
                {s.popular && <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-0.5 rounded-full font-semibold border border-[#D4AF37]/30 shrink-0">⭐ Featured</span>}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{s.name}</h3>
              {s.telugu && <div className="text-xs text-[#D4AF37] mb-2 font-telugu">{s.telugu}</div>}
              <div className="flex justify-between items-baseline mb-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <div>
                  <span className="text-[11px] text-gray-400 block uppercase tracking-wider font-semibold">Customer (B2C)</span>
                  <span className="text-lg font-bold text-gray-200">₹{s.basePrice}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#D4AF37] block uppercase tracking-wider font-semibold">⚡ Studio Wholesale</span>
                  <span className="text-lg font-bold text-[#D4AF37]">₹{s.studioBasePrice || Math.round(s.basePrice * 0.7)}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">ETA: {s.estimatedDaysToDeliver} Days</div>
                      <div className="absolute top-4 right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition flex gap-2">
                <button onClick={() => openModal(s)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s._id || s.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {services.length === 0 && <p className="text-gray-500 col-span-full">No a la carte services configured.</p>}
        </div>
      )}

      {activeTab === 'sizes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {albumSizes.map(sz => (
            <div key={sz._id || sz.id} className="bg-[#111] p-6 rounded-xl border border-white/10 relative group hover:border-[#D4AF37]/50 transition">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">{sz.dimensions}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${sz.orientation === 'portrait' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                    {sz.orientation === 'portrait' ? '↕️ Portrait' : '↔️ Landscape'}
                  </span>
                </div>
                {sz.popular && <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-0.5 rounded-full font-semibold">⭐ Most Popular</span>}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{sz.name}</h3>
              {sz.telugu && <div className="text-xs text-gray-400 mb-3 font-telugu">{sz.telugu}</div>}
              
              <div className="flex justify-between items-baseline mb-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <div>
                  <span className="text-[11px] text-gray-400 block uppercase tracking-wider font-semibold">Customer Base</span>
                  <span className="text-lg font-bold text-gray-200">₹{sz.basePrice}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#D4AF37] block uppercase tracking-wider font-semibold">⚡ Studio Wholesale</span>
                  <span className="text-lg font-bold text-[#D4AF37]">₹{sz.studioBasePrice || Math.round(sz.basePrice * 0.7)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-3">{sz.description}</p>
              {sz.isBundle && <div className="text-xs text-green-400 mb-2">🎁 Bundle discount: -₹{sz.bundleDiscount}</div>}
              
              <div className="absolute top-4 right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition flex gap-2">
                <button onClick={() => openModal(sz)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(sz._id || sz.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {albumSizes.length === 0 && <p className="text-gray-500 col-span-full">No album sizes configured.</p>}
        </div>
      )}

      {activeTab === 'sheets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sheets.map(s => (
            <div key={s._id || s.id} className="bg-[#111] p-6 rounded-xl border border-white/10 relative group hover:border-[#D4AF37]/50 transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{s.name}</h3>
                  {s.telugu && <div className="text-xs text-[#D4AF37] mb-2 font-telugu">{s.telugu}</div>}
                </div>
                {s.popular && <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-0.5 rounded-full font-semibold border border-[#D4AF37]/30 shrink-0">⭐ Most Popular</span>}
              </div>
              
              <div className="flex justify-between items-baseline mb-3 bg-white/5 p-3 rounded-lg border border-white/5">
                <div>
                  <span className="text-[11px] text-gray-400 block uppercase tracking-wider font-semibold">Customer (B2C)</span>
                  <div className="text-lg font-bold text-gray-200">₹{s.pricePerSheet} <span className="text-xs font-normal text-gray-500">/ sheet</span></div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#D4AF37] block uppercase tracking-wider font-semibold">⚡ Studio Wholesale</span>
                  <div className="text-lg font-bold text-[#D4AF37]">₹{s.studioPricePerSheet || Math.round(s.pricePerSheet * 0.65)} <span className="text-xs font-normal text-[#D4AF37]/70">/ sheet</span></div>
                </div>
              </div>

              <div className="text-xs text-gray-400 flex justify-between border-t border-white/5 pt-2 mb-2">
                <span>Cover: +₹{s.premiumCoverSurcharge || 0}</span>
                <span className="text-[#D4AF37]">Studio Cover: +₹{s.studioCoverSurcharge || Math.round((s.premiumCoverSurcharge || 0) * 0.65)}</span>
              </div>

              {s.description && <div className="text-xs text-gray-400 mt-2">{s.description}</div>}
              
              <div className="absolute top-4 right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition flex gap-2">
                <button onClick={() => openModal(s)} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(s._id || s.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {sheets.length === 0 && <p className="text-gray-500 col-span-full">No sheet types configured.</p>}
        </div>
      )}

      {activeTab === 'packages' && (
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
                  <button onClick={() => openModal(pkg)} className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-lg backdrop-blur-sm"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(pkg._id || pkg.id)} className="p-2 bg-red-500/50 hover:bg-red-500/80 text-red-500 rounded-lg backdrop-blur-sm"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {packages.length === 0 && <p className="text-gray-500 col-span-full">No bundled packages found.</p>}
        </div>
      )}

      {/* Dynamic Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-2xl p-4 sm:p-8 relative my-6 sm:my-10 max-h-[92vh] overflow-y-auto">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={24} /></button>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              {editingItem ? 'Edit' : 'Add New'} {activeTab === 'services' ? 'Service' : activeTab === 'sizes' ? 'Album Size' : activeTab === 'sheets' ? 'Sheet Type' : 'Bundle'}
            </h2>

            <div className="space-y-4">
              
              {/* Form Fields for Services */}
              {activeTab === 'services' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Category</label>
                      <select 
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white"
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
                      <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. 4K Cinematic Wedding Teaser" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Telugu Title (తెలుగు శీర్షిక)</label>
                    <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white font-telugu" value={formData.telugu || ''} onChange={e => setFormData({...formData, telugu: e.target.value})} placeholder="ఉదా: 4K సినిమాటిక్ టీజర్" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Customer Price (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.basePrice || ''} onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})} placeholder="e.g. 6000" />
                    </div>
                    <div>
                      <label className="block text-sm text-[#D4AF37] mb-1 font-semibold">⚡ Studio Wholesale (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-[#D4AF37]/40 rounded-lg p-3 text-white" value={formData.studioBasePrice || ''} onChange={e => setFormData({...formData, studioBasePrice: Number(e.target.value)})} placeholder="e.g. 4200" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">ETA (Days)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.estimatedDaysToDeliver || 1} onChange={e => setFormData({...formData, estimatedDaysToDeliver: Number(e.target.value)})} placeholder="e.g. 3" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Process / Workflow Description (విధానం)</label>
                    <textarea rows="2" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white text-sm" value={formData.processDescription || ''} onChange={e => setFormData({...formData, processDescription: e.target.value})} placeholder="e.g. 1. RAW file intake -> 2. Pro color grade -> 3. Client preview -> 4. 4K master delivery" />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={formData.popular || false} onChange={e => setFormData({...formData, popular: e.target.checked})} className="w-5 h-5 rounded accent-[#D4AF37]" />
                      Mark as "Featured / Most Popular (⭐)"
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded accent-[#D4AF37]" />
                      Active on Website
                    </label>
                  </div>
                </>
              )}

              {/* Form Fields for Album Sizes */}
              {activeTab === 'sizes' && (
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
                      <label className="block text-sm text-[#D4AF37] mb-1 font-semibold">⚡ Studio Wholesale (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-[#D4AF37]/40 rounded-lg p-3 text-white" value={formData.studioBasePrice || ''} onChange={e => setFormData({...formData, studioBasePrice: Number(e.target.value)})} placeholder="e.g. 6800" />
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
                      <input type="checkbox" checked={formData.popular || false} onChange={e => setFormData({...formData, popular: e.target.checked})} className="w-5 h-5 rounded accent-[#D4AF37]" />
                      Mark as "Most Popular (⭐)"
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={formData.isBundle || false} onChange={e => setFormData({...formData, isBundle: e.target.checked})} className="w-5 h-5 rounded accent-[#D4AF37]" />
                      Is Bundle (Includes Parent Copies)
                    </label>
                  </div>
                </>
              )}

              {/* Form Fields for Sheets */}
              {activeTab === 'sheets' && (
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
                      <label className="block text-xs text-[#D4AF37] mb-1 font-semibold">⚡ Studio Wholesale / Sheet (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-[#D4AF37]/40 rounded-lg p-3 text-white" value={formData.studioPricePerSheet || ''} onChange={e => setFormData({...formData, studioPricePerSheet: Number(e.target.value)})} placeholder="e.g. 42" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Customer Cover (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.premiumCoverSurcharge || 0} onChange={e => setFormData({...formData, premiumCoverSurcharge: Number(e.target.value)})} placeholder="e.g. 1200" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#D4AF37] mb-1 font-semibold">⚡ Studio Cover (₹)</label>
                      <input type="number" className="w-full bg-[#1a1a1a] border border-[#D4AF37]/40 rounded-lg p-3 text-white" value={formData.studioCoverSurcharge || 0} onChange={e => setFormData({...formData, studioCoverSurcharge: Number(e.target.value)})} placeholder="e.g. 750" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description / Finish Feature</label>
                    <input type="text" className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. No fingerprints, anti-scratch" />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={formData.popular || false} onChange={e => setFormData({...formData, popular: e.target.checked})} className="w-5 h-5 rounded accent-[#D4AF37]" />
                      Mark as "Most Popular / Best Seller (⭐)"
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded accent-[#D4AF37]" />
                      Active in Catalog
                    </label>
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
