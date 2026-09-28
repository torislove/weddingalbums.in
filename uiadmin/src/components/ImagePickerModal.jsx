import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, RefreshCw, Check } from 'lucide-react';

const ImagePickerModal = ({ isOpen, onClose, onSelect }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error('Failed to fetch images', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        onSelect(data.url);
        onClose();
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
    setIsUploading(false);
    if (e.target) e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
          <h2 className="text-xl font-serif text-white">Select Image</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchImages}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn btn-primary text-sm py-1.5 px-3 flex items-center gap-2"
            >
              <UploadCloud size={16} />
              {isUploading ? 'Uploading...' : 'Upload New'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*" 
              onChange={handleUpload} 
            />
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors ml-2">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="w-8 h-8 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-4"></div>
              Loading...
            </div>
          ) : images.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p>No images found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    onSelect(img);
                    onClose();
                  }}
                  className="group relative rounded-lg overflow-hidden border border-white/10 bg-black/40 aspect-square flex items-center justify-center cursor-pointer hover:border-[#D4AF37] transition-all"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Check size={24} className="text-[#D4AF37]" />
                  </div>
                  <p className="absolute bottom-0 left-0 right-0 bg-black/80 text-[10px] text-white p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">{img.split('/').pop()}</p>
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
