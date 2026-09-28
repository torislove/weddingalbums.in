import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Type, List, Layout, Hash, Plus, Trash2, ChevronDown, ChevronRight, Palette, ToggleRight } from 'lucide-react';
import ImagePickerModal from './ImagePickerModal';

const isImageKey = (key, value) => {
  const k = key.toLowerCase();
  return k.includes('image') || k.includes('img') || k.includes('bg') || k.includes('logo') || (typeof value === 'string' && (value.startsWith('http') || value.startsWith('/images')));
};

const getIconForKey = (key, value) => {
  if (Array.isArray(value)) return <List size={14} className="text-blue-400" />;
  if (typeof value === 'number') return <Hash size={14} className="text-purple-400" />;
  if (typeof value === 'boolean') return <ToggleRight size={14} className="text-orange-400" />;
  if (key.toLowerCase().includes('color')) return <Palette size={14} className="text-pink-400" />;
  if (isImageKey(key, value)) return <ImageIcon size={14} className="text-emerald-400" />;
  return <Type size={14} className="text-gray-400" />;
};

const RecursiveField = ({ fieldKey, value, onChange, onUploadClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // String / Image / Color Field
  if (typeof value === 'string') {
    if (isImageKey(fieldKey, value)) {
      return (
        <div className="p-5 mb-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            {getIconForKey(fieldKey, value)}
            <label className="text-sm font-medium text-gray-300 capitalize tracking-wide">{fieldKey}</label>
          </div>
          
          <div className="flex flex-col gap-2">
            <input 
              type="text" 
              value={value || ''} 
              onChange={e => onChange(e.target.value)} 
              className="input-field font-mono text-xs w-full"
              placeholder="/images/example.jpg"
            />
            <button 
              onClick={() => onUploadClick(onChange)}
              className="btn bg-white/10 hover:bg-white/20 text-white w-full py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <ImageIcon size={16} className="text-emerald-400" /> Select / Upload Image
            </button>
          </div>
          
          {value && (
            <div className="mt-4 rounded-lg overflow-hidden border border-white/10 relative group bg-black/50 flex items-center justify-center min-h-[100px]">
              <img src={value} alt="" className="max-h-48 w-auto object-contain" />
            </div>
          )}
        </div>
      );
    }

    if (fieldKey.toLowerCase().includes('color')) {
      return (
        <div className="mb-5 flex items-center gap-4">
          <div className="flex items-center gap-2 ml-1 w-32">
            {getIconForKey(fieldKey, value)}
            <label className="text-sm font-medium text-gray-400 capitalize tracking-wide truncate">{fieldKey}</label>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="color" 
              value={value || '#ffffff'} 
              onChange={e => onChange(e.target.value)} 
              className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <input 
              type="text" 
              value={value || ''} 
              onChange={e => onChange(e.target.value)} 
              className="input-field flex-1 uppercase font-mono text-xs"
            />
          </div>
        </div>
      );
    }
    
    // Long Text
    if (value.length > 50 || fieldKey.toLowerCase().includes('desc') || fieldKey.toLowerCase().includes('subtitle') || fieldKey.toLowerCase().includes('quote')) {
      return (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2 ml-1">
            {getIconForKey(fieldKey, value)}
            <label className="text-sm font-medium text-gray-400 capitalize tracking-wide">{fieldKey}</label>
          </div>
          <textarea 
            value={value || ''} 
            onChange={e => onChange(e.target.value)} 
            className="input-field h-32 leading-relaxed resize-y"
          />
        </div>
      );
    }
    
    // Short text
    return (
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2 ml-1">
          {getIconForKey(fieldKey, value)}
          <label className="text-sm font-medium text-gray-400 capitalize tracking-wide">{fieldKey}</label>
        </div>
        <input 
          type="text" 
          value={value || ''} 
          onChange={e => onChange(e.target.value)} 
          className="input-field"
        />
      </div>
    );
  }
  
  // Number field
  if (typeof value === 'number') {
    return (
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2 ml-1">
          {getIconForKey(fieldKey, value)}
          <label className="text-sm font-medium text-gray-400 capitalize tracking-wide">{fieldKey}</label>
        </div>
        <input 
          type="number" 
          value={value} 
          onChange={e => onChange(Number(e.target.value))} 
          className="input-field"
        />
      </div>
    );
  }

  // Boolean field
  if (typeof value === 'boolean') {
    return (
      <div className="mb-5 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between cursor-pointer hover:border-white/20 transition-colors" onClick={() => onChange(!value)}>
        <div className="flex items-center gap-3">
          {getIconForKey(fieldKey, value)}
          <label className="text-sm font-medium text-gray-300 capitalize tracking-wide cursor-pointer">{fieldKey}</label>
        </div>
        <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${value ? 'bg-[#D4AF37]' : 'bg-black/50 border border-white/10'}`}>
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
      </div>
    );
  }

  // Object Field (Nested)
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return (
      <div className="mb-4 p-4 border border-white/5 rounded-lg bg-black/40">
        <div 
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
            <label className="text-sm font-semibold text-gray-300 capitalize tracking-wide cursor-pointer">{fieldKey}</label>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pl-2 border-l border-white/10 space-y-2">
            {Object.keys(value).map(subKey => (
              <RecursiveField 
                key={subKey} 
                fieldKey={subKey} 
                value={value[subKey]} 
                onChange={(newVal) => onChange({ ...value, [subKey]: newVal })} 
                onUploadClick={onUploadClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Array (List)
  if (Array.isArray(value)) {
    return (
      <div className="mb-6 p-6 border border-white/10 rounded-xl bg-black/20 shadow-inner">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
          {getIconForKey(fieldKey, value)}
          <label className="text-sm font-semibold text-[#D4AF37] capitalize tracking-wider">{fieldKey} <span className="text-gray-500 font-normal ml-1">({value.length} items)</span></label>
        </div>
        
        <div className="space-y-4 mb-4">
          {value.map((item, index) => (
            <div key={index} className="p-4 bg-white/5 border border-white/5 rounded-lg relative group">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-black/40 px-2 py-1 rounded">Item {index + 1}</span>
                <button 
                  onClick={() => {
                    const newArr = [...value];
                    newArr.splice(index, 1);
                    onChange(newArr);
                  }}
                  className="text-red-400/50 hover:text-red-400 text-xs p-1.5 rounded hover:bg-red-400/10 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
              
              {/* Recursive call for array item */}
              {typeof item === 'object' && item !== null ? (
                <div className="space-y-4">
                  {Object.keys(item).map(subKey => (
                    <RecursiveField 
                      key={subKey} 
                      fieldKey={subKey} 
                      value={item[subKey]} 
                      onChange={(newVal) => {
                        const newArr = [...value];
                        newArr[index] = { ...newArr[index], [subKey]: newVal };
                        onChange(newArr);
                      }} 
                      onUploadClick={onUploadClick}
                    />
                  ))}
                </div>
              ) : (
                <RecursiveField 
                  fieldKey={`Item ${index + 1}`} 
                  value={item} 
                  onChange={(newVal) => {
                    const newArr = [...value];
                    newArr[index] = newVal;
                    onChange(newArr);
                  }} 
                  onUploadClick={onUploadClick}
                />
              )}
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => {
            const newItem = value.length > 0 ? (typeof value[0] === 'string' ? '' : Object.keys(value[0]).reduce((acc, k) => ({...acc, [k]: ''}), {})) : '';
            onChange([...value, newItem]);
          }}
          className="w-full py-2.5 rounded-lg border border-dashed border-white/20 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/40 transition-all text-sm font-medium flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Item to {fieldKey}
        </button>
      </div>
    );
  }
  
  return null;
};

const BlockEditor = ({ block, onChange }) => {
  const [pickerState, setPickerState] = useState({ isOpen: false, callback: null });

  const handleUploadClick = (callback) => {
    setPickerState({ isOpen: true, callback });
  };

  return (
    <div className="p-5 pb-32">
      <div className="flex items-start gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#996515] flex items-center justify-center shadow-lg shadow-yellow-900/20 flex-shrink-0">
          <Layout size={20} className="text-black" />
        </div>
        <div className="overflow-hidden">
          <div className="text-[10px] text-[#D4AF37] font-semibold tracking-widest uppercase mb-0.5">Component Settings</div>
          <h2 className="text-xl font-serif text-white truncate">{block.type}</h2>
        </div>
      </div>
      
      <div className="space-y-2">
        {Object.keys(block.props).map(key => (
          <RecursiveField 
            key={key} 
            fieldKey={key} 
            value={block.props[key]} 
            onChange={(newVal) => onChange({ ...block.props, [key]: newVal })} 
            onUploadClick={handleUploadClick}
          />
        ))}
      </div>
      
      <ImagePickerModal 
        isOpen={pickerState.isOpen}
        onClose={() => setPickerState({ isOpen: false, callback: null })}
        onSelect={(url) => {
          if (pickerState.callback) {
            pickerState.callback(url);
          }
        }}
      />
    </div>
  );
};

export default BlockEditor;
