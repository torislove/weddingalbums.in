import { useEffect, useState, useRef } from 'react';

const useScrollReveal = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  const threshold = options.threshold ?? 0.1;
  const rootMargin = options.rootMargin ?? '0px';
  const root = options.root ?? null;

  useEffect(() => {
    // If element is already visible, no need to observe again
    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    const el = ref.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, isVisible]);

  return [ref, isVisible];
};

export default useScrollReveal;
