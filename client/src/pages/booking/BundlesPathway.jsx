/**
 * BundlesPathway — extracted from BookingPage.jsx (UX-3) to keep that file navigable.
 * Curated 1-click bundles pathway (3 steps).
 * Shared state/handlers arrive via the `ctx` prop built by BookingPage.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, UploadCloud, Truck, MessageCircle, Sparkles, ArrowRight, ArrowLeft, Check, ShieldCheck, Calendar } from 'lucide-react';
import { AUSPICIOUS_MUHURTHAM_DATES } from './bookingData';

export default function BundlesPathway({ ctx }) {
  const {
    step, setStep, submitted, setSubmitted, submitting, setSubmitting,
    toast, setToast, showAuthModal, setShowAuthModal,
    serviceIntent, setServiceIntent, experienceMode, setExperienceMode,
    appliedBundle, setAppliedBundle, selectedOrientation, setSelectedOrientation,
    dynamicPricing, formData, setFormData, user, lang, navigate,
    totalSteps, wizardSteps,
    toggleServiceCategory, applyBundle, applyDynamicPackage, selectServiceIntent,
    toggleSheetType, toggleVideoService, togglePhotoService, toggleFlexService, toggleCalendarService,
    calculateTotal, renderServiceIntentSelector, proceedToNextStep, goBackStep,
    generateStructuredItems, submitOrder, openWhatsAppDirect, filteredSizes,
  } = ctx;

  return (
          <div className="space-y-6">

            {/* STEP 1 (BUNDLES): PICK CURATED BUNDLE */}
            {step === 1 && (
              <div className="space-y-6">
                {/* 5 SERVICE INTENT MODES SELECTOR */}
                {renderServiceIntentSelector()}

                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles size={20} className="text-[var(--brand)]" />
                      <span>{lang === 'TE' ? 'తక్షణ లగ్జరీ బండిల్స్ (1-క్లిక్)' : 'Curated Luxury Bundles (1-Click Suites)'}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {lang === 'TE' ? 'పూర్తి ప్యాకేజీని తక్షణమే ఎంచుకోండి. క్లిష్టమైన కాన్ఫిగరేషన్ అవసరం లేదు.' : 'Complete ready-to-go suites crafted for Andhra weddings. Pick your suite and proceed.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Bundle 1 */}
                  <div
                    onClick={() => setAppliedBundle('royal_telugu')}
                    className={`luxury-bundle-card ${appliedBundle === 'royal_telugu' ? 'active' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="bundle-badge">⭐ Best Value Master Suite</span>
                      <span className="bundle-savings">Save ₹8,500 with Bundle!</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Royal Telugu Muhurtham Master Suite</h4>
                    <div className="text-xs text-gray-400 font-telugu mb-3">రాయల్ తెలుగు ముహూర్తం మాస్టర్ సూట్</div>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-[var(--brand)]">₹17,999</span>
                      <span className="text-sm text-gray-500 line-through">₹26,499</span>
                    </div>

                    <ul className="text-xs text-gray-300 space-y-2 mb-6">
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> 12×36 Royal Panoramic Karizma Layflat (40 sheets, Velvet Touch)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> 4K Cinematic Wedding Teaser (3-5 min) + 5 IG Reels</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> High-End Skin Retouching & Color Grading (50 photos)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> Royal Velvet Briefcase Presentation Box</li>
                    </ul>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); applyBundle('royal_telugu', true); }}
                        className="w-full py-3 rounded-xl bg-[var(--brand)] hover:bg-[#b8952b] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                      >
                        <span>Select Bundle & Continue</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); applyBundle('royal_telugu', false); }}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs transition"
                      >
                        Customize Options in Builder ✏️
                      </button>
                    </div>
                  </div>

                  {/* Bundle 2 */}
                  <div
                    onClick={() => setAppliedBundle('cinematic_duo')}
                    className={`luxury-bundle-card ${appliedBundle === 'cinematic_duo' ? 'active' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="bundle-badge">🎬 Most Popular Duo</span>
                      <span className="bundle-savings">Save ₹6,200 with Bundle!</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Cinematic Story & Karizma Duo</h4>
                    <div className="text-xs text-gray-400 font-telugu mb-3">సినిమాటిక్ స్టోరీ & కరిజ్మా డ్యుయో</div>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-[var(--brand)]">₹13,200</span>
                      <span className="text-sm text-gray-500 line-through">₹19,400</span>
                    </div>

                    <ul className="text-xs text-gray-300 space-y-2 mb-6">
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> 12×30 Classic Landscape Lay-Flat Album (30 sheets, Metallic Pearl)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> 4K Cinematic Wedding Teaser + 5 Instagram Reels (9:16)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> Pro Retouching & Warm Andhra Color Grading (30 photos)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> Standard Presentation Box Included</li>
                    </ul>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); applyBundle('cinematic_duo', true); }}
                        className="w-full py-3 rounded-xl bg-[var(--brand)] hover:bg-[#b8952b] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                      >
                        <span>Select Bundle & Continue</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); applyBundle('cinematic_duo', false); }}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs transition"
                      >
                        Customize Options in Builder ✏️
                      </button>
                    </div>
                  </div>

                  {/* Bundle 3 */}
                  <div
                    onClick={() => setAppliedBundle('lab_express')}
                    className={`luxury-bundle-card ${appliedBundle === 'lab_express' ? 'active' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="bundle-badge">🚀 Express Archival Lab Printing Suite</span>
                      <span className="bundle-savings">Save ₹4,200 with Bundle!</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">Express Archival Lab Printing Suite</h4>
                    <div className="text-xs text-gray-400 font-telugu mb-3">ఎక్స్‌ప్రెస్ ల్యాబ్ ప్రింటింగ్ సూట్</div>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-[var(--brand)]">₹8,200</span>
                      <span className="text-sm text-gray-500 line-through">₹12,400</span>
                    </div>

                    <ul className="text-xs text-gray-300 space-y-2 mb-6">
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> 12×36 Lay-flat Karizma Flush Mount (30 sheets, Metallic Pearl)</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> Royal Velvet Briefcase Presentation Box</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> Doorstep Courier Delivery within 3-4 working days</li>
                      <li className="flex items-start gap-2"><Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" /> Waterproof & Tear-Resistant Coating</li>
                    </ul>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); applyBundle('lab_express', true); }}
                        className="w-full py-3 rounded-xl bg-[var(--brand)] hover:bg-[#b8952b] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                      >
                        <span>Select Bundle & Continue</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); applyBundle('lab_express', false); }}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs transition"
                      >
                        Customize Options in Builder ✏️
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Packages Configured by SysAdmin */}
                  {dynamicPricing.packages && dynamicPricing.packages
                    .filter(pkg => pkg.isActive !== false && (!pkg.b2bOrB2c || pkg.b2bOrB2c === 'b2c'))
                    .map(pkg => {
                      const isSelected = appliedBundle === (pkg.id || pkg._id || pkg.tier);
                      return (
                        <div
                          key={pkg.id || pkg._id}
                          onClick={() => applyDynamicPackage(pkg, false)}
                          className={`luxury-bundle-card ${isSelected ? 'active' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="bundle-badge" style={{ borderColor: pkg.color || 'var(--brand)', color: pkg.color || 'var(--brand)' }}>
                              {pkg.popular ? '⭐ Most Popular Suite' : (pkg.category ? pkg.category.toUpperCase() : 'CURATED SUITE')}
                            </span>
                            {pkg.priceType === 'starting_at' && <span className="bundle-savings">Starting Rate</span>}
                          </div>
                          <h4 className="text-lg font-bold text-white">{pkg.tier}</h4>
                          <div className="text-xs text-gray-400 font-telugu mb-3">కస్టమ్ క్యూరేటెడ్ సూట్</div>

                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-2xl font-black text-[var(--brand)]">{pkg.price}</span>
                            {pkg.priceMax && <span className="text-sm text-gray-400 font-medium">to {pkg.priceMax}</span>}
                            {pkg.suffix && <span className="text-xs text-gray-500">{pkg.suffix}</span>}
                          </div>

                          {pkg.features && Array.isArray(pkg.features) && (
                            <ul className="text-xs text-gray-300 space-y-2 mb-6">
                              {pkg.features.map((f, fi) => (
                                <li key={fi} className="flex items-start gap-2">
                                  <Check size={14} className="text-[var(--brand)] mt-0.5 shrink-0" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); applyDynamicPackage(pkg, true); }}
                              className="w-full py-3 rounded-xl bg-[var(--brand)] hover:bg-[#b8952b] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                            >
                              <span>Select Suite & Continue</span>
                              <ArrowRight size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); applyDynamicPackage(pkg, false); }}
                              className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium text-xs transition"
                            >
                              Customize Options in Builder ✏️
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs text-gray-400">Prefer selecting individual services a-la-carte?</span>
                  <button
                    type="button"
                    onClick={() => { setExperienceMode('custom'); setStep(1); }}
                    className="text-xs text-[var(--brand)] font-bold hover:underline"
                  >
                    Open Custom Multi-Service Builder →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 (BUNDLES): EVENT & DELIVERY DETAILS */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    2. {lang === 'TE' ? 'మీ ఈవెంట్ & డెలివరీ వివరాలు' : 'Your Event & Delivery Details'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    {lang === 'TE'
                      ? 'మీ వాట్సాప్ నెంబర్‌కు ఆర్డర్ అప్‌డేట్స్ మరియు ప్రూఫ్ లింక్ వస్తుంది.'
                      : 'We will send preview proofs and tracking updates directly to your WhatsApp.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 font-semibold mb-2">
                        {lang === 'TE' ? 'మీ పూర్తి పేరు *' : 'Your Full Name *'}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Varma"
                        className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[var(--brand)] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 font-semibold mb-2">
                        {lang === 'TE' ? 'వాట్సాప్ మొబైల్ నెంబర్ *' : 'WhatsApp Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[var(--brand)] outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 font-semibold mb-2">
                      {lang === 'TE' ? 'ఈవెంట్ రకం' : 'Event Type'}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { id: 'Wedding', telugu: 'పెళ్ళి' },
                        { id: 'Engagement', telugu: 'నిశ్చితార్థం' },
                        { id: 'Reception', telugu: 'రిసెప్షన్' },
                        { id: 'Half-Saree / Dhoti', telugu: 'లంగా వోణి' },
                        { id: 'Birthday / Other', telugu: 'పుట్టినరోజు' },
                      ].map(evt => (
                        <button
                          key={evt.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, eventType: evt.id })}
                          className={`bubble-pill ${formData.eventType === evt.id ? 'active' : ''}`}
                        >
                          {evt.id} <span className="font-telugu text-xs opacity-75">({evt.telugu})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* EVENT DATE & SUBHA MUHURTHAM SELECTOR */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black/40 to-yellow-500/10 border border-[var(--brand)]/30 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-[var(--brand)]" />
                        <label className="text-sm text-white font-bold">
                          {lang === 'TE' ? 'ఈవెంట్ / ముహూర్తం తేదీ *' : 'Event / Wedding Muhurtham Date *'}
                        </label>
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-bold flex items-center gap-1 animate-pulse">
                        🔥 {lang === 'TE' ? 'ముహూర్తాలు వేగంగా పూర్తవుతున్నాయి!' : 'Muhurtham Slots Filling Up Fast!'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400">
                      {lang === 'TE'
                        ? 'క్రింది ప్రముఖ శుభ ముహూర్తాల నుండి ఎంచుకోండి లేదా మీ వివాహ తేదీని నేరుగా సెలెక్ట్ చేయండి.'
                        : 'Select from peak Andhra/Telangana Subha Muhurtham dates below, or pick your wedding date.'}
                    </p>

                    {/* Quick Auspicious Date Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                      {AUSPICIOUS_MUHURTHAM_DATES.map(m => {
                        const isSelected = formData.eventDate === m.date;
                        return (
                          <button
                            key={m.date}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, eventDate: m.date }))}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'border-[var(--brand)] bg-[var(--brand)]/25 text-white shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                                : 'border-white/10 bg-black/40 text-gray-300 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">{m.label}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-semibold">{m.tag}</span>
                            </div>
                            <div className="text-[10px] text-[var(--brand)] font-telugu mt-0.5 truncate">{m.telugu}</div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Date Input */}
                    <div className="pt-2 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-[11px] text-gray-400 mb-1">
                          {lang === 'TE' ? 'లేదా ఇతర తేదీని ఎంచుకోండి:' : 'Or pick your custom event date:'}
                        </label>
                        <input
                          type="date"
                          value={formData.eventDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                          className="w-full p-2.5 rounded-xl bg-black/70 border border-white/20 text-white focus:border-[var(--brand)] outline-none text-xs"
                          required
                        />
                      </div>
                      {formData.eventDate && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shrink-0 self-end">
                          <CheckCircle2 size={15} />
                          <span>Selected: {new Date(formData.eventDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 font-semibold mb-2">
                        {lang === 'TE' ? 'నగరం / పట్టణం' : 'City / District'}
                      </label>
                      <select
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[var(--brand)] outline-none"
                      >
                        <option value="Vijayawada">Vijayawada (విజయవాడ)</option>
                        <option value="Guntur">Guntur (గుంటూరు)</option>
                        <option value="Visakhapatnam">Visakhapatnam (విశాఖపట్నం)</option>
                        <option value="Hyderabad">Hyderabad (హైదరాబాద్)</option>
                        <option value="Tirupati">Tirupati (తిరుపతి)</option>
                        <option value="Rajahmundry">Rajahmundry (రాజమండ్రి)</option>
                        <option value="Kakinada">Kakinada (కాకినాడ)</option>
                        <option value="Nellore">Nellore (నెల్లూరు)</option>
                        <option value="Kurnool">Kurnool (కర్నూలు)</option>
                        <option value="Other">Other City (ఇతర నగరం)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 font-semibold mb-2">
                        {lang === 'TE' ? 'డెలివరీ వేగం' : 'Delivery Speed'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, deliverySpeed: 'standard' })}
                          className={`p-3 rounded-xl text-xs font-semibold border text-left ${
                            formData.deliverySpeed === 'standard'
                              ? 'border-[var(--brand)] bg-[var(--brand)]/20 text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                              : 'border-white/10 bg-white/5 text-gray-400'
                          }`}
                        >
                          <div className="font-bold text-white">⚡ Standard (3-5 Days)</div>
                          <div className="text-emerald-400 mt-0.5">Free Delivery</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, deliverySpeed: 'express' })}
                          className={`p-3 rounded-xl text-xs font-semibold border text-left ${
                            formData.deliverySpeed === 'express'
                              ? 'border-[var(--brand)] bg-[var(--brand)]/20 text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                              : 'border-white/10 bg-white/5 text-gray-400'
                          }`}
                        >
                          <div className="font-bold text-white">🚀 Express (24-48 Hrs)</div>
                          <div className="text-[var(--brand)] mt-0.5 font-bold">
                            +₹1,500 Rush
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 font-semibold mb-2">
                      {lang === 'TE' ? 'కొరియర్ డెలివరీ అడ్రస్' : 'Shipping Address (For physical album delivery)'}
                    </label>
                    <textarea
                      rows="2"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Door No, Street, Landmark, Town, PIN Code..."
                      className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[var(--brand)] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={goBackStep}
                    className="btn btn-outline flex items-center gap-2 px-6 py-3"
                  >
                    <ArrowLeft size={16} />
                    <span>{lang === 'TE' ? 'వెనుకకు' : 'Back'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={proceedToNextStep}
                    className="btn btn-gold-3d flex items-center gap-2 px-8 py-3.5 font-bold"
                  >
                    <span>{lang === 'TE' ? 'తదుపరి దశ: ఫోటోలు పంపండి' : 'Next: Media Transfer'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 (BUNDLES): MEDIA TRANSFER & CONFIRM */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    3. {lang === 'TE' ? 'మీ ఫోటోలు / వీడియోలు ఎలా పంపుతారు?' : 'How will you share your photos/videos?'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    {lang === 'TE'
                      ? 'మీకు నచ్చిన సులభమైన పద్ధతిని ఎంచుకోండి:'
                      : 'Choose the most convenient transfer method for you:'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, uploadMethod: 'cloud' })}
                    className={`p-5 rounded-2xl border cursor-pointer text-left transition-all ${
                      formData.uploadMethod === 'cloud'
                        ? 'border-[var(--brand)] bg-[var(--brand)]/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                        : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/25'
                    }`}
                  >
                    <UploadCloud size={26} className="text-[var(--brand)] mb-2" />
                    <h4 className="font-bold text-white text-sm">Google Drive / Link</h4>
                    <p className="text-xs text-gray-400 mt-1">Paste Drive, WeTransfer, or OneDrive link</p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, uploadMethod: 'whatsapp' })}
                    className={`p-5 rounded-2xl border cursor-pointer text-left transition-all ${
                      formData.uploadMethod === 'whatsapp'
                        ? 'border-[#25D366] bg-[#25D366]/20 text-white shadow-[0_0_20px_rgba(37,211,102,0.2)]'
                        : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/25'
                    }`}
                  >
                    <MessageCircle size={26} className="text-[#25D366] mb-2" />
                    <h4 className="font-bold text-white text-sm">Send via WhatsApp</h4>
                    <p className="text-xs text-gray-400 mt-1">Our coordinator will message you</p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, uploadMethod: 'courier' })}
                    className={`p-5 rounded-2xl border cursor-pointer text-left transition-all ${
                      formData.uploadMethod === 'courier'
                        ? 'border-[var(--brand)] bg-[var(--brand)]/20 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                        : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/25'
                    }`}
                  >
                    <Truck size={26} className="text-[var(--brand)] mb-2" />
                    <h4 className="font-bold text-white text-sm">Courier Pen Drive</h4>
                    <p className="text-xs text-gray-400 mt-1">Ship USB/Hard disk to AP hub</p>
                  </div>
                </div>

                {formData.uploadMethod === 'cloud' && (
                  <div className="p-6 rounded-2xl bg-black/60 border border-white/20">
                    <label className="block text-sm text-gray-200 font-semibold mb-2">
                      Paste your Google Drive or WeTransfer Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={formData.cloudLink}
                      onChange={e => setFormData({ ...formData, cloudLink: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-black/70 border border-white/20 text-white focus:border-[var(--brand)] outline-none font-mono text-sm"
                    />
                    <p className="text-xs text-[var(--brand)] mt-2 flex items-center gap-1.5 font-medium">
                      <ShieldCheck size={14} /> Please set link access to "Anyone with the link can view".
                    </p>
                  </div>
                )}

                {formData.uploadMethod === 'whatsapp' && (
                  <div className="p-6 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-left">
                    <h4 className="font-bold text-[#25D366] text-sm mb-1 flex items-center gap-2">
                      <MessageCircle size={18} />
                      {lang === 'TE' ? 'వాట్సాప్ ద్వారా సులభంగా పంపండి' : 'Super Easy: Direct WhatsApp Concierge'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-300">
                      {lang === 'TE'
                        ? `మీరు ఇక్కడ ఆర్డర్ సబ్మిట్ చేసిన వెంటనే, మా టీమ్ ${formData.phone || 'మీ నంబరు'} కి వాట్సాప్‌లో మెసేజ్ చేసి ఫోటోలు సేకరిస్తుంది.`
                        : `No technical hassle. Once you place the order, our coordinator will message ${formData.phone || 'your WhatsApp'} to collect the high-res photos.`}
                    </p>
                  </div>
                )}

                {formData.uploadMethod === 'courier' && (
                  <div className="p-6 rounded-2xl bg-black/60 border border-white/20 text-left text-xs sm:text-sm text-gray-300 space-y-3">
                    <p className="font-bold text-white">Send your Pen Drive / Hard Disk to:</p>
                    <div className="p-4 rounded-xl bg-black/80 border border-[var(--brand)]/30 text-gray-200 leading-relaxed">
                      <strong className="text-[var(--brand)] text-base">WeddingAlbums.in Production Center</strong><br />
                      Plot 14, 2nd Floor, MG Road, Vijayawada, Andhra Pradesh 520010<br />
                      Contact: +91 98765 43210 (Attn: Media Inward Team)
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-300 font-semibold mb-2">
                    {lang === 'TE' ? 'ప్రత్యేక సూచనలు (ఐచ్ఛికం)' : 'Special Instructions / Notes (Optional)'}
                  </label>
                  <textarea
                    rows="2"
                    value={formData.instructions}
                    onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="e.g. Include Talambralu ritual focus, use devotional Telugu songs, highlight family..."
                    className="w-full p-3.5 rounded-xl bg-black/60 border border-white/20 text-white focus:border-[var(--brand)] outline-none"
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={goBackStep}
                    className="btn btn-outline flex items-center gap-2 px-6 py-3"
                  >
                    <ArrowLeft size={16} />
                    <span>{lang === 'TE' ? 'వెనుకకు' : 'Back'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => submitOrder()}
                    disabled={submitting}
                    className="btn btn-gold-3d flex items-center gap-2 px-10 py-4 text-base font-bold shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50"
                  >
                    <CheckCircle2 size={20} />
                    <span>{submitting ? 'Placing Order...' : (lang === 'TE' ? 'ఆర్డర్ కన్ఫర్మ్ చేయండి' : 'Confirm & Place Order')}</span>
                  </button>
                </div>

                <p className="text-[11px] text-white/45 text-center pt-2">
                  By placing this order you agree to our{' '}
                  <Link to="/terms" className="text-[var(--brand)] hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-[var(--brand)] hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>.
                </p>
              </div>
            )}
          </div>
  );
}
