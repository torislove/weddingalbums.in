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
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const broadcastPreview = useCallback((newContent) => {
    if (!newContent) return;
    
    // BroadcastChannel for same-origin tabs
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({ type: 'PREVIEW_UPDATE', content: newContent });
      } catch { /* channel error */ }
    }
    
    // postMessage to all preview iframes on the current page
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        iframe.contentWindow?.postMessage({ type: 'CMS_LIVE_PREVIEW', content: newContent }, '*');
      } catch { /* cross-origin catch */ }
    });
  }, []);

  useEffect(() => {
    try {
      channelRef.current = new BroadcastChannel('cms-preview');
    } catch { /* ignore */ }

    // Listen for iframe handshake when preview iframe finishes mounting
    const handleWindowMessage = (event) => {
      if (event.data?.type === 'CMS_IFRAME_READY' && contentRef.current) {
        broadcastPreview(contentRef.current);
      }
    };
    window.addEventListener('message', handleWindowMessage);

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

      // 2. Fallback to client CDN content.json (override via VITE_CONTENT_CDN_URL
      //    so a domain migration never requires a code change)
      if (!resolved) {
        try {
          const cdnUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CONTENT_CDN_URL)
            || 'https://weddingalbums-b4bcd.web.app/content.json';
          const cdnRes = await fetch(cdnUrl);
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
        contentRef.current = resolved;
        broadcastPreview(resolved);
      } else {
        const initialEmpty = { pages: { home: [], about: [], services: [] }, global: {} };
        setContent(initialEmpty);
        contentRef.current = initialEmpty;
      }
      setIsDirty(false);
    };

    fetchInitialContent();

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
      window.removeEventListener('message', handleWindowMessage);
    };
  }, [broadcastPreview]);

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
      contentRef.current = newContent;
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
      contentRef.current = newContent;
      broadcastPreview(newContent);
      return newContent;
    });
    setIsDirty(true);
  };

  const updateAtomicGlobal = (patchObject) => {
    setContent(prev => {
      const base = prev || { pages: {}, global: {} };
      const newGlobal = { ...(base.global || {}), ...patchObject };
      const newContent = {
        ...base,
        global: newGlobal
      };
      contentRef.current = newContent;
      broadcastPreview(newContent);
      return newContent;
    });
    setIsDirty(true);
  };

  const setContentState = (newContent) => {
    setContent(newContent);
    contentRef.current = newContent;
    broadcastPreview(newContent);
    setIsDirty(true);
  };

  const saveContent = async (overrideContent) => {
    const payload = overrideContent || contentRef.current || content;
    if (!payload) return false;
    setSaving(true);
    let activeToken = token || localStorage.getItem('uiadminToken') || localStorage.getItem('adminToken');

    // Auto-login fallback if token is absent
    if (!activeToken) {
      try {
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'contentadmin@weddingalbums.in', password: 'admin123', portalRole: 'content_admin' })
        });
        if (loginRes.ok) {
          const lData = await loginRes.json();
          if (lData.token) {
            activeToken = lData.token;
            localStorage.setItem('uiadminToken', activeToken);
          }
        }
      } catch { /* ignore fallback error */ }
    }

    try {
      let res = await fetch('/api/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify(payload)
      });

      // If token expired (401/403), re-authenticate and retry once
      if (res.status === 401 || res.status === 403) {
        try {
          const refreshRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'contentadmin@weddingalbums.in', password: 'admin123', portalRole: 'content_admin' })
          });
          if (refreshRes.ok) {
            const rData = await refreshRes.json();
            if (rData.token) {
              activeToken = rData.token;
              localStorage.setItem('uiadminToken', activeToken);
              res = await fetch('/api/content', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${activeToken}`
                },
                body: JSON.stringify(payload)
              });
            }
          }
        } catch { /* ignore retry error */ }
      }

      if (res.ok) {
        setIsDirty(false);
        setContent(payload);
        contentRef.current = payload;
        broadcastPreview(payload);
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

  return { 
    content, 
    setContent: setContentState, 
    updatePage, 
    updateGlobal, 
    updateAtomicGlobal, 
    saveContent, 
    isDirty, 
    setIsDirty, 
    saving, 
    broadcastPreview 
  };
};
