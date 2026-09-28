import { useEffect, useRef } from 'react';

/**
 * useMagneticButton hook
 * Makes a button "magnetic" - it will attract towards the cursor when the cursor is near.
 */
const useMagneticButton = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Distance from cursor to center of button
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const magneticRadius = 80;

      if (distance < magneticRadius) {
        // Attract
        const power = 0.3;
        const moveX = deltaX * power;
        const moveY = deltaY * power;
        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.05)`;
      } else {
        // Reset
        el.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
      }
    };

    const handleMouseLeave = () => {
      el.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (el) el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
};

export default useMagneticButton;
