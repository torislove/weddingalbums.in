import React, { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Copy, Check, UploadCloud, RefreshCw, Plus, Search, ExternalLink } from 'lucide-react';
import { API } from '../apiConfig';

const MediaLibrary = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const getToken = () => localStorage.getItem('uiadminToken') || localStorage.getItem('adminToken');

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = getToken();
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`${API}/api/images`, { headers });
      if (!res.ok) {
        throw new Error(`Failed to load media (HTTP ${res.status})`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setImages(data);
      } else if (data && Array.isArray(data.images)) {
        setImages(data.images);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
      setErrorMsg(err.message || 'Could not load images');
      setImages([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

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
        setImages(prev => [data.url, ...prev]);
        setCopiedUrl(data.url);
        setTimeout(() => setCopiedUrl(null), 2000);
      } else if (data.error) {
        setErrorMsg(data.error);
      }
      // Refresh library to ensure persistence
      fetchImages();
    } catch (err) {
      console.error("Upload failed", err);
      setErrorMsg("Upload failed: " + err.message);
    }
    setIsUploading(false);
    e.target.value = '';
  };

  const handleAddCustomUrl = async (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    const urlToAdd = customUrl.trim();
    setIsAddingUrl(true);
    setErrorMsg(null);
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      const res = await fetch(`${API}/api/images/add-url`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url: urlToAdd })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setImages(prev => [data.url, ...prev]);
        setCustomUrl('');
      } else {
        // Fallback: add locally to current state
        setImages(prev => [urlToAdd, ...prev]);
        setCustomUrl('');
      }
    } catch {
      setImages(prev => [urlToAdd, ...prev]);
      setCustomUrl('');
    }
    setIsAddingUrl(false);
  };

  const filteredImages = images.filter(img => {
    if (!searchQuery) return true;
    return img.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-8 max-w-7xl mx-auto pb-32 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#996515] flex items-center justify-center shadow-lg shadow-yellow-900/20">
            <ImageIcon size={24} className="text-black" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-white">Media Library</h2>
            <p className="text-sm text-gray-400 mt-1">Manage public catalog and uploaded images ({images.length} available)</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={fetchImages}
            aria-label="Refresh media library"
            disabled={loading}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Library"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          
          <label className="btn btn-primary cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-md">
            <UploadCloud size={18} />
            {isUploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      {/* Toolbar: Search & Add URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search images by name or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>

        <form onSubmit={handleAddCustomUrl} className="flex gap-2">
          <input 
            type="url"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            placeholder="Or paste external image URL..."
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--brand)] transition-colors font-mono text-xs"
          />
          <button 
            type="submit"
            disabled={!customUrl.trim() || isAddingUrl}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40 flex items-center gap-1.5"
          >
            <Plus size={16} /> Add URL
          </button>
        </form>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white font-bold ml-4">✕</button>
        </div>
      )}

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
          <div className="w-10 h-10 border-4 border-white/10 border-t-[var(--brand)] rounded-full animate-spin mb-4"></div>
          <p className="text-sm">Loading media library...</p>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center p-16 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
          <ImageIcon size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No Images Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            {searchQuery ? 'No images matching your search query. Try another keyword.' : 'Upload an image or paste a link to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((img, i) => (
            <div 
              key={i} 
              className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-[4/3] flex items-center justify-center hover:border-[var(--brand)]/50 transition-all shadow-md"
            >
              <img 
                src={img} 
                alt="" 
                className="max-w-full max-h-full object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                loading="lazy" 
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800';
                }}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2 backdrop-blur-sm">
                <p className="text-[10px] text-gray-300 font-mono text-center break-all line-clamp-2 px-1">
                  {img.split('/').pop()?.split('?')[0] || img}
                </p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCopy(img)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${copiedUrl === img ? 'bg-emerald-500 text-black font-semibold' : 'bg-white/10 text-white hover:bg-[var(--brand)] hover:text-black border border-white/20'}`}
                    title="Copy URL"
                  >
                    {copiedUrl === img ? <Check size={14} /> : <Copy size={14} />}
                    {copiedUrl === img ? 'Copied!' : 'Copy'}
                  </button>

                  <a 
                    href={img} 
                    target="_blank" 
                    rel="noreferrer"
                    aria-label={`Open ${img.split('/').pop()?.split('?')[0] || 'image'} in a new tab`}
                    className="p-1.5 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 border border-white/20"
                    title="Open in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
