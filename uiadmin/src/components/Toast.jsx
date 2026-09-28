import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md
        ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
        ${type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
        ${type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : ''}
      `}>
        {type === 'success' && <CheckCircle size={18} />}
        {type === 'error' && <AlertCircle size={18} />}
        {type === 'info' && <Info size={18} />}
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
