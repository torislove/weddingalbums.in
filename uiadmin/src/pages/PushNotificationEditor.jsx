import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, Bell, ExternalLink, Sliders, Eye } from 'lucide-react';
import BlockEditor from '../components/BlockEditor';
import { useMediaQuery } from '../hooks/useMediaQuery';

const PushNotificationEditor = ({ adminState }) => {
  const { content, setContent, setIsDirty } = adminState;
  const [previewMode, setPreviewMode] = useState('desktop');
  const iframeRef = useRef(null);

  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'preview'

  const previewUrl = typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')
    ? '/' 
    : (import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173/');

  const handleUpdate = (newProps) => {
    const updated = {
      ...content,
      global: {
        ...content.global,
        pushNotification: newProps
      }
    };
    setContent(updated);
    setIsDirty(true);

    // Live postMessage sync to preview iframe
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'CMS_CONTENT_UPDATE',
        content: updated
      }, '*');
    }
  };

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow && content) {
      iframeRef.current.contentWindow.postMessage({
        type: 'CMS_CONTENT_UPDATE',
        content
      }, '*');
    }
  }, [content]);

  const activeBlock = {
    type: 'Advanced Push Notification',
    props: content.global?.pushNotification || {}
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-black/20">
      {/* Mobile Tab Switcher */}
      {isMobile && (
        <div className="flex bg-[#0e0e0e] border-b border-white/10 p-2 gap-2 flex-shrink-0 z-20">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'editor' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Sliders size={13} /> Settings
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'preview' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Eye size={13} /> Live Preview
          </button>
        </div>
      )}
      
      {/* 2. Editor Panel */}
      {(!isMobile || mobileTab === 'editor') && (
        <div className={`${isMobile ? 'w-full flex-1' : 'w-[420px]'} flex flex-col border-r border-white/10 bg-[#050505] flex-shrink-0 relative`}>
          <div className="p-4 sm:p-5 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif text-white">Push Notifications</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Marketing & Alerts Banner</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar animate-slide-up p-2">
            <BlockEditor 
              block={activeBlock} 
              onChange={handleUpdate} 
            />
          </div>
        </div>
      )}

      {/* 3. Live Preview Iframe */}
      {(!isMobile || mobileTab === 'preview') && (
        <div className="flex-1 flex flex-col bg-[#000000] relative overflow-hidden">
          {/* Preview Toolbar */}
          <div className="h-14 border-b border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-Time Live Preview
          </div>
          
          <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
            <button 
              onClick={() => setPreviewMode('desktop')}
              className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-[#D4AF37] text-black shadow' : 'text-gray-500 hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor size={16} />
            </button>
            <button 
              onClick={() => setPreviewMode('tablet')}
              className={`p-1.5 rounded-md transition-colors ${previewMode === 'tablet' ? 'bg-[#D4AF37] text-black shadow' : 'text-gray-500 hover:text-white'}`}
              title="Tablet View"
            >
              <Tablet size={16} />
            </button>
            <button 
              onClick={() => setPreviewMode('mobile')}
              className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-[#D4AF37] text-black shadow' : 'text-gray-500 hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-mono truncate max-w-[200px]">
              {previewUrl}
            </span>
            <a 
              href={previewUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/10"
              title="Open Live Preview in New Tab"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
        
        {/* Iframe Container */}
        <div className="flex-1 overflow-hidden flex justify-center items-center p-4 md:p-8 bg-[#050505]">
          {previewMode === 'mobile' && (
            <div className="relative w-full max-w-[375px] h-full max-h-[812px] bg-black rounded-[45px] shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[8px] border-[#1a1a1a] flex-shrink-0 transition-all duration-300 overflow-hidden ring-1 ring-white/10">
              <iframe 
                ref={iframeRef}
                src={previewUrl} 
                className="w-full h-full border-0 pt-2"
                title="Live Mobile Preview"
              />
            </div>
          )}

          {previewMode === 'tablet' && (
            <div className="relative w-full max-w-[768px] h-full max-h-[960px] bg-black rounded-[36px] shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[12px] border-[#1a1a1a] flex-shrink-0 transition-all duration-300 overflow-hidden ring-1 ring-white/10">
              <iframe 
                ref={iframeRef}
                src={previewUrl} 
                className="w-full h-full border-0"
                title="Live Tablet Preview"
              />
            </div>
          )}

          {previewMode === 'desktop' && (
            <div className="relative w-full h-full bg-black rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[6px] border-[#1a1a1a] flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ring-1 ring-white/10">
              <div className="h-7 bg-[#1a1a1a] w-full flex items-center px-4 gap-2 border-b border-[#2a2a2a]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <iframe 
                ref={iframeRef}
                src={previewUrl} 
                className="w-full flex-1 border-0"
                title="Live Desktop Preview"
              />
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default PushNotificationEditor;
