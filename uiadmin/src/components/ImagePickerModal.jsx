import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, UploadCloud, RefreshCw, Check, Search, Plus, Image as ImageIcon } from 'lucide-react';
import { API } from '../apiConfig';

const ImagePickerModal = ({ isOpen, onClose, onSelect }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const fileInputRef = useRef(null);

  const getToken = () => localStorage.getItem('uiadminToken') || localStorage.getItem('adminToken');

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = getToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API}/api/images`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setImages(data);
      } else if (data && Array.isArray(data.images)) {
        setImages(data.images);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error('Failed to fetch images in picker:', err);
      setImages([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen, fetchImages]);

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    setErrorMsg(null);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const token = getToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        onSelect(data.url);
        onClose();
      } else if (data.error) {
        setErrorMsg(data.error);
      }
    } catch (err) {
      console.error("Upload failed in picker", err);
      setErrorMsg("Upload failed: " + err.message);
    }
    setIsUploading(false);
    if (e.target) e.target.value = '';
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelect(customUrl.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  const filteredImages = images.filter(img => {
    if (!searchQuery) return true;
    return img.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-2">
            <ImageIcon size={20} className="text-[#D4AF37]" />
            <h2 className="text-xl font-serif text-white">Select or Upload Image</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchImages}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Refresh Images"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-2 font-medium"
            >
              <UploadCloud size={15} />
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*" 
              onChange={handleUpload} 
            />
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white transition-colors ml-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Direct URL */}
        <div className="p-4 border-b border-white/10 bg-black/20 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter images by name or keyword..."
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <form onSubmit={handleApplyCustomUrl} className="flex gap-2">
            <input 
              type="url"
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              placeholder="Paste direct image URL..."
              className="w-60 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-[#D4AF37]"
            />
            <button 
              type="submit"
              disabled={!customUrl.trim()}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-40 flex items-center gap-1"
            >
              <Plus size={14} /> Use URL
            </button>
          </form>
        </div>

        {errorMsg && (
          <div className="px-4 py-2 bg-red-500/20 text-red-300 text-xs border-b border-red-500/30">
            {errorMsg}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-3"></div>
              <p className="text-xs">Loading media library...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
              <ImageIcon size={36} className="text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">No images found</p>
              <p className="text-xs text-gray-500 mt-1">Upload a photo from your computer or paste an external URL above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredImages.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    onSelect(img);
                    onClose();
                  }}
                  className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-square flex items-center justify-center cursor-pointer hover:border-[#D4AF37] hover:shadow-lg hover:shadow-yellow-900/10 transition-all"
                  title="Click to select this image"
                >
                  <img 
                    src={img} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    loading="lazy" 
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600';
                    }}
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 backdrop-blur-[2px]">
                    <div className="w-9 h-9 rounded-full bg-[#D4AF37] text-black flex items-center justify-center mb-1 shadow-md">
                      <Check size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-semibold text-white">Select</span>
                  </div>
                  
                  <p className="absolute bottom-0 left-0 right-0 bg-black/80 text-[9px] text-gray-300 p-1 truncate font-mono">
                    {img.split('/').pop()?.split('?')[0] || img}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePickerModal;
