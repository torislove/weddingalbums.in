import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import './NetworkStatusBar.css';

const NetworkStatusBar = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className={`network-status-bar ${isOnline ? 'reconnected' : 'offline'}`} role="status">
      <div className="network-status-content">
        {!isOnline ? (
          <>
            <WifiOff size={16} className="network-icon pulse" />
            <span>
              <strong>Offline Mode:</strong> Browsing cached wedding catalog and pricing. Changes will automatically sync when connected.
            </span>
          </>
        ) : (
          <>
            <Wifi size={16} className="network-icon" />
            <span>
              <strong>Back Online!</strong> Connected to high-speed studio post-production engine.
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkStatusBar;
