import React from 'react';
import './AvailabilityCalendar.css';
import ScrollReveal from './ScrollReveal';
import { useContent } from '../context/ContentContext';

const AvailabilityCalendar = () => {
  const { global } = useContent();
  const availability = global?.availability || { slotsPerDay: 2, bookings: {}, auspiciousDates: [] };

  // Generate the next 3 months dynamically
  const generateMonths = () => {
    const months = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startDayOfWeek = firstDay.getDay(); // 0 is Sunday
      
      const monthName = firstDay.toLocaleString('default', { month: 'long' });
      
      const days = [];
      for(let d=1; d <= daysInMonth; d++) {
         const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
         days.push({ day: d, dateStr });
      }

      months.push({ name: monthName, year, startDayOfWeek, days });
    }
    return months;
  };

  const months = generateMonths();

  return (
    <ScrollReveal className="availability-calendar">
      <h3 className="mb-4 text-gradient">Booking Availability</h3>
      <p className="text-muted mb-4">Our calendar fills up quickly during the wedding season. Please check dates below.</p>
      
      <div className="calendar-legend">
        <span className="legend-item"><div className="dot dot-available"></div> Available</span>
        <span className="legend-item"><div className="dot dot-filling"></div> Filling Fast</span>
        <span className="legend-item"><div className="dot dot-booked"></div> Fully Booked</span>
        <span className="legend-item ml-4 text-yellow-500 font-medium">🌟 Telugu Subhamuhurtham</span>
      </div>

      <div className="calendar-grid">
        {months.map((month, idx) => (
          <div key={idx} className="calendar-month">
            <h4>{month.name} <span className="text-xs text-gray-500 opacity-60 ml-1">{month.year}</span></h4>
            <div className="days-grid-header">
               <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="days-grid">
              {Array.from({ length: month.startDayOfWeek }).map((_, i) => (
                <div key={`blank-${i}`} className="calendar-day blank"></div>
              ))}
              {month.days.map(dayObj => {
                const bookedCount = availability.bookings[dayObj.dateStr] || 0;
                const isAuspicious = availability.auspiciousDates?.includes(dayObj.dateStr);
                
                let statusClass = 'day-available';
                if (bookedCount > 0 && bookedCount < availability.slotsPerDay) statusClass = 'day-filling';
                else if (bookedCount >= availability.slotsPerDay) statusClass = 'day-booked';

                return (
                  <div key={dayObj.day} className={`calendar-day ${statusClass} ${isAuspicious ? 'day-auspicious' : ''}`} title={isAuspicious ? "Highly Auspicious Subhamuhurtham Date" : ""}>
                    {dayObj.day}
                    {isAuspicious && <span className="auspicious-star">🌟</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-6 text-center opacity-70">
        * Auspicious dates (🌟) are highly demanded. We recommend booking 3-6 months in advance for Subhamuhurthams.
      </p>
    </ScrollReveal>
  );
};

export default AvailabilityCalendar;
