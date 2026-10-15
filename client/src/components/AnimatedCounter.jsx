import React, { useEffect, useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const AnimatedCounter = ({ from = 0, target, suffix = '', duration = 1.5 }) => {
  const to = Number(target) || 0;
  const [count, setCount] = useState(from);
  const [ref, isVisible] = useScrollReveal();

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    let rafId = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      // Smooth ease-out cubic curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(from + (to - from) * easeOut));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVisible, from, to, duration]);

  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>;
};

export default React.memo(AnimatedCounter);
