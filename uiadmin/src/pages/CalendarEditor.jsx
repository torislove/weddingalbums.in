import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw, Save, Info, Sparkles } from 'lucide-react';

const CalendarEditor = ({ adminState }) => {
  const { content, updateGlobal, saveContent, isDirty, saving } = adminState;
  
  // Local state for edits before saving to global
  const [availability, setAvailability] = useState({
    slotsPerDay: 2,
    bookings: {},
    auspiciousDates: []
  });
  
  const [fetching, setFetching] = useState(false);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0); // 0 = current month, 1 = next, etc

  useEffect(() => {
    if (content?.global?.availability) {
      setAvailability(content.global.availability);
    }
  }, [content]);

  const handleUpdate = (newAvail) => {
    setAvailability(newAvail);
    updateGlobal('availability', newAvail);
  };

  const handleSlotsChange = (e) => {
    handleUpdate({
      ...availability,
      slotsPerDay: parseInt(e.target.value) || 1
    });
  };

  const toggleBooking = (dateStr) => {
    const currentBookings = availability.bookings[dateStr] || 0;
    let nextBookings = currentBookings + 1;
    if (nextBookings > availability.slotsPerDay) {
      nextBookings = 0;
    }
    
    const newBookings = { ...availability.bookings, [dateStr]: nextBookings };
    if (nextBookings === 0) delete newBookings[dateStr];
    
    handleUpdate({
      ...availability,
      bookings: newBookings
    });
  };

  const fetchMuhurthams = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/muhurtham');
      const data = await res.json();
      if (data && data.dates) {
        handleUpdate({
          ...availability,
          auspiciousDates: data.dates
        });
        alert(`Successfully fetched ${data.dates.length} auspicious dates!`);
      }
    } catch (err) {
      console.error("Failed to fetch muhurthams", err);
      alert("Failed to fetch muhurthams from server.");
    }
    setFetching(false);
  };

  // Generate calendar grid for a given offset month
  const renderMonth = (offset) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 is Sunday
    
    const monthName = firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const blanks = Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`blank-${i}`} className="p-2 border border-white/5 opacity-50"></div>);
    const days = Array.from({ length: daysInMonth }).map((_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const bookedCount = availability.bookings[dateStr] || 0;
      const isAuspicious = availability.auspiciousDates?.includes(dateStr);
      
      let statusClass = "bg-white/5 hover:bg-white/10 text-gray-300";
      if (bookedCount > 0 && bookedCount < availability.slotsPerDay) {
        statusClass = "bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]"; // Filling fast
      } else if (bookedCount >= availability.slotsPerDay) {
        statusClass = "bg-red-500/20 border border-red-500/40 text-red-400"; // Fully booked
      }

      return (
        <div 
          key={day} 
          onClick={() => toggleBooking(dateStr)}
          className={`relative p-3 border border-white/5 cursor-pointer transition-colors flex flex-col items-center justify-center aspect-square rounded-lg ${statusClass}`}
        >
          <span className="font-medium text-lg">{day}</span>
          {bookedCount > 0 && (
            <span className="text-[10px] mt-1 opacity-80">{bookedCount}/{availability.slotsPerDay} Booked</span>
          )}
          {isAuspicious && (
            <Sparkles size={12} className="text-yellow-400 absolute top-1.5 right-1.5 drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]" />
          )}
        </div>
      );
    });

    return (
      <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-serif text-white mb-4 text-center">{monthName}</h3>
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs text-gray-500 font-medium tracking-widest uppercase">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {blanks}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar animate-fade-in relative z-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-serif text-white mb-2 flex items-center gap-3">
              <Calendar className="text-[#D4AF37]" size={28} /> Booking Availability
            </h1>
            <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
              Manage your calendar slots dynamically. Click on any date to cycle through booking statuses (Available ➔ Filling ➔ Fully Booked ➔ Available).
            </p>
          </div>
          
          <button 
            onClick={saveContent}
            disabled={!isDirty || saving}
            className={`btn px-6 py-2.5 rounded-xl whitespace-nowrap shadow-sm flex items-center gap-2 ${isDirty ? 'bg-[#D4AF37] text-black hover:bg-[#F3E5AB]' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
          >
            <Save size={16} /> {saving ? 'Publishing...' : 'Publish Calendar'}
          </button>
        </div>

        {/* Global Settings & Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Info size={16} className="text-blue-400"/> Calendar Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Max Slots Per Day</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={availability.slotsPerDay} 
                  onChange={handleSlotsChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500">How many bookings can you handle simultaneously on a single day? (e.g. 2 concurrent events)</p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400"/> Telugu Panchangam API
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Automatically fetch auspicious wedding dates (Subhamuhurthams) for upcoming months using our backend scraper. These dates will be highlighted with a gold star to drive urgency for clients.
            </p>
            <button 
              onClick={fetchMuhurthams}
              disabled={fetching}
              className="btn bg-indigo-600 hover:bg-indigo-500 text-white w-full py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} className={fetching ? 'animate-spin' : ''} /> 
              {fetching ? 'Syncing Online Muhurthams...' : 'Fetch Subhamuhurthams'}
            </button>
            <div className="mt-4 flex flex-wrap gap-2">
              {availability.auspiciousDates?.map(date => (
                <span key={date} className="px-2 py-1 bg-yellow-400/10 text-yellow-400 text-[10px] rounded-md border border-yellow-400/20">{date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Calendars */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif text-white">Select Dates</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40"></div> Filling Fast</div>
              <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div> Fully Booked</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderMonth(0)}
            {renderMonth(1)}
            {renderMonth(2)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CalendarEditor;
