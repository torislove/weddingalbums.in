import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, title = '', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, type, message, title, duration };

    setToasts((prev) => [...prev.slice(-3), newToast]); // Limit to max 4 concurrent toasts

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (msg, title) => addToast('success', msg, title),
    error: (msg, title) => addToast('error', msg, title),
    info: (msg, title) => addToast('info', msg, title),
    gold: (msg, title) => addToast('gold', msg, title),
    remove: removeToast
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-portal-container" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => {
          const Icon = t.type === 'success' ? CheckCircle2 :
                       t.type === 'error' ? AlertCircle :
                       t.type === 'gold' ? Sparkles : Info;

          return (
            <div key={t.id} className={`toast-card toast-${t.type} slide-in`}>
              <div className="toast-icon-wrapper">
                <Icon size={18} />
              </div>
              <div className="toast-body">
                {t.title && <div className="toast-title">{t.title}</div>}
                <div className="toast-message">{t.message}</div>
              </div>
              <button 
                type="button" 
                className="toast-close-btn" 
                onClick={() => removeToast(t.id)}
                aria-label="Close notification"
              >
                <X size={15} />
              </button>
              <div 
                className="toast-progress-bar" 
                style={{ animationDuration: `${t.duration}ms` }} 
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside ToastProvider
    return {
      success: (m) => console.log('[Toast Success]', m),
      error: (m) => console.error('[Toast Error]', m),
      info: (m) => console.log('[Toast Info]', m),
      gold: (m) => console.log('[Toast Gold]', m),
      remove: () => {}
    };
  }
  return context;
};

export default ToastContext;
