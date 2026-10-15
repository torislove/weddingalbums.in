import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices or small screens
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches || window.innerWidth < 1024) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let rafId = null;
    let isVisible = false;

    const render = () => {
      // Snappy, high-refresh interpolation
      cursorX += (mouseX - cursorX) * 0.45;
      cursorY += (mouseY - cursorY) * 0.45;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        if (!isVisible && mouseX > 0) {
          cursorRef.current.style.opacity = '1';
          isVisible = true;
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e) => {
      if (!cursorRef.current) return;
      const target = e.target;
      const isClickable = Boolean(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('clickable')
      );
      if (isClickable) {
        cursorRef.current.classList.add('hovering');
      } else {
        cursorRef.current.classList.remove('hovering');
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="shutter-cursor"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shutter-svg">
        <circle cx="16" cy="16" r="14" stroke="#D4AF37" strokeWidth="1.2" opacity="0.6" />
        <circle cx="16" cy="16" r="8" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" className="inner-dashed" />
        <circle cx="16" cy="16" r="3" fill="#D4AF37" className="center-dot" />
      </svg>
    </div>
  );
};

export default React.memo(CustomCursor);
