import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Instant scroll to top on genuine page change (unless anchor hash present)
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // Zero-latency instant render without 1.4s blocking timeouts
  return (
    <div key={location.pathname} className="page-fade-in" style={{ width: '100%' }}>
      {children}
    </div>
  );
};

export default React.memo(PageTransition);
