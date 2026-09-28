import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Bell } from 'lucide-react';
import BlockEditor from '../components/BlockEditor';

const PushNotificationEditor = ({ adminState }) => {
  const { content, setContent, setIsDirty } = adminState;
  const [previewMode, setPreviewMode] = useState('desktop');

  const handleUpdate = (newProps) => {
    setContent({
      ...content,
      global: {
        ...content.global,
        pushNotification: newProps
      }
    });
    setIsDirty(true);
  };

  const activeBlock = {
    type: 'Advanced Push Notification',
    props: content.global?.pushNotification || {}
  };

  const getPreviewWidth = () => {
    if (previewMode === 'mobile') return '375px';
    if (previewMode === 'tablet') return '768px';
    return '100%';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black/20">
      
      {/* 2. Editor Panel */}
      <div className="w-[400px] flex flex-col border-r border-white/10 bg-[#050505] flex-shrink-0 relative">
        <div className="p-5 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="text-lg font-serif text-white">Push Notifications</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Marketing & Alerts</p>
          </div>
        </div>

        <div className="absolute inset-0 top-[80px] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>
        <div className="flex-1 overflow-y-auto custom-scrollbar animate-slide-up">
          <BlockEditor 
            block={activeBlock} 
            onChange={handleUpdate} 
          />
        </div>
      </div>

      {/* 3. Live Preview Iframe */}
      <div className="flex-1 flex flex-col bg-[#000000] relative overflow-hidden">
        {/* Preview Toolbar */}
        <div className="h-14 border-b border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Preview
          </div>
          
          <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
            <button 
              onClick={() => setPreviewMode('desktop')}
              className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-[#D4AF37] text-black shadow' : 'text-gray-500 hover:text-white'}`}
            >
              <Monitor size={16} />
            </button>
            <button 
              onClick={() => setPreviewMode('tablet')}
              className={`p-1.5 rounded-md transition-colors ${previewMode === 'tablet' ? 'bg-[#D4AF37] text-black shadow' : 'text-gray-500 hover:text-white'}`}
            >
              <Tablet size={16} />
            </button>
            <button 
              onClick={() => setPreviewMode('mobile')}
              className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-[#D4AF37] text-black shadow' : 'text-gray-500 hover:text-white'}`}
            >
              <Smartphone size={16} />
            </button>
          </div>
          
          <div className="text-xs text-gray-500 font-mono">
            http://localhost:5173/
          </div>
        </div>
        
        {/* Iframe Container */}
        <div className="flex-1 overflow-auto flex justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDkwOTA5Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMTExIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]">
          <div 
            className="h-full bg-white transition-all duration-300 ease-in-out shadow-2xl origin-top"
            style={{ width: getPreviewWidth() }}
          >
            <iframe 
              src="http://localhost:5173/" 
              className="w-full h-full border-0"
              title="Live Preview"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default PushNotificationEditor;
