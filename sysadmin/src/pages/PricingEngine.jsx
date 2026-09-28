import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, ArrowUpDown, Tag, Save, X, EyeOff, Eye } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';


const PricingManager = () => {
  const [packages, setPackages] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('b2c'); // b2c, b2b, or cart_options
  const [categoryTab, setCategoryTab] = useState('combo');
  
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  
  const initialFormState = {
    tier: '',
    category: 'combo',
    price: '',
    suffix: '',
    features: [''],
    popular: false,
    isActive: true,
    sortOrder: 0,
    b2bOrB2c: 'b2c',
    color: '#9E9E9E'
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pkgRes, confRes] = await Promise.all([
        fetch(`${API}/api/admin/packages`),
        fetch(`${API}/api/admin/configs`)
      ]);
      const pkgData = await pkgRes.json();
      const confData = await confRes.json();
      setPackages(pkgData);
      setConfigs(confData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data', err);
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      await fetch(`${API}/api/admin/seed-packages`, { method: 'POST' });
      fetchData();
      alert('Packages seeded successfully!');
    } catch (err) {
      console.error('Seed error', err);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingPkg 
        ? `${API}/api/admin/packages/${editingPkg._id}`
        : `${API}/api/admin/packages`;
        
      const method = editingPkg ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: formData.features.filter(f => f.trim() !== '') // remove empty
        })
      });
      
      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Error saving package', err);
    }
  };

  const saveConfig = async (key, options) => {
    try {
      await fetch(`${API}/api/admin/configs/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ options })
      });
      fetchData();
      alert('Cart options saved successfully!');
    } catch (err) {
      console.error('Error saving config', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await fetch(`${API}/api/admin/packages/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Error deleting', err);
    }
  };

  const toggleStatus = async (pkg) => {
    try {
      await fetch(`${API}/api/admin/packages/${pkg._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !pkg.isActive })
      });
      fetchData();
    } catch (err) {
      console.error('Error toggling status', err);
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeatureRow = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };
  
  const removeFeatureRow = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const openModal = (pkg = null) => {
    if (pkg) {
      setEditingPkg(pkg);
      setFormData({
        ...pkg,
        features: pkg.features.length ? pkg.features : ['']
      });
    } else {
      setEditingPkg(null);
      setFormData({ ...initialFormState, b2bOrB2c: activeTab, category: categoryTab });
    }
    setShowModal(true);
  };

  const categories = [
    { id: 'combo', label: 'Combo Packages' },
    { id: 'photo', label: 'Photo Editing' },
    { id: 'video', label: 'Video Editing' },
    { id: 'albums', label: 'Albums' },
    { id: 'flex', label: 'Flex & Hoardings' }
  ];

  const filteredPackages = packages.filter(
    p => p.b2bOrB2c === activeTab && p.category === categoryTab
  );

  return (
    <div className="p-10 max-w-6xl mx-auto animate-slide-up h-full overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2 flex items-center gap-3">
            <Tag className="text-[#D4AF37]" /> Pricing & Packages
          </h1>
          <p className="text-gray-400">Manage your packages, prices, and features for B2C and B2B clients.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSeed} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition">
            Reset to Defaults
          </button>
          <button onClick={() => openModal()} className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#F3E5AB] transition flex items-center gap-2">
            <Plus size={18} /> Add Package
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('b2c')}
          className={`px-6 py-2 rounded-full font-medium transition ${activeTab === 'b2c' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300'}`}
        >
          B2C Packages (Couples)
        </button>
        <button 
          onClick={() => setActiveTab('b2b')}
          className={`px-6 py-2 rounded-full font-medium transition ${activeTab === 'b2b' ? 'bg-white/10 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300'}`}
        >
          B2B Packages (Studios)
        </button>
        <button 
          onClick={() => setActiveTab('cart_options')}
          className={`px-6 py-2 rounded-full font-medium transition ${activeTab === 'cart_options' ? 'bg-[#D4AF37] text-black border border-[#D4AF37]' : 'text-[#D4AF37]/70 hover:text-[#D4AF37]'}`}
        >
          Cart Builder Options
        </button>
      </div>

      {activeTab !== 'cart_options' && (
        <div className="flex gap-2 mb-8">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setCategoryTab(cat.id)}
              className={`px-4 py-1.5 rounded-md text-sm transition ${categoryTab === cat.id ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30' : 'bg-transparent text-gray-400 hover:bg-white/5 border border-transparent'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading data...</div>
      ) : activeTab === 'cart_options' ? (
        <div className="space-y-8">
          {configs.map(config => (
            <div key={config.key} className="bg-[#111] border border-white/10 rounded-xl overflow-hidden p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{config.key.replace('_', ' ')}</h3>
                <button 
                  onClick={() => saveConfig(config.key, config.options)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm flex items-center gap-2 transition"
                >
                  <Save size={14} /> Save {config.key}
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4 font-medium text-gray-500 text-sm px-4">
                <div className="col-span-2">Label</div>
                <div>Value Code</div>
                <div>Price (₹)</div>
              </div>
              
              <div className="space-y-3">
                {config.options.map((opt, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 items-center bg-white/5 p-4 rounded-lg border border-white/5">
                    <div className="col-span-2 flex items-center gap-3">
                      <input 
                        type="text" 
                        value={opt.label}
                        onChange={(e) => {
                          const newOpts = [...config.options];
                          newOpts[i].label = e.target.value;
                          const newConfigs = configs.map(c => c.key === config.key ? { ...c, options: newOpts } : c);
                          setConfigs(newConfigs);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-white" 
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        value={opt.value}
                        onChange={(e) => {
                          const newOpts = [...config.options];
                          newOpts[i].value = e.target.value;
                          const newConfigs = configs.map(c => c.key === config.key ? { ...c, options: newOpts } : c);
                          setConfigs(newConfigs);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-1.5 text-gray-400 font-mono text-sm" 
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input 
                          type="number" 
                          value={opt.price}
                          onChange={(e) => {
                            const newOpts = [...config.options];
                            newOpts[i].price = Number(e.target.value);
                            const newConfigs = configs.map(c => c.key === config.key ? { ...c, options: newOpts } : c);
                            setConfigs(newConfigs);
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded pl-7 pr-3 py-1.5 text-white" 
                        />
                      </div>
                      <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={opt.isFree}
                          onChange={(e) => {
                            const newOpts = [...config.options];
                            newOpts[i].isFree = e.target.checked;
                            if (e.target.checked) newOpts[i].price = 0;
                            const newConfigs = configs.map(c => c.key === config.key ? { ...c, options: newOpts } : c);
                            setConfigs(newConfigs);
                          }}
                          className="accent-[#D4AF37]" 
                        />
                        Free
                      </label>
                      <button 
                        onClick={() => {
                          const newOpts = config.options.filter((_, idx) => idx !== i);
                          const newConfigs = configs.map(c => c.key === config.key ? { ...c, options: newOpts } : c);
                          setConfigs(newConfigs);
                        }}
                        className="text-red-400 hover:bg-red-400/10 p-1.5 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => {
                    const newOpts = [...config.options, { label: 'New Option', value: 'new_opt', price: 0, isFree: false }];
                    const newConfigs = configs.map(c => c.key === config.key ? { ...c, options: newOpts } : c);
                    setConfigs(newConfigs);
                  }}
                  className="mt-2 text-sm text-[#D4AF37] hover:text-[#F3E5AB] flex items-center gap-1 px-4 py-2"
                >
                  <Plus size={14} /> Add new option to {config.key}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500 bg-white/5 rounded-xl border border-white/5">
              No packages found in this category.
            </div>
          )}
          
          {filteredPackages.map((pkg) => (
            <div key={pkg._id} className={`bg-[#111] border rounded-xl overflow-hidden flex flex-col ${pkg.isActive ? 'border-white/10' : 'border-red-900/30 opacity-70'}`}>
              <div className="p-6 flex-1 relative">
                {!pkg.isActive && (
                  <div className="absolute top-0 right-0 bg-red-900/50 text-red-200 text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1">
                    <EyeOff size={12} /> Hidden
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1" style={{ color: pkg.color }}>{pkg.tier}</h3>
                    {pkg.popular && <span className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] text-xs px-2 py-0.5 rounded-full mt-1">⭐ Popular</span>}
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">{pkg.price}</span>
                  {pkg.suffix && <span className="text-gray-400 text-sm ml-1">{pkg.suffix}</span>}
                </div>
                
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t border-white/10 p-4 bg-white/5 flex justify-between items-center">
                <button 
                  onClick={() => toggleStatus(pkg)} 
                  className={`text-sm flex items-center gap-1 ${pkg.isActive ? 'text-yellow-500 hover:text-yellow-400' : 'text-green-500 hover:text-green-400'}`}
                >
                  {pkg.isActive ? <><EyeOff size={14}/> Hide</> : <><Eye size={14}/> Show</>}
                </button>
                <div className="flex gap-3">
                  <button onClick={() => openModal(pkg)} className="text-blue-400 hover:text-blue-300 transition" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(pkg._id)} className="text-red-400 hover:text-red-300 transition" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h2 className="text-xl font-bold text-white">{editingPkg ? 'Edit Package' : 'Add New Package'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Package Name / Tier</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" 
                    value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})} placeholder="e.g. Starter Memories" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Theme Color</label>
                  <div className="flex gap-3 h-10">
                    <input type="color" className="h-full w-12 rounded cursor-pointer bg-transparent border-0 p-0" 
                      value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                    <input type="text" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" 
                      value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" 
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. ₹5,000" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Suffix (Optional)</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" 
                    value={formData.suffix} onChange={e => setFormData({...formData, suffix: e.target.value})} placeholder="e.g. /wedding or /photo" />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Target Audience</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" 
                    value={formData.b2bOrB2c} onChange={e => setFormData({...formData, b2bOrB2c: e.target.value})}>
                    <option value="b2c">B2C (Couples)</option>
                    <option value="b2b">B2B (Studios)</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Features (Bullet Points)</label>
                <div className="space-y-2">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input type="text" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" 
                        value={feature} onChange={e => handleFeatureChange(idx, e.target.value)} placeholder="Feature description" />
                      <button onClick={() => removeFeatureRow(idx)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addFeatureRow} className="mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <Plus size={14} /> Add Feature
                </button>
              </div>

              <div className="flex gap-6 pt-4 border-t border-white/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#D4AF37]" 
                    checked={formData.popular} onChange={e => setFormData({...formData, popular: e.target.checked})} />
                  <span className="text-gray-300">Mark as "Popular"</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#D4AF37]" 
                    checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                  <span className="text-gray-300">Active (Visible on site)</span>
                </label>
              </div>
            </div>
            
            <div className="p-5 border-t border-white/10 bg-black/40 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 transition">
                Cancel
              </button>
              <button onClick={handleSave} disabled={!formData.tier || !formData.price} 
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#996515] text-black font-bold hover:brightness-110 transition disabled:opacity-50 flex items-center gap-2">
                <Save size={18} /> {editingPkg ? 'Update Package' : 'Create Package'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PricingManager;
