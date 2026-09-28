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
import { GripVertical, Trash2, Plus, LayoutTemplate, Monitor, Tablet, Smartphone, Eye, EyeOff } from 'lucide-react';
import BlockEditor from '../components/BlockEditor';

const SortableBlock = ({ block, isActive, onClick, onDelete, onToggleVisibility }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const isHidden = block.isHidden === true;

  return (
    <div ref={setNodeRef} style={style} 
      className={`group flex items-center gap-3 bg-white/5 border p-3 rounded-xl mb-3 cursor-pointer transition-all duration-200 
        ${isActive ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-white/10 hover:border-white/20'} 
        ${isDragging ? 'shadow-2xl opacity-90 scale-[1.02]' : ''}
        ${isHidden ? 'opacity-40 grayscale' : ''}`}
      onClick={onClick}
    >
      <div {...attributes} {...listeners} className="cursor-grab text-gray-500 hover:text-white p-1 -ml-1 rounded transition-colors">
        <GripVertical size={16} />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <LayoutTemplate size={12} className="text-[#D4AF37] opacity-80" />
          <h3 className="text-white text-sm font-medium tracking-wide truncate">{block.type}</h3>
          {isHidden && (
            <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded uppercase tracking-wider">Hidden</span>
          )}
        </div>
        <p className="text-gray-500 text-xs truncate">
          {Object.values(block.props || {}).find(v => typeof v === 'string' && v.length > 5 && !v.startsWith('http'))?.substring(0, 30) || "Empty block"}
        </p>
      </div>
      
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors" title={isHidden ? "Show Section" : "Hide Section"}>
          {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors" title="Delete">
          <Trash2 size={14} />
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
  
  const blocks = content.pages[pageId] || [];

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

  const handleAddBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      props: {}
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
    'Hero', 'PageHero', 'MarqueeTicker', 'StatsBar', 'InHouseAdvantage', 'AboutTeaser', 
    'ServicesTeaser', 'PillarsList', 'KolamDivider', 'RitualsScroll', 'FeaturedGallery', 
    'TestimonialsCarousel', 'ReviewsBar', 'CTABanner', 'SimpleCTA'
  ];

  const getPreviewWidth = () => {
    if (previewMode === 'mobile') return '375px';
    if (previewMode === 'tablet') return '768px';
    return '100%';
  };

  const previewUrl = pageId === 'home' ? 'http://localhost:5173/' : `http://localhost:5173/${pageId}`;

  return (
    <div className="flex h-screen overflow-hidden bg-black/20">
      
      {/* 1. Structure Panel */}
      <div className="w-[280px] flex flex-col border-r border-white/10 bg-[#0a0a0a] flex-shrink-0">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md">
          <div>
            <h2 className="text-lg font-serif text-white capitalize">{pageId}</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Structure</p>
          </div>
          <div className="relative">
            <button 
              className="btn btn-primary p-1.5"
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            >
              <Plus size={16} className={`transition-transform ${isAddMenuOpen ? 'rotate-45' : ''}`} />
            </button>
            
            {/* Add Section Dropdown */}
            {isAddMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 glass-panel p-2 z-50 animate-slide-up shadow-2xl border border-white/20">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1.5 mb-1 border-b border-white/10">Add Component</div>
                <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
                  {availableComponents.map(comp => (
                    <button key={comp} onClick={() => handleAddBlock(comp)} 
                      className="w-full text-left px-2 py-2 rounded-md hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                      <LayoutTemplate size={12} className="text-gray-500" />
                      {comp}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {blocks.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed border-white/10 rounded-xl bg-white/5 flex flex-col items-center justify-center">
              <LayoutTemplate size={24} className="text-gray-600 mb-2" />
              <p className="text-xs text-gray-500">Empty Page</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                {blocks.map(block => (
                  <SortableBlock 
                    key={block.id} 
                    block={block} 
                    isActive={activeBlockId === block.id}
                    onClick={() => setActiveBlockId(block.id)}
                    onDelete={() => handleDeleteBlock(block.id)}
                    onToggleVisibility={() => handleToggleVisibility(block.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* 2. Editor Panel */}
      {activeBlockId && activeBlock && (
        <div className="w-[360px] flex flex-col border-r border-white/10 bg-[#050505] flex-shrink-0 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>
          <div className="flex-1 overflow-y-auto custom-scrollbar animate-slide-up">
            <BlockEditor 
              block={activeBlock} 
              onChange={(newProps) => handleUpdateBlockProps(activeBlock.id, newProps)} 
            />
          </div>
        </div>
      )}

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
            {previewUrl}
          </div>
        </div>
        
        {/* Iframe Container with Realistic Device Frames */}
        <div className="flex-1 overflow-hidden flex justify-center items-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDkwOTA5Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMTExIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] p-4 md:p-8">
          
          {previewMode === 'mobile' && (
            <div className="relative w-full max-w-[375px] h-full max-h-[812px] bg-black rounded-[40px] md:rounded-[50px] shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[6px] md:border-[8px] border-[#1a1a1a] flex-shrink-0 transition-all duration-500 overflow-hidden">
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] md:w-[150px] h-[24px] md:h-[30px] bg-[#1a1a1a] rounded-b-2xl md:rounded-b-3xl z-20 flex justify-center items-center gap-2">
                <div className="w-8 md:w-12 h-1.5 md:h-2 rounded-full bg-[#0a0a0a]"></div>
                <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-[#0a0a0a] border border-[#2a2a2a]"></div>
              </div>
              <div className="w-full h-full bg-white relative z-10 pt-2 rounded-[34px] md:rounded-[42px] overflow-hidden">
                <iframe src={previewUrl} className="w-full h-full border-0" title="Live Preview" />
              </div>
            </div>
          )}

          {previewMode === 'tablet' && (
            <div className="relative w-full max-w-[768px] h-full max-h-[1024px] bg-black rounded-[30px] md:rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[10px] md:border-[14px] border-[#1a1a1a] flex-shrink-0 transition-all duration-500 overflow-hidden">
              {/* iPad Camera */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[15px] md:h-[20px] z-20 flex justify-center items-center">
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-[#2a2a2a] border border-[#000] mt-1"></div>
              </div>
              <div className="w-full h-full bg-white relative z-10 rounded-[20px] md:rounded-[26px] overflow-hidden">
                <iframe src={previewUrl} className="w-full h-full border-0" title="Live Preview" />
              </div>
            </div>
          )}

          {previewMode === 'desktop' && (
            <div className="relative w-full h-full bg-black rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-[4px] md:border-[8px] border-[#1a1a1a] flex flex-col flex-shrink-0 transition-all duration-500 overflow-hidden">
              {/* Mac Window Header */}
              <div className="h-6 md:h-8 bg-[#1a1a1a] w-full flex items-center px-3 md:px-4 gap-1.5 md:gap-2 z-20 border-b border-[#2a2a2a]">
                <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-red-500"></div>
                <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-green-500"></div>
                <div className="flex-1 text-center text-[#888] text-[8px] md:text-[10px] font-mono select-none tracking-widest truncate px-4">{previewUrl}</div>
              </div>
              <div className="w-full flex-1 bg-white relative z-10 overflow-hidden">
                <iframe src={previewUrl} className="w-full h-full border-0" title="Live Preview" />
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default PageEditor;
