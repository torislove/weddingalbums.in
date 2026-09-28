import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const ScrollReveal = ({ children, className = '', delay = 0, style = {}, animation = 'fade' }) => {
  const [ref, isVisible] = useScrollReveal();

  const baseStyle = {
    transitionDelay: `${delay}ms`,
    ...style
  };

  const hiddenClass = animation === 'wipe' ? 'reveal-wipe' : 'reveal-hidden';

  return (
    <div
      ref={ref}
      className={`${hiddenClass} ${isVisible ? 'reveal-visible' : ''} ${className}`}
      style={baseStyle}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
