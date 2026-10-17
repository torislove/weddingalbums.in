/**
 * CustomPathway — extracted from BookingPage.jsx (UX-3) to keep that file navigable.
 * A-la-carte multi-service builder pathway (4 steps).
 * Shared state/handlers arrive via the `ctx` prop built by BookingPage.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, UploadCloud, Truck, MonitorPlay, Film, Palette, MessageCircle, Sparkles, ArrowRight, ArrowLeft, Check, BookOpen, Layers, Calendar, CheckSquare } from 'lucide-react';
import { AUSPICIOUS_MUHURTHAM_DATES, DEFAULT_SHEETS, DEFAULT_BASE_SUBSTRATES, VIDEO_SERVICES, PHOTO_SERVICES, FLEX_SERVICES, CALENDAR_SERVICES, SERVICE_CATEGORIES } from './bookingData';

export default function CustomPathway({ ctx }) {
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

            {/* STEP 1 (CUSTOM): CHOOSE SERVICES (ZERO SCROLLBARS - RESPONSIVE TILES) */}
            {step === 1 && (
              <div className="space-y-6">
                {/* 5 SERVICE INTENT MODES SELECTOR */}
                {renderServiceIntentSelector()}

                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <CheckSquare size={20} className="text-[var(--brand)]" />
                      <span>{lang === 'TE' ? 'కావాల్సిన సర్వీసులను ఎంచుకోండి' : 'Choose Your Services (Pick 1 or More)'}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Click tiles to toggle services. Customize their detailed specs in the next step.
                    </p>
                  </div>
                  <span className="text-xs text-[var(--brand)] font-semibold bg-[var(--brand)]/15 px-3 py-1 rounded-full border border-[var(--brand)]/30">
                    {Object.values(formData.services).filter(Boolean).length} Services Selected
                  </span>
                </div>

                {/* 5 SERVICE TILES (RESPONSIVE GRID) */}
                <div className="service-tiles-grid">
                  {SERVICE_CATEGORIES.map(cat => {
                    const isChecked = Boolean(formData.services[cat.key]);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleServiceCategory(cat.key)}
                        className={`service-tile-card ${isChecked ? 'checked' : ''}`}
                      >
                        <div className="service-tile-top">
                          <div className="service-tile-icon-box">
                            <cat.icon size={22} />
                          </div>
                          <div className="service-tile-check-circle">
                            {isChecked && <Check size={14} className="text-black stroke-[3]" />}
                          </div>
                        </div>
                        <div>
                          <div className="service-tile-title">{cat.name}</div>
                          <div className="service-tile-telugu font-telugu">{cat.telugu}</div>
                          <div className="service-tile-price">{cat.priceTag}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Next Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={proceedToNextStep}
                    className="btn btn-gold-3d flex items-center gap-2 px-8 py-3.5 text-base font-bold shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                  >
                    <span>{lang === 'TE' ? 'తదుపరి దశ: కాన్ఫిగరేషన్' : 'Next: Customize Selected Services'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 (CUSTOM): CUSTOMIZE SELECTED SERVICES (ONLY ACTIVE SERVICES SHOWN!) */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    2. {lang === 'TE' ? 'ఎంచుకున్న సేవల కాన్ఫిగరేషన్' : 'Customize Selected Services'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Only the services you picked in Step 1 are shown below. Configure sizes, sheets, cuts, and quantities.
                  </p>

                  {/* Contextual Mode Explanation Banner */}
                  {serviceIntent === 'only_editing' && (
                    <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 mb-4 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-purple-500/20 text-purple-300"><Palette size={20} /></span>
                        <div>
                          <h4 className="font-bold text-sm text-white">🎨 Only Editing Mode Active (Digital Master Delivery)</h4>
                          <p className="text-xs text-gray-300">Physical album printing is excluded (₹0 printing charge). Choose your photo retouching styles and video cuts below. We deliver 300 DPI high-resolution files via Cloud.</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/30">
                        Zero Print Cost
                      </span>
                    </div>
                  )}

                  {serviceIntent === 'only_printing' && (
                    <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 mb-4 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-blue-500/20 text-blue-300"><BookOpen size={20} /></span>
                        <div>
                          <h4 className="font-bold text-sm text-white">🖨️ Only Printing & Binding Active</h4>
                          <p className="text-xs text-gray-300">Photo editing is excluded (₹0 design fee). Upload your pre-designed 12×36 / 12×30 spreads. Configure your base substrate, surface finish, and presentation box below.</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/30">
                        Direct Lab Press
                      </span>
                    </div>
                  )}

                  {serviceIntent === 'edit_and_print' && (
                    <div className="p-4 rounded-xl bg-[var(--brand)]/10 border border-[var(--brand)]/30 mb-4 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-[var(--brand)]/20 text-[var(--brand)]"><Sparkles size={20} /></span>
                        <div>
                          <h4 className="font-bold text-sm text-white">✨ Complete Master Suite Active (Editing + Printing)</h4>
                          <p className="text-xs text-gray-300">Full end-to-end craftsmanship: photo culling, Telugu skin retouching, custom Karizma design, 3D flipbook proof approval on WhatsApp, and archival lab printing.</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[var(--brand)] bg-[var(--brand)]/20 px-2.5 py-1 rounded-full border border-[var(--brand)]/30">
                        End-to-End Suite
                      </span>
                    </div>
                  )}

                  {serviceIntent === 'standalone_services' && (
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 mb-4 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300"><Film size={20} /></span>
                        <div>
                          <h4 className="font-bold text-sm text-white">🎬 Standalone Services Active (A-la-carte)</h4>
                          <p className="text-xs text-gray-300">Individual creative media items selected. Configure video styles, invitations, or welcome flex standees below.</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        A-la-Carte
                      </span>
                    </div>
                  )}
                </div>

                {/* Empty State Guard if user deselected all services */}
                {!Object.values(formData.services).some(Boolean) && (
                  <div className="p-8 sm:p-10 rounded-3xl bg-black/70 border border-[var(--brand)]/30 text-center my-6 space-y-4 shadow-[0_0_35px_rgba(212,175,55,0.15)]">
                    <div className="w-16 h-16 rounded-full bg-[var(--brand)]/15 border-2 border-[var(--brand)] flex items-center justify-center mx-auto text-[var(--brand)]">
                      <Layers size={32} />
                    </div>
                    <h4 className="text-2xl font-bold text-white font-serif">
                      {lang === 'TE' ? 'ప్రస్తుతం ఏ సర్వీసు ఎంపిక చేయలేదు' : 'No Services Selected Yet'}
                    </h4>
                    <p className="text-sm text-gray-400 max-w-lg mx-auto">
                      {lang === 'TE'
                        ? 'దయచేసి కింద ఇవ్వబడిన బటన్లతో సర్వీసులను ఎంచుకోండి లేదా తక్షణ బండిల్స్ మోడ్‌కి మారండి.'
                        : 'Select one or more services below to configure, or switch to 1-Click Fast Bundles.'}
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap pt-2">
                      <button
                        type="button"
                        onClick={() => toggleServiceCategory('albumPrint')}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition"
                      >
                        <BookOpen size={16} className="text-[var(--brand)]" />
                        + Add Album Printing
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleServiceCategory('videoEdit')}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition"
                      >
                        <Film size={16} className="text-[var(--brand)]" />
                        + Add Video Editing
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleServiceCategory('photoEdit')}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition"
                      >
                        <Palette size={16} className="text-[var(--brand)]" />
                        + Add Photo Retouching
                      </button>
                      <button
                        type="button"
                        onClick={() => { setExperienceMode('bundles'); setStep(1); }}
                        className="px-5 py-2.5 rounded-xl bg-[var(--brand)] hover:bg-[#b8952b] text-black font-bold text-xs flex items-center gap-2 shadow-lg transition"
                      >
                        <Sparkles size={16} />
                        Switch to 1-Click Fast Bundles
                      </button>
                    </div>
                  </div>
                )}

                {/* 1. ALBUM CONFIGURATOR */}
                {formData.services.albumPrint && (
                  <div className="dynamic-config-section">
                    <div className="dynamic-config-header">
                      <div>
                        <h4 className="text-lg font-bold text-[var(--brand)] flex items-center gap-2">
                          <BookOpen size={20} />
                          <span>{lang === 'TE' ? 'ఆల్బమ్ సైజులు, కవర్లు & షీట్లు' : 'Album Cover, Sizes & Paper Sheets'}</span>
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Configure layout dimensions, cover binding, and transparent per-sheet finishes.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleServiceCategory('albumPrint')}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20"
                      >
                        Remove Album
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Cover Style */}
                      <div>
                        <label className="block text-xs text-gray-200 font-bold mb-2 uppercase tracking-wider">
                          1. Cover & Binding Style
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            { id: 'karizma', label: 'Karizma Royal Spread', note: "India's #1 Choice", surcharge: 'Standard' },
                            { id: 'acrylic', label: 'Crystal Acrylic Glass 3D', note: 'Ultra-modern high-gloss face', surcharge: '+₹1,500' },
                            { id: 'velvet', label: 'Royal Velvet Touch', note: 'Soft luxury fabric feel', surcharge: '+₹1,000' },
                            { id: 'leather', label: 'Embossed Leatherette', note: 'Timeless gold foil heirloom', surcharge: '+₹1,200' },
                            { id: 'flushmount', label: 'Seamless Flush Mount', note: 'Edge-to-edge panoramic view', surcharge: 'Included' },
                          ].map(opt => (
                            <div
                              key={opt.id}
                              onClick={() => setFormData(p => ({ ...p, albumType: opt.id }))}
                              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                formData.albumType === opt.id
                                  ? 'border-[var(--brand)] bg-[var(--brand)]/20 text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                  : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-xs text-white">{opt.label}</span>
                                <span className="text-[11px] text-[var(--brand)] font-mono font-bold">{opt.surcharge}</span>
                              </div>
                              <div className="text-[11px] text-gray-400 mt-1">{opt.note}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dimensions & Orientation Filter */}
                      <div>
                        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                          <label className="text-xs text-gray-200 font-bold uppercase tracking-wider">
                            2. Dimensions (Landscape ↔️ & Portrait ↕️)
                          </label>
                          <div className="orientation-filter-bar mb-0">
                            <button
                              type="button"
                              onClick={() => setSelectedOrientation('all')}
                              className={`orientation-pill ${selectedOrientation === 'all' ? 'active' : ''}`}
                            >
                              All
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedOrientation('landscape')}
                              className={`orientation-pill ${selectedOrientation === 'landscape' ? 'active' : ''}`}
                            >
                              ↔️ Landscape
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedOrientation('portrait')}
                              className={`orientation-pill ${selectedOrientation === 'portrait' ? 'active' : ''}`}
                            >
                              ↕️ Portrait
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {filteredSizes.map(sz => {
                            const szBase = Number(sz.basePrice || sz.clientBasePrice || 9500);
                            const isSelected = formData.albumSize === sz.id || formData.albumSize === sz._id || formData.albumSize === sz.dimensions || (formData.albumSize && sz.dimensions && formData.albumSize.includes(sz.dimensions)) || (formData.albumSize && sz.id && formData.albumSize.includes(sz.id));

                            return (
                              <div
                                key={sz.id || sz._id}
                                onClick={() => setFormData(p => ({ ...p, albumSize: sz.id || sz._id }))}
                                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-[var(--brand)] bg-[var(--brand)]/20 text-white shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-1 gap-2">
                                  <div>
                                    <span className="font-bold text-xs text-white block">{sz.name}</span>
                                    {sz.popular && (
                                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-[var(--brand)]/25 text-[var(--brand)] px-2 py-0.5 rounded-full font-bold border border-[var(--brand)]/40">
                                        ⭐ Most Popular
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-white/10 text-gray-300 shrink-0">
                                    {sz.orientation === 'portrait' ? '↕️ Port' : '↔️ Land'}
                                  </span>
                                </div>
                                {sz.telugu && <div className="text-[11px] text-[var(--brand)] font-telugu">{sz.telugu}</div>}
                                <div className="flex justify-between items-baseline mt-2 pt-1 border-t border-white/5">
                                  <span className="text-xs text-[var(--brand)] font-mono font-bold">
                                    ₹{szBase.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* DIMENSION 1: BASE SUBSTRATES & CORE MEDIA */}
                      <div>
                        <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                          <label className="text-xs text-gray-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Layers size={13} className="text-[var(--brand)]" />
                            3. Dimension 1: Base Substrates & Core Media
                          </label>
                          <span className="text-xs text-[var(--brand)] font-semibold">
                            {formData.baseSubstrate === 'ntr_bopp' ? '100% Waterproof BOPP Core' : 'Specialty Lab Core'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mb-2.5">
                          The physical core layer determines sheet stiffness, tear resistance, and archival lifespan.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                          {DEFAULT_BASE_SUBSTRATES.map(sub => {
                            const isSelected = formData.baseSubstrate === sub.id;
                            return (
                              <div
                                key={sub.id}
                                onClick={() => setFormData(p => ({ ...p, baseSubstrate: sub.id }))}
                                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-[var(--brand)] bg-[var(--brand)]/20 text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                    : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-bold text-xs text-white leading-snug">{sub.name}</span>
                                </div>
                                <div className="text-[10px] text-[var(--brand)] font-telugu">{sub.telugu}</div>
                                <div className="text-xs font-mono font-bold text-emerald-400 mt-1">{sub.priceLabel}</div>
                                <div className="text-[10px] text-gray-400 mt-1 leading-snug">{sub.note}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* DIMENSION 2: SURFACE FINISHES & COATINGS */}
                      <div>
                        <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                          <label className="text-xs text-gray-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={13} className="text-[var(--brand)]" />
                            4. Dimension 2: Surface Finishes & Lamination
                          </label>
                          <span className="text-xs text-emerald-400 font-semibold">
                            {formData.selectedSheetTypes.length} Surface Finish(es) Active
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mb-2.5">
                          Standard finishes (Matte & Gloss) are included at normal price; luxury finishes carry itemized per-sheet surcharges.
                        </p>

                        {/* Standard Finishes (Included in Base Price) */}
                        <div className="mb-3">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">
                            ⭐ Standard Finishes (Included in Base Price - ₹0 Extra)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {DEFAULT_SHEETS.filter(s => s.tier === 'standard').map(sht => {
                              const isSelected = formData.selectedSheetTypes.includes(sht.id);
                              return (
                                <div
                                  key={sht.id}
                                  onClick={() => toggleSheetType(sht.id)}
                                  className={`service-check-card ${isSelected ? 'checked' : ''}`}
                                >
                                  <div className="service-checkbox-circle">
                                    {isSelected && <Check size={14} />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between gap-1">
                                      <h5 className="font-bold text-xs text-white">{sht.name}</h5>
                                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                                        Included (₹0)
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-[var(--brand)] font-telugu mt-0.5">{sht.telugu}</div>
                                    <div className="text-[10px] text-gray-400 mt-1 leading-snug">{sht.note}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Luxury Surface Upgrades (Itemized Surcharge) */}
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand)] block mb-1.5">
                            ✨ Luxury Surface Upgrades (Itemized Per-Sheet Surcharges)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {DEFAULT_SHEETS.filter(s => s.tier === 'luxury').map(sht => {
                              const isSelected = formData.selectedSheetTypes.includes(sht.id);
                              return (
                                <div
                                  key={sht.id}
                                  onClick={() => toggleSheetType(sht.id)}
                                  className={`service-check-card ${isSelected ? 'checked' : ''}`}
                                >
                                  <div className="service-checkbox-circle">
                                    {isSelected && <Check size={14} />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between gap-1">
                                      <h5 className="font-bold text-xs text-white">{sht.name}</h5>
                                      <span className="text-[10px] bg-[var(--brand)]/20 text-[var(--brand)] px-2 py-0.5 rounded-full font-mono font-bold border border-[var(--brand)]/30">
                                        +₹{sht.surchargePerSheet}/sheet
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-[var(--brand)] font-telugu mt-0.5">{sht.telugu}</div>
                                    <div className="text-[10px] text-gray-400 mt-1 leading-snug">{sht.note}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Total Sheets (1 Sheet = 2 Pages) */}
                      <div>
                        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                          <label className="text-xs text-gray-200 font-bold uppercase tracking-wider">
                            5. Total Sheets (1 Sheet = 2 Sides = 2 Pages)
                          </label>
                          <span className="text-[var(--brand)] font-bold text-xs bg-[var(--brand)]/15 px-2.5 py-0.5 rounded-full border border-[var(--brand)]/30">
                            {formData.pages} Sheets = {formData.pages * 2} Pages (~{formData.pages * 5}-{formData.pages * 6} photos)
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {[
                            { count: 20, label: '20 Sheets (40 Pages)' },
                            { count: 25, label: '25 Sheets (50 Pages)' },
                            { count: 30, label: '30 Sheets (60 Pages - Base Standard)' },
                            { count: 35, label: '35 Sheets (70 Pages)' },
                            { count: 40, label: '40 Sheets (80 Pages)' },
                            { count: 50, label: '50 Sheets (100 Pages)' },
                          ].map(item => (
                            <button
                              key={item.count}
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, pages: item.count }))}
                              className={`bubble-pill ${formData.pages === item.count ? 'active' : ''}`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2">
                          💡 30 sheets are included in the base album price. Additional sheets above 30 cost ₹70/sheet for the base substrate plus any selected luxury finish upgrade.
                        </p>
                      </div>

                      {/* Luxury Box & Duplicate Parent Albums */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
                        <div>
                          <label className="text-xs text-gray-200 font-bold mb-2 block uppercase tracking-wider">5. Presentation Box</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'standard', label: 'Standard Box', surcharge: 'Included' },
                              { id: 'velvet_case', label: 'Velvet Briefcase', surcharge: '+₹1,200' },
                              { id: 'wooden_box', label: 'Wooden Box', surcharge: '+₹1,800' },
                              { id: 'acrylic_box', label: 'Acrylic Box', surcharge: '+₹2,200' },
                            ].map(box => (
                              <div
                                key={box.id}
                                onClick={() => setFormData({ ...formData, boxType: box.id })}
                                className={`p-2.5 rounded-xl border text-left cursor-pointer text-xs ${
                                  formData.boxType === box.id
                                    ? 'border-[var(--brand)] bg-[var(--brand)]/20 text-white'
                                    : 'border-white/10 bg-white/5 text-gray-300'
                                }`}
                              >
                                <div className="font-semibold">{box.label}</div>
                                <div className="text-[11px] text-[var(--brand)] font-mono">{box.surcharge}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-gray-200 font-bold mb-2 block uppercase tracking-wider">6. Mini Parent Albums</label>
                          <div className="flex gap-2">
                            {[
                              { cnt: 0, label: 'None' },
                              { cnt: 1, label: '+1 Mini (+₹2,500)' },
                              { cnt: 2, label: '+2 Minis (+₹4,500)' },
                            ].map(b => (
                              <button
                                key={b.cnt}
                                type="button"
                                onClick={() => setFormData({ ...formData, parentAlbums: b.cnt })}
                                className={`bubble-pill ${formData.parentAlbums === b.cnt ? 'active' : ''}`}
                              >
                                {b.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CINEMATIC VIDEO EDITING CONFIGURATOR */}
                {formData.services.videoEdit && (
                  <div className="dynamic-config-section">
                    <div className="dynamic-config-header">
                      <div>
                        <h4 className="text-lg font-bold text-[var(--brand)] flex items-center gap-2">
                          <Film size={20} />
                          <span>{lang === 'TE' ? 'సినిమాటిక్ వీడియో ఎడిటింగ్ సేవలు' : 'Cinematic Video Editing Services'}</span>
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Multi-select video cuts. Transparent itemized rates applied.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleServiceCategory('videoEdit')}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20"
                      >
                        Remove Video
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {VIDEO_SERVICES.map(v => {
                        const isSelected = formData.selectedVideoServices.includes(v.id);
                        const vPrice = v.price;

                        return (
                          <div
                            key={v.id}
                            onClick={() => toggleVideoService(v.id)}
                            className={`service-check-card ${isSelected ? 'checked' : ''}`}
                          >
                            <div className="service-checkbox-circle">
                              {isSelected && <Check size={14} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-xs text-white">{v.name}</span>
                                <span className="text-xs text-[var(--brand)] font-mono font-bold ml-2">
                                   +₹{vPrice.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-400 mt-1">{v.note}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <label className="text-xs text-gray-200 font-bold mb-1.5 block">Music & Audio Direction</label>
                      <select
                        value={formData.musicStyle}
                        onChange={e => setFormData({ ...formData, musicStyle: e.target.value })}
                        className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white text-xs outline-none focus:border-[var(--brand)]"
                      >
                        <option value="telugu_romantic">Classical & Modern Telugu Romantic Melodies</option>
                        <option value="devotional">Traditional Nadaswaram & Mangala Vaadhyam</option>
                        <option value="energetic">High-Energy Trending Beats & Bass</option>
                        <option value="custom">I will provide our custom Telugu song playlist</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. PHOTO RETOUCHING CONFIGURATOR */}
                {formData.services.photoEdit && (
                  <div className="dynamic-config-section">
                    <div className="dynamic-config-header">
                      <div>
                        <h4 className="text-lg font-bold text-[var(--brand)] flex items-center gap-2">
                          <Palette size={20} />
                          <span>{lang === 'TE' ? 'ఫొటో రీటచింగ్ & కలర్ గ్రేడింగ్' : 'Photo Retouching & Color Grading'}</span>
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Multi-select retouching styles calculated per-photo.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleServiceCategory('photoEdit')}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20"
                      >
                        Remove Photos
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {PHOTO_SERVICES.map(p => {
                        const isSelected = formData.selectedPhotoServices.includes(p.id);
                        const pRate = p.rate;

                        return (
                          <div
                            key={p.id}
                            onClick={() => togglePhotoService(p.id)}
                            className={`service-check-card ${isSelected ? 'checked' : ''}`}
                          >
                            <div className="service-checkbox-circle">
                              {isSelected && <Check size={14} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-xs text-white">{p.name}</span>
                                <span className="text-xs text-[var(--brand)] font-mono font-bold ml-2">
                                  +₹{pRate}/p
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-400 mt-1">{p.note}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                      <div>
                        <label className="text-xs text-gray-200 font-bold block">Estimated Photos to Retouch:</label>
                        <span className="text-[11px] text-gray-400">Total photos to process</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {[30, 50, 100, 200, 300, 500].map(cnt => (
                          <button
                            key={cnt}
                            type="button"
                            onClick={() => setFormData({ ...formData, photoCount: cnt })}
                            className={`bubble-pill ${formData.photoCount === cnt ? 'active' : ''}`}
                          >
                            {cnt} Photos
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. FLEX & BANNERS CONFIGURATOR */}
                {formData.services.flexBanner && (
                  <div className="dynamic-config-section">
                    <div className="dynamic-config-header">
                      <div>
                        <h4 className="text-lg font-bold text-[var(--brand)] flex items-center gap-2">
                          <MonitorPlay size={20} />
                          <span>{lang === 'TE' ? 'ఫ్లెక్స్, బ్యానర్లు & వాట్సాప్ ఆహ్వానాలు' : 'Wedding Flex & Digital Video Invites'}</span>
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Multi-select outdoor print sizes and animated digital cards.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleServiceCategory('flexBanner')}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20"
                      >
                        Remove Flex
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {FLEX_SERVICES.map(f => {
                        const isSelected = formData.selectedFlexServices.includes(f.id);
                        const fPrice = f.price;

                        return (
                          <div
                            key={f.id}
                            onClick={() => toggleFlexService(f.id)}
                            className={`service-check-card ${isSelected ? 'checked' : ''}`}
                          >
                            <div className="service-checkbox-circle">
                              {isSelected && <Check size={14} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-xs text-white">{f.name}</span>
                                <span className="text-xs text-[var(--brand)] font-mono font-bold ml-2">
                                  +₹{fPrice.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="text-[11px] text-gray-400 mt-1">{f.note}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. CALENDARS CONFIGURATOR */}
                {formData.services.calendars && (
                  <div className="dynamic-config-section">
                    <div className="dynamic-config-header">
                      <div>
                        <h4 className="text-lg font-bold text-[var(--brand)] flex items-center gap-2">
                          <Calendar size={20} />
                          <span>{lang === 'TE' ? 'కపుల్ క్యాలెండర్లు & బహుమతి వస్తువులు' : 'Personalized Calendars & Keepsakes'}</span>
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Desk easels and wall poster calendars with couple photos.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleServiceCategory('calendars')}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20"
                      >
                        Remove Calendars
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      {CALENDAR_SERVICES.map(c => {
                        const isSelected = formData.selectedCalendarServices.includes(c.id);
                        const cPrice = c.price;

                        return (
                          <div
                            key={c.id}
                            onClick={() => toggleCalendarService(c.id)}
                            className={`service-check-card ${isSelected ? 'checked' : ''}`}
                          >
                            <div className="service-checkbox-circle">
                              {isSelected && <Check size={14} />}
                            </div>
                            <div className="flex-1">
                              <span className="font-bold text-xs text-white block">{c.name}</span>
                              <div className="text-xs text-[var(--brand)] font-mono font-bold mt-1">
                                +₹{cPrice.toLocaleString('en-IN')} / ea
                              </div>
                              <div className="text-[11px] text-gray-400 mt-1">{c.note}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                      <div>
                        <label className="text-xs text-gray-200 font-bold block">Number of Copies:</label>
                        <span className="text-[11px] text-gray-400">Total calendar copies printed</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {[1, 2, 5, 10, 25, 50].map(cnt => (
                          <button
                            key={cnt}
                            type="button"
                            onClick={() => setFormData({ ...formData, calendarCopies: cnt })}
                            className={`bubble-pill ${formData.calendarCopies === cnt ? 'active' : ''}`}
                          >
                            {cnt} {cnt === 1 ? 'Copy' : 'Copies'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State Guard */}
                {!Object.values(formData.services).some(Boolean) && (
                  <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
                    <p className="text-gray-300 font-semibold">
                      {lang === 'TE'
                        ? 'ప్రస్తుతం ఏ సేవలు ఎంపిక చేయబడలేదు. దయచేసి వెనుకకు వెళ్లి సర్వీసులను ఎంచుకోండి లేదా తక్షణ బండిల్స్‌ను ఉపయోగించండి.'
                        : 'No services are currently selected. Please choose one or more services, or switch to 1-Click Fast Bundles.'}
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn btn-gold-3d px-6 py-2.5 text-xs font-bold"
                      >
                        {lang === 'TE' ? '← సర్వీసులను ఎంచుకోండి' : '← Pick Services'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setExperienceMode('bundles'); setStep(1); }}
                        className="btn btn-outline px-6 py-2.5 text-xs font-bold"
                      >
                        {lang === 'TE' ? '⚡ తక్షణ బండిల్స్ చూడండి' : '⚡ Browse 1-Click Bundles'}
                      </button>
                    </div>
                  </div>
                )}

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
                    <span>{lang === 'TE' ? 'తదుపరి దశ: ఈవెంట్ వివరాలు' : 'Next: Event & Delivery Details'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 (CUSTOM): EVENT & DELIVERY DETAILS */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    3. {lang === 'TE' ? 'ఈవెంట్ & సంప్రదింపు వివరాలు' : 'Event & Delivery Details'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Enter contact name, WhatsApp number, and delivery city for dispatch.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 font-semibold mb-2">Your Full Name *</label>
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
                      <label className="block text-sm text-gray-300 font-semibold mb-2">WhatsApp Phone Number *</label>
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
                    <label className="block text-sm text-gray-300 font-semibold mb-2">Event Type</label>
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
                      <label className="block text-sm text-gray-300 font-semibold mb-2">City / District</label>
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
                      <label className="block text-sm text-gray-300 font-semibold mb-2">Delivery Speed</label>
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
                    <label className="block text-sm text-gray-300 font-semibold mb-2">Shipping Address</label>
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
                    <span>{lang === 'TE' ? 'తదుపరి దశ: ఫోటోలు & నిర్ధారణ' : 'Next: Media & Confirmation'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 (CUSTOM): MEDIA UPLOAD & FINAL CONFIRMATION */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    4. {lang === 'TE' ? 'మీ ఫోటోలు పంపండి & ఆర్డర్ నిర్ధారించండి' : 'Media Transfer & Order Confirmation'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Choose how you want to share files and review your itemized package.
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
                    <p className="text-xs text-gray-400 mt-1">Paste Drive, WeTransfer link</p>
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
                    <h4 className="font-bold text-white text-sm">Send on WhatsApp</h4>
                    <p className="text-xs text-gray-400 mt-1">Direct coordinator chat</p>
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
                    <p className="text-xs text-gray-400 mt-1">Ship USB to Vijayawada lab</p>
                  </div>
                </div>

                {formData.uploadMethod === 'cloud' && (
                  <div className="p-6 rounded-2xl bg-black/60 border border-white/20">
                    <label className="block text-sm text-gray-200 font-semibold mb-2">
                      Google Drive or WeTransfer Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/drive/folders/..."
                      value={formData.cloudLink}
                      onChange={e => setFormData({ ...formData, cloudLink: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-black/70 border border-white/20 text-white focus:border-[var(--brand)] outline-none font-mono text-sm"
                    />
                  </div>
                )}

                {/* Final Order Review Card */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/15 space-y-3">
                  <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <CheckSquare size={16} className="text-[var(--brand)]" />
                    <span>Package Breakdown Review</span>
                  </div>
                  <ul className="text-xs text-gray-300 space-y-1.5 pl-2">
                    {generateStructuredItems().map((it, idx) => (
                      <li key={idx} className="flex justify-between items-start py-1 border-b border-white/5">
                        <div>
                          <strong className="text-white block">{it.name}</strong>
                          <span className="text-gray-400 text-[11px]">{it.details}</span>
                        </div>
                        <span className="text-[var(--brand)] font-mono font-bold ml-2">₹{it.price.toLocaleString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-baseline pt-2 text-sm font-bold">
                    <span className="text-gray-300">Total Amount:</span>
                    <span className="text-2xl font-mono text-emerald-400">₹{calculateTotal().toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 font-semibold mb-2">
                    Special Instructions / Notes (Optional)
                  </label>
                  <textarea
                    rows="2"
                    value={formData.instructions}
                    onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="e.g. Ritual focus, song preference..."
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
                    <span>Back</span>
                  </button>

                  {/* Terms & Privacy acceptance (P7) */}
                  <div style={{ paddingBottom: 14, marginTop: 4 }}>
                    <p className="text-[11px] text-white/45 text-center">
                      By placing this order you agree to our{' '}
                      <Link to="/terms" className="text-[var(--brand)] hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-[var(--brand)] hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
                      {lang === 'TE' ? ' · విధివైరుధ్యాలను అంగీకరిస్తున్నారు' : ''}.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => submitOrder()}
                    disabled={submitting}
                    className="btn btn-gold-3d flex items-center gap-2 px-10 py-4 text-base font-bold shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-50"
                  >
                    <CheckCircle2 size={20} />
                    <span>{submitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
  );
}
