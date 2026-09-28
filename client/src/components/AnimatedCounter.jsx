import React, { useEffect, useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const AnimatedCounter = ({ from = 0, target, suffix = '', duration = 2 }) => {
  const to = target;
  const [count, setCount] = useState(from);
  const [ref, isVisible] = useScrollReveal();

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(from + (to - from) * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, from, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default AnimatedCounter;
