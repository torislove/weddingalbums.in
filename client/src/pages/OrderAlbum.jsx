import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import { ShoppingCart, CheckCircle2, Package, Image, Video, UploadCloud, Truck } from 'lucide-react';
import './OrderAlbum.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';


const OrderAlbum = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  const [step, setStep] = useState(1);
  const [configs, setConfigs] = useState({});
  const [packages, setPackages] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    
    // Base Selection
    basePackage: null, // full package object if they choose a combo
    
    // Album Specs
    size: null,
    sheetType: null,
    coverType: null,
    pages: 30, // Default 30 pages
    
    // Add-ons
    addons: [], // array of package objects (video/photo)
    
    instructions: '',
    photos: []
  });

  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pkgRes, confRes] = await Promise.all([
          fetch(`${API}/api/packages?type=b2c`),
          fetch(`${API}/api/admin/configs`)
        ]);
        
        const pkgData = await pkgRes.json();
        const confData = await confRes.json();
        
        setPackages(pkgData);
        
        // Convert array of configs to a mapped object { album_sizes: [...], sheet_types: [...] }
        const configMap = {};
        confData.forEach(c => { configMap[c.key] = c.options; });
        setConfigs(configMap);
        
        // Set defaults if available
        if (configMap.album_sizes?.length) setFormData(p => ({ ...p, size: configMap.album_sizes[0] }));
        if (configMap.sheet_types?.length) setFormData(p => ({ ...p, sheetType: configMap.sheet_types[0] }));
        if (configMap.cover_types?.length) setFormData(p => ({ ...p, coverType: configMap.cover_types[0] }));

      } catch (err) {
        console.error('Failed to load cart options', err);
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, []);

  const getNumberPrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    return Number(priceStr.replace(/[^0-9.-]+/g,""));
  };

  const calculateTotal = () => {
    let total = 0;
    
    // 1. Base Package OR Custom Build
    if (formData.basePackage) {
      total += getNumberPrice(formData.basePackage.price);
    } else {
      if (formData.size) total += formData.size.price;
      if (formData.sheetType) total += (formData.sheetType.price * formData.pages); // Sheet price * pages
      if (formData.coverType) total += formData.coverType.price;
    }

    // 2. Add-ons
    formData.addons.forEach(addon => {
      total += getNumberPrice(addon.price);
    });

    return total;
  };

  const toggleAddon = (pkg) => {
    const exists = formData.addons.find(a => a._id === pkg._id);
    if (exists) {
      setFormData(prev => ({ ...prev, addons: prev.addons.filter(a => a._id !== pkg._id) }));
    } else {
      setFormData(prev => ({ ...prev, addons: [...prev.addons, pkg] }));
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setUploading(true);
    const newPhotos = [];
    
    for (const file of files) {
      const fd = new FormData();
      fd.append('image', file);
      try {
        const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const res = await fetch(`${API}/api/upload`, {
          method: 'POST',
          body: fd
        });
        const data = await res.json();
        if (data.url) newPhotos.push(data.url);
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
    
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    setUploading(false);
  };

  const submitOrder = async (currentUser = user) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      // Simulate Razorpay Checkout
      const mockRazorpay = new Promise((resolve) => {
        setTimeout(() => resolve({ paymentId: 'pay_' + Math.random().toString(36).substring(7) }), 1500);
      });
      
      const payment = await mockRazorpay;
      
      const newOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const finalOrder = { ...formData, orderId: newOrderId, total: calculateTotal(), paymentId: payment.paymentId };
      
      const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalOrder)
      });
      setFormData(prev => ({ ...prev, orderId: newOrderId }));
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit order', err);
    }
  };

  if (fetching) {
    return <div className="order-container text-center py-20 text-gray-500">Loading builder options...</div>;
  }

  if (submitted) {
    return (
      <div className="order-container success">
        <CheckCircle2 size={64} className="text-[#D4AF37] mx-auto mb-6" />
        <h2 className="text-3xl font-serif text-white mb-4">Order Placed Successfully! 🎉</h2>
        <p className="text-gray-400 mb-6">Thank you, {formData.name}. Your album specifications and media have been sent to our design team.</p>
        <div className="bg-black/30 p-6 rounded-xl border border-white/10 mb-8 max-w-md mx-auto">
          <p className="text-gray-300">Order ID: <strong className="text-white">{formData.orderId}</strong></p>
          <p className="text-gray-300 mt-2">Estimated Total</p>
          <p className="text-4xl font-bold text-[#10b981] my-2">₹{calculateTotal().toLocaleString('en-IN')}</p>
        </div>
        <p className="text-gray-500 text-sm">We will email you the final invoice and a 3D proof of the design before printing.</p>
        <button onClick={() => navigate('/')} className="btn btn-outline mt-8">Return Home</button>
      </div>
    );
  }

  return (
    <div className="builder-layout">
      {/* LEFT: Builder Steps */}
      <div className="builder-main">
        <div className="order-header text-left mb-10">
          <h1 className="text-4xl font-serif text-gradient mb-2">Build Your Bundle</h1>
          <p className="text-gray-400">Customize your services, upload media, and checkout instantly.</p>
        </div>

        <div className="builder-progress">
          {[
            { n: 1, label: 'Base', icon: Package },
            { n: 2, label: 'Specs', icon: Image },
            { n: 3, label: 'Add-ons', icon: Video },
            { n: 4, label: 'Shipping', icon: Truck },
            { n: 5, label: 'Upload', icon: UploadCloud }
          ].map(s => (
            <div key={s.n} className={`progress-step ${step === s.n ? 'active' : step > s.n ? 'completed' : ''}`}>
              <div className="step-icon"><s.icon size={16} /></div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="builder-content">
          
          {/* STEP 1: Choose Base */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif text-white mb-6">Step 1: Choose Your Base</h3>
              <p className="text-gray-400 mb-6">Select a pre-built combo package for the best value, or start from scratch.</p>
              
              <div className="grid grid-2 gap-4">
                <div 
                  className={`base-card ${!formData.basePackage ? 'selected' : ''}`}
                  onClick={() => setFormData(p => ({ ...p, basePackage: null }))}
                >
                  <h4>A La Carte (Build from Scratch)</h4>
                  <p>Pay exactly for the album size and pages you want.</p>
                </div>
                
                {packages.filter(p => p.category === 'combo').map(pkg => (
                  <div 
                    key={pkg._id} 
                    className={`base-card ${formData.basePackage?._id === pkg._id ? 'selected' : ''}`}
                    onClick={() => setFormData(p => ({ ...p, basePackage: pkg }))}
                  >
                    <h4>{pkg.tier} <span className="float-right text-[#D4AF37]">{pkg.price}</span></h4>
                    <ul className="text-sm mt-3 space-y-1 text-gray-400 list-disc pl-4">
                      {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-8">
                <button className="btn btn-primary" onClick={() => setStep(2)}>Continue to Specs</button>
              </div>
            </div>
          )}

          {/* STEP 2: Album Specs */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif text-white mb-2">Step 2: Album Specifications</h3>
              
              {formData.basePackage ? (
                <div className="bg-black/30 border border-[#D4AF37]/30 p-6 rounded-xl mb-6 text-center">
                  <Package className="mx-auto text-[#D4AF37] mb-3" size={32} />
                  <p className="text-gray-300">You selected the <strong>{formData.basePackage.tier}</strong> package.</p>
                  <p className="text-sm text-gray-500 mt-2">Base specifications are included. You can skip this step or choose a different base package.</p>
                </div>
              ) : (
                <div className="space-y-8 mt-6">
                  <div>
                    <label className="block text-gray-400 mb-3 font-medium">Album Size</label>
                    <div className="grid grid-2 gap-3">
                      {configs.album_sizes?.map(opt => (
                        <div 
                          key={opt.value} 
                          className={`spec-option ${formData.size?.value === opt.value ? 'selected' : ''}`}
                          onClick={() => setFormData(p => ({ ...p, size: opt }))}
                        >
                          <span>{opt.label}</span>
                          <span className="text-[#D4AF37]">₹{opt.price.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-3 font-medium">Sheet Type (Paper Finish)</label>
                    <div className="grid grid-2 gap-3">
                      {configs.sheet_types?.map(opt => (
                        <div 
                          key={opt.value} 
                          className={`spec-option ${formData.sheetType?.value === opt.value ? 'selected' : ''}`}
                          onClick={() => setFormData(p => ({ ...p, sheetType: opt }))}
                        >
                          <span>{opt.label}</span>
                          <span className="text-[#D4AF37]">₹{opt.price} / sheet</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-3 font-medium">Cover Type</label>
                    <div className="grid grid-2 gap-3">
                      {configs.cover_types?.map(opt => (
                        <div 
                          key={opt.value} 
                          className={`spec-option ${formData.coverType?.value === opt.value ? 'selected' : ''}`}
                          onClick={() => setFormData(p => ({ ...p, coverType: opt }))}
                        >
                          <span>{opt.label}</span>
                          <span className="text-[#D4AF37]">{opt.isFree ? 'FREE' : `+₹${opt.price.toLocaleString('en-IN')}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-3 font-medium flex justify-between">
                      <span>Total Pages (Sheets)</span>
                      <span className="text-[#D4AF37]">30 is standard</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" min="10" max="100" step="5"
                        value={formData.pages}
                        onChange={(e) => setFormData(p => ({ ...p, pages: Number(e.target.value) }))}
                        className="flex-1"
                      />
                      <span className="text-2xl font-mono text-white w-16 text-center bg-white/10 rounded py-1">{formData.pages}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-10">
                <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>Continue to Add-ons</button>
              </div>
            </div>
          )}

          {/* STEP 3: Add-ons */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif text-white mb-6">Step 3: Extra Services</h3>
              <p className="text-gray-400 mb-6">Bundle video editing, extra photo retouching, or flex banners.</p>
              
              <div className="space-y-6 mt-6">
                {packages.filter(p => p.category !== 'combo').map(pkg => {
                  const isSelected = formData.addons.some(a => a._id === pkg._id);
                  return (
                    <div 
                      key={pkg._id} 
                      className={`addon-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleAddon(pkg)}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div>
                          <h4 className="text-lg text-white font-medium">{pkg.tier}</h4>
                          <p className="text-sm text-gray-500 mt-1 capitalize">{pkg.category} Service</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#D4AF37] font-bold text-lg">{pkg.price}</p>
                          <div className={`mt-2 text-sm px-3 py-1 rounded-full ${isSelected ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white'}`}>
                            {isSelected ? '✓ Added' : '+ Add to bundle'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-10">
                <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(4)}>Continue to Shipping</button>
              </div>
            </div>
          )}

          {/* STEP 4: Shipping details */}
          {step === 4 && (
            <div className="animate-fade-in order-form-inline">
              <h3 className="text-2xl font-serif text-white mb-6">Step 4: Contact & Shipping</h3>
              
              <label>Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              
              <label>Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              
              <label>Contact Number</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91" required />
              
              <label>Shipping Address (For physical prints)</label>
              <textarea 
                rows="3"
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                placeholder="Flat no, Building, Street, City, State, PIN Code"
                className="form-textarea"
              />

              <label>Special Instructions</label>
              <textarea 
                rows="2"
                value={formData.instructions} 
                onChange={e => setFormData({...formData, instructions: e.target.value})} 
                placeholder="Any special design requests..."
                className="form-textarea"
              />
              
              <div className="flex justify-between mt-8">
                <button className="btn btn-outline" onClick={() => setStep(3)}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(5)}>Continue to Upload</button>
              </div>
            </div>
          )}

          {/* STEP 5: Upload & Submit */}
          {step === 5 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif text-white mb-6">Step 5: Upload Media</h3>
              <p className="text-gray-400 mb-6">Upload your photos. (For large video files, you can skip this and share a Google Drive link in your instructions).</p>
              
              <label className="upload-btn-large">
                <UploadCloud size={40} className="mx-auto mb-3 opacity-70" />
                {uploading ? 'Uploading...' : 'Click to Select Photos'}
                <input type="file" multiple accept="image/jpeg, image/png" onChange={handleUpload} disabled={uploading} hidden />
              </label>
              
              {uploading && <p className="upload-status">Uploading photos, please keep this window open...</p>}
              
              <div className="photo-preview-grid">
                {formData.photos.map((url, i) => (
                  <div key={i} className="preview-item">
                    <img src={url} alt="upload preview" className="preview-img" />
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-10">
                <button className="btn btn-outline" onClick={() => setStep(4)}>Back</button>
                <button className="btn btn-gold-3d" onClick={() => submitOrder()} disabled={uploading}>
                  Submit Order
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* RIGHT: Cart Sidebar */}
      <div className="builder-sidebar">
        <div className="cart-sticky">
          <div className="cart-header">
            <ShoppingCart size={20} className="text-[#D4AF37]" />
            <h3>Your Bundle</h3>
          </div>
          
          <div className="cart-items">
            {/* Base Item */}
            {formData.basePackage ? (
              <div className="cart-item">
                <div>
                  <p className="item-title">Base: {formData.basePackage.tier}</p>
                  <p className="item-desc">All-inclusive combo</p>
                </div>
                <p className="item-price">{formData.basePackage.price}</p>
              </div>
            ) : (
              <>
                <div className="cart-item">
                  <div>
                    <p className="item-title">Album Size</p>
                    <p className="item-desc">{formData.size?.label || 'Not selected'}</p>
                  </div>
                  <p className="item-price">₹{formData.size?.price.toLocaleString('en-IN') || 0}</p>
                </div>
                
                <div className="cart-item">
                  <div>
                    <p className="item-title">Sheet Type ({formData.pages} pages)</p>
                    <p className="item-desc">{formData.sheetType?.label || 'Not selected'}</p>
                  </div>
                  <p className="item-price">₹{((formData.sheetType?.price || 0) * formData.pages).toLocaleString('en-IN')}</p>
                </div>
                
                <div className="cart-item">
                  <div>
                    <p className="item-title">Cover Type</p>
                    <p className="item-desc">{formData.coverType?.label || 'Not selected'}</p>
                  </div>
                  <p className="item-price">₹{formData.coverType?.price.toLocaleString('en-IN') || 0}</p>
                </div>
              </>
            )}

            {/* Add-ons */}
            {formData.addons.length > 0 && (
              <div className="cart-addons-section">
                <h5 className="text-xs text-gray-500 uppercase tracking-widest mt-4 mb-2 font-bold">Add-ons</h5>
                {formData.addons.map(addon => (
                  <div key={addon._id} className="cart-item">
                    <div>
                      <p className="item-title">{addon.tier}</p>
                      <p className="item-desc">{addon.category}</p>
                    </div>
                    <p className="item-price">{addon.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="cart-total">
            <span>Total Estimated</span>
            <span className="total-val">₹{calculateTotal().toLocaleString('en-IN')}</span>
          </div>

          <div className="cart-footer-note">
            <p className="text-xs text-gray-500 text-center mt-4">
              Shipping and GST calculated during final invoicing. 50% advance required to begin work.
            </p>
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultRole="b2c"
        onSuccess={(newUser) => {
          setShowAuthModal(false);
          submitOrder(newUser);
        }}
      />
    </div>
  );
};

export default OrderAlbum;
