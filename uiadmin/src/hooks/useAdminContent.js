import { useState, useEffect, useRef, useCallback } from 'react';

const isContentComplete = (data) => {
  return Boolean(
    data &&
    data.pages &&
    typeof data.pages === 'object' &&
    Object.keys(data.pages).length > 0 &&
    Array.isArray(data.pages.home) &&
    data.pages.home.length > 0
  );
};

export const useAdminContent = (token) => {
  const [content, setContent] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const channelRef = useRef(null);

  const broadcastPreview = useCallback((newContent) => {
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({ type: 'PREVIEW_UPDATE', content: newContent });
      } catch { /* channel error */ }
    }
    // Also postMessage to any iframes on the page
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        iframe.contentWindow?.postMessage({ type: 'CMS_LIVE_PREVIEW', content: newContent }, '*');
      } catch { /* ignore cross-origin if blocked */ }
    });
  }, []);

  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('cms-preview');
    } catch { /* ignore */ }

    const fetchInitialContent = async () => {
      let resolved = null;

      // 1. Fetch from server API
      try {
        const res = await fetch('/api/content', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isContentComplete(data)) {
            resolved = data;
          }
        }
      } catch (err) {
        console.warn('CMS failed to fetch from /api/content:', err.message);
      }

      // 2. Fallback to client CDN content.json
      if (!resolved) {
        try {
          const cdnRes = await fetch('https://weddingalbums-b4bcd.web.app/content.json');
          if (cdnRes.ok) {
            const cdnData = await cdnRes.json();
            if (isContentComplete(cdnData)) {
              resolved = cdnData;
            }
          }
        } catch { /* ignore */ }
      }

      // 3. Fallback to local /content.json if running in dev
      if (!resolved) {
        try {
          const localRes = await fetch('/content.json');
          if (localRes.ok) {
            const localData = await localRes.json();
            if (isContentComplete(localData)) {
              resolved = localData;
            }
          }
        } catch { /* ignore */ }
      }

      if (resolved) {
        setContent(resolved);
      } else {
        setContent({ pages: { home: [], about: [], services: [] }, global: {} });
      }
      setIsDirty(false);
    };

    fetchInitialContent();

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, []);

  const updatePage = (pageId, newBlocks) => {
    setContent(prev => {
      const base = prev || { pages: {}, global: {} };
      const newContent = {
        ...base,
        pages: {
          ...(base.pages || {}),
          [pageId]: newBlocks
        }
      };
      broadcastPreview(newContent);
      return newContent;
    });
    setIsDirty(true);
  };

  const updateGlobal = (section, newData) => {
    setContent(prev => {
      const base = prev || { pages: {}, global: {} };
      const newContent = {
        ...base,
        global: {
          ...(base.global || {}),
          [section]: newData
        }
      };
      broadcastPreview(newContent);
      return newContent;
    });
    setIsDirty(true);
  };

  const setContentState = (newContent) => {
    setContent(newContent);
    broadcastPreview(newContent);
    setIsDirty(true);
  };

  const saveContent = async () => {
    if (!content) return false;
    setSaving(true);
    const activeToken = token || localStorage.getItem('uiadminToken') || localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        setIsDirty(false);
        broadcastPreview(content);
        setSaving(false);
        return true;
      }
      const errJson = await res.json().catch(() => ({}));
      console.error('Server rejected CMS save:', errJson);
    } catch (err) {
      console.error('Failed to save content to server:', err);
    }
    setSaving(false);
    return false;
  };

  return { content, setContent: setContentState, updatePage, updateGlobal, saveContent, isDirty, setIsDirty, saving };
};
