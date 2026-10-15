import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only run on devices with a fine pointer (mouse/trackpad) and screen width >= 1024px
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches || window.innerWidth < 1024) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = null;
    let isVisible = false;

    // Direct event listener updating dot instantly on mousemove with zero latency
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
        isVisible = true;
      }

      // 100% immediate zero-lag direct transform on the dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    // Fast, ultra-snappy 120fps physics loop for the trailing gold aperture ring
    const render = () => {
      // Snappy 0.52 factor: follows the pointer tightly without any sluggish drag
      ringX += (mouseX - ringX) * 0.52;
      ringY += (mouseY - ringY) * 0.52;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const onMouseDown = () => {
      if (ringRef.current) ringRef.current.classList.add('clicking');
      if (dotRef.current) dotRef.current.classList.add('clicking');
    };

    const onMouseUp = () => {
      if (ringRef.current) ringRef.current.classList.remove('clicking');
      if (dotRef.current) dotRef.current.classList.remove('clicking');
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isClickable = Boolean(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.sheet-tab-card') ||
        target.closest('.est-choice-btn') ||
        target.closest('.est-size-card') ||
        target.closest('.est-sheet-pill') ||
        target.closest('.service-card-v2') ||
        target.classList.contains('clickable')
      );

      if (ringRef.current) {
        if (isClickable) {
          ringRef.current.classList.add('hovering');
        } else {
          ringRef.current.classList.remove('hovering');
        }
      }
    };

    const onMouseLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
      isVisible = false;
    };

    const onMouseEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
      isVisible = true;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <div className="luxury-cursor-container" aria-hidden="true">
      {/* Precision Instant Zero-Lag Dot */}
      <div ref={dotRef} className="luxury-cursor-dot" style={{ opacity: 0 }} />
      
      {/* Ultra-Snappy Gold Aperture Halo Ring */}
      <div ref={ringRef} className="luxury-cursor-ring" style={{ opacity: 0 }}>
        <div className="aperture-halo-inner" />
      </div>
    </div>
  );
};

export default React.memo(CustomCursor);
