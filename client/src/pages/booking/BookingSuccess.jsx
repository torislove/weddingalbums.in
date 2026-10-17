/**
 * BookingSuccess — extracted from BookingPage.jsx (UX-3) to keep that file navigable.
 * Post-submit confirmation screen.
 * Shared state/handlers arrive via the `ctx` prop built by BookingPage.
 */
import React from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';

export default function BookingSuccess({ ctx }) {
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
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-[var(--ink)]">
        <div className="max-w-xl w-full p-8 sm:p-10 rounded-3xl bg-(--n-900) border border-[var(--brand)]/40 text-center shadow-[0_0_50px_rgba(212,175,55,0.2)]">
          <div className="w-20 h-20 rounded-full bg-[var(--brand)]/20 border-2 border-[var(--brand)] flex items-center justify-center mx-auto mb-6 text-[var(--brand)]">
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-3xl font-serif text-white font-bold mb-2">
            {lang === 'TE' ? 'ఆర్డర్ విజయవంతంగా నమోదైంది! 🎉' : 'Booking Confirmed! 🎉'}
          </h2>
          <p className="text-sm text-gray-300 mb-6">
            {lang === 'TE'
              ? 'ధన్యవాదాలు! మీ ఆర్డర్ వివరాలు మా పోస్ట్-ప్రొడక్షన్ మేనేజర్‌కు చేరాయి. మా టీమ్ త్వరలోనే మీ వాట్సాప్‌లో కనెక్ట్ అవుతారు.'
              : 'Thank you! Your project details have reached our lab team. We will connect on your WhatsApp with digital proofs and updates.'}
          </p>

          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left mb-6 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Order Reference:</span>
              <span className="text-[var(--brand)] font-mono font-bold">{formData.createdOrderId || 'ORD-VERIFIED'}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Booking Mode:</span>
              <span className="text-white font-semibold">{experienceMode === 'bundles' ? '⚡ Curated Luxury Bundle' : '🛠️ Custom Multi-Service'}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Booking Type:</span>
              <span className="text-white font-semibold">✨ Couple Royal Wedding Suite</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Total Estimated:</span>
              <span className="text-emerald-400 font-mono font-bold">₹{calculateTotal().toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Delivery Speed:</span>
              <span className="text-white capitalize">{formData.deliverySpeed === 'express' ? '🚀 Express (24-48 Hours)' : '⚡ Standard (3-5 Days)'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={openWhatsAppDirect}
              className="flex-1 py-3.5 px-4 rounded-xl bg-[#25D366] text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20ba59] transition"
            >
              <MessageCircle size={18} />
              <span>Track on WhatsApp</span>
            </button>
            <button
              onClick={() => navigate('/client')}
              className="flex-1 py-3.5 px-4 rounded-xl bg-[var(--brand)] text-black font-bold text-sm hover:bg-[#b8952b] transition"
            >
              Go to Client Dashboard →
            </button>
          </div>
        </div>
      </div>
  );
}
