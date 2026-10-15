import React, { useState } from 'react';
import { Settings, Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, Sparkles, ArrowLeft, Sliders, Globe, Eye } from 'lucide-react';
import BlockEditor from '../components/BlockEditor';
import { useMediaQuery } from '../hooks/useMediaQuery';

const GlobalEditor = ({ adminState }) => {
  const { content, updateGlobal } = adminState;
  const [activeSection, setActiveSection] = useState('footer');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [iframeKey, setIframeKey] = useState(0);

  const isMobileOrTablet = useMediaQuery('(max-width: 1024px)');
  const [mobileTab, setMobileTab] = useState('sections'); // 'sections' | 'properties' | 'preview'

  const globalData = content?.global || {};

  const handleUpdate = (newProps) => {
    updateGlobal(activeSection, newProps);
  };

  const activeBlock = {
    type: `Global: ${activeSection}`,
    props: globalData[activeSection] || {}
  };

  const sections = Array.from(new Set([
    'footer',
    'navbar',
    'pushNotification',
    'siteSettings',
    'availability',
    'siteImages',
    ...Object.keys(globalData)
  ]));

  const isLocal = typeof window !== 'undefined' && (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1'));
  const clientBase = isLocal ? 'http://localhost:5173' : 'https://weddingalbums-b4bcd.web.app';
  const previewUrl = `${clientBase}/`;

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)] lg:h-screen overflow-hidden bg-black/30">
      {/* Mobile/Tablet View Switcher */}
      {isMobileOrTablet && (
        <div className="flex bg-[#0e0e0e] border-b border-white/10 p-2 gap-2 flex-shrink-0 z-20">
          <button
            onClick={() => setMobileTab('sections')}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'sections' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Globe size={13} />
            <span className="truncate">Elements ({sections.length})</span>
          </button>
          <button
            onClick={() => setMobileTab('properties')}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'properties' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Sliders size={13} />
            <span className="truncate capitalize">{activeSection}</span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'preview' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-gray-400 hover:text-white bg-white/5'
            }`}
          >
            <Eye size={13} />
            <span>Preview</span>
          </button>
        </div>
      )}
      
      {/* 1. Structure Panel */}
      {(!isMobileOrTablet || mobileTab === 'sections') && (
        <div className={`${isMobileOrTablet ? 'w-full flex-1' : 'w-[300px]'} flex flex-col border-r border-white/10 bg-[#0a0a0a] flex-shrink-0`}>
          <div className="p-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#D4AF37]" />
              <h2 className="text-base font-serif text-white">Global Elements</h2>
            </div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Site-wide Settings & Branding</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            <div className="space-y-2">
              {sections.map(section => (
                <div 
                  key={section}
                  className={`group flex items-center gap-3 border p-3 rounded-xl cursor-pointer transition-all duration-200 
                    ${activeSection === section ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/30' : 'border-white/10 hover:border-white/20 bg-white/5'}`}
                  onClick={() => {
                    setActiveSection(section);
                    if (isMobileOrTablet) setMobileTab('properties');
                  }}
                >
                  <Settings size={16} className={activeSection === section ? 'text-[#D4AF37]' : 'text-gray-500'} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-xs font-semibold capitalize tracking-wide truncate">{section}</h3>
                    <p className="text-[10px] text-gray-400 capitalize truncate">
                      {section === 'footer' ? 'Footer info, address & marquee' : 
                       section === 'navbar' ? 'Header navigation & logo' : 
                       section === 'pushNotification' ? 'Special announcement banner' : 
                       section === 'siteSettings' ? 'Primary brand contacts' : 'Global properties'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Editor Panel */}
      {(!isMobileOrTablet || mobileTab === 'properties') && (
        <div className={`${isMobileOrTablet ? 'w-full flex-1' : 'w-[380px]'} flex flex-col border-r border-white/10 bg-[#0e0e0e] flex-shrink-0 shadow-2xl`}>
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              {isMobileOrTablet && (
                <button
                  onClick={() => setMobileTab('sections')}
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium mr-1"
                >
                  <ArrowLeft size={14} /> Elements
                </button>
              )}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">{activeSection}</span>
              </div>
            </div>
            <span className="text-[10px] bg-white/10 text-[#D4AF37] px-2 py-0.5 rounded-full font-mono uppercase">
              Active Editor
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <BlockEditor 
              block={activeBlock} 
              onChange={handleUpdate} 
            />
          </div>
        </div>
      )}

      {/* 3. Live Preview Iframe */}
      {(!isMobileOrTablet || mobileTab === 'preview') && (
        <div className="flex-1 flex flex-col bg-[#000000] relative overflow-hidden">
          {/* Preview Toolbar */}
          <div className="h-14 border-b border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-10">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-medium text-white">Live Preview</span>
              </div>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span className="font-mono text-gray-500 hidden md:inline">{previewUrl}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10 shadow-inner">
                <button 
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-[#D4AF37] text-black shadow font-bold' : 'text-gray-400 hover:text-white'}`}
                  title="Desktop View (100%)"
                >
                  <Monitor size={15} />
                </button>
                <button 
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-1.5 rounded-md transition-all ${previewMode === 'tablet' ? 'bg-[#D4AF37] text-black shadow font-bold' : 'text-gray-400 hover:text-white'}`}
                  title="Tablet View (768px)"
                >
                  <Tablet size={15} />
                </button>
                <button 
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-[#D4AF37] text-black shadow font-bold' : 'text-gray-400 hover:text-white'}`}
                  title="Mobile View (375px)"
                >
                  <Smartphone size={15} />
                </button>
              </div>

              <button 
                onClick={() => setIframeKey(k => k + 1)}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Reload Preview Frame"
              >
                <RefreshCw size={14} />
              </button>

              <a 
                href={previewUrl} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                title="Open Live Site in New Tab"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
          
          {/* Iframe Container with Device Frames */}
          <div className="flex-1 overflow-hidden flex justify-center items-center p-2 sm:p-4 md:p-8 bg-[#050505]">
            
            {previewMode === 'mobile' && (
              <div className="relative w-full max-w-[375px] h-full max-h-[812px] bg-black rounded-[45px] shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[8px] border-[#1a1a1a] flex-shrink-0 transition-all duration-300 overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[26px] bg-[#1a1a1a] rounded-b-2xl z-20 flex justify-center items-center gap-2">
                  <div className="w-10 h-1.5 rounded-full bg-[#0a0a0a]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a] border border-[#2a2a2a]"></div>
                </div>
                <div className="w-full h-full bg-white relative z-10 pt-2 rounded-[36px] overflow-hidden">
                  <iframe key={iframeKey} src={previewUrl} className="w-full h-full border-0" title="Live Mobile Preview" />
                </div>
              </div>
            )}

            {previewMode === 'tablet' && (
              <div className="relative w-full max-w-[768px] h-full max-h-[960px] bg-black rounded-[36px] shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[12px] border-[#1a1a1a] flex-shrink-0 transition-all duration-300 overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[18px] z-20 flex justify-center items-center">
                  <div className="w-2 h-2 rounded-full bg-[#2a2a2a] border border-[#000] mt-1"></div>
                </div>
                <div className="w-full h-full bg-white relative z-10 rounded-[24px] overflow-hidden">
                  <iframe key={iframeKey} src={previewUrl} className="w-full h-full border-0" title="Live Tablet Preview" />
                </div>
              </div>
            )}

            {previewMode === 'desktop' && (
              <div className="relative w-full h-full bg-black rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[6px] border-[#1a1a1a] flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ring-1 ring-white/10">
                <div className="h-7 bg-[#1a1a1a] w-full flex items-center px-4 gap-2 z-20 border-b border-[#2a2a2a]">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                  <div className="flex-1 text-center text-gray-500 text-[10px] font-mono select-none tracking-widest truncate px-4">
                    {previewUrl}
                  </div>
                </div>
                <div className="w-full flex-1 bg-white relative z-10 overflow-hidden">
                  <iframe key={iframeKey} src={previewUrl} className="w-full h-full border-0" title="Live Desktop Preview" />
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default GlobalEditor;
