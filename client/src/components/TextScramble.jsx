import React, { useState, useEffect, useRef } from 'react';

const TextScramble = ({ text, delay = 0, as: Component = 'span', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  // Split text by words for proper Telugu rendering (ligatures stay intact)
  const words = text.split(' ');

  return (
    <Component 
      ref={elementRef} 
      style={{ display: 'inline-block' }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className={className}
          style={{
            display: 'inline-block',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
            transition: `opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) ${i * 0.15}s, transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) ${i * 0.15}s`,
            marginRight: i !== words.length - 1 ? '0.25em' : '0'
          }}
        >
          {word}
        </span>
      ))}
    </Component>
  );
};

export default TextScramble;
