/**
 * MobileSummaryBar — extracted from BookingPage.jsx (UX-3) to keep that file navigable.
 * Floating mobile total bar.
 * Shared state/handlers arrive via the `ctx` prop built by BookingPage.
 */
import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function MobileSummaryBar({ ctx }) {
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
      <div className="mobile-summary-bar">
        <div>
          <span className="text-[11px] text-gray-400 block">
            Total Estimate
          </span>
          <span className="text-xl font-bold text-[var(--brand)] font-mono">
            ₹{calculateTotal().toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openWhatsAppDirect}
            className="p-3 rounded-xl bg-[#25D366] text-black font-bold text-xs flex items-center gap-1.5"
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => step < totalSteps ? proceedToNextStep() : submitOrder()}
            className="px-4 py-3 rounded-xl bg-[var(--brand)] text-black font-bold text-xs flex items-center gap-1.5"
          >
            <span>{step < totalSteps ? 'Next Step →' : 'Confirm Book'}</span>
          </button>
        </div>
      </div>
  );
}
