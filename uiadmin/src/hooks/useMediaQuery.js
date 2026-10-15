import { useState, useEffect } from 'react';

/**
 * Reactive hook that returns true when the CSS media query matches.
 * Re-evaluates whenever the viewport crosses the breakpoint.
 *
 * Usage:
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export default useMediaQuery;
