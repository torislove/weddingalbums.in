import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import { ShoppingCart, CheckCircle2, Package, Image, Video, UploadCloud, Truck, MonitorPlay, Printer, Film, Palette } from 'lucide-react';
import './OrderAlbum.css';

const API = (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:4000'));

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
    
    // Step 1: Selected Services
    services: {
      design: false,
      print: false,
      video: false,
      retouch: false
    },
    
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
        
        const configMap = {};
        confData.forEach(c => { configMap[c.key] = c.options; });
        setConfigs(configMap);
        
        if (configMap.album_sizes?.length) setFormData(p => ({ ...p, size: configMap.album_sizes[0] }));
        if (configMap.sheet_types?.length) setFormData(p => ({ ...p, sheetType: configMap.sheet_types[0] }));
        if (configMap.cover_types?.length) setFormData(p => ({ ...p, coverType: configMap.cover_types[0] }));

      } catch (err) {
        console.error('Failed to load builder options', err);
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
    
    // Album Cost
    if (formData.services.design || formData.services.print) {
      if (formData.size) total += formData.size.price;
      if (formData.sheetType) total += (formData.sheetType.price * formData.pages);
      if (formData.coverType) total += formData.coverType.price;
    }

    // Add-ons
    formData.addons.forEach(addon => {
      total += getNumberPrice(addon.price);
    });

    return total;
  };

  const toggleService = (serviceKey) => {
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceKey]: !prev.services[serviceKey]
      }
    }));
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
        const res = await fetch(`${API}/api/upload`, { method: 'POST', body: fd });
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
      const mockRazorpay = new Promise((resolve) => setTimeout(() => resolve({ paymentId: 'pay_' + Math.random().toString(36).substring(7) }), 1500));
      const payment = await mockRazorpay;
      
      const newOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const finalOrder = { ...formData, orderId: newOrderId, total: calculateTotal(), paymentId: payment.paymentId };
      
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

  const proceedToNextStep = () => {
    if (step === 1) {
      if (!formData.services.design && !formData.services.print && !formData.services.video && !formData.services.retouch) {
        alert("Please select at least one service to continue.");
        return;
      }
      if (formData.services.design || formData.services.print) {
        setStep(2); // Album Specs
      } else {
        setStep(3); // Skip to Add-ons
      }
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    }
  };

  const goBackStep = () => {
    if (step === 5) setStep(4);
    else if (step === 4) setStep(3);
    else if (step === 3) {
      if (formData.services.design || formData.services.print) setStep(2);
      else setStep(1);
    } else if (step === 2) {
      setStep(1);
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
        <p className="text-gray-400 mb-6">Thank you, {formData.name}. Your specifications and media have been sent to our production team.</p>
        <div className="bg-black/30 p-6 rounded-xl border border-white/10 mb-8 max-w-md mx-auto">
          <p className="text-gray-300">Order ID: <strong className="text-white">{formData.orderId}</strong></p>
          <p className="text-gray-300 mt-2">Estimated Total</p>
          <p className="text-4xl font-bold text-[#10b981] my-2">₹{calculateTotal().toLocaleString('en-IN')}</p>
        </div>
        <button onClick={() => navigate('/')} className="btn btn-outline mt-8">Return Home</button>
      </div>
    );
  }

  return (
    <div className="builder-layout">
      {/* LEFT: Builder Steps */}
      <div className="builder-main">
        <div className="order-header text-left mb-10">
          <h1 className="text-4xl font-serif text-gradient mb-2">Build Your Custom Order</h1>
          <p className="text-gray-400">Select exactly what you need. We'll handle the rest.</p>
        </div>

        <div className="builder-progress">
          {[
            { id: 'services', label: 'Services', icon: Package, originalStep: 1 },
            { id: 'album', label: 'Album Specs', icon: Image, originalStep: 2 },
            { id: 'addons', label: 'Add-ons', icon: Video, originalStep: 3 },
            { id: 'shipping', label: 'Shipping', icon: Truck, originalStep: 4 },
            { id: 'upload', label: 'Upload', icon: UploadCloud, originalStep: 5 }
          ].filter(s => {
            if (s.id === 'album' && !formData.services.design && !formData.services.print && step !== 1) return false;
            return true;
          }).map((s, index) => {
            const visualStepNum = index + 1;
            return (
              <div key={s.id} className={`progress-step ${step === s.originalStep ? 'active' : step > s.originalStep ? 'completed' : ''}`}>
                <div className="step-icon">
                  {step > s.originalStep ? <CheckCircle2 size={20} /> : <s.icon size={16} />}
                </div>
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        <div className="builder-content">
          
          {/* STEP 1: Select Services */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif text-white mb-6">What can we build for you?</h3>
              <p className="text-gray-400 mb-6">Select all the services you need. We will customize the next steps based on your choices.</p>
              
              <div className="grid grid-2 gap-4">
                <div className={`base-card flex items-start gap-4 ${formData.services.design ? 'selected' : ''}`} onClick={() => toggleService('design')}>
                  <MonitorPlay size={32} className={formData.services.design ? 'text-[#D4AF37]' : 'text-gray-500'} />
                  <div>
                    <h4>Album Designing</h4>
                    <p className="text-sm mt-1 text-gray-400">I have raw photos. I need them culled, color-corrected, and laid out into a beautiful album.</p>
                  </div>
                </div>
                
                <div className={`base-card flex items-start gap-4 ${formData.services.print ? 'selected' : ''}`} onClick={() => toggleService('print')}>
                  <Printer size={32} className={formData.services.print ? 'text-[#D4AF37]' : 'text-gray-500'} />
                  <div>
                    <h4>Album Printing</h4>
                    <p className="text-sm mt-1 text-gray-400">I already have the designs. I just need it printed on premium paper and bound.</p>
                  </div>
                </div>

                <div className={`base-card flex items-start gap-4 ${formData.services.video ? 'selected' : ''}`} onClick={() => toggleService('video')}>
                  <Film size={32} className={formData.services.video ? 'text-[#D4AF37]' : 'text-gray-500'} />
                  <div>
                    <h4>Video Editing</h4>
                    <p className="text-sm mt-1 text-gray-400">Cinematic teasers, highlights, reels, or full traditional wedding films.</p>
                  </div>
                </div>

                <div className={`base-card flex items-start gap-4 ${formData.services.retouch ? 'selected' : ''}`} onClick={() => toggleService('retouch')}>
                  <Palette size={32} className={formData.services.retouch ? 'text-[#D4AF37]' : 'text-gray-500'} />
                  <div>
                    <h4>Photo Retouching</h4>
                    <p className="text-sm mt-1 text-gray-400">High-end skin retouching, blemish removal, and color grading.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-black/40 border border-white/10 p-5 rounded-xl">
                <p className="text-sm text-gray-400">
                  <strong className="text-[#D4AF37]">Pro Tip:</strong> Select both <strong className="text-white">Album Designing</strong> and <strong className="text-white">Printing</strong> to get our full end-to-end album creation service.
                </p>
              </div>
              
              <div className="flex justify-end mt-8">
                <button className="btn btn-primary" onClick={proceedToNextStep}>Continue Next</button>
              </div>
            </div>
          )}

          {/* STEP 2: Album Specs */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif text-white mb-2">Album Dimensions & Quality</h3>
              <p className="text-gray-400 mb-6">Select the perfect size and feel for your wedding album.</p>
              
              <div className="space-y-8 mt-6">
                <div>
                  <label className="block text-white mb-3 font-medium">Album Size (Popular in India)</label>
                  <div className="grid grid-2 gap-3">
                    {configs.album_sizes?.map(opt => (
                      <div 
                        key={opt.value} 
                        className={`spec-option ${formData.size?.value === opt.value ? 'selected' : ''}`}
                        onClick={() => setFormData(p => ({ ...p, size: opt }))}
                      >
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-white">{opt.label.split('(')[0]}</span>
                          <span className="text-xs text-gray-400 mt-1">{opt.label.includes('(') ? '(' + opt.label.split('(')[1] : ''}</span>
                        </div>
                        <span className="text-[#D4AF37] font-mono text-lg flex-shrink-0">₹{opt.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-3 font-medium">Sheet Type (Paper Finish)</label>
                  <div className="grid grid-2 gap-3">
                    {configs.sheet_types?.map(opt => (
                      <div 
                        key={opt.value} 
                        className={`spec-option ${formData.sheetType?.value === opt.value ? 'selected' : ''}`}
                        onClick={() => setFormData(p => ({ ...p, sheetType: opt }))}
                      >
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-white">{opt.label.split('(')[0]}</span>
                          <span className="text-xs text-gray-400 mt-1">{opt.label.includes('(') ? '(' + opt.label.split('(')[1] : ''}</span>
                        </div>
                        <span className="text-[#D4AF37] font-mono text-lg flex-shrink-0">₹{opt.price} <span className="text-xs">/ sheet</span></span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-3 font-medium flex justify-between">
                    <span>Total Sheets (1 Sheet = 2 Pages)</span>
                    <span className="text-[#D4AF37] text-sm font-normal">Standard is 30-50 sheets</span>
                  </label>
                  <div className="grid grid-4 gap-3">
                    {[30, 40, 50, 60, 80, 100, 120, 150].map(count => (
                      <div 
                        key={count}
                        className={`spec-option text-center py-3 flex-col justify-center ${formData.pages === count ? 'selected' : ''}`}
                        onClick={() => setFormData(p => ({ ...p, pages: count }))}
                      >
                        <span className="text-xl font-bold text-white mb-1">{count}</span>
                        <span className="text-xs text-gray-400">Sheets</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4 bg-black/40 border border-white/10 p-3 rounded-lg">
                    <span className="text-gray-400 text-sm flex-1">Need a specific number? Type it here:</span>
                    <input 
                      type="number" min="10" max="300" placeholder="Custom"
                      value={formData.pages}
                      onChange={(e) => {
                        const val = Math.max(10, Math.min(300, Number(e.target.value)));
                        setFormData(p => ({ ...p, pages: val }));
                      }}
                      className="form-input text-center font-bold text-white w-24 !h-10 !px-2"
                      style={{ background: 'rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.3)' }}
                    />
                    <span className="text-gray-400 text-sm">Sheets</span>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-3 font-medium">Cover Type</label>
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

              </div>
              
              <div className="flex justify-between mt-10">
                <button className="btn btn-outline" onClick={goBackStep}>Back</button>
                <button className="btn btn-primary" onClick={proceedToNextStep}>Continue Next</button>
              </div>
            </div>
          )}

          {/* STEP 3: Add-ons (Video & Editing) */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif text-white mb-6">Specialized Services</h3>
              <p className="text-gray-400 mb-6">Add specific video edits or priority printing options.</p>
              
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
                <button className="btn btn-outline" onClick={goBackStep}>Back</button>
                <button className="btn btn-primary" onClick={proceedToNextStep}>Continue to Shipping</button>
              </div>
            </div>
          )}

          {/* STEP 4: Shipping details */}
          {step === 4 && (
            <div className="animate-fade-in order-form-inline">
              <h3 className="text-2xl font-serif text-white mb-6">Contact & Shipping</h3>
              
              <label>Full Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              
              <label>Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              
              <label>Contact Number</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91" required />
              
              {formData.services.print && (
                <>
                  <label>Shipping Address (For physical prints)</label>
                  <textarea 
                    rows="3"
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    placeholder="Flat no, Building, Street, City, State, PIN Code"
                    className="form-textarea"
                  />
                </>
              )}

              <label>Special Instructions</label>
              <textarea 
                rows="2"
                value={formData.instructions} 
                onChange={e => setFormData({...formData, instructions: e.target.value})} 
                placeholder="Any special design or video editing requests..."
                className="form-textarea"
              />
              
              <div className="flex justify-between mt-8">
                <button className="btn btn-outline" onClick={goBackStep}>Back</button>
                <button className="btn btn-primary" onClick={proceedToNextStep}>Continue to Upload</button>
              </div>
            </div>
          )}

          {/* STEP 5: Upload & Submit */}
          {step === 5 && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-serif text-white mb-6">Provide Media</h3>
              <p className="text-gray-400 mb-6">To ensure the highest quality without file size limits, please select how you will transfer your photos/videos.</p>
              
              <div className="grid grid-2 gap-4 mb-8">
                <div 
                  className={`base-card ${formData.uploadPreference !== 'physical' ? 'selected' : ''}`}
                  onClick={() => setFormData(p => ({...p, uploadPreference: 'link'}))}
                >
                  <UploadCloud size={24} className="mb-2 text-[#D4AF37]" />
                  <h4 className="text-white font-medium">Cloud Storage Link</h4>
                  <p className="text-xs text-gray-400">Google Drive, WeTransfer, Dropbox</p>
                </div>
                <div 
                  className={`base-card ${formData.uploadPreference === 'physical' ? 'selected' : ''}`}
                  onClick={() => setFormData(p => ({...p, uploadPreference: 'physical', cloudLink: ''}))}
                >
                  <HardDrive size={24} className="mb-2 text-[#D4AF37]" />
                  <h4 className="text-white font-medium">Send Hard Drive</h4>
                  <p className="text-xs text-gray-400">Ship USB/Drive to our office</p>
                </div>
              </div>

              {formData.uploadPreference === 'physical' ? (
                <div className="bg-black/40 border border-white/10 p-6 rounded-xl mb-6 text-center">
                  <HardDrive size={40} className="mx-auto mb-4 text-[#D4AF37]" />
                  <h4 className="text-white text-xl mb-3">Ship Your Drive to Our Office</h4>
                  <p className="text-gray-400 mb-4 text-sm">
                    Please pack your Hard Disk or Pendrive securely. Submit this order now to generate an ID, and include the Order ID on your shipping label.
                  </p>
                  <div className="inline-block text-left bg-black/60 p-4 rounded border border-[#D4AF37]/30 text-gray-300 text-sm">
                    <strong className="text-white">WeddingAlbums.in Processing Center</strong><br/>
                    Plot No 45, Jubilee Hills Checkpost<br/>
                    Hyderabad, Telangana 500033<br/>
                    Ph: +91 98765 43210
                  </div>
                  <p className="mt-4 text-xs text-[#D4AF37]">
                    * We will confirm receipt and begin culling/designing immediately once the drive arrives.
                  </p>
                </div>
              ) : (
                <div className="bg-black/40 border border-white/10 p-6 rounded-xl mb-6">
                  <div className="flex gap-4 mb-6 text-gray-400 justify-center">
                    <div className="flex items-center gap-2"><UploadCloud size={18} className="text-[#D4AF37]" /> Google Drive</div>
                    <div className="flex items-center gap-2"><Film size={18} className="text-[#D4AF37]" /> WeTransfer</div>
                    <div className="flex items-center gap-2"><UploadCloud size={18} className="text-[#D4AF37]" /> Dropbox</div>
                  </div>

                  <label className="block text-white mb-3 font-medium text-lg">Paste your Cloud Storage Link here</label>
                  <input 
                    type="url" 
                    placeholder="https://drive.google.com/..." 
                    className="form-input w-full p-4 text-lg"
                    value={formData.cloudLink || ''}
                    onChange={(e) => setFormData(p => ({...p, cloudLink: e.target.value}))}
                    required
                  />
                  <p className="text-sm text-[#D4AF37] mt-3 flex items-center gap-2">
                    <CheckCircle size={16} /> Please ensure the link permission is set to "Anyone with the link can view". We will cull your photos after the order.
                  </p>
                </div>
              )}

              <div className="flex justify-between mt-10">
                <button className="btn btn-outline" onClick={goBackStep}>Back</button>
                <button 
                  className="btn btn-gold-3d px-8 py-3 bg-[#D4AF37] text-black font-bold rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50" 
                  onClick={() => submitOrder()} 
                  disabled={formData.uploadPreference !== 'physical' && !formData.cloudLink}
                >
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
            {/* Services Selected */}
            <div className="cart-item">
              <div>
                <p className="item-title">Selected Services</p>
                <p className="item-desc text-[#D4AF37]">
                  {[
                    formData.services.design && 'Design',
                    formData.services.print && 'Print',
                    formData.services.video && 'Video',
                    formData.services.retouch && 'Retouching'
                  ].filter(Boolean).join(', ') || 'None selected'}
                </p>
              </div>
            </div>

            {/* Album Specs (If selected) */}
            {(formData.services.design || formData.services.print) && (
              <div className="cart-addons-section">
                <h5 className="text-xs text-gray-500 uppercase tracking-widest mt-4 mb-2 font-bold">Album Specifications</h5>
                
                <div className="cart-item">
                  <div>
                    <p className="item-title">Album Size</p>
                    <p className="item-desc">{formData.size?.label.split('(')[0] || 'Not selected'}</p>
                  </div>
                  <p className="item-price">₹{formData.size?.price.toLocaleString('en-IN') || 0}</p>
                </div>
                
                <div className="cart-item">
                  <div>
                    <p className="item-title">Sheet Type ({formData.pages} sheets)</p>
                    <p className="item-desc">{formData.sheetType?.label.split('(')[0] || 'Not selected'}</p>
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
              </div>
            )}

            {/* Add-ons */}
            {formData.addons.length > 0 && (
              <div className="cart-addons-section">
                <h5 className="text-xs text-gray-500 uppercase tracking-widest mt-4 mb-2 font-bold">Specialized Add-ons</h5>
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
              Pricing is dynamic. Shipping and GST calculated during final invoicing. 50% advance required to begin work.
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
