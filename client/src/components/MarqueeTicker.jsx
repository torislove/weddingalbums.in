import React, { useEffect, useRef, useState } from 'react';
import './MarqueeTicker.css';

const MarqueeTicker = ({ items, speed = 1, reverse = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);
  
  useEffect(() => {
    let animationId;
    let position = 0;
    
    // Add scroll velocity effect
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      scrollVelocity = delta * 0.03; // Much slower scroll multiplier
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const animate = () => {
      // Decay scroll velocity back to normal
      scrollVelocity *= 0.90;
      if (Math.abs(scrollVelocity) < 0.1) scrollVelocity = 0;
      
      // Extremely slow base speed (70%+ slower)
      const currentSpeed = speed * 0.05 + Math.abs(scrollVelocity);
      const direction = (reverse ? -1 : 1); // Removed hover reversal for elegance
      
      position -= currentSpeed * direction;
      
      // Reset position when it scrolls too far (looping magic)
      // Assuming each set of items is 50% of the total width
      if (position <= -50) {
        position += 50;
      } else if (position > 0) {
        position -= 50;
      }
      
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${position}%)`;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed, reverse, isHovered]);

  // Duplicate items twice to ensure smooth infinite scrolling
  const renderItems = () => (
    <div className="marquee-content">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="marquee-item">{item}</span>
          <span className="marquee-separator">✦</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div 
      className="marquee-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="marquee-track" ref={trackRef}>
        {renderItems()}
        {renderItems()}
      </div>
    </div>
  );
};

export default MarqueeTicker;
