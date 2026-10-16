import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, Trash2, Plus, LayoutTemplate, Monitor, Tablet, Smartphone, 
  Eye, EyeOff, Search, ExternalLink, RefreshCw, Sparkles, ArrowLeft, Sliders
} from 'lucide-react';
import BlockEditor from '../components/BlockEditor';
import { useMediaQuery } from '../hooks/useMediaQuery';

const SortableBlock = ({ block, isActive, onClick, onDelete, onToggleVisibility }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const isHidden = block.isHidden === true;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group flex items-center gap-2.5 border p-3 rounded-xl mb-2.5 cursor-pointer transition-all duration-200 
        ${isActive ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-[#D4AF37]/30' : 'border-white/10 hover:border-white/20 bg-white/5'} 
        ${isDragging ? 'shadow-2xl opacity-90 scale-[1.02]' : ''}
        ${isHidden ? 'opacity-50 border-red-500/25 bg-red-950/10' : ''}`}
      onClick={onClick}
    >
      {/* Drag handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab text-gray-500 hover:text-white p-1 -ml-1 rounded transition-colors"
        title="Drag to reorder section"
      >
        <GripVertical size={16} />
      </div>

      {/* Block Information */}
      <div className="flex-1 overflow-hidden min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <LayoutTemplate size={13} className={isHidden ? "text-gray-500" : "text-[#D4AF37]"} />
          <h3 className={`text-sm font-semibold tracking-wide truncate ${isHidden ? 'text-gray-400 line-through' : 'text-white'}`}>
            {block.type}
          </h3>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
            isHidden 
              ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
          }`}>
            {isHidden ? 'Hidden' : 'Live'}
          </span>
        </div>
        <p className="text-gray-400 text-xs truncate">
          {Object.values(block.props || {}).find(v => typeof v === 'string' && v.length > 5 && !v.startsWith('http'))?.substring(0, 32) || "Empty block"}
        </p>
      </div>
      
      {/* Action Buttons: Always visible Eye Toggle */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button 
          type="button"
          onClick={(e) => { 
            e.stopPropagation(); 
            onToggleVisibility(); 
          }} 
          className={`p-2 rounded-lg transition-all ${
            isHidden 
              ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30' 
              : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/15 hover:border-[#D4AF37]/50 border border-white/10'
          }`}
          title={isHidden ? "Section is HIDDEN from site. Click to Show" : "Section is LIVE on site. Click to Hide"}
        >
          {isHidden ? <EyeOff size={15} /> : <Eye size={15} className="text-[#D4AF37]" />}
        </button>

        <button 
          type="button"
          onClick={(e) => { 
            e.stopPropagation(); 
            onDelete(); 
          }} 
          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
          title="Delete Section"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

const PageEditor = ({ adminState }) => {
  const { pageId } = useParams();
  const { content, updatePage } = adminState;
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, tablet, mobile
  const [searchFilter, setSearchFilter] = useState('');
  const [iframeKey, setIframeKey] = useState(0);
  
  const blocks = content?.pages?.[pageId] || [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      updatePage(pageId, arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const DEFAULT_BLOCK_PROPS = {
    VisualPillarsShowcase: {
      eyebrow: '✦ COMPLETE IN-HOUSE POST-PRODUCTION SUITE ✦',
      title: 'Crafted with Precision. Delivered with Reverence.',
      subtitle: 'From raw memory cards to museum-grade physical royal albums and cinematic films.',
      pillars: [
        {
          number: '01',
          badge: '100% Lay-Flat Binding · Archival Core',
          title: 'Royal Karizma & Lay-Flat Albums',
          telugu: 'కరిజ్మా & లే-ఫ్లాట్ వెడ్డింగ్ ఆల్బమ్స్',
          subtitle: 'Printed on state-of-the-art European digital presses with archival inks.',
          image: '/images/luxury-album-craftsmanship.jpg',
          tag: 'AP & Telangana #1 Choice',
          ctaText: 'Explore Album Specs & Finishes',
          ctaLink: '/albums'
        },
        {
          number: '02',
          badge: 'Netflix-Grade Color Grading',
          title: '4K Cinematic Wedding Films & Reels',
          telugu: '4K సినిమాటిక్ వీడియో ఎడిటింగ్ & రీల్స్',
          subtitle: 'Story-driven post-production crafted specifically for Telugu rituals.',
          image: '/images/cinematic-video-suite.jpg',
          tag: 'Rapid 48-Hour Rush Available',
          ctaText: 'Browse Video Editing Packages',
          ctaLink: '/services'
        },
        {
          number: '03',
          badge: '24K Gold Jewelry Specular Shine',
          title: 'High-End Photo Retouching & Color Correction',
          telugu: 'హై-ఎండ్ ఫొటో రీటచింగ్ & కలర్ గ్రేడింగ్',
          subtitle: 'High-end frequency separation to preserve authentic skin micro-texture.',
          image: '/images/weddingalbums-talambralu.png',
          tag: 'Batch RAW Discounts for Studios',
          ctaText: 'Order Custom Retouching',
          ctaLink: '/order'
        }
      ]
    },
    InteractiveBeforeAfter: {
      eyebrow: '✦ 100% IN-HOUSE RETOUCHING EXCELLENCE ✦',
      title: 'The Art of Telugu Wedding Retouching',
      subtitle: 'Drag the gold slider below to see the difference between raw camera capture and our master finish.',
      rawImage: '/images/bride-raw.jpg',
      polishedImage: '/images/bride-polished.jpg',
      rawLabel: 'RAW Unedited (DSLR Sensor)',
      polishedLabel: 'Master Polished (22K Gold Luster)',
      ctaText: 'Book Retouching Consultation',
      ctaLink: '/order'
    },
    CraftsmanshipDetails: {
      eyebrow: '✦ OBSESSIVE ATTENTION TO DETAIL ✦',
      title: 'Anatomy of an Archival Wedding Album',
      subtitle: 'Every volume is precision-assembled by master bookbinders using archival-grade materials.',
      ctaText: 'View Complete Swatch Kit',
      ctaLink: '/albums'
    },
    InstantEstimator: {
      eyebrow: '✦ TRANSPARENT STUDIO PRICING ✦',
      title: 'Instant Album & Video Cost Estimator',
      subtitle: 'Customize dimensions, covers, and add-ons to get a real-time price and delivery schedule.',
      ctaText: 'Lock In Estimate & Start Order',
      ctaLink: '/order'
    }
  };

  const handleAddBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      props: DEFAULT_BLOCK_PROPS[type] ? JSON.parse(JSON.stringify(DEFAULT_BLOCK_PROPS[type])) : {}
    };
    updatePage(pageId, [...blocks, newBlock]);
    setActiveBlockId(newBlock.id);
    setIsAddMenuOpen(false);
  };

  const handleDeleteBlock = (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      updatePage(pageId, blocks.filter(b => b.id !== id));
      if (activeBlockId === id) setActiveBlockId(null);
    }
  };

  const handleUpdateBlockProps = (id, newProps) => {
    const newBlocks = blocks.map(b => b.id === id ? { ...b, props: newProps } : b);
    updatePage(pageId, newBlocks);
  };

  const handleToggleVisibility = (id) => {
    const newBlocks = blocks.map(b => b.id === id ? { ...b, isHidden: !b.isHidden } : b);
    updatePage(pageId, newBlocks);
  };

  const activeBlock = blocks.find(b => b.id === activeBlockId);

  const availableComponents = [
    'Hero', 'VisualPillarsShowcase', 'InteractiveBeforeAfter', 'CraftsmanshipDetails', 
    'InstantEstimator', 'PageHero', 'MarqueeTicker', 'StatsBar', 'InHouseAdvantage', 
    'AboutTeaser', 'ServicesTeaser', 'PillarsList', 'KolamDivider', 'RitualsScroll', 
    'FeaturedGallery', 'TestimonialsCarousel', 'ReviewsBar', 'CTABanner', 'SimpleCTA'
  ];

  const isLocal = typeof window !== 'undefined' && (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1'));
  const clientBase = isLocal ? 'http://localhost:5173' : 'https://weddingalbums-b4bcd.web.app';
  const previewUrl = pageId === 'home' ? `${clientBase}/` : `${clientBase}/${pageId}`;

  const filteredBlocks = blocks.filter(b => {
    if (!searchFilter) return true;
    return b.type.toLowerCase().includes(searchFilter.toLowerCase());
  });

  const isMobileOrTablet = useMediaQuery('(max-width: 1024px)');
  const [mobileTab, setMobileTab] = useState('sections');

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
            <LayoutTemplate size={13} />
            <span className="truncate">Sections ({blocks.length})</span>
          </button>
          <button
            onClick={() => setMobileTab('properties')}
            disabled={!activeBlock}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'properties'
                ? 'bg-[#D4AF37] text-black font-bold shadow'
                : activeBlock
                ? 'text-gray-400 hover:text-white bg-white/5'
                : 'text-gray-600 bg-white/[0.02] opacity-50 cursor-not-allowed'
            }`}
          >
            <Sliders size={13} />
            <span className="truncate">{activeBlock ? activeBlock.type : 'Properties'}</span>
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
        <div className={`${isMobileOrTablet ? 'w-full flex-1' : 'w-[310px]'} flex flex-col border-r border-white/10 bg-[#0a0a0a] flex-shrink-0`}>
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <h2 className="text-base font-serif text-white capitalize">{pageId} Page</h2>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                {blocks.length} Sections · {blocks.filter(b => !b.isHidden).length} Live
              </p>
            </div>
            <div className="relative">
              <button 
                className="btn btn-primary p-2 rounded-xl text-xs flex items-center gap-1 font-semibold shadow-md"
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                title="Add New Section"
              >
                <Plus size={16} className={`transition-transform ${isAddMenuOpen ? 'rotate-45' : ''}`} />
                <span>Add</span>
              </button>
              
              {/* Add Section Dropdown */}
              {isAddMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 glass-panel p-2 z-50 animate-slide-up shadow-2xl border border-white/20 rounded-xl bg-[#111]">
                  <div className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider px-2 py-1.5 mb-1 border-b border-white/10">
                    Select Section Type
                  </div>
                  <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-1 space-y-1">
                    {availableComponents.map(comp => (
                      <button 
                        key={comp} 
                        onClick={() => handleAddBlock(comp)} 
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <LayoutTemplate size={13} className="text-gray-500 group-hover:text-[#D4AF37]" />
                        <span className="font-medium">{comp}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search filter in structure panel */}
          {blocks.length > 5 && (
            <div className="px-3 pt-3">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Filter sections..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          )}

          {/* Block List */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {blocks.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-white/10 rounded-xl bg-white/5 flex flex-col items-center justify-center">
                <LayoutTemplate size={24} className="text-gray-600 mb-2" />
                <p className="text-xs text-gray-500">No sections on this page.</p>
                <button 
                  onClick={() => setIsAddMenuOpen(true)}
                  className="mt-3 text-xs text-[#D4AF37] hover:underline font-semibold"
                >
                  + Add your first section
                </button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  {filteredBlocks.map(block => (
                    <SortableBlock 
                      key={block.id} 
                      block={block} 
                      isActive={activeBlockId === block.id}
                      onClick={() => {
                        setActiveBlockId(block.id);
                        if (isMobileOrTablet) setMobileTab('properties');
                      }}
                      onDelete={() => handleDeleteBlock(block.id)}
                      onToggleVisibility={() => handleToggleVisibility(block.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      )}

      {/* 2. Block Options Editor Drawer */}
      {activeBlock && (!isMobileOrTablet || mobileTab === 'properties') && (
        <div className={`${isMobileOrTablet ? 'w-full flex-1' : 'w-[380px]'} flex flex-col border-r border-white/10 bg-[#0e0e0e] flex-shrink-0 animate-fade-in shadow-2xl`}>
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              {isMobileOrTablet && (
                <button 
                  onClick={() => setMobileTab('sections')}
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-medium mr-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{activeBlock.type}</span>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Customize Properties</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleToggleVisibility(activeBlock.id)}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 font-medium transition-all ${
                  activeBlock.isHidden 
                    ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}
                title={activeBlock.isHidden ? "Click to show section" : "Click to hide section"}
              >
                {activeBlock.isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{activeBlock.isHidden ? 'Hidden' : 'Live'}</span>
              </button>
              <button 
                onClick={() => {
                  setActiveBlockId(null);
                  if (isMobileOrTablet) setMobileTab('sections');
                }}
                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors text-sm font-bold"
                title="Close Editor"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <BlockEditor 
              block={activeBlock} 
              onChange={(newProps) => handleUpdateBlockProps(activeBlock.id, newProps)} 
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
            
            {/* Device Switcher */}
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
                {/* iPhone Notch */}
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
                {/* iPad Camera */}
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
                {/* Mac Window Header */}
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

export default PageEditor;
