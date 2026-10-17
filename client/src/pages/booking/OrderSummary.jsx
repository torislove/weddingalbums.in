/**
 * OrderSummary — extracted from BookingPage.jsx (UX-3) to keep that file navigable.
 * Sticky itemized quote sidebar (desktop).
 * Shared state/handlers arrive via the `ctx` prop built by BookingPage.
 */
import React from 'react';
import { ShoppingCart, CheckCircle2, MessageCircle, Clock } from 'lucide-react';

export default function OrderSummary({ ctx }) {
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
      <div className="builder-sidebar">
        <div className="cart-sticky p-6 sm:p-7 rounded-2xl bg-black/70 border border-[var(--brand)]/30 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
              <ShoppingCart size={20} className="text-[var(--brand)]" />
              <span>{lang === 'TE' ? 'ఆర్డర్ రసీదు' : 'Itemized Quote'}</span>
            </div>
            <span className="text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              <Clock size={12} />
              {formData.deliverySpeed === 'express' ? '24-48h Rush' : '3-5 Days ETA'}
            </span>
          </div>

          {/* Itemized Line-By-Line Receipt Breakdown */}
          <div className="space-y-3 text-xs sm:text-sm">
            {generateStructuredItems().map((it, idx) => (
              <div key={idx} className="space-y-1 pb-2 border-b border-white/10">
                <div className="flex justify-between text-white font-semibold">
                  <span className="truncate max-w-[210px]">{it.name}</span>
                  <span className="font-mono text-[var(--brand)]">₹{it.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-gray-400 text-[11px] leading-tight">{it.details}</div>
              </div>
            ))}

            {formData.deliverySpeed === 'express' && (
              <div className="flex justify-between text-[var(--brand)] text-xs py-1 border-b border-white/10">
                <span>Express 24-48h Rush Delivery</span>
                <span className="font-mono font-bold">+₹1,500</span>
              </div>
            )}

            <div className="border-t border-white/10 pt-4 mt-2 flex justify-between items-baseline">
              <div>
                <span className="text-xs text-gray-400 block font-medium">
                  Total Itemized Quote
                </span>
                <span className="text-3xl font-bold font-mono text-[var(--brand)]">
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[11px] text-gray-400">All Taxes Inc.</span>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                type="button"
                onClick={openWhatsAppDirect}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] text-black font-bold text-sm hover:bg-[#20ba59] transition-all shadow-[0_4px_15px_rgba(37,211,102,0.3)]"
              >
                <MessageCircle size={18} />
                <span>{lang === 'TE' ? 'వాట్సాప్ లో కొటేషన్ పొందండి' : 'Get Quote on WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={() => submitOrder()}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[var(--brand)] text-black font-bold text-sm hover:bg-[#b8952b] transition-all shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
              >
                <CheckCircle2 size={18} />
                <span>{submitting ? 'Processing...' : (lang === 'TE' ? 'ఆర్డర్ కన్ఫర్మ్ చేయండి' : 'Save & Book Package')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
