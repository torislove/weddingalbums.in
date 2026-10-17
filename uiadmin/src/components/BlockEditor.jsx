import React, { useState } from 'react';
import { 
  UploadCloud, Image as ImageIcon, Type, List, Layout, Hash, Plus, Trash2, 
  ChevronDown, ChevronRight, Palette, ToggleRight, Eye, EyeOff, Search 
} from 'lucide-react';
import ImagePickerModal from './ImagePickerModal';

const isImageKey = (key, value) => {
  const k = key.toLowerCase();
  return (
    k.includes('image') || 
    k.includes('img') || 
    k.includes('bg') || 
    k.includes('logo') || 
    k.includes('cover') ||
    (typeof value === 'string' && (value.startsWith('http') || value.startsWith('/images')))
  );
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
        <div className="p-4 mb-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
          <div className="flex items-center gap-2 mb-2.5">
            {getIconForKey(fieldKey, value)}
            <label className="text-xs font-semibold text-gray-300 capitalize tracking-wide">{fieldKey}</label>
          </div>
          
          <div className="flex flex-col gap-2">
            <input 
              type="text" 
              value={value || ''} 
              onChange={e => onChange(e.target.value)} 
              className="input-field font-mono text-xs w-full"
              placeholder="/images/example.jpg or https://..."
            />
            <button 
              type="button"
              onClick={() => onUploadClick(onChange)}
              className="btn bg-white/10 hover:bg-white/20 text-white w-full py-2 rounded-lg text-xs font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <ImageIcon size={15} className="text-emerald-400" /> Select / Upload Image
            </button>
          </div>
          
          {value && (
            <div className="mt-3 rounded-lg overflow-hidden border border-white/10 relative group bg-black/60 flex items-center justify-center min-h-[90px] p-2">
              <img 
                src={value} 
                alt="" 
                className="max-h-40 w-auto object-contain rounded" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      );
    }

    if (fieldKey.toLowerCase().includes('color')) {
      return (
        <div className="mb-4 flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 flex-1">
            {getIconForKey(fieldKey, value)}
            <label className="text-xs font-semibold text-gray-300 capitalize tracking-wide">{fieldKey}</label>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="color" 
              value={value || 'var(--paper)'} 
              onChange={e => onChange(e.target.value)} 
              className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <input 
              type="text" 
              value={value || ''} 
              onChange={e => onChange(e.target.value)} 
              className="input-field w-24 uppercase font-mono text-xs text-center"
            />
          </div>
        </div>
      );
    }
    
    // Multiline Textarea for longer text
    if (value.length > 50 || fieldKey.toLowerCase().includes('desc') || fieldKey.toLowerCase().includes('subtitle') || fieldKey.toLowerCase().includes('quote') || fieldKey.toLowerCase().includes('paragraph')) {
      return (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1.5 ml-0.5">
            {getIconForKey(fieldKey, value)}
            <label className="text-xs font-semibold text-gray-300 capitalize tracking-wide">{fieldKey}</label>
          </div>
          <textarea 
            value={value || ''} 
            onChange={e => onChange(e.target.value)} 
            className="input-field h-28 leading-relaxed resize-y text-xs"
            placeholder={`Enter ${fieldKey}...`}
          />
        </div>
      );
    }
    
    // Standard Short text input
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1.5 ml-0.5">
          {getIconForKey(fieldKey, value)}
          <label className="text-xs font-semibold text-gray-300 capitalize tracking-wide">{fieldKey}</label>
        </div>
        <input 
          type="text" 
          value={value || ''} 
          onChange={e => onChange(e.target.value)} 
          className="input-field text-xs"
          placeholder={`Enter ${fieldKey}...`}
        />
      </div>
    );
  }
  
  // Number field
  if (typeof value === 'number') {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1.5 ml-0.5">
          {getIconForKey(fieldKey, value)}
          <label className="text-xs font-semibold text-gray-300 capitalize tracking-wide">{fieldKey}</label>
        </div>
        <input 
          type="number" 
          value={value} 
          onChange={e => onChange(Number(e.target.value))} 
          className="input-field text-xs"
        />
      </div>
    );
  }

  // Boolean field
  if (typeof value === 'boolean') {
    return (
      <div 
        className="mb-4 p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between cursor-pointer hover:border-white/20 transition-colors" 
        onClick={() => onChange(!value)}
      >
        <div className="flex items-center gap-2.5">
          {getIconForKey(fieldKey, value)}
          <label className="text-xs font-semibold text-gray-300 capitalize tracking-wide cursor-pointer">{fieldKey}</label>
        </div>
        <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${value ? 'bg-[var(--brand)]' : 'bg-black/60 border border-white/10'}`}>
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </div>
      </div>
    );
  }

  // Object Field (Nested Properties)
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return (
      <div className="mb-4 border border-white/10 rounded-xl bg-black/40 overflow-hidden">
        <div 
          className="flex items-center justify-between cursor-pointer p-3 bg-white/5 hover:bg-white/10 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            {isExpanded ? <ChevronDown size={14} className="text-[var(--brand)]" /> : <ChevronRight size={14} className="text-gray-400" />}
            <label className="text-xs font-semibold text-gray-200 capitalize tracking-wide cursor-pointer">{fieldKey}</label>
          </div>
          <span className="text-[10px] text-gray-500">{Object.keys(value).length} sub-fields</span>
        </div>
        
        {isExpanded && (
          <div className="p-3 border-t border-white/10 space-y-2 bg-black/20">
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

  // Array / List Field with Item-Level Eye Visibility Controls
  if (Array.isArray(value)) {
    return (
      <div className="mb-5 p-4 border border-white/10 rounded-xl bg-black/30 shadow-inner">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            {getIconForKey(fieldKey, value)}
            <label className="text-xs font-bold text-[var(--brand)] capitalize tracking-wider">
              {fieldKey}
            </label>
          </div>
          <span className="text-[11px] text-gray-400 font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            {value.length} items
          </span>
        </div>
        
        <div className="space-y-3 mb-3">
          {value.map((item, index) => {
            const isItemHidden = typeof item === 'object' && item !== null ? Boolean(item.isHidden) : false;

            return (
              <div 
                key={index} 
                className={`p-3.5 rounded-xl border transition-all ${
                  isItemHidden 
                    ? 'border-red-500/25 bg-red-950/10 opacity-60' 
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {/* Item header with item-level Eye Toggle and Remove button */}
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded">
                      Item {index + 1}
                    </span>
                    {isItemHidden && (
                      <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider border border-red-500/30">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Item-level Eye Toggle Button */}
                    <button 
                      type="button"
                      onClick={() => {
                        const newArr = [...value];
                        if (typeof item === 'object' && item !== null) {
                          newArr[index] = { ...item, isHidden: !isItemHidden };
                        } else {
                          // For primitive items, wrap into object or toggle
                          newArr[index] = { value: item, isHidden: !isItemHidden };
                        }
                        onChange(newArr);
                      }}
                      className={`text-xs px-2 py-1 rounded-md transition-all flex items-center gap-1 font-medium ${
                        isItemHidden 
                          ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30' 
                          : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/15 border border-white/10'
                      }`}
                      title={isItemHidden ? "Item is hidden from site. Click to show" : "Item is live on site. Click to hide"}
                    >
                      {isItemHidden ? <EyeOff size={13} /> : <Eye size={13} className="text-[var(--brand)]" />}
                      <span className="text-[10px]">{isItemHidden ? 'Hidden' : 'Live'}</span>
                    </button>

                    {/* Delete Item Button */}
                    <button 
                      type="button"
                      onClick={() => {
                        const newArr = [...value];
                        newArr.splice(index, 1);
                        onChange(newArr);
                      }}
                      className="text-gray-500 hover:text-red-400 text-xs p-1 rounded hover:bg-red-400/10 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                
                {/* Recursive fields for array item */}
                {typeof item === 'object' && item !== null ? (
                  <div className="space-y-2">
                    {Object.keys(item)
                      .filter(subKey => subKey !== 'isHidden')
                      .map(subKey => (
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
                    fieldKey={`Value`} 
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
            );
          })}
        </div>
        
        {/* Add item button */}
        <button 
          type="button"
          onClick={() => {
            let newItem = '';
            if (value.length > 0) {
              const first = value[0];
              if (typeof first === 'object' && first !== null) {
                newItem = Object.keys(first).reduce((acc, k) => {
                  acc[k] = k === 'isHidden' ? false : (typeof first[k] === 'number' ? 0 : '');
                  return acc;
                }, {});
              }
            }
            onChange([...value, newItem]);
          }}
          className="w-full py-2.5 rounded-xl border border-dashed border-white/20 text-gray-300 hover:text-white hover:bg-white/5 hover:border-[var(--brand)]/50 transition-all text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Plus size={15} className="text-[var(--brand)]" /> Add Item to {fieldKey}
        </button>
      </div>
    );
  }
  
  return null;
};

const BlockEditor = ({ block, onChange }) => {
  const [pickerState, setPickerState] = useState({ isOpen: false, callback: null });
  const [fieldSearch, setFieldSearch] = useState('');

  const handleUploadClick = (callback) => {
    setPickerState({ isOpen: true, callback });
  };

  const propsKeys = Object.keys(block.props || {});
  const filteredKeys = propsKeys.filter(k => {
    if (!fieldSearch) return true;
    return k.toLowerCase().includes(fieldSearch.toLowerCase());
  });

  return (
    <div className="p-4 pb-32">
      {/* Component Title & Options Counter */}
      <div className="flex items-start gap-3 mb-5 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#996515] flex items-center justify-center shadow-lg shadow-yellow-900/20 flex-shrink-0">
          <Layout size={20} className="text-black" />
        </div>
        <div className="overflow-hidden flex-1">
          <div className="text-[10px] text-[var(--brand)] font-bold tracking-widest uppercase mb-0.5">Component Editor</div>
          <h2 className="text-lg font-serif text-white truncate">{block.type}</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">{propsKeys.length} customizable settings</p>
        </div>
      </div>

      {/* Field Search if block has many options */}
      {propsKeys.length > 4 && (
        <div className="mb-4">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text"
              value={fieldSearch}
              onChange={e => setFieldSearch(e.target.value)}
              placeholder="Search properties (e.g. title, image)..."
              className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand)]"
            />
          </div>
        </div>
      )}
      
      {/* Fields List */}
      <div className="space-y-1">
        {filteredKeys.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            No properties match "{fieldSearch}"
          </div>
        ) : (
          filteredKeys.map(key => (
            <RecursiveField 
              key={key} 
              fieldKey={key} 
              value={block.props[key]} 
              onChange={(newVal) => onChange({ ...block.props, [key]: newVal })} 
              onUploadClick={handleUploadClick}
            />
          ))
        )}
      </div>
      
      {/* Integrated Image Picker Modal */}
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
