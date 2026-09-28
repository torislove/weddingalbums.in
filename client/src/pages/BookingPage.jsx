import React, { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import Toast from '../components/Toast';
import { Package, Layers, Tag, Check, Calendar, ShoppingCart, Loader2, Camera, Video, Scissors, Plane, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const BookingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Data
  const [bundles, setBundles] = useState([]);
  const [services, setServices] = useState([]);
  const [sheets, setSheets] = useState([]);

  // Cart State
  const [selectedBundleId, setSelectedBundleId] = useState(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [sheetCount, setSheetCount] = useState(30);
  const [activeCategory, setActiveCategory] = useState('Photography');

  // Computed
  const [etaDays, setEtaDays] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bRes, sRes, shRes] = await Promise.all([
        fetch(`${API}/api/packages?type=both`), // Get all active packages
        fetch(`${API}/api/builder/services`),
        fetch(`${API}/api/builder/sheets`),
      ]);
      setBundles(await bRes.json());
      setServices(await sRes.json());
      setSheets(await shRes.json());

      // Attempt to load existing cart if logged in
      const token = localStorage.getItem('token');
      if (token) {
        const cartRes = await fetch(`${API}/api/cart`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          if (cartData.items && cartData.items.length > 0) {
            // Restore state logic could go here based on cart items schema
          }
        }
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setToast('Failed to load pricing data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Recalculate ETA whenever services change
    if (selectedServiceIds.length > 0) {
      fetch(`${API}/api/builder/calculate-eta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceIds: selectedServiceIds })
      })
      .then(r => r.json())
      .then(d => setEtaDays(d.estimatedDays))
      .catch(console.error);
    } else {
      setEtaDays(0);
    }
  }, [selectedServiceIds]);

  const handleToggleService = (id) => {
    if (selectedServiceIds.includes(id)) {
      setSelectedServiceIds(selectedServiceIds.filter(x => x !== id));
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  // Calculations
  const selectedBundle = bundles.find(b => b._id === selectedBundleId);
  const selectedServicesList = services.filter(s => selectedServiceIds.includes(s._id));
  const selectedSheet = sheets.find(s => s._id === selectedSheetId);

  const bundleTotal = selectedBundle ? parseInt(selectedBundle.price.replace(/[^\d]/g, '') || 0, 10) : 0;
  const servicesTotal = selectedServicesList.reduce((acc, s) => acc + s.basePrice, 0);
  const sheetTotal = selectedSheet ? (selectedSheet.pricePerSheet * sheetCount) + selectedSheet.premiumCoverSurcharge : 0;
  
  const grandTotal = bundleTotal + servicesTotal + sheetTotal;

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const items = [
      ...(selectedBundle ? [{ type: 'bundle', id: selectedBundle._id, name: selectedBundle.tier, price: bundleTotal }] : []),
      ...selectedServicesList.map(s => ({ type: 'service', id: s._id, name: s.name, price: s.basePrice })),
      ...(selectedSheet ? [{ type: 'album', id: selectedSheet._id, name: `${sheetCount} Sheets of ${selectedSheet.name}`, price: sheetTotal }] : [])
    ];

    try {
      await fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ items, totalAmount: grandTotal, estimatedDeliveryEta: new Date(Date.now() + (etaDays * 86400000)).toISOString() })
      });
      setToast('Cart saved! Proceeding to checkout...');
      setTimeout(() => navigate('/orders'), 1500); // Or wherever checkout happens
    } catch (err) {
      console.error(err);
      setToast('Failed to save cart.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-20"><Loader2 className="animate-spin text-[#D4AF37]" size={40}/></div>;
  }

  return (
    <div className="pt-[100px] pb-[60px] min-h-screen bg-[#050505]">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div className="max-w-[1400px] mx-auto px-6">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-2">Build Your Perfect Package</h1>
          <p className="text-gray-400 mb-10 max-w-2xl">Start with a base bundle, add granular a-la-carte services, and design your physical albums. Your cart instantly updates.</p>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT PANEL: SELECTION UI */}
          <div className="w-full lg:w-2/3 space-y-12">
            
            {/* SECTION 1: BUNDLES */}
            <section>
              <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3"><Package className="text-[#D4AF37]"/> 1. Select a Base Bundle (Optional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bundles.map(b => (
                  <div 
                    key={b._id} 
                    onClick={() => setSelectedBundleId(selectedBundleId === b._id ? null : b._id)}
                    className={`rounded-xl border-2 transition cursor-pointer relative overflow-hidden flex flex-col ${selectedBundleId === b._id ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-[#111] border-white/10 hover:border-white/30'}`}
                  >
                    {b.coverImage && (
                      <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${b.coverImage})` }}>
                        <div className="w-full h-full bg-gradient-to-t from-[#111] to-transparent"/>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      {selectedBundleId === b._id && <div className="absolute top-4 right-4 bg-[#D4AF37] text-black p-1 rounded-full"><Check size={16}/></div>}
                      <h3 className="text-xl font-bold text-white mb-1">{b.tier}</h3>
                      <div className="text-lg text-[#D4AF37] mb-4">
                        {b.priceType === 'starting_at' && <span className="text-sm text-gray-500 block mb-1">Starting at</span>}
                        {b.price} {b.priceType === 'range' ? `- ${b.priceMax}` : ''} {b.suffix}
                      </div>
                      <ul className="space-y-2 mt-auto">
                        {b.features.map((f, i) => (
                           <li key={i} className="text-sm text-gray-400 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0"/>{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 2: A LA CARTE SERVICES */}
            <section>
              <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3"><Layers className="text-[#D4AF37]"/> 2. Add A-La-Carte Services</h2>
              
              <div className="flex overflow-x-auto pb-4 gap-2 mb-4 scrollbar-hide">
                {[
                  { name: 'Photography', icon: Camera },
                  { name: 'Videography', icon: Video },
                  { name: 'Drone', icon: Plane },
                  { name: 'Live', icon: Play },
                  { name: 'Editing', icon: Scissors }
                ].map(cat => {
                  const hasServices = services.some(s => s.category === cat.name);
                  if (!hasServices) return null;
                  return (
                    <button 
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`px-5 py-2.5 rounded-full flex items-center gap-2 whitespace-nowrap transition-all duration-300 ${activeCategory === cat.name ? 'bg-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-[#111] text-gray-400 border border-white/10 hover:border-white/30'}`}
                    >
                      <cat.icon size={16}/> {cat.name}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.filter(s => s.category === activeCategory).map(s => {
                  const isSelected = selectedServiceIds.includes(s._id);
                  return (
                    <div 
                      key={s._id} 
                      onClick={() => handleToggleService(s._id)}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer flex justify-between items-center group overflow-hidden relative ${isSelected ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]' : 'bg-[#111] border-white/10 hover:border-white/30'}`}
                    >
                      {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>}
                      <div className="relative z-10">
                        <div className="text-xs text-[#D4AF37] uppercase tracking-wider font-bold mb-1">{s.category}</div>
                        <h3 className="text-white font-medium group-hover:text-[#D4AF37] transition-colors">{s.name}</h3>
                        <div className="text-sm text-gray-400 mt-1 flex items-center gap-2"><Calendar size={12}/> +{s.estimatedDaysToDeliver} Days ETA</div>
                      </div>
                      <div className="text-right relative z-10">
                        <div className="text-lg font-bold text-white">₹{s.basePrice}</div>
                        <div className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ml-auto transition-all duration-300 ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37] text-black scale-110' : 'border-gray-500'}`}>
                          {isSelected && <Check size={14}/>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 3: ALBUM PRINT LAB */}
            <section>
              <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-3"><Tag className="text-[#D4AF37]"/> 3. Configure Physical Albums</h2>
              <div className="bg-[#111] border border-white/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Select Sheet Material</label>
                    <select 
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
                      value={selectedSheetId || ''}
                      onChange={e => setSelectedSheetId(e.target.value)}
                    >
                      <option value="">No Album Required</option>
                      {sheets.map(s => (
                        <option key={s._id} value={s._id}>{s.name} (₹{s.pricePerSheet}/sheet)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Number of Sheets (30-80)</label>
                    <input 
                      type="number" 
                      min="30" max="80"
                      disabled={!selectedSheetId}
                      value={sheetCount} 
                      onChange={e => setSheetCount(Number(e.target.value))}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37] disabled:opacity-50"
                    />
                  </div>
                </div>
                {selectedSheet && selectedSheet.premiumCoverSurcharge > 0 && (
                  <div className="text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                    Note: This premium sheet type includes a ₹{selectedSheet.premiumCoverSurcharge} mandatory cover surcharge.
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* RIGHT PANEL: STICKY CART */}
          <div className="w-full lg:w-1/3 sticky top-[100px]">
            <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <ShoppingCart className="text-[#D4AF37]"/> Your Cart
              </h2>

              <div className="space-y-4 mb-6 min-h-[150px]">
                {!selectedBundle && selectedServicesList.length === 0 && !selectedSheet && (
                  <p className="text-gray-500 text-sm italic">Your cart is empty. Select options to build your package.</p>
                )}

                {selectedBundle && (
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-400">Base Bundle</div>
                      <div className="text-white font-medium">{selectedBundle.tier}</div>
                    </div>
                    <div className="text-white font-bold">₹{bundleTotal.toLocaleString()}</div>
                  </div>
                )}

                {selectedServicesList.length > 0 && (
                  <div className="pt-2">
                    <div className="text-sm text-gray-400 mb-2">A-La-Carte Services</div>
                    {selectedServicesList.map(s => (
                      <div key={s._id} className="flex justify-between items-center mb-1">
                        <div className="text-gray-300 text-sm flex items-center gap-2"><Check size={12} className="text-blue-500"/> {s.name}</div>
                        <div className="text-gray-300 text-sm">₹{s.basePrice.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSheet && (
                  <div className="pt-2 flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-400">Print Lab Album</div>
                      <div className="text-gray-300 text-sm">{sheetCount}x {selectedSheet.name} Sheets</div>
                      {selectedSheet.premiumCoverSurcharge > 0 && <div className="text-xs text-gray-500">+ Cover Surcharge</div>}
                    </div>
                    <div className="text-gray-300 text-sm">₹{sheetTotal.toLocaleString()}</div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-gray-400">Grand Total</div>
                  <div className="text-3xl font-serif text-[#D4AF37]">₹{grandTotal.toLocaleString()}</div>
                </div>
                {etaDays > 0 && (
                  <div className="text-sm text-blue-400 flex items-center gap-2 mt-4 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                    <Calendar size={16}/> Est. Delivery Time: {etaDays} Days
                  </div>
                )}
              </div>

              <button 
                onClick={handleCheckout}
                disabled={grandTotal === 0}
                className="w-full py-4 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save & Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;
