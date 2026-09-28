import React, { useState, useEffect } from 'react';
import { X, Sparkles, Bell, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import './PushNotification.css';

const getIcon = (name) => {
  switch (name) {
    case 'Sparkles': return <Sparkles size={20} className="text-[#D4AF37]" />;
    case 'Bell': return <Bell size={20} className="text-[#D4AF37]" />;
    case 'Calendar': return <Calendar size={20} className="text-[#D4AF37]" />;
    default: return <Bell size={20} className="text-[#D4AF37]" />;
  }
};

const PushNotification = () => {
  const { global } = useContent();
  const notification = global?.pushNotification;
  
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (notification && notification.isActive && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000); // Slide in after 2 seconds
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [notification, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsDismissed(true);
    }, 500); // Wait for exit animation
  };

  if (!notification || !notification.isActive || isDismissed) return null;

  return (
    <div className={`push-notification-wrapper ${isVisible ? 'visible' : ''}`}>
      <div className="push-notification-card">
        <button className="push-close-btn" onClick={handleDismiss} aria-label="Close">
          <X size={16} />
        </button>
        
        <div className="push-header">
          <div className="push-icon-container">
            {getIcon(notification.icon)}
          </div>
          <div className="push-title">{notification.title}</div>
        </div>
        
        <div className="push-body">
          <p>{notification.message}</p>
        </div>
        
        {notification.buttons && notification.buttons.length > 0 && (
          <div className="push-actions">
            {notification.buttons.map((btn, index) => (
              <Link 
                key={index} 
                to={btn.url} 
                className={`push-btn ${index === 0 ? 'push-btn-primary' : 'push-btn-secondary'}`}
                onClick={handleDismiss}
              >
                {btn.label}
                {index === 0 && <ArrowRight size={14} />}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PushNotification;
