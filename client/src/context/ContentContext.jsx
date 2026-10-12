import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ContentContext = createContext(null);

const isValidContent = (data) => {
  return Boolean(
    data &&
    typeof data === 'object' &&
    data.pages &&
    typeof data.pages === 'object' &&
    Object.keys(data.pages).length > 0 &&
    Array.isArray(data.pages.home) &&
    data.pages.home.length > 0
  );
};

export const ContentProvider = ({ children }) => {
  // Try initializing with cached content from localStorage for instant, flicker-free rendering
  const [content, setContent] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_site_content');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (isValidContent(parsed)) return parsed;
      }
    } catch { /* ignore cache parse error */ }
    return null;
  });

  const [loading, setLoading] = useState(() => !content);

  const loadContent = useCallback(async () => {
    let resolvedContent = null;

    // 1. First Tier: Fetch dynamic published content from Server API
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (isValidContent(data)) {
          resolvedContent = data;
        }
      }
    } catch (apiErr) {
      console.warn('API content fetch notice (will fallback to CDN):', apiErr.message);
    }

    // 2. Second Tier: Fallback to static CDN content.json
    if (!resolvedContent) {
      try {
        const cdnRes = await fetch('/content.json');
        if (cdnRes.ok) {
          const cdnData = await cdnRes.json();
          if (isValidContent(cdnData)) {
            resolvedContent = cdnData;
          }
        }
      } catch (cdnErr) {
        console.warn('CDN static content fetch notice:', cdnErr.message);
      }
    }

    // 3. Third Tier: Fallback to cached localStorage content
    if (!resolvedContent) {
      try {
        const cached = localStorage.getItem('cached_site_content');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (isValidContent(parsed)) {
            resolvedContent = parsed;
          }
        }
      } catch { /* ignore */ }
    }

    if (resolvedContent) {
      setContent(resolvedContent);
      try {
        localStorage.setItem('cached_site_content', JSON.stringify(resolvedContent));
      } catch { /* storage full */ }
    } else if (!content) {
      // Graceful fallback empty structure if all tiers failed
      setContent({ pages: {}, global: {} });
    }

    setLoading(false);
  }, [content]);

  useEffect(() => {
    loadContent();

    // Listen for live preview updates from the Admin Panel CMS via BroadcastChannel
    let channel;
    try {
      channel = new BroadcastChannel('cms-preview');
      channel.onmessage = (event) => {
        if (event.data && event.data.type === 'PREVIEW_UPDATE' && event.data.content) {
          setContent(event.data.content);
        }
      };
    } catch { /* BroadcastChannel not supported */ }

    // Also listen for postMessage from parent iframe (for embedded CMS preview mode)
    const handlePostMessage = (event) => {
      if (event.data && event.data.type === 'CMS_LIVE_PREVIEW' && event.data.content) {
        setContent(event.data.content);
      }
    };
    window.addEventListener('message', handlePostMessage);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('message', handlePostMessage);
    };
  }, [loadContent]);

  if (loading && !content) {
    return (
      <div
        className="loading-screen"
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050505',
          color: '#D4AF37',
          fontFamily: "'Playfair Display', Georgia, serif",
          gap: 16
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontSize: 18, letterSpacing: 2 }}>Loading Cinematic Weddings...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const contextValue = {
    content,
    global: content?.global || {},
    pages: content?.pages || {},
    reload: loadContent,
    setContent
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export default ContentContext;
