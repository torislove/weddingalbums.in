import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      setIsDesktop(false);
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    const render = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }
      
      requestAnimationFrame(render);
    };
    
    requestAnimationFrame(render);

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('masonry-item')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <div 
      ref={cursorRef} 
      className={`shutter-cursor ${isHovering ? 'hovering' : ''}`}
    >
      <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shutter-svg logo-svg">
        <circle cx="16" cy="16" r="14" stroke="#D4AF37" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="8" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 2" className="inner-dashed" />
        <circle cx="16" cy="16" r="4" fill="#D4AF37" className="center-dot" />
        {/* aperture blades */}
        <g className="aperture-lines">
          {[0,60,120,180,240,300].map((a,i)=>{
            const r = (a * Math.PI) / 180;
            const x1 = 16 + 8 * Math.cos(r);
            const y1 = 16 + 8 * Math.sin(r);
            const x2 = 16 + 13 * Math.cos(r + Math.PI/6);
            const y2 = 16 + 13 * Math.sin(r + Math.PI/6);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />;
          })}
        </g>
      </svg>
    </div>
  );
};

export default CustomCursor;
