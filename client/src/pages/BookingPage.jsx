import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import Toast from '../components/Toast';
import { Calendar as CalendarIcon, User, Phone, CheckCircle2 } from 'lucide-react';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);

  const handleBooking = (e) => {
    e.preventDefault();
    setStep(2);
    setToast('Booking request sent successfully!');
  };

  return (
    <div className="pt-[120px] pb-[60px] min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Book An Appointment</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Schedule a consultation at our Vijayawada studio to see physical album samples or discuss a major editing contract.
            </p>
          </ScrollReveal>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="order-1 lg:order-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sticky top-[100px]">
                <h2 className="text-2xl font-serif text-white mb-6">Select Date & Time</h2>
                <AvailabilityCalendar />
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <CalendarIcon size={16} className="text-[#D4AF37]" />
                    Appointments are subject to confirmation.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-2 lg:order-1">
              <form onSubmit={handleBooking} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-serif text-white mb-6">Your Details</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                      <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#D4AF37] outline-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                      <input type="tel" required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#D4AF37] outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Purpose of Visit</label>
                    <select required className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#D4AF37] outline-none appearance-none">
                      <option value="">Select an option...</option>
                      <option value="album">View Album Samples (B2C)</option>
                      <option value="contract">B2B Studio Contract</option>
                      <option value="consultation">Editing Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Additional Notes</label>
                    <textarea rows="4" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#D4AF37] outline-none"></textarea>
                  </div>

                  <button type="submit" className="w-full btn btn-primary py-4">Request Booking</button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center bg-white/5 border border-white/10 rounded-2xl p-10 mt-10 animate-slide-up">
            <CheckCircle2 size={64} className="text-[#10b981] mx-auto mb-6" />
            <h2 className="text-3xl font-serif text-white mb-4">Request Sent!</h2>
            <p className="text-gray-400 mb-8">
              We have received your appointment request. Our team will contact you shortly to confirm the exact time slot.
            </p>
            <button onClick={() => setStep(1)} className="btn btn-outline w-full">Book Another</button>
          </div>
        )}
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default BookingPage;
