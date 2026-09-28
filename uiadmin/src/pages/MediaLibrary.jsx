import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Copy, Check, UploadCloud, RefreshCw } from 'lucide-react';

const MediaLibrary = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
    fetchImages();
  }, []);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      // Refresh library
      fetchImages();
    } catch (err) {
      console.error("Upload failed", err);
    }
    setIsUploading(false);
    e.target.value = '';
  };

  return (
    <div className="p-10 max-w-7xl mx-auto pb-32 animate-slide-up">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#996515] flex items-center justify-center shadow-lg shadow-yellow-900/20">
            <ImageIcon size={24} className="text-black" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-white">Media Library</h2>
            <p className="text-sm text-gray-400 mt-1">Manage all public and uploaded images</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchImages}
            disabled={loading}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <label className="btn btn-primary cursor-pointer flex items-center gap-2">
            <UploadCloud size={20} />
            {isUploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-500">
          <div className="w-10 h-10 border-4 border-white/10 border-t-[#D4AF37] rounded-full animate-spin mb-4"></div>
          Loading media library...
        </div>
      ) : images.length === 0 ? (
        <div className="text-center p-16 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
          <ImageIcon size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No Images Found</h3>
          <p className="text-gray-500">Upload some images to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {images.map((img, i) => (
            <div key={i} className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-[4/3] flex items-center justify-center">
              <img src={img} alt="" className="max-w-full max-h-full object-contain" loading="lazy" />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                <p className="text-xs text-gray-300 font-mono mb-4 text-center break-all">{img.split('/').pop()}</p>
                
                <button 
                  onClick={() => handleCopy(img)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${copiedUrl === img ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-white/10 text-white hover:bg-[#D4AF37] hover:text-black border border-white/20'}`}
                >
                  {copiedUrl === img ? <Check size={16} /> : <Copy size={16} />}
                  {copiedUrl === img ? 'Copied URL!' : 'Copy URL'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
